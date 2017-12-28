import React from 'react';
import Relay from 'react-relay';
import Header from './AnonymousHeader';

class AnonymousApp extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
    }

    render() {

        return (
            <div>
                <Header />
                <div className="content min-height">
                    <div className="container">
                        {this.props.children}
                    </div>
                </div>
            </div>);
    }

}

export default Relay.createContainer(AnonymousApp, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                id
              }
    `,
    },
});
