'use strict';

const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {getDocument} = require('../tooling/utils');

const RULESET_FILE = join(__dirname, '../../rules/ll/unified-profile-document-structure-member-names.yaml');

describe('unified-profile-document-structure-member-names ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('unified-member-name-format', function () {

    it('passes when all properties data members meet the character rules', function (done) {

      const goodDocument = getDocument({'responseContentPropertyKey': 'firstName'});

      spectral.loadRuleset(RULESET_FILE)
        .then(() => {

          return spectral.run(goodDocument);

        })
        .then((results) => {

          expect(results.length).to.equal(0);
          done();

        });

    });

    it('fails when a property name is an invalid pattern', function (done) {

      ['"FirstName"', '"firstNamE"', '"first$Name"'].forEach(function (key) {

        const goodDocument = getDocument({'responseContentPropertyKey': key});

        spectral.loadRuleset(RULESET_FILE)
          .then(() => {

            return spectral.run(goodDocument);

          })
          .then((results) => {

            expect(results.length).to.equal(1, 'Error count should be 1');
            expect(results[0].code).to.equal('unified-member-name-format');

          });

      });

      done();

    });

  });

});
