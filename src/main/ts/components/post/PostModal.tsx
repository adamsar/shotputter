import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";

export const PostModal = observer(() => {
    const { screenshot, global } = useStores();
    const divRef = React.createRef<HTMLDivElement>();

    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        setWidth(divRef.current?.offsetWidth ?? 0);
        setHeight(divRef.current?.offsetHeight ?? 0);
    });

    const onClose = () => {
        screenshot.setPost(null);
        global.displayMode = "unclicked";
    };

    const posterButtons = screenshot.availablePosters.map(poster => {
        switch (poster.typeName) {
            case "download":
                return <li key={"download"} onClick={() => poster.send(screenshot.post)}>Download -></li>;
        }
    });

    return (
        <>
            <div className={"shotput-modal-background"} onClick={onClose}/>

            <div className={"shotput-modal-box"} style={{top: `calc(50% - ${height}px)`, left: `calc(50% - ${width}px)`}}>
                <h3 style={{textAlign: "left"}}>
                    Screenshot actions
                </h3>
        ***REMOVED***
                    <ul className={"shotput-poster-list"}>
                        {...posterButtons}
***REMOVED***
        ***REMOVED***
                <div className={"shotput-bottom-buttons"}>
                    <span className={"shotput-bottom-button"} onClick={onClose}>Close</span>
        ***REMOVED***
    ***REMOVED***
        </>
    );
});