import * as React from "react";
import {ReactNode} from "react";

export interface TabProps {
    tabKey: string;
    title: string;
    children: ReactNode;
}

export class Tab extends React.PureComponent<TabProps> {
    render() {
        return this.props.children;
    }
}


