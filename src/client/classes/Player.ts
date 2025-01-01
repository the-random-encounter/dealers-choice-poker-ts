import Hand from './Hand';
import Table from './Table';
import { progress } from '../utils/functions';
import { LastActions, Actions, PlayerAction } from '../utils/types';


export default class Player {
  sessionId: string;
  username: string;
  userID: number;
  displayName: string;
  chips: number;
  folded: boolean;
  allIn: boolean;
  talked: boolean;
  table: Table;
  cards: Hand;
  bet: number;
  lastAction: LastActions;
  action: Actions;

  constructor(playerName: string, chips = 0, table: Table)
  {
    this.username = playerName;
    this.userID = this.generateNewUserID();
    this.displayName = playerName;
    this.chips = chips;
    this.folded = false;
    this.allIn = false;
    this.talked = false;
    this.table = table; //Circular reference to allow reference back to parent object.
    this.cards = new Hand([]);
  }

  private generateNewUserID(): number {
    return Math.floor(Math.random() * 1000000);
  }

  getChips(cash) {
    this.chips += cash;
  };

// Player actions: Check(), Fold(), Bet(bet), Call(), AllIn()
  /**
    Check() {
      let checkAllow = true;
  
      for (let v = 0; v < this.table.currentRound.bets.length; v += 1) {
        if (this.table.currentRound.bets[v] !== 0) {
          checkAllow = false;
        }
      }
      if (checkAllow) {
        for (let i = 0; i < (this.table.players as Player[]).length; i += 1) {
          if (this.username === this.table.players[this.username].username) {
            this.table.currentRound.bets[i] = 0;
            this.talked = true;
          }
        }
        //Attempt to progress the game
        this.turnBet = {action: "check", playerName: this.username}
        progress(this.table);
      } else {
        console.log(`Check not allowed, replay please`);
      }
    };
  
   Fold() {
      let bet;
      //Move any current bet into the pot
      for (let i = 0; i < this.table.players.length; i += 1) {
        if (this === this.table.players[i]) {
          bet = this.table.currentRound.bets[i];
          this.table.currentRound.bets[i] = 0;
          this.table.currentRound.pot += bet;
          this.talked = true;
        }
      }
      //Mark the player as folded
      this.folded = true;
      this.turnBet = {action: "fold", playerName: this.username}
  
      //Attempt to progress the game
      progress(this.table);
    };
  
    Bet(bet) {
  
      if (this.chips > bet) {
        for (let i = 0; i < this.table.players.length; i += 1) {
          if (this === this.table.players[i]) {
            this.table.currentRound.bets[i] += bet;
            this.table.players[i].chips -= bet;
            this.talked = true;
          }
        }
  
        //Attempt to progress the game
        this.turnBet = {action: "bet", playerName: this.username, amount: bet}
        progress(this.table);
      } else {
        console.log(`You don't have enough chips --> ALL IN !!!`);
        this.AllIn();
      }
    };
  
    Call() {
      let maxBet = this.table.currentRound.getMaxBet(this.table.currentRound.bets);
      if (this.chips > maxBet) {
        //Match the highest bet
        for (let i = 0; i < this.table.players.length; i += 1) {
          if (this === this.table.players[i]) {
            if (this.table.currentRound.bets[i] >= 0) {
              this.chips += this.table.currentRound.bets[i];
            }
            this.chips -= maxBet;
            this.table.currentRound.bets[i] = maxBet;
            this.talked = true;
          }
        }
        //Attempt to progress the game
        this.turnBet = {action: "call", playerName: this.username, amount: maxBet}
        progress(this.table);
      } else {
        console.log(`You don't have enough chips --> ALL IN !!!`);
        this.AllIn();
      }
    };
  
    AllIn() {
      let allInValue: number = 0;
      for (let i = 0; i < this.table.players.length; i += 1) {
        if (this === this.table.players[i]) {
          if (this.table.players[i].chips !== 0) {
            allInValue = this.table.players[i].chips;
            this.table.currentRound.bets[i] += this.table.players[i].chips;
            this.table.players[i].chips = 0;
  
            this.allIn = true;
            this.talked = true;
          }
        }
      }
  
      //Attempt to progress the game
      this.turnBet = {action: "allin", playerName: this.username, amount: allInValue}
      progress(this.table);
    }
  */

}

/*
export default class Player extends Top {

  userID: integer;
  username: string;
  displayName: string;
  sessionId: string;
  wallet: number;
  currentTableID?: number;
  table?: Table;
  currentChips: integer = 0;
  currentDealer: boolean;
  currentBlind?: BlindType;
  currentHand?: Hand;
  isFolded: boolean = false;
  currentBet: number = 0;
  lastAction: PlayerAction;
  hasPostedBlind: boolean = false;
  hasCalledBet: boolean = false;
  hasRaised: boolean = false;

  constructor(sessionId: string,username: string, displayName: string) {
    super();
    this.username = username;
    this.sessionId = sessionId;
    this.displayName = displayName;
    this.wallet = 0;
    this.currentChips = 0;
  }

  placeBet(amount: number): boolean {
    if (amount > this.currentChips) return false;
    else {
      this.currentChips -= amount;
      this.currentBet += amount;
      this.lastAction = 'Bet';
      return true;
    }
  }

  checkBet(): boolean {
    this.lastAction = 'Check';
    return true;
  }

  fold(): void {
    this.isFolded = true;
    this.lastAction = 'Fold';
  }

  resetBets(): void {
    this.currentBet = 0;
    this.isFolded = false;
  }

  postBlind(type: BlindType): boolean {
    
    if (type == 'small') {
      if (this.currentChips < this.table!.smallBlindAmount) return false;
        this.currentChips  -= this.table!.smallBlindAmount;
        this.currentBet    += this.table!.smallBlindAmount;
        this.hasPostedBlind = true;
    } else if (type == 'big') {
      if (this.currentChips < this.table!.bigBlindAmount) return false;
        this.currentChips  -= this.table!.bigBlindAmount;
        this.currentBet    += this.table!.bigBlindAmount;
        this.hasPostedBlind = true;
    } else if (type === 'none') {
      this.hasPostedBlind = true;
    }
    return true;
  }

}*/
