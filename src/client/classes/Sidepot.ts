import Player from './Player';
import Hand from './Hand';

export default class Sidepot {
  private amount: number;
  private possibleWinners: Player[];
  private usableHands: { [key: string]: Hand };

  constructor(amount: number, possibleWinners: Player[]) {
    this.amount = amount;
    this.possibleWinners = possibleWinners;
    this.usableHands = {};
    possibleWinners.forEach((player) => {
      this.usableHands[player.username] = new Hand(player.cards);
    });
  }

  public addHand(player: Player, hand: Hand) {
    if (!this.possibleWinners.includes(player)) {
      throw new Error('Player is not a possible winner');
    }
    this.usableHands[player.username] = hand;
  }

  public getUsableHands(): { [key: string]: Hand } {
    return this.usableHands;
  }
}