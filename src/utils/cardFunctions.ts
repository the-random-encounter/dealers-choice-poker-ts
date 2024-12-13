import { Suit, Rank, CardName, RankValue, Hand as HandType } from './types';
import { SUIT, RANK } from './constants';
import Card from '../classes/Card';
import Hand from '../classes/Hand';

export function getCardName(suit: Suit, rank: Rank): string {
  let r, s = '';

  switch (suit) {
    case 'hearts'   : s = 'H'; break;
    case 'diamonds' : s = 'D'; break;
    case 'clubs'    : s = 'C'; break;
    case 'spades'   : s = 'S'; break;
  }

  switch (rank) {
    case 'ace'    : r   = 'A'; break;
    case 'two'    : r   = '2'; break;
    case 'three'  : r   = '3'; break;
    case 'four'   : r   = '4'; break;
    case 'five'   : r   = '5'; break;
    case 'six'    : r   = '6'; break;
    case 'seven'  : r   = '7'; break;
    case 'eight'  : r   = '8'; break;
    case 'nine'   : r   = '9'; break;
    case 'ten'    : r   = 'T'; break;
    case 'jack'   : r   = 'J'; break;
    case 'queen'  : r   = 'Q'; break;
    case 'king'   : r   = 'K'; break;
  }

  return r + s;
}

// Type-Guard function to ensure parameter is of type CardName
export function isCardName(value: any): value is CardName {
  const cardNames: CardName[] = [
    'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH',
    'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD',
    'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC',
    'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS'
  ];
  return cardNames.includes(value);
}

// Type-Guard function to ensure parameter is of type Rank or Suit
export function isRankOrSuit(value: any): value is Rank | Suit {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Array<Rank | RankValue> = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  return suits.includes(value) || ranks.includes(value);
}

export function generateRandomSuit(): Suit {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    return suits[Math.floor(Math.random() * suits.length)];
  }

export function generateRandomRank(): Rank {
    const ranks: Rank[] = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
    return ranks[Math.floor(Math.random() * ranks.length)];
  }

export function generateRandomHand(): HandType {
    const hand: HandType = [];
    for (let i = 0; i < 5; i++) {
      const card = new Card(generateRandomRank(), generateRandomSuit())
      hand.push(card);
    }
    return hand;
  }

export function evaluateHand(hand: Hand): any {
    
  let testHand: HandType = [];
  for (let i = 0; i < 5; i++) {
    const card = new Card(generateRandomRank(), generateRandomSuit());
    testHand.push(card);
  }

  // Histogram
  // { rank: count }

  // Initialize empty histogram object
  const histogram: {[key in RankValue]?: number} = {};

  // Iterate over cards in hand array and increment counter for each RankValue present
  testHand.reduce((histogram, card) => {
    histogram[card.value as RankValue] = (histogram[card.value as RankValue] || 0) + 1;
    return histogram;
  }, histogram);

  // Scored histogram
  // Descending by count
  // [ [ rank, count ] ]

  const scoredHistogram = Object
    .keys(histogram)
    .map(rank => [parseInt(rank), histogram[rank as unknown as RankValue]])
    .sort((a, b) => (a[1] ?? 0) === (b[1] ?? 0) ? (b[0] ?? 0) - (a[0] ?? 0) : (b[1] ?? 0) - (a[1] ?? 0));

  // Suits
  // [ suit: count ]

  const suits = testHand.reduce((suits, card) => {
    suits[card.suitValue()]++;
    return suits;
  }, [0,0,0,0]);

  // Ranked Hand
  // (descending by rank)
  // [ index : rank ]

  const rankedHand = testHand.map(card => card.value).sort((a, b) => a - b);

  // sortCardsByDescendingValueer

  const isFlush     = suits.indexOf(5) >= 0;
  const isWheel     = rankedHand[4] === 14 && rankedHand[0] === 2;
  const isStraight  = (
    rankedHand[4]   - rankedHand[3] === 1 || isWheel
  ) && (
    rankedHand[3]   - rankedHand[2] === 1 &&
    rankedHand[2]   - rankedHand[1] === 1 &&
    rankedHand[1]   - rankedHand[0] === 1
  );

  // Final Evaluation Chain
  // Starting with Royal Flush and working downwards
  // Using ternary operators to chain evaluations together

  const bestHand = 
    (isStraight && isFlush && rankedHand[4] === 14 && !isWheel)   ? 'Royal Flush'
  : (isStraight && isFlush)                                       ? `Straight Flush ${isWheel ? '(Wheel)' : ''}`
  : (scoredHistogram[0][1] === 4)                                 ? 'Four of a Kind'
  : (scoredHistogram[0][1] === 3 && scoredHistogram[1][1] === 2)  ? 'Full House'
  : (isFlush)                                                     ? 'Flush'
  : (isStraight)                                                  ? `Straight ${isWheel ? '(Wheel)' : ''}`
  : (scoredHistogram[0][1] === 3 && scoredHistogram[1][1] === 1)  ? 'Three of a Kind'
  : (scoredHistogram[0][1] === 2 && scoredHistogram[1][1] === 2)  ? 'Two Pair'
  : (scoredHistogram[0][1] === 2 && scoredHistogram[1][1] === 1)  ? 'Pair'
  :                                                                 `High Card (${scoredHistogram[0][0]})`;

  return bestHand;
}