import React, { useContext, MouseEvent } from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, FolderMinus, GitMerge } from 'react-feather';
import { ZipAction } from '../../context/ZipAction';
import { GameContext } from '../../context/GameRegistry';

interface MergeFormProps {
  onCancel: () => void;
  onLoad: (zip: ZipAction) => void;
  zip: ZipAction;
}
export function MergeForm({
  onCancel,
  onLoad,
  zip
}: MergeFormProps): JSX.Element {
  const { worldgen } = useContext(GameContext);
  const conflicts = worldgen.doesConflict(zip.registry);
  const load = function (event: MouseEvent<HTMLButtonElement>, merge: boolean) {
    event.preventDefault();
    if (merge) {
      zip.registry.merge(worldgen);
    }
    onLoad(zip);
  };
  const cancel = function (event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onCancel();
  };

  return (
    <div className="merge">
      <h3>Load datapack</h3>
      <p>Your workplace currently has data. What should be done with it?</p>
      {conflicts > 0 && (
        <p className="alert--warning">
          <AlertTriangle /> There are {conflicts} file conflicts, the merge may
          create an invalid datapack!
        </p>
      )}
      <div className="actions">
        <Button onClick={(e) => load(e, true)}>
          Merge <GitMerge />
        </Button>
        <Button onClick={(e) => load(e, false)} cat="danger">
          Remove <FolderMinus />
        </Button>
        <Button onClick={cancel} cat="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
}