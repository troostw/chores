import { Injectable } from '@angular/core';



export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

export interface Chorelist {
  chorelistid: string,
  listName: string,
  owner: string,
  listImageUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor() { }
}
