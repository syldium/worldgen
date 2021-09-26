import { NavBar } from './ui/NavBar';
import { Route, Switch } from 'react-router-dom';
import { Resource } from './resource/Resource';
import { MainMenu } from './MainMenu';
import { Link } from './ui/Link';
import { ConfiguredFeature } from './resource/ConfiguredFeature';
import { WorldgenNames } from '../model/Registry';
import { NoRouteMatch } from './ui/NoRouteMatch';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

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
          <Link to="/worldgen/biome">Biome</Link>
        </li>
        <li>
          <Link to="/worldgen/configured_feature">Feature</Link>
        </li>
        <li>
          <Link to="/dimension">Dimension</Link>
        </li>
      </ul>
    </NavBar>
    <div className="content">
      <Switch>
        <Route exact path="/">
          <MainMenu />
        </Route>
        {(Object.keys(WorldgenNames) as WorldgenRegistryKey[])
          .filter(
            (key) =>
              key !== 'worldgen/configured_feature' &&
              key !== 'worldgen/configured_structure_feature'
          )
          .map((key) => (
            <Route path={`/${key}/:id?`} key={key}>
              <Resource registryKey={key} key={key} />
            </Route>
          ))}
        <Route path="/worldgen/configured_feature/:id?">
          <ConfiguredFeature />
        </Route>
        <Route path="*">
          <NoRouteMatch />
        </Route>
      </Switch>
    </div>
  </div>
);
