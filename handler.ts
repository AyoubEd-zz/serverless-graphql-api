import { ApolloServer, gql } from 'apollo-server-lambda';
import { CommentService } from './comment.service';

const typeDefs = gql`
  type Comment{
    msgId: Int
    userId : String
    content : String
    createdAt : String
  }
  type Query {
    get(itemId: String): [Comment]
  }
  type Mutation {
    add(itemId: String, userId:String, content:String): [Comment]
    edit(itemId: String, msgId:Int, content:String): [Comment]
    delete(itemId: String, msgId:Int) : [Comment]
  }
`;

const resolvers = {
  Query: {
    // Get Comments
    get: (root, args) => {
      const service = new CommentService();
      return service.getComments(args.itemId);
    },
  },
  Mutation: {
    // Add Comments
    add: (roots, args) => {
      const service = new CommentService();
      return service.addComments(args.itemId, args.userId, args.content);
    },
    //Edit Comment
    edit: (roots, args) => {
      const service = new CommentService();
      return service.editComments(args.itemId, args.msgId, args.content);
    },
    // Delete Comment
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