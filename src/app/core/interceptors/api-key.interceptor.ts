import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = 'my-secret-key';

    // only attach key to backend calls
    if (req.url.startsWith('http://localhost:8080')) {
      req = req.clone({
        setHeaders: {
          'X-API-Key': apiKey
        }
      });
    }

    return next.handle(req);
  }
}
