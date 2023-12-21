import { getIronSession } from "iron-session";
import { userData } from "@/data";

const exportedMethods = {
  async getSession(context: any) {
    const session = await getIronSession(context.req, context.res, {
      password: "TFj9LX2JJKBHMdiam9N9eUryQNxD72Lh",
      cookieName: "special-cookie",
    });

    return session;
  },

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
    const session = (await this.getSession(context)) as any;
    let username = session.username;

    if ((!username && !isAuth) || (username && isAuth)) {
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };
    }

    let result = {} as any;
    if (username) result.username = username;

    return {
      props: result,
    };
  },

  /**
   * Checks if the user is an admin or not
   * @param context of the page
   * @param redirect page to redirect to
   * @returns redirect object if user is not an admin
   */
  async checkAdmin(context: any, redirect: string = "/profile") {
    const session = (await this.getSession(context)) as any;
    let username = session.username;
    let result = {} as any;
    if (username) result.username = username;

    if (!username)
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };

    const user = await userData.getUser(username);
    if (user.admin !== true)
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };

    return {
      props: result,
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
    const session = (await this.getSession(context)) as any;
    let username = session.username;
    let result = {} as any;
    if (username) result.username = username;

    if (!username)
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };

    const user = await userData.getUser(username);
    if (user.admin === true)
      return {
        props: result,
      };

    if (has)
      if (user.application !== null && user.application.status === "accepted")
        return {
          props: result,
        };
      else if (
        user.application === null ||
        user.application.status !== "accepted"
      )
        return {
          props: result,
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
