import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const buildChoreInstances = functions.firestore.document('groups/{groupId}/chores/{choreId}')
    .onWrite((change, context) => {
        const val = context.params['choreId'];
        const groupId = context.params['groupId'];
        const choreRef = admin.firestore().doc(`groups/${groupId}/chores/${val}`);

        return choreRef.get()
            .then(choreDoc => {
                //let's see how many instances there are after today's date.
                const choreInstancesRef = admin.firestore().collection(`groups/${groupId}/choreInstances`);
                let qry = choreInstancesRef.where('choreDate', '>', new Date());
                qry = qry.where('choreId', '==', val);

                return qry.get()
                    .then(snapshot => {
                        const batch = admin.firestore().batch();
                        if (snapshot.size < 10) {
                            //now add a few in a batch
                            const cDate = new Date();
                            for (let i = 0; i < 5; i++) {
                                const choreDate = new Date(cDate.getTime() + (1000 * 60 * 60 * 24 * i));
                                const instdoc = {
                                    'here': 'we are from the collection 1',
                                    'groupid': groupId,
                                    'choreid': val,
                                    'choreName': choreDoc.get('choreName'),
                                    'choreDate': choreDate,
                                    'choreImageUrl': choreDoc.get('choreImageUrl')
                                };

                                batch.create(choreInstancesRef.doc(), instdoc);
                            }
                        }
                        return batch.commit();
                    });
            })
    });

export const sendVerifyEmail = functions.https.onCall(
    (data, context) => {
        const smtpConfig = {
            host: 'host.objectclarity.com',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: 'chores@tracnow.com',
                pass: 'choresSuck'
            }
        };
        const transporter = nodemailer.createTransport(smtpConfig);

        // setup email data with unicode symbols
        const mailOptions = {
            from: '"Chores System" <chores@tracnow.com>', // sender address
            to: 'troostw@gmail.com', // list of receivers
            subject: 'Hello Do you want to do some chores?', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.info(error);
            } else {
                console.info('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        });
    });

export const doInvite = functions.https.onCall(
    (data, context) => {

        const smtpConfig = {
            host: functions.config().email.host,
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: functions.config().email.username,
                pass: functions.config().email.password
            }
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        const emailAddress = smtpConfig.auth.user;
        const invitee = data.invitee;
        const inviter = data.inviter;
        const groupid = data.groupid;

        const inviteDoc = {
            invitee, inviter, groupid
        };

        console.info('inviteDoc: ', inviteDoc);

        return admin.firestore().collection(`invitations`).add(inviteDoc).then(
            ref => {

                const link = "http://localhost:4200/invite?token=" + ref.id;
                // setup email data with unicode symbols
                const mailOptions = {
                    from: `"Chores System" <${emailAddress}>`, // sender address
                    to: invitee, // list of receivers
                    subject: 'Hello Do you want to do some chores?', // Subject line
                    text: `You have been invited to do some chores (${link}) by ${inviter}.`, // plain text body
                    html: `You have been invited to do some chores (${link}) by ${inviter}.` // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.info(error);
                    } else {
                        console.info('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    }
                });
            }
        );
    });

export const completeInvite = functions.https.onCall(
    (data, context) => {
        /**
         * { data: {
         *   inviteid: this.inviteToken,
         *   acceptuser: user.uid,
         *   acceptDisplayName: user.displayName
         *   } }
         */

         //change this code to use a batch instead of nesting promises
        const inviteRef = admin.firestore().doc(`invitations/${data.inviteid}`);
        return inviteRef.get()
            .then(inviteDoc => {
                const inviteJS = inviteDoc.data();
                inviteJS.consumed = true;
                inviteJS.uid = data.acceptuser;
                return inviteRef.set(inviteJS).then(wr => {
                    //now also update the group, to show this user as a member
                    const groupRef = admin.firestore().doc(`groups/${inviteJS.groupid}`);
                    return groupRef.get()
                        .then(groupDoc => {
                            const groupJS = groupDoc.data();
                            groupJS.memberslist.push(data.acceptuser);
                            return groupRef.set(groupJS).then(wr2 => {
                                //and add the user to the collection as well
                                const groupMembers = admin.firestore().collection(`groups/${inviteJS.groupid}/members`);
                                const memberData = {
                                    admin: false,
                                    displayName: data.acceptDisplayName,
                                    uid: data.acceptuser
                                }
                                return groupMembers.add(memberData);
                            });
                        });
                });
            })
    });   