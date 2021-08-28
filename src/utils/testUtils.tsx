import { Collection, Photo } from '../types'

export const filteredPhotos: Photo[] = [
  {
    index: 1,
    id: 'photoId1',
    filename: 'photo1',
    filenameNumber: 1,
    cloudUrl: 'www.cloudurl.lt1',
    cloudUrlWebp: 'www.cloudurl.lt/webp1',
    thumbnail: 'www.cloudurl.lt/thumbnail1',
    thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp1',
    resizeReady: true,
    selected: false,
    comment: '',
    dateTaken: 999,
  },
  {
    index: 2,
    id: 'photoId2',
    filename: 'photo2',
    filenameNumber: 2,
    cloudUrl: 'www.cloudurl.lt2',
    cloudUrlWebp: 'www.cloudurl.lt/webp2',
    thumbnail: 'www.cloudurl.lt/thumbnail2',
    thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp2',
    resizeReady: true,
    selected: true,
    comment: 'test comment',
    dateTaken: 999,
  },
]

export const collection: Collection = {
  id: 'collectionId',
  dateCreated: 999,
  title: 'collection title',
  minSelect: { required: true, goal: 1 },
  maxSelect: { required: true, goal: 2 },
  allowComments: true,
  status: 'selecting',
  finalComment: '',
  photos: filteredPhotos,
}

export const collectionList: Collection[] = [
  {
    id: 'collectionId1',
    dateCreated: 999,
    title: 'collection title 1',
    minSelect: { required: true, goal: 1 },
    maxSelect: { required: true, goal: 2 },
    allowComments: true,
    status: 'selecting',
    finalComment: '',
    photos: filteredPhotos,
  },
  {
    id: 'collectionId2',
    dateCreated: 999,
    title: 'collection title 2',
    minSelect: { required: true, goal: 1 },
    maxSelect: { required: true, goal: 2 },
    allowComments: true,
    status: 'selecting',
    finalComment: '',
    photos: filteredPhotos,
  },
]
