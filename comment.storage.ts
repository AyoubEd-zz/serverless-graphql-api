import * as redis from 'redis'
import { promisify } from 'util';
import { Comment } from './types'

const redisOptions = {
  host: process.env.redisHost,
  port: process.env.redisPort,
}
let client;


export interface ICommentStorage {

  get(key): Promise<[Comment]>;
  add(key: string, userId: string, content: string): Promise<[Comment]>;
  edit(key: string, msgId: number, userId: string, content: string): Promise<[Comment]>;
  delete(key: string, msgId: number, userId: string): Promise<[Comment]>;

}

export class CommentStorage {

  // CRUD functions
  // Get Comments : fetch all comments related to it the module(rfq,quote)
  get(key): Promise<[Comment]> {


    client = redis.createClient(redisOptions.port, redisOptions.host);
    const getAsync = promisify(client.lrange).bind(client);

    client.on('ready', () => {
      console.log('redis is ready.');
    });
    client.on('end', () => {
      console.log('redis closed.');
    });
    return getAsync(key, 0, -1).then((res) => {
      return res
        .map(row => JSON.parse(row))
        .filter(row => (row.deleted == false));
    });
  }
  getNotFiletered(key): Promise<[Comment]> {
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const getAsync = promisify(client.lrange).bind(client);

    return getAsync(key, 0, -1).then((res) => {
      return res
        .map(row => JSON.parse(row));
    });
  }
  // Add Comments : appends a comment to the list for a specific item
  async add(key, userId, content): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const lindexAsync = promisify(client.lindex).bind(client);
    let lastElement = await lindexAsync(key, -1);
    let new_msgId = 0;
    if (lastElement != null) {
      lastElement = JSON.parse(lastElement);
      new_msgId = lastElement.msgId + 1;
    }

    let comment: Comment = {
      msgId: new_msgId,
      userId: userId,
      content: content,
      createdAt: Date.now(),
      deleted: false
    }
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const addAsync = promisify(client.rpush).bind(client);
    let value = JSON.stringify(comment);

    return addAsync(key, value).then((status) => {
      return this.get(key);
    });
  }
  // Edit Comments  : loop through comments and edit the one with the specific msgId
  async edit(key, msgId, userId, content): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.lset).bind(client);
    let comments = await this.getNotFiletered(key);

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].msgId == msgId && comments[i].userId == userId) {
        if (content) comments[i].content = content;
        setAsync(key, i, JSON.stringify(comments[i]));
        
      }
    }

    return this.get(key);
  }
  //Delete Comments : loop through the comments and delete the comment with specific msgId
  async delete(key, msgId, userId): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.lset).bind(client);
    let comments = await this.getNotFiletered(key);

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].msgId === msgId && userId == comments[i].userId
        && comments[i].deleted == false) {

        comments[i].deleted = true;
        setAsync(key, i, JSON.stringify(comments[i]));

      }
    }

    return this.get(key);
  }
}
