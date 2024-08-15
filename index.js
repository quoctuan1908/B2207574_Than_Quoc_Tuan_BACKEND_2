const app = require("./app.js")
const config = require("./app/config")
const MongoDB = require("./app/utils/mongodb.utils.js");

const startServer = async () => {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Database connected!");
        const port = config.app.port;
        app.listen(port, () => {
            console.log("Server is running on port: " + port);
        })

    } catch (error) {
        console.log("Can't connect to database!", error);
    }
}

startServer();
