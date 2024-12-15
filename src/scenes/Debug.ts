import Phaser from 'phaser';
import Card from '../classes/Card';
import Deck from '../classes/Deck';
import Hand from '../classes/Hand';
import { HandType, HandEvaluation } from '../utils/types';
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
  private testCaseNum: number = 0;
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
      const evalResponse: HandEvaluation = evaluateHand(this.playerCards);
      this.evaluateText = evalResponse.string;
      console.log(`Hand: ${evalResponse.string} | ${evalResponse.value}`);
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

    const testCaseBtn = this.add.text(c.GAME_X_MID, 100, 'TEST CASES', {
      fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
      stroke: '#888888', strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    testCaseBtn.on('pointerdown', () => {
      const cards = this.dealTestCases();
      this.playerCards = new Hand(cards);
      this.testCaseNum++;
      if (this.testCaseNum > 10) this.testCaseNum = 0;
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

  dealTestCases(): HandType {

    
    const testCases = [
    [new Card('AH'), new Card('KH'), new Card('QH'), new Card('JH'), new Card('TH') ], 
    [new Card('7D'), new Card('4D'), new Card('6D'), new Card('8D'), new Card('5D') ],
    [new Card('3S'), new Card('TD'), new Card('3D'), new Card('3H'), new Card('3C') ],
    [new Card('QC'), new Card('9S'), new Card('QD'), new Card('9C'), new Card('QS') ],
    [new Card('8C'), new Card('4D'), new Card('5H'), new Card('7C'), new Card('6S') ],
    [new Card('4C'), new Card('2D'), new Card('AH'), new Card('5D'), new Card('3C') ],
    [new Card('QH'), new Card('3H'), new Card('8H'), new Card('TH'), new Card('4H') ],
    [new Card('6C'), new Card('2C'), new Card('6D'), new Card('9S'), new Card('6H') ],
    [new Card('AS'), new Card('4H'), new Card('7C'), new Card('7S'), new Card('4D') ],
    [new Card('AH'), new Card('AD'), new Card('KD'), new Card('3C'), new Card('5S') ],
    [new Card('QS'), new Card('6C'), new Card('7D'), new Card('JH'), new Card('5D') ]]

    for (let i = 0; i < 5; i++) {
      const card = testCases[this.testCaseNum][i];
      if (card) {
        let cardImg = this.add.image(100 + (200 * i), 800, card.name);

        cardImg.setDataEnabled();
        cardImg.data.set('name', card.name);
        cardImg.data.set('fullName', card.printFullName());

        console.log(`Card Dealt: ${card.printFullName()}`);
      }
    }
    return testCases[this.testCaseNum];
  }
}
