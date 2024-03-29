/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'exifr'

import { makeId } from './utils/makeId'
import { Collection, Photo } from './types'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

try {
  firebase.auth()
} catch (err) {
  // eslint-disable-next-line no-alert
  alert('Firebase config file is invalid or missing.')
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

const uploadPhotos = async (
  id: string,
  files: FileList,
  setUploadProgress: (progress: number) => void,
) => {
  const photosArray: Photo[] = []
  const progressStep = 85 / files.length
  let progress = 10

  for (let index = 0; index < files.length; index++) {
    if (files[index].size > 5000000) {
      throw new Error(`${files[index].name} filesize exceeds 5 MB`)
    }

    const uuid = uuidv4()
    const data = await parse(files[index], ['ModifyDate'])

    const storageRef = storage.ref(`${id}/${uuid}.jpg`)
    const uploadTask = await storageRef.put(files[index])
    const downloadUrl = await uploadTask.ref.getDownloadURL()
    const urlWithoutEnding = downloadUrl.match(/.+?(?=.jpg\?alt=media)/i)
    let filenameWithoutExt = files[index].name.match(/.+?(?=.jpg)/i)
    if (!filenameWithoutExt) {
      filenameWithoutExt = files[index].name.match(/.+?(?=.jpeg)/i)
    }
    const jpegUrl = `${urlWithoutEnding}_1400x1000.jpeg?alt=media`
    const webpUrl = `${urlWithoutEnding}_1400x1000.webp?alt=media`
    const jpegThumbnailUrl = `${urlWithoutEnding}_400x700.jpeg?alt=media`
    const webpThumbnailUrl = `${urlWithoutEnding}_400x700.webp?alt=media`

    photosArray.push({
      index: null,
      id: uuid,
      filename: `${filenameWithoutExt}`,
      filenameNumber: Number(files[index].name.match(/\d+/)),
      cloudUrl: jpegUrl,
      cloudUrlWebp: webpUrl,
      thumbnail: jpegThumbnailUrl,
      thumbnailWebp: webpThumbnailUrl,
      resizeReady: false,
      selected: false,
      comment: '',
      dateTaken: data ? data.ModifyDate : null,
    })

    progress += progressStep
    setUploadProgress(progress)
  }
  return photosArray
}

export const generateNewCollection = async (
  data: Omit<Collection, 'status' | 'finalComment' | 'photos' | 'id' | 'dateCreated'>,
  files: FileList,
  setUploadProgress: (progress: number) => void,
): Promise<string> => {
  if (!data || !files) {
    throw new Error('missing data or files')
  }
  setUploadProgress(1)

  let collectionRef
  let id
  let snapshot

  do {
    id = makeId(8)
    collectionRef = firestore.collection('collections').doc(id)
    snapshot = await collectionRef.get()
  } while (snapshot.exists)
  setUploadProgress(5)
  const { title, minSelect, maxSelect, allowComments } = data
  await collectionRef.set({
    title,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    minSelect,
    maxSelect,
    allowComments,
    status: 'selecting',
    finalComment: '',
  })
  setUploadProgress(10)

  const photosRef = collectionRef.collection('photos')
  const batch = firestore.batch()

  const photos = await uploadPhotos(id, files, setUploadProgress)

  for (let index = 0; index < photos.length; index++) {
    const photo = photos[index]
    batch.set(photosRef.doc(photos[index].id), photo)
  }
  await batch.commit()

  setUploadProgress(100)
  return id
}

export const updateSettings = async (
  data: Omit<Collection, 'status' | 'finalComment' | 'photos' | 'id' | 'dateCreated'>,
  collectionId: Collection['id'],
) => {
  const { title, minSelect, maxSelect, allowComments } = data
  const collectionRef = firestore.collection('collections').doc(collectionId)
  await collectionRef.update({
    title,
    minSelect,
    maxSelect,
    allowComments,
    status: 'selecting',
  })
}

export const reorderPhotos = async (photos: Photo[], collectionId: Collection['id']) => {
  const photosRef = firestore.collection('collections').doc(collectionId).collection('photos')

  const batch = firestore.batch()

  photos.forEach(photo => {
    batch.set(photosRef.doc(photo.id), photo)
  })

  await batch.commit()
}

export const changeSiteSettings = async (
  files: FileList,
  logoWidth: number,
  email: string,
  setUploadProgress: (progress: number) => void,
) => {
  const logoStorageRef = storage.ref(`logo`)
  let logoUrl: string | undefined
  if (files.length > 0) {
    let list
    try {
      list = await logoStorageRef.listAll()
    } catch {
      //
    }
    if (list && list.items.length > 0) {
      const filenames = ['logo.png']

      filenames.forEach(async filename => {
        try {
          await logoStorageRef.child(filename).delete()
        } catch {
          //
        }
      })
    }
    const uploadTask = await logoStorageRef.child('logo.png').put(files[0])
    logoUrl = await uploadTask.ref.getDownloadURL()
  }
  setUploadProgress(50)

  const settings = firestore.collection('settings').doc('settings')
  if (files.length > 0) {
    await settings.set({ logoUrl, logoWidth, email }, { merge: true })
  } else {
    await settings.set({ logoWidth, email }, { merge: true })
  }
  setUploadProgress(100)
}

export const getSiteSettings = async () => {
  const settings = await firestore.collection('settings').doc('settings').get()
  return settings.data()
}

export const addMorePhotos = async (
  id: string,
  files: FileList,
  setUploadProgress: (progress: number) => void,
) => {
  const photosRef = firestore.collection('collections').doc(id).collection('photos')

  const batch = firestore.batch()

  const photos = await uploadPhotos(id, files, setUploadProgress)

  for (let index = 0; index < photos.length; index++) {
    const photo = photos[index]
    batch.set(photosRef.doc(photos[index].id), photo)
  }
  await batch.commit()

  setUploadProgress(100)
}

export const setResizeReady = (collectionId: Collection['id'], photoId: Photo['id']) => {
  const photoRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .doc(photoId)

  photoRef.update({ resizeReady: true })
}

export const updatePhotoSelection = async (
  collectionId: Collection['id'],
  photoId: Photo['id'],
  selected: boolean,
) => {
  const photoRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .doc(photoId)

  await photoRef.update({ selected })
}
export const updatePhotoComment = async (
  collectionId: Collection['id'],
  photoId: Photo['id'],
  comment: string,
) => {
  const photoRef = firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .doc(photoId)

  await photoRef.update({ comment })
}

export const confirmCollection = async (
  collectionId: Collection['id'],
  title: Collection['title'],
  url: string,
  selectedPhotos: number | undefined,
  finalComment: string,
) => {
  const collectionRef = firestore.collection('collections').doc(collectionId)

  const mailRef = firestore.collection('mail').doc(collectionId)

  const settings = await getSiteSettings()

  await mailRef.set({
    to: settings?.email,
    message: {
      subject: `${title} is confirmed`,
      text: `Collection '${title}' is confirmed. URL: ${url}`,
      html: `
      <h1>${title} is confirmed</h1>
      <p>Selected photos: ${selectedPhotos}</p>
      <p>Final comment: ${finalComment}</p>
      <p>You can see the selections here: <a href='${url}'>${url}</a></p>
      `,
    },
  })

  await collectionRef.update({
    status: 'confirmed',
    finalComment: finalComment || '',
  })
}

export const deletePhotos = async (
  collectionId: Collection['id'],
  photoIds: Photo['id'][],
  setDeleteProgress: (progress: number) => void,
) => {
  setDeleteProgress(1)
  const photosRef = firestore.collection('collections').doc(collectionId).collection('photos')

  const progressStep = 100 / photoIds.length
  let progress = 0

  for (const id of photoIds) {
    const storageRef = storage.ref(collectionId)
    const docRef = photosRef.doc(id)
    await storageRef.child(`${id}_1400x1000.jpeg`).delete()
    await storageRef.child(`${id}_1400x1000.webp`).delete()
    await storageRef.child(`${id}_400x700.jpeg`).delete()
    await storageRef.child(`${id}_400x700.webp`).delete()
    await docRef.delete()
    progress += progressStep
    setDeleteProgress(progress)
  }
}

export const resetPhotos = async (collectionId: Collection['id'], photos: Photo[]) => {
  const photosRef = firestore.collection('collections').doc(collectionId).collection('photos')
  const batch = firestore.batch()

  for (const photo of photos) {
    batch.update(photosRef.doc(photo.id), { selected: false, comment: '' })
  }

  await batch.commit()
}

const deleteMailDoc = async (collectionId: Collection['id']) => {
  const mailRef = firestore.collection('mail').doc(collectionId)

  const snapshot = await mailRef.get()

  if (snapshot.exists) {
    mailRef.delete()
  }
}

export const deleteCollection = async (
  collectionId: Collection['id'],
  setDeleteProgress: (progress: number) => void,
) => {
  setDeleteProgress(1)
  const photosRef = firestore.collection('collections').doc(collectionId).collection('photos')

  const collectionRef = firestore.collection('collections').doc(collectionId)

  const photos = await photosRef.get()

  const progressStep = 100 / photos.size
  let progress = 0
  for (const photo of photos.docs) {
    const storageRef = storage.ref(collectionId)
    const docRef = photosRef.doc(photo.data().id)
    await storageRef.child(`${photo.data().id}_1400x1000.jpeg`).delete()
    await storageRef.child(`${photo.data().id}_1400x1000.webp`).delete()
    await storageRef.child(`${photo.data().id}_400x700.jpeg`).delete()
    await storageRef.child(`${photo.data().id}_400x700.webp`).delete()
    await docRef.delete()
    progress += progressStep
    setDeleteProgress(progress)
  }
  await collectionRef.delete()

  deleteMailDoc(collectionId)
}

export const getCollections = async () => {
  const collectionsArray: Collection[] = []
  const collections = await firestore.collection('collections').orderBy('dateCreated', 'desc').get()
  for (const collection of collections.docs) {
    const photos = await firestore
      .collection('collections')
      .doc(collection.id)
      .collection('photos')
      .orderBy('dateTaken')
      .get()
    const photosArray: Photo[] = []
    let index = 1
    photos.forEach(photo => {
      const photoObj = {
        index,
        id: photo.data().id,
        cloudUrl: photo.data().cloudUrl,
        cloudUrlWebp: photo.data().cloudUrlWebp,
        thumbnail: photo.data().thumbnail,
        thumbnailWebp: photo.data().thumbnailWebp,
        filename: photo.data().filename,
        filenameNumber: photo.data().filenameNumber,
        resizeReady: photo.data().resizeReady,
        selected: photo.data().selected,
        comment: photo.data().comment,
        dateTaken: photo.data().dateTaken,
      }
      photosArray.push(photoObj)
      index++
    })
    const collectionObj = {
      id: collection.id,
      title: collection.data().title,
      dateCreated: collection.data().dateCreated.seconds,
      minSelect: collection.data().minSelect,
      maxSelect: collection.data().maxSelect,
      allowComments: collection.data().allowComments,
      status: collection.data().status,
      finalComment: collection.data().finalComment,
      photos: photosArray,
    }
    collectionsArray.push(collectionObj)
  }
  return collectionsArray
}

export const getSingleCollection = async (collectionId: Collection['id']) => {
  const collection = await firestore.collection('collections').doc(collectionId).get()
  if (!collection.exists) {
    throw new Error("collection doesn't exist")
  }
  const photos = await firestore
    .collection('collections')
    .doc(collectionId)
    .collection('photos')
    .orderBy('index')
    .orderBy('dateTaken')
    .get()
  const photosArray: Photo[] = []
  let index = 1
  photos.forEach(photo => {
    const photoObj = {
      index,
      id: photo.data().id,
      cloudUrl: photo.data().cloudUrl,
      cloudUrlWebp: photo.data().cloudUrlWebp,
      thumbnail: photo.data().thumbnail,
      thumbnailWebp: photo.data().thumbnailWebp,
      resizeReady: photo.data().resizeReady,
      filename: photo.data().filename,
      filenameNumber: photo.data().filenameNumber,
      selected: photo.data().selected,
      comment: photo.data().comment,
      dateTaken: photo.data().dateTaken,
    }
    photosArray.push(photoObj)
    index++
  })

  const collectionObj = {
    id: collection.id,
    title: collection.data()?.title,
    dateCreated: collection.data()?.dateCreated.seconds,
    minSelect: collection.data()?.minSelect,
    maxSelect: collection.data()?.maxSelect,
    allowComments: collection.data()?.allowComments,
    status: collection.data()?.status,
    finalComment: collection.data()?.finalComment,
    photos: photosArray,
  }
  return collectionObj
}

export const changeCollectionStatus = async (
  collectionId: Collection['id'],
  status: Collection['status'],
) => {
  const collectionRef = firestore.collection('collections').doc(collectionId)

  await collectionRef.update({ status })

  if (status === 'editing') {
    deleteMailDoc(collectionId)
  }
}
