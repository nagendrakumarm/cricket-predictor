import { Routes } from '@angular/router';
import { StandingsComponent } from './standings.component';
import { FutureMatchesComponent } from './future-matches/future-matches.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: StandingsComponent, pathMatch: 'full' },
  { path: 'future-matches/:tournamentId', component: FutureMatchesComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];
