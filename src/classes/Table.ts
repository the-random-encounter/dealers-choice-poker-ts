import Player from "./Player";
import Deck from './Deck';
import Card from "./Card";
import Hand from './Hand';
import Phaser, { Scene } from 'phaser';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';
import { GameConfig, Board } from '../utils/types';
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

  private dealerToken: number = 0;
  private smallBlindToken: number = 0;
  private bigBlindToken: number = this.smallBlindToken + 1;

  constructor(tableName: string, config: GameConfig, gameScene: Scene) {
    this.tableName = tableName;
    this.tableID = this.generateTableID();
    this.gameConfig = config;
    this.gameScene = gameScene;
    this.deck = new Deck(true);


    if (this.players.length > 2) {
      this.smallBlind = this.players[1];
      this.bigBlind = this.players[2];

      this.players[1].currentBlind = 'Small';
      this.players[2].currentBlind = 'Big';

    } else if (this.players.length === 2) {
      this.smallBlind = this.players[0];
      this.bigBlind = this.players[1];

      this.players[0].currentBlind = 'Small';
      this.players[1].currentBlind = 'Big';

    } else if (this.players.length === 1) {
      this.smallBlind = this.players[0];

      this.players[0].currentBlind = 'Small';
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

        const burnImg = this.gameScene.add.image(c.GAME_WIDTH - 200 + (Math.random() * 100), c.GAME_HEIGHT - 100 + (Math.random() * 100), 'cardback').setOrigin(0.5);

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
  dealCards(): void {
    // Reset and shuffle deck
    this.deck.regenerateDeck();
    this.deck.shuffleDeck();

    // Deal cards to players
    for (let i = 0; i < this.gameConfig.cardsPerPlayer; i++) {
      for (const player of this.players) {
        const card = this.deck.draw();
        if (!player.currentHand) {
          player.currentHand = new Hand([]);
        }
        player.currentHand.addCard(card);
      }
    }

    this.burnPile.push(this.deck.draw());

    // Deal flops
    for (let i = 0; i < this.gameConfig.numberOfFlops; i++) {
      const flop: Card[] = [];
      for (let j = 0; j < 3; j++) {
        flop.push(this.deck.draw());
      }
      this.board.flops.push(flop);
    }

    this.burnPile.push(this.deck.draw());

    // Deal turns
    for (let i = 0; i < this.gameConfig.numberOfTurns; i++) {
      this.board.turns.push(this.deck.draw());
    }

    this.burnPile.push(this.deck.draw());

    // Deal rivers
    for (let i = 0; i < this.gameConfig.numberOfRivers; i++) {
      this.board.rivers.push(this.deck.draw());
    }
  }

  clearTable(): void {
    // Clear all hands
    for (const player of this.players) {
      player.currentHand = undefined;
    }

    // Clear board
    this.board = { flops: [], turns: [], rivers: [] };
  }

  addPlayer(player: Player): void {
    this.players.push(player);
    player.currentTableID = this.tableID;
  }
}