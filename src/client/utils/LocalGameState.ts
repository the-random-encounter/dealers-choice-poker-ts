

import { Player, Card, GamePhases } from './types';

export default interface LocalGameState {
    currentPhase: GamePhases | string;
    pot: number;
    currentBet: number;
    activePlayerIndex: number;
    dealerIndex: number;
    players: Player[];
    communityCards: Card[] | string[];
    roundInProgress: boolean;
    minPlayers: number;
    smallBlind: number;
    bigBlind: number;
}