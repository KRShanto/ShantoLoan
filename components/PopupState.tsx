import React from "react";
import usePopupStore from "@/stores/popup";
import CreateUser from "./CreateUser";
import Create from "./Create";
import Message from "./utils/Message";
import Login from "./Login";
import Return from "./Return";

export default function Popup() {
  const { popup } = usePopupStore((state) => state);
  const { message } = usePopupStore((state) => state);

  return (
    <>
      {popup === "Create" && <Create />}
      {popup === "CreateUser" && <CreateUser />}
      {popup === "Message" && <Message msg={message.msg} type={message.type} />}
      {popup === "Login" && <Login />}
      {popup === "Return" && <Return />}
    </>
  );
}
