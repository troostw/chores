import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../auth.service';
import { User, Chorelist } from '../../models.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-chorelisthome',
  templateUrl: './chorelisthome.component.html',
  styleUrls: ['./chorelisthome.component.css']
})
export class ChorelisthomeComponent implements OnInit {

  user: User;

  constructor(private afs: AngularFirestore,
    private auth: AuthService
    , private router: Router) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  addList(){
    console.log('here we go then');
    const userDoc = this.afs.doc<User>(`users/${this.user.uid}`);
    console.log("here", this.user.displayName);
    let chl:Chorelist = {chorelistid:'', listName:'', owner:this.user.displayName, listImageUrl:''};
    userDoc.collection<Chorelist>('chorelists').add(chl)
    .then(ref => {
      this.router.navigate(['chorelist','edit',ref.id]);
    })
    

  }

}
