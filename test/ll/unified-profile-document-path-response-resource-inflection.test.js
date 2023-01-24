'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');


const RULESET_FILE = join(__dirname, '../../rules/ll/unified-profile-document-path-response-resource-singular-inflection.yaml');


describe('unified-profile-document-path-response-resource-inflection', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('no-plural-path-response-types', function () {

    it('passes when response type is singular', function (done) {

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
                              $ref: "#/components/schemas/User"
        components:
          schemas:
            User:
              type: object
              required:
                - type
                - id
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          //eslint-disable-next-line no-console
          console.log(results);
          expect(results.length).to.equal(0);
          done();

        });

    });

    it('fails when response type is plural', function (done) {

      const doc = new Document(`
        openapi: 3.0.2
        paths:
          /path/name:
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
                              $ref: "#/components/schemas/Users"
        components:
          schemas:
            Users:
              type: object
              required:
                - type
                - id
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
