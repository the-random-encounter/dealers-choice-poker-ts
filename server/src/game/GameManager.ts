import { CardName, DealingPhases, GamePhases, GameConfig, GameAction, Action } from '../utils/types';
import { GameState } from "../rooms/schema/PokerRoomState";
import { PlayerState } from '../schemas/PlayerState';
import PokerRoom from '../rooms/PokerRoom';
import Card from '../../../client/src/classes/Card';
import Deck from '../../../client/src/classes/Deck';
import Hand from '../../../client/src/classes/Hand';
import Table from '../../../client/src/classes/Table';
import Round from '../../../client/src/classes/Round';
import Sidepot from '../../../client/src/classes/Sidepot';
import Player from '../../../client/src/classes/Player';
import PhaseManager from './PhaseManager';

export default class GameManager {
  private players: PlayerState[] = [];
  private room: PokerRoom;
  private state: GameState;
  private deck: Deck;
  private phaseManager: PhaseManager;
  private currentRoundConfig: GameConfig;
  private gamePhases = ['WAITING', 'DEALING', 'BETTING', 'SHOWDOWN'];
  private dealingPhases = ['PRE-FLOP', 'FLOP', 'TURN', 'RIVER'];
  private currentPhase = 0;
  private currentPlayer = 0;
  private dealingPhase = this.dealingPhases[0];
  private dealerIndex: number = 0;
  private smallBlindIndex: number = (this.dealerIndex + 1) % this.playerCount();
  private bigBlindIndex: number = (this.smallBlindIndex + 1) % this.playerCount();
  

  constructor(room: PokerRoom, state: GameState) {
    this.room = room;
    this.state = state;
    this.phaseManager = new PhaseManager(this);
    this.deck = new Deck(true);
  }

  private playerCount(): number {
    return this.players.filter(e => e !== null).length;
    
  }
  handleAction(player: PlayerState, action: GameAction) {
    if (!this.isValidAction(player, action)) return;

    switch (action.type) {
      case 'fold':
        this.handleFold(player);
        break;
      case 'bet':
        this.handleBet(player, action.amount);
      case 'check':
        this.handleCheck(player);
        break;
      case 'call':
        this.handleCall(player);
        break;
      case 'raise':
        this.handleRaise(player, action.amount);
        break;
    }

    this.checkRoundComplete();
    
  }

  private handleFold(player: PlayerState) {
    player.folded = true;
    this.moveToNextPlayer();
  }

  private handleCheck(player: PlayerState) {
    if (this.state.currentBet > player.bet) return;
    this.moveToNextPlayer();
  }

  private handleBet(player: PlayerState, amount: number) {
    if (amount > player.chips || this.state.currentBet > 0) return;

    player.bet = amount;
    player.chips -= amount;
    this.state.pot += amount;
    this.state.currentBet = amount;
    this.moveToNextPlayer();
  }

  private handleCall(player: PlayerState) {
    const amount = this.state.currentBet - player.bet;
    if (amount > player.chips) return;

    player.bet = this.state.currentBet;
    player.chips -= amount;
    this.state.pot += amount;
    this.moveToNextPlayer();
  }

  private handleRaise(player: PlayerState, amount: number) {
    if (amount > player.chips || amount < this.state.currentBet) return;

    player.bet = amount;
    player.chips -= amount;
    this.state.pot += amount;
    this.state.currentBet = amount;
    this.moveToNextPlayer();
  }

  private moveToNextPlayer() {
    // Deactivate current player
    const currentPlayer = this.state.players.find(p => p.isActive);
    if (currentPlayer) {
        currentPlayer.isActive = false;
    }

    // Find and activate next valid player
    let nextIndex = this.findNextPlayerIndex();
    if (nextIndex !== -1) {
        this.state.players[nextIndex].isActive = true;
    }
  }

  private findNextPlayerIndex(): number {
    const currentIndex = this.state.players.findIndex(p => p.isActive);
    let nextIndex = (currentIndex + 1) % this.state.players.length;
    
    while (nextIndex !== currentIndex) {
        if (!this.state.players[nextIndex].folded) {
            return nextIndex;
        }
        nextIndex = (nextIndex + 1) % this.state.players.length;
    }
    return -1;
  }

  private checkRoundComplete() {
    const activePlayers = this.state.players.filter(p => !p.folded);

    if (activePlayers.length === 1) {
      this.handleWinner(activePlayers[0]);
      return;
    }

    const allPlayersActed = this.state.players.every(p => p.folded || p.bet === this.state.currentBet);

    if (allPlayersActed) {
      this.moveToNextPhase();
    }
  }

  private moveToNextPhase() {
    this.currentPhase = (this.currentPhase + 1) % this.gamePhases.length;
    this.state.currentPhase = this.gamePhases[this.currentPhase];
    
    if (this.state.currentPhase === 'DEALING') {
      this.dealCards();
    } else if (this.state.currentPhase === 'SHOWDOWN') {
      this.handleShowdown();
    }
  }

  private isValidAction(player: PlayerState, action: GameAction): boolean {
    // TODO handle action validation
    return false
  }

  private dealCards() {
    // TODO Handle dealing logic

    switch (this.dealingPhase) {
      case DealingPhases.PREFLOP:
        for (let i = 0; i < this.currentRoundConfig.cardsPerPlayer; i++) {
          let cardList: Card[] = [];
          for (let j = this.dealerIndex; j < this.players.length; (j = (j+1) % this.players.length) ) {
            
            
            const card = this.deck.draw();
            const player = this.players[j];

            cardList.push(card);
            player.hand.push(card.name);
          }
      //this.dealingAnim(gameScene, cardList, { x: c.currentRound_X_MID, y: c.currentRound_Y_3F })
    }
    }
  }

  private newPlayerJoined(player: PlayerState) {
    const emptySeatIndex = this.players.findIndex(e => e = null);
    if (emptySeatIndex === -1)
      this.players.push(player);
    else
      this.players[emptySeatIndex] = player;
  }

  private playerLeft(player: PlayerState) {
    this.players.splice(this.players.indexOf(player), 1, null);
  }

  private handleShowdown() {
    // TODO Handle Showdown Event logic
  }

  private handleWinner(player: PlayerState) {
    // TODO Handle winner logic
  }
}