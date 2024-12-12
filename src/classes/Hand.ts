import Card from './Card';
import { Hand as HandType } from '../utils/types';
//import { generateRandomHand } from '../utils/cardFunctions';

export default class Hand {
  cards: HandType;

  constructor(cards: HandType) {
    if (cards.length !== 5) {
      throw new Error('A hand must contain exactly 5 cards.');
    }
    this.cards = cards;
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

}


