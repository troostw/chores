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
import { Group } from '../../models/group';


@Component({
  selector: 'app-editchore',
  templateUrl: './editchore.component.html',
  styleUrls: ['./editchore.component.css']
})
export class EditchoreComponent implements OnInit {

  private choreid: string;
  private groupid: string;
  public choreForm: FormGroup;
  private choreDoc: AngularFirestoreDocument<Chore>;
  private user: User;
  public repeatTypes: Array<string>;
  public choreImageUrl: string;
  public groups: Array<Group>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) {
    this.repeatTypes = ['None', 'Daily', 'Weekdays', 'Weekends', 'Manual'];

  }

  ngOnInit() {
    this.choreid = this.route.snapshot.paramMap.get('id');
    if (this.choreid != 'new'){
      this.groupid = this.route.snapshot.paramMap.get('groupid');
    }
    

    this.choreForm = this.fb.group({
      choreid: [''],
      groupid:[''],
      choreName: ['', Validators.required],
      choreImageUrl: [],
      startDate: [''],
      repeatType: ['none']
    });


    this.auth.user.subscribe(user => {
      this.user = user;
      //going to get the groups that this user has
      const groups = this.afs.collection<Group>('groups', ref => ref.where('memberslist', 'array-contains', user.uid)).snapshotChanges()
        .pipe(map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Group;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
      groups.subscribe(grps =>{
        this.groups = grps;
      })  

      if (this.choreid == 'new') {
        this.choreid = this.afs.createId();
        console.log('this.choreid', this.choreid);
        this.choreForm.get('choreid').setValue(this.choreid);
      } else {
        //we're going to fetch the data and populate the form
        this.afs.doc<Chore>(`groups/${this.groupid}/chores/${this.choreid}`).valueChanges()
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

  save() {
    let ch = this.choreForm.value;
    console.log("Trying to save this: ", ch);
    this.afs.doc<Chore>(`groups/${ch.groupid}/chores/${this.choreid}`).set(ch).then(
      () => {
        this.router.navigate(['/']);
      }
    );
  }

}
