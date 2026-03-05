import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import type { LoginRequest, RegisterRequest } from './auth.models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly token = signal<string | null>(this.getStoredToken());
  private readonly user = signal<{ id: string; email: string; firstName: string; lastName: string } | null>(
    this.getStoredUser()
  );

  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentUser = computed(() => this.user());

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): { id: string; email: string; firstName: string; lastName: string } | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; email: string; firstName: string; lastName: string };
    } catch {
      return null;
    }
  }

  login(request: LoginRequest) {
    return this.http.post<string | { token?: string }>('/users/login', request).pipe(
      tap((token) => {
        const jwt = typeof token === 'string' ? token : (token?.token ?? '');
        this.token.set(jwt);
        localStorage.setItem(TOKEN_KEY, jwt);
        this.fetchUserAndStore();
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<string>('/users/register', request).pipe(
      tap((id) => {
        const userId = typeof id === 'string' ? id : (id as { id: string }).id;
        const user = {
          id: userId,
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
        };
        this.user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  private fetchUserAndStore(): void {
    const id = this.parseUserIdFromToken();
    if (id) {
      this.http.get<{ id: string; email: string; firstName: string; lastName: string }>(`/users/${id}`).subscribe({
        next: (u) => {
          this.user.set(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        },
        error: () => {},
      });
    }
  }

  private parseUserIdFromToken(): string | null {
    const t = this.token();
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }
}
