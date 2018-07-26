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

  get(key): [String];
  add(key, msgId, author, content, createdAt): String
}

export class CommentStorage {

  get(key): [String] {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const getAsync = promisify(client.lrange).bind(client);

    client.on('ready', () => {
      console.log('redis is ready.');
    });
    client.on('end', () => {
      console.log('redis closed.');
    });
    console.log(getAsync(key, 0, -1));
    return getAsync(key, 0, -1).then((res) => {
      console.log(res);
      return res;
    });
  }

  add(key, msgId, author, content, createdAt): String {
    let comment: Comment = {
      msgId: msgId,
      author: author,
      content: content,
      createdAt: createdAt
    }
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.rpush).bind(client);
    console.log(comment);
    let value = JSON.stringify(comment);
    return setAsync(key, value).then((status) => {
      return status;
    });
  }
  async edit(key, msgId, content, createdAt): Promise<String> {

    const setAsync = promisify(client.rpush).bind(client);
    const getAsync = promisify(client.lrange).bind(client);
    let comments = await getAsync(key);
    return 
  }
}
