import response from "@/lib/response";
import { NextApiRequest, NextApiResponse } from "next";
import checkUser from "@/lib/checkUser";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  // Check if the user has access
  if (!checkUser(username, password)) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  } else {
    return response(res, { type: "SUCCESS", msg: "Login successful" });
  }
}
