import response from "@/lib/response";
import { NextApiRequest, NextApiResponse } from "next";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    response(res, { type: "SUCCESS", msg: "Login successful" });
  } else {
    response(res, {
      type: "UNAUTHORIZED",
      msg: "Invalid username or password",
    });
  }
}
