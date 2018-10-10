"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.buildChoreInstances = functions.firestore.document('users/{userId}/chores/{choreId}')
    .onWrite((change, context) => {
    const val = context.params['choreId'];
    const userId = context.params['userId'];
    const choreRef = admin.firestore().doc(`users/${userId}/chores/${val}`);
    return choreRef.get()
        .then(choreDoc => {
        //let's see how many instances there are after today's date.
        const choreInstancesRef = admin.firestore().collection(`/choreInstances`);
        let qry = choreInstancesRef.where('choreDate', '>', new Date());
        qry = qry.where('choreId', '==', val);
        return qry.get()
            .then(snapshot => {
            const batch = admin.firestore().batch();
            if (snapshot.size < 10) {
                //now add a few in a batch
                let choreDate = new Date();
                for (let i = 0; i < 5; i++) {
                    const instdoc = {
                        'here': 'we are from the collection 1',
                        'choreid': val,
                        'choreDate': choreDate,
                        'choreImageUrl': choreDoc.get('choreImageUrl')
                    };
                    choreDate = new Date(choreDate.getTime() + (1000 * 60 * 60 * 24 * i));
                    batch.create(choreInstancesRef.doc(), instdoc);
                }
            }
            return batch.commit();
        });
    });
});
exports.sendVerifyEmail = functions.https.onCall((data, context) => {
    const smtpConfig = {
        host: 'host.objectclarity.com',
        port: 587,
        secure: false,
        auth: {
            user: 'chores@tracnow.com',
            pass: 'choresSuck'
        }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Chores System" <chores@tracnow.com>',
        to: 'troostw@gmail.com',
        subject: 'Hello Do you want to do some chores?',
        text: 'Hello world?',
        html: '<b>Hello world?</b>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.info(error);
        }
        else {
            console.info('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });
});
//# sourceMappingURL=index.js.map