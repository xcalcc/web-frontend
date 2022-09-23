import {Component} from 'react';
import ReactDOM from 'react-dom';

class TooltipsContainer_deprecated extends Component {

  render() {
    return ReactDOM.createPortal(
        this.props.children,
        document.getElementById('tooltips-container')
    );
  }
}

export default TooltipsContainer_deprecated;