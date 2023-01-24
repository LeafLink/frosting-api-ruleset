'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');


const RULESET_FILE = join(__dirname, '../../rules/ll/unified-profile-document-path-resource-plural-inflection.yaml');


describe('unified-profile-document-path-resource-inflection-ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('no-singular-path-resource-names', function () {

    it('passes when resource name is plural', function (done) {

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
          /path/names/{id}:
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

    it('fails when resource name is singular', function (done) {

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
                              type: integer
          /path/name/{id}:
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
      `, Parsers.Yaml);

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(doc);

        })
        .then((results) => {

          expect(results.length).to.equal(2);
          done();

        });

    });

  });

});
