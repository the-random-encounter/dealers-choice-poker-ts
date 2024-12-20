import Player from "./Player";
import Deck from './Deck';
import Card from "./Card";
import Hand from './Hand';
import Phaser, { Scene } from 'phaser';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';
import { GameConfig, Board, GameState } from '../utils/types';
import { Game } from '../scenes/Game';

const c = CONSTS;

export default class Table {

  tableID: number;
  tableName: string;
  gameScene: Scene;
  players: Player[] = [];
  dealer: Player;
  smallBlind: Player;
  bigBlind: Player;
  pot: number = 0;
  sidePots?: number[];
  deck: Deck;
  board: Board = { flops: [], turns: [], rivers: [] };
  gameConfig: GameConfig;
  burnPile: Card[] = [];
  dealOrder: Array<Array<Player | string>>;
  gameState: GameState = GameState.IDLE;
  currentBet: number = 0;
  activePlayerIndex: number = 0;
  betMade: boolean = false;
  resolvedBetPlayers: Player[] = [];
  
  smallBlindAmount: number = 5;
  bigBlindAmount: number = 10;
  
  dealerToken: number = 0;
  smallBlindToken: number = 0;
  bigBlindToken: number = this.smallBlindToken + 1;

  constructor(tableName: string, config: GameConfig, gameScene: Scene, smallBlindAmount = 5, bigBlingAmount = 10) {
    this.tableName = tableName;
    this.tableID = this.generateTableID();
    this.gameConfig = config;
    this.gameScene = gameScene;
    this.deck = new Deck(this.gameScene, true);
    this.smallBlindAmount = smallBlindAmount;
    this.bigBlindAmount = bigBlingAmount;


    if (this.players.length > 2) {
      this.smallBlind = this.players[1];
      this.bigBlind = this.players[2];

      this.players[1].currentBlind = 'small';
      this.players[2].currentBlind = 'big';

    } else if (this.players.length === 2) {
      this.smallBlind = this.players[0];
      this.bigBlind = this.players[1];

      this.players[0].currentBlind = 'small';
      this.players[1].currentBlind = 'big';

    } else if (this.players.length === 1) {
      this.smallBlind = this.players[0];

      this.players[0].currentBlind = 'small';
    }
  }

  // Placeholder Table ID generation until Multiplayer functionality is available
  private generateTableID(): number {    
    return Math.floor(Math.random() * 1000);
  }

  startRound(): void {

  }

  advanceRound(): void {
    if (this.players.length === 2) {
      this.dealerToken++;
      this.bigBlindToken = this.dealerToken;
      this.smallBlindToken = this.dealerToken + 1;
    } else if (this.players.length > 2) {
      this.dealerToken++;
      this.smallBlindToken = this.dealerToken + 1;
      this.bigBlindToken = this.dealerToken + 2;
    }

    if (this.dealerToken === this.players.length)
      this.dealerToken = 0;
    if (this.smallBlindToken === this.players.length)
      this.smallBlindToken = 0;
    if (this.bigBlindToken === this.players.length)
      this.bigBlindToken = 0;
  }

  prepareToDeal(): void {
    let dealOrder: Array<Array<Player | string>> = [];
    
    let playerCards: Player[] = [];
    for (let i = 0; i < this.gameConfig.cardsPerPlayer; i++) {
      for (let i = this.dealerToken; playerCards.length <= this.players.length; i++) {
        if (i === this.players.length)
          i = 0;

        playerCards.push(this.players[i]);
      }
    }

    dealOrder.push(playerCards);
    dealOrder.push(['burn']);

    for (let i = 0; i < this.gameConfig.numberOfFlops; i++) {
      dealOrder.push(['flop']);
      dealOrder.push(['burn']);
    }


    for (let i = 0; i < this.gameConfig.numberOfTurns; i++) {
      dealOrder.push(['turn']);
      dealOrder.push(['burn']);
    }

    for (let i = 0; i < this.gameConfig.numberOfRivers; i++) {
      dealOrder.push(['river']);
    }
  }

  dealNext(): void {
    let nextDeal = this.dealOrder.shift();
    if (nextDeal) {
      if (nextDeal[0] === 'burn') {
        this.burnPile.push(this.deck.draw());
        const burnImg = this.gameScene.add.image(c.GAME_WIDTH - 200 + (Math.random() * 20 - 10), c.GAME_HEIGHT - 100 + (Math.random() * 20 - 10), 'cardback').setOrigin(0.5);
      }

      else if (nextDeal[0] === 'flop') {
        let flop: Card[] = [];
        for (let i = 0; i < 3; i++)
          flop.push(this.deck.draw());
        this.board.flops.push(flop);
      } else if (nextDeal[0] === 'turn')
        this.board.turns.push(this.deck.draw());
      else if (nextDeal[0] === 'river')
        this.board.rivers.push(this.deck.draw());
      else {
        const player = nextDeal[0] as Player;
        if (!player.currentHand)
          player.currentHand = new Hand([]);
        player.currentHand.addCard(this.deck.draw());
      }
    }
  }
  dealCards(gameScene: Scene): void {
    // Reset and shuffle deck
    switch (this.gameState) {
      case GameState.IDLE:
        this.deck = new Deck(this.gameScene, true);
        this.clearTable();
        this.burnPile = [];
        this.dealPlayerCards(this.deck, gameScene);
        break;
      case GameState.DEALING:
        break;
      case GameState.PREFLOP:
        this.dealPlayerCards(this.deck, gameScene);
        break;
      case GameState.FLOP:
        this.dealFlop();
        break;
      case GameState.TURN:
        this.dealTurn();
        break;
      case GameState.RIVER:
        this.dealRiver();
        break;
    }

    return;

  }

