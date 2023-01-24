'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');
const RULESET_FILE = join(__dirname, '../../rules/ll/unified-headers-version.yaml');

describe('unified-headers-version', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('version-headers', function () {

    it('passes when all the paths have the correct header versions if included.', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
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
              parameters:
                - name: LeafLink-Version
                  required: false
                  in: header
                  schema:
                    type: date
          /path/otro_path:
            post:
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
              parameters:
                - name: LeafLink-Version
                  required: false
                  in: header
                  schema:
                    type: date
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

    it('Should not pass because the version header name is not correct', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
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
              parameters:
                - name: version
                  required: false
                  in: header
                  schema:
                    type: date
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

    it('Should not pass because the version header required is true', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
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
              parameters:
                - name: LeafLink-Version
                  required: true
                  in: header
                  schema:
                    type: date
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

    it('Should not pass because the version header format is not date', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/names:
            get:
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
              parameters:
                - name: LeafLink-Version
                  required: false
                  in: header
                  schema:
                    type: fecha
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

  });

});
