import {NextFunction, Response, Router} from "express";
import {IQuestionService} from "../services/QuestionService";
import {BaseAPI} from "./BaseAPI";
import {APIUrls} from "../urls";
import {AuthRequest, maybeAuthenticated, mustBeAuthenticated} from "../middlewares/AuthMiddleware";
import {QuestionDto} from "../dtos/q&a/QuestionDto";
import {User} from "../models/User";
import {CommentDto} from "../dtos/q&a/CommentDto";

export class QuestionAPI extends BaseAPI {

    private service : IQuestionService;
    public router : Router;
    constructor(service: IQuestionService) {
        super();
        this.router = Router();
        this.service = service;
        this.router.get(APIUrls.QuestionPreviews, maybeAuthenticated, this.getQuestionPreviews);
        this.router.post(APIUrls.CreateQuestion, mustBeAuthenticated, this.createQuestion);
        this.router.get(APIUrls.GetQuestionPage, maybeAuthenticated, this.getQuestion);
        this.router.put(APIUrls.UpdateQuestion, mustBeAuthenticated, this.updateQuestion);
        this.router.put(APIUrls.UpVoteQuestion, mustBeAuthenticated, this.upVoteQuestion);
        this.router.put(APIUrls.DownVoteQuestion, mustBeAuthenticated, this.downVoteQuestion);
        this.router.put(APIUrls.CreateComment, mustBeAuthenticated, this.createComment);
        this.router.put(APIUrls.UpdateComment, mustBeAuthenticated, this.UpdateComment);
        this.router.put(APIUrls.DeleteComment, mustBeAuthenticated, this.DeleteComment);
    }

    public getQuestionPreviews = (req: AuthRequest, res: Response, next: NextFunction) => {
        let result = this.service.getQuestionPreview(req.user);
        this.respondPromise(result, res, next);
    };

    public createQuestion = (req: AuthRequest, res: Response, next: NextFunction) =>{
        let question: QuestionDto = req.body;
        let user : User = req.user;
        let result = this.service.createQuestion(question, user);
        this.respondPromise(result, res, next);
    };

    public getQuestion = (req: AuthRequest, res: Response, next: NextFunction) => {
        let id = req.params.id;
        let result = this.service.getQuestionPageByID(id, req.user);
        this.respondPromise(result, res, next);
    };

    public updateQuestion = (req: AuthRequest, res: Response, next: NextFunction) => {
        let question: QuestionDto = req.body;
        let user : User = req.user;
        let result = this.service.updateQuestion(question, user);
        this.respondPromise(result, res, next);
    };

    public upVoteQuestion = (req: AuthRequest, res: Response, next: NextFunction) => {
        let question: QuestionDto = req.body;
        let user : User = req.user;
        let result = this.service.upVoteQuestion(question._id, user);
        this.respondPromise(result, res, next);
    };

    public downVoteQuestion = (req: AuthRequest, res: Response, next: NextFunction) => {
        let question: QuestionDto = req.body;
        let user : User = req.user;
        let result = this.service.downVoteQuestion(question._id, user);
        this.respondPromise(result, res, next);
    };

    public createComment = (req: AuthRequest, res: Response, next: NextFunction) => {
        let question: QuestionDto = req.body;
        let result = this.service.createComment(question);
        this.respondPromise(result, res, next);
    };

    public UpdateComment = (req: AuthRequest, res: Response, next: NextFunction) => {
        let commentIndx: number = req.body.commentIndx;
        let updatedComment: CommentDto = req.body.updatedComment;
        let questionId: string = req.body.questionID;
        let user: User = req.user;
        let result = this.service.UpdateComment(commentIndx, questionId, user, updatedComment);
        this.respondPromise(result, res, next);
    }

    public DeleteComment = (req: AuthRequest, res: Response, next: NextFunction) => {
        let commentIndx: number = req.body.commentIndx;
        let questionId: string = req.body.questionID;
        let user: User = req.user;
        let result = this.service.DeleteComment(commentIndx, questionId, user);
        this.respondPromise(result, res, next);
    }
}
