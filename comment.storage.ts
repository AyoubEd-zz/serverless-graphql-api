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
  add(key, author, content, createdAt): String
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

  async add(key, author, content, createdAt): Promise<String> {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const getLnAsync = promisify(client.llen).bind(client);
    console.log(getLnAsync(key));
    let msgId = await getLnAsync(key);
    console.log(msgId + 1);
    let comment: Comment = {
      msgId: msgId + 1,
      author: author,
      content: content,
      createdAt: createdAt
    }
    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.rpush).bind(client);

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
