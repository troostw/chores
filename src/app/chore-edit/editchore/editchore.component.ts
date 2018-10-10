import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { User } from '../../models.service';
import { debounceTime, map } from 'rxjs/operators';
import {
  AngularFirestore, AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Chore } from '../../models/chore';


@Component({
  selector: 'app-editchore',
  templateUrl: './editchore.component.html',
  styleUrls: ['./editchore.component.css']
})
export class EditchoreComponent implements OnInit {

  private choreid: string;
  public choreForm: FormGroup;
  private choreDoc: AngularFirestoreDocument<Chore>;
  private user: User;
  public repeatTypes: Array<string>;
  public choreImageUrl: string;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder, 
    private auth: AuthService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { 
    this.repeatTypes = ['None','Daily','Weekdays','Weekends','Manual'];
  }

  ngOnInit() {
    this.choreid = this.route.snapshot.paramMap.get('id');
    
    this.choreForm = this.fb.group({
      choreid: [''],
      choreName: ['', Validators.required],
      owner: [''],
      choreImageUrl: [],
      startDate: [''],
      repeatType: ['none']
    });


    this.auth.user.subscribe(user => {
      this.user = user;
      console.log(`fetching chorelist for user/${user.uid}`);
      if (this.choreid == 'new'){
        // // this.afs.doc<Chore>(`users/${this.user.uid}/chorelists/${this.chorelistid}/chores/${ch.choreid}`).set(ch);
        // let choresCollection = this.afs.collection(`users/${this.user.uid}/chores`);
        // this.choreDoc = choresCollection.doc('chore');
        this.choreid = this.afs.createId();
        console.log('this.choreid', this.choreid);
        this.choreForm.get('choreid').setValue(this.choreid);
        this.choreForm.get('owner').setValue(this.user.uid);
      } else {
        //we're going to fetch the data and populate the form
        this.afs.doc<Chore>(`users/${this.user.uid}/chores/${this.choreid}`).valueChanges()
        .pipe(map((doc: any) => {
          if (doc.startDate && doc.startDate.toDate){
            doc.startDate = doc.startDate.toDate();
          }
          this.choreForm.patchValue(doc);
          this.choreImageUrl = doc.choreImageUrl;
        }))
        .subscribe();
      }
    });

    this.choreForm.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(formValue => {
      console.log("new form values ", formValue);
      
    });
  }

  handleNewImageFile(event) {
    const filePath = `/chores/${this.user.uid}/${this.choreid}_img.jpg`;
    const fileRef = this.storage.ref(filePath);

    const ulTask = this.storage.upload(filePath, event.target.files[0]);
    ulTask.then(done => {
      fileRef.getDownloadURL().subscribe(url => {
        this.choreImageUrl = url;
        this.choreForm.get('choreImageUrl').setValue(url);
      });
    });
  }

  save(){
    let ch = this.choreForm.value;
    console.log("Trying to save this: ", ch);
    this.afs.doc<Chore>(`users/${this.user.uid}/chores/${this.choreid}`).set(ch).then(
      () => {
        this.router.navigate(['/']);
      }
    );
  }



}
