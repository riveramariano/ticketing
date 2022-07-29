import express from "express";

const router = express.Router();

router.post("/api/users/sign-up", (req, res) => {
  const { email, password } = req.body;
});

export { router as signUpRouter };
