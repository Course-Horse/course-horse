import { getSession } from "next-auth/react";
import { userData } from "@/data";

const exportedMethods = {
  /**
   * Checks if the user is authenticated or not
   * @param context of the page
   * @param isAuth whether the user should be authenticated or not. Meaning, if false, user is redirected when not logged in. If true, user is redirected when logged in.
   * @param redirect page to redirect to
   * @returns redirect object if user is not according to isAuth
   */
  async checkAuthenticated(
    context: any,
    isAuth: boolean = false,
    redirect: string = "/signin"
  ) {
    const session = await getSession(context);

    if ((!session && !isAuth) || (session && isAuth)) {
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };
    }

    return {
      props: { session },
    };
  },

  /**
   * Checks if the user is an admin or not
   * @param context of the page
   * @param redirect page to redirect to
   * @returns redirect object if user is not an admin
   */
  async checkAdmin(context: any, redirect: string = "/profile") {
    const session = await getSession(context);
    if (!session)
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };

    const user = await userData.getUser(session.user.name);
    if (user.admin !== true)
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };

    return {
      props: { session },
    };
  },

  /**
   * Checks if the user is an educator or not
   * @param context of the page
   * @param has whether the user should be an educator or not. Meaning, if false, user is redirected when not an educator. If true, user is redirected when an educator.
   * @param redirect page to redirect to
   * @returns redirect object if user is not according to has
   */
  async checkEducator(
    context: any,
    has: boolean = true,
    redirect: string = "/profile"
  ) {
    const session = await getSession(context);
    if (!session)
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };

    const user = await userData.getUser(session.user.name);
    if (user.admin === true)
      return {
        props: { session },
      };

    if (has)
      if (user.application !== null && user.application.status === "approved")
        return {
          props: { session },
        };
      else if (
        user.application === null ||
        user.application.status !== "approved"
      )
        return {
          props: { session },
        };

    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  },
};

export default exportedMethods;
