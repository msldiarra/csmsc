import React from 'react';
import {Link} from 'react-router';

export default class Header extends React.Component {

    render() {

        var headerItems = "";

        if (!!this.props.user) {
            headerItems =
                <ul className="nav navbar-nav navbar-right opacity-54">
                    <li data-toggle="collapse" data-target=".navbar-collapse">
                        <Link to="/bureau/add">Ajouter un bureau</Link>
                    </li>
                    <li data-toggle="collapse" data-target=".navbar-collapse">
                        <Link to="/bureau/list">Chercher un bureau</Link>
                    </li>
                    <li><a href="" onClick={this.props.onLogout}>DÉCONNEXION</a></li>
                </ul>
        }


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
                            <a className="navbar-brand opacity-87" href={'/'}>
                                <small>CS-MSC 2018</small>
                            </a>
                        </div>
                        <div className="collapse navbar-collapse navbar-ex1-collapse">
                            {headerItems}
                        </div>
                    </div>
                </nav>


        return header;
    }
}
