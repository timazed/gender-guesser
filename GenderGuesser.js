"use strict";

const _ = require("lodash");
const FileReader = require("./FileReader.js");
const NameToGenderBuilder = require("./NameToGenderBuilder.js");
const Promise = require("bluebird");
///------------------- end imports -------------------

const COUNTRIES = "great_britain ireland usa italy malta portugal spain france \
               belgium luxembourg the_netherlands east_frisia germany austria \
               swiss iceland denmark norway sweden finland estonia latvia \
               lithuania poland czech_republic slovakia hungary romania \
               bulgaria bosniaand croatia kosovo macedonia montenegro serbia \
               slovenia albania greece russia belarus moldova ukraine armenia \
               azerbaijan georgia the_stans turkey arabia israel china india \
               japan korea vietnam other_countries".split();

const FILE = "./data/names.txt";
class GenderGuesser {
    static create() {
        let fileReader = new FileReader(FILE);
        return fileReader.process().then(data => {
            let builder = new NameToGenderBuilder();
            let mappings = builder.build(data);
            let instance = new GenderGuesser();
            _.assign(instance, {mappings});
            return Promise.resolve(instance);
        });
    }

    gender(name, country) {
        name = name.toLowerCase();
        if (_.isNil(this.mappings[name])) {
            return "unknown";
        } else if (_.isNil(country)) {
            return this._mostPopularGender(name, (countryValues) => {
                countryValues = _.map(countryValues.split(" "), c => c.charCodeAt(0));
                return [
                    countryValues.length,
                    _.sum(_.map(countryValues, c => c > 64 && c-55 || c-48))
                ];
            });
        } else if (COUNTRIES[country]) {
            let index = COUNTRIES.indexOf(country);
            return this._mostPopularGender(name, (countryValues) => {
                return [countryValues[index].charCodeAt(0)-32, 0];
            });
        } else {
            throw Error(`No such country: ${country}`);
        }
    }


    _mostPopularGender(name, counter) {
        if (_.isNil(this.mappings[name])) {
            return "unknown";
        }

        let maxCount = 0;
        let maxTie = 0;
        let best = _.first(Object.keys(this.mappings[name]));//list(self.names[name].keys())[0]
        _.forEach(this.mappings[name], (countryValues, gender) => {
            let counterValue = counter(countryValues);
            let count = counterValue[0];
            let tie = counterValue[1];
            if (count > maxCount || (count === maxCount && tie > maxTie)) {
                maxCount = count;
                maxTie = tie;
                best = gender;
            }
        });
        return (maxCount > 0) ? best : "andy";
    }
}

module.exports = GenderGuesser;
