export interface Collection {
  id: string;
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
