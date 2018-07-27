import { Comment } from './types';
import { ICommentStorage, CommentStorage } from './comment.storage';

export interface ICommentService {

  getComments(itemId: string): [Comment];
  addComments(itemId: string, msgId: string, author: String, content: String, createdAt: String): String;
  // editComments(itemId: String, )
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

  addComments(itemId, msgId, author, content, createdAt): String {

    return this.commentStore.add(itemId, msgId, author, content, createdAt);
  }
  
  editComments(itemId, content, createdAt): String {

    return this.commentStore.edit(itemId, content, createdAt);
  }
}

