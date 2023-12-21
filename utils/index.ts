const utils = {
  createHandler: (func: Function) => {
    return (event: any) => {
      event.preventDefault();
      func();
    };
  },

  alertError: (alertFunc: Function, err: any, defaultAlert: string) => {
    console.log(err);
    if (err.response && err.response.data && err.response.data.error) {
      alertFunc(err.response.data.error);
      return;
    }
    alertFunc(defaultAlert);
  },
};

export default utils;
