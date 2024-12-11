type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

type Rank = 'ace' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'ten' | 'jack' | 'queen' | 'king';

//type RankValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

type CardName = 'AH' | '2H' | '3H' | '4H' | '5H' | '6H' | '7H' | '8H' | '9H' | 'TH' | 'JH' | 'QH' | 'KH' | 'AD' | '2D' | '3D' | '4D' | '5D' | '6D' | '7D' | '8D' | '9D' | 'TD' | 'JD' | 'QD' | 'KD' | 'AC' | '2C' | '3C' | '4C' | '5C' | '6C' | '7C' | '8C' | '9C' | 'TC' | 'JC' | 'QC' | 'KC' | 'AS' | '2S' | '3S' | '4S' | '5S' | '6S' | '7S' | '8S' | '9S' | 'TS' | 'JS' | 'QS' | 'KS';


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


export function isCardName(value: any): value is CardName {
  const cardNames: CardName[] = [
    'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH',
    'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD',
    'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC',
    'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS'
  ];
  return cardNames.includes(value);
}


export function isRankOrSuit(value: any): value is Rank | Suit {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
  
  return suits.includes(value) || ranks.includes(value);
}
