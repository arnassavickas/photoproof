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

export interface NewCollectionInputs {
  files: FileList;
  title: string;
  minSelectRequired: boolean;
  minSelectGoal: number;
  maxSelectRequired: boolean;
  maxSelectGoal: number;
  allowComments: boolean;
}

export interface LockedViewProps {
  collection: Collection;
  filteredPhotos: Photo[];
  lightboxOpen: boolean;
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openLightbox: (index: number) => void;
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

export interface CollectionDetailsProps {
  collectionId: string;
  collection: Collection;
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  setConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmationDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  setConfirmationDialogContentText: React.Dispatch<
    React.SetStateAction<string>
  >;
  setConfirmationDialogAgree: React.Dispatch<
    React.SetStateAction<(value: any) => void>
  >;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

export interface PhotoTableToolbarProps {
  collectionId: string;
  collection: Collection;
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  filteredPhotos: Photo[];
  setFilteredPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  setConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmationDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  setConfirmationDialogContentText: React.Dispatch<
    React.SetStateAction<string>
  >;
  setConfirmationDialogAgree: React.Dispatch<
    React.SetStateAction<(value: any) => void>
  >;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setAddPhotosDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PhotoTableProps {
  collection: Collection;
  filteredPhotos: Photo[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddPhotosDialogProps {
  collectionId: string;
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  addPhotosDialogOpen: boolean;
  setAddPhotosDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
}
export interface ConfirmationForbiddenProps {
  collection: Collection;
  selectedPhotos: number | undefined;
  confirmForbidDialogOpen: boolean;
  setConfirmForbidDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PhotoGridProps {
  collectionId?: string;
  collection: Collection;
  setCollection?: React.Dispatch<React.SetStateAction<Collection | null>>;
  filteredPhotos: Photo[];
  openLightbox: (index: number) => void;
  openCommentModal: (index?: number | undefined) => void;
}

export interface SelectionConfirmationDialogProps {
  collection: Collection;
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  collectionId: string;
  selectedPhotos: number | undefined;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LightboxProps {
  filteredPhotos: Photo[];
  lightboxOpen: boolean;
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lightboxIndex: number;
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
  toolbarButtons: React.ReactNode[];
}

export interface ConfirmationDialogProps {
  dialogOpen: boolean;
  progress?: number;
  onClickCancel: React.MouseEventHandler<HTMLButtonElement>;
  onClickAgree: React.MouseEventHandler<HTMLButtonElement>;
  dialogTitle: string;
  dialogContentText: string;
}

export interface CommentDialogProps {
  commentOpen: boolean;
  setCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  commentTextarea: string;
  setCommentTextarea?: React.Dispatch<React.SetStateAction<string>>;
  actionButtons?: React.ReactNode[];
  disabled?: boolean;
}

export interface SettingsProps {
  logoWidth: number;
  setLogoWidth: React.Dispatch<React.SetStateAction<number>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export interface StatusIconProps {
  status: Collection['status'];
}


//FilterButtons
interface RequiredFilterButtonsProps {
  collection: Collection;
  setFilteredPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

type TruncateFilterButtonsProps =
  | {
      modifyLightbox?: false;
      setLightboxOpen?: never;
      photoIndex?: never;
      setPhotoIndex?: never;
    }
  | {
      modifyLightbox: true;
      setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
      photoIndex: number;
      setPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
    };

export type FilterButtonsProps = RequiredFilterButtonsProps &
  TruncateFilterButtonsProps;
