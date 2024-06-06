import { User, Account } from "../db/index.js";
import { JWT_SECRET } from "../server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";

const signupBody = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().email(),
  password: z.string().min(6),
});

async function signupUser(req, res) {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res
      .status(411)
      .json({ message: "Email already taken / incorrect inputs" });
  }

  const { firstName, lastName, username, password } = req.body;

  const response = await User.findOne({ username });
  if (response) {
    return res
      .status(411)
      .json({ message: "Email already taken / incorrect inputs" });
  }

  // password hashing using bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    username,
    password: hash,
  });

  const _id = newUser._id;
  // Initializing account and giving random balance to user

  const account = await Account.create({
    userId: _id,
    balance: Math.floor(Math.random() * 10000) + 1, // generates random number b/w 1 - 10001
  });

  console.log(newUser);
  if (newUser) {
    res.status(200).json({
      message: `user ${username} created successfully`,
      balance: `Current balance : ${account.balance}`,
    });
  }
}

// ------------------------

async function signInUser(req, res) {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser)
    throw new Error(res.status(411).json({ message: "invalid username" }));

  // password hashing using bcryptjs
  const validPass = await bcrypt.compare(password, existingUser.password);
  if (!validPass) {
    return res.status(411).json({ message: "invalid password" });
  }

  const userId = existingUser._id; // convert id coming from mongoose to string
  const token = jwt.sign({ _id: userId }, JWT_SECRET);
  if (token) {
    res.status(200).json({
      message: `user ${username} logged in successfully`,
      token,
    });
  } else {
    res.status(411).json({ message: "error while logging in" });
  }
}

// ----------------------

// zod validation for updating information
const updateBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6).optional(),
});

async function updateUserInfo(req, res) {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({ message: "Invalid updating data" });
  }
  const { _id, password, firstName, lastName } = req.body;
  try {
    const salt = await bcrypt.genSalt(10); // re-encrypting password if provided
    const hash = await bcrypt.hash(password, salt);
    const userInfo = await User.updateOne(
      { _id },
      { password: hash, firstName, lastName }
    );
    console.log(userInfo);
    if (userInfo) {
      res.status(200).json({ message: "data updated successfully" });
    }
  } catch (err) {
    res.status(403).json({ message: "error while updating data" });
  }
}

// ----------------------

async function handleQuery(req, res) {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [{ firstName: { $regex: filter } }, { lastName: { $regex: filter } }],
  });
  res.status(200).json({
    users: users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    })),
  });
}

export { signupUser, signInUser, updateUserInfo, handleQuery };
