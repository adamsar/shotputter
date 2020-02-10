import * as React from "react";
import {observer} from "mobx-react-lite";
//import {useStores} from "../../stores";

export const PostModal = observer(() => {
    //const {screenshot, global} = useStores();
    const divRef = React.createRef<HTMLDivElement>();
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        setWidth(divRef.current?.offsetWidth ?? 0);
        setHeight(divRef.current?.offsetHeight ?? 0);
    });


    return (
        <>
            <div className={"shotput-modal-background"}/>
            <div className={"shotput-modal-box"} style={{top: `calc(50% - ${height}px)`, left: `calc(50% - ${width}px)`}}>
                Hello!
    ***REMOVED***
        </>
    );
});