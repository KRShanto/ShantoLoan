import React, { useEffect, useState } from "react";
import useAuthState from "@/stores/auth";
import { ReturnedJsonType } from "@/types/json";
import usePopupStore from "@/stores/popup";
import { LoanType } from "@/types/loan";
import { useRouter } from "next/router";
import useUsersStore from "@/stores/users";
import useReturnLoanStore from "@/stores/returnLoan";
import useLoansStore from "@/stores/loans";
import moment from "moment";

export default function Display() {
  const [localLoans, setLocalLoans] = useState<LoanType[]>([]);
  const { username, password } = useAuthState((state) => state);
  const { openPopup, openMessage } = usePopupStore((state) => state);
  const { setReturnLoan } = useReturnLoanStore((state) => state);
  const { loans } = useLoansStore((state) => state);
  const { users } = useUsersStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (loans && router.query.user) {
      const userName = router.query.user;
      const userLoans = loans.filter((loan) => loan.user.name === userName);

      setLocalLoans(userLoans);
    }
  }, [loans, router]);

  return (
    <div className="display">
      <h2 className="user">
        <span className="for">For User: </span>
        {router.query.user}
      </h2>

      <div className="color-info">
        <p>
          Took from me <span className="took"></span>
        </p>
        <p>
          Returned <span className="returned"></span>
        </p>
        <p>
          Took from them <span className="gave"></span>
        </p>
      </div>

      <table className="loans">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Why</th>
            <th>Amount</th>
            <th>Return Date</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {localLoans.map((loan, index) => (
            <tr
              key={index}
              className={
                loan.returnDate ? "returned" : loan.amount > 0 ? "took" : "gave"
              }
            >
              <td className="name">{loan.user.name}</td>
              <td className="date">
                {moment(loan.date).format("DD MMMM YYYY")}
              </td>
              <td className="why">{loan.why}</td>
              <td className="amount">
                {
                  // use comma
                  loan.amount.toLocaleString()
                }
              </td>
              <td className="returnDate">
                {loan.returnDate
                  ? moment(loan.returnDate).format("DD MMMM YYYY")
                  : "Not Returned"}
              </td>
              <td className="options">
                <button
                  className="return btn skyblue"
                  onClick={() => {
                    setReturnLoan(loan);
                    openPopup("Return");
                  }}
                >
                  Return
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
