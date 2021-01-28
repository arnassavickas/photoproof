import { Collection } from '../types';

export const collections: Collection[] = [
  {
    title: 'first collection',
    minSelect: { required: true, goal: 4 },
    maxSelect: { required: true, goal: 7 },
    allowComments: true,
    status: 'selecting',
    finalComment: '',
  },
];
