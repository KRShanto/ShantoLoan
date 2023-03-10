import React from "react";
import useUserStore from "@/stores/users";
import Link from "next/link";

export default function DisplayUser() {
  const { users } = useUserStore((state) => state);

  return (
    <>
      <div className="users">
        <Link className="user" href="All">
          All
        </Link>

        {users.map((user) => (
          <Link className="user" key={user._id} href={user.name}>
            {user.name}
          </Link>
        ))}
      </div>
    </>
  );
}
