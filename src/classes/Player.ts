import { BlindType, HandType } from '../utils/types';
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

  constructor(username: string, displayName: string) {
    super();
    this.username = username;
    this.displayName = displayName;
    this.wallet = 0;
    this.currentChips = 0;
  }

  placeBet(amount: number): boolean {
    if (amount > this.currentChips) return false;
    this.currentChips -= amount;
    this.currentBet += amount;
    return true;
  }

  fold(): void {
    this.isFolded = true;
  }

  resetBets(): void {
    this.currentBet = 0;
    this.isFolded = false;
  }

}