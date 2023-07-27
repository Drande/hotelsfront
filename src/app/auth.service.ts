import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async login(username: string, password: string): Promise<boolean> {
    // TODO: Implement real authentication
    return true;
  }
}
