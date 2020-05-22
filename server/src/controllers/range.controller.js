const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { rangeService } = require('../services');

const addRange = catchAsync(async(req, res) => {
    console.log("request body", req.body);
    const user = await rangeService.addRange(req.body);
    console.log("user created:::::", httpStatus.CREATED)
    res.status(httpStatus.CREATED).send({ user });
});
const getDocs = async() => {
    console.log("fetchAllDocs");
    return new Promise((resolve, reject) => {
        const allDocs = rangeService.getDocs();
        console.log(allDocs);
        resolve(allDocs)
    });
}

module.exports = {
    addRange,
    getDocs
};