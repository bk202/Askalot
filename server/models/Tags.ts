import {model, Schema, Document} from "mongoose";
import {BaseModel} from "./Base/BaseModel";
import * as mongoosastic from "mongoosastic";
import {GetMongoosasticOption} from "../elasticSearch/GetPlugin";
export class Tag extends BaseModel{
    tag: string;
    constructor(tag: string){
        super();
        this.tag = tag;
    }
}

export interface ITag extends Tag, Document {

}

const schema = new Schema({
    tag: {type:String, required: true, unique: true}
});

schema.plugin(mongoosastic, GetMongoosasticOption());

export const TagModel = model<ITag>('tag', schema);