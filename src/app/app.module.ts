import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChorenavComponent } from './chorenav/chorenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule } from '@angular/material';
import { ChoreshomeComponent } from './choreshome/choreshome.component';
import { LoginComponent } from './login/login.component';

// Add your project credentials
// Then use it in the imports section below
const yourFirebaseConfig = {
  apiKey: "AIzaSyAbWh3Kam9kiYdGeEmSjIGnp2cFPYSQ2bc",
  authDomain: "chores-217518.firebaseapp.com",
  databaseURL: "https://chores-217518.firebaseio.com",
  projectId: "chores-217518",
  storageBucket: "chores-217518.appspot.com",
  messagingSenderId: "412933139971"
};

@NgModule({
  declarations: [
    AppComponent,
    ChorenavComponent,
    ChoreshomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(yourFirebaseConfig),
    AngularFireAuthModule, 
    AngularFirestoreModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
