import { Routes } from '@angular/router';
import { StandingsComponent } from './standings.component';
import { FutureMatchesComponent } from './future-matches/future-matches.component';

export const routes: Routes = [
  { path: '', component: StandingsComponent, pathMatch: 'full' },
  { path: 'future-matches/:tournamentId', component: FutureMatchesComponent }
];
