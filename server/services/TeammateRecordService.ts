import {BaseService} from "./BaseService";
import {ITeammateRecordRepository} from "../repositories/TeammateRecordRepository";
import {TeammateRecordDto} from "../dtos/rating/TeamateDto";
import {TeammateRecord} from "../models/TeammateRecord";
import {SearchTeammateDto} from "../dtos/rating/SearchTeammateDto";
import {User} from "../models/User";
import {TeammateRatingDto} from "../dtos/rating/TeammateRatingDto";
import {TeammatePreviewDto} from "../dtos/rating/TeammatePreviewDto";
import {AppError} from "../errors/AppError";
import {ClientError, HttpStatus} from "../errors/HttpStatus";

export interface ITeammateRecordService {
    createTeammateRecordRepo (teammateRecord: TeammateRecordDto, currentUser?: User): Promise<TeammateRecordDto>;

    getRecentTeammateRecordPreview (currentUser?: User): Promise<TeammatePreviewDto[]>;

    addRating(teammateRatingDto: TeammateRatingDto, teammateRatingId: string, currentUser: User): Promise<TeammateRecordDto>;

    editRating(teammateRatingDto: TeammateRatingDto, teammateRatingId: string, currentUser: User): Promise<TeammateRecordDto>;

    // static createTeammateRecord="/create-teammate-record";
    // static getTeammateRecordPreview="/get-teammate-previews";
    // static getTeammateRecord="/get-teammate-record/:id";
    // static addRating="/add-teammate-rating";
    // static editRating="/edit-teammate-rating";
}

export class TeammateRecordService extends BaseService implements ITeammateRecordService {
    constructor(private teammateRecordRepo: ITeammateRecordRepository) {
        super();
    }

    createTeammateRecordRepo(teammateRecord: TeammateRecordDto): Promise<TeammateRecordDto> {
        const record = new TeammateRecord(
            teammateRecord.firstName,
            teammateRecord.lastName,
            teammateRecord.description,
            teammateRecord.city,
            teammateRecord.university,
            teammateRecord.year
        );
        return this.teammateRecordRepo.create(record);
    }

    searchTeammateRecord(teammateSearchOption: SearchTeammateDto, currentUser?: User): Promise<TeammateRecordDto[]> {
        let searchOptions: any = {
            $and: [
                {firstName: {$regex: teammateSearchOption.firstName, options: "i"}}
            ]
        };
        if (teammateSearchOption.lastName) {
            searchOptions.$and.push(
                {lastName: {$regex: teammateSearchOption.lastName, options: "i"}}
            );
        }
        if (teammateSearchOption.university) {
            searchOptions.$and.push(
                {university: teammateSearchOption.university._id}
            );
        }
        if (teammateSearchOption.city) {
            searchOptions.$and.push(
                {city: teammateSearchOption.city}
            );
        }
        return this.teammateRecordRepo.searchRecord(searchOptions).then((list: TeammateRecord[]) => {
            return this.sortRecordByRelevency(list);
        });
    }

    getRecentTeammateRecordPreview(currentUser?: User): Promise<TeammatePreviewDto[]> {
        if (currentUser) {
            // TODO sort by user preference
        }
        return this.teammateRecordRepo.getAll({sort: "-createdAt"}).then((teammates: TeammateRecord[]) => {

            return teammates.map((teammate) => {
                let sum = 0;
                for (let rating of teammate.ratings) {
                    sum += rating.rating;
                }
                let avgRating = sum / teammate.ratings.length;
                return {
                    firstName: teammate.firstName,
                    lastName: teammate.lastName,
                    averageRating: avgRating,
                    university: teammate.university,
                    city: teammate.city
                }

            });
        })
    }

    addRating(teammateRatingDto: TeammateRatingDto, teammateRatingId: string, currentUser: User): Promise<TeammateRecordDto> {
        return this.teammateRecordRepo.getById(teammateRatingId).then((teammate: TeammateRecord) => {
            const now = new Date(Date.now());
            teammateRatingDto.createdAt = now;
            teammateRatingDto.upDatedAt = now;
            teammateRatingDto.createdBy = currentUser;
            teammate.ratings.push(teammateRatingDto);
            return this.teammateRecordRepo.update(teammate);
        });
    }

    editRating(teammateRatingDto: TeammateRatingDto, teammateRatingId: string, currentUser: User): Promise<TeammateRecordDto> {
        return this.teammateRecordRepo.getById(teammateRatingId).then((teammate: TeammateRecord) => {
            const now = new Date(Date.now());
            teammateRatingDto.createdAt = now;
            teammateRatingDto.upDatedAt = now;
            teammateRatingDto.createdBy = currentUser;
            let found = false;
            for (let rating of teammate.ratings){
                if (rating._id.toString() === teammateRatingDto._id &&
                    rating.createdBy._id.toString() === currentUser._id.toString()) {
                    rating =  teammateRatingDto;
                    found = true;
                    break;
                }
            }
            if (!found){
                throw new AppError("The specified rating does not exist.", ClientError.BAD_REQUEST);
            }
            return this.teammateRecordRepo.update(teammate);
        });
    }


    sortRecordByRelevency(list: TeammateRecord[]): TeammateRecord[] {
        return list;
    }

}