const httpStatus = require('http-status');
const { range } = require('../models');
const ApiError = require('../utils/ApiError');

const addRange = async(userBody) => {
    console.log("save Range Of Dates");
    const user = await range.create(userBody);
    console.log("aaaa");
    return user;
};
const getDocs = async() => {
    try {
        console.log("get All Documents");
        const allDoc = await range.find({});
        console.log("docs", allDoc);
        return allDoc;
    } catch (err) {
        console.log(err);
    }
};
module.exports = {
    addRange,
    getDocs
};