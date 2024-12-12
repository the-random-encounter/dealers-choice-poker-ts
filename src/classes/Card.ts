import { isRankOrSuit, isCardName } from '../utils/cardFunctions';
import { Suit, Rank, CardName, RankValue } from '../utils/types';


/**
 * Represents a playing card.
 * @class
 * @param arg1 - Can be a Rank, Suit, RankValue, or CardName.
 * @param arg2 - Can be a Rank, RankValue, or Suit.
 * @example <caption>Creating a new Card instance with a Rank and Suit</caption>
 * const card = new Card('ace', 'hearts'); // Ace of Hearts
 * @example <caption>Creating a new Card instance with a RankValue and Suit</caption>
 * const card = new Card(12, 'diamonds'); // Queen of Diamonds
 * @example <caption>Creating a new Card instance with a CardName</caption>
 * const card = new Card('JS'); // Jack of Spades
 */
export default class Card {
  suit:   Suit;
  rank:   Rank;
  value:  RankValue;
  name:   CardName;

  /**
   * Constructs a new Card instance.
   * @constructor
   * @param arg1 - Can be a Rank, Suit, RankValue, or CardName.
   * @param arg2 - Can be a Rank, RankValue, or Suit.
   */
  constructor(arg1?: Rank | Suit | RankValue | string, arg2?: Rank | RankValue | Suit) {
    if (this.isCardName(arg1)) {
      this.name = arg1;
      this.suit = this.suitFromName(arg1.charAt(arg1.length - 1));
      this.rank = this.rankFromName(arg1.charAt(0));
      this.value = this.rankToValue(this.rank);
    } else if (this.isRankAndSuit(arg1, arg2)) {
      this.assignRankAndSuit(arg1 as Rank | Suit | RankValue, arg2 as Rank | Suit | RankValue);
    } else {
      throw new Error('Invalid arguments for Card constructor');
    }
  }

  /**
   * Checks if the value is a valid CardName.
   * @param value - The value to check.
   * @returns True if the value is a CardName, false otherwise.
   */
  private isCardName(value: any): value is CardName {
    return typeof value === 'string' && isCardName(value);
  }

  /**
   * Checks if the arguments are valid Rank and Suit.
   * @param arg1 - The first argument to check.
   * @param arg2 - The second argument to check.
   * @returns True if the arguments are valid Rank and Suit, false otherwise.
   */
  private isRankAndSuit(arg1: any, arg2: any): boolean {
    return arg1 && arg2 && isRankOrSuit(arg1) && isRankOrSuit(arg2);
  }

  /**
   * Assigns the rank and suit based on the provided arguments.
   * @param arg1 - The first argument (Rank, Suit, or RankValue).
   * @param arg2 - The second argument (Rank, Suit, or RankValue).
   */
  private assignRankAndSuit(arg1: Rank | Suit | RankValue, arg2: Rank | Suit | RankValue): void {
    if (typeof arg1 === 'string' && typeof arg2 === 'string') {
      if (this.isSuit(arg1)) {
        this.suit = arg1;
        this.rank = arg2 as Rank;
      } else {
        this.rank = arg1 as Rank;
        this.suit = arg2 as Suit;
      }
      this.name = this.getNameFromRankAndSuit(this.rank, this.suit);
    } else if (typeof arg1 === 'number' && typeof arg2 === 'string' && this.isSuit(arg2)) {
      this.rank = this.rankFromValue(arg1);
      this.suit = arg2;
      this.name = this.getNameFromRankAndSuit(this.rank, this.suit);
    } else if (typeof arg1 === 'string' && this.isSuit(arg1) && typeof arg2 === 'number') {
      this.suit = arg1;
      this.rank = this.rankFromValue(arg2);
      this.name = this.getNameFromRankAndSuit(this.rank, this.suit);
    }
    this.value = this.rankToValue(this.rank)
  }

