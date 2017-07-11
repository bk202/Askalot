/**
 * Created by SHELDON on 6/24/2017.
 */
import {ReducerStateStatus} from "../constants/ReducerStateStatus";
import {QuestionActionTypes} from "../constants/QuestionActionTypes";
import {FrontEndQuestionModels} from "../models/QuestionModels";
import QuestionPage = FrontEndQuestionModels.QuestionPage;
import cloneQuestionPage = FrontEndQuestionModels.cloneQuestionPage;

export interface QuestionPageReducerState {
    status: ReducerStateStatus;    // status of the state
    questionPage: QuestionPage;    // main data of the reducer
    lastUpdated: number;            // date to determine if it should fetch again
    error: string;                  // error message to display
}

const initialState: QuestionPageReducerState = {
    status: ReducerStateStatus.LOADING,
    questionPage: undefined,
    lastUpdated: undefined,
    error: ''
};

const getErrorState = (state: QuestionPageReducerState, action: any) => {
    return {
        status: ReducerStateStatus.ERROR,
        questionPage: state.questionPage,
        lastUpdated: state.lastUpdated,
        error: action.data ? action.data : 'An unexpected error has occurred.'
    };
};

const getOKState = (questionPage: QuestionPage) => {
    return {
        status: ReducerStateStatus.DONE,
        questionPage: questionPage,
        lastUpdated: Date.now(),
        error: ''
    };
};

const getLoadingState = (state: QuestionPageReducerState) => {
    return {
        status: ReducerStateStatus.LOADING,
        questionPage: state.questionPage,
        lastUpdated: state.lastUpdated,
        error: ''
    };
};

export const QuestionPageReducer = (state = initialState, action): QuestionPageReducerState => {
    switch (action.type) {

        // Fetch Question Page
        case QuestionActionTypes.FetchQuestionPageRequest:
            return getLoadingState(state);

        case QuestionActionTypes.FetchQuestionPageOK:
            return getOKState(action.data);

        case QuestionActionTypes.FetchQuestionPageError:
            return getErrorState(state, action);


        // Edit Question
        case QuestionActionTypes.EditQuestionRequest:
            return getLoadingState(state);

        case QuestionActionTypes.EditQuestionOK:
            // clone question page so that changing this object wont change the current state
            let questionPage = cloneQuestionPage(state.questionPage);
            questionPage.question = action.data;
            return getOKState(questionPage);

        case QuestionActionTypes.EditQuestionError:
            return getErrorState(state, action);


        // Add Answer
        case QuestionActionTypes.AddAnswerRequest:
            return getLoadingState(state);

        case QuestionActionTypes.AddAnswerOK:
            // clone question page so that changing this object wont change the current state
            let questionPage2 = cloneQuestionPage(state.questionPage);
            questionPage2.answers.push(action.data);
            return getOKState(questionPage2);

        case QuestionActionTypes.AddAnswerError:
            return getErrorState(state, action);


        // Edit Answer
        case QuestionActionTypes.EditAnswerRequest:
            return getLoadingState(state);

        case QuestionActionTypes.EditAnswerOK:
            // clone question page so that changing this object wont change the current state
            let questionPage3 = cloneQuestionPage(state.questionPage);
            questionPage3.answers = questionPage3.answers.map((answer) =>  {
                if (answer._id == action.data._id)
                    return action.data;
                return answer;
            });
            return getOKState(questionPage3);

        case QuestionActionTypes.EditAnswerError:
            return getErrorState(state, action);

        default:
            return state;
    }
};