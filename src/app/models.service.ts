import { Injectable } from '@angular/core';



export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor() { }
}
