const combineWrappers = (wrappers,
  { reqMiddlewares = null, reqMiddlewareParams = null },
  { errMiddlewares = null, errMiddlewaresParams = null }) => {
  let wrapped = {};
  Object.keys(wrappers).forEach((key) => {
    if (reqMiddlewares) {
      wrappers[key].addRequestMiddlewares(reqMiddlewares, reqMiddlewareParams);
    }
    if (errMiddlewares) {
      wrappers[key].addErrorMiddlewares(errMiddlewares, errMiddlewaresParams);
    }
    wrapped = { [key]: wrappers[key].routes, ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
