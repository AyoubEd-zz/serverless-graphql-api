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
    add(itemId: String, author:String, content:String): [Comment]
    edit(itemId: String, msgId:Int, content:String): [Comment]
    delete(itemId: String, msgId:Int) : [Comment]
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
      return service.addComments(args.itemId, args.author, args.content);
    },
    edit: (roots, args) => {
      const service = new CommentService();
      return service.editComments(args.itemId, args.msgId, args.content);
    },
    delete: (roots, args) => {
      const service = new CommentService();
      return service.deleteComments(args.itemId, args.msgId);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.graphqlHandler = server.createHandler();