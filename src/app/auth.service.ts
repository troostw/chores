import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { User } from './models.service';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user: Observable<User | null>;
  calendarItems: any[];

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { 
    this.initClient();
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }))
  }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'AIzaSyAbWh3Kam9kiYdGeEmSjIGnp2cFPYSQ2bc',
        clientId: '412933139971-fir4cb8mjblv8pna5bkomfdj8d5qmg7n.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

    });



  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    console.log(googleUser)

    const credential = auth.GoogleAuthProvider.credential(token);

    const u = await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);

    this.updateUserData(u.user);

    this.router.navigate(['/']);


    // Alternative approach, use the Firebase login with scopes and make RESTful API calls

    // const provider = new auth.GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/calendar');

    // this.afAuth.auth.signInWithPopup(provider)
    
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    console.log("going to insert user, ", user);
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ'
    };
    return userRef.set(data);
  }

  // async getCalendar() {
  //   const events = await gapi.client.calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: new Date().toISOString(),
  //     showDeleted: false,
  //     singleEvents: true,
  //     maxResults: 10,
  //     orderBy: 'startTime'
  //   })

  //   console.log(events)

  //   this.calendarItems = events.result.items;
  
  // }

  // async insertEvent() {
  //   const insert = await gapi.client.calendar.events.insert({
  //     calendarId: 'primary',
  //     start: {
  //       dateTime: hoursFromNow(2),
  //       timeZone: 'America/Los_Angeles'
  //     }, 
  //     end: {
  //       dateTime: hoursFromNow(3),
  //       timeZone: 'America/Los_Angeles'
  //     }, 
  //     summary: 'Have Fun!!!',
  //     description: 'Do some cool stuff and have a fun time doing it'
  //   })

  //   await this.getCalendar();
  // }


}

const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();