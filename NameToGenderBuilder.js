"use strict";

const _ = require("lodash");
//--------------- end imports --------------

const REPLACEMENTS = ['', ' ', '-'];
class NameToGenderBuilder {
    build(data) {
        let mapping = { };
        _.forEach(data, line => {
            let item = this._parse(line);
            this._insert(mapping, item);
        });
        return mapping;
    }

    _parse(line) {
        if (!line.includes("#") && !line.includes("=")) {
            let parts = _.pull(line.split(" "), "");
            let countryValues = line.substr(30, line.length-1);
            let name = parts[1].toLowerCase();
            let gender =  "unknown";
            switch(parts[0]) {
                case "M":
                    gender = "male";
                    return { name, gender, countryValues };
                case "1M":
                case "?M":
                    gender = "mostly_male";
                    return { name, gender, countryValues };
                case "F":
                    gender = "female";
                    return { name, gender, countryValues };
                case "1F":
                case "?F":
                    gender = "mostly_female";
                    return { name, gender, countryValues };
                case "?":
                    gender = "andy";
                    return { name, gender, countryValues };
                default:
                    throw new Error(`Not sure what to do with a sex of ${part[0]}`);
            }
        }
    }

    _insert(mapping, item) {
        if (item && item.name.includes("+")) {
            _.forEach(REPLACEMENTS, replacement => {
                item.name.replace("+", replacement);
            });
        }
        if (item && _.isNil(mapping[item.name])) {
            mapping[item.name] = { };
            mapping[item.name][item.gender] = item.countryValues;
        }
    }
}

module.exports = NameToGenderBuilder;
