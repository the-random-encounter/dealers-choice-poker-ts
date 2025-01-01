import Phaser from 'phaser';
import Deck from "./Deck";
import Round from './Round';
import Player from './Player';

export default class Table {
    smallBlind: number;
    bigBlind: number;
    minPlayers: number;
    maxPlayers: number;
    players: Player[];
    dealer: number;
    minBuyIn: number;
    maxBuyIn: number;
    playersToRemove: Player[];
    playersToAdd: Player[];
    eventEmitter: Phaser.Events.EventEmitter;
    turnBet: any;
    currentRound: Round;
    currentRoundWinners: any[];
    currentRoundLosers: any[];
    deck: Deck;
    context: Phaser.Scene;
    gameState: any;
    pot: number = 0;

    constructor(
        context: Phaser.Scene,
        smallBlind: number = 5,
        bigBlind: number = 10,
        minPlayers: number = 2,
        maxPlayers: number = 6,
        minBuyIn: number = 100,
        maxBuyIn: number = 2000
    ) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.players = [];
        this.dealer = 0; //Track the dealer position between games
        this.minBuyIn = minBuyIn;
        this.maxBuyIn = maxBuyIn;
        this.playersToRemove = [];
        this.playersToAdd = [];
        this.eventEmitter = new Phaser.Events.EventEmitter;
        this.turnBet = {};
        this.currentRoundWinners = [];
        this.currentRoundLosers = [];
        this.context = context;


        //Validate acceptable value ranges.
        let err: Error | undefined;
        if (minPlayers < 2) { //require at least two players to start a currentRound.
            err = new Error('Parameter [minPlayers] must be a positive integer of a minimum value of 2.');
        } else if (maxPlayers > 10) { //hard limit of 10 players at a table.
            err = new Error('Parameter [maxPlayers] must be a positive integer less than or equal to 10.');
        } else if (minPlayers > maxPlayers) { //Without this we can never start a game!
            err = new Error('Parameter [minPlayers] must be less than or equal to [maxPlayers].');
        }

        if (err) {
            throw err;
        }
    }

    addPlayer(player) {
        if (!this.players.includes(player))
            this.players.push(player);
        else
            throw new Error(`Player ${player.username} is already at the table.`);
    }
}

