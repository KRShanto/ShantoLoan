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
  const { username, password } = req.body;
  await dbConnect();

  if (username !== USERNAME || password !== PASSWORD) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  try {
    const users = await User.find({});

    return response(res, { type: "SUCCESS", data: users });
  } catch (error: any) {
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
