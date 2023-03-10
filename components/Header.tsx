import React from "react";
import usePopupStore from "@/stores/popup";
import Link from "next/link";

export default function Header() {
  const { popup, openPopup } = usePopupStore((state) => state);

  return (
    <header>
      <Link className="logo" href="/">
        Shanto Loan
      </Link>

      <div className="options">
        <button
          className={popup ? "btn disable" : "btn blue"}
          disabled={popup ? true : false}
          onClick={() => openPopup("CreateUser")}
        >
          Create User
        </button>
        <button
          className={popup ? "btn disable" : "btn blue"}
          disabled={popup ? true : false}
          onClick={() => openPopup("Create")}
        >
          Create Loan
        </button>
      </div>
    </header>
  );
}
