import * as React from "react";
import {FrontEndQuestionModels} from "../../../models/QuestionModels";
import {CustomLink} from "../../../components/CustomLink";
import {CustomCard} from "../../../components/CardComponent/CardComponent";
import {Routes} from "../../../constants/Routes";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import {isElementWide, sortListToGetSameWidthEachRow} from "../../../utils/WideBoxUtils";
import QuestionPreview = FrontEndQuestionModels.QuestionPreview;
import {convertDateToString} from "../../../utils/DateUtils";

export interface QuestionPreviewCardsComponentProps {
    list: QuestionPreview[];
    label: string;
    trim?: boolean; // if there is a non fully populated trim the bottom row
    maxBlock?: number;
}

interface state {
    width: number;
    height: number;
}

export class QuestionPreviewCardsComponent extends React.Component<QuestionPreviewCardsComponentProps, state> {

    constructor(props) {
        super(props);
        this.state = {width: 0, height: 0};
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    };

    prepareToLink = (id: string, title: string): string => {
        title = encodeURIComponent(title).replace(/%20/g, '-');//title.replace(new RegExp(' ', 'g'), "-");
        return Routes.question_by_id.replace(':id', id).replace(':name', title)
    };

    render() {
        if (!this.props.list) return undefined;
        const bodyMargin = 16;
        let width = this.state.width;
        let n = Math.floor((width - bodyMargin) / (250 + 16));
        n = n > this.props.maxBlock ? this.props.maxBlock: n;
        let list = sortListToGetSameWidthEachRow(this.props.list, n, this.props.trim);
        return (
            <Grid container justify="center">
                <Grid item style={{marginTop: 16, width: n * 266}}>
                    <Typography type="display2" style={{marginBottom: 10}}>{this.props.label}</Typography>
                    <Grid container justify="center">
                        {list.map((e) => (
                            <Grid item key={e.element.title}>
                                <div style={{display: "inline-block"}}>
                                    <CustomLink to={this.prepareToLink(e.element._id, e.element.title)}>
                                        <CustomCard
                                            title={e.element.title}
                                            content={e.element.content}
                                            date={e.element.createdUtc}
                                            wide={n > 1 && e.wide}
                                        />
                                    </CustomLink>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}