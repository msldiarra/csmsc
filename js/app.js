import 'babel-polyfill';

import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';


import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import Router from 'react-router/lib/Router';
import useRelay from 'react-router-relay';



import useRouterHistory from 'react-router/lib/useRouterHistory';
import createHashHistory from 'history/lib/createHashHistory';
import routes from './routes/AppHomeRoute'

//localStorage.setItem('user', JSON.stringify({login:'fake', company:'test company'}));

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(<Router
    history={appHistory}
    routes={routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
/>, document.getElementById('root'))