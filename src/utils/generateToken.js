import jwt from "jsonwebtoken";

const jwtSecret = "this-is-the-best-secret";

const generateToken = (userId) =>
  jwt.sign({ userId }, jwtSecret, {
    expiresIn: "30 days",
  });

export { generateToken as default };
