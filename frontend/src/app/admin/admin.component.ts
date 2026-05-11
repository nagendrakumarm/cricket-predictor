import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  tournamentId = 3;
  match: any = null;
  teams: any[] = [];
  team1: any = null;
  team2: any = null;
  selectedWinner = '';
  team1Nrr = 0;
  team2Nrr = 0;
  team1Points = 0;
  team2Points = 0;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getTeamsByTournament(this.tournamentId).subscribe({
      next: teams => {
        this.teams = teams;
        this.api.getLatestMatch(this.tournamentId).subscribe({
          next: matches => {
            this.match = matches?.[0] ?? null;
            if (this.match) {
              this.team1 = this.teams.find(t => t.id === this.match.team1);
              this.team2 = this.teams.find(t => t.id === this.match.team2);
              this.team1Nrr = this.team1?.nrr ?? 0;
              this.team2Nrr = this.team2?.nrr ?? 0;
              this.team1Points = this.team1?.points ?? 0;
              this.team2Points = this.team2?.points ?? 0;
            }
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  submitResult() {
    if (!this.selectedWinner) {
      this.errorMessage = 'Please select a winner.';
      return;
    }
    this.errorMessage = '';
    this.loading = true;

    this.api.updateMatchResult(this.match.id, this.selectedWinner).subscribe({
      next: () => {
        this.team1.played += 1;
        this.team2.played += 1;
        if (this.selectedWinner === this.getTeamName(this.team1.id)) {
          this.team1.won += 1;
          this.team2.lost += 1;
          this.team1Points += 2;
        } else {
          this.team2.won += 1;
          this.team1.lost += 1;
          this.team2Points += 2;
        }
        const t1$ = this.api.updateTeamNrr(
            this.team1.id, 
            this.team1.played,
            this.team1.won,
            this.team1.lost,
            this.team1Nrr, 
            this.team1Points);
        const t2$ = this.api.updateTeamNrr(
            this.team2.id, 
            this.team2.played,
            this.team2.won,
            this.team2.lost,
            this.team2Nrr, 
            this.team2Points);

        t1$.subscribe(() => {
          t2$.subscribe(() => {
            this.successMessage = 'Match result and NRR updated successfully!';
            this.loading = false;
            setTimeout(() => this.loadData(), 1500);
          });
        });
      },
      error: err => {
        this.errorMessage = 'Failed to update. Please try again.';
        this.loading = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  getTeamName(id: number): string {
    return this.teams.find(t => t.id === id)?.name ?? 'Unknown';
  }
}