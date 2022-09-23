import express, {Express, Request, Response, NextFunction} from 'express'
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import createError from 'http-errors';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import Database from './database/db';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import multer from 'multer';
import Locals from './config/config';

// dotenv configuration
dotenv.config()

// express app configuration
const app : Express = express();

const port : number = Locals.config().port;

app.set('port', port);

// Implementing cors middleware
app.use(cors());

// Implementing helmet middleware
app.use(helmet());

// Implementing morgan middleware
app.use(morgan('dev'));

// Implementing express session middleware
app.use(session({
    secret : Locals.config().secret,
    resave: false as boolean,
    saveUninitialized: true as boolean,
    cookie : {
        maxAge: 2 * 24 * 60 * 60 * 1000,
    },
    store:  MongoStore.create({
        mongoUrl : Locals.config().mongooseUrl,
        ttl: Locals.config().ttl,
    })
}));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());

// Database initialized
Database.init();

// diverting user request to user router
app.use("/user", userRouter);

// diverting product request to product router
app.use("/product", productRouter);

// checking invalid route
app.use((req, res, next) => {
    next( new createError.BadRequest("This route does not exits"))
}) 

// Intializing error-handling
app.use((err : any, req : Request, res : Response, next : NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});


export default app;