/*
import Player from "./Player";
import Deck from './Deck';
import Card from "./Card";
import Hand from './Hand';
import Phaser, { Scene } from 'phaser';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';
import { GameConfig, Board, GameState, PlayerAction } from '../utils/types';
import { PokerGame } from '../scenes/PokerGame';

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
    console.log(`New table created!`);
    this.tableName = tableName;
    this.tableID = this.generateTableID();
    this.currentRoundConfig = config;
    this.currentRoundScene = gameScene;
    this.deck = new Deck(this.currentRoundScene, true);
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
    for (let i = 0; i < this.currentRoundConfig.cardsPerPlayer; i++) {
      for (let i = this.dealerToken; playerCards.length <= this.players.length; i++) {
        if (i === this.players.length)
          i = 0;

        playerCards.push(this.players[i]);
      }
    }

    dealOrder.push(playerCards);
    dealOrder.push(['burn']);

    for (let i = 0; i < this.currentRoundConfig.numberOfFlops; i++) {
      dealOrder.push(['flop']);
      dealOrder.push(['burn']);
    }


    for (let i = 0; i < this.currentRoundConfig.numberOfTurns; i++) {
      dealOrder.push(['turn']);
      dealOrder.push(['burn']);
    }

    for (let i = 0; i < this.currentRoundConfig.numberOfRivers; i++) {
      dealOrder.push(['river']);
    }
  }

  dealNext(): void {
    let nextDeal = this.dealOrder.shift();
    if (nextDeal) {
      if (nextDeal[0] === 'burn') {
        this.burnPile.push(this.deck.draw());
        const burnImg = this.currentRoundScene.add.image(c.currentRound_WIDTH - 200 + (Math.random() * 20 - 10), c.currentRound_HEIGHT - 100 + (Math.random() * 20 - 10), 'cardback').setOrigin(0.5);
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
    switch (this.currentRoundState) {
      case GameState.IDLE:
        this.deck = new Deck(this.currentRoundScene, true);
        this.burnPile = [];
        break;
      case GameState.DEALING:
        this.dealPlayerCards(this.deck, gameScene);
        break;
      case GameState.PREFLOP:
        
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
    
    for (let i = 0; i < this.currentRoundConfig.cardsPerPlayer; i++) {
      let cardList: Card[] = [];
      for (let j = this.dealerToken; j < this.players.length; j++) {
        if (j === this.players.length)
          j = 0;
        
        const card = deck.draw();
        const player = this.players[j];
        
        if (!player.currentHand)
          player.currentHand = new Hand([]);
        cardList.push(card);
        player.currentHand.addCard(card);
      }
      //this.dealingAnim(gameScene, cardList, { x: c.currentRound_X_MID, y: c.currentRound_Y_3F })
    }
  }

  dealFlop(): void {
    for (let i = 0; i < this.currentRoundConfig.numberOfFlops; i++) {
      const flop: Card[] = [];
      for (let j = 0; j < 3; j++)
        flop.push(this.deck.draw());
      this.board.flops.push(flop);
    }
  }

  dealTurn(): void {
    for (let i = 0; i < this.currentRoundConfig.numberOfTurns; i++)
      this.board.turns.push(this.deck.draw());
  }

  dealRiver(): void {
    for (let i = 0; i < this.currentRoundConfig.numberOfRivers; i++)
      this.board.rivers.push(this.deck.draw());
  }

  dealBurn(): void {
    this.burnPile.push(this.deck.draw());
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
    
    // Skip folded players
    if (currentPlayer.isFolded) {
      this.activePlayerIndex = this.getNextActivePlayer();
      return;
    }

    // Check if betting round is complete
    if (this.isBettingComplete()) {
      this.collectBets();
      this.advanceGameState();
      // Reset player states for new betting round
      this.players.forEach(p => {
        p.hasCalledBet = false;
        p.hasRaised = false;
        p.hasPostedBlind = false;
      });
      return;
    }

    // Update valid actions for current player
    const validActions = this.getValidActions(currentPlayer);
    
    // Emit event for UI to update available actions
    (this.currentRoundScene as Game).events.emit('updatePlayerActions', validActions);
  }

  isBettingComplete(): boolean {
    const activePlayers = this.players.filter(p => !p.isFolded);
    
    // All active players must have:
    // 1. Matched the current bet
    // 2. Acted after the last raise
    // 3. Posted their blind if required
    return activePlayers.every(p => 
      (p.currentBet === this.currentBet) && 
      (p.hasCalledBet || p.hasRaised || p.hasPostedBlind)
    );
  }

  moveToNextPhase(): void {
    switch (this.currentRoundState) {
      case GameState.PREFLOP:
        this.currentRoundState = GameState.FLOP;
        this.dealFlop();
        break;
      case GameState.FLOP:
        this.currentRoundState = GameState.TURN;
        this.dealTurn();
        break;
      case GameState.TURN:
        this.currentRoundState = GameState.RIVER;
        this.dealRiver();
        break;
      case GameState.RIVER:
        this.currentRoundState = GameState.SHOWDOWN;
        this.determineWinner();
        break;
    }
    this.resetBets();
  }

  getGameState(): GameState {
    return this.currentRoundState;
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

startNewHand(): void {
  // Reset everything
  this.currentRoundState = GameState.DEALING;
  this.clearTable();
  this.deck = new Deck(this.currentRoundScene, true);
  this.pot = 0;
  this.currentBet = 0;
  this.burnPile = [];
  
  // Deal cards to players
  this.dealPlayerCards(this.deck, this.currentRoundScene);
  
  // Post blinds
  this.players[this.smallBlindToken].postBlind('small');
  this.players[this.bigBlindToken].postBlind('big');
  
  // Set initial betting round
  this.currentRoundState = GameState.PREFLOP;
  this.activePlayerIndex = (this.bigBlindToken + 1) % this.players.length;
}

advanceGameState(): void {
  // Reset player action flags
  this.players.forEach(p => {
    p.hasCalledBet = false;
    p.hasRaised = false;
  });

  switch (this.currentRoundState) {
    case GameState.PREFLOP:
      this.currentRoundState = GameState.FLOP;
      this.dealBurn();
      this.dealFlop();
      break;
    case GameState.FLOP:
      this.currentRoundState = GameState.TURN;
      this.dealBurn();
      this.dealTurn();
      break;
    case GameState.TURN:
      this.currentRoundState = GameState.RIVER;
      this.dealBurn();
      this.dealRiver();
      break;
    case GameState.RIVER:
      this.currentRoundState = GameState.SHOWDOWN;
      this.determineWinner();
      break;
    case GameState.SHOWDOWN:
      this.currentRoundState = GameState.IDLE;
      this.advanceRound(); // Move dealer button and blinds
      break;
  }

  // Reset for next betting round
  if (this.currentRoundState !== GameState.SHOWDOWN && this.currentRoundState !== GameState.IDLE) {
    this.activePlayerIndex = (this.dealerToken + 1) % this.players.length;
    this.currentBet = 0;
  }
}

canPlayerCheck(player: Player): boolean {
  // Player can check if they've matched the current bet
  return player.currentBet === this.currentBet;
}

canPlayerCall(player: Player): boolean {
  const callAmount = this.currentBet - player.currentBet;
  return callAmount > 0 && callAmount <= player.currentChips;
}

canPlayerRaise(player: Player): boolean {
  // Need at least enough chips for current bet plus minimum raise
  return (this.currentBet - player.currentBet + this.bigBlindAmount) <= player.currentChips;
}

getValidActions(player: Player): PlayerAction[] {
  const actions: PlayerAction[] = ['Fold'];
  
  if (this.canPlayerCheck(player)) actions.push('Check');
  if (this.canPlayerCall(player)) actions.push('Call');
  if (this.canPlayerRaise(player)) {
    actions.push('Bet');
    actions.push('Raise');
  }
  
  return actions;
}
}*/
