import React, { useState } from "react";
import { SendType } from "./utils/form/Form";
import usePopupStore from "../stores/popup";
import PopupForm from "./utils/PopupForm";
import Input from "./utils/form/Input";
import useAuthStore from "@/stores/auth";
import useUsersStore from "@/stores/users";

export default function Create() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { closePopup, openMessage } = usePopupStore((state) => state);
  const { username, password } = useAuthStore((state) => state);

  const { addUser } = useUsersStore((state) => state);

  async function handleCreate(send: SendType) {
    if (name === "") {
      setError("You need to specify the Name of the user");
      return;
    }

    const json = await send("/api/create-user", { name, username, password });

    if (json.type === "SUCCESS") {
      // Update the state
      addUser(json.data);
      // Close the popup
      closePopup();
    } else {
      setError(json.msg || "Unknown!!!");
    }

    setName("");
  }

  return (
    <PopupForm submitHandler={handleCreate}>
      <div className="heading">Create User</div>

      {error && <div className="error">{error}</div>}

      <Input value={name} setValue={setName} label="Name" />

      <button type="submit" className="btn green">
        Create
      </button>
    </PopupForm>
  );
}
