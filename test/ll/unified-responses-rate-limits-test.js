'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');
const RULESET_FILE = join(__dirname, '../../rules/ll/unified-responses-rate-limit.yaml');

describe('unified-profile-document-path-resource-inflection-ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('rate-limit-conventions', function () {

    it('All OK', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
              responses:
                '429':
                  headers:
                    RateLimit-Limit:
                      schema:
                        type: integer
                    RateLimit-Remaining:
                      schema:
                        type: integer
                    RateLimit-Policy:
                      schema:
                        type: string
                    RateLimit-Reset:
                      schema:
                        type: string
                        format: date-time
                    Retry-After:
                      schema:
                        type: integer
                '200':
                  headers:
                    RateLimit-Limit:
                      schema:
                        type: integer
                    RateLimit-Remaining:
                      schema:
                        type: integer
                    RateLimit-Policy:
                      schema:
                        type: string
                    RateLimit-Reset:
                      schema:
                        type: string
                        format: date-time
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(0);
          done();

        });

    });

    it('Fail if 429 do not include Retry-After header', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
              responses:
                '429':
                  headers:
                    RateLimit-Limit:
                      schema:
                        type: integer
                    RateLimit-Remaining:
                      schema:
                        type: integer
                    RateLimit-Policy:
                      schema:
                        type: string
                    RateLimit-Reset:
                      schema:
                        type: string
                        format: date-time
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(1);
          done();

        });

    });

    it('Fail if non-429 do not include the basic RateLimit headers.', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
              responses:
                '200':
                  headers:
                    RateLimit-What?:
                      schema:
                        type: integer
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(1);
          done();

        });

    });

    it('Fail if type header do not match', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
              responses:
                '429':
                  headers:
                    RateLimit-Limit:
                      schema:
                        type: entero
                    RateLimit-Remaining:
                      schema:
                        type: entero
                    RateLimit-Policy:
                      schema:
                        type: texto
                    RateLimit-Reset:
                      schema:
                        type: texto
                        format: date-time
                    Retry-After:
                      schema:
                        type: integer
                '200':
                  headers:
                    RateLimit-Limit:
                      schema:
                        type: bool
                    RateLimit-Remaining:
                      schema:
                        type: decimal
                    RateLimit-Policy:
                      schema:
                        type: i36
                    RateLimit-Reset:
                      schema:
                        type: something_else
                        format: fecha
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(9);
          done();

        });

    });

  });

});
