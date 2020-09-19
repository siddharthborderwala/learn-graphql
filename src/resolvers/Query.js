import getUserIdFromRequest from "../utils/getUserIdFromRequest";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    if (!userId) throw new Error("User not found");

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        author: {
          id: userId,
        },
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      skip: args.skip,
      first: args.first,
      after: args.after,
      where: {
        published: true,
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
    };
    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    return prisma.query.user({
      where: {
        id: userId,
      },
    }, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request, false);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [
          {
            published: true,
          },
          {
            author: {
              id: userId,
            },
          },
        ],
      },
    }, info);

    if (posts.length === 0) throw new Error("Post not found");

    return posts[0];
  },
};

export { Query as default };
