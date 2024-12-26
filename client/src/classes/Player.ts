import { BlindType, HandType, PlayerAction } from '../utils/types';
import Hand from './Hand';
import Top from './Top';
import Table from './Table';

export default class Player {
  username: string;
  userID: number;
  displayName: string;
  chips: number;
  folded: boolean;
  allIn: boolean;
  talked: boolean;
  table: Table;
  cards: Hand;

  constructor(playerName: string, chips = 0, table: Table)
  {
    this.username = playerName;
    this.userID = this.generateNewUserID();
    this.displayName = playerName;
    this.chips = chips;
    this.folded = false;
    this.allIn = false;
    this.talked = false;
    this.table = table; //Circular reference to allow reference back to parent object.
    this.cards = new Hand([]);
  }

  private generateNewUserID(): number {
    return Math.floor(Math.random() * 1000000);
  }

}

/*
export default class Player extends Top {

  userID: integer;
  username: string;
  displayName: string;
  sessionId: string;
  wallet: number;
  currentTableID?: number;
  table?: Table;
  currentChips: integer = 0;
  currentDealer: boolean;
  currentBlind?: BlindType;
  currentHand?: Hand;
  isFolded: boolean = false;
  currentBet: number = 0;
  lastAction: PlayerAction;
  hasPostedBlind: boolean = false;
  hasCalledBet: boolean = false;
  hasRaised: boolean = false;

  constructor(sessionId: string,username: string, displayName: string) {
    super();
    this.username = username;
    this.sessionId = sessionId;
    this.displayName = displayName;
    this.wallet = 0;
    this.currentChips = 0;
  }

  placeBet(amount: number): boolean {
    if (amount > this.currentChips) return false;
    else {
      this.currentChips -= amount;
      this.currentBet += amount;
      this.lastAction = 'Bet';
      return true;
    }
  }

  checkBet(): boolean {
    this.lastAction = 'Check';
    return true;
  }

  fold(): void {
    this.isFolded = true;
    this.lastAction = 'Fold';
  }

  resetBets(): void {
    this.currentBet = 0;
    this.isFolded = false;
  }

  postBlind(type: BlindType): boolean {
    
    if (type == 'small') {
      if (this.currentChips < this.table!.smallBlindAmount) return false;
        this.currentChips  -= this.table!.smallBlindAmount;
        this.currentBet    += this.table!.smallBlindAmount;
        this.hasPostedBlind = true;
    } else if (type == 'big') {
      if (this.currentChips < this.table!.bigBlindAmount) return false;
        this.currentChips  -= this.table!.bigBlindAmount;
        this.currentBet    += this.table!.bigBlindAmount;
        this.hasPostedBlind = true;
    } else if (type === 'none') {
      this.hasPostedBlind = true;
    }
    return true;
  }

}*/
