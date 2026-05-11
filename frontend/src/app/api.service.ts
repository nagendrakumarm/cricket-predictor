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
}
