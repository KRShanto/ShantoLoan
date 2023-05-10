import React, { useState } from "react";
import PopupForm from "./utils/PopupForm";
import usePopupStore from "@/stores/popup";
import useReturnLoanStore from "@/stores/returnLoan";
import useAuthStore from "@/stores/auth";
import useLoansStore from "@/stores/loans";
import { SendType } from "./utils/form/Form";
import moment from "moment";
import Input from "./utils/form/Input";
import { LoanType } from "@/types/loan";
import sumLoan from "@/lib/sumLoan";

export default function Return() {
  const { closePopup } = usePopupStore((state) => state);
  const { returnLoan, setReturnLoan } = useReturnLoanStore((state) => state);
  const { username, password } = useAuthStore((state) => state);
  const { loans, setLoans } = useLoansStore((state) => state);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<string>(
    // returnLoan ? returnLoan.amount.toString() : "0"
    // check how much is left to return
    returnLoan
      ? (returnLoan.amount - sumLoan(returnLoan.returns)).toString()
      : "0"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleReturn(send: SendType) {
    if (!returnLoan) return;

    if (!date) {
      setError("Please enter a date");
      return;
    }

    // check if the amount is more than the loan amount
    // if (parseInt(amount) > returnLoan.amount) {
    //   setError("Interest is haraam brother!!! Fear Allah");
    //   return;
    // }

    // sum all the returns
    const totalReturns = sumLoan(returnLoan.returns);

    // check if the amount is more than the loan amount
    if (parseInt(amount) + totalReturns > returnLoan.amount) {
      setError("Interest is haraam brother!!! Fear Allah");
      return;
    }

    const json = await send("/api/return", {
      loanId: returnLoan._id,
      date,
      amount,
      username,
      password,
    });

    if (json.type === "SUCCESS") {
      closePopup();

      // update the state
      const newLoans = loans.map((loan: LoanType) => {
        const returnDate: Date = new Date(date);
        const returnAmount: number = parseInt(amount);

        if (loan._id === returnLoan._id) {
          return {
            ...loan,
            returns: [
              ...loan.returns,
              {
                date: returnDate,
                amount: returnAmount,
              },
            ],
          };
        }

        return loan;
      });

      setLoans(newLoans);
      setReturnLoan(null);
    } else {
      console.log(json);
      setError(json.msg || "Unknown Error!!!");
    }
  }

  return (
    <PopupForm submitHandler={handleReturn}>
      <h3 className="heading">Return Loan</h3>

      {error && <div className="error">{error}</div>}

      <div className="infos">
        <div className="info">
          <b>User: </b>
          {returnLoan?.user.name}
        </div>

        <div className="info">
          <b>Amount: </b>
          {returnLoan?.amount}
        </div>

        <div className="info">
          <b>Loan Took: </b>
          {moment(returnLoan?.date).format("DD MM YYYY")}
        </div>
      </div>

      <Input label="Return Date" type="date" value={date} setValue={setDate} />

      <Input label="Amount" type="number" value={amount} setValue={setAmount} />

      <button className="btn green" type="submit">
        Return
      </button>
    </PopupForm>
  );
}
