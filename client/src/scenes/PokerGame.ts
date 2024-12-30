import { Scene, GameObjects } from 'phaser';
import Deck from '../classes/Deck';
import Card from '../classes/Card';
import Hand from '../classes/Hand';
import Table from '../classes/Table';
import Player from '../classes/Player';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import FormUtil from '../classes/FormUtil';
import { Client, Room } from 'colyseus.js';

import { GameVariant, GameConfig, GameState, PlayerAction, } from '../utils/types';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';

const c = CONSTS;

export class PokerGame extends Scene {

    constructor ()
    {
        super('PokerGame');
    }

    client = new Client("ws://localhost:2567");
    room: Room | null;
    table: Table;
    pot: number = 0;
    foldButton: GameObjects.Text;
    checkButton: GameObjects.Text;
    betButton: GameObjects.Text;
    raiseButton: GameObjects.Text;
    callButton: GameObjects.Text;
    player: Player;
    playerCards: Card[];
    communityCards: Card[];
    amountToBet: number;

    async create() {
        console.log("Joining room...");

        try {
            this.client = new Client("ws://localhost:2567");
            this.room = null;

            await this.client.joinOrCreate("poker").then((room: Room) => {
                this.room = room;

                room.onMessage('state', state => {
                    this.updateGameState(state);
                });

                room.onError(err => console.error(err));
            
            console.log("Joined successfully!");
            const tableImg = this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'table').setOrigin(0.5);
            this.table = new Table(this);
            this.createUI();

            this.room.onStateChange((state) => {
              this.updateGameState(state);
            });

            this.room.onMessage("readyToStart", () => {
              // Show start button if not already shown
              this.showStartButton();
            });

            this.room.onMessage("roundStarted", (data) => {
              // Initialize the round UI
              this.initializeRound(data);
            });
          });
        } catch (e) {
            console.error(e);
        }
    }

    update() {

    }

    createUI() {
        this.foldButton = this.add.text(c.GAME_WIDTH - 35, 75, 'Fold', { 
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'right' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.sendAction('fold'))
            .setAlign('right')
            .setOrigin(1.0);
            
        this.checkButton = this.add.text(c.GAME_WIDTH - 35, 150, 'Check', { 
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'right' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.sendAction('check'))
            .setAlign('right')
            .setOrigin(1.0);

        this.betButton = this.add.text(c.GAME_WIDTH - 35, 225, 'Bet', { 
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'right'  })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.sendAction('bet', { amount: 10 }))
            .setAlign('right')
            .setOrigin(1.0);

        this.raiseButton = this.add.text(c.GAME_WIDTH - 35, 300, 'Raise', { 
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'right'  })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.sendAction('raise', { amount: 10 }))
            .setAlign('right')
            .setOrigin(1.0);

        this.callButton = this.add.text(c.GAME_WIDTH - 35, 375, 'Call', { 
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'right'  })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.sendAction('call'))
            .setAlign('right')
            .setOrigin(1.0);
    }

    private updateButtons() {
    const isMyTurn = this.room?.state.players.find(
        p => p.id === this.room?.sessionId
    )?.isActive;

    [this.foldButton, this.checkButton, this.betButton, this.raiseButton, this.callButton].forEach(button => {
        button.setInteractive(isMyTurn);
        button.alpha = isMyTurn ? 1 : 0.2;
    });
}

    sendAction(type, payload = {}) {
        if (this.room) {
            this.room.send('action', { type, ...payload })
        }
    }

    private updateGameState(state: any) {
    // Update local game state
    this.table.gameState = state.currentPhase;
    this.table.pot = state.pot;
    this.table.currentBet = state.currentBet;
    this.table.activePlayerIndex = state.activePlayerIndex;

    // Update UI
    this.updateButtons();
    this.renderCards();

    // Show/hide action buttons for active player
    if (state.activePlayerIndex === this.getLocalPlayerIndex()) {
      const validActions = this.table.getValidActions(this.table.players[state.activePlayerIndex]);
      this.showActionButtons(validActions);
    } else {
      this.hideActionButtons();
    }
  }

    updateCommunityCards(cards) {
        // Display community cards on the table
        cards.forEach((card, index) => {
            this.add.image(300 + index * 80, 300, card.name).setScale(0.5).setOrigin(0.5);
        })
    }

    updatePlayers(players) {
        // Update player hands, bets, and chip counts
        players.forEach(player => {
            console.log(`Player ${player.id}:`, player)
        })
    }

    private handlePlayerAction(action: PlayerAction): void {
    // Send action to server instead of handling locally
    this.room!.send("action", { 
      type: action,
      amount: action === 'Bet' || action === 'Raise' ? this.amountToBet : 0
    });
  }

}