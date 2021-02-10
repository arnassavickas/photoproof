export interface Collection {
  id: string;
  dateCreated: Date;
  title: string;
  minSelect: SelectionGoal;
  maxSelect: SelectionGoal;
  allowComments: boolean;
  status: 'editing' | 'selecting' | 'confirmed';
  finalComment: string;
  photos: Photo[];
}

export type SelectionGoal = {
  required: boolean;
  goal: number;
};

export type Photo = {
  index: number;
  id: string;
  filename: string;
  filenameNumber: number;
  cloudUrl: string;
  cloudUrlWebp: string;
  thumbnail: string;
  thumbnailWebp: string;
  selected: boolean;
  comment: string;
  dateTaken: Date | null;
};

export interface LockedViewProps {
  collection: Collection;
  filteredPhotos: Photo[];
  lightboxOpen: boolean;
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openLightbox: (index: number) => (event: any) => void;
  openCommentModal: (index?: number | undefined) => void;
  photoIndex: number;
  setPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
  commentOpen: boolean;
  setCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  commentTextarea: string;
}

export interface SelectionViewProps extends LockedViewProps {
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  collectionId: string;
  setCommentTextarea: React.Dispatch<React.SetStateAction<string>>;
  selectedPhotos: number | undefined;
}
