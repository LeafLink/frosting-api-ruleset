'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');


const RULESET_FILE = join(__dirname, '../../rules/ll/unified-profile-document-structure-pagination.yaml');

describe('jsonapi-document-structure-pagination ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('pagination-all-keys', function () {

    it('passes when all keys are present', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            get:
              parameters:
                - in: query
                  name: page[number]
                  schema:
                    type: integer
                - in: query
                  name: page[size]
                  schema:
                    type: integer
                - in: query
                  name: page[cursor]
                  schema:
                    type: string
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
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

  });

  describe('pagination-bad-key', function () {

    it('fails when there is a bad key present', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            get:
              parameters:
                - in: query
                  name: page[number]
                  schema:
                    type: integer
                - in: query
                  name: page[size]
                  schema:
                    type: integer
                - in: query
                  name: page[cursor]
                  schema:
                    type: string
                - in: query
                  name: page[bad]
                  schema:
                    type: integer
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(1);
          expect(results[0].code).to.equal('page-query-arguments-name');
          done();

        });

    });

  });

  describe('pagination-only-get-requests', function () {

    it('passes when the request is not a get request', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            post:
              parameters:
                - in: query
                  name: some_query
                  schema:
                    type: integer
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
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

  });

  describe('pagination-missing-keys', function () {

    it('passes with missing pagination query parameters', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            get:
              parameters:
                - in: query
                  name: page[cursor]
                  schema:
                    type: string
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
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

  });

  describe('pagination-path-keys', function () {

    it('passes with path (not query) parameters', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path/<thingy>:
            get:
              parameters:
                - in: path
                  name: thingy
                  schema:
                    type: integer
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
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

  });

  describe('pagination-bad-value-type', function () {

    it('fails if pagination parameter values are not integers', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            get:
              parameters:
                - in: query
                  name: page[number]
                  schema:
                    type: string
                - in: query
                  name: page[cursor]
                  schema:
                    type: integer
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(2);
          expect(results[0].code).to.equal('page-query-arguments-size-number');
          expect(results[1].code).to.equal('page-query-arguments-cursor');
          done();

        });

    });

  });

  describe('pagination-non-page-query-parameter', function () {

    it('passes if query parameter does not match the pagination regex', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /some_path:
            get:
              parameters:
                - in: query
                  name: thingy
                  schema:
                    type: string
              responses:
                '200':
                  content:
                    application/vnd.api+json:
                      schema:
                        type: object
                        required:
                        - data
                        properties:
                          data:
                            type: array
                            items:
                              type: integer
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

  });

});
