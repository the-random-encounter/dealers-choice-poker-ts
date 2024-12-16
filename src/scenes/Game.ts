import { Scene } from 'phaser';
import Deck from '../classes/Deck';
import Card from '../classes/Card';
import Hand from '../classes/Hand';
import Table from '../classes/Table';
import Player from '../classes/Player';

import { GameVariant, GameConfig } from '../utils/types';
import * as funcs from '../utils/functions';
import * as CONSTS from '../utils/constants';

const c = CONSTS;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    gameConfig: GameConfig;
    private table: Table;
    cards: Phaser.GameObjects.Image[] = [];

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
        
        const dealButton = this.add.text(c.GAME_WIDTH-100,50, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        const mainMenuButton = this.add.text(150, 100, "Menu", {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#00ffff', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        const evalButton = this.add.text(c.GAME_WIDTH-100, 200, 'EVAL', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

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

        dealButton.on('pointerdown', () => {
            
            for (let i = 0; i < this.cards.length; i++) {
              this.cards[i].setVisible(false);
            }
          
            this.table.clearTable();
            this.table.dealCards();
            this.renderCards();
            cardsDealt = true;
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

    private renderCards(): void {
        
        const p1c1  = this.add.image(c.CARD_SLOTS.players.p1[this.gameConfig.variant][0].x,   c.CARD_SLOTS.players.p1[this.gameConfig.variant][0].y,  'cardback').setOrigin(0.5);
        const p1c2  = this.add.image(c.CARD_SLOTS.players.p1[this.gameConfig.variant][1].x,   c.CARD_SLOTS.players.p1[this.gameConfig.variant][1].y,  'cardback').setOrigin(0.5);
        const p2c1  = this.add.image(c.CARD_SLOTS.players.p2[this.gameConfig.variant][0].x,   c.CARD_SLOTS.players.p2[this.gameConfig.variant][0].y,  'cardback').setOrigin(0.5);
        const p2c2  = this.add.image(c.CARD_SLOTS.players.p2[this.gameConfig.variant][1].x,   c.CARD_SLOTS.players.p2[this.gameConfig.variant][1].y,  'cardback').setOrigin(0.5);
        const flop1 = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[0].x,  c.CARD_SLOTS.boards[this.gameConfig.variant].flop[0].y, 'cardback').setOrigin(0.5);
        const flop2 = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[1].x,  c.CARD_SLOTS.boards[this.gameConfig.variant].flop[1].y, 'cardback').setOrigin(0.5);
        const flop3 = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].flop[2].x,  c.CARD_SLOTS.boards[this.gameConfig.variant].flop[2].y, 'cardback').setOrigin(0.5);
        const turn  = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].turn.x,     c.CARD_SLOTS.boards[this.gameConfig.variant].turn.y,    'cardback').setOrigin(0.5);
        const river = this.add.image(c.CARD_SLOTS.boards[this.gameConfig.variant].river.x,    c.CARD_SLOTS.boards[this.gameConfig.variant].river.y,   'cardback').setOrigin(0.5);
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

        p1c1  .data.set('card', this.table.players[0]?.currentHand?.cards[0].name);
        p1c2  .data.set('card', this.table.players[0]?.currentHand?.cards[1].name);
        p2c1  .data.set('card', this.table.players[1]?.currentHand?.cards[0].name);
        p2c2  .data.set('card', this.table.players[1]?.currentHand?.cards[1].name);
        flop1 .data.set('card', this.table.board.flops[0][0].name);
        flop2 .data.set('card', this.table.board.flops[0][1].name);
        flop3 .data.set('card', this.table.board.flops[0][2].name);
        turn  .data.set('card', this.table.board.turns[0]   .name);
        river .data.set('card', this.table.board.rivers[0]  .name);
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

        this.tweens.add({
            targets: turn,
            props: {
                scaleX: { value: 0, duration: 1000, yoyo: true },
                texture: { value: turn.data.get('card'), duration: 0, delay: 1000 }
            },
            ease: 'Linear'
        });

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
