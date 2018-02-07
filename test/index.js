require('es6-promise').polyfill();
require('fetch-everywhere');

import chai from 'chai';
import { AjaxWrapper } from '../src';

const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getAllFilmsIgnore: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      'token',
    ],
  },
  getWrongAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/filmss',
    method: 'GET',
    responseType: 'json',
  },
  getWrongAllFilmsIgnore: {
    url: 'https://ghibliapi.herokuapp.com/filmss',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      '404',
    ],
  },
};

describe('Wrapper', () => {
  describe('#init', () => {
    it('should construct wrapper without error', (done) => {
      const api = new AjaxWrapper(apiDefs);
      done();
    });
  });
  describe('#setup a middleware', () => {
    it('should add the middleware', (done) => {
      const api = new AjaxWrapper(apiDefs);
      api.addRequestMiddlewares([{ name: 'token', handler: () => ({ headers: { Authorization: 'Bearer testing' } }) }]);
      done();
    });
  });
  describe('#success the request', () => {
    it('should success the request', (done) => {
      const api = new AjaxWrapper(apiDefs);
      api.addRequestMiddlewares([{ name: 'token', handler: getBearer => ({ headers: { Authorization: getBearer() } }) }], () => 'Bearer testing');
      api.routes.getAllFilms().then(
        (data) => {
          chai.should();
          done();
        },
      );
    });
  });
});
