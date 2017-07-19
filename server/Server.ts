import * as express from "express";
import {NextFunction, Request, Response} from "express";
import * as mongoose from "mongoose";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as helmet from "helmet";
import {PageProvider} from "./routes/PageProvider";
import {HomeAPI} from "./routes/HomeAPI";
import {QuestionAPI} from "./routes/QuestionAPI";
import {AuthenticationAPI} from "./routes/AuthenticationAPI";
import {config} from "./config";
import {ServiceProvider} from "./Container";
import {AppError} from "./errors/AppError";
import {FileUploadAPI} from "./routes/FileUploadAPI";

let favicon = require('serve-favicon');
import * as morgan from 'morgan';
import {AnswerAPI} from "./routes/AnswerAPI";
import {loadUniversityData} from "./utils/UniversityCsvLoader";
import {LocationAPI} from "./routes/LocationAPI";

export class Server {
    public app: express.Application;
    private config;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor(custom_config?) {
        this.config = (custom_config)? custom_config : config;
        //create expressJS application
        this.app = express();
        //configure applicationwebpakc
        this.configure();
    }

    private configure(): void {
        /* Database */
        this.connectMongoose();

        /* Third party middleware */
        this.app.use(helmet());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));

        /* API for client side */
        this.api();

        /* Static files */
        this.staticFiles();

        /* Error Handler */
        this.app.use(this.errorHandler);
    }

    private connectMongoose(): void {
        let dbURI = this.config.database.URI;
        mongoose.connect(dbURI);
        let db = mongoose.connection;

        db.on('error', console.error);
        db.on('connected', function () {
            console.log('Mongoose default connection open to ' + dbURI);
        });
    }

    private staticFiles() {
        this.app.use(favicon(path.join(__dirname, '../client/static/favicon.ico')));
        this.app.use('/', express.static(path.resolve(__dirname, '../client/static/')));
        this.app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));
        let router = express.Router();
        new PageProvider(router);
        this.app.use(router);
    }


    private api() {
        let router = express.Router();

        /* Home */
        new HomeAPI(router);
        /* QuestionHomeComponent */
        new QuestionAPI(router, ServiceProvider.QuestionService);
        /* Authentication */
        new AuthenticationAPI(router, ServiceProvider.AuthenticationService);
        /* File Upload */
        new FileUploadAPI(router, ServiceProvider.FileSystemService);

        new AnswerAPI(router, ServiceProvider.AnswerService);

        new LocationAPI(router, ServiceProvider.LocationService);

        this.app.use('/api', router);
    }

    private checkAndInsertUniversityData() {
        // helper function load static data in for the first time
        loadUniversityData();
    }

    private errorHandler(err : AppError, req : Request, res : Response, next: NextFunction) {
       // console.log(err.message);   err may not be an AppError, need to check whether status presents or not
       //  console.log(err.status);
        console.error(err.stack);
        res.statusCode = (err.status)? err.status.code : 500;
        res.json({error: err.message});
    }

}
