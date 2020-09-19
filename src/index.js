import { GraphQLServer } from "graphql-yoga";

import prisma from "./prisma";
import resolvers, { fragmentReplacements } from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request) => ({
    prisma,
    request,
  }),
  fragmentReplacements,
});

server.start().then((value) => {
  console.log(`Server listening on http://localhost:${value.address().port}`);
});
