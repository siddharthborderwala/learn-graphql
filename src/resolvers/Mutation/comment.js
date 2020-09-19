import getUserIdFromRequest from "../../utils/getUserIdFromRequest";

const commentMutations = {
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);
    const postPublished = prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!postPublished) throw new Error("Unable to find post");

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: args.data.post,
          },
        },
      },
    }, info);
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) throw new Error("Not authorized");

    return prisma.mutation.deleteComment({
      where: {
        id: args.id,
      },
    }, info);
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) throw new Error("Not authorized");

    return prisma.mutation.updateComment({
      where: {
        id: args.id,
      },
      data: args.data,
    }, info);
  },
};

export { commentMutations as default };
