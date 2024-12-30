import { Schema, ArraySchema, MapSchema, CollectionSchema, Context, type } from "@colyseus/schema";
import { PlayerState } from '../../schemas/PlayerState';

/**
  export class PlayerState extends Schema {
    @type("string") username    : string;
    @type("string") displayName : string;
    @type("number") id          : string;
    @type("number") wallet      : number;
    @type("number") chips       : number = 0;
    @type(["string"]) hand      : ArraySchema<string> = new ArraySchema<string>();
    @type("boolean") folded     : boolean = false;
    @type("number") bet         : number = 0;
    @type("boolean") allIn      : boolean = false;
*/


export class GameState extends Schema {
  @type([PlayerState]) players    : ArraySchema<PlayerState> = new ArraySchema<PlayerState>();
  @type("string") currentPhase    : string = 'waiting';
  @type("number") currentBet      : number = 0;
  @type("number") currentPlayer   : number = 0;
  @type(["string"]) communityCards: ArraySchema<string> = new ArraySchema<string>();
  @type("number") pot             : number = 0;
  @type("string") gameVariant     : string = "TexasHoldEm";
  @type("number") smallBlind      : number = 5;
  @type("number") bigBlind        : number = 10;
  @type("string") activePlayer    : string = '';
  @type("number") dealerIndex     : number = 0;
  @type("number") smallBlindIndex : number = 0;
  @type("number") bigBlindIndex   : number = 0;
}

export class PokerRoomState extends Schema {

  @type("number") maxClients: number = 4;
  @type("string") roomName  : string = "Poker Room";
  @type("string") roomState : string = "IDLE";
  @type("number") buyIn     : number = 100;

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class GameConfig extends Schema {
  @type("string") gameVariant         : string = "TexasHoldEm";
  @type("string") handCardVariant     : string = "Texas";
  @type("string") communityCardVariant: string = "HoldEm";
  @type("number") smallBlind          : number = 5;
  @type("number") bigBlind            : number = 10;
  @type(["string"]) wildCards         : ArraySchema<string> = new ArraySchema<string>();
}