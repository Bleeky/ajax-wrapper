const combineWrappers = (wrappers,
  { reqMiddlewares = [], reqMiddlewareParams = null },
  { errMiddlewares = [], errMiddlewaresParams = null }) => {
  let wrapped = {};
  Object.keys(wrappers).forEach((key) => {
    wrappers[key].addRequestMiddlewares(reqMiddlewares, reqMiddlewareParams);
    wrappers[key].addErrorMiddlewares(errMiddlewares, errMiddlewaresParams);
    wrapped = { [key]: wrappers[key].routes, ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
