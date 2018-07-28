import { Comment } from './types';
import { ICommentStorage, CommentStorage } from './comment.storage';

export interface ICommentService {

  getComments(itemId: string): [Comment];
  addComments(itemId: string, author: string, content: string): string;
  editComments(itemId: string, msgId:number, author:string, content:string) : string;
  deleteComments(itemId: string, msgId:number) : string;
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

  addComments(itemId, author, content): string {

    return this.commentStore.add(itemId, author, content);
  }
  
  editComments(itemId, msgId, author, content): string {

    return this.commentStore.edit(itemId, msgId, author, content);
  }

  deleteComments(itemId, msgId) : string{

    return this.commentStore.delete(itemId, msgId);
  }
}

