import {model, Schema, Document} from "mongoose";


export interface Question {
    id : string;
    title: string;
    content: string;
    author: any;
    tags : any;
    groups: any[];
    isPublished : boolean;
    lastEditedUtc : Date;
};

export interface IQuestion extends Question, Document{

}

const schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'tag' }],
    isPublished:  Boolean,
    lastEditedUtc: {type : Date, default: Date.now},
    comments: [{
        commentBy : {type: Schema.Types.ObjectId, ref: 'user'},
        commentContent : {type: String , required: true},
        lastEditedUtc: {type : Date, default: Date.now}
    }]
});
export const QuestionModel = model<IQuestion>('question', schema);
