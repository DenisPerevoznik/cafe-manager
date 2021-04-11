import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

const authStorageKey = "auth-information";
@Injectable()
export class AuthService implements OnDestroy {
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get token() {
    const storage = localStorage.getItem(authStorageKey);
    if(!!storage){
      return JSON.parse(storage).token.trim();
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post('api/auth/signin', { email, password }, { headers: { 'Content-Type': 'application/json' } })
      .pipe(tap(response => {this.setToken(response)}));
  }

  logout() {
    localStorage.removeItem(authStorageKey);
    this.router.navigate(['sign-in']);
  }

  isAuthenticated() {
    return !!this.token;
  }

  setToken(token) {
    localStorage.setItem(authStorageKey, JSON.stringify(token));
    this.router.navigate(['']);
  }
}
