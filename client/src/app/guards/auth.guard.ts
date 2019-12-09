import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService._user.pipe(
            take(1),
            map(user => {
                if (!user) {
                    this.router.navigateByUrl('/login');
                    return false;
                } else {
                    return true;
                }
            })
        );
    }
}
