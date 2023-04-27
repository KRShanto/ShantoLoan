import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import User from "@/models/user";
import checkUser from "@/lib/checkUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, username, password } = req.body;
  await dbConnect();

  // Check if the user has access
  if (!checkUser(username, password)) {
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
    // Create and return the new document
    const user = await User.create({
      name,
    });

    return response(res, { type: "SUCCESS", data: user });
  } catch (error: any) {
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
