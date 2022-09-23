import React, {useMemo, useEffect} from 'react';
import ReactDom from 'react-dom';

const portalContainer = (() => {
    const portalContainerId = 'portal-container';
    if(!document.getElementById(portalContainerId)) {
        const div = document.createElement('div');
        div.id = portalContainerId;
        document.body.appendChild(div);
    }
    return document.getElementById(portalContainerId);
})();

// const Portals = props => {
//     const el = useMemo(()=> document.createElement('div'), []);

//     useEffect(() => {
//         portalContainer.appendChild(el);
//         return () => {
//             portalContainer.removeChild(el);
//         }
//     }, []);

//     return ReactDom.createPortal(
//         props.children,
//         el
//     )
// }

class Portals extends React.Component{
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        portalContainer.appendChild(this.el);
    }

    componentWillUnmount() {
        portalContainer.removeChild(this.el);
    }

    render() {
        return ReactDom.createPortal(
            this.props.children,
            this.el
        )
    }
}

const propsComparison = (prevProps, nextProps) => prevProps.id === nextProps.id;
export default React.memo(Portals, propsComparison);