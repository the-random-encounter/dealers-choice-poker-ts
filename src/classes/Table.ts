import Player from "./Player";
import Deck from './Deck';
import Card from "./Card";
import Hand from './Hand';
import * as funcs from '../utils/functions';

export default class Table {

  tableID: number;
  tableName: string;
  players: Player[] = [];
  dealer: Player;
  smallBlind: Player;
  bigBlind: Player;
  pot: number = 0;
  sidePots?: number[];
  deck: Deck;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.tableID = this.generateTableID();

    this.dealer = this.players[0];
    this.players[0].currentDealer = true;
    this.players[0].currentTableID = this.tableID;
    this.players[0].table = this;
    if (this.players.length > 2) {
      this.smallBlind = this.players[1];
      this.bigBlind = this.players[2];

      this.players[1].currentBlind = 'Small';
      this.players[2].currentBlind = 'Big';

    } else if (this.players.length === 2) {
      this.smallBlind = this.players[0];
      this.bigBlind = this.players[1];

      this.players[0].currentBlind = 'Small';
      this.players[1].currentBlind = 'Big';

    } else if (this.players.length === 1) {
      this.smallBlind = this.players[0];

      this.players[0].currentBlind = 'Small';
    }
  }

  // Placeholder Table ID generation until Multiplayer functionality is available
  private generateTableID(): number {    
    return Math.floor(Math.random() * 1000);
  }
}