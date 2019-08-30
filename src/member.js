const fs = require('fs');
const errorMsg = require('./errors')
let rawData = fs.readFileSync('./src/data.json');
let familyTree = JSON.parse(rawData);
const members = {
    checkPersons: function (key, value) {
        var i = null;
        let family = [];
        for (i = 0; familyTree.length > i; i += 1) {
            if (familyTree[i][key] === value) {
                family.push(familyTree[i]);
            }
        }
        return (family.length != 0) ? family : errorMsg.not_found
    },
    getRelationship: function (person, gender, mother, spouse, relation) {
        var result ;
        switch (relation) {
            case "mother":
                result = mother;
                break;
            case "father":
                result = this.getFather(mother);
                break;
            case "spouse":
                result = this.getSpouse(spouse);
                break;
            case "son":
                result = this.getChildren(person, gender, spouse, 'M');
                break;
            case "daughter":
                result = this.getChildren(person, gender, spouse, 'F');
                break;
            case "siblings":
                result = this.getSiblings(person, mother);
                break;
            case "brother-in-law":
                result = this.getInlaws(person, spouse, mother, 'M');
                break;
            case "sister-in-law":
                result = this.getInlaws(person, spouse, mother, 'F');
                break;
            case "paternal-uncle":
                result = this.getMatOrPat(mother, 'M', 'PATERNAL');
                break;
            case "paternal-aunt":
                result = this.getMatOrPat(mother, 'F', 'PATERNAL');
                break;
            case "maternal-uncle":
                result = this.getMatOrPat(mother, 'M', 'MATERNAL');
                break;
            case "maternal-aunt":
                result = this.getMatOrPat(mother, 'F', 'MATERNAL');
                break;
            default:
                result = 'RELATIONSHIP_NOT_FOUND';
        }

        return result;

    },

    getMatOrPat: function (mother, gender, option) {
        let getMatOrPat = '';
        let siblings;
        let grandMother = '';
        switch (option) {
            case "MATERNAL":
                grandMother = this.getMother(mother)[0].mother;
                siblings = this.getSiblings(mother, grandMother);
                break;

            case "PATERNAL":
                let father = this.getFather(mother);
                grandMother = this.checkPersons('name', father)[0].mother;
                siblings = this.getSiblings(father, grandMother);
                break;
        }
        if (siblings === errorMsg.none) {
            return errorMsg.none;
        }
        let siblingsArray = siblings.split(' ');
        siblingsArray.pop();
        siblingsDetailArray = [];
        siblingsArray.forEach(element => {
            let siblingDetail = this.checkPersons('name', element);
            let siblingGender = siblingDetail[0].gender;
            if (gender === siblingGender) {
                getMatOrPat += element + ' ';
            }
        });

        return (getMatOrPat.length === 0) ? errorMsg.none : getMatOrPat;
    },
    getInlaws: function (person, spouse, mother, gender) {
        var inLaws = '';
        var siblings;
        if(mother === "null"){
             let motherInLaw = this.checkPersons('name', spouse)[0].mother;
             siblings = this.getSiblings(spouse, motherInLaw);
        }else{
             siblings = this.getSiblings(person, mother);
        }
        if (siblings === errorMsg.none) {
            return errorMsg.none;
        }
        let siblingsArray = siblings.split(' ');
        siblingsArray.pop();
        siblingsDetailArray = [];

        siblingsArray.forEach(element => {
            let siblingDetail = this.checkPersons('name', element);
            let siblingGender = siblingDetail[0].gender;
            let siblingMother = siblingDetail[0].mother;
            let spouseOfSiblings = siblingDetail[0].spouse;
            if (gender != siblingGender ) {
                if(spouseOfSiblings != "null"){
                    inLaws += siblingDetail[0].spouse + ' ';
                }
            }
            if (gender === siblingGender && mother != siblingMother){
                inLaws += siblingDetail[0].name + ' ';
            }
        });
        return (inLaws.length === 0 || inLaws === null ) ? errorMsg.none : inLaws;
    },
    getChildren: function (person, gender, spouse, childGender) {
        var childrenArray;
        if (gender === 'M') {
            childrenArray = this.checkPersons('mother', spouse);
        }
        if (gender === 'F') {
            childrenArray = this.checkPersons('mother', person);
        }
        let children = '';
        if (childrenArray != errorMsg.not_found) {
            childrenArray.forEach(element => {
                if (element.gender === childGender) {
                    children += element.name + ' ';
                }
            });
        } else {
            children = errorMsg.none;
        }
        return children;
    },
    getMother: function (mother) {
        return this.checkPersons('name', mother);
    },
    getFather: function (mother) {
        if (mother === "null") {
            return errorMsg.none;
        }
        let motherArray = this.getMother(mother);
        let father = motherArray[0].spouse;
        return father;
    },
    getSpouse: function (spouse) {
        return (spouse === "null") ? errorMsg.none : spouse;
    },
    getSiblings: function (person, mother) {
        if (mother === "null") {
            return errorMsg.none;
        }
        let siblingsArray = this.checkPersons('mother', mother);
        let siblings = '';
        if (siblingsArray != errorMsg.not_found) {
            siblingsArray.forEach(element => {
                if (element.name != person) {
                    siblings += element.name + ' ';
                }
            });
        }
        return (siblings.length === 0) ? errorMsg.none : siblings;
    },

}

module.exports = members;