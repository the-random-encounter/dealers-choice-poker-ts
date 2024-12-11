import { isRankOrSuit, isCardName } from '../utils/cardFunctions';
//import { SUITCHARS, RANKCHARS } from 'constants';
import { Suit, Rank, CardName } from '../utils/constants';

export default class Card {
  suit: Suit;
  rank: Rank;
  name: CardName;

  constructor(arg1?: Rank | Suit | string, arg2?: Rank | Suit | string) {
    if (typeof arg1 === 'string' && isCardName(arg1)) {
      this.name = arg1;
      this.suit = this.suitFromName(arg1.charAt(arg1.length - 1));
      this.rank = this.rankFromName(arg1.charAt(0));
    } else if (arg1 && arg2 && isRankOrSuit(arg1) && isRankOrSuit(arg2)) {
      if (typeof arg1 === 'string' && typeof arg2 === 'string') {
        if (isRankOrSuit(arg1) && isRankOrSuit(arg2)) {
          if (this.isSuit(arg1)) {
            this.suit = arg1;
            this.rank = arg2 as Rank;
          } else {
            this.rank = arg1 as Rank;
            this.suit = arg2 as Suit;
          }
          this.name = this.getNameFromRankAndSuit(this.rank, this.suit);
        }
      }
    } else {
      throw new Error('Invalid arguments for Card constructor');
    }
  }

  private isSuit(value: any): value is Suit {
    return ['hearts', 'diamonds', 'clubs', 'spades'].includes(value);
  }

  private getNameFromRankAndSuit(rank: Rank, suit: Suit): CardName {
    const rankInitial = this.rankToInitial(rank);
    const suitInitial = this.suitToInitial(suit);
    return `${rankInitial}${suitInitial}` as CardName;
  }

  private rankToInitial(rank: Rank): string {
    switch (rank) {
      case 'ace'    : return 'A';
      case 'two'    : return '2';
      case 'three'  : return '3';
      case 'four'   : return '4';
      case 'five'   : return '5';
      case 'six'    : return '6';
      case 'seven'  : return '7';
      case 'eight'  : return '8';
      case 'nine'   : return '9';
      case 'ten'    : return 'T';
      case 'jack'   : return 'J';
      case 'queen'  : return 'Q';
      case 'king'   : return 'K';
      default       : throw new Error(`Invalid rank: ${rank}`);
    }
  }

  private suitToInitial(suit: Suit): string {
    switch (suit) {
      case 'hearts'   : return 'H';
      case 'diamonds' : return 'D';
      case 'clubs'    : return 'C';
      case 'spades'   : return 'S';
      default         : throw new Error(`Invalid suit: ${suit}`);
    }
  }

  suitFromName(name: string): Suit {
    switch (name) {
      case 'H': return 'hearts';
      case 'D': return 'diamonds';
      case 'C': return 'clubs';
      case 'S': return 'spades';
      default : throw new Error(`Invalid suit name: ${name}`);
    }
  }

  rankFromName(name: string): Rank {
    switch (name) {
      case 'A': return 'ace';
      case '2': return 'two';
      case '3': return 'three';
      case '4': return 'four';
      case '5': return 'five';
      case '6': return 'six';
      case '7': return 'seven';
      case '8': return 'eight';
      case '9': return 'nine';
      case 'T': return 'ten';
      case 'J': return 'jack';
      case 'Q': return 'queen';
      case 'K': return 'king';
      default : throw new Error(`Invalid rank name: ${name}`);
    }
  }

  getValue(): number {
    return this.rankToValue(this.rank);
  }

  rankToValue(rank: Rank): number {
    switch (rank) {
      case 'two':   return 2;
      case 'three': return 3;
      case 'four':  return 4;
      case 'five':  return 5;
      case 'six':   return 6;
      case 'seven': return 7;
      case 'eight': return 8;
      case 'nine':  return 9;
      case 'ten':   return 10;
      case 'jack':  return 11;
      case 'queen': return 12;
      case 'king':  return 13;
      case 'ace':   return 14;
      default:      return 0;
    }
  }
}


