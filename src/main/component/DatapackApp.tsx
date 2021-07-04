import React from 'react';
import { NavBar } from './ui/NavBar';
import { Route, Switch } from 'react-router-dom';
import { Resource } from './resource/Resource';
import { MainMenu } from './MainMenu';
import { Link } from './ui/Link';

export const DatapackApp = (): JSX.Element => (
  <div>
    <NavBar>
      <ul>
        <li>
          <Link exact to="/">
            Main
          </Link>
        </li>
        <li>
          <Link to="/dimension">Dimension</Link>
        </li>
        <li>
          <Link to="/dimension/type">Dimension Type</Link>
        </li>
      </ul>
    </NavBar>
    <div className="content">
      <Switch>
        <Route exact path="/">
          <h2>Datapack</h2>
          <MainMenu />
        </Route>
        <Route path="/dimension/type/:id?">
          <Resource registryKey="dimension_type" key={0} />
        </Route>
        <Route path="/dimension/:id?">
          <Resource registryKey="dimension" key={1} />
        </Route>
      </Switch>
    </div>
  </div>
);
