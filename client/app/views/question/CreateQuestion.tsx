import * as React from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from "react-redux";
import {QuestionActions} from "../../actions/QuestionActions";
import {QuestionDto} from "../../../../server/dtos/q&a/QuestionDto";
import {LoginRequiredComponent} from "../../components/LoginRequiredComponent";
import {PublicityStatus} from "../../../../server/enums/PublicityStatus";
import {QuestionDifficulty} from "../../../../server/models/Question";
import {AppStoreState} from "../../stores/AppStore";
import {QuestionCreationDto} from "../../../../server/dtos/q&a/QuestionCreationDto";
import {DifficultyLevel, QuestionEducationLevel} from "../../../../server/enums/QuestionEducationLevel";
let SelectField = require('material-ui/SelectField').default;

export interface CreateQuestionState {
    title: string;
    tags: string[]
    isPublished: boolean;
    content: string;
    publicityStatus: PublicityStatus
    difficulty: QuestionDifficulty
}

class CreateQuestion extends LoginRequiredComponent<any, QuestionCreationDto> {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            tags: [],
            isPublished: false,
            content: '',
            publicityStatus: PublicityStatus.PUBLIC,
            difficulty: {
                educationLevel: QuestionEducationLevel.NOT_SPECIFIED,
                difficultyLevel: DifficultyLevel.NOT_SPECIFIED
            }
        }
    }

    reset = () => {
        this.setState({title: '', content: ''})
    }

    titleChange = (event: any, value: string) => {
        this.setState({title: value});
    }

    contentChange = (event: any) => {
        this.setState({content: event.target.value});
    }

    submit = () => {
        let postReq: QuestionCreationDto = this.state;
        this.props.createQuestion(postReq);
        //
    }

    selectFieldChange = (event: any, index: number, value: any[]) => {
        this.setState({tags: value});
    }

    menuItems = () => {
        return this.props.tags.map((tag: any) => (
            <MenuItem
                key={tag.name}
                value={tag}
                primaryText={tag.folderName}
            />
        ));
    }

    folderMenu = () => {
        if (this.props.tags != undefined) {
            return (
                <SelectField
                    multiple={true}
                    hintText="Select Folders"
                    value={this.state.tags}
                    onChange={this.selectFieldChange}
                    fullWidth={true}>
                    {this.menuItems()}
                </SelectField>
            )
        }
    }

    render() {
        let folderMenu;


        return (
            <div style={{textAlign: 'center'}}>
                <TextField
                    hintText="Title"
                    floatingLabelText="Title"
                    fullWidth={true}
                    value={this.state.title}
                    onChange={this.titleChange}
                />
                <div>{folderMenu}</div>
                <h4 style={{float: 'left'}}>Content :</h4>
                <textarea value={this.state.content} onChange={this.contentChange}
                          style={{minHeight: '400px', width: '100%'}}
                />
                <RaisedButton
                    label="Make Post"
                    onClick={this.submit}
                />
            </div>
        )
    }

}

export const CreateQuestionPage = connect(
    (state: AppStoreState) => ({loggedIn: state.auth.loggedIn}),
    (dispatch) => ({
        createQuestion: (question: QuestionDto) => dispatch(QuestionActions.createQuestion(question))
    })
)(CreateQuestion)