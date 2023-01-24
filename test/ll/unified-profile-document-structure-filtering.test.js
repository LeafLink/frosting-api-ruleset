'use strict';


const {join} = require('path');
const {expect} = require('chai');
const {Spectral} = require('@stoplight/spectral');
const {getDocument} = require('../tooling/utils');

const RULESET_FILE = join(__dirname, '../../rules/ll/unified-profile-document-structure-filtering.yaml');

describe('jsonapi-document-structure-filtering-ruleset', function () {

  let spectral;

  beforeEach(function () {

    spectral = new Spectral();

  });

  describe('filtering-keys-allowed-format', function () {

    it('passes when filter keys are in allowed format', function (done) {

      const allowedFormats = [
        //lower
        'filter[email]',
        //lower.lower
        'filter[order.id]',
        //lowerCamelCase.lowerCamelCase
        'filter[orderName.iContains]',
        //nested.relation.camelCase
        'filter[order.invoice.paymentTotal.gte]'

      ];

      allowedFormats.forEach(function (filterValue) {

        const doc = getDocument({'filterParamName': filterValue});

        spectral.loadRuleset(RULESET_FILE)
          .then(() => {

            return spectral.run(doc);

          })
          .then((results) => {

            expect(results.length).to.equal(0);

          });

      });

      done();

    });

  });

  describe('filtering-keys-unallowed-format', function () {

    it('fails when filter keys are do not follow allowed format', function (done) {

      const unallowedFormats = [
        'filter[UPPERCASE]',
        'filter[ProperCase]',
        'filter[filter..twodotnotation]',
        'filter[filter.]',
        'filter[23094-02934]',
        'filter[email^%$&*]'
      ];

      unallowedFormats.forEach(function (filterValue) {

        const doc = getDocument({'filterParamName': filterValue});

        spectral.loadRuleset(RULESET_FILE)
          .then(() => {

            return spectral.run(doc);

          })
          .then((results) => {

            expect(results.length).to.equal(1);
            expect(results[0].code).to.equal('filter-query-arguments');

          });

      });

      done();

    });

  });

});
