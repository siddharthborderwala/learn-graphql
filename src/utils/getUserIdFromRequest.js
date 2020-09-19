import jwt from "jsonwebtoken";
import { jwtSecret } from "../resolvers/Mutation";

const getUserIdFromRequest = (request, requireAuth = true) => {
  const header = request.request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  }

  if (requireAuth) throw new Error("Not authorized");

  return null;
};

export { getUserIdFromRequest as default };
