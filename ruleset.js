import fs from 'fs'
import YAML from 'yaml';

const file = fs.readFileSync('./frosting-ruleset.yaml', 'utf8');
const rules = YAML.parse(file)

export default {
  rules: rules
};
