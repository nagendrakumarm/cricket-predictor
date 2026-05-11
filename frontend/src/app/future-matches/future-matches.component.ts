import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-future-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './future-matches.component.html',
  styleUrls: ['./future-matches.component.css']
})
export class FutureMatchesComponent implements OnInit {

  tournamentId!: number;
  matches: any[] = [];
  teams: any[] = [];
  predictionTeams: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    this.loadTeams();
  }

  loadTeams() {
    this.loadingService.show();
    this.api.getTeamsByTournament(this.tournamentId).subscribe({
        next: teams => {
            this.teams = teams;
            this.predictionTeams = teams;

            // Load matches after teams are loaded
            this.api.getFutureMatches(this.tournamentId).subscribe({
                next: futureMatches => {
                this.matches = futureMatches.map(m => ({
                    ...m,
                    team1Name: this.getTeamName(m.team1),
                    team2Name: this.getTeamName(m.team2),
                    predictedWinner: '' // Add a property to hold the predicted winner
                }));
                this.loadingService.hide();
            },
            error: err => {
                console.error('Error loading matches', err);
                this.loadingService.hide();
            }
            });
        },
        error: err => {
            console.error('Error loading teams', err);
            this.loadingService.hide();
        }
    });   
  }

  getTeamName(teamId: number) {
    const t = this.teams.find(x => x.id === teamId);
    return t ? t.name : 'Unknown';
  }

  selectWinner(match: any, winner: string) {
    match.predictedWinner = winner;
    const t1 = this.predictionTeams.find(t => t.id === match.team1);
    const t2 = this.predictionTeams.find(t => t.id === match.team2);

    t1.played++;
    t2.played++;
    t1.justMoved = true;    
    t2.justMoved = true;

    if(t1.name == winner) {
        t1.won++;
        t2.lost++;
        t1.points += 2;
    } else if(t2.name == winner) {
        t2.won++;
        t1.lost++;
        t2.points += 2;
    }
    console.log('Selected winner for match:', t1.name, ':', t2.name, ':Winner:', winner);
    this.updateStandings();
  }

  updateStandings() {
    // Sort by points DESC
    this.predictionTeams.sort((a, b) => b.points - a.points);

    this.predictionTeams.forEach(t => {
      
      if (t.justMoved) {
        // Remove highlight after 2 seconds
        setTimeout(() => {
            t.justMoved = false;
        }, 500);
      }
    });

  }

  resetPage() {
    this.loadTeams();
  }

  simulateAll() {
    //this.loadTeams(); // Reset to original state before simulating
    this.loadingService.show();
    this.matches.forEach(m => {
        const t1 = this.predictionTeams.find(t => t.id === m.team1);
        const t2 = this.predictionTeams.find(t => t.id === m.team2);

        if (!t1 || !t2) {
            console.error('Team not found for match', m);   
            return;
        }
        // Random winner
        const winner = Math.random() <= 0.5 ? t1.name : t2.name;

        this.selectWinner(m, winner);
    });
    this.loadingService.hide();
  }

}
