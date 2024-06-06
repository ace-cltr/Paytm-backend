// route for handling transaction
// takes amount, fromAccount, toAccount
// create a session at the start of the function and handle all the checks that needs happen here
// end the session when transaction function ends here

import { Account, User } from "../db/index.js";
import mongoose from "mongoose";

async function handleTransaction(req, res) {
  // starting a session
  const session = await mongoose.startSession();

  // starting a transaction
  session.startTransaction();
  const { amount, toUser, fromUser } = req.body;

  try {
    const sender = await User.find({ username: fromUser }).session(session);
    const receiver = await User.find({ username: toUser }).session(session);

    if (sender.balance < amount) {
      throw new Error(res.status(403).json({ message: "transaction failed" }));
    }
    const senderId = sender[0]._id;
    const receiverId = receiver[0]._id;
    console.log(sender, receiver, senderId, receiverId);

    await Account.updateOne(
      { userId: senderId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: receiverId },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({ message: "transaction successful" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "transaction failed" });
    await session.abortTransaction();
    await session.endSession();
  }
}

export { handleTransaction };
