import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

export default class AnonymousHeader extends React.Component {

    render() {

        let header =
                <nav className="navbar navbar-custom navbar-fixed-top" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                    data-target=".navbar-ex1-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">CTDEC</a>
                        </div>
                        <div className="collapse navbar-collapse navbar-ex1-collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="/login">Se connecter</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>


        return header;
    }
}
