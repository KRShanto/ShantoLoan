import React, { useEffect, useState } from "react";
import usePopupStore from "@/stores/popup";
import { LoanType } from "@/types/loan";
import { useRouter } from "next/router";
import useReturnLoanStore from "@/stores/returnLoan";
import useAuthStore from "@/stores/auth";
import useLoansStore from "@/stores/loans";
import moment from "moment";
import PostButton from "./utils/PostButton";
import useHistoryStore from "@/stores/history";
import sumLoan from "@/lib/sumLoan";

export default function Display() {
  const [localLoans, setLocalLoans] = useState<LoanType[]>([]);
  const { openPopup } = usePopupStore((state) => state);
  const { setReturnLoan } = useReturnLoanStore((state) => state);
  const { setHistory } = useHistoryStore((state) => state);
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
          Full Returned <span className="returned"></span>
        </p>
        <p>
          Took from them <span className="gave"></span>
        </p>
        <p>
          Partially Returned <span className="partially-returned"></span>
        </p>
      </div>

      <table className="loans">
        <thead>
          <tr>
            {user === "All" && <th>Name</th>}
            <th>Date</th>
            <th>Why</th>
            <th>Amount</th>
            <th>Returns</th>
            <th>Need to Return</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {localLoans.map((loan, index) => (
            <tr
              key={index}
              className={
                loan.returns.length > 0
                  ? sumLoan(loan.returns) === loan.amount
                    ? "returned"
                    : "partially-returned"
                  : loan.amount > 0
                  ? "took"
                  : "gave"
              }
            >
              {user === "All" && <td className="name">{loan.user.name}</td>}
              <td className="date">
                {moment(loan.date).format("DD MMMM YYYY")}
              </td>
              <td className="why">{loan.why}</td>
              <td className="amount">{loan.amount.toLocaleString()}</td>
              <td className="return">
                {/* {loan.returnDate
                  ? moment(loan.returnDate).format("DD MMMM YYYY")
                  : "Not Returned :("} */}
                {loan.returns.length > 0 ? (
                  <>
                    {/* now sum of returns.amout */}
                    <p className="amount">
                      {/* {loan.returns
                        .reduce((acc, curr) => acc + curr.amount, 0)
                        .toLocaleString()} */}
                      {sumLoan(loan.returns).toLocaleString()}
                    </p>
                    <button
                      className="btn blue"
                      onClick={() => {
                        setHistory(loan.returns);
                        openPopup("History");
                      }}
                    >
                      History
                    </button>
                  </>
                ) : (
                  "Not Returned :("
                )}
              </td>
              <td className="need-to-return">
                {loan.returns.length > 0 ? (
                  <>
                    {/* now sum of returns.amout */}

                    {/* {loan.returns
                        .reduce((acc, curr) => acc + curr.amount, 0)
                        .toLocaleString()} */}
                    {/* {sumLoan(loan.returns).toLocaleString()} */}
                    {(loan.amount - sumLoan(loan.returns)).toLocaleString()}
                  </>
                ) : (
                  loan.amount.toLocaleString()
                )}
              </td>

              <td className="options">
                <div className="inner-options">
                  {
                    // if the loan is returned, then don't show the return button
                    loan.returns.length > 0 &&
                    // calculate the sum of returns.amount
                    // if the sum is equal to the loan.amount, then don't show the return button
                    // else show the return button
                    // loan.returns.reduce((acc, curr) => acc + curr.amount, 0) ===
                    //   loan.amount ? null : (
                    sumLoan(loan.returns) === loan.amount ? null : (
                      <button
                        className="return btn skyblue"
                        onClick={() => {
                          setReturnLoan(loan);
                          openPopup("Return");
                        }}
                      >
                        Return
                      </button>
                    )
                  }

                  <PostButton
                    body={{ loanId: loan._id, username, password }}
                    path="/api/delete"
                    className="delete btn red"
                    afterPost={() => deleteId(loan._id)}
                  >
                    Delete
                  </PostButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
