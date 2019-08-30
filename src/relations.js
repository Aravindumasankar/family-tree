const members = require('./member');
const realtions = {
    "getArguements": function getArguements(params) {
        let arguementArr = [];
        for (let items of params) {
            arguementArr.push(items);
        }
        return arguementArr[0].split(' ');
    },
    "getRelationship": function getRelationship(paramsArray) {
        let name = paramsArray[0];
        let relationship = paramsArray[1].toLowerCase();
        let getPerson = members.checkPersons('name',name);
        if(getPerson === 'PERSON_NOT_FOUND'){
            return getPerson;
        }
        let mother = getPerson[0].mother;
        let spouse = getPerson[0].spouse;
        let gender = getPerson[0].gender;
        let getRelationship = members.getRelationship(name, gender, mother, spouse, relationship);
        return getRelationship;
        }
}
module.exports = realtions;