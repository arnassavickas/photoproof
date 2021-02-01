import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { makeId } from './utils/makeId';
import { Collection, Photo } from './types';

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

export const generateNewCollection = async (
  data: Omit<Collection, 'status' | 'finalComment' | 'photos' | 'id'>,
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

  const photos = await uploadPhotos(id, files);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    batch.set(photosRef.doc(), photo);
  }
  try {
    await batch.commit();
  } catch (err) {
    console.error('error creating photos documents', err);
    return;
  }
  return;
};

const uploadPhotos = async (id: string, files: FileList) => {
  const photosArray: Omit<Photo, 'id'>[] = [];
  for (let i = 0; i < files.length; i++) {
    console.log('fileNumber :>> ', i);
    console.log(files[i]);
    if (files[i].size > 500000) {
      throw new Error(`${files[i].name} filesize exceeds 0.5 MB`);
    }
    const storageRef = storage.ref(`${id}/${files[i].name}`);
    const uploadTask = await storageRef.put(files[i]);
    const downloadUrl = await uploadTask.ref.getDownloadURL();
    const urlWithoutEnding = downloadUrl.match(/.+?(?=.jpg\?alt=media)/);
    const jpegUrl = `${urlWithoutEnding}.jpg?alt=media`;
    const webpUrl = `${urlWithoutEnding}_1400x1000.webp?alt=media`;
    const jpegThumbnailUrl = `${urlWithoutEnding}_400x700.jpeg?alt=media`;
    const webpThumbnailUrl = `${urlWithoutEnding}_400x700.webp?alt=media`;
    photosArray.push({
      filename: files[i].name,
      cloudUrl: jpegUrl,
      cloudUrlWebp: webpUrl,
      thumbnail: jpegThumbnailUrl,
      thumbnailWebp: webpThumbnailUrl,
      selected: false,
      comment: '',
    });
  }
  return photosArray;
};

export const getCollections = async () => {
  console.log('getting collections');
  const collectionsArray: Collection[] = [];
  const collections = await firestore.collection('collections').get();
  for (const collection of collections.docs) {
    const photos = await firestore
      .collection('collections')
      .doc(collection.id)
      .collection('photos')
      .get();
    const photosArray: Photo[] = [];
    photos.forEach((photo) => {
      const photoObj = {
        id: photo.id,
        cloudUrl: photo.data().cloudUrl,
        cloudUrlWebp: photo.data().cloudUrlWebp,
        thumbnail: photo.data().thumbnail,
        thumbnailWebp: photo.data().thumbnailWebp,
        filename: photo.data().filename,
        selected: photo.data().selected,
        comment: photo.data().comment,
      };
      photosArray.push(photoObj);
    });
    console.log(collection.data());
    const collectionObj = {
      id: collection.id,
      title: collection.data().title,
      minSelect: collection.data().minSelect,
      maxSelect: collection.data().maxSelect,
      allowComments: collection.data().allowComments,
      status: collection.data().status,
      finalComment: collection.data().finalComment,
      photos: photosArray,
    };
    collectionsArray.push(collectionObj);
  }
  return collectionsArray;
};

export const getSingleCollection = async (id: string) => {
  console.log('getting single collection');
  try {
    const collection = await firestore.collection('collections').doc(id).get();
    const photos = await firestore
      .collection('collections')
      .doc(id)
      .collection('photos')
      .get();
    const photosArray: Photo[] = [];
    photos.forEach((photo) => {
      const photoObj = {
        id: photo.id,
        cloudUrl: photo.data().cloudUrl,
        cloudUrlWebp: photo.data().cloudUrlWebp,
        thumbnail: photo.data().thumbnail,
        thumbnailWebp: photo.data().thumbnailWebp,
        filename: photo.data().filename,
        selected: photo.data().selected,
        comment: photo.data().comment,
      };
      photosArray.push(photoObj);
    });

    const collectionObj = {
      id: collection.id,
      title: collection.data()?.title,
      minSelect: collection.data()?.minSelect,
      maxSelect: collection.data()?.maxSelect,
      allowComments: collection.data()?.allowComments,
      status: collection.data()?.status,
      finalComment: collection.data()?.finalComment,
      photos: photosArray,
    };
    return collectionObj;
  } catch (err) {
    throw new Error('failed getting single collection');
  }
};

export const updatePhotoSelection = async (
  collectionId: string,
  photoId: string,
  selected: boolean
) => {
  const photoRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .doc(photoId);
  try {
    await photoRef.update({ selected });
  } catch (err) {
    throw new Error('failed updating database');
  }
};
export const updatePhotoComment = async (
  collectionId: string,
  photoId: string,
  comment: string
) => {
  const photoRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .doc(photoId);
  try {
    await photoRef.update({ comment });
  } catch (err) {
    throw new Error('failed updating database');
  }
};
