import * as React from "react";
import {Tab} from "./Tab";
import {ReactNode} from "react";

export interface TabbedComponentProps {
    children: ReactNode;
}


export const TabbedComponent  = ({children}: TabbedComponentProps) => {
    const tabs: Tab[] = Array.isArray(children) ? children.filter(x => typeof x === "object" && "type" in x && x.type === Tab) as Tab[] : [];
    const tabKeys = tabs.map(x => x.props.tabKey);
    const [currentTab, setCurrentTab] = React.useState<string>(tabKeys?.[0]);

    const tab = (key: string): Tab => tabs.find(x => x.props.tabKey === key)
    const switchTo = (key: string) => () => setCurrentTab(key);

    return (
        <div className={"shotput-tabs"}>
            <ul className={"shotput-tab-bar"}>
                {tabKeys.map(tabKey => (<li key={tabKey} className={"shotput-tab" + (currentTab === tabKey ? " shotput-is-active" : "")} onClick={switchTo(tabKey)}>
                    { tab(tabKey).props.title }
                </li>))}
            </ul>
            <div className={"shotput-tab-contents"}>
                {tab(currentTab)}
            </div>
        </div>
    )
}
