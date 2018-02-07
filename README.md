### ajax-wrapper

A simple clone of [rxjs-ajax-wrapper](https://npmjs.org/package/rxjs-ajax-wrapper), using the fetch API.

[![Version](https://img.shields.io/npm/v/ajax-wrapper.svg)](https://www.npmjs.org/package/ajax-wrapper)
[![npm download][download-image]][download-url]

[download-image]: https://img.shields.io/npm/dm/ajax-wrapper.svg?style=flat-square
[download-url]: https://npmjs.org/package/ajax-wrapper

Simple to use and simple to setup wrapper for fetch. Allows you to define your distant resources api and call them on the fly.

## How to use

Step 1: Define your api routes.

```javascript
const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getSingleFilm: {
    url: 'https://ghibliapi.herokuapp.com/films/:id',
    method: 'GET',
    responseType: 'json',
  },
  postFilm: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'POST',
    responseType: 'json',
  },
};
```

You can check all the available request params [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
The returned data in the Promise `resolve` is already formatted following the responseType of the request definition.

Step 2: Initialize the wrapper

```javascript
import { AjaxWrapper } from 'ajax-wrapper';

const api = new AjaxWrapper(apiDefs);
```

Step 3: Call the routes

```javascript
api.routes.getAllFilms()
```

## Return value

Return a `Promise`.
Checkout [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for more details.

## Options

## Functions

Function | Explanation | Arguments | Return Value | Example
------------ | ------------- | -------------  | -------------  | -------------
`combineWrappers()` | Combine multiples wrappers. | `({wrapperKey: wrapper, ...})` | The combined wrappers, with each wrapper routes in the respective wrapper object. | `combineWrappers({authWrapper, filmWrapper});`

## Methods

Method | Explanation | Arguments | Example
------------ | ------------- | -------------  | -------------
`addRequestMiddlewares()` | Define a function that returns arguments to append to the request header. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addRequestMiddlewares([name: 'token', handler: (store) => ({Authorization: store.getState().token})], store);`
`addErrorMiddlewares()` | Define a function that returns functions to call when an error occurs. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addErrorMiddlewares([name: '404Middleware', handler: (request) => { if (request.status === 404) dispatch(somtething()) }]);`

## Ignore middleware on specific route.

Simple, just an set an array `ignoreMiddlewares` containing the names of the middlewares you wish to ignore. Works for both errorMiddlewares and requestMiddlewares.

Example :
```javascript
const apiDefs = {
  specialRoute: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      '404',
      'tokenMiddleware',
    ]
  },
};
```

# Todo ideas

* Update/delete middleware.
