import * as redis from 'redis'
import { promisify } from 'util';
import { Comment } from './types'

const redisOptions = {
  host: 'localhost',
  port: '6379',
}
let client;

// CRUD functions

export interface ICommentStorage {

  get(key): [Comment];
  add(key: string, author: string, content: string): [Comment];
  edit(key: string, msgId: number, content: string): [Comment];
  delete(key: string, msgId: number): [Comment];
}

export class CommentStorage {
  // Get Comments
  get(key): [Comment] {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const getAsync = promisify(client.lrange).bind(client);

    client.on('ready', () => {
      console.log('redis is ready.');
    });
    client.on('end', () => {
      console.log('redis closed.');
    });
    return getAsync(key, 0, -1).then((res) => {
      return res.map(row => JSON.parse(row));
    });
  }
  // Add Comments
  async add(key, author, content): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const lindexAsync = promisify(client.lindex).bind(client);
    let lastElement = await lindexAsync(key, -1);
    let new_msgId = 0;
    if (lastElement != null) {
      lastElement = JSON.parse(lastElement);
      new_msgId = lastElement.msgId + 1;
      console.log(lastElement.msgId);
    }

    let comment: Comment = {
      msgId: new_msgId,
      author: author,
      content: content,
      createdAt: Date.now()
    }
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const addAsync = promisify(client.rpush).bind(client);
    let value = JSON.stringify(comment);

    return addAsync(key, value).then((status) => {
      return this.get(key);
    });
  }
  // Edit Comments
  async edit(key, msgId, content): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.lset).bind(client);
    let comments = await this.get(key);

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].msgId === msgId) {
        console.log(comments[i]);
        if(content) comments[i].content = content;
        console.log(comments[i]);
        setAsync(key, i, JSON.stringify(comments[i]));
      }
    }

    return this.get(key);
  }
  //Delete Comments
  async delete(key, msgId): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const delAsync = promisify(client.lrem).bind(client);
    let comments = await this.get(key);

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].msgId === msgId) {
        console.log(comments[i]);
        delAsync(key, 0, JSON.stringify(comments[i]));
      }
    }

    return this.get(key);
  }
}
