

# Serverless Backend with Graphql

This is simple GraphQl API built using [Serverless Framework](https://serverless.com/).

([A link to the Medium article containing all the steps to build this project](https://medium.com/@ayoub.edakhly/a-dummy-guide-to-building-your-first-api-using-serverless-typescript-and-graphql-5802d13874a0))

## Serverless :

Install Dependencies using : 
```
$ npm i
```
Set aws credentials : 
```
$ serverless config credentials --provider aws --key KEY --secret SECRET_KEY
```
Run for Dev Env : 
```
$ npm start
```
Deploy  : 
```
$ sls deploy -v
```

## Redis DB : 

Run Redis on Docker: 
```
$ docker run  --volume /docker/redis-data:/data -p 6379:6379 -d redis   redis-server --appendonly yes
```
