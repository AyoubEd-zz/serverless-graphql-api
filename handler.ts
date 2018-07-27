import { ApolloServer, gql } from 'apollo-server-lambda';
import { CommentService } from './comment.service';

const typeDefs = gql`
  type Comment{
    msgId: Int
    author : String
    content : String
    createdAt : String
  }
  type Query {
    get(itemId: String): [Comment]
  }
  type Mutation {
    add(itemId: String, msgId:Int, author:String, content:String, createdAt:String): String
  }
  type Mutation2 {
    edit(itemId: String, content:String, createdAt:String): String
  }
`;

const resolvers = {
  Query: {
    get: (root, args) => {
      const service = new CommentService();
      return service.getComments(args.itemId);
    },
  },
  Mutation: {
    add: (roots, args) => {
      const service = new CommentService();
      return service.addComments(args.itemId, args.msgId, args.author, args.content, args.createdAt);
    }
  },
  Mutation2: {
    edit: (roots, args) => {
      const service = new CommentService();
      return service.editComments(args.itemId, args.author, args.content, args.createdAt);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.graphqlHandler = server.createHandler();