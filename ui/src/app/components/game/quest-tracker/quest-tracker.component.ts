import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../services/quest.service';
import { ActiveQuest, ObjectiveProgress, Quest } from '@shared/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quest-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest-tracker.component.html',
  styleUrl: './quest-tracker.component.scss',
})
export class QuestTrackerComponent implements OnInit, OnDestroy {
  private questService = inject(QuestService);

  activeQuests: ActiveQuest[] = [];
  availableQuests: Quest[] = [];
  completedQuests: Quest[] = [];

  private subscriptions: Subscription[] = [];

  // Collapse state for each section
  collapsedSections = {
    active: false,
    available: true,
    completed: true
  };

  ngOnInit(): void {
    // Subscribe to active quests
    this.subscriptions.push(
      this.questService.activeQuests$.subscribe(quests => {
        this.activeQuests = quests;
      })
    );

    // Subscribe to available quests
    this.subscriptions.push(
      this.questService.availableQuests$.subscribe(quests => {
        this.availableQuests = quests;
      })
    );

    // Subscribe to completed quests
    this.subscriptions.push(
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
   * Toggle section collapse state
   */
  toggleSection(section: 'active' | 'available' | 'completed'): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  /**
   * Get quest definition name from questId
   */
  getQuestName(quest: ActiveQuest): string {
    // Extract from definition if available (enriched by backend)
    if (quest.definition) {
      return quest.definition.name;
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
   * Get objective description from quest definition
   */
  getObjectiveDescription(quest: ActiveQuest, objectiveProgress: ObjectiveProgress): string {
    // If quest has enriched definition, look up the objective description
    if (quest.definition) {
      const objectiveDef = quest.definition.objectives.find(
        obj => obj.objectiveId === objectiveProgress.objectiveId
      );
      if (objectiveDef && objectiveDef.description) {
        return objectiveDef.description;
      }
    }

    // Fallback: format objectiveId as readable text
    return objectiveProgress.objectiveId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  /**
   * Turn in a completed quest
   */
  turnInQuest(questId: string): void {
    this.questService.completeQuest(questId).subscribe({
      next: () => {
        // Quest service will handle reloading quests
      },
      error: (error) => {
        console.error('Error completing quest:', error);
      }
    });
  }

  /**
   * Accept an available quest
   */
  acceptQuest(questId: string): void {
    this.questService.acceptQuest(questId).subscribe({
      next: () => {
        // Quest service will handle reloading quests
      },
      error: (error) => {
        console.error('Error accepting quest:', error);
      }
    });
  }

  /**
   * Get quest name from Quest object
   */
  getAvailableQuestName(quest: Quest): string {
    return quest.name;
  }

  /**
   * Get quest name from completed questId
   */
  getCompletedQuestName(quest: Quest): string {
    return quest.name;
  }
}
