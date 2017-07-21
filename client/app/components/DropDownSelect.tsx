import * as React from 'react';
import Menu, {MenuItem} from 'material-ui/Menu';
import List, {ListItem, ListItemText} from 'material-ui/List';
import Button from "material-ui/Button";
import Typography from 'material-ui/Typography';
import {CSSProperties} from "react";
interface props {
    data: DropDownSelectData[];
    value: any;
    placeholder?: string;
    onChange?: (element: any) => void;
}

export interface DropDownSelectData {
    text: string;
    value: any;
}

const defaultStyles: CSSProperties = {
    width: 200,
    height: 40,
    justifyContent: "flex-start"
};

interface state {
    anchorEl: any;
    open: boolean;
}

// Temporary component until Material UI finish implementing theirs
export class DropDownSelect extends React.Component<props, state> {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: undefined,
            open: false
        }
    }

    button = undefined;

    componentWillReceiveProps(nextProps){
    }

    handleClick = (event) => {
        this.setState({open: true, anchorEl: this.refs.menuPlaceHolder});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    onSelectValue = (value: any) => {
        if (this.props.onChange)
            this.props.onChange(value);
        this.setState({open: false});
    };

    render() {
        const selected = this.props.data.filter((data) => data.value == this.props.value)[0];
        const placeholder = this.props.placeholder ? this.props.placeholder : "";
        const style = defaultStyles;
        const border: CSSProperties = {borderBottom: "lightgrey 1px solid"};
        return (
            <div style={{margin: "10px 0px"}}>
                {placeholder && selected && <Typography type="caption">{placeholder}</Typography>}
                <div style={{height: style.height}}>
                    <Button style={{...style, ...border, textTransform: "none", paddingLeft: 0, fontWeight: 400}}
                            onClick={this.handleClick}>
                        {selected ? selected.text : "Select " + placeholder}
                    </Button>
                </div>
                <div ref="menuPlaceHolder" style={{height: 0, marginTop: 20, left: -16}} />
                <Menu
                    MenuListProps={{style: {padding: 0}}}
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                >
                    {this.props.data.map((data) => (
                        <MenuItem key={typeof data.value === "object"? data.value._id : data.value}
                                  onClick={() => this.onSelectValue(data.value)} style={style}>
                            {data.text}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }
}