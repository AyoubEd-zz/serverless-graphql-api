import * as redis from 'redis'
import {
    promisify
} from 'util';

const redisOptions = {
    host: 'localhost',
    port: '6379',
    // password: process.env.REDIS_PASS
}

let client;

export const getComments = async (rfqid, f) => {
    var comments = [];
    if (!f) {
        client = redis.createClient(redisOptions.port, redisOptions.host);
        console.log("creating client");
    }
    f = 1;
    const getAsync = promisify(client.LINDEX).bind(client);

    function fun(rfqid, i) {
        return getAsync(rfqid, i).then(function (res) {
            if (res === null) return null;
            console.log("-In the function log :" + res + "\n");
            return res;
        });
    }
    client.on('connect', () => {
        console.log('redis has started.');
    });
    client.on('ready', () => {
        console.log('redis is ready.');
    });
    client.on('end', () => {
        console.log('redis closed.');
    });
    let i = 0;
    let res;
    do {
        res = await fun(rfqid, i).then((reply) => {
            return reply;
        });
        console.log("+In the while log :" + res + "\n");
        if (res !== null) {
            comments[i] = res;
        } else {
            break;
        }
        i++;
    } while (res !== null);
    console.log(JSON.stringify(comments));
    return JSON.stringify(comments);

}

export const setComments = (rfqid, content, f) => {

    if (!f) {
        client = redis.createClient(redisOptions.port, redisOptions.host);
        console.log("creating client");
    }
    f = 1;
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
    return setAsync(rfqid, content).then(function (res) {
        if (res === null) return "we were not able to SAVE the specified rfqid";
        return res;
    });
}