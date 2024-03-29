export interface Collection {
  id: string
  dateCreated: number
  title: string
  minSelect: SelectionGoal
  maxSelect: SelectionGoal
  allowComments: boolean
  status: 'editing' | 'selecting' | 'confirmed'
  finalComment: string
  photos: Photo[]
}

export type SelectionGoal = {
  required: boolean
  goal: number
}

export type Photo = {
  index: number | null
  id: string
  filename: string
  filenameNumber: number
  cloudUrl: string
  cloudUrlWebp: string
  thumbnail: string
  thumbnailWebp: string
  resizeReady: boolean
  selected: boolean
  comment: string
  dateTaken: number | null
}

export interface NewCollectionInputs {
  files: FileList
  title: string
  minSelectRequired: boolean
  minSelectGoal: number
  maxSelectRequired: boolean
  maxSelectGoal: number
  allowComments: boolean
}

export interface LockedViewProps {
  lightboxOpen: boolean
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>
  openLightbox: (index: number) => void
  openCommentModal: (index?: number | undefined) => void
  photoIndex: number
  setPhotoIndex: React.Dispatch<React.SetStateAction<number>>
  commentOpen: boolean
  setCommentOpen: React.Dispatch<React.SetStateAction<boolean>>
  commentTextarea: string
}

export interface SelectionViewProps extends LockedViewProps {
  setCommentTextarea: React.Dispatch<React.SetStateAction<string>>
  selectedPhotos: number | undefined
}

export interface CollectionDetailsProps {
  setConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setConfirmationDialogTitle: React.Dispatch<React.SetStateAction<string>>
  setConfirmationDialogContentText: React.Dispatch<React.SetStateAction<string>>
  setConfirmationDialogAgree: React.Dispatch<React.SetStateAction<(value: any) => void>>
}

export interface PhotoTableToolbarProps {
  setConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setConfirmationDialogTitle: React.Dispatch<React.SetStateAction<string>>
  setConfirmationDialogContentText: React.Dispatch<React.SetStateAction<string>>
  setConfirmationDialogAgree: React.Dispatch<React.SetStateAction<(value: any) => void>>
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  setAddPhotosDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PhotoTableProps {
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  setPhotoIndex: React.Dispatch<React.SetStateAction<number>>
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AddPhotosDialogProps {
  addPhotosDialogOpen: boolean
  setAddPhotosDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface ConfirmationForbiddenProps {
  selectedPhotos: number | undefined
  confirmForbidDialogOpen: boolean
  setConfirmForbidDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PhotoGridProps {
  openLightbox: (index: number) => void
  openCommentModal: (index?: number | undefined) => void
}

export interface SelectionConfirmationDialogProps {
  selectedPhotos: number | undefined
  confirmDialogOpen: boolean
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface LightboxProps {
  lightboxOpen: boolean
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>
  lightboxIndex: number
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>
  toolbarButtons: React.ReactNode[]
}

export interface ConfirmationDialogProps {
  dialogOpen: boolean
  onClickCancel: React.MouseEventHandler<HTMLButtonElement>
  onClickAgree: React.MouseEventHandler<HTMLButtonElement>
  dialogTitle: string
  dialogContentText: string
}

export interface CommentDialogProps {
  commentOpen: boolean
  setCommentOpen: React.Dispatch<React.SetStateAction<boolean>>
  commentTextarea: string
  setCommentTextarea?: React.Dispatch<React.SetStateAction<string>>
  actionButtons?: React.ReactNode[]
  disabled?: boolean
}

export interface StatusIconProps {
  status: Collection['status'] | undefined
}

export enum UiState {
  Idle = 'Idle',
  Pending = 'Pending',
  Success = 'Success',
  Failure = 'Failure',
}
