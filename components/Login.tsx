import React, { useState } from "react";
import { SendType } from "./utils/form/Form";
import usePopupStore from "../stores/popup";
import PopupForm from "./utils/PopupForm";
import Input from "./utils/form/Input";
import Password from "./utils/form/Password";
import useAuthStore from "@/stores/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setup } = useAuthStore((state) => state);
  const { closePopup } = usePopupStore((state) => state);

  // const { openMessage } = usePopupStore((state) => state);

  async function handleCreate(send: SendType) {
    if (username === "") {
      setError("You need to specify Username");
      return;
    }

    const json = await send("/api/login", { username, password });

    if (json.type === "SUCCESS") {
      // Update the auth store
      setup(username, password);

      // Store these on the browser session
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);

      // Close the popup
      closePopup();
    } else {
      setError(json.msg || "Unknown Error!!!");
    }

    setUsername("");
    setPassword("");
  }

  return (
    <PopupForm
      submitHandler={handleCreate}
      // hideAfterSubmit={false}
      crossIcon={false}
    >
      <div className="heading">Login</div>

      {error && <div className="error">{error}</div>}

      <Input value={username} setValue={setUsername} label="Username" />
      {/* <Input value={password} setValue={setPassword} label="Password" /> */}
      <Password
        value={password}
        setValue={setPassword}
        label="Password"
        generator={false}
      />

      <button type="submit" className="btn green">
        Login
      </button>
    </PopupForm>
  );
}
