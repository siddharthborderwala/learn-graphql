import bcrypt from "bcryptjs";

import getUserIdFromRequest from "../../utils/getUserIdFromRequest";
import generateToken from "../../utils/generateToken";
import hashPassword from "../../utils/hashPassword";

const userMutations = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async loginUser(parent, args, { prisma }, info) {
    const user = prisma.query.users({
      where: {
        email: args.data.email,
      },
    });

    if (!user) throw new Error("User doesn't exist");

    const isVerified = await bcrypt.compare(args.data.password, user.password);

    if (!isVerified) throw new Error("Incorrect email or password");

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    return prisma.mutation.deleteUser({
      where: {
        id: userId,
      },
    }, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserIdFromRequest(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      { where: { id: userId }, data: args.data },
      info,
    );
  },
};

export { userMutations as default };
