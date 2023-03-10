import { MessageType } from "@/stores/popup";
import React from "react";
import Popup from "./Popup";

export default function Message({
  type,
  msg,
}: {
  type: MessageType;
  msg: {
    title: string;
    body: string;
  };
}) {
  return (
    <Popup>
      <div className={`message ${type}`}>
        {/* <p className="msg">{msg}</p> */}
        <h3 className="title">{msg.title}</h3>
        <p className="body">{msg.body}</p>
      </div>
    </Popup>
  );
}
