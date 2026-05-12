import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  teams: any[] = [];
  
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private api: ApiService
  ) {}

  ngOnInit() {
    console.log('Loading teams from backend...');
    this.loadingService.show();
    this.api.getTeamsByTournament(3).subscribe({
      next: data => {
        const cutOffPoints = data.length >= 4 ? data[3].points : 0;
        const cutOffQualified = data.length >= 4 ? data[3].points + ((14 - data[3].played) * 2) : 0;
        this.teams = data.map((team: any) => ({
          ...team,
          qualified: team.points > cutOffQualified,
          eliminated: team.points + ((14 - team.played) * 2) < cutOffPoints
        }));
        this.loadingService.hide();
        console.log('Teams loaded:', this.teams);
      },
      error: err => {
        this.loadingService.hide();
        console.error('Error loading teams:', err);
      }
    });  
  }

  goToFutureMatches() {
    console.log('Future matches clicked');
    this.router.navigate(['/future-matches', 3]);
  }
 
  toggleExpandTeam(team: any): void {
    // only toggle on mobile — ignore on desktop
    if (window.innerWidth > 580) return;
    team.expanded = !team.expanded;
  }    
}
