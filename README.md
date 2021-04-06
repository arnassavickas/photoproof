# photoproof `(work-in-progress)`
photoproof is an app created for photographers to ease the process of proofing the photos after a photoshoot.

The app works on any shared hosting, the user just has to create a Firebase and any mail service account.

## Features

 - Easy collection management: create/edit/delete collections with just a few clicks.
 - Individual collection settings: allow/forbid comments, set minimum and/or maximum selection goals.
 - Automatic photo resize on the server to 1400x1000px.
 - Serve webp format if browser support is detected.
 - Receive an email once the client confirms their selections.
### TODO
 - Add feature to apply watermarks to photos.

## Installation

 1. Create new app on https://firebase.google.com/.
 2. Select Blaze plan. Under normal usage, you should be charged cents per month.
 3. `Authentication`:
- `Sign-in-method` tab: enable email/password.
- `Users` tab: create admin account with your credentials.
- Copy the newly created user's `UID`.
 4. `Database`:
- Click `Create Database`.
- Select `start in test mode` and click `next`.
- Select your closest location and click `done`.
- Go to `Rules` tab and paste this code:

```rules_version = '1';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collections/{collectionId} {
    	allow get;
      allow update: if ((request.writeFields.size() == 2)
      	&& ('finalComment' in request.writeFields)
      	&& ('status' in request.writeFields)
      	&& request.resource.data.status == 'confirmed');
  		allow read, write: if request.auth.uid == '<<<USER_UID>>>' ;
    }
      match /collections/{collectionId}/photos/{photoId} {
    	allow read;
      allow update: if ((request.writeFields.size() == 1) && ('selected' in request.writeFields)
      	&& get(/databases/$(database)/documents/collections/$(collectionId)).data.status == 'selecting');
      allow update: if ((request.writeFields.size() == 1) && ('comment' in request.writeFields)
      	&& get(/databases/$(database)/documents/collections/$(collectionId)).data.status == 'selecting'
      	&& get(/databases/$(database)/documents/collections/$(collectionId)).data.allowComments == true);
  		allow read, write: if request.auth.uid == '<<<USER_UID>>>';
    }
    match /settings/settings {
    	allow read;
    	allow read, write: if request.auth.uid == '<<<USER_UID>>>' ;
    }
    match /mail/{collectionId} {
    	allow create: if ((get(/databases/$(database)/documents/collections/$(collectionId)).data.status == 'selecting')
      	&& (request.resource.data.to == '<<<YOUR_EMAIL>>>'));
    	allow read, write: if request.auth.uid == '<<<USER_UID>>>';
    }
  }
}
```
- Replace `<<<USER_UID>>>` with your user UID you saved earlier.
- Replace `<<<YOUR_EMAIL>>>` with your user's email.
5. `Rules` tab: paste this code:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth.uid == '<<<USER_UID>>>' ;
    }
  }
}
```
- Replace `<<<USER_UID>>>` with your user UID you saved earlier.
6. Click the gear near Project Overview and select `Project settings`.
7. Bellow at Firebase SDK snippet select Config and copy the code.
8. Create new file at `/src/config.js` and paste your config code there. Edit the code so it starts with `const firebaseConfig = { ...`
9. Go to `Extensions` and click `Explore official Firebase extensions`.
10. Install `Resize Images extension` with these settings:
- Sizes of resized images: `1400x1000,400x700`
- Deletion of original file: `true`
- List of absolute paths not included for resized images: `/logo`
- Convert image to preferred types: `jpeg, webp`
11. Install `Trigger Email` with these settings (you can get this information at SendGrid or similar email service:
- SMTP connection URI: follow this tutorial to get your unique URI https://medium.com/firebase-tips-tricks/how-to-send-e-mails-using-firebase-extensions-a10d7cd685c2
- Email documents collection: mail
- Default FROM address: `<<<YOUR_EMAIL>>>` that you entered previously .
12. Change email to the one, where collection confirmation emails will be sent on `firebase.ts` file at `confirmCollection` function.
//TODO email should be saved and loaded from a database.
13. Clone and run your newly created photoproof app:
```
git clone https://github.com/arnassavickas/photoproof.git
cd photoproof
npm install
npm run
```
14. Once everything works correctly, run `npm run build` and place `build` folder contents on your shared hosting at `/photoproof` folder.
15. Your app will be accessible at: `yourdomain.com/photoproof`
## Motivation
The desire to build a custom photo proofing app arose from many headaches by using buggy Wordpress plugins of which none worked correcly or had all of the required features.

photoproof project was done with simplicity in mind so both the photographer and the client has a smooth experience every single time.
