import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { flatMap } from 'rxjs/operators';

const TOKEN_KEY = 'JWTSuperSecretKey';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private storage: Storage) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.storage.get(TOKEN_KEY))
            .pipe(
                flatMap(token => {
                    if (!token) {
                        return next.handle(req);
                    }
                    const req1 = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${token}`)
                    });

                    return next.handle(req1);
                })
            );
    }
}
