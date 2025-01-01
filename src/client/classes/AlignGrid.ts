import Phaser from 'phaser';

export interface AlignGridConfig {
    scene: Phaser.Scene;
    rows?: number;
    cols?: number;
    height?: number;
    width?: number;
}

export default class AlignGrid {
    private scene: Phaser.Scene;
    private config: AlignGridConfig;
    private cw: number;
    private ch: number;
    private graphics?: Phaser.GameObjects.Graphics;

    constructor(config: AlignGridConfig) {
        this.config = config;
        
        if (!config.scene) {
            console.log("missing scene");
            return;
        }

        if (!config.rows) {
            config.rows = 5;
        }
        if (!config.cols) {
            config.cols = 5;
        }
        if (!config.height) {
            config.height = config.scene.game.config.height as number;
        }
        if (!config.width) {
            config.width = config.scene.game.config.width as number;
        }

        this.scene = config.scene;
        //cell width
        this.cw = config.width / config.cols;
        //cell height
        this.ch = config.height / config.rows;
    }

    show(): void {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);

        for (let i = 0; i < this.config.width!; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.config.height!);
        }

        for (let i = 0; i < this.config.height!; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.config.width!, i);
        }

        this.graphics.strokePath();
    }

    placeAt(xx: number, yy: number, obj: Phaser.GameObjects.Graphics): void {
        //calc position based upon the cellwidth and cellheight
        const x = this.cw * xx + this.cw / 2;
        const y = this.ch * yy + this.ch / 2;
        obj.setPosition(x, y);
    }


    placeAtIndex(index: number, obj: any) {
        const yy = Math.floor(index / this.config.cols!);
        const xx = index - (yy * this.config.cols!);
        this.placeAt(xx, yy, obj);
    }
    findNearestIndex(xx, yy) {
        const row = Math.floor(yy / this.ch);
        const col = Math.floor(xx / this.cw);
        console.log("row=" + row);
        console.log("col=" + col);
        const index = (row * this.config.cols!) + col;
        return index;
    }
    getPosByIndex(index) {
        const yy = Math.floor(index / this.config.cols!);
        const xx = index - (yy * this.config.cols!);
        const x2 = this.cw * xx + this.cw / 2;
        const y2 = this.ch * yy + this.ch / 2;
        return {
            x: x2,
            y: y2
        }
    }
    showNumbers() {
        this.show();
        let count = 0;
        for (let i = 0; i < this.config.rows!; i++) {
            for (let j = 0; j < this.config.cols!; j++) {
                const numText = this.scene.add.text(0, 0, count.toString(), {
                    color: '#ff0000'
                });
                numText.setOrigin(0.5, 0.5);
                this.placeAtIndex(count, numText);
                count++;
            }
        }
    }
}