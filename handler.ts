import { ApolloServer, gql } from 'apollo-server-lambda';
import { getComments, setComments } from './function'

const typeDefs = gql`
  type Query {
    get(rfqid: String): String
  }
  type Mutation {
    set(rfqid: String, content:String): String
  }
`;
let f;

const resolvers = {
  Query: {
    get: (root, args) => {
      return getComments(args.rfqid, f);
    },
  },
  Mutation: {
    set: (roots, args) => {
      return setComments(args.rfqid, args.content, f);
    }
  }
};

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context:(event, context)=>{
  //   context.callbackWaitsForEmptyEventLoop = false;
  // }
});

exports.graphqlHandler = server.createHandler();