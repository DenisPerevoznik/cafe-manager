import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { getSelectedCompany } from "@app/store/selectors/common.selector";
import { AppState } from "@app/store/state/app.state";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { first, flatMap, mergeMap, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Company } from "./interfaces";


@Injectable()
export class MainInterceptor implements HttpInterceptor{

    constructor(private router: Router, private authService: AuthService,
        private store: Store<AppState>){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.token}`,
            'Content-Type': 'application/json'
        });
        let request = req.clone({headers});

        return this.store.select(getSelectedCompany)
        .pipe(first(), mergeMap((company: Company) => {
            
            if(!!company && (req.body && !req.body.CompanyId)){
                request = req.clone({headers, body: {...req.body, companyId: company.id}});
            }
            
            return next.handle(request)
            .pipe(tap(()=>{}, response => {
                if(response.status === 401){
                    this.authService.logout();
                    this.router.navigate(['sign-in']);
                }
            }));
        }));        
    }
}