'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {Document, Parsers} = require('@stoplight/spectral');
const RULESET_FILE = join(__dirname, '../../rules/ll/unified-headers-auth.yaml');

describe('unified-profile-document-path-resource-inflection-ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('auth-headers', function () {

    it('passes when all the paths have the authentication header', function (done) {

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
                - name: Authorization
                  required: true
                  in: header
                  schema:
                    type: string
                    pattern: ^(?i)Bearer (.*)(?-i)
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
                - name: Authorization
                  required: true
                  in: header
                  schema:
                    type: string
                    pattern: ^(?i)Bearer (.*)(?-i)
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

    it('Should not pass because the auth header name is not correct', function (done) {

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
                - name: Authorization111
                  required: true
                  in: header
                  schema:
                    type: string
                    pattern: ^(?i)Bearer (.*)(?-i)
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

    it('Should not pass because the auth header regex does not match with the bearer format standard.', function (done) {

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
                - name: Authorization
                  required: true
                  in: header
                  schema:
                    type: string
                    pattern: ^(?i)Bearerrrrr (.*)(?-i)
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
