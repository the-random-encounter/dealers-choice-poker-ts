import Phaser from 'phaser';
import Card from '../classes/Card';
import Deck from '../classes/Deck';
import Hand from '../classes/Hand';
import { Hand as HandType } from '../utils/types';
import { evaluateHand } from '../utils/cardFunctions';
import * as CONSTS from '../utils/constants';

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

    const dealButton = this.add.text(300,450, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();
        
    dealButton.on('pointerdown', () => {
      const cards = this.dealDebug(this.deck);
      this.playerCards = new Hand(cards);
      //const c1 = this.add.image(200, 900, cards[0].name);
    });

    const evalMsg = this.add.text(CONSTS.GAME_X_MID, 200, this.evaluateText, {
      fontFamily: 'Arial Black', fontSize: 50, color: '#000000',
      stroke: '#FFFFFF', strokeThickness: 2,
      align: 'center'
    })
    const evalButton = this.add.text(600, 450, 'Evaluate', {
      fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
      stroke: '#FF0000', strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    evalButton.on('pointerdown', () => {
      this.evaluateText = evaluateHand(this.playerCards);
    });
  }

  update() {
    
    
    //this.deck.shuffleDeck();

  }

  shuffleDebug(deck: Deck) {
    deck.regenerateDeck();
    deck.shuffleDeck();
  }

  dealDebug(deck: Deck): Card[] {
    let cardArray: Card[] = [];
    for (let i = 0; i < 5; i++) {
      const card = deck.cards.pop();
      if (card) {
        cardArray.push(card);
        let cardImg = this.add.image(100 + (200*i), 800, card.name);

        cardImg.setDataEnabled();
        cardImg.data.set('name', card.name);
        cardImg.data.set('fullName', card.printFullName());

        //const text = this.add.text(cardImg.x-75, cardImg.y+120+(i*25), '', { font: '32px Courier', color: '#ffffff' });
        //text.setText(cardImg.data.get('fullName'));

      }
      console.log(`Card Dealt: ${cardArray[i].printFullName()} - Cards Left in Deck: ${deck.cards.length}`);
    }
    return cardArray;
  }
}

