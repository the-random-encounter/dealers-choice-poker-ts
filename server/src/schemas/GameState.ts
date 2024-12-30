import { Schema, ArraySchema, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";
import Card from "../../../client/src/classes/Card";

export class GameState extends Schema {
  @type("string") currentPhase: string = "WAITING";
  @type("number") pot: number = 0;
  @type("number") currentBet: number = 0;
  @type("number") activePlayerIndex: number = 0;
  @type("number") dealerIndex: number = 0;
  @type([PlayerState]) players = new ArraySchema<PlayerState>();
  @type(["string"]) communityCards = new ArraySchema<"string">();
  @type("boolean") roundInProgress: boolean = false;
  @type("number") minPlayers: number = 2;
  @type("number") smallBlind: number = 5;
  @type("number") bigBlind: number = 10;
  
}
