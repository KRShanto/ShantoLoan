import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import User from "@/models/user";
import checkUser from "@/lib/checkUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;
  await dbConnect();

  // Check if the user has access
  if (!checkUser(username, password)) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  try {
    // Return all the users
    const users = await User.find({});

    return response(res, { type: "SUCCESS", data: users });
  } catch (error: any) {
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
