# Serverless Backend with Graphql and Redis DB

Set it up yourself: https://medium.com/@ayoub.edakhly/a-dummy-guide-to-building-your-first-api-using-serverless-typescript-and-graphql-5802d13874a0

## Serverless :

Install Dependencies using : 
```
npm i
```
Set aws credentials : 
```
serverless config credentials --provider aws --key KEY --secret SECRET_KEY
```
Run for Dev Env : 
```
npm start
```
Deploy  : 
```
sls deploy -v
```

## Redis : 

Access the EC2 instance using ssh
run redis : 
```
docker run  --volume /docker/redis-data:/data -p 6379:6379 -d redis   redis-server --appendonly yes
```
