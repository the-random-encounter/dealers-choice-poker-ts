import Card from './Card';
import Hand from './Hand';
import { Suit, Rank, Board } from '../utils/types';

import * as CONSTS from '../utils/constants';

interface Flop {
  cardOne: Card;
  cardTwo: Card;
  cardThree: Card;
}

interface Turn {
  card: Card;
}

interface River {
  card: Card;
}

interface SingleBoard {
  flop: Flop;
  turn: Turn;
  river: River;
}
interface TableState {
  gameBoard: SingleBoard[],
  playerBoards: any//PlayerBoard[]
}

export default class Deck {

  cards: Card[];

  constructor(autoShuffle: boolean = false) {
    
    // Construct new deck, and shuffle if shuffle flag is set true
    if (autoShuffle === true) {
      this.cards = this.generateDeck();
      this.shuffleDeck();
    // If no shuffle flag is set, just generate new deck in order
    } else {
      this.cards = this.generateDeck();
    }
  }

  // Implement iterator for deck, so that it can be looped through easily
  [Symbol.iterator]() {
        let index = 0;
        const cards = this.cards;

        return {
            next(): IteratorResult<Card> {
                if (index < cards.length) {
                    return { value: cards[index++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }


  private generateDeck(): Card[] {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];

    let cardArray: Card[] = [];

    // Generate deck contents in order, so that the deck is always the same
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card(suit, rank);
        cardArray.push(card);
      }
    }
    return cardArray;
  }

  regenerateDeck(): void {

    this.cards = [];

    this.cards = this.generateDeck();
  }

  shuffleDeck(): void {
    // Shuffle deck using Fisher-Yates
    for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return;
  }

  dealHand(): Hand {
    if (this.cards.length < 5) {
      throw new Error('Not enough cards to deal a hand.');
    }
    const handCards = this.cards.splice(0, 5);
    return new Hand(handCards);
  }

  draw(): Card {
    if (this.cards.length < 1)
      throw new Error('Not enough cards to draw.');
    else return this.cards.pop()!;
  }
}