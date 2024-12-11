
import Card from './Card';
import { Suit, Rank } from '../utils/constants';

export default class Deck {

  cards: Card[];

  constructor(autoShuffle?: boolean) {
    if (autoShuffle === true) {
      this.cards = this.generateDeck();
      this.shuffleDeck();
    } else {
      this.cards = this.generateDeck();
    }
  }

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

  private generateDeck() {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];

    let cardArray: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card(suit, rank);
        cardArray.push(card);
      }
    }
    return cardArray;
  }

  shuffleDeck() {
    // this.cards.sort(() => Math.random() - 0.5);

    let i, j, tempi, tempj;
    for (i = 0; i < this.cards.length; i += 1) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = this.cards[i];
        tempj = this.cards[j];
        this.cards[i] = tempj;
        this.cards[j] = tempi;
    }
  }
}