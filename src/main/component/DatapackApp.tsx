import { useContext } from 'react';
import { GameContext } from '../context/GameRegistry';
import { Editor } from './Editor';
import { NavLink } from './ui/Link';
import { NavBar } from './ui/NavBar';

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
      {useContext(GameContext).registries ?
        <Editor location={location} /> :
        <p>Loading models…</p>}
    </main>
  </div>
);
