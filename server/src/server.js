import app from "./app.js";
import { connectToMongoDB } from "./config/db/index.js";
import { PORT } from "./config/index.js";

// Connect to MongoDB and start the server
connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
