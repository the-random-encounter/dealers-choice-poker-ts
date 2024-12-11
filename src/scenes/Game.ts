import { Scene } from 'phaser';
import Deck from '../classes/Deck';
//import Card from '../Card';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.add.image(512, 384, 'table');
        const dealButton = this.add.text(800,50, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        dealButton.on('pointerdown', () => {
            const deck = new Deck();
            
            for (const card of deck)
              console.log(card.name);
            
            deck.shuffleDeck();

            console.log(`----------------------------------------------------------------\mSHUFFLED THE DECK\n----------------------------------------------------------------`);

            for (const card of deck)
              console.log(card.name);
        })
    }
}
