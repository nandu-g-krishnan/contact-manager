import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers,Request,RequestMethod } from '@angular/http';
import { Contact } from '../shared/contact.model';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {

  private baseUrl = environment.apiUrl;
  constructor(private http: Http,private authService: AuthService) { }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url:string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url:string, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url:string) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: string, method: RequestMethod, body?: Object) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.authService.getToken()}`);

    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);

    return this.http.request(request)
      .map((res: Response) => res.json())
      .catch((res: Response) => this.onRequestError(res));
  }


      onRequestError(res: Response) {
        const statusCode = res.status;
        const body = res.json();
    
        const error = {
          statusCode: statusCode,
          error: body.error
        };
    
        console.log(error);
    
        return Observable.throw(error);
      }
  }

