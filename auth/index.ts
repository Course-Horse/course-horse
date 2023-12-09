import { getSession } from "next-auth/react";
import { userData } from "@/data";

const exportedMethods = {
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

  async checkRole(
    context: any,
    types: Array<string>,
    redirect: string = "/profile"
  ) {
    const session = await getSession(context);
    const user = await userData.getUser(session.user.name);

    if (!types.includes(user.type)) {
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
};

export default exportedMethods;
