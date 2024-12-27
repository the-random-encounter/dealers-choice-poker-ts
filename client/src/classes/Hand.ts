import Card from './Card';
import Deck from './Deck';
import {HandType, RankValue, CardName} from '../utils/types';
import {generateRandomRank, generateRandomSuit} from "../utils/functions";

export default class Hand extends Array {
  cards: HandType | Card[];
  rank: number;

  constructor(cards: HandType | Card[]) {
    super();
    this.cards = cards;
    this.rank = this.rankCards();
  }

  rankCards = (): number => {
    const handCards: Card[] = this.cards;
    // Histogram
    // { rank: count }

    // Initialize empty histogram object
    const hist: {[key in RankValue]?: number} = {};

    // Iterate over cards in hand array and increment counter for each RankValue present
    handCards.reduce((hist: {[key in RankValue]?: number}, card: Card) => {
      hist[card.value as RankValue] = (hist[card.value as RankValue] || 0) + 1;
      return hist;
    }, hist);

// Scored histogram
// Descending by count
// [ [ rank, count ] ]
// scoredHist[x][0] references the rank of the cards (Jacks, Aces, etc.)
// scoredHist[x][1] references the number of times that rank appears in a hand

    const scoredHist: (number | undefined)[][] = Object
        .keys(hist)
        .map(rank => [parseInt(rank), hist[rank as unknown as RankValue]])
        .sort((a, b) => (a[1] ?? 0) === (b[1] ?? 0) ? (b[0] ?? 0) - (a[0] ?? 0) : (b[1] ?? 0) - (a[1] ?? 0));

    console.log(scoredHist);
// Suits
// [ suit: count ]

    const suits = handCards.reduce((suits: number[], card: Card) => {
      suits[card.suitValue()]++;
      return suits;
    }, [0,0,0,0]);

// Ranked Hand
// (descending by rank)
// [ index : rank ]

    const rankedHand = handCards.map(card => card.value).sort((a, b) => a - b);

// Evaluate for non-histogram based hands and set a flag accordingly, to be used for final evaluation chain
    const isFlush     = suits.indexOf(5) >= 0;
    const isWheel     = rankedHand[4] === 14 && rankedHand[0] === 2;
    const isStraight  = ( rankedHand[4]
        - rankedHand[3] === 1 || isWheel
    ) && (
        rankedHand[3]   - rankedHand[2] === 1 &&
        rankedHand[2]   - rankedHand[1] === 1 &&
        rankedHand[1]   - rankedHand[0] === 1
    );

// Final Evaluation Chain
// Starting with Royal Flush and working downwards
// Using ternary operators to chain evaluations together


// High Card
    return (isStraight && isFlush && rankedHand[4] === 14 && !isWheel) ? (10) // Royal Flush
        : (isStraight && isFlush) ? (9 + (rankedHand[4] / 100)) // Straight Flush
            : (scoredHist[0][1] === 4) ? (8 + ((scoredHist[0][0] ?? 0) / 100)) // Four of a Kind
                : (scoredHist[0][1] === 3 && scoredHist[1][1] === 2) ? (7 + ((scoredHist[0][0] ?? 0) / 100) + ((scoredHist[1][0] ?? 0) / 1000)) // Full House
                    : (isFlush) ? (6 + (rankedHand[4] / 100)) // Flush
                        : (isStraight) ? (5 + (rankedHand[4] / 100)) // Straight
                            : (scoredHist[0][1] === 3 && scoredHist[1][1] === 1) ? (4 + ((scoredHist[0][0] ?? 0) / 100)) // Three of a Kind
                                : (scoredHist[0][1] === 2 && scoredHist[1][1] === 2) ? (3 + ((scoredHist[0][0] ?? 0) / 100) + ((scoredHist[1][0] ?? 0) / 1000)) // Two Pair
                                    : (scoredHist[0][1] === 2 && scoredHist[1][1] === 1) ? (2 + ((scoredHist[0][0] ?? 0) / 100)) // One Pair
                                        : (1 + ((scoredHist[0][0] ?? 0) / 100));


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

  [Symbol.iterator](): IterableIterator<Card> {
    let index = 0;
    const cards = this.cards;

    return {
      [Symbol.iterator](): IterableIterator<Card> {
        return this;
      },
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
    this.cards.sort((a: Card, b: Card) => b.getValue() - a.getValue());
  }

  addCard(deckOrCard: Card | Deck | CardName | null = null): void {
    if (deckOrCard === null) {
      const card = new Card(generateRandomRank(), generateRandomSuit());
      this.cards.push(card);
      return;
    } else if (deckOrCard instanceof Card) {
      this.cards.push(deckOrCard);
      return;
    } else if (deckOrCard instanceof Deck) {
      const card: Card = deckOrCard.draw();
      this.cards.push(card);
      return;
    } else {
      const card: Card = new Card(deckOrCard as CardName);
      this.cards.push(card);
      return;
    }
  }
}