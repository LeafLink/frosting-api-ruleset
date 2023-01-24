# Contribution Guide

This document will lay out how to go about adding new rules, or altering existing ones.

## So what's a good change?

Generally, unless the circumstances are unusual, changes should maintain or increase the rigorousness of our API linting. It is also important to remember that non-backwards compatible changes will cause API integration breakage, and to version them properly as such. Reach out to the API team to make sure your change is reasonable, before beginning to implement it.

## A few ground rules

### Organization

Rules are separated into YAML files, stored in the `/rules/` directory and its subdirectories. It is important not to modify or add new rules or files directly to the base `/rules/` directory, but instead to the `/rules/ll/` directory.

### Naming

Ruleset YAML files which derive from the oas3 specification should have the `oas3-` prefix, while custom unified ruleset files should have the `unified-` prefix. This helps make groupings clear to the casual browser, and improves organization.

### Testing

All new and existing rule alterations need to be covered by tests, which can be found in the `/test/` directory. These tests allow maintainers to make sure that the ruleset is fully functional, before rolling out a new version which could hypothetically impact all existing APIs which integrate with Frosting. To run tests, use `npm run test`.

### Linting

All ruleset YAML files should be correctly linted before committing to main. Please use the `npm run check` and `npm run lint` commands, and fix all errors.

## Pull Requests

Once you've made your changes, put up a pull request! Make sure to tag the API Team for review. Once approved, make sure you coordinate merge and release with the API team, as they are responsible for making sure ruleset modifications do not block any ongoing pipelines.
