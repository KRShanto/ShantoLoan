import React from "react";
import Popup from "@/components/utils/Popup";
import useHistoryStore from "@/stores/history";
import moment from "moment";

export default function History() {
  const { history } = useHistoryStore((state) => state);

  return (
    <Popup crossIcon={true}>
      <div className="history-section">
        <h2 className="heading">History</h2>

        <div className="header history">
          <p className="date">Date</p>
          <p className="amount">Amount</p>
        </div>

        <div className="history-parent">
          {history &&
            history.map((item, index) => (
              <div key={index}>
                <div className="history">
                  <p className="date">
                    {moment(item.date).format("DD/MM/YYYY")}
                  </p>
                  <p className="amount">{item.amount.toLocaleString()}</p>
                </div>
                <hr />
              </div>
            ))}
        </div>
      </div>
    </Popup>
  );
}
