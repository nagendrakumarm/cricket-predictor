import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private api = environment.apiUrl + '/matches/';

  constructor(private http: HttpClient) {}

  getFutureMatches(tournamentId: number) {
    return this.http.get<any[]>(`${this.api}?tournament_id=${tournamentId}`);
  }

}
