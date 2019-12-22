import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const helper = new JwtHelperService();
const TOKEN_KEY = 'JWTSuperSecretKey';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public _user: Observable<boolean>;
    private _userData = new BehaviorSubject(null);
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(
        private storage: Storage,
        private http: HttpClient,
        private platform: Platform,
        private router: Router
    ) {
        this.loadStoredToken();
    }

    public loadStoredToken(): void {
        const _platform = from(this.platform.ready());

        this._user = _platform.pipe(
            switchMap(() => from(this.storage.get(TOKEN_KEY))),
            map(token => {
                if (token) {
                    let decoded = helper.decodeToken(token);
                    this._userData.next(decoded);
                    return true;
                } else {
                    return null;
                }
            })
        );
    }

    public login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/signin`, {
            usernameOrEmail: credentials.username,
            password: credentials.password
        }).pipe(
            switchMap(res => {
                const token = res.accessToken;
                this._userData.next(helper.decodeToken(token));
                return from(this.storage.set(TOKEN_KEY, token));
            }),
            catchError(() => of(null))
        );
    }

    public getUser(): any {
        return this._userData.getValue();
    }

    public onUserChanged(): Observable<any> {
        return this._userData.asObservable();
    }

    public logout(): void {
        this.storage.remove(TOKEN_KEY).then(() => {
            this.router.navigateByUrl('/login');
            this._userData.next(null);
        });
    }
}