  dealPlayerCards(deck: Deck, gameScene: Scene): void {
    
    for (let i = 0; i < this.gameConfig.cardsPerPlayer; i++) {
      let cardList: Card[] = [];
      for (let j = this.dealerToken; j < this.players.length; j++) {
        const card = deck.draw();
        const player = this.players[j];
        
        if (!player.currentHand)
          player.currentHand = new Hand([]);
        cardList.push(card);
        player.currentHand.addCard(card);
      }
      this.dealingAnim(gameScene, cardList, { x: c.GAME_X_MID, y: c.GAME_Y_3F })
    }

    this.burnPile.push(deck.draw());
  }

  dealFlop(): void {
    for (let i = 0; i < this.gameConfig.numberOfFlops; i++) {
      const flop: Card[] = [];
      for (let j = 0; j < 3; j++)
        flop.push(this.deck.draw());

      this.board.flops.push(flop);
    }

    this.burnPile.push(this.deck.draw());
  }

  dealTurn(): void {
    for (let i = 0; i < this.gameConfig.numberOfTurns; i++)
      this.board.turns.push(this.deck.draw());

    this.burnPile.push(this.deck.draw());
  }

  dealRiver(): void {
    for (let i = 0; i < this.gameConfig.numberOfRivers; i++)
      this.board.rivers.push(this.deck.draw());
  }

  clearTable(): void {
    // Clear all hands
    for (const player of this.players)
      player.currentHand = undefined;


    // Clear board
    this.board = { flops: [], turns: [], rivers: [] };
  }

  addPlayer(player: Player): void {
    this.players.push(player);
    player.currentTableID = this.tableID;
  }

  processBettingRound(): void {
    const currentPlayer = this.players[this.activePlayerIndex];
    
    // Check if round is complete (all players have equal bets or folded)
    if (this.isBettingComplete()) {
      this.moveToNextPhase();
      return;
    }

    // Move to next active player
    this.activePlayerIndex = this.getNextActivePlayer();
  }

  isBettingComplete(): boolean {
    const activePlayers = this.players.filter(p => !p.isFolded);
    const bets = new Set(activePlayers.map(p => p.currentBet));
    return bets.size === 1;
  }

  moveToNextPhase(): void {
    switch (this.gameState) {
      case GameState.PREFLOP:
        this.gameState = GameState.FLOP;
        this.dealFlop();
        break;
      case GameState.FLOP:
        this.gameState = GameState.TURN;
        this.dealTurn();
        break;
      case GameState.TURN:
        this.gameState = GameState.RIVER;
        this.dealRiver();
        break;
      case GameState.RIVER:
        this.gameState = GameState.SHOWDOWN;
        this.determineWinner();
        break;
    }
    this.resetBets();
  }

  advanceGameState(): GameState {
    this.moveToNextPhase();
    return this.gameState;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  private resetBets(): void {
    this.currentBet = 0;
    this.players.forEach(p => p.resetBets());
  }

  collectBets(): void {
    //this.pot += this.players.reduce((sum, p) => sum + p.currentBet, 0);
    this.players.forEach(p => this.collectBet(p));
    this.resetBets();
  }

  collectBet(player: Player): void {
    this.pot += player.currentBet;
    player.currentChips -= player.currentBet;
  }

  getNextActivePlayer(): number {
    let next = (this.activePlayerIndex + 1) % this.players.length;
    while (this.players[next].isFolded)
      next = (next + 1) % this.players.length;

    return next;
  }

  determineWinner(): void {
    const activePlayers = this.players.filter(p => !p.isFolded);
    if (activePlayers.length === 1) {
      this.awardPot(activePlayers[0]);
      return;
    }

    let bestHand = 0;
    let winners: Player[] = [];

    for (const player of activePlayers) {
      const evaluation = funcs.evaluateHand(new Hand([
        ...player.currentHand?.cards || [],
        ...this.board.flops[0],
        ...this.board.turns,
        ...this.board.rivers
      ]));

      if (evaluation.value > bestHand) {
        bestHand = evaluation.value;
        winners = [player];
      } else if (evaluation.value === bestHand)
        winners.push(player);

    }

    this.awardPot(winners);
  }

  private awardPot(winners: Player | Player[]): void {
    if (Array.isArray(winners)) {
      const share = Math.floor(this.pot / winners.length);
      winners.forEach(w => w.currentChips += share);
    } else
      winners.currentChips += this.pot;

    this.pot = 0;
  }

  dealingAnim(context, cardList, pos) {
  const tweenChain = context.tweens.chain({
    tweens: [
      {
        targets: cardList,
        x: function (a, b, c, d) {
          return pos.x + 85 * d; // calculate the next position of each card
        },
        y: pos.y,
        duration: 900, // duration of the tween
        angle: { from: 180, to: 0 }, // animate angle from 180 deg to 0
        delay: context.tweens.stagger(100, { start: 0 }), // stagger delay
        ease: Phaser.Math.Easing.Sine.Out // ease function
      },
      {
        targets: cardList, // second phase of the tween
        props: {
          scaleX: { value: 0, duration: 300, yoyo: true } // scale X with yoyo
        },
        // onYoyo: function (tween, target) {
        //   target.setTexture(target.cardValue); // change card texture to front
        // },
        ease: Phaser.Math.Easing.Linear // ease function
      }
    ],
    paused: false,
    repeat: 0
  });
  return tweenChain;
}
}