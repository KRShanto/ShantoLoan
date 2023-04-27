import React, { useState } from "react";
import { SendType } from "./utils/form/Form";
import usePopupStore from "../stores/popup";
import PopupForm from "./utils/PopupForm";
import Input from "./utils/form/Input";
import useAuthStore from "@/stores/auth";
import Select from "./utils/form/Select";
import useUsersStore from "@/stores/users";
import useLoansStore from "@/stores/loans";
import { useRouter } from "next/router";

// Create a new loan
export default function Create() {
  const router = useRouter();

  const { closePopup } = usePopupStore((state) => state);
  const { username, password } = useAuthStore((state) => state);
  const { users } = useUsersStore((state) => state);
  const { addLoan } = useLoansStore((state) => state);

  const [why, setWhy] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(
    users &&
      (users.find((u) => u.name === router.query.user)?.name || users[0].name)
  );

  const [error, setError] = useState("");

  async function handleCreate(send: SendType) {
    //  check if the fields are empty
    if (amount === "" || date === "" || user === "" || why === "") {
      setError("Fields Amount, Date, Why, User are required");
      return;
    }

    // grab the id of the user
    const id = users.find((u) => u.name === user)?._id;

    // send the request
    const json = await send("/api/create", {
      amount,
      why,
      username,
      password,
      userId: id,
      date,
    });

    if (json.type !== "SUCCESS") {
      setError(json.msg || "Unknown Error!!!");
    } else {
      // add the loan to the state and close the popup
      addLoan(json.data);
      closePopup();
    }
  }

  return (
    <PopupForm submitHandler={handleCreate}>
      <h3 className="heading">Create Loan</h3>

      {error && <div className="error">{error}</div>}

      <Input
        value={why}
        setValue={setWhy}
        label="Why do he/she need the loan?"
        autoFocus
      />

      <Input value={amount} setValue={setAmount} label="Amount" type="number" />

      <Input value={date} setValue={setDate} label="Date" type="date" />

      <Select
        value={user}
        setValue={setUser}
        label="Select User"
        options={users && users.map((user) => user.name)}
      />

      <button type="submit" className="btn green">
        Create
      </button>
    </PopupForm>
  );
}
