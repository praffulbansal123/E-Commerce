import mongoose from "mongoose";
import logger from '../logger/logger'
import Locals from '../config/config'

/*
* @author Prafful Bansal
* @description Database configuration
*/
class Database {
    // Initialize the database connection
    public static async init () : Promise<void> {
        const dsn : string  = Locals.config().mongooseUrl

        try {
            await mongoose.connect(dsn)
            logger.info("Database initialized successfully");
        } catch (error : any) {
            logger.info("Database connection error: " + error.message);
        }  
    }
}

export default Database;