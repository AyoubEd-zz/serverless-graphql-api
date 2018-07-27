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
  add(key: string, author: string, content: string): string;
  edit(key: string, msgId: number, author: string, content: string, createdAt: string): string;
  delete(key: string, msgId: number): string;
}

export class CommentStorage {

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

  async add(key, author, content): Promise<string> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const lindexAsync = promisify(client.lindex).bind(client);
    let lastElement = await lindexAsync(key, -1);
    lastElement = JSON.parse(lastElement);
    console.log(lastElement.msgId);

    let comment: Comment = {
      msgId: lastElement.msgId+1,
      author: author,
      content: content,
      createdAt: Date.now()
    }
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const addAsync = promisify(client.rpush).bind(client);
    let value = JSON.stringify(comment);

    return addAsync(key, value).then((status) => {
      return status;
    });
  }

  async edit(key, msgId, author, content, createdAt): Promise<[Comment]> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.lset).bind(client);
    let comments = this.get(key);
    let i = 0;
    comments.forEach(element => {
      if (element.msgId === msgId) {
        if (author) element.author = author;
        if (content) element.content = content;
        if (createdAt) element.createdAt = createdAt;
        setAsync(key, i, element);
      }
      i++;
    });
    for(let i = 0;i<comments.length;i++){

    }
    return comments;
  }

  delete(key, msgId): string {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const delAsync = promisify(client.lrem).bind(client);
    let comments = this.get(key);
    comments.forEach(element => {
      if (element.msgId === msgId) {
        delAsync(key, 0 , element);
      }
    });
    return "OK";
  }
}