  /**
   * Checks if the value is a valid Suit.
   * @param value - The value to check.
   * @returns True if the value is a Suit, false otherwise.
   */
  private isSuit(value: any): value is Suit {
    return isRankOrSuit(value) && ['hearts', 'diamonds', 'clubs', 'spades'].includes(value);
  }

  /**
   * Gets the CardName from the rank and suit.
   * @param rank - The rank of the card.
   * @param suit - The suit of the card.
   * @returns The CardName.
   */
  private getNameFromRankAndSuit(rank: Rank, suit: Suit): CardName {
    const rankInitial = this.rankToInitial(rank);
    const suitInitial = this.suitToInitial(suit);
    return `${rankInitial}${suitInitial}` as CardName;
  }

  /**
   * Converts a rank to its initial.
   * @param rank - The rank to convert.
   * @returns The initial of the rank.
   */
  private rankToInitial(rank: Rank): string {
    const rankMap: { [key in Rank]: string } = {
      'ace': 'A', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
      'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': 'T',
      'jack': 'J', 'queen': 'Q', 'king': 'K', 'wild': 'W'
    };
    if (rank in rankMap) {
      return rankMap[rank];
    }
    throw new Error(`Invalid rank: ${rank}`);
  }

  /**
   * Converts a suit to its initial.
   * @param suit - The suit to convert.
   * @returns The initial of the suit.
   */
  private suitToInitial(suit: Suit): string {
    switch (suit) {
      case 'hearts'   : return 'H';
      case 'diamonds' : return 'D';
      case 'clubs'    : return 'C';
      case 'spades'   : return 'S';
      default         : throw new Error(`Invalid suit: ${suit}`);
    }
  }

  /**
   * Gets the suit from its name.
   * @param name - The name of the suit.
   * @returns The suit.
   */
  suitFromName(name: string): Suit {
    switch (name) {
      case 'H': return 'hearts';
      case 'D': return 'diamonds';
      case 'C': return 'clubs';
      case 'S': return 'spades';
      default : throw new Error(`Invalid suit name: ${name}`);
    }
  }

  /**
   * Gets the rank from its name.
   * @param name - The name of the rank.
   * @returns The rank.
   */
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

  /**
   * Gets the value of the card.
   * @returns The value of the card.
   */
  getValue(): number {
    return this.rankToValue(this.rank);
  }

  /**
   * Converts a rank to its value.
   * @param rank - The rank to convert.
   * @returns The value of the rank.
   */
  rankToValue(rank: Rank): RankValue {
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
      case 'wild':  return 100;
      default: throw new Error(`Invalid rank value: ${rank}`);
    }
  }

  suitValue(): number {
    switch (this.suit) {
      case 'hearts':   return 1;
      case 'diamonds': return 2;
      case 'clubs':    return 3;
      case 'spades':   return 4;
      default: throw new Error(`Invalid suit value: ${this.suit}`);
    }
  }

  /**
   * Converts a value to its rank.
   * @param value - The value to convert.
   * @returns The rank corresponding to the value.
   */
  rankFromValue(value: RankValue): Rank {
    switch (value) {
      case 2:   return 'two';
      case 3:   return 'three';
      case 4:   return 'four';
      case 5:   return 'five';
      case 6:   return 'six';
      case 7:   return 'seven';
      case 8:   return 'eight';
      case 9:   return 'nine';
      case 10:  return 'ten';
      case 11:  return 'jack';
      case 12:  return 'queen';
      case 13:  return 'king';
      case 14:  return 'ace';
      case 100: return 'wild';
      default: throw new Error(`Invalid rank value: ${value}`);
    }
  }

  /**
   * Prints the full name of the card.
   * @returns The full name of the card.
   */
  printFullName(): string {
    const capRank = this.rank.charAt(0).toUpperCase() + this.rank.slice(1);
    const capSuit = this.suit.charAt(0).toUpperCase() + this.suit.slice(1);
    return `${capRank} of ${capSuit}`;
  }
}
