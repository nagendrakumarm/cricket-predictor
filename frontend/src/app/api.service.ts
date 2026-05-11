import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base = 'http://localhost:8000'; // your backend

  constructor(private http: HttpClient) {}

  getTeamsByTournament(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/teams/?tournament_id=${tournamentId}`);
  }

  getFutureMatches(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/matches/?tournament_id=${tournamentId}`);
  }
}
