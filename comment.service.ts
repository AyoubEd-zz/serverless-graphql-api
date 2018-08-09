import { Comment } from './types';
import { ICommentStorage, CommentStorage } from './comment.storage';

export interface ICommentService {

  getComments(itemId: string): Promise<[Comment]>;
  addComments(itemId: string, userId: string, content: string): Promise<[Comment]>;
  editComments(itemId: string, msgId:number, content:string) : Promise<[Comment]>;
  deleteComments(itemId: string, msgId:number) : Promise<[Comment]>;

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

  getComments(itemId): Promise<[Comment]> {


    return this.commentStore.get(itemId);
  }

  addComments(itemId, userId, content): Promise<[Comment]> {

    return this.commentStore.add(itemId, userId, content);
  }
  
  editComments(itemId, msgId, content): Promise<[Comment]> {

    return this.commentStore.edit(itemId, msgId, content);
  }

  deleteComments(itemId, msgId) : Promise<[Comment]>{

    return this.commentStore.delete(itemId, msgId);
  }
}
