import Phaser from 'phaser';
import Card from '../classes/Card';
import Deck from '../classes/Deck';
import Hand from '../classes/Hand';
import { HandType } from '../utils/types';
import { evaluateHand } from '../utils/functions';
import * as CONSTS from '../utils/constants';

const c = CONSTS;

export class Debug extends Phaser.Scene {
  constructor() {
    super({key: 'Debug'});
  }
  
  camera: Phaser.Cameras.Scene2D.Camera;
  private deck: Deck;
  playerCards: Hand;
  evaluateText: string;

  create() {

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.deck = new Deck();
    this.deck.shuffleDeck();

    const dealButton = this.add.text(c.GAME_X_MID,450, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();
        
    dealButton.on('pointerdown', () => {
      if (this.deck.cards.length < 5) {
        console.log('Not enough cards in the deck to deal a new hand. Regenerating and shuffling the deck.');
        this.shuffleDebug(this.deck);
      }
      const cards = this.dealDebug(this.deck);
      this.playerCards = new Hand(cards);
    });

    const evalMsg = this.add.text(c.GAME_X_MID, 200, this.evaluateText, {
      fontFamily: 'Arial Black', fontSize: 50, color: '#000000',
      stroke: '#FFFFFF', strokeThickness: 2,
      align: 'center'
    })
    const evalButton = this.add.text(c.GAME_X_MID, 550, 'Evaluate', {
      fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
      stroke: '#FF0000', strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    evalButton.on('pointerdown', () => {
      const evalMsg = evaluateHand(this.playerCards);
      this.evaluateText = evalMsg;
      console.log(evalMsg);
    });

    const shuffleButton = this.add.text(c.GAME_X_MID, 350, 'SHUFFLE', {
      fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
      stroke: '#888888', strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    shuffleButton.on('pointerdown', () => {
      this.shuffleDebug(this.deck);
      console.log(`Deck reshuffled. It now contains ${this.deck.cards.length} cards again.`);
    });
  }

  update() {
    //evalMsg.text = this.evaluateText;
    
    //this.deck.shuffleDeck();

  }

  shuffleDebug(deck: Deck) {
    deck.regenerateDeck();
    deck.shuffleDeck();
  }

  dealDebug(deck: Deck): HandType {
    let cardArray: Card[] = [];
    if (deck.cards.length < 5) {
      console.log('Not enough cards in the deck to deal a new hand.');
      return cardArray;
    }
    for (let i = 0; i < 5; i++) {
      const card = deck.cards.pop();
      if (card) {
        cardArray.push(card); // Ensure cards are added to cardArray
        let cardImg = this.add.image(100 + (200 * i), 800, card.name);

        cardImg.setDataEnabled();
        cardImg.data.set('name', card.name);
        cardImg.data.set('fullName', card.printFullName());

        console.log(`Card Dealt: ${card.printFullName()} - Cards Left in Deck: ${deck.cards.length}`);
      }
    }
    return cardArray; // Return the populated cardArray
  }
}
