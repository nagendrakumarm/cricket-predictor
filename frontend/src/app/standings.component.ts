import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';

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
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  ngOnInit() {
    console.log('Loading teams from backend...');
    const loadingRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      panelClass: 'loading-dialog'
    });
    this.api.getTeamsByTournament(3).subscribe({
      next: data => {
        this.teams = data;
        loadingRef.close();
        console.log('Teams loaded:', this.teams);
      },
      error: err => {
        loadingRef.close();
        console.error('Error loading teams:', err);
      }
    });  
  }

  goToFutureMatches() {
    console.log('Future matches clicked');
    this.router.navigate(['/future-matches', 3]);
  }
}
