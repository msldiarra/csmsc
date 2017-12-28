import Relay from 'react-relay';
import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Redirect from 'react-router/lib/Redirect';
import AuthenticatedApp from '../components/user/AuthenticatedApp';
import Login from '../components/user/Login';
import NewBureau from "../components/user/NewBureau";
import Page404 from "../components/Page404";
import EditBureau from "../components/user/EditBureau";
import BureauList from "../components/user/BureauList";
import MemberList from "../components/user/MemberList";

class RouteHome extends Relay.Route {
    static queries = {
        viewer: (Component, vars) => Relay.QL`
          query {
            viewer(viewerId: $viewerId) {
                 ${Component.getFragment('viewer', vars)}
            }
          }
        `
    };

    static paramDefinitions = {
        viewerId: {required: false},
    };

    static routeName = 'AppHomeRoute';
}

function requireAuth(nextState, replace) {
    if(!JSON.parse(localStorage.getItem('user'))) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

function getParams(params, route){

    let user = JSON.parse(localStorage.getItem('user'))

    return {
        ...params,
        viewerId: (user? user.id : null),
    }
}

export default  <Route>
                    <Route path="/" component={AuthenticatedApp} queries={RouteHome.queries} prepareParams={getParams} >
                        <IndexRoute component={BureauList} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="bureau/new" component={NewBureau} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="bureau/:reference/edit" component={EditBureau} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="bureau/list" component={BureauList} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="bureau/:bureauRef/members" component={MemberList} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                    </Route>
                    <Route path="login" component={Login}  />
                    <Route path="404" component={Page404}  />
                    <Redirect path="*" to="404" />
                </Route>