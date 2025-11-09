import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SkillsResponse, SkillExperienceResponse, SkillName, SkillWithProgress } from '../models/user.model';

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
    herbalism: SkillWithProgress;
    oneHanded: SkillWithProgress;
    dualWield: SkillWithProgress;
    twoHanded: SkillWithProgress;
    ranged: SkillWithProgress;
    casting: SkillWithProgress;
    gun: SkillWithProgress;
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
   * Calculate the experience needed for next level (always 1000)
   */
  getExperienceToNext(experience: number): number {
    return 1000 - (experience % 1000);
  }

  /**
   * Get skill progress as a percentage (0-100)
   */
  getSkillProgressPercent(experience: number): number {
    return (experience % 1000) / 10;
  }

  /**
   * Clear skills data (for logout)
   */
  clearSkills(): void {
    this.skills.set(null);
  }
}
