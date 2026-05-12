import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { error } from 'console';

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
  dataReady: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    this.resetPage();
  }
  loadTeams(): Observable<any> {
    return this.api.getTeamsByTournament(this.tournamentId).pipe(
      tap(teams => {
        this.teams = teams;
        this.predictionTeams = teams;
        this.updateStandings();
      }),
      switchMap(() => this.api.getFutureMatches(this.tournamentId)),
      tap(futureMatches => {
        this.matches = futureMatches.map(m => ({
          ...m,
          team1Name: this.getTeamName(m.team1),
          team2Name: this.getTeamName(m.team2),
          predictedWinner: ''
        }));
      })
    );
  }

  getTeamName(teamId: number) {
    const t = this.teams.find(x => x.id === teamId);
    return t ? t.name : 'Unknown';
  }

  selectWinnerEvent(match: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = (event.target as HTMLSelectElement).value;
    const winner = select.value;
    const previousWinner = match.predictedWinner;
    match.predictedWinner = winner;
    console.log('Winner selected for match', match.id, ':', winner, ': Previous winner:', previousWinner);  
    if (previousWinner === winner) {
      return; // No change in winner, so do nothing
    } 
    this.selectWinner(match, winner, previousWinner);
  }

  selectWinner(match: any, winner: string, previousWinner?: string) {
    match.predictedWinner = winner;
    const t1 = this.predictionTeams.find(t => t.id === match.team1);
    const t2 = this.predictionTeams.find(t => t.id === match.team2);

    if(!previousWinner)
    {
      t1.played++;
      t2.played++;
    } else {
      // Revert previous winner's stats
      if(previousWinner === t1.name) {    
        t1.won--;
        t1.points -= 2;
      } else if(previousWinner === t2.name) {
        t2.won--;
        t2.points -= 2;
      }     
    }
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

    const cutOffPoints = this.predictionTeams.length >= 4 ? this.predictionTeams[3].points : 0;
    const cutOffQualified = this.predictionTeams.length >= 4 ? this.predictionTeams[3].points + ((14 - this.predictionTeams[3].played) * 2) : 0;

    this.predictionTeams.forEach(t => {
      t.qualified =  t.points > cutOffQualified;
      t.eliminated = t.points + ((14 - t.played) * 2) < cutOffPoints;
      
      if (t.justMoved) {
        // Remove highlight after 2 seconds
        setTimeout(() => {
            t.justMoved = false;
        }, 500);
      }
    });

  }

  resetPage() {
    this.dataReady = false;
    this.loadingService.show();
    this.loadTeams().subscribe({
      next: () => {
        this.dataReady = true;
        this.loadingService.hide();
      },
      error: err => {
        console.error('Error loading data', err);
        this.dataReady = true;
        this.loadingService.hide();
      }
    });
  }

  simulateAll() {
    this.loadingService.show();
    this.dataReady = false;
    this.loadTeams().subscribe(({
      next: () => {
        this.matches.forEach(m => {
            const t1 = this.predictionTeams.find(t => t.id === m.team1);
            const t2 = this.predictionTeams.find(t => t.id === m.team2);

            if (!t1 || !t2) {
                console.error('Team not found for match', m);   
                return;
            }
            // Random winner
            const winner = Math.random() <= 0.5 ? t1.name : t2.name;
            m.predictedWinner = winner;

            this.selectWinner(m, winner);
        });
        this.dataReady = true;
        this.loadingService.hide();
    }, 
    error: err => {
        console.error('Error simulating matches:', err);
        this.dataReady = true;
        this.loadingService.hide(); 
    },
    complete: () => {
        console.log('All matches simulated');
    }
    }));  
  }

  get predictedCount(): number {
    return this.matches.filter(m => m.predictedWinner && m.predictedWinner !== '').length;
  }

  toggleExpandTeam(team: any): void {
    // only toggle on mobile — ignore on desktop
    if (window.innerWidth > 580) return;
    team.expanded = !team.expanded;
  }  
}
