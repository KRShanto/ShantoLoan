import React, { useEffect, useState } from "react";
import usePopupStore from "@/stores/popup";
import { LoanType } from "@/types/loan";
import { useRouter } from "next/router";
import useReturnLoanStore from "@/stores/returnLoan";
import useAuthStore from "@/stores/auth";
import useLoansStore from "@/stores/loans";
import moment from "moment";
import { SendType } from "./utils/form/Form";
import PostButton from "./utils/PostButton";

export default function Display() {
  const [localLoans, setLocalLoans] = useState<LoanType[]>([]);
  const { openPopup } = usePopupStore((state) => state);
  const { setReturnLoan } = useReturnLoanStore((state) => state);
  const { loans } = useLoansStore((state) => state);
  const { username, password } = useAuthStore((state) => state);
  const router = useRouter();

  const { user } = router.query;

  useEffect(() => {
    if (loans && user) {
      if (user === "All") {
        // if the user is All, then show all the loans
        setLocalLoans(loans);
      } else {
        // else show only the loans for that user
        const userLoans = loans.filter((loan) => loan.user.name === user);
        setLocalLoans(userLoans);
      }
    }
  }, [loans, user]);

  // remove the id from state
  function deleteId(id: string) {
    setLocalLoans((loans) => loans.filter((loan) => loan._id !== id));
  }

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
            {user === "All" && <th>Name</th>}
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
              {user === "All" && <td className="name">{loan.user.name}</td>}
              <td className="date">
                {moment(loan.date).format("DD MMMM YYYY")}
              </td>
              <td className="why">{loan.why}</td>
              <td className="amount">{loan.amount.toLocaleString()}</td>
              <td className="returnDate">
                {loan.returnDate
                  ? moment(loan.returnDate).format("DD MMMM YYYY")
                  : "Not Returned :("}
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

                <PostButton
                  body={{ loanId: loan._id, username, password }}
                  path="/api/delete"
                  className="delete btn red"
                  afterPost={() => deleteId(loan._id)}
                >
                  Delete
                </PostButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
