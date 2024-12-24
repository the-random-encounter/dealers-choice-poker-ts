import { Schema, MapSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") username: string;
  @type("string") displayName: string;
  @type("number") wallet: number;
  @type("number") currentChips: number = 0;
}

export class PokerRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type("number") maxClients: number = 4;
  @type("string") roomName: string = "Poker Room";
  @type("string") roomState: string = "IDLE";
  @type("string") gameVariant: string = "TexasHoldEm";
  @type("number") smallBlind: number = 5;
  @type("number") bigBlind: number = 10;
  @type("number") pot: number = 0;
  @type("number") currentBet: number = 0;
  @type("number") buyIn: number = 100;

  @type({ map: Player }) players = new MapSchema<Player>();
}
