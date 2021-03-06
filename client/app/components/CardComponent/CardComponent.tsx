import * as React from "react";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Card, {CardActions, CardContent} from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import {convertDateTimeToString, convertDateToString} from "../../utils/DateUtils";
import {CSSProperties} from "react";
import Paper from "material-ui/Paper/Paper";
import {PRIMARY_COLOR} from "../../views/router";
import Grid from "material-ui/Grid/Grid";
import {AuthorLink} from "../RoutingComponents/AuthorLink";
import {blueGrey} from "material-ui/colors";

export interface CardComponentProps {
    title: string;
    date: Date;
    authorName?:string;
    content: string;
    onClick?: () => void;
    wide?: boolean;
}

const cardStyle = {
    height: 100,
    overflowY: "hidden",
    position: "relative",
    //background:"linear-gradient(transparent 150px, white)"
    borderBottom: "#eee 1px solid",
    borderRight: "#eee 1px solid",
    // background : "#f9f9f9",

};

const shader: CSSProperties = {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
};

interface state {
    hover: boolean;
}

export class CustomCard extends React.Component<CardComponentProps, state> {

    constructor(props) {
        super(props);
        this.state = {
            hover : false
        }
    }

    render() {
        let width = this.props.wide ? 500 + 16 : 250;
        // account border right
        width--;
        let dateString;
        try {
            dateString = convertDateToString(this.props.date);
        } catch (err) {
            console.error(err);
        }
        return (
            <div
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
            >
                <Paper style={{width: width, ...cardStyle, background: this.state.hover? "#EEE" : "white"}}
                       elevation={0}>
                    {/*<div style={shader}/>*/}
                    <div style={{height: 88, overflowY: "hidden", padding: 5}}>
                        <Typography type="headline" style={{fontSize: 18, fontWeight: 500, lineHeight: "20px"}}>
                            {this.props.title}
                        </Typography>
                        <Grid container spacing={0}>
                            {
                                this.props.authorName &&
                                <Grid item style={{marginRight: 5}}>
                                    <AuthorLink fontSize={12} username={this.props.authorName}/>
                                </Grid>
                            }
                            <Grid item>
                                <Typography type="body1" style={{fontSize: 11}} color="secondary">
                                    {dateString}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography type="body1" paragraph={true} noWrap={true} style={{fontSize: 12}}>
                            {this.props.content}
                        </Typography>
                    </div>
                </Paper>
            </div>
        );
    }
}