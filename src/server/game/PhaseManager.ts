import { GamePhases, DealingPhases } from '../utils/types';
import GameManager from './GameManager';


export default class PhaseManager {
  private gameManager: GameManager;
  private currentPhase: string;
  private phases: GamePhases;
  private currentPhaseIndex: number = 0;
  private dealingPhase: DealingPhases;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
    this.currentPhaseIndex = 0;
    this.currentPhase = GamePhases.WAITING;
    this.dealingPhase = DealingPhases.PREFLOP;

  }

}