#! /usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const URL = require("url").URL;
const YAML = require("yaml");

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

function combine(filepath, content) {
  const patharray = filepath.split("/");
  const filename = patharray.splice(patharray.length - 1)[0];
  const directory = patharray.join("/");

  const raw = fs.readFileSync(filepath, "utf8");
  const ruleset = YAML.parse(raw);

  for (const [key, value] of Object.entries(ruleset)) {
    if (key === "extends") {
      for (var i = 0; i < value.length; i++) {
        // create extend path for checking
        const extend = value[i];
        const extendPath =
          directory + "/" + extend.split("/").slice(1).join("/");

        if (stringIsAValidUrl(extend)) {
          console.log("Adding ruleset source " + extend);
          content["extends"].push(extend);
        } else if (fs.lstatSync(extendPath).isFile()) {
          combine(extendPath, content);
        } else {
          console.log("Adding ruleset source " + extend);
          content["extends"].push(extend);
        }
      }
    } else {
      console.log("Gathering rules from " + filepath);
      content["rules"] = { ...content["rules"], ...value };
    }
  }

  return content;
}

// parse args
var argv = require("yargs/yargs")(process.argv.slice(2))
  .alias("i", "input")
  .describe(
    "i",
    "The input file. Should be the top-level ruleset yaml document."
  )
  .alias("o", "output")
  .describe(
    "o",
    "The output file. Will be a single yaml document containing all rules."
  )
  .demandOption(["i", "o"])
  .usage("Usage: $0 -i [input_file] -o [output_file]").argv;

var content = new Object({
  extends: new Array(),
  rules: new Object(),
});

const everything = combine(argv.input, content);

// make filepath if dne
const outDirectory = path.dirname(argv.output);
if (!fs.existsSync(outDirectory)) {
  fs.mkdirSync(outDirectory);
}

fs.writeFile(
  argv.output,
  YAML.stringify(content, { lineWidth: 0 }),
  function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      console.log("Complete!");
    }
  }
);
