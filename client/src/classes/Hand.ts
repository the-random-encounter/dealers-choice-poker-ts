import Card from './Card';
import { HandType } from '../utils/types';
//import { generateRandomHand } from '../utils/cardFunctions';
import * as CONSTS from '../utils/constants';

export default class Hand {
  cards: HandType;

  constructor(cards: HandType) {
    this.cards = cards;
  }

  valueOf() {
    return this.cards;
  }

  toString() {
    return this.cards.toString();
  }

  
  [Symbol.toPrimitive](hint: string) {
    if (hint === 'number') {
      return this.cards.length;
    }
    if (hint === 'string') {
      return this.toString();
    }
    return this.valueOf();
  }

  [Symbol.iterator](): Iterator<Card> {
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

  sortDescending(): void {
    this.cards.sort((a, b) => b.getValue() - a.getValue());
  }

  // Example method to evaluate if the hand is a flush
  isFlush(): boolean {
    const suit = this.cards[0].suit;
    return this.cards.every(card => card.suit === suit);
  }

  // Example method to evaluate if the hand is a straight
  isStraight(): boolean {
    this.sortDescending();
    for (let i = 0; i < this.cards.length - 1; i++) {
      if (this.cards[i].getValue() - this.cards[i + 1].getValue() !== 1) {
        return false;
      }
    }
    return true;
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }


}

