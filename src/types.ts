export interface Collection {
  title: string;
  minSelect: SelectionGoal;
  maxSelect: SelectionGoal;
  allowComments: boolean;
  status: 'editing' | 'selecting' | 'confirmed';
  finalComment: string;
}

export type SelectionGoal = {
  required: boolean;
  goal: number;
};

export type Photo = {
  id: string;
  filename: string;
  cloudUrl: string;
  selected: boolean;
  comment: string;
  spotComments: string[];
};
