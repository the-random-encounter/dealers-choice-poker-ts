import Table from "./Table";
import Deck from "./Deck";
import Player from './Player';

export default class Game {
    smallBlind: number;
    bigBlind: number;
    pot: number;
    roundName: string = 'Deal'; //Start the first round
    betName: string = 'bet'; //bet,raise,re-raise,cap
    bets: number[] = [];
    roundBets: number[] = [];
    deck: Deck;
    board: any[] = [];
    players: Player[];
    currentPlayerIndex: number;
    table: Table;

    constructor(context: Phaser.Scene, smallBlind: number, bigBlind: number, players: Player[]) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.pot = 0;
        this.roundName = 'Deal';
        this.betName = 'bet';
        this.bets = [];
        this.roundBets = [];
        this.board = [];
        this.deck = new Deck(context, true);
        this.players = players;
        this.table = context.table;
    }

    getMaxBet(bets: number[]) {
        let maxBet, i;
        maxBet = 0;
        for (i = 0; i < bets.length; i += 1) {
            if (bets[i] > maxBet) {
                maxBet = bets[i];
            }
        }
        return maxBet;
    }

    checkForEndOfRound(table: Table) {
        let maxBet: number, endOfRound: boolean;
        endOfRound = true;
        maxBet = this.getMaxBet(table.game.bets);
        //For each player, check
        for (let i = 0; i < this.players.length; i += 1) {
            if (!this.players[i].folded) {
                if (!this.players[i].talked || table.game.bets[i] !== maxBet) {
                    if (!this.players[i].allIn) {
                        this.currentPlayerIndex = i;
                        endOfRound = false;
                    }
                }
            }
        }
        return endOfRound;
    }

    checkForAllInPlayer(winners: number[]) {
        let allInPlayer: number[];
        allInPlayer = [];
        for (let i = 0; i < winners.length; i += 1) {
            if (this.players[winners[i]].allIn) {
                allInPlayer.push(winners[i]);
            }
        }
        return allInPlayer;
    }

    checkForWinner(table: Table) {
        let maxRank = 0.000;
        let winners: number[] = [];
        let part: number = 0;
        let prize: number = 0;
        let allInPlayer: number[] = this.checkForAllInPlayer(winners);
        let minBets, roundEnd;

        //Identify winner(s)
        for (let k = 0; k < this.players.length; k += 1) {
            if (this.players[k].hand!.rank === maxRank && !this.players[k].folded) {
                winners.push(k);
            }
            if (this.players[k].hand!.rank > maxRank && !this.players[k].folded) {
                maxRank = this.players[k].hand!.rank;
                winners.splice(0, winners.length);
                winners.push(k);
            }
        }


        if (allInPlayer.length > 0) {
            minBets = table.game.roundBets[winners[0]];
            for (let j = 1; j < allInPlayer.length; j += 1) {
                if (table.game.roundBets[winners[j]] !== 0 && table.game.roundBets[winners[j]] < minBets) {
                    minBets = table.game.roundBets[winners[j]];
                }
            }
            part = parseInt(minBets, 10);
        } else {
            part = parseInt(table.game.roundBets[winners[0]], 10);

        }
        for (let l = 0; l < table.game.roundBets.length; l += 1) {
            if (table.game.roundBets[l] > part) {
                prize += part;
                table.game.roundBets[l] -= part;
            } else {
                prize += table.game.roundBets[l];
                table.game.roundBets[l] = 0;
            }
        }

        for (let i = 0; i < winners.length; i += 1) {
            let winnerPrize = prize / winners.length;
            let winningPlayer = this.players[winners[i]];
            winningPlayer.chips += winnerPrize;
            if (this.game.roundBets[winners[i]] === 0) {
                winningPlayer.folded = true;
                this.gameWinners.push( {
                    playerName: winningPlayer.playerName,
                    amount: winnerPrize,
                    hand: winningPlayer.hand,
                    chips: winningPlayer.chips
                });
            }
            console.log('player ' + this.players[winners[i]].playerName + ' wins !!');
        }

        roundEnd = true;
        for (let l = 0; l < this.game.roundBets.length; l += 1) {
            if (this.game.roundBets[l] !== 0) {
                roundEnd = false;
            }
        }
        if (roundEnd === false) {
            this.checkForWinner(table);
        }
    }

    checkForBankrupt(table) {
        let i;
        for (i = 0; i < table.players.length; i += 1) {
            if (table.players[i].chips === 0) {
                table.gameLosers.push( table.players[i] );
                console.log('player ' + table.players[i].playerName + ' is going bankrupt');
                table.players.splice(i, 1);
            }
        }
    }
}