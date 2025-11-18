import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SkillsResponse, SkillExperienceResponse, SkillName, SkillWithProgress } from '../models/user.model';
import { getPercentToNextLevel, getTotalXPForLevel } from '@shared/constants/attribute-constants';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skills`;

  // Signal to store current skills
  skills = signal<{
    woodcutting: SkillWithProgress;
    mining: SkillWithProgress;
    fishing: SkillWithProgress;
    smithing: SkillWithProgress;
    cooking: SkillWithProgress;
    gathering: SkillWithProgress;
    alchemy: SkillWithProgress;
    construction: SkillWithProgress;
    oneHanded: SkillWithProgress;
    dualWield: SkillWithProgress;
    twoHanded: SkillWithProgress;
    ranged: SkillWithProgress;
    casting: SkillWithProgress;
    protection: SkillWithProgress;
  } | null>(null);

  /**
   * Get HTTP headers with authorization token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetch all skills for the current player
   */
  getSkills(): Observable<SkillsResponse> {
    return this.http.get<SkillsResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          if (response.success) {
            this.skills.set(response.data.skills);
          }
        })
      );
  }

  /**
   * Get a single skill by name
   */
  getSkill(skillName: SkillName): Observable<any> {
    return this.http.get(`${this.apiUrl}/${skillName}`, { headers: this.getHeaders() });
  }

  /**
   * Add experience to a specific skill
   */
  addSkillExperience(skillName: SkillName, amount: number): Observable<SkillExperienceResponse> {
    return this.http.post<SkillExperienceResponse>(
      `${this.apiUrl}/${skillName}/experience`,
      { amount },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          // Refresh skills after gaining experience
          this.getSkills().subscribe();
        }
      })
    );
  }

  /**
   * Calculate the experience needed for next level
   */
  getExperienceToNext(skill: SkillWithProgress): number {
    return skill.xpToNextLevel;
  }

  /**
   * Get skill progress as a percentage (0-100)
   * Computed from level and experience using shared formula
   */
  getSkillProgressPercent(skill: SkillWithProgress): number {
    return getPercentToNextLevel(skill.level, skill.experience);
  }

  /**
   * Get total cumulative XP for a skill
   * Computed from level and current experience
   */
  getTotalXP(skill: SkillWithProgress): number {
    return getTotalXPForLevel(skill.level) + skill.experience;
  }

  /**
   * Clear skills data (for logout)
   */
  clearSkills(): void {
    this.skills.set(null);
  }
}
