import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../services/quest.service';
import { Quest, ActiveQuest, ObjectiveProgress } from '@shared/types';
import { Subscription } from 'rxjs';

type QuestTab = 'active' | 'available' | 'completed';

@Component({
  selector: 'app-quest-journal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest-journal.component.html',
  styleUrl: './quest-journal.component.scss',
})
export class QuestJournal implements OnInit, OnDestroy {
  private questService = inject(QuestService);

  activeTab = signal<QuestTab>('active');

  activeQuests: ActiveQuest[] = [];
  availableQuests: Quest[] = [];
  completedQuests: Quest[] = [];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Subscribe to quest data
    this.subscriptions.push(
      this.questService.activeQuests$.subscribe(quests => {
        this.activeQuests = quests;
      }),
      this.questService.availableQuests$.subscribe(quests => {
        this.availableQuests = quests;
      }),
      this.questService.completedQuests$.subscribe(quests => {
        this.completedQuests = quests;
      })
    );

    // Load initial data
    this.questService.loadAllQuests();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Switch tabs
   */
  setTab(tab: QuestTab): void {
    this.activeTab.set(tab);
  }

  /**
   * Get quest name from questId
   */
  getQuestName(quest: ActiveQuest | Quest): string {
    if ('definition' in quest && (quest as any).definition) {
      return (quest as any).definition.name;
    }
    if ('name' in quest) {
      return (quest as Quest).name;
    }
    // Fallback: format questId
    const questId = 'questId' in quest ? quest.questId : '';
    return questId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  /**
   * Get quest description
   */
  getQuestDescription(quest: ActiveQuest | Quest): string {
    if ('definition' in quest && (quest as any).definition) {
      return (quest as any).definition.description || '';
    }
    if ('description' in quest) {
      return (quest as Quest).description || '';
    }
    return '';
  }

  /**
   * Check if quest is complete
   */
  isQuestComplete(quest: ActiveQuest): boolean {
    return quest.objectives.every((obj: ObjectiveProgress) => obj.completed);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(quest: ActiveQuest): number {
    const total = quest.objectives.length;
    const completed = quest.objectives.filter((obj: ObjectiveProgress) => obj.completed).length;
    return Math.round((completed / total) * 100);
  }

  /**
   * Get objective description from objective progress
   */
  getObjectiveDescription(objective: ObjectiveProgress): string {
    // For now, just format the objectiveId as a readable string
    // In a full implementation, this would look up the actual objective definition
    return objective.objectiveId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  /**
   * Accept a quest
   */
  acceptQuest(questId: string): void {
    this.questService.acceptQuest(questId).subscribe({
      next: () => console.log('Quest accepted'),
      error: (error) => console.error('Error accepting quest:', error)
    });
  }

  /**
   * Abandon a quest
   */
  abandonQuest(questId: string): void {
    if (confirm('Are you sure you want to abandon this quest?')) {
      this.questService.abandonQuest(questId).subscribe({
        next: () => console.log('Quest abandoned'),
        error: (error) => console.error('Error abandoning quest:', error)
      });
    }
  }

  /**
   * Turn in a completed quest
   */
  turnInQuest(questId: string): void {
    this.questService.completeQuest(questId).subscribe({
      next: (response) => console.log('Quest completed:', response),
      error: (error) => console.error('Error completing quest:', error)
    });
  }
}
