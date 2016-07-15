import React from "react";
import {render} from "react-dom";
import {IndexRoute, Route, Router, hashHistory} from "react-router";
import {Container} from "flux/utils";

import App from "./containers/app";
import ToyList from "./components/toy-list";

import ToyCreate from "./components/toy-create";
import ToyEdit from "./components/toy-edit";
import ToyDetail from "./components/toy-detail";
import Config from "./components/config";

const routes = <Router history={hashHistory}>
        <Route path="/" component={Container.create(App)} >
          <IndexRoute component={ToyList} />
          <Route path="/create" component={ToyCreate} />
          <Route path="/config" component={Config} />
          <Route path="/toys/:toyId" component={ToyEdit} />
        </Route>
  </Router>;

render(routes, document.querySelector("#app"));
