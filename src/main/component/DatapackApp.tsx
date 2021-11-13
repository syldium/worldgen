import React from 'react';
import { NavBar } from './ui/NavBar';
import { NavLink } from './ui/Link';
import { Editor } from './Editor';

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
      <Editor location={location} />
    </main>
  </div>
);
