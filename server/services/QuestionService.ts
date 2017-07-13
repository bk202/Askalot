import {IQuestionRepository} from "../repositories/QuestionRepository";
import {IAnswerRepository} from "../repositories/AnswerRepository";
import {QuestionDto} from "../dtos/q&a/QuestionDto";
import {AnswerDto} from "../dtos/q&a/AnswerDto";
import {Question} from "../models/Question";
import {User} from "../models/User";
import {QuestionPageDto} from "../dtos/q&a/QuestionPageDto";
import {Answer} from "../models/Answer";
import {AppError} from "../errors/AppError";
import {BaseService} from "./BaseService";
import {QuestionPreviewCollectionsDto} from "../dtos/q&a/QuestionPreviewCollectionsDto";
import {ClientError} from "../errors/HttpStatus";
import {ITagRepository} from "../repositories/TagRepository";
import {ITag} from "../models/Tags";
import {UserQuestionVote} from "../models/UserQuestionVote";


export interface IQuestionService {
    getQuestionPreview(user?: User): Promise<QuestionPreviewCollectionsDto>;
    createQuestion(question: QuestionDto, user: User): Promise<QuestionDto>;
    getQuestionPageByID(name: string): Promise<QuestionPageDto>;
    getUserQuestions(currentUser: User): Promise<QuestionDto[]>;
    updateQuestion(question: QuestionDto, user: User): Promise<QuestionDto>;
    upVoteQuestion(questionId: string, user: User): Promise<QuestionDto>;
    downVoteQuestion(questionId: string, user: User): Promise<QuestionDto>;
}

export class QuestionService extends BaseService implements IQuestionService {
    private questionRepository: IQuestionRepository;

    private answerRepository: IAnswerRepository;
    private tagRepository: ITagRepository;
    constructor(questionRepository: IQuestionRepository,
                answerRepository: IAnswerRepository,
                tagRepository: ITagRepository) {
        super();
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.tagRepository = tagRepository;
    }

    getQuestionPreview(user?: User): Promise<QuestionPreviewCollectionsDto> {
        let promises = [];
        promises.push(this.questionRepository.getAll({sort: "-createdUtc", limit: 25}));
        if (user) {
            promises.push((this.questionRepository.getQuestionsByAuthor(user)));
        }
        return Promise.all(promises).then((result) => {
            return {
                featuredQuestions: result[0] ? result[0] : [],
                myQuestions: result[1] ? result[1] : []
            };
        })
    }

    createQuestion(question: QuestionDto, currentUser: User): Promise<QuestionDto> {
        return this.tagRepository.getTags(question.tags).then((tags: ITag[]) => {
            let questionObject = new Question(
                question.title, question.content, currentUser, tags,
                question.isPublished, question.publicityStatus
            );
            return this.questionRepository.create(questionObject);
        })
    }

    getQuestionPageByID(id: string): Promise<QuestionPageDto> {
        let questionPage: QuestionPageDto = {
            question: null,
            answers: []
        };
        return this.questionRepository.getById(id).then((question: Question) => {
            questionPage.question = question;
            return this.answerRepository.getByQuestionId(question._id);
        }).then((answers: Answer[]) => {
            questionPage.answers = answers ? answers : [];
            return questionPage;
        });
    }

    getUserQuestions(currentUser: User): Promise<QuestionDto[]> {
        return this.questionRepository.getQuestionsByAuthor(currentUser).then((questions: Question[]) => {
            return questions;
        });

    }

    updateQuestion(questionDto: QuestionDto, user: User): Promise<QuestionDto> {
        return this.questionRepository.getById(questionDto._id).then((questionFound: Question) => {
            this.checkPermissionForModification(questionDto, questionFound, user);

            // editable fields
            questionFound.content = questionDto.content;
            questionFound.title = questionDto.title;

            // update last edited utc
            questionFound.lastEditedUtc = new Date(Date.now());

            return this.questionRepository.update(questionFound)
                .then((question)=> this.questionRepository.getById(question._id));
        });
    }

    upVoteQuestion(questionId: string, user: User): Promise<QuestionDto> {
        return this.voteHelper(questionId, user, true);
    }

    downVoteQuestion(questionId: string, user: User): Promise<QuestionDto> {
        return this.voteHelper(questionId, user, false);
    }

    voteHelper(questionId: string, user: User, up: boolean) {
        let vote = new UserQuestionVote(user._id, questionId, up);
        return this.questionRepository.findOneAndUpdateVoteQuestion(vote).then((question: Question)  => {
            return question;
        });
    }

    private checkPermissionForModification = (questionDto: QuestionDto, questionObj: Question, currentUser: User) => {
        if (questionObj.author._id.toString() != currentUser._id.toString()) {
            throw new AppError("You are not the owner of this question!")
        }
        if (currentUser.username != questionDto.author.username) {
            throw new AppError("You cannot change the username of the author")
        }
        return true;
    };

    protected applyUpdateRestrictions(questionDto: QuestionDto, questionInDB: Question): QuestionDto {
        delete questionDto._id;
        delete questionDto.author;
        delete questionDto.createdUtc;
        if (questionDto.isPublished) {
            delete questionDto.isPublished
        }
        if (questionDto.publicityStatus !== questionInDB.publicityStatus) {
            throw new AppError("You cannot change the publicity status", ClientError.BAD_REQUEST)
        }
        delete questionDto.publicityStatus;
        return questionDto;
    }
}

