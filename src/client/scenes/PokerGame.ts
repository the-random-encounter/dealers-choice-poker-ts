import { Scene, GameObjects } from 'phaser';
import Deck from '../classes/Deck';
import Card from '../classes/Card';
import Hand from '../classes/Hand';
import Table from '../classes/Table';
import Player from '../classes/Player';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import FormUtil from '../classes/FormUtil';
import { Client, Room } from 'colyseus.js';
import type Server from '../services/Server';
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
    plusBet: GameObjects.Text;
    minusBet: GameObjects.Text;
    submitBet: GameObjects.Text;
    resetBet: GameObjects.Text;
    startRound: GameObjects.Text;
    gameState: any;
    currentBet: number;
    activePlayerIndex: number;
    gameVariant: GameVariant;
    gameConfig: GameConfig;

    async create(data: { server: Server }) {

        const { server } = data;
        console.log("Joining room...");

        /**
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
        */

        await server.join();

        server.onceStateChanged(state => {
          console.log(state); 
        })
        
            const tableImg = this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'table').setOrigin(0.5);
            this.table = new Table(this);
            this.createUI();

            this.room!.onStateChange((state) => {
              this.updateGameState(state);
            });

            this.room!.onMessage("readyToStart", () => {
              // Show start button if not already shown
              this.showStartButton();
            });

            this.room!.onMessage("roundStarted", (data) => {
              // Initialize the round UI
              this.hideStartButton();
              //this.initializeRound(data);
            });
          //});
        //} catch (e) {
        //    console.error(e);
        //}
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
            .on('pointerdown', () => {
              this.plusBet.setVisible(true);
              this.minusBet.setVisible(true);
              this.submitBet.setVisible(true);
              this.resetBet.setVisible(true);
            })
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

        this.plusBet = this.add.text(c.GAME_WIDTH - 150, c.GAME_Y_MID, "+", {
          fontFamily: 'Arial Black', fontSize: 100, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center' })
            .setInteractive({ useHandCursor: true})
            .on('pointerdown', () => this.amountToBet += 1)
            .on('shift+pointerdown', () => this.amountToBet += 5)
            .on('ctrl+pointerdown', () => this.amountToBet += 10)
            .setAlign('center')
            .setOrigin(0.5)
            .setVisible(false);

        this.minusBet = this.add.text(c.GAME_WIDTH - 250, c.GAME_Y_MID, "-", {
          fontFamily: 'Arial Black', fontSize: 100, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center' })
            .setInteractive({ useHandCursor: true})
            .on('pointerdown', () => this.amountToBet -= 1)
            .on('shift+pointerdown', () => this.amountToBet -= 5)
            .on('ctrl+pointerdown', () => this.amountToBet -= 10)
            .setAlign('center')
            .setOrigin(0.5)
            .setVisible(false);

        this.submitBet = this.add.text(c.GAME_WIDTH - 200, c.GAME_Y_MID + 100, "Submit", {
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center' })
            .setInteractive({ useHandCursor: true})
            .on('pointerdown', () => this.sendAction('bet', { amount: this.amountToBet }))
            .setAlign('center')
            .setOrigin(0.5)
            .setVisible(false);

        this.resetBet = this.add.text(c.GAME_WIDTH - 200, c.GAME_Y_MID + 200, "Reset", {
          fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center' })
            .setInteractive({ useHandCursor: true})
            .on('pointerdown', () => this.amountToBet = 0)
            .setAlign('center')
            .setOrigin(0.5)
            .setVisible(false);

            this.startRound = this.add.text(150, 150, "START", {
              fontFamily: 'Arial Black', fontSize: 60, color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center' })
            .setInteractive({ useHandCursor: true})
            .on('pointerdown', () => {
              this.room?.send("requestStart");
              this.startRound.setVisible(false);
            })
            .setAlign('center')
            .setOrigin(0.5)
            .setVisible(false);
            
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
    this.gameState = state.currentPhase;
    this.pot = state.pot;
    this.currentBet = state.currentBet;
    this.activePlayerIndex = state.activePlayerIndex;

    // Update UI
    this.updateButtons();
    this.renderCards();

    // Show/hide action buttons for active player
    if (state.activePlayerIndex === this.getLocalPlayerIndex()) {
      const validActions = this.getValidActions(this.table.players[state.activePlayerIndex]);
      this.showActionButtons(validActions);
    } else {
      this.hideActionButtons();
    }
  }

  private renderCards(): void {

    const player = this.room!.state.players[this.getLocalPlayerIndex()];
    const playerCards = player.hand;
    const communityCards = this.communityCards;
    
    if (player && player.hand) {
      let i = 100;
      for (const card of playerCards) {
        this.add.image(c.GAME_WIDTH - 400 + i, c.GAME_HEIGHT - 150, card.name);
        i += 100;
      }
    }

    if (this.room?.state.players) {
      let j = 100;
      let k = 0;
      for (const player of this.room!.state.players) {
        for (const card of player.hand) {
          this.add.image(100 + j, 100 + k, card.name).setScale(0.75);
          j += 100;
        }
        k += 150;
      }
    }

    if (communityCards) {
      let l = 0;
      for (const card of communityCards) {
        this.add.image(c.GAME_X_MID - 300 + l, c.GAME_Y_MID, card.name).setScale(0.75);
        l += 100;
      }
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

    private getLocalPlayerIndex(): number {
        return this.room?.state.players.findIndex(
            p => p.id === this.room?.sessionId
        ) ?? -1;
    }

    private getValidActions(player: Player): PlayerAction[] {
        const actions: PlayerAction[] = ['Fold']; // Can always fold
        const currentBet = this.currentBet;
        const playerBet = player.bet;
        const playerChips = player.chips;

        // Check if player can check (no bets to call)
        if (currentBet === playerBet) {
            actions.push('Check');
        }

        // Can call if there's a bet to match and player has enough chips
        if (currentBet > playerBet && playerChips >= (currentBet - playerBet)) {
            actions.push('Call');
        }

        // Can bet if no current bet and player has chips
        if (currentBet === 0 && playerChips > 0) {
            actions.push('Bet');
        }

        // Can raise if there's a current bet and player has enough chips for minimum raise
        if (currentBet > 0 && playerChips >= (currentBet - playerBet + this.room!.state.bigBlind)) {
            actions.push('Raise');
        }

        return actions;
    }

    private showActionButtons(validActions: PlayerAction[]): void {
        // Hide all buttons first
        this.hideActionButtons();

        // Show only valid action buttons
        const buttonMap = {
            'Fold'  : this.foldButton,
            'Check' : this.checkButton,
            'Call'  : this.callButton,
            'Bet'   : this.betButton,
            'Raise' : this.raiseButton
        };

        validActions.forEach(action => {
            const button = buttonMap[action];
            if (button) {
                button.setVisible(true);
                button.setInteractive({ useHandCursor: true });
            }
        });

        // Position buttons sequentially
        const visibleButtons = validActions
            .map(action => buttonMap[action])
            .filter(button => button && button.visible);
        
        visibleButtons.forEach((button, index) => {
            button.y = 75 + (index * 75); // Stack buttons vertically
        });
    }

    private hideActionButtons(): void {
        [
            this.foldButton,
            this.checkButton,
            this.callButton,
            this.betButton,
            this.raiseButton,
            this.plusBet,
            this.minusBet,
            this.submitBet,
            this.resetBet
        ].forEach(button => {
            if (button) {
                button.setVisible(false);
                button.disableInteractive();
            }
        });
    }

    private showStartButton(): void {
        this.startRound.setVisible(true);
        this.startRound.setInteractive({ useHandCursor: true });
    }

    private hideStartButton(): void {
      this.startRound.setVisible(false);
      this.startRound.disableInteractive();
    }
}