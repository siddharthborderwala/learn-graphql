import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { jwtSecret } from "./index";
import getUserIdFromRequest from "../../utils/getUserIdFromRequest";

const userMutations = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be longer than 8 characters");
    }

    const password = await bcrypt.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, jwtSecret),
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
      token: jwt.sign({ userId: user.id }, jwtSecret),
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

    return prisma.mutation.updateUser(
      { where: { id: userId }, data: args.data },
      info,
    );
  },
};

export { userMutations as default };
