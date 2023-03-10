import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import User from "@/models/user";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, username, password } = req.body;
  await dbConnect();

  if (username !== USERNAME || password !== PASSWORD) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  // Check if the username already exists
  const checkedUser = await User.find({ name });

  if (checkedUser.length > 0) {
    return response(res, {
      type: "ALREADY",
      msg: "This username already exists",
    });
  }

  try {
    const user = await User.create({
      name,
    });

    return response(res, { type: "SUCCESS", data: user });
  } catch (error: any) {
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
