import { Comment } from './types'

export interface ICommentStorage {
  get(key): [Comment]
}

export class CommentStorage {
  get(key): [Comment] {
   return [{
      author: 'ayoub',
      content: 'from data store',
      createAt: '2018-09-12'
    }];
  }
}
