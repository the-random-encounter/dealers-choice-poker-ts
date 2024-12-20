import { BlindType, HandType, PlayerAction } from '../utils/types';
import Hand from './Hand';
import Top from './Top';
import Table from './Table';

export default class Player extends Top {

  userID: integer;
  username: string;
  displayName: string;
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

  constructor(username: string, displayName: string) {
    super();
    this.username = username;
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

}