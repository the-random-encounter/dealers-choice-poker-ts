import Card from "../classes/Card";
//import { RANK_VALUES, SUIT_VALUES } from "../utils/constants";

export default class Hand {

  cards: Card[];

  constructor(cards: Array<Card>) {
    if (cards.length !== 5)
      throw new Error('A hand must have exactly 5 cards');
    else
      this.cards = cards;
  }

  sortCardsByDescendingValue(): Card[] {
    let sortedHand: Card[] = this.cards;
    sortedHand.sort((a, b) => b.value - a.value);
    return sortedHand;
  }

  countCardsByValue(cardValue: number  | string): number {
    
    let numCardsFound = 0;

    for (const card of this.cards) {
      if (card.value === cardValue)
        numCardsFound++;
    }

    return numCardsFound;
  }
}

/**
  sortCardsByDescendingValue = function(hand) {
    set sortedHand = create a copy of the hand array
    sort the sortedHand array by descending card value
    return sortedHand
  };
  
  countCardsByValue = function(hand, cardValue) {
    set numCardsFound = 0
    for each card in the hand {
      if card.value equals cardValue then add one to numCardsFound
    }
    return numCardsFound
  }
  
  JacksOrBetterPair = function(hand) {
    sort the hand by descending card value and store in a variable called sortedHand
    count the number of wild cards in the sorted hand, and store in a variable called numWilds
    set a variable called numberOfMatches to 0
    for each non-wild card in the sorted hand {
      if the current card in the loop is the first card in the hand being checked in this for loop then {
        if the value of the current card card is lower than a jack then
          return false (there are no cards of at least a jack in this hand, so therefore we don't need to bother checking any further)
        otherwise {
          set the current card as the base card (the values of other cards will be compared with this one to see if they match)
          set numberOfMatches to 1
          restart the loop with the next card as the new current card in this loop
        }
      }
       
      if the value of the base card equals the value of the current card then {
        add one onto numberOfMatches
        if numberOfMatches equals 2 then
          return true (this hand has a pair of jacks or higher!)
      }
      otherwise
        restart the loop with the next card as the new current card in this loop
         
      note: the value of base card does not match the value of the current card's value in the loop, so check if there are enough wild cards to qualify
      if numWilds + numberOfMatches >= 2 then
        return true (this hand has a pair of jacks or higher)
       
      note: no match has been established, so set a new base card value if it's at least a jack
      if the value of the current card is less than a jack then
        restart the loop with the next card as the new current card in this loop
         
      set the current card as the new base card
      set numberOfMatches to 1
    }
     
    note: if we've reached here, then the loop went through all the non-wild cards and didn't find a pair of jacks or higher
    return false
  }
*/