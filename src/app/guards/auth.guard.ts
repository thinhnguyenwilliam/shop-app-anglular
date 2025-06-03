import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    CanActivateFn,
    Router
} from '@angular/router';
import { TokenService } from '../services/Token/token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private readonly tokenService: TokenService,
        private readonly router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        //debugger
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;

        if (!isTokenExpired && isUserIdValid) {
            return true;
        }

        return this.router.parseUrl('/login');
    }

}

// Sử dụng functional guard như sau:
export const AuthGuardFn: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree => {
    return inject(AuthGuard).canActivate(next, state);
};

