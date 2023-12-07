import { getSession } from "next-auth/react";

const exportedMethods = {
  async checkAuthenticated(
    context: any,
    isAuth: boolean = false,
    redirect: string = "/login"
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
};

export default exportedMethods;
