import * as redis from 'redis';
import { promisify } from 'util';

const redisOptions = {
    host: 'localhost',
    port: '6379',
}
let client;
export const getComments = async (id) => {
    

}
// Creating a comment function
export const setComments = (id, content) => {

    client = redis.createClient(redisOptions.port, redisOptions.host);
    const setAsync = promisify(client.rpush).bind(client);

    client.on('connect', () => {
        console.log('redis has started.');
    });
    client.on('ready', () => {
        console.log('redis is ready.');
    });
    client.on('end', () => {
        console.log('redis closed.');
    });
    return setAsync(id, content).then(function (res) {
        if (res === null) return "we were not able to SAVE the specified rfqid";
        return res;
    });
}