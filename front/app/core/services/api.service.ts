import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1';

  get<T>(chemin: string, parametres?: Record<string, string | number | boolean>): Observable<T> {
    let params = new HttpParams();
    for (const [cle, valeur] of Object.entries(parametres ?? {})) {
      if (valeur !== '') params = params.set(cle, String(valeur));
    }
    return this.http.get<T>(`${this.base}${chemin}`, { params, withCredentials: true });
  }

  post<T>(chemin: string, corps?: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}${chemin}`, corps ?? {}, { withCredentials: true });
  }

  put<T>(chemin: string, corps: unknown): Observable<T> {
    return this.http.put<T>(`${this.base}${chemin}`, corps, { withCredentials: true });
  }

  patch<T>(chemin: string, corps?: unknown): Observable<T> {
    return this.http.patch<T>(`${this.base}${chemin}`, corps ?? {}, { withCredentials: true });
  }

  delete<T>(chemin: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${chemin}`, { withCredentials: true });
  }

  telecharger(chemin: string): Observable<Blob> {
    return this.http.get(`${this.base}${chemin}`, { responseType: 'blob', withCredentials: true });
  }

  envoyerFichier<T>(chemin: string, fichier: File): Observable<T> {
    const corps = new FormData();
    corps.append('fichier', fichier);
    return this.http.put<T>(`${this.base}${chemin}`, corps, { withCredentials: true });
  }
}
