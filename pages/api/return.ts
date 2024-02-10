import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import response from "@/lib/response";
import Loan from "@/models/loan";
import checkUser from "@/lib/checkUser";
import sumLoan from "@/lib/sumLoan";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { loanId, date, amount, username, password } = req.body;
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
  // const loanExists = await Loan.exists({ _id: loanId });
  // if (!loanExists) {
  //   return response(res, {
  //     type: "INVALID",
  //     msg: "Loan doesn't exist",
  //   });
  // }

  const loan = await Loan.findOne({ _id: loanId });
  if (!loan) {
    return response(res, {
      type: "INVALID",
      msg: "Loan doesn't exist",
    });
  }

  // convert the amount to number
  const amountNumber = Number(amount);

  // Check if the loan's amount is greater than the amount to be returned
  // Also sum up the total amount of returns

  const totalReturns = sumLoan(loan.returns);
  console.log("amount: ", amount);
  console.log("Total: ", totalReturns + amount);
  console.log("Loan: ", loan.amount);

  console.log("Type of amount: ", typeof amount);
  console.log("Type of total: ", typeof totalReturns);
  console.log("Type of loan: ", typeof loan.amount);

  try {
    // update and get the updated document
    const loan = await Loan.findOneAndUpdate(
      { _id: loanId },
      // { returnDate },
      { $push: { returns: { amount: amountNumber, date } } },
      { new: true }
    );

    return response(res, { type: "SUCCESS", data: loan });
  } catch (error: any) {
    console.log("ERROR: ", error.message);
    return response(res, { type: "SERVER_ERROR", msg: error.message });
  }
}
