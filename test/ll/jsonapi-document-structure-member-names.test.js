'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {getDocument} = require('../tooling/utils');

const RULESET_FILE = join(__dirname, '../../rules/ll/jsonapi-document-structure-member-names.yaml');

describe('jsonapi-document-structure-member-names ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('member-name-allowed-characters', function () {

    it('passes when all properties data members meet the character rules', function (done) {

      const goodDocument = getDocument('data');

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(goodDocument);

        })
        .then((results) => {

          expect(results.length).to.equal(0);
          done();

        });

    });

    it('fails when a property is 0 characters long', function (done) {

      const goodDocument = getDocument('""');

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(goodDocument);

        })
        .then((results) => {

          expect(results.length).to.equal(1, 'Error count should be 1');
          expect(results[0].code).to.equal('member-name-allowed-characters');
          done();

        });

    });

    it('fails when a property name contains invalid characters', function (done) {

      ['"lastName@"', '"@lastName"', '"last@Name"'].forEach(function (key) {

        const goodDocument = getDocument(key);

        spectral.loadRuleset(RULESET_FILE)
          .then(() => {

            return spectral.run(goodDocument);

          })
          .then((results) => {

            expect(results.length).to.equal(1, 'Error count should be 1');
            expect(results[0].code).to.equal('member-name-allowed-characters');

          });

      });

      done();

    });

  });

});
