import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'exifr';

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
  data: Omit<
    Collection,
    'status' | 'finalComment' | 'photos' | 'id' | 'dateCreated'
  >,
  files: FileList,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<string> => {
  if (!data || !files) {
    throw new Error('missing data or files');
  }
  setUploadProgress(1);

  let collectionRef, id, snapshot;

  do {
    id = makeId(8);
    collectionRef = firestore.collection('collections').doc(id);
    snapshot = await collectionRef.get();
  } while (snapshot.exists);
  setUploadProgress(5);
  const { title, minSelect, maxSelect, allowComments } = data;
  try {
    await collectionRef.set({
      title,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      minSelect,
      maxSelect,
      allowComments,
      status: 'selecting',
      finalComment: '',
    });
  } catch (err) {
    throw new Error(`error creating collection document: ${err}`);
  }
  setUploadProgress(10);

  const photosRef = collectionRef.collection('photos');
  const batch = firestore.batch();

  const photos = await uploadPhotos(id, files, setUploadProgress);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    batch.set(photosRef.doc(photos[i].id), photo);
  }
  try {
    await batch.commit();
  } catch (err) {
    throw new Error(`error creating photos documents: ${err}`);
  }
  setUploadProgress(100);
  return id;
};

export const addMorePhotos = async (
  id: string,
  files: FileList,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const photosRef = firestore
    .collection('collections')
    .doc(id)
    .collection('photos');

  const batch = firestore.batch();

  const photos = await uploadPhotos(id, files, setUploadProgress);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    batch.set(photosRef.doc(photos[i].id), photo);
  }
  try {
    await batch.commit();
  } catch (err) {
    throw new Error(`error creating photos documents: ${err}`);
  }
  setUploadProgress(100);

  return;
};

const uploadPhotos = async (
  id: string,
  files: FileList,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const photosArray: Omit<Photo, 'index'>[] = [];
  const progressStep = 85 / files.length;
  let progress = 10;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > 500000) {
      throw new Error(`${files[i].name} filesize exceeds 0.5 MB`);
    }

    const uuid = uuidv4();
    const data = await parse(files[i], ['ModifyDate']);

    const storageRef = storage.ref(`${id}/${uuid}.jpg`);
    const uploadTask = await storageRef.put(files[i]);
    const downloadUrl = await uploadTask.ref.getDownloadURL();
    const urlWithoutEnding = downloadUrl.match(/.+?(?=.jpg\?alt=media)/);
    const filenameWithoutExt = files[i].name.match(/.+?(?=.jpg)/);
    const jpegUrl = `${urlWithoutEnding}.jpg?alt=media`;
    const webpUrl = `${urlWithoutEnding}_1400x1000.webp?alt=media`;
    const jpegThumbnailUrl = `${urlWithoutEnding}_400x700.jpg?alt=media`;
    const webpThumbnailUrl = `${urlWithoutEnding}_400x700.webp?alt=media`;

    photosArray.push({
      id: uuid,
      filename: `${filenameWithoutExt}`,
      filenameNumber: Number(files[i].name.match(/\d+/)),
      cloudUrl: jpegUrl,
      cloudUrlWebp: webpUrl,
      thumbnail: jpegThumbnailUrl,
      thumbnailWebp: webpThumbnailUrl,
      selected: false,
      comment: '',
      dateTaken: data ? data.ModifyDate : null,
    });
    progress += progressStep;
    setUploadProgress(progress);
  }
  return photosArray;
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
    throw new Error('failed updating selection');
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
    throw new Error('failed updating comment');
  }
};

export const confirmCollection = async (
  collectionId: string,
  finalComment?: string
) => {
  const collectionRef = firestore.collection('collections').doc(collectionId);
  try {
    await collectionRef.update({
      status: 'confirmed',
      finalComment: finalComment || '',
    });
  } catch (err) {
    throw new Error('failed confirming collection');
  }
};

export const deletePhotos = async (
  collectionId: string,
  photoIds: string[],
  setDeleteProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  setDeleteProgress(1);
  const photosRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos');

  const progressStep = 100 / photoIds.length;
  let progress = 0;

  try {
    for (let id of photoIds) {
      const storageRef = storage.ref(collectionId);
      const docRef = photosRef.doc(id);
      await storageRef.child(`${id}.jpg`).delete();
      await storageRef.child(`${id}_1400x1000.webp`).delete();
      await storageRef.child(`${id}_400x700.jpg`).delete();
      await storageRef.child(`${id}_400x700.webp`).delete();
      await docRef.delete();
      progress += progressStep;
      setDeleteProgress(progress);
    }
  } catch (err) {
    console.error('error deleting photos', err);
    return;
  }
  return;
};

export const deleteCollection = async (
  collectionId: string,
  setDeleteProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  setDeleteProgress(1);
  const photosRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos');

  const collectionRef = await firestore
    .collection('collections')
    .doc(collectionId);

  const photos = await photosRef.get();

  const progressStep = 100 / photos.size;
  let progress = 0;

  try {
    for (let photo of photos.docs) {
      const storageRef = storage.ref(collectionId);
      const docRef = photosRef.doc(photo.data().id);
      await storageRef.child(`${photo.data().id}.jpg`).delete();
      await storageRef.child(`${photo.data().id}_1400x1000.webp`).delete();
      await storageRef.child(`${photo.data().id}_400x700.jpg`).delete();
      await storageRef.child(`${photo.data().id}_400x700.webp`).delete();
      await docRef.delete();
      progress += progressStep;
      setDeleteProgress(progress);
    }
    await collectionRef.delete();
  } catch (err) {
    console.error('error deleting collection', err);
    return;
  }
  return;
};

export const getCollections = async () => {
  console.log('getting collections');
  const collectionsArray: Collection[] = [];
  const collections = await firestore
    .collection('collections')
    .orderBy('dateCreated')
    .get();
  for (const collection of collections.docs) {
    const photos = await firestore
      .collection('collections')
      .doc(collection.id)
      .collection('photos')
      .orderBy('dateTaken')
      .get();
    const photosArray: Photo[] = [];
    let index = 1;
    photos.forEach((photo) => {
      const photoObj = {
        index,
        id: photo.data().id,
        cloudUrl: photo.data().cloudUrl,
        cloudUrlWebp: photo.data().cloudUrlWebp,
        thumbnail: photo.data().thumbnail,
        thumbnailWebp: photo.data().thumbnailWebp,
        filename: photo.data().filename,
        filenameNumber: photo.data().filenameNumber,
        selected: photo.data().selected,
        comment: photo.data().comment,
        dateTaken: photo.data().dateTaken,
      };
      photosArray.push(photoObj);
      index++;
    });
    const collectionObj = {
      id: collection.id,
      title: collection.data().title,
      dateCreated: collection.data().dateCreated,
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
      .orderBy('dateTaken')
      .get();
    const photosArray: Photo[] = [];
    let index = 1;
    photos.forEach((photo) => {
      const photoObj = {
        index,
        id: photo.data().id,
        cloudUrl: photo.data().cloudUrl,
        cloudUrlWebp: photo.data().cloudUrlWebp,
        thumbnail: photo.data().thumbnail,
        thumbnailWebp: photo.data().thumbnailWebp,
        filename: photo.data().filename,
        filenameNumber: photo.data().filenameNumber,
        selected: photo.data().selected,
        comment: photo.data().comment,
        dateTaken: photo.data().dateTaken,
      };
      photosArray.push(photoObj);
      index++;
    });

    const collectionObj = {
      id: collection.id,
      title: collection.data()?.title,
      dateCreated: collection.data()?.dateCreated,
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
