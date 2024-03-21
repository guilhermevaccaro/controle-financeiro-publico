import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = 'http://localhost:3302/login';

  constructor(private httpClient: HttpClient) {}

  login(name: string, password: string) {
    return this.httpClient.post(this.API, { name, password });
  }
}
