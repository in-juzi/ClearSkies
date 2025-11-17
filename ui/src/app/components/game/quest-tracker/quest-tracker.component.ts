import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../services/quest.service';
import { ActiveQuest, ObjectiveProgress } from '@shared/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quest-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest-tracker.component.html',
  styleUrl: './quest-tracker.component.scss',
})
export class QuestTracker implements OnInit, OnDestroy {
  activeQuests: ActiveQuest[] = [];
  private subscription?: Subscription;

  constructor(private questService: QuestService) {}

  ngOnInit(): void {
    // Subscribe to active quests
    this.subscription = this.questService.activeQuests$.subscribe(quests => {
      this.activeQuests = quests;
    });

    // Load initial data
    this.questService.loadActiveQuests();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Get quest definition name from questId
   */
  getQuestName(quest: ActiveQuest): string {
    // Extract from definition if available
    if ((quest as any).definition) {
      return (quest as any).definition.name;
    }
    // Fallback: format questId
    return quest.questId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  /**
   * Check if all objectives are completed
   */
  isQuestComplete(quest: ActiveQuest): boolean {
    return quest.objectives.every((obj: ObjectiveProgress) => obj.completed);
  }

  /**
   * Get completion percentage for quest
   */
  getCompletionPercentage(quest: ActiveQuest): number {
    const total = quest.objectives.length;
    const completed = quest.objectives.filter((obj: ObjectiveProgress) => obj.completed).length;
    return Math.round((completed / total) * 100);
  }

  /**
   * Turn in a completed quest
   */
  turnInQuest(questId: string): void {
    this.questService.completeQuest(questId).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error completing quest:', error);
      }
    });
  }
}
