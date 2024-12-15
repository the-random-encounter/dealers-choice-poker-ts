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
  currentChips?: integer;
  currentDealer: boolean;
  currentBlind?: BlindType;
  currentHand?: Hand;

  constructor(username: string, displayName: string) {
    super();
    this.username = username;
    this.displayName = displayName;
    this.wallet = 0;
    this.currentChips = 0;
  }

}