import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private api = 'http://localhost:8000/matches/';

  constructor(private http: HttpClient) {}

  getFutureMatches(tournamentId: number) {
    return this.http.get<any[]>(`${this.api}?tournament_id=${tournamentId}`);
  }

}
