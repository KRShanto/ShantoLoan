import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import Loan from "@/models/loan";
import checkUser from "@/lib/checkUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { loanId, returnDate, username, password } = req.body;
  await dbConnect();

  // Check if the user has access
  if (!checkUser(username, password)) {
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You don't have access",
    });
  }

  // Check if the required fields are filled out
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
    // update and get the updated document
    const loan = await Loan.findOneAndUpdate(
      { _id: loanId },
      { returnDate },
      { new: true }
    );

    return response(res, { type: "SUCCESS", data: loan });
  } catch (error: any) {
    console.log("ERROR: ", error.message);
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
