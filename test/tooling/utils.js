'use strict';

const {Document, Parsers} = require('@stoplight/spectral');

/**
 * get a YAML document.
 * if no over rides provided, returns a ruleset valid document
 * @param {Object} options with below possible key values
 * {String} responseContentPropertyKey name of the key within responses.content.properties
 * {String} filterParamName A keys value for a query filter
 * @return {Document} The document.
 */
const getDocument = ({responseContentPropertyKey = 'data', filterParamName = 'filter[email]'}) => {

  return new Document(`
    openapi: 3.0.2
    paths:
      /some_path:
        get:
          operationId: GET/v1/leaflink/users
          description: Fetch a list of Users
          parameters:
          - name: ${filterParamName}
            required: false
            in: query
            description: email
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
                      ${responseContentPropertyKey}:
                        type: array
                        items:
                          $refs: '#/components/schemas/User'
    components:
      schemas:
        User:
          type: object
          required:
          - type
          - id
          additionalProperties: false
          properties:
            attributes:
              type: object
              properties:
                id:
                  type: integer
                  readOnly: true
                email:
                  type: string
                  format: email
                  maxLength: 255
                firstName:
                  type: string
                  maxLength: 30
                lastName:
                  type: string
                  maxLength: 30
                dateJoined:
                  type: string
                  format: date-time
              required:
              - email
    `, Parsers.Yaml);

};

exports.getDocument = getDocument;
