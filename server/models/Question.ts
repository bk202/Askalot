import {model, Schema, Document} from "mongoose";
import {BaseModel} from './BaseModel';
import {User} from './User';
import {PublicityStatus} from "../enums/PublicityStatus";
import {DifficultyLevel, QuestionEducationLevel} from "../enums/QuestionEducationLevel";
import {listNumericalEnumValues} from "../utils/EnumsUtil";

export class QuestionComment {
    commentBy: User;
    commentContent: string;
    lastEditedUtc: Date;

    constructor(user: User, content: string) {
        this.commentBy = user;
        this.commentContent = content;
    }
}

export interface QuestionDifficulty {
    educationLevel: QuestionEducationLevel;
    difficultyLevel: DifficultyLevel;
}

export class Question extends BaseModel {
    title: string;
    content: string;
    author: any;
    tags: any[];
    upVotes: number;
    downVotes: number;
    isPublished: boolean;
    lastEditedUtc: Date;
    createdUtc: Date;
    comments: QuestionComment[];
    publicityStatus: PublicityStatus;
    difficulty: QuestionDifficulty;

    constructor(title: string, content: string, author: User | string, tags: any[],
                isPublished?: boolean, publicityStatus?: PublicityStatus,
                difficulty?: QuestionDifficulty) {
        super();
        this.title = title;
        this.content = content;
        this.author = author;
        this.tags = tags;
        this.isPublished = isPublished ? isPublished : false;
        this.publicityStatus = publicityStatus ? publicityStatus : PublicityStatus.PUBLIC;
        this.difficulty = difficulty;
    }
}


export interface IQuestion extends Question, Document {

}

const schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'tag'}],
    isPublished: {type: Boolean, default: false},
    upVotes: {type: Number, default: 0},
    downVotes: {type: Number, default: 0},
    resolved: {type: Boolean, default: false},
    lastEditedUtc: {type: Date, default: Date.now},
    createdUtc: {type: Date, default: Date.now},
    publicityStatus: {
        type: String,
        enum: Object.keys(PublicityStatus)
    },
    difficulty: {
        educationLevel: {
            type: String,
            enum: Object.keys(QuestionEducationLevel),
            default: QuestionEducationLevel.NOT_SPECIFIED
        },
        difficultyLevel: {
            type: Number,
            enum: listNumericalEnumValues(DifficultyLevel),
            default: DifficultyLevel.NOT_SPECIFIED
        }
    },
    uploads: [
        {fileUrl: String}
    ],
    comments: [{
        commentBy: {type: Schema.Types.ObjectId, ref: 'user'},
        commentContent: {type: String, required: true},
        lastEditedUtc: {type: Date, default: Date.now}
    }]
});
export const QuestionModel = model<IQuestion>('question', schema);
