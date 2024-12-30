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
    foldButton: GameObjects.Text;
    checkButton: GameObjects.Text;
    betButton: GameObjects.Text;
    raiseButton: GameObjects.Text;
    callButton: GameObjects.Text;
    player: Player;
    playerCards: Card[];
    communityCards: Card[];

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
        button.alpha = isMyTurn ? 1 : 0.5;
    });
}

    sendAction(type, payload = {}) {
        if (this.room) {
            this.room.send('action', { type, ...payload })
        }
    }

    updateGameState(state) {
        console.log('Updated Game State:', state)

        // Update UI with new game state
        // For example, display community cards and player hands
        this.updateCommunityCards(state.communityCards)
        this.updatePlayers(state.players)
        this.updateButtons();
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

}