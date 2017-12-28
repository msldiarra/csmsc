import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AppMessage extends React.Component {

    render() {

        var text = this.props.message;
        var messageClass = this.props.class == "success" ? "alert alert-success text-center" : "alert alert-danger text-center";


        return (
            <div className="message">
                <div>
                <ReactCSSTransitionGroup transitionName="test" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <div className={messageClass}>
                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                        {text}
                    </div>
                </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
}