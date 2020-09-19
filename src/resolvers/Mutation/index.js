import userMutations from "./user";
import commentMutations from "./comment";
import postMutations from "./post";

const Mutation = {
  ...userMutations,
  ...commentMutations,
  ...postMutations,
};

export { Mutation as default };
