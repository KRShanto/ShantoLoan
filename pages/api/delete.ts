import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import Loan from "@/models/loan";
import User from "@/models/user";
import checkUser from "@/lib/checkUser";

// Delete a loan
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { loanId, username, password } = req.body;
  await dbConnect();

  // Check if the user has access
  if (!checkUser(username, password)) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  // Check if the required fields are filled
  if (!loanId) {
    return response(res, {
      type: "INVALID",
      msg: "Missing required fields: loanId",
    });
  }

  // Check if the loan exists
  const loanExists = await Loan.exists({ _id: loanId });
  if (!loanExists) {
    return response(res, {
      type: "INVALID",
      msg: "Loan doesn't exist",
    });
  }

  try {
    // Delete the loan
    await Loan.findByIdAndDelete(loanId);

    return response(res, { type: "SUCCESS", msg: "Loan deleted" });
  } catch (error: any) {
    console.log("ERROR: ", error.message);
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
