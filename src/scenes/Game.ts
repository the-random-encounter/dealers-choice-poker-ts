import { Scene } from 'phaser';
import Deck from '../classes/Deck';
import Card from '../classes/Card';
import Hand from '../classes/Hand';
import Table from '../classes/Table';
import Player from '../classes/Player';

import { GameVariant, GameConfig, GameState, PlayerAction, } from '../utils/types';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';

const c = CONSTS;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    gameConfig: GameConfig;
    table: Table;
    cards: Phaser.GameObjects.Image[] = [];
    chipsDisplay: Phaser.GameObjects.Text;
    potDisplay: Phaser.GameObjects.Text;
    private actionButtons: Phaser.GameObjects.Text[] = [];

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        var cardsDealt = false;
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'background').setOrigin(0.5).setAlpha(0.5,0.5,1.0,0.1);

        this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'table').setOrigin(0.5);
        
        const player1 = new Player('p1', 'Player 1');
        const player2 = new Player('p2', 'Player 2');

        // Initialize table with Texas Hold'em configuration
        const gameConfig: GameConfig = {
            variant: 'TexasHoldEm',
            cardsPerPlayer: 2,
            numberOfFlops: 1,
            numberOfTurns: 1,
            numberOfRivers: 1
        };

        this.gameConfig = gameConfig;
        
        this.table = new Table('Main Table', gameConfig, this);
        this.table.addPlayer(player1);
        this.table.addPlayer(player2);

        this.createActionButtons();

        // Add UI elements      
        const chipsLabel = this.add.text(25, 25, 'Chips: ', {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
            align: 'left'
        }).setOrigin(0.0);

        const potLabel = this.add.text(25, 60, 'Pot Size: ', {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
            align: 'left'
        }).setOrigin(0.0);

        this.chipsDisplay = this.add.text(150, 28, `${this.table.players[0].currentChips.toString()}`, {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'left'
        }).setOrigin(0.0);
        
        this.potDisplay = this.add.text(200, 63, `${this.table.pot.toString()}`, {
          fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
          stroke: '#000000', strokeThickness: 3,
          align: 'left'
        }).setOrigin(0.0);

        const dealButton = this.add.text(c.GAME_WIDTH-100,50, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive( { useHandCursor: true } );

        const mainMenuButton = this.add.text(c.GAME_WIDTH - 250, 100, "Menu", {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#00ffff', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive( { useHandCursor: true } );

        const evalButton = this.add.text(c.GAME_WIDTH-100, 200, 'EVAL', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive( { useHandCursor: true } );

        const chipsDebugBtn = this.add.text(150, c.GAME_HEIGHT-100, "Add Chips", {
            fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
            stroke: '#00ffff', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive( { useHandCursor: true } );

        chipsDebugBtn.on('pointerdown', () => {
            if (this.table.players[0]) {
                this.table.players[0].currentChips += 1000;
            }
        });

        dealButton.on('pointerdown', () => {
            if (this.table.gameState === GameState.IDLE) {
                this.startNewHand();
            }
        });

        evalButton.on('pointerdown', () => {
          if (cardsDealt) {
            const boardCards = [...this.table.board.flops[0],...this.table.board.turns,...this.table.board.rivers];
            let p1Cards: Card[] = [];
            let p2Cards: Card[] = [];
            
            if (this.table.players[0].currentHand)
              p1Cards = [...this.table.players[0].currentHand];
            if (this.table.players[1].currentHand)
              p2Cards = [...this.table.players[1].currentHand];
            
            const p1Hand = new Hand([...p1Cards, ...boardCards]);
            const p2Hand = new Hand([...p2Cards, ...boardCards]);

            const p1Eval = funcs.evaluateHand(p1Hand);
            const p2Eval = funcs.evaluateHand(p2Hand);

            console.log(`P1 Cards: ${p1Hand.cards.length} | ${JSON.stringify(p1Hand)}`);
            console.log(`P2 Cards: ${p2Hand.cards.length} | ${JSON.stringify(p2Hand)}`);
            console.log(`Player 1: ${p1Eval.string} (${p1Eval.value})`);
            console.log(`Player 2: ${p2Eval.string} (${p2Eval.value})`);

            if (p1Eval.value > p2Eval.value) {
              console.log('Player 1 wins!');
            } else if (p1Eval.value < p2Eval.value) {
              console.log('Player 2 wins!');
            } else {
              console.log('It\'s a tie!');
            }
          }

        }); 

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }

    update() {

      this.chipsDisplay.text = this.table.players[0].currentChips.toString();
      this.potDisplay.text = this.table.pot.toString();
    }
    private renderCards(): void {
        
        const p1c1    = this.add.image(c.CARD_SLOTS.players.p1[this.gameConfig.variant][0].x,  c.CARD_SLOTS.players.p1[this.gameConfig.variant][0].y,  'cardback').setOrigin(0.5);
        const p1c2    = this.add.image(c.CARD_SLOTS.players.p1[this.gameConfig.variant][1].x,  c.CARD_SLOTS.players.p1[this.gameConfig.variant][1].y,  'cardback').setOrigin(0.5);
        const p2c1    = this.add.image(c.CARD_SLOTS.players.p2[this.gameConfig.variant][0].x,  c.CARD_SLOTS.players.p2[this.gameConfig.variant][0].y,  'cardback').setOrigin(0.5);
        const p2c2    = this.add.image(c.CARD_SLOTS.players.p2[this.gameConfig.variant][1].x,  c.CARD_SLOTS.players.p2[this.gameConfig.variant][1].y,  'cardback').setOrigin(0.5);
        const flop1   = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[0].x, c.CARD_SLOTS.boards[this.gameConfig.variant].flop[0].y, 'cardback').setOrigin(0.5);
        const flop2   = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[1].x, c.CARD_SLOTS.boards[this.gameConfig.variant].flop[1].y, 'cardback').setOrigin(0.5);
        const flop3   = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[2].x, c.CARD_SLOTS.boards[this.gameConfig.variant].flop[2].y, 'cardback').setOrigin(0.5);
        const turn    = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].turn.x,    c.CARD_SLOTS.boards[this.gameConfig.variant].turn.y,    'cardback').setOrigin(0.5);
        const river   = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].river.x,   c.CARD_SLOTS.boards[this.gameConfig.variant].river.y,   'cardback').setOrigin(0.5);
        const burners = this.add.image(c.GAME_WIDTH - 200, c.GAME_HEIGHT - 100, 'cardback').setOrigin(0.5);

        this.cards = [p1c1, p1c2, p2c1, p2c2, flop1, flop2, flop3, turn, river];
        
        p1c1  .setDataEnabled();
        p1c2  .setDataEnabled();
        p2c1  .setDataEnabled();
        p2c2  .setDataEnabled();
        flop1 .setDataEnabled();
        flop2 .setDataEnabled(); 
        flop3 .setDataEnabled();
        turn  .setDataEnabled();
        river .setDataEnabled();

        if (this.table.gameState === GameState.DEALING || this.table.gameState === GameState.IDLE) {
          p1c1  .data.set('card', this.table.players[0]?.currentHand?.cards[0].name);
          p1c2  .data.set('card', this.table.players[0]?.currentHand?.cards[1].name);
          p2c1  .data.set('card', this.table.players[1]?.currentHand?.cards[0].name);
          p2c2  .data.set('card', this.table.players[1]?.currentHand?.cards[1].name);

          this.tweens.add({
            targets: p1c1,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: p1c1.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
          this.tweens.add({
            targets: p1c2,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: p1c2.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
          this.tweens.add({
            targets: p2c1,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: p2c1.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
          this.tweens.add({
            targets: p2c2,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: p2c2.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });

        } else if (this.table.gameState === GameState.PREFLOP || this.table.gameState === GameState.FLOP) {
          flop1 .data.set('card', this.table.board.flops[0][0].name);
          flop2 .data.set('card', this.table.board.flops[0][1].name);
          flop3 .data.set('card', this.table.board.flops[0][2].name);

          this.tweens.add({
            targets: flop1,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: flop1.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
          this.tweens.add({
            targets: flop2,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: flop2.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
          this.tweens.add({
            targets: flop3,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: flop3.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
        } else if (this.table.gameState === GameState.TURN) {
          turn  .data.set('card', this.table.board.turns[0]   .name);

          this.tweens.add({
            targets: turn,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: turn.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
          });
        }
        else if (this.table.gameState === GameState.RIVER) {
          river .data.set('card', this.table.board.rivers[0]  .name);

          this.tweens.add({
            targets: river,
            props: {
              scaleX: { value: 0, duration: 1000, yoyo: true },
              texture: { value: river.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
        });
      }
    }

    private createActionButtons(): void {
        const actions = ['Check', 'Call', 'Bet', 'Raise', 'Fold'];
        const startX = 400;
        
        this.actionButtons = actions.map((action, i) => {
            const button = this.add.text(startX + (i * 150), c.GAME_HEIGHT - 50, action, {
                fontSize: '24px',
                backgroundColor: '#444'
            })
            .setInteractive()
            .setVisible(false);

            button.on('pointerdown', () => this.handlePlayerAction(action.toLowerCase() as PlayerAction));
            
            return button;
        });
    }

    private startNewHand(): void {
        this.table.gameState = GameState.DEALING;
        this.table.clearTable();
        this.table.dealCards(this);
        this.renderCards();
        
        // Post blinds
        this.table.players[this.table.smallBlindToken].placeBet(this.table.smallBlindAmount);
        this.table.players[this.table.bigBlindToken].placeBet(this.table.bigBlindAmount);
        
        this.table.gameState = GameState.PREFLOP;
        this.showActionButtons();
    }

    private handlePlayerAction(action: PlayerAction): void {
        const player = this.table.players[this.table.activePlayerIndex];
        
        switch (action) {
            case 'check':
                if (player.currentBet === this.table.currentBet) {
                    this.table.processBettingRound();
                }
                break;
            case 'call':
                const callAmount = this.table.currentBet - player.currentBet;
                if (player.placeBet(callAmount)) {
                    this.table.processBettingRound();
                }
                break;
            case 'bet':
                // Add bet amount input logic here
                const betAmount = 20; // Example amount
                if (player.placeBet(betAmount)) {
                    this.table.currentBet = betAmount;
                    this.table.processBettingRound();
                }
                break;
            case 'fold':
                player.fold();
                this.table.processBettingRound();
                break;
        }
        
        this.updateUI();
    }

    private updateUI(): void {
        // Update chip counts, pot size, current bet, etc.
        this.chipsDisplay.text = `${this.table.players[0].currentChips}`;
        // Add more UI updates as needed
    }

    private showActionButtons(): void {
        this.actionButtons.forEach(button => button.setVisible(true));
    }
}
