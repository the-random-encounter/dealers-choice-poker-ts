import Table from "./Table";
import Deck from "./Deck";
import Player from './Player';
import Sidepot from './Sidepot';

export default class Round {
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
    sidepots: Sidepot[] = [];

    constructor(context: Phaser.Scene, table, smallBlind: number, bigBlind: number, players: Player[]) {
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
        this.table = table;
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
        maxBet = this.getMaxBet(this.bets);
        //For each player, check
        for (let i = 0; i < (this.players as Player[]).length; i += 1) {
            if (!this.players[i].folded) {
                if (!this.players[i].talked || table.currentRound.bets[i] !== maxBet) {
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
        let part: number;
        let prize: number = 0;
        let allInPlayer: number[] = this.checkForAllInPlayer(winners);
        let minBets, roundEnd;

        //Identify winner(s)
        for (let k = 0; k < (this.players as Player[]).length; k += 1) {
            if (this.players[k].cards!.rank === maxRank && !this.players[k].folded) {
                winners.push(k);
            }
            if (this.players[k].cards!.rank > maxRank && !this.players[k].folded) {
                maxRank = this.players[k].cards!.rank;
                winners.splice(0, winners.length);
                winners.push(k);
            }
        }


        if (allInPlayer.length > 0) {
            minBets = table.currentRound.roundBets[winners[0]];
            for (let j = 1; j < allInPlayer.length; j += 1) {
                if (table.currentRound.roundBets[winners[j]] !== 0 && table.currentRound.roundBets[winners[j]] < minBets) {
                    minBets = table.currentRound.roundBets[winners[j]];
                }
            }
            part = parseInt(minBets, 10);
        } else {
            part = parseInt(String(table.currentRound.roundBets[winners[0]]), 10);

        }
        for (let l = 0; l < table.currentRound.roundBets.length; l += 1) {
            if (table.currentRound.roundBets[l] > part) {
                prize += part;
                table.currentRound.roundBets[l] -= part;
            } else {
                prize += table.currentRound.roundBets[l];
                table.currentRound.roundBets[l] = 0;
            }
        }

        for (let i = 0; i < winners.length; i += 1) {
            let winnerPrize: number = prize / winners.length;
            let winningPlayer: Player = this.players[winners[i]];
            winningPlayer.chips += winnerPrize;
            if (this.roundBets[winners[i]] === 0) {
                winningPlayer.folded = true;
                table.currentRoundWinners.push( {
                    playerName: winningPlayer.username,
                    amount: winnerPrize,
                    hand: winningPlayer.cards,
                    chips: winningPlayer.chips
                });
            }
            console.log(`player '${this.players[winners[i]].username}' wins !!`);
        }

        roundEnd = true;
        for (let l = 0; l < this.roundBets.length; l += 1) {
            if (this.roundBets[l] !== 0) {
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