import { Room, Client } from "@colyseus/core";
import { PokerRoomState, Player } from "./schema/PokerRoomState";

export class PokerRoom extends Room<PokerRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new PokerRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
      const player = this.state.players.get(client.sessionId);
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
