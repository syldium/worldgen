import { useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { WorldgenNames } from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { Editor } from './Editor';
import { MainMenu } from './MainMenu';
import { ConfiguredFeature } from './resource/ConfiguredFeature';
import { Resource } from './resource/Resource';
import { NavLink } from './ui/Link';
import { NavBar } from './ui/NavBar';
import { NoRouteMatch } from './ui/NoRouteMatch';

interface DatapackAppProps {
  location: string;
}

export const DatapackApp = ({ location }: DatapackAppProps): JSX.Element => (
  <div>
    <NavBar>
      <ul>
        <li>
          <NavLink href="/">Main</NavLink>
        </li>
        <li>
          <NavLink href="/worldgen/biome">Biome</NavLink>
        </li>
        <li>
          <NavLink href="/worldgen/configured_feature">Feature</NavLink>
        </li>
        <li>
          <NavLink href="/dimension">Dimension</NavLink>
        </li>
      </ul>
    </NavBar>
    <main className="content">
      {useContext(GameContext).worldgen ?
        <Editor location={location} /> :
        <p>Loading models…</p>}
    </main>
  </div>
);
