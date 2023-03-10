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

export default function Return() {
  const { closePopup } = usePopupStore((state) => state);
  const { returnLoan, setReturnLoan } = useReturnLoanStore((state) => state);
  const { username, password } = useAuthStore((state) => state);
  const { setLoans } = useLoansStore((state) => state);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  async function handleReturn(send: SendType) {
    if (!returnLoan) return;

    const json = await send("/api/return", {
      loanId: returnLoan._id,
      returnDate: date,
      username,
      password,
    });

    if (json.type === "SUCCESS") {
      closePopup();
      //   @ts-ignore
      // update the state
      setLoans((loans) => {
        const newLoans = loans.map((loan: LoanType) => {
          if (loan._id === returnLoan._id) {
            return {
              ...loan,
              returnDate: date,
            };
          }

          return loan;
        });

        return newLoans;
      });

      setReturnLoan(null);
    } else {
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

      <button className="btn green" type="submit">
        Return
      </button>
    </PopupForm>
  );
}
