import { Injectable } from '@angular/core';
import API from '@aws-amplify/api';

@Injectable({
  providedIn: 'root'
})
export class AmplifyFetchService {

  private api;
  private readonly apiName = 'api';
  constructor() {
    this.api = API;
  }

  async request(path: string, method: string, body?: any, headers?: { [key: string]: string }) {
    let result: any;
    try {
      switch (method.toLowerCase()) {
        case 'get':
          result = await this.api.get(this.apiName, path, { headers });
          break;
        case 'post':
          result = await this.api.post(this.apiName, path, { headers, body });
          break;
        case 'delete':
          result = await this.api.del(this.apiName, path, { headers, body });
          break;
        case 'put':
          result = await this.api.put(this.apiName, path, { headers, body });
          break;
        default:
          throw new Error('no handler for request method ' + method);
      }
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
