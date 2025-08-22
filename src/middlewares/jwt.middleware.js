// imported required packages
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // 1. read the tokens
  const token = req.headers["authorization"];

  // 2. checking if token is provided
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // 3. check if the token is valid
  try {
    const payload = jwt.verify(token, "HSXFQH0CnnZc1hohcKH0NicmyfI9sizw");
    req.userID = payload.userID;
    console.log(payload);
  } catch (err) {
    // 4. return error
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
  // 5. call next middleware.
  next();
};

export default jwtAuth;