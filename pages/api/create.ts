import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import Loan from "@/models/loan";
import User from "@/models/user";
import checkUser from "@/lib/checkUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, date, why, amount, username, password } = req.body;
  await dbConnect();

  // Check if the user has access
  if (!checkUser(username, password)) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  // Check if the required fields are provided
  if (!amount || !amount || !userId) {
    return response(res, {
      type: "INVALID",
      msg: "Missing required fields: amount, why, userId",
    });
  }

  // Check if the user is created or not
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return response(res, {
      type: "INVALID",
      msg: "User not found",
    });
  }

  try {
    // Create and return the new document
    const loan = await Loan.create({
      why,
      amount,
      date,
      user: user,
    });

    return response(res, { type: "SUCCESS", data: loan });
  } catch (error: any) {
    console.log("ERROR: ", error.message);
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
