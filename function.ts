import * as redis from 'redis'
import { promisify } from 'util';

const redisOptions = {
    host: 'localhost',
    port: '6379',
    // password: process.env.REDIS_PASS
}

let client;

export const getComments = (rfqid, f) => {
    if (!f) {
        client = redis.createClient(redisOptions.port, redisOptions.host);
        console.log("creating client");
    }
    f = 1;
    const getAsync = promisify(client.get).bind(client);
    client.on('connect', () => {
        console.log('redis has started.');
    });
    client.on('ready', () => {
        console.log('redis is ready.');
    });
    client.on('end', () => {
        console.log('redis closed.');
    });
    return getAsync(rfqid).then(function (res) {
        if (res === null) return "we were not able to FIND the specified rfqid";
        return res;
    });
}

export const setComments = (rfqid, content, f) => {

    if (!f) {
        client = redis.createClient(redisOptions.port, redisOptions.host);
        console.log("creating client");
    }
    f = 1;
    const setAsync = promisify(client.set).bind(client);
    client.on('connect', () => {
        console.log('redis has started.');
    });
    client.on('ready', () => {
        console.log('redis is ready.');
    });
    client.on('end', () => {
        console.log('redis closed.');
    });
    return setAsync(rfqid, content).then(function (res) {
        if (res === null) return "we were not able to SAVE the specified rfqid";
        return res;
    });
}