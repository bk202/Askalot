
import {AnswerDto} from "../dtos/q&a/AnswerDto";
import {User} from "../models/User";
import {BaseService} from "./BaseService";
import {IAnswerRepository} from "../repositories/AnswerRepository";
import {Answer} from "../models/Answer";
import {AppError} from "../errors/AppError";
import {UserAnswerVote} from "../models/UserAnswerVote";
import {CommentDto} from "../dtos/q&a/CommentDto";
import {ClientError} from "../errors/HttpStatus";
import _ = require("lodash");
import {QuestionRepository} from "../repositories/QuestionRepository";

export interface IAnswerService {
    createAnswer(user: User, answer: AnswerDto): Promise<AnswerDto>;
    updateAnswer(user: User, answer: AnswerDto): Promise<AnswerDto>;
    upVoteAnswer(user: User, answerId: string): Promise<AnswerDto>;
    downVoteAnswer(user: User, answerId: string): Promise<AnswerDto>;
    createAnswerComment(comment: CommentDto, answerId: string, user: User): Promise<AnswerDto>;
    updateAnswerComment(comment: CommentDto, answerId: string, user: User): Promise<AnswerDto>;
    deleteAnswerComment(comment: CommentDto, answerId: string, user: User): Promise<AnswerDto>;
    markAnswerAsCorrect(answer: Answer, user: User): Promise<AnswerDto[]>;
}

export class AnswerService extends BaseService implements IAnswerService {

    private answerRepository: IAnswerRepository;

    constructor(answerRepository: IAnswerRepository, private questionRepository: QuestionRepository) {
        super();

        this.answerRepository = answerRepository;
    }

    createAnswer(currentUser: User, newAnswer: AnswerDto): Promise<AnswerDto> {
        let answerObj = new Answer(newAnswer.question, newAnswer.content, currentUser);
        return this.answerRepository.create(answerObj);
    }

    updateAnswer(currentUser: User, updatedAnswer: AnswerDto): Promise<AnswerDto> {
        return this.answerRepository.getById(updatedAnswer._id).then((answerFound: Answer) => {
            this.checkPermissionForModification(updatedAnswer, answerFound, currentUser);

            answerFound.content = updatedAnswer.content;
            answerFound.lastEditedUtc = new Date(Date.now());

            return this.answerRepository.update(answerFound)
                .then((answer)=> this.answerRepository.getById(answer._id));
        });
    }

    upVoteAnswer(user: User, answerId: string): Promise<AnswerDto> {
        return this.voteHelper(answerId, user, true);
    }

    downVoteAnswer(user: User, answerId: string): Promise<AnswerDto> {
        return this.voteHelper(answerId, user, false);
    }

    voteHelper(answerId: string, user: User, up: boolean) {
        const updateVoteAnswer = new UserAnswerVote(user._id, answerId, up);
        return this.answerRepository.findOneAndUpdateVoteAnswer(updateVoteAnswer)
            .then((answer: Answer)  => {
            return answer;
        });
    }

    createAnswerComment(comment: CommentDto, answerId: string, user: User){
        return this.answerRepository.getById(answerId).then((answerFound: Answer) => {
            let now = new Date();
            comment.createdUtc = now;
            comment.lastEditedUtc = now;
            answerFound.comments.push(comment);
            return this.answerRepository.update(answerFound).then((answerFound: Answer) => {
                return this.answerRepository.getById(answerFound._id);
            });
        });
    }

    updateAnswerComment(comment: CommentDto, answerId: string, user: User){
        return this.answerRepository.getById(answerId).then((answerFound: Answer) => {
            let commentIndx: number = _.findIndex(answerFound.comments, c => c._id == comment._id);
            if(answerFound.comments[commentIndx].commentBy.username != user.username ||
                !answerFound.comments[commentIndx].commentBy._id.equals(user._id)){
                throw new AppError("You are not the owner of this question!", ClientError.UNAUTHORIZED);
            }
            let now = new Date();
            answerFound.comments[commentIndx].commentContent = comment.commentContent;
            answerFound.comments[commentIndx].lastEditedUtc = now;
            return this.answerRepository.update(answerFound);
        })
    }

    async markAnswerAsCorrect(answer: Answer, user: User): Promise<AnswerDto[]> {
        let answerFound = await this.answerRepository.getById(answer._id);
        let question = await this.questionRepository.getById(answer.question);
        if (question.author._id.toString() !== user._id.toString()){
            throw new AppError("You are not authorized to perform this action");
        }
        let otherAnswers: Answer[] = await this.answerRepository.getByQuestionId(answer.question);
        let promises = [];
        for (let a of otherAnswers){
            if (a.correct && a._id != answerFound._id){
                a.correct = false;
                promises.push(this.answerRepository.update(a));
            }
        }
        answerFound.correct = true;
        promises.push(this.answerRepository.update(answerFound));
        await Promise.all(promises);
        // TODO: choose what to  return
        return await this.answerRepository.getByQuestionId(answer.question);
    }

    deleteAnswerComment(comment: CommentDto, answerId: string, user: User){
        return this.answerRepository.getById(answerId).then((answerFound: Answer) => {
            let commentIndx = _.findIndex(answerFound.comments, c => c._id == comment._id);
            if(answerFound.comments[commentIndx].commentBy.username != user.username ||
                !answerFound.comments[commentIndx].commentBy._id.equals(user._id)){
                throw new AppError("You are not the owner of this question!", ClientError.UNAUTHORIZED);
            }
            answerFound.comments.splice(commentIndx, 1);
            return this.answerRepository.update(answerFound);
        });
    }

    private checkPermissionForModification = (answerByUser: AnswerDto, answerFoundInDb: Answer, currentUser: User) => {
        if (answerByUser.author._id.toString() != currentUser._id.toString()) {
            throw new AppError("You are not the owner of this question");
        }
        return true;
    }
}