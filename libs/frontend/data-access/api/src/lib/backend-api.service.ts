import { Injectable } from '@angular/core';
import { AmplifyFetchService } from './amplify-fetch.service';

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private fetchService: AmplifyFetchService) { }

  /** 
   * This method is called from respective API services to generate the fetch function from just a few params. 
   * 
   * Example class method in an API service:
   * 
   * register = this.fetch<ApiInterfaces.User, ApiInterfaces.User>('user/register', 'POST'),
  */
  generate<I, O>(path: string, method: FetchMethod) { return (body: I) => this.request<I, O>(path, method, body); }

  // ----------------------
  // generates actual fetch function
  private async request<INP = any, OUT = any>(url: string, method: FetchMethod, paramObj?: INP): Promise<OUT> {
    let body: any;
    console.log('request', url, method, paramObj);
    if (paramObj) {
      if (method === 'GET') {
        url += '?' + Object.keys(paramObj).map(p => `${encodeURIComponent(p)}=${encodeURIComponent(paramObj[p])}`).join('&');
      } else {
        body = paramObj;
      }
    }
    return await this.fetchService.request(url, method, body);
  }

}
