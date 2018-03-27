import deepmerge from 'deepmerge';

class AjaxWrapper {
  constructor(apiDefs) {
    this.apiDefs = apiDefs;
    this.routes = [];
    this.requestMiddlewares = [];
    this.errorMiddlewares = [];

    this.buildUrl = ::this.buildUrl;
    this.defBuilder = ::this.defBuilder;
    this.init = ::this.init;

    this.init();
  }

  buildUrl(url, params = {}, query = {}) {
    // eslint-disable-line
    let finalUrl = url;
    Object.keys(params).forEach((param) => {
      finalUrl = finalUrl.replace(`:${param}`, params[param]);
    });
    if (query.constructor === Object && Object.keys(query).length > 0) {
      finalUrl = finalUrl.concat(
        '?',
        Object.keys(query)
          .filter(key => query[key])
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
          .join('&'),
      );
    } else if (query.constructor === String) {
      finalUrl = finalUrl.concat('?', query);
    }
    return finalUrl;
  }

  defBuilder(def, req) {
    let middlewaresArgs = {};
    this.requestMiddlewares.forEach((middleware) => {
      if (
        !def.ignoreMiddlewares ||
        !def.ignoreMiddlewares.find(ignore => ignore === middleware.name)
      ) {
        middlewaresArgs = { ...middlewaresArgs, ...middleware.handler() };
      }
    });
    let mergedReqSettings = deepmerge(middlewaresArgs, req);
    if (def.contentType) {
      mergedReqSettings = deepmerge(
        {
          headers: { 'Content-Type': def.contentType },
        },
        mergedReqSettings,
      );
    }
    mergedReqSettings = deepmerge(
      {
        method: def.method,
        responseType: def.responseType ? def.responseType : 'json',
      },
      mergedReqSettings,
    );
    return mergedReqSettings;
  }

  addRequestMiddlewares(middlewares, ...params) {
    middlewares.forEach((middleware) => {
      this.requestMiddlewares = [
        ...this.requestMiddlewares,
        { name: middleware.name, handler: () => middleware.handler(...params) },
      ];
    });
  }

  addErrorMiddlewares(middlewares, ...params) {
    middlewares.forEach((middleware) => {
      this.errorMiddlewares = [
        ...this.errorMiddlewares,
        { name: middleware.name, handler: request => middleware.handler(request, ...params) },
      ];
    });
  }

  init() {
    let routes = {};
    Object.keys(this.apiDefs).forEach((key) => {
      routes = {
        ...routes,
        [`${key}`]: (reqSettings = { params: {}, body: null, query: {} }) =>
          fetch(
            this.buildUrl(this.apiDefs[key].url, reqSettings.params, reqSettings.query),
            this.defBuilder(this.apiDefs[key], reqSettings),
          ).then(async (response) => {
            if (!response) {
              throw new Error('No response');
            }
            if (!response.ok) {
              this.errorMiddlewares.forEach((middleware) => {
                if (
                  !this.apiDefs[key].ignoreMiddlewares ||
                  !this.apiDefs[key].ignoreMiddlewares.find(ignore => ignore === middleware.name)
                ) {
                  middleware.handler(response);
                }
              });
              const data = await response.json();
              throw {
                message: `Request error: status is ${response.status} (${response.statusText})`,
                status: response.status,
                data: data.data,
              };
            }
            if (response.status === 204 || this.apiDefs[key].responseType === 'no-content') {
              return null;
            }
            switch (this.apiDefs[key].responseType) {
              case 'text/plain':
                return response.text();
              case 'blob':
                return response.blob();
              default:
                return response.json();
            }
          }),
      };
    });
    this.routes = routes;
  }
}

export default AjaxWrapper;
