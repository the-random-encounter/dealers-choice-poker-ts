import { Room, Client } from "@colyseus/core";
import { GameState } from "./schema/PokerRoomState";
import { PlayerState } from "../schemas/PlayerState";
import GameManager from '../game/GameManager';





export default class PokerRoom extends Room<GameState> {
  private gameManager: GameManager;
  maxClients = 4;


  onCreate (options: any) {
    console.log(`Creating new room '${this.roomId}'...\nOptions: \n${JSON.stringify(options)}`)
    this.setState(new GameState());
    this.gameManager = new GameManager(this, this.state);

    this.onMessage('action', (client: Client, action: any) => {
      const player = this.state.players.find(p => p.id === client.sessionId)
      if (!player || this.state.currentPhase !== 'BETTING') return;

      this.gameManager.handleAction(player, action);
      this.broadcast('state', this.state)
    })
  }
  onJoin(client: Client): void {
    const player = new PlayerState()
    player.id = client.sessionId;
    console.log(`New player joined, ID: ${player.id}, Name: ${player.username || 'Unknown'}`);
    this.state.players.push(player)

    this.broadcast('state', this.state)
  }

  onLeave(client: Client): void {
    const playerIndex = this.state.players.findIndex(p => p.id === client.sessionId)
    if (playerIndex !== -1) {
      console.log(`New player joined, ID: ${client.sessionId}, Name: ${this.state.players[playerIndex].username || 'Unknown'}`);
      this.state.players.splice(playerIndex, 1)
    }
    
    this.broadcast('state', this.state)
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
