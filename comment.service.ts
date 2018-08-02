import { Comment } from './types';
import { ICommentStorage, CommentStorage } from './comment.storage';

export interface ICommentService {

  getComments(itemId: string): [Comment];
  addComments(itemId: string, author: string, content: string): [Comment];
  editComments(itemId: string, msgId:number, content:string) : [Comment];
  deleteComments(itemId: string, msgId:number) : [Comment];
}


export class CommentService implements ICommentService {

  commentStore: ICommentStorage;

  constructor(store?: ICommentStorage) {
    if (store) {
      this.commentStore = store
    } else {
      this.commentStore = new CommentStorage();
    }
  }

  getComments(itemId): [Comment] {

    return this.commentStore.get(itemId);
  }

  addComments(itemId, author, content): [Comment] {

    return this.commentStore.add(itemId, author, content);
  }
  
  editComments(itemId, msgId, content): [Comment] {

    return this.commentStore.edit(itemId, msgId, content);
  }

  deleteComments(itemId, msgId) : [Comment]{

    return this.commentStore.delete(itemId, msgId);
  }
}

