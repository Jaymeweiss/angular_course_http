import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

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
    return next.handle(modifiedRequest).pipe(tap( event => {
      if (event.type === HttpEventType.Response) {
        console.log('Response arrived, body data: ');
        console.log(event.body);
      }
    }));
  }
}
