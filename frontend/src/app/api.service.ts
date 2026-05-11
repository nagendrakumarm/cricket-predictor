import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeamsByTournament(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/teams/?tournament_id=${tournamentId}`);
  }

  getFutureMatches(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/matches/?tournament_id=${tournamentId}`);
  }

  getLatestMatch(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/matches/latest?tournament_id=${tournamentId}`);
  }

  updateMatchResult(matchId: number, winner: string): Observable<any> {
    return this.http.patch(`${this.base}/matches/${matchId}/result`, { winner });
  }

  updateTeamNrr(teamId: number, played: number, won: number, lost: number, nrr: number, points: number): Observable<any> {
    return this.http.patch(`${this.base}/teams/${teamId}/nrr`, { played, won, lost, nrr, points });
  }

}
