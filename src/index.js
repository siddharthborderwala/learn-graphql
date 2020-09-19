import { GraphQLServer } from "graphql-yoga";

import prisma from "./prisma";
import resolvers from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request) => ({
    prisma,
    request,
  }),
});

server.start().then((value) => {
  console.log(`Server listening on http://localhost:${value.address().port}`);
});
