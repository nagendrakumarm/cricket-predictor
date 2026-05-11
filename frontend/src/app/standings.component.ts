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
        this.teams = data;
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
}
