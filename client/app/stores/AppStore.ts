import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {createLogger} from "redux-logger";
import {AuthReducer, AuthReducerState} from "../reducers/AuthReducer";
import thunkMiddleware from "redux-thunk";
import {QuestionHomeReducer, QuestionHomeReducerState} from "../reducers/QuestionHomeReducer";
import {ErrorReducer, ErrorReducerState} from "../reducers/ErrorReducer";
import {QuestionPageReducer, QuestionPageReducerState} from "../reducers/QuestionPageReducer";
import {QuestionEditorReducer, QuestionEditorReducerState} from "../reducers/QuestionEditorReducer";
import {LocationDataReducer, LocationDataReducerState} from "../reducers/LocationDataReducer";
import {RatingHomeReducer, RatingHomeReducerState} from "../reducers/TammateRatingHomeReducer";
import {RatingPageReducer, RatingPageReducerState} from "../reducers/RatingPageReducer";
import {StoryHomeReducer, StoryHomeReducerState} from "../reducers/StoryHomeReducer";
import {StoryPageReducer, StoryPageReducerState} from "../reducers/StoryPageReducer";

const loggerMiddleware = createLogger();
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

// The state we receive from match state to props
export interface AppStoreState {
    auth: AuthReducerState;
    questionHome: QuestionHomeReducerState;
    errors: ErrorReducerState;
    questionPage: QuestionPageReducerState;
    questionEditorState: QuestionEditorReducerState;
    locationData: LocationDataReducerState;
    ratingHome: RatingHomeReducerState;
    ratingPage: RatingPageReducerState;
    storyHome: StoryHomeReducerState;
    storyPage: StoryPageReducerState;
}

const reducer = combineReducers({
    auth: AuthReducer,
    questionHome: QuestionHomeReducer,
    errors: ErrorReducer,
    questionPage: QuestionPageReducer,
    questionEditorState: QuestionEditorReducer,
    locationData: LocationDataReducer,
    ratingHome: RatingHomeReducer,
    ratingPage: RatingPageReducer,
    storyHome: StoryHomeReducer,
    storyPage: StoryPageReducer
});

export const store = createStore(
    reducer,
    composeEnhancers(
        process.env.NODE_ENV === 'production' ? f => f : applyMiddleware(loggerMiddleware),
        applyMiddleware(thunkMiddleware)
    ));
