import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Quest, ActiveQuest, QuestRewards } from '@shared/types';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  private apiUrl = `${environment.apiUrl}/quests`;
  private socket: Socket | null = null;
  private notificationService = inject(NotificationService);

  // Observable state for quest data
  private activeQuestsSubject = new BehaviorSubject<ActiveQuest[]>([]);
  public activeQuests$ = this.activeQuestsSubject.asObservable();

  private availableQuestsSubject = new BehaviorSubject<Quest[]>([]);
  public availableQuests$ = this.availableQuestsSubject.asObservable();

  private completedQuestsSubject = new BehaviorSubject<Quest[]>([]);
  public completedQuests$ = this.completedQuestsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Initialize WebSocket connection for real-time quest updates
   */
  initializeSocket(token: string): void {
    if (this.socket) {
      return; // Already connected
    }

    this.socket = io(environment.apiUrl.replace('/api', ''), {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.loadAllQuests(); // Load initial data
    });

    // Listen for quest updates
    this.socket.on('quest:accepted', (data: any) => {
      this.notificationService.quest('Quest Accepted', `You have accepted: ${data.quest?.questId || 'New Quest'}`);
      this.loadActiveQuests();
    });

    this.socket.on('quest:update', (data: any) => {
      // Show notification for objective progress
      if (data.objective) {
        const progressText = `${data.objective.current}/${data.objective.required}`;
        this.notificationService.quest('Quest Progress', `Objective updated: ${progressText}`);
      }
      this.loadActiveQuests();
    });

    this.socket.on('quest:completed', (data: any) => {
      this.notificationService.quest('Quest Complete!', 'All objectives completed. Return to quest giver for rewards!');
      this.loadActiveQuests();
    });

    this.socket.on('quest:rewarded', (data: any) => {
      const rewardText = data.rewards?.gold ? `${data.rewards.gold} gold` : 'rewards';
      this.notificationService.success('Quest Rewarded!', `You have received ${rewardText}!`, 8000);
      this.loadAllQuests(); // Reload all lists
    });

    this.socket.on('quest:abandoned', (data: any) => {
      this.notificationService.warning('Quest Abandoned', `You have abandoned the quest.`);
      this.loadActiveQuests();
    });

    this.socket.on('quest:error', (error: any) => {
      console.error('Quest error:', error);
      this.notificationService.error('Quest Error', error.message || 'An error occurred');
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Load all quest lists
   */
  loadAllQuests(): void {
    this.loadActiveQuests();
    this.loadAvailableQuests();
    this.loadCompletedQuests();
  }

  /**
   * Get active quests (HTTP)
   */
  loadActiveQuests(): void {
    this.http.get<{ quests: ActiveQuest[]; count: number }>(`${this.apiUrl}/active`)
      .subscribe({
        next: (response) => {
          this.activeQuestsSubject.next(response.quests);
        },
        error: (error) => console.error('Error loading active quests:', error)
      });
  }

  /**
   * Get available quests (HTTP)
   */
  loadAvailableQuests(): void {
    this.http.get<{ quests: Quest[]; count: number }>(`${this.apiUrl}/available`)
      .subscribe({
        next: (response) => {
          this.availableQuestsSubject.next(response.quests);
        },
        error: (error) => console.error('Error loading available quests:', error)
      });
  }

  /**
   * Get completed quests (HTTP)
   */
  loadCompletedQuests(): void {
    this.http.get<{ quests: Quest[]; count: number }>(`${this.apiUrl}/completed`)
      .subscribe({
        next: (response) => {
          this.completedQuestsSubject.next(response.quests);
        },
        error: (error) => console.error('Error loading completed quests:', error)
      });
  }

  /**
   * Get active quests (returns observable)
   */
  getActiveQuests(): Observable<{ quests: ActiveQuest[]; count: number }> {
    return this.http.get<{ quests: ActiveQuest[]; count: number }>(`${this.apiUrl}/active`);
  }

  /**
   * Get available quests (returns observable)
   */
  getAvailableQuests(): Observable<{ quests: Quest[]; count: number }> {
    return this.http.get<{ quests: Quest[]; count: number }>(`${this.apiUrl}/available`);
  }

  /**
   * Get completed quests (returns observable)
   */
  getCompletedQuests(): Observable<{ quests: Quest[]; count: number }> {
    return this.http.get<{ quests: Quest[]; count: number }>(`${this.apiUrl}/completed`);
  }

  /**
   * Get quest progress (returns observable)
   */
  getQuestProgress(questId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${questId}/progress`);
  }

  /**
   * Accept a quest (HTTP)
   */
  acceptQuest(questId: string): Observable<{ message: string; quest: ActiveQuest }> {
    return this.http.post<{ message: string; quest: ActiveQuest }>(
      `${this.apiUrl}/accept/${questId}`,
      {}
    ).pipe(
      tap(() => this.loadAllQuests())
    );
  }

  /**
   * Abandon a quest (HTTP)
   */
  abandonQuest(questId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/abandon/${questId}`,
      {}
    ).pipe(
      tap(() => this.loadAllQuests())
    );
  }

  /**
   * Complete/turn in a quest (HTTP)
   */
  completeQuest(questId: string): Observable<{ message: string; rewards: QuestRewards }> {
    return this.http.post<{ message: string; rewards: QuestRewards }>(
      `${this.apiUrl}/complete/${questId}`,
      {}
    ).pipe(
      tap(() => this.loadAllQuests())
    );
  }

  /**
   * Accept a quest (WebSocket)
   */
  acceptQuestViaSocket(questId: string): void {
    if (this.socket) {
      this.socket.emit('quest:accept', { questId });
    }
  }

  /**
   * Abandon a quest (WebSocket)
   */
  abandonQuestViaSocket(questId: string): void {
    if (this.socket) {
      this.socket.emit('quest:abandon', { questId });
    }
  }

  /**
   * Complete a quest (WebSocket)
   */
  completeQuestViaSocket(questId: string): void {
    if (this.socket) {
      this.socket.emit('quest:complete', { questId });
    }
  }

  /**
   * Get current quest status (WebSocket)
   */
  getQuestStatus(): void {
    if (this.socket) {
      this.socket.emit('quest:getStatus');
    }
  }
}
