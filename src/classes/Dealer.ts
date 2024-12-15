import Card from "./Card";
import Player from "./Player";
// ...existing code...

interface DealingRounds {
  players: number;  // number of cards per player
  community: number[];  // array of numbers representing cards per community dealing round
}

export default class Dealer extends Player {
  // ...existing code...

  dealToTable(options: DealingRounds): { playerCards: Card[][], communityCards: Card[][] } {
    const playerCards: Card[][] = [];
    const communityCards: Card[][] = [];
    
    // Deal to players
    for (let player = 0; player < this?.table?.players.length!; player++) {
      const cards: Card[] = [];
      for (let i = 0; i < options.players; i++) {
        const card = this.table?.deck.draw();
        if (card) cards.push(card);
      }
      playerCards.push(cards);
    }

    // Deal community cards in rounds
    for (const roundCount of options.community) {
      const roundCards: Card[] = [];
      for (let i = 0; i < roundCount; i++) {
        const card = this.table?.deck.draw();
        if (card) roundCards.push(card);
      }
      communityCards.push(roundCards);
    }

    return { playerCards, communityCards };
  }
}
