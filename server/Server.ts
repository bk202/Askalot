import * as express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {AppError} from '../common/errors/AppError';
import {Request, Response} from 'express';
import {Route} from './routes/Route';
import {HomeAPI} from './routes/HomeAPI';
import {Container} from "inversify";
import {QuestionAnswerAPI} from "./routes/QuestionAnswerAPI";
import {IQuestionAnswerService} from "./services/QuestionAnswerService";
import TYPES from "./enums/ClassTypes";

let favicon = require('serve-favicon');
let config = require('./config');

export class Server {
    public app: express.Application;
    public server: http.Server;
    public container : Container;

    public static bootstrap(container: Container): Server {
        return new Server(container);
    }

    constructor(container : Container) {
        //create expressjs application
        this.app = express();
        //configure application
        this.container = container;
        this.config();
    }

    public config() {

        let dbURI = config.database.URI;
        mongoose.connect(dbURI);
        let db = mongoose.connection;

        db.on('error', console.error);
        db.on('connected', function () {
            console.log('Mongoose default connection open to ' + dbURI);
        });

        this.app.use(favicon(path.join(__dirname, '../client/static/favicon.ico')));
        this.app.use('/', express.static(path.resolve(__dirname, '../client/static/')))
        this.app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(cookieParser());

        let router = express.Router();
        new Route(router);
        this.app.use(router);
        this.api();

        this.app.use(function (err : AppError, req : Request, res : Response, next: any) {
            res.statusCode = (err.status)? err.status : 500;

            res.json({
                error : err.message
            });
        });

    }


    public api() {
        let router = express.Router();
        let qAService : IQuestionAnswerService = this.container.get<IQuestionAnswerService>(TYPES.IQAService);
        new HomeAPI(router);
        new QuestionAnswerAPI(router, qAService);
        this.app.use('/api', router);
    }

}