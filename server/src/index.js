const mongoose = require('mongoose');
const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config/config');
const logger = require('./config/logger');
const { rangeController } = require('./controllers/index');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server = http.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
        // require('./socket.js');
    });
});

io.on("connection", socket => {
    console.log("connected:::::", rangeController)
    socket.on("getDoc", async() => {
        console.log("all docs fetch::::::");
        try {
            let allDocs = await rangeController.getDocs(io);
            console.log("all Doc Socket", allDocs);
            io.emit("documents", allDocs);
        } catch (err) {
            console.log(err);
        }
    });
    socket.on("addDoc", doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });
});
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

module.exports.io = io;