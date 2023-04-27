import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { FadeLoader } from "react-spinners";
import useLoadingStore from "../stores/loading";
import usePopupStore from "../stores/popup";
import PopupState from "@/components/PopupState";
import Header from "@/components/Header";
import { useEffect } from "react";
import useUsersStore from "@/stores/users";
import useLoansStore from "@/stores/loans";
import useAuthStore from "@/stores/auth";

export default function App({ Component, pageProps }: AppProps) {
  const { loading, turnOff, turnOn } = useLoadingStore((state) => state);
  const { popup, openPopup } = usePopupStore((state) => state);
  const { setUsers } = useUsersStore((state) => state);
  const { setLoans } = useLoansStore((state) => state);
  const { setup, username, password } = useAuthStore((state) => state);

  // fetcher function to fetch data from the server
  async function fetcher(url: string) {
    // turn on the loading spinner
    turnOn();

    // fetch the data
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // get the json data
    const json = await res.json();

    // turn off the loading spinner
    turnOff();

    if (json.type === "SUCCESS") {
      return json.data;
    } else {
      console.error("Error from server: ", json);
      return null;
    }
  }

  // fetches the users
  async function fetchUsers() {
    const users = await fetcher("/api/get-users");

    if (users) {
      setUsers(users);
    }
  }

  // fetches the loans
  async function fetchLoans() {
    const loans = await fetcher("/api/get");

    if (loans) {
      setLoans(loans);
    }
  }

  // Check if the browser session has a username and password
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");

    // if the username and password exists, then setup the auth store
    if (username && password) {
      setup(username, password);
    }
    // else open the login popup
    else {
      openPopup("Login");
    }
  }, []);

  // fetch the users and loans when the username and password changes
  useEffect(() => {
    if (username && password) {
      fetchUsers();
      fetchLoans();
    }
  }, [username, password]);

  return (
    <>
      {loading && (
        <div id="preloader">
          <FadeLoader className="spinner" color="cyan" loading={loading} />
        </div>
      )}

      <>
        {popup && <PopupState />}
        <main style={{ opacity: loading || popup ? 0.2 : 1 }}>
          <Header />
          <Component {...pageProps} />
        </main>
      </>
    </>
  );
}
