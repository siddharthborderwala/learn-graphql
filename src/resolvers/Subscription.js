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
};

export { Subscription as default };
