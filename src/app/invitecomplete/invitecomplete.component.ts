import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invitecomplete',
  templateUrl: './invitecomplete.component.html',
  styleUrls: ['./invitecomplete.component.css']
})
export class InvitecompleteComponent implements OnInit {

  public inviteToken: string;
  constructor(private route: ActivatedRoute, private router: Router,
    private afs: AngularFirestore,
    private auth: AuthService,
    private http: HttpClient
    ) {

   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.inviteToken = params['token'];
      if (!this.inviteToken){
        console.log('redirecting, no token provided');
        this.router.navigate(['/']);
      } else {
        //let's have a look at that token
        const inviteDocRef = this.afs.doc(`invitations/${this.inviteToken}`);
        inviteDocRef.snapshotChanges()
        .subscribe(doc =>{
          const invite: any = doc.payload.data();
          invite.id = doc.payload.id;

          if (invite.consumed){
            //this is no good, get out of here
            this.router.navigate(['/']);
          } else {
            this.completeInvitation(invite);
          }

        })

      }
    });
  }

  completeInvitation(invite: any){
    //are we logged in?
    if (this.auth.isLoggedIn()) {
      this.registerUserToInvitation(invite);
    } else {
      //do the login and redirect back here
      const params: NavigationExtras = {};
      params.queryParams
      params.queryParams = {returnUrl: '/invite?token=' + this.inviteToken}
      this.router.navigate(['login'], params);
    }
  }

  registerUserToInvitation(invite: any){
    //get the logged in user, then call the firebase function to consume the invite
    console.log("OK NOW we're getting there");
    const user = this.auth.currentUser();

    const completeArgs = { data: {
      inviteid: this.inviteToken,
      acceptuser: user.uid,
      acceptDisplayName: user.displayName
    } }

    console.log('inviteArgs:', completeArgs);
    this.http.post('https://us-central1-chores-217518.cloudfunctions.net/completeInvite', completeArgs)
    .subscribe(data => {
      console.log('reponse data ', data);
    }); 


  }

}
