import { ApolloServer, gql } from 'apollo-server-lambda';
import { ICommentService, CommentService } from './comment.service'

const typeDefs = gql`
  type comment{
    auhtor : String
    content : String
    createdAt : String
  }
  type Query {
    get(itemId: String): [comment]
  }

  type Mutation {
    set(itemId: String): String
  }
`;
let f;

const resolvers = {
  Query: {
    get: (root, args) => {
      const service = new CommentService();

      return service.getComments(args.itemId);
    },
  },
  Mutation: {
    set: (roots, args) => {
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.graphqlHandler = server.createHandler();
