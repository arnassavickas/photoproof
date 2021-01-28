import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { makeId } from './utils/makeId';
import { Collection } from './types';

const firebaseConfig = {
  apiKey: 'AIzaSyDHmQizp773R-suNhqIN1be1of5CDmZfeA',
  authDomain: 'photo-proof-6b9c0.firebaseapp.com',
  projectId: 'photo-proof-6b9c0',
  storageBucket: 'photo-proof-6b9c0.appspot.com',
  messagingSenderId: '845535406744',
  appId: '1:845535406744:web:ea79f61dc4ab063be9beed',
  measurementId: 'G-2T5LPCQMXT',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const updateUserDocument = async (
  uid: string,
  newData?: {
    photoURL?: string;
    displayName?: string;
    email?: string;
  }
) => {
  if (!uid) return null;
  try {
    const userDocument = firestore.doc(`users/${uid}`);
    console.log(await userDocument.get());
    await userDocument.update({ ...newData });
    console.log('update successful');
  } catch (err) {
    console.error('error updating user', err);
  }
};

export const generateNewCollection = async (
  data: Omit<Collection, 'status' | 'finalComment'>,
  files: FileList
) => {
  if (!data || !files) return;

  let collectionRef, id, snapshot;

  do {
    id = makeId(8);
    collectionRef = firestore.collection('collections').doc(id);
    snapshot = await collectionRef.get();
  } while (snapshot.exists);

  const { title, minSelect, maxSelect, allowComments } = data;
  try {
    await collectionRef.set({
      title,
      minSelect,
      maxSelect,
      allowComments,
      status: 'selecting',
      finalComment: '',
    });
  } catch (err) {
    console.error('error creating collection document', err);
    return;
  }
  const photosRef = collectionRef.collection('photos');
  const batch = firestore.batch();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    batch.set(photosRef.doc(), {
      fileName: file.name,
      cloudUrl: 'TODO',
      selected: false,
      comment: '',
    });
  }
  try {
    await batch.commit();
  } catch (err) {
    console.error('error creating photos documents', err);
    return;
  }
  return;

  //return getCollectionDocument(id);
};

const getCollectionDocument = async (uid: string) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    const documentData = userDocument.data();
    if (documentData) {
      return {
        uid,
        photoURL: documentData.photoURL,
        displayName: documentData.displayName,
        email: documentData.email,
      };
    }
  } catch (err) {
    console.error('error fetching user', err);
  }
};
