import getUserIdFromRequest from "../../utils/getUserIdFromRequest";

const postMutations = {
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    }, info);
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) throw new Error("Not authorized");

    return prisma.mutation.deletePost({
      where: {
        id: args.id,
      },
    }, info);
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) throw new Error("Unable to update post");

    const isPublished = prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (isPublished && !args.data.published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id,
          },
        },
      });
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id,
      },
      data: args.data,
    }, info);
  },
};

export { postMutations as default };
