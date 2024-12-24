import { Scene } from 'phaser';
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

export class Game extends Scene
{
    rexUI: RexUIPlugin;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    gameConfig: GameConfig;
    table: Table;
    cards: Phaser.GameObjects.Image[] = [];
    chipsDisplay: Phaser.GameObjects.Text;
    potDisplay: Phaser.GameObjects.Text;
    private actionButtons: Phaser.GameObjects.Text[] = [];
    cardsDealtDebug: boolean = false;
    amountToBet: number = 0;
    formUtil: FormUtil;
    layerUI: Phaser.GameObjects.Layer;
    layerGameUI: Phaser.GameObjects.Layer;
    layerActionButtons: Phaser.GameObjects.Layer;
    layerBettingElements: Phaser.GameObjects.Layer;
    
    client = new Client("ws://localhost:2567");
    playerEntities: {[sessionId: string]: any} = {};
    room: Room;

    constructor ()
    {
        super('Game');
    }

    async create ()
    {

      console.log("Joining room...");

      try {

        this.room = await this.client.joinOrCreate("my_room");
        console.log("Joined successfully!");

        this.room.state.players.onAdd((player, sessionId) => {
          const newPlayer = new Player(sessionId, player.username, player.displayName);;
          this.table.addPlayer(newPlayer);
        });

        this.room.state.players.onRemove((player, sessionId) => {
          
        })

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
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'background').setOrigin(0.5).setAlpha(0.5,0.5,1.0,0.1);

        this.add.image(c.GAME_X_MID, c.GAME_Y_MID, 'table').setOrigin(0.5);

        const player2 = new Player('random2', 'p2', 'Player 2');

        

        this.table.addPlayer(player2);


        // Add UI elements      
        const layerUI = this.createUIElements();
        const layerGameUI = this.createGameUIElements();
        const layerActionButtons = this.createActionButtons();
        const layerBettingElements = this.createBettingElements();

        layerUI.setVisible(true);
        
        const betBtn = layerActionButtons.getAt(2);

        betBtn.on('pointerdown', () => {
          layerBettingElements.setVisible(true);
        });
        if (layerUI) {

          const dealButton      = layerUI.getAt(0);
          const mainMenuButton  = layerUI.getAt(1);
          const evalButton      = layerUI.getAt(2);
          const chipsDebugBtn   = layerUI.getAt(3);

          chipsDebugBtn.on('pointerdown', () => {
            if (this.table.players[0]) {
              this.table.players[0].currentChips += 1000;
            }
        });

          dealButton.on('pointerdown', () => {
            this.table.gameState = GameState.IDLE;
            if (this.table.gameState === GameState.IDLE) {
              this.startNewHand();
              
              if (layerActionButtons)
                layerActionButtons.setVisible(true);
              if (layerGameUI)
                layerGameUI.setVisible(true);
              this.events.emit('newHandBegun');


              for (let i = 0; i < this.table.players.length; i++) {
                const cardHand = this.table.players[i].currentHand;
                console.log(`Player ${i+1} cards:`);
                
                for (const card of cardHand!) {
                  console.log(card.name);
                  const pslot = `p${i+1}`;
                  //const card = this.add.image(c.CARD_SLOTS.players[pslot][this.gameConfig.variant][j].x, c.CARD_SLOTS.players[pslot][this.gameConfig.variant][j].y, 'cardback').setOrigin(0.5);
                  const cardImg = this.add.image(c.GAME_X_MID - (100 * i-1), c.GAME_HEIGHT - 150, 'cardback').setOrigin(0.5).setScale(0.5);

                  this.tweens.add({
                    targets: cardImg,
                    props: {
                      scaleX: { value: 0, duration: 1000, yoyo: true },
                      texture: { value: card.name, duration: 0, delay: 1000 }
                    },
                    ease: 'Linear'
                  });
                }
              }
          }
        });

          evalButton.on('pointerdown', () => {
            if (this.cardsDealtDebug) {
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

              if (p1Eval.value > p2Eval.value)
                console.log('Player 1 wins!');
              else if (p1Eval.value < p2Eval.value)
                console.log('Player 2 wins!');
              else
                console.log('It\'s a tie!');
            }
          }); 

          mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
          });

        }

        if (layerBettingElements) {

          const plusOne         = layerBettingElements.getAt(0) as Phaser.GameObjects.Text;
          const minusOne        = layerBettingElements.getAt(1) as Phaser.GameObjects.Text;
          const plusFive        = layerBettingElements.getAt(2) as Phaser.GameObjects.Text;
          const minusFive       = layerBettingElements.getAt(3) as Phaser.GameObjects.Text;
          const plusTen         = layerBettingElements.getAt(4) as Phaser.GameObjects.Text;
          const minusTen        = layerBettingElements.getAt(5) as Phaser.GameObjects.Text;
          const confirmBet      = layerBettingElements.getAt(6) as Phaser.GameObjects.Text;
          const betInputAmount  = layerBettingElements.getAt(7) as Phaser.GameObjects.Text;
          
          plusOne.on('pointerdown', () => {
          this.amountToBet += 1;
          betInputAmount.text = this.amountToBet.toString();
        });

        minusOne.on('pointerdown', () => {
          this.amountToBet -= 1;
          betInputAmount.text = this.amountToBet.toString();
        });

        plusFive.on('pointerdown', () => {
          this.amountToBet += 5;
          betInputAmount.text = this.amountToBet.toString();
        });

        minusFive.on('pointerdown', () => {
          this.amountToBet -= 5;
          betInputAmount.text = this.amountToBet.toString();
        });

        plusTen.on('pointerdown', () => {
          this.amountToBet += 10;
          betInputAmount.text = this.amountToBet.toString();
        });

        minusTen.on('pointerdown', () => {  
          this.amountToBet -= 10;
          betInputAmount.text = this.amountToBet.toString();
        });

        confirmBet.on('pointerdown', () => {
          this.amountToBet = parseInt(betInputAmount.text);
          const player = this.table.players[this.table.activePlayerIndex];
          const betAmt = this.amountToBet;
          if (player.placeBet(betAmt)) {
            this.table.currentBet = betAmt;
            this.table.processBettingRound();
            this.toggleBetButtonVisibility();
            this.amountToBet = 0;
            this.events.emit('playerActionsComplete');
          }
        });
        }
        // Add event listener for player actions completion
        this.events.on('playerActionsComplete', () => {
          console.log(`Event emitted: playerActionsComplete !`);

            if (this.table.players[this.table.activePlayerIndex].currentBet > 0)
              this.table.collectBet(this.table.players[this.table.activePlayerIndex]);

            // Move to next player
            this.table.activePlayerIndex = this.table.getNextActivePlayer();

            // Check if betting round is complete after player action
            if (this.table.isBettingComplete()) {
                this.events.emit('bettingRoundComplete');
            }
            this.actionButtons.forEach(button => button.setVisible(false));
            this.updateUI();
        });
        this.events.on('newHandBegun', () => {
          console.log(`Event emitted: newHandBegun !`);
            this.updateUI();
            this.table.clearTable();
            this.table.gameState = GameState.DEALING;
            this.table.dealCards(this);
        });

        this.events.on('bettingRoundComplete', () => {
          console.log(`Event emitted: bettingRoundComplete !`);
            // Collect bets into pot
            this.table.collectBets();

            // Hide action buttons during phase transition

            switch (this.table.gameState) {
                case GameState.PREFLOP:
                    this.table.gameState = GameState.FLOP;
                    this.table.dealCards(this);
                    break;
                case GameState.FLOP:
                    this.table.gameState = GameState.TURN;
                    this.table.dealCards(this);
                    break;
                case GameState.TURN:
                    this.table.gameState = GameState.RIVER;
                    this.table.dealCards(this);
                    break;
                case GameState.RIVER:
                    this.table.gameState = GameState.SHOWDOWN;
                    this.table.determineWinner();
                    this.table.gameState = GameState.IDLE;
                    return;
            }
            
            // Reset for next betting round
            this.table.activePlayerIndex = 0;
            this.table.currentBet = 0;
            this.showActionButtons();
        });

        // Clean up event handlers
        this.events.on('playerActionsComplete', () => {
          // Process current player's action and move to next player/phase
          this.table.processBettingRound();
          
          // Update UI based on game state
          if (this.table.gameState === GameState.SHOWDOWN) {
            this.actionButtons.forEach(btn => btn.setVisible(false));
          } else if (!this.table.isBettingComplete()) {
            this.showActionButtons();
          }
          
          this.updateUI();
          this.renderCards();
        });
    
        this.events.on('newHandBegun', () => {
          this.table.startNewHand();
          this.showActionButtons();
          this.updateUI();
          this.renderCards();
        });

        // Add event listener for updating player actions
        this.events.on('updatePlayerActions', (validActions: PlayerAction[]) => {
          // Show/hide action buttons based on valid actions
          this.actionButtons.forEach(button => {
            const action = button.text as PlayerAction;
            button.setVisible(validActions.includes(action));
          });
          
          // Update UI to show current player
          this.updateCurrentPlayerIndicator();
        });

        } catch (e) {
        console.error(e);
      }
    }

    update() {

      if (this.table) {
        this.chipsDisplay.text = this.table.players[0].currentChips.toString();
        this.potDisplay.text = this.table.pot.toString();
      }
    }

    private startNewHand(): void {
        this.table.clearTable();
        this.table.dealCards(this);
        this.table.gameState = GameState.DEALING;
        this.table.dealCards(this);
        
        // Post blinds
        this.table.players[this.table.smallBlindToken].placeBet(this.table.smallBlindAmount);
        this.table.players[this.table.bigBlindToken].placeBet(this.table.bigBlindAmount);
        
        this.table.gameState = GameState.PREFLOP;
        this.showActionButtons();
    }


    private updateUI(): void {
        // Update chip counts, pot size, current bet, etc.
        if (this.table) {
          this.chipsDisplay.text = `${this.table.players[0].currentChips}`;
        }
        // Add more UI updates as needed
    }

    private showActionButtons(): void {
        this.actionButtons.forEach(button => button.setVisible(true));
    }

    private toggleBetButtonVisibility(): void {
      
      this.layerBettingElements.visible = !this.layerBettingElements.visible;

    }

    textAreaChanged() {
        var text = this.formUtil.getTextAreaValue("area51");
        console.log(text);
    }

    createUIElements(): Phaser.GameObjects.Layer {

      const dealButton = this.add.text(c.GAME_WIDTH-100,50, 'DEAL', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#FF0000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive( { useHandCursor: true } )//.setVisible(false);

      const mainMenuButton = this.add.text(c.GAME_WIDTH - 250, 100, "Menu", {
          fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
          stroke: '#00ffff', strokeThickness: 6,
          align: 'center'
      }).setOrigin(0.5).setInteractive( { useHandCursor: true } )//.setVisible(false);

      const evalButton = this.add.text(c.GAME_WIDTH-100, 200, 'EVAL', {
          fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
          stroke: '#FF0000', strokeThickness: 6,
          align: 'center'
      }).setOrigin(0.5).setInteractive( { useHandCursor: true } )//.setVisible(false);

      const chipsDebugBtn = this.add.text(150, c.GAME_HEIGHT-100, "Add Chips", {
          fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
          stroke: '#00ffff', strokeThickness: 6,
          align: 'center'
      }).setOrigin(0.5).setInteractive( { useHandCursor: true } )//.setVisible(false);
    
      

      const layerUI = this.add.layer();
      layerUI.add([dealButton, mainMenuButton, evalButton, chipsDebugBtn]);
      layerUI.setVisible(false);
      
      return layerUI;
    }

    createGameUIElements(): Phaser.GameObjects.Layer {
        
        const chipsLabel = this.add.text(25, 25, 'Chips: ', {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
            align: 'left'
        }).setOrigin(0.0)//.setVisible(false);

        const potLabel = this.add.text(25, 60, 'Pot Size: ', {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, fontStyle: 'bold',
            align: 'left'
        }).setOrigin(0.0)//.setVisible(false);

        this.chipsDisplay = this.add.text(150, 28, `${this.table.players[0].currentChips.toString()}`, {
            fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'left'
        }).setOrigin(0.0)//.setVisible(false);
        
        this.potDisplay = this.add.text(200, 63, `${this.table.pot.toString()}`, {
          fontFamily: 'Courier New', fontSize: 30, color: '#ffffff',
          stroke: '#000000', strokeThickness: 3,
          align: 'left'
        }).setOrigin(0.0)//.setVisible(false);

        const layerGameUI = this.add.layer();
        layerGameUI.add([chipsLabel, potLabel, this.chipsDisplay, this.potDisplay]);
        layerGameUI.setVisible(false);

        return layerGameUI;
    }

    createActionButtons(): Phaser.GameObjects.Layer {

        const checkButton = this.add.text(400, c.GAME_HEIGHT - 50, 'Check', {
          font: 'Tahoma', fontSize: 24, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })//.setVisible(false);
        
        const callButton = this.add.text(550, c.GAME_HEIGHT - 50, 'Call', {
          font: 'Tahoma', fontSize: 24, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })//.setVisible(false);

        const betButton = this.add.text(700, c.GAME_HEIGHT - 50, 'Bet', {
          font: 'Tahoma', fontSize: 24, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const raiseButton = this.add.text(850, c.GAME_HEIGHT - 50, 'Raise', {
          font: 'Tahoma', fontSize: 24, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })//
        const foldButton = this.add.text(1000, c.GAME_HEIGHT - 50, 'Fold', {
          font: 'Tahoma', fontSize: 24, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })//.setVisible(false);

        const layerActionButtons = this.add.layer();
        layerActionButtons.add([checkButton, callButton, betButton, raiseButton, foldButton]);
        layerActionButtons.setVisible(false);

        return layerActionButtons;

        
    }

    createBettingElements(): Phaser.GameObjects.Layer {

      const plusOne: Phaser.GameObjects.Text = this.add.text(725, c.GAME_HEIGHT - 200, '+1', {
            font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);

        const minusOne = this.add.text(675, c.GAME_HEIGHT - 200, '-1', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);

        const plusFive = this.add.text(725, c.GAME_HEIGHT - 150, '+5', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'         
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);

        const minusFive = this.add.text(675, c.GAME_HEIGHT - 150, '-5', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);
        
        const plusTen = this.add.text(725, c.GAME_HEIGHT - 100, '+10', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);

        const minusTen = this.add.text(675, c.GAME_HEIGHT - 100, '-10', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})//.setVisible(false);
    
        const betInputAmount: Phaser.GameObjects.Text = this.add.text(700, c.GAME_HEIGHT - 250, this.amountToBet.toString(), {
          font: 'Courier New', fontSize: 32, backgroundColor: '#444', color: '#fff', stroke: '#00ffff', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5)//.setVisible(false);

        const confirmBet = this.add.text(755, c.GAME_HEIGHT - 150, 'Confirm', {
          font: 'Courier New', fontSize: 24, backgroundColor: '#444', color: '#fff', stroke: '#000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5)//.setVisible(false);

        const layerBettingElements = this.add.layer();
        layerBettingElements.add([plusOne, minusOne, plusFive, minusFive, plusTen, minusTen, confirmBet, betInputAmount]);
        layerBettingElements.setVisible(false);

        return layerBettingElements;
    }

    private handlePlayerAction(action: PlayerAction): void {
      const player = this.table.players[this.table.activePlayerIndex];
      let actionSuccessful = false;
  
      switch (action) {
        case 'Check':
          if (this.table.canPlayerCheck(player)) {
            player.checkBet();
            player.hasCalledBet = true;
            actionSuccessful = true;
          }
          break;
  
        case 'Call':
          if (this.table.canPlayerCall(player)) {
            const callAmount = this.table.currentBet - player.currentBet;
            if (player.placeBet(callAmount)) {
              player.hasCalledBet = true;
              actionSuccessful = true;
            }
          }
          break;
  
        case 'Bet':
        case 'Raise':
          if (this.table.canPlayerRaise(player)) {
            this.showBetControls();
            return; // Wait for bet amount confirmation
          }
          break;
  
        case 'Fold':
          player.fold();
          actionSuccessful = true;
          break;
      }
  
      if (actionSuccessful) {
        this.table.processBettingRound();
        this.updateUI();
      }
    }
  
    private updateCurrentPlayerIndicator(): void {
      // Add visual indicator for current player (e.g., highlight, arrow, etc.)
      const currentPlayer = this.table.players[this.table.activePlayerIndex];
      
      // Update player info display
      this.updatePlayerInfo(currentPlayer);
      
      // Highlight current player's position
      this.highlightActivePlayer();
    }
  
    private renderCards(): void {
      // Clear existing cards
      this.cards.forEach(card => card.destroy());
      this.cards = [];
  
      // Render cards based on game state
      switch (this.table.gameState) {
        case GameState.DEALING:
        case GameState.PREFLOP:
          this.renderPlayerCards();
          break;
        case GameState.FLOP:
          this.renderPlayerCards();
          this.renderFlop();
          break;
        case GameState.TURN:
          this.renderPlayerCards();
          this.renderFlop();
          this.renderTurn();
          break;
        case GameState.RIVER:
        case GameState.SHOWDOWN:
          this.renderPlayerCards();
          this.renderFlop();
          this.renderTurn();
          this.renderRiver();
          break;
      }
    }
    
    private renderPlayerCards(): void {
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            if (player.currentHand) {
                const pslot = `p${i+1}`;
                player.currentHand.cards.forEach((card, j) => {
                    const cardImage = this.add.image(
                        c.CARD_SLOTS.players[pslot][this.gameConfig.variant][j].x,
                        c.CARD_SLOTS.players[pslot][this.gameConfig.variant][j].y,
                        // Only show card face for player 1, others show cardback
                        i === 0 ? card.name : 'cardback'
                    ).setOrigin(0.5);
                    this.cards.push(cardImage);
                });
            }
        }
    }

    private renderFlop(): void {
        if (this.table.board.flops[0]) {
            this.table.board.flops[0].forEach((card, i) => {
                const cardImage = this.add.image(
                    c.CARD_SLOTS.boards[this.gameConfig.variant].flop[i].x,
                    c.CARD_SLOTS.boards[this.gameConfig.variant].flop[i].y,
                    card.name
                ).setOrigin(0.5);
                this.cards.push(cardImage);
            });
        }
    }

    private renderTurn(): void {
        if (this.table.board.turns[0]) {
            const cardImage = this.add.image(
                c.CARD_SLOTS.boards[this.gameConfig.variant].turn.x,
                c.CARD_SLOTS.boards[this.gameConfig.variant].turn.y,
                this.table.board.turns[0].name
            ).setOrigin(0.5);
            this.cards.push(cardImage);
        }
    }

    private renderRiver(): void {
        if (this.table.board.rivers[0]) {
            const cardImage = this.add.image(
                c.CARD_SLOTS.boards[this.gameConfig.variant].river.x,
                c.CARD_SLOTS.boards[this.gameConfig.variant].river.y,
                this.table.board.rivers[0].name
            ).setOrigin(0.5);
            this.cards.push(cardImage);
        }
    }

    private showBetControls(): void {
        this.layerBettingElements.setVisible(true);
        // Hide action buttons while betting
        this.actionButtons.forEach(button => button.setVisible(false));
    }

    private updatePlayerInfo(player: Player): void {
        // Update chips display
        this.chipsDisplay.setText(player.currentChips.toString());
        
        // Update pot display
        this.potDisplay.setText(this.table.pot.toString());

        // Could add additional player info here (name, status, etc.)
    }

    private highlightActivePlayer(): void {
        // Remove any existing highlights
        this.cards.forEach(cardImg => cardImg.setTint(0xffffff));

        // Highlight active player's cards
        const activePlayer = this.table.activePlayerIndex;
        const pslot = `p${activePlayer + 1}`;
        
        this.cards.forEach(cardImg => {
            const cardPos = cardImg.getTopLeft();
            const slotPositions = c.CARD_SLOTS.players[pslot][this.gameConfig.variant];
            
            // Check if this card belongs to active player
            if (slotPositions.some(pos => pos.x === cardPos.x && pos.y === cardPos.y)) {
                cardImg.setTint(0x00ff00); // Green tint for active player
            }
        });
    }

    private playDealAnimation(cardImage: Phaser.GameObjects.Image, targetX: number, targetY: number): void {
        // Start from deck position
        cardImage.setPosition(c.GAME_WIDTH - 100, c.GAME_HEIGHT - 100);
        cardImage.setScale(0.5);

        this.tweens.add({
            targets: cardImage,
            x: targetX,
            y: targetY,
            scale: 1,
            duration: 500,
            ease: 'Power2'
        });
    }
}