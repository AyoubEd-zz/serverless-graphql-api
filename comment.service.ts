import {Comment} from './types';
import {ICommentStorage, CommentStorage } from './comment.storoge';

export interface ICommentService {
  getComments(itemId: string): [Comment]
}


export class CommentService implements ICommentService {
  commentStore: ICommentStorage;

  constructor(store?: ICommentStorage){
    if(store){
      this.commentStore = store
    }else{
      this.commentStore = new CommentStorage();
    }
  }

  getComments(itemId): [Comment] {
    return this.commentStore.get(itemId);
  }
}

