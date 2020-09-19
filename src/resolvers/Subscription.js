import getUserIdFromRequest from "../utils/getUserIdFromRequest";

const Subscription = {
  comment: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId,
            },
          },
        },
      }, info);
    },
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            published: true,
          },
        },
      }, info);
    },
  },
  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserIdFromRequest(request);

      return prisma.subscription.post({
        where: {
          node: {
            author: userId,
          },
        },
      }, info);
    },
  },
};

export { Subscription as default };
