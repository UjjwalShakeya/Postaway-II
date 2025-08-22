// imported modules
import {body,validationResult} from "express-validator";

const validateUser = async (req, res, next) => {
  // 1. Setup rules for validation.
  const rules = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required. Please enter your name.")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters long."),

    body("email").isEmail().withMessage("Please enter valid email"),
    body("password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      ),
  ];

  // running all rules one by one to check
  await Promise.all(rules.map((rule) => rule.run(req)));

  let validationErros = validationResult(req);

  if (!validationErros.isEmpty()) {
    return res.status(400).json({
      errorMessage: validationErros.array()[0].msg,
    });
  }
  next();
};export default validateUser;