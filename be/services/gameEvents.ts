/**
 * Central event emitter for game system communication
 * Prevents circular dependencies between services
 */
import { EventEmitter } from 'events';
import { IPlayer } from '../models/Player';

// Event type definitions
export interface GameEvents {
  // Activity events
  'activity:completed': (data: {
    player: IPlayer;
    activityId: string;
    xpGained: number;
    loot: any[];
  }) => void;

  // Combat events
  'combat:victory': (data: {
    player: IPlayer;
    monsterId: string;
    xpGained: number;
    loot: any[];
  }) => void;

  'combat:defeat': (data: {
    player: IPlayer;
    monsterId: string;
  }) => void;

  // Crafting events
  'crafting:completed': (data: {
    player: IPlayer;
    recipeId: string;
    outputItem: any;
  }) => void;

  // Quest events
  'quest:objectiveCompleted': (data: {
    player: IPlayer;
    questId: string;
    objectiveId: string;
  }) => void;
}

class GameEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase if needed
  }

  // Type-safe emit
  emitGameEvent<K extends keyof GameEvents>(
    event: K,
    data: Parameters<GameEvents[K]>[0]
  ): boolean {
    return this.emit(event, data);
  }

  // Type-safe listener
  onGameEvent<K extends keyof GameEvents>(
    event: K,
    listener: GameEvents[K]
  ): this {
    return this.on(event, listener);
  }
}

export const gameEvents = new GameEventEmitter();
