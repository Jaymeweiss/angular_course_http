import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedRequest = req.clone();
    if (req.url !== 'some/wrong/url') {
      // do something before the request is sent
      modifiedRequest = req.clone({headers: req.headers.append('Auth', 'xyz')});
    }
    return next.handle(modifiedRequest);
  }
}
