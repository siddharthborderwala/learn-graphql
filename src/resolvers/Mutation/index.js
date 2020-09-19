import userMutations from "./user";
import commentMutations from "./comment";
import postMutations from "./post";

export const jwtSecret = "this-is-the-best-secret";

const Mutation = {
  ...userMutations,
  ...commentMutations,
  ...postMutations,
};

export { Mutation as default };
