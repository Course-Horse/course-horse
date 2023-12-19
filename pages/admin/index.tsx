import Head from "next/head";
import axios from "axios";
import auth from "@/auth/";
import validator from "@/data/helpers/validator.js";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";
import styles from "@/styles/admin.module.scss";
import $ from "jquery";

export default function Admin({ username }: { username: any }) {
  function searchApplications(e: any) {
    e.preventDefault();

    let usernameQ = $("#usernameQ").val();
    let sortBy = $("#sortBy").val();
    let sortOrder = $("#sortOrder").val();
    let statuses = $("#statuses div input") as any;
    let statusList = [];
    for (let status of statuses) {
      if (status.checked) {
        statusList.push(status.value);
      }
    }

    console.log(usernameQ, sortBy, sortOrder, statusList);

    // axios
    //   .get("/api/applications/", {
    //     params: {
    //       username: usernameQ,
    //       sortBy,
    //       sortOrder,
    //       statuses: JSON.stringify(statusList),
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Browse Applications</h1>
        <div className={styles.browse}>
          <form onSubmit={searchApplications}>
            <div>
              <div>
                <label htmlFor="usernameQ">Username</label>
                <input id="usernameQ" type="text" placeholder="Username" />
              </div>
              <div>
                <label htmlFor="sortBy">Sort By</label>
                <select id="sortBy">
                  <option value="username">Username</option>
                  <option value="created">Created</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortOrder">Sort Order</label>
                <select id="sortOrder">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div>
                <label htmlFor="submit">Submit</label>
                <button id="submit" type="submit">
                  Search
                </button>
              </div>
            </div>
            <div id="statuses">
              {validator.STATUSES.map((status) => {
                let lower = status.toLocaleLowerCase();
                return (
                  <div key={status}>
                    <input
                      type="checkbox"
                      id={lower}
                      name={lower}
                      value={lower}
                    />
                    <label htmlFor={lower}>{status}</label>
                  </div>
                );
              })}
            </div>
          </form>
          <div>results</div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAdmin(context);
};
