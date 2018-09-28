import { Injectable } from '@angular/core';



export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

export interface Chore {
  chorelist: string,
  choreName: String,
  choreWeight: Number
}

export interface Chorelist {
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
