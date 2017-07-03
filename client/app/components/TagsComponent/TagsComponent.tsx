import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import {Component} from "react";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import {ChipListComponent} from "../ChipListComponent";

export interface TagsSelectorProps {
    tags?: string[]; // used for sugguestions
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}
export interface TagsSelectorState {
     // use for sugguestions
    tag: string;
}
export class TagsSelector extends Component<TagsSelectorProps, TagsSelectorState> {

    constructor(props) {
        super(props);
        this.state = {
            tag : ''
        }
    }

    styles = {
        chip: {
            margin: 4,
        },
        wrapper: {
            display: 'flex',
            flexWrap: 'wrap',
        },
    };

    tagChange = (event) => {
        this.setState({ tag : event.target.value });
    };

    submit = (event) => {
        if (event.key === "Enter"){
            let tags = this.props.selectedTags;
            tags.push(this.state.tag);
            this.props.onChange(tags);
            this.setState({tag: ''});
        }
    };

    test = (array) => {
        this.props.onChange(array)
    }

    render() {
        return (
            <Grid>
                <Grid >
                    <ChipListComponent
                        chips={this.props.selectedTags}
                        handleRequestDelete={this.test}
                        style={this.styles.chip}
                    />
                </Grid>
                <TextField
                    label="Add a Tag"
                    type="text"
                    value={this.state.tag}
                    onChange={this.tagChange}
                    onKeyPress={this.submit}
                />
            </Grid>
        );
    }
}