import { useHistory, useParams } from 'react-router-dom';
import React, {
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { GameContext } from '../../context/GameRegistry';
import { Configured } from '../../model/Model';
import { buildDecorated, findDecorators } from '../../util/FeatureHelper';
import { useCrud } from '../../hook/useCrud';
import { NamespacedKey } from '../NamespacedKey';
import { SelectSwitch } from '../NodeElement';
import { SwitchNodeParams } from '../../model/node/SwitchNode';
import { Obj } from '../../util/DomHelper';
import { ConfiguredDecorator } from '../../data/1.17/ConfiguredDecorator';
import { JsonViewer } from '../ui/JsonViewer';
import { Button } from '../ui/Button';
import { Schema, WorldgenRegistryKey } from '../../model/Registry';

export function ConfiguredFeature(): JSX.Element {
  const history = useHistory();
  const { id } = useParams<{ id: 'resource' }>();
  const { worldgen } = useContext(GameContext);
  const registryKey: WorldgenRegistryKey = 'worldgen/configured_feature';
  const registry = worldgen.worldgen[registryKey];
  const entry = registry.entries[id] as Configured;

  const [_decorators, _feature] = useMemo(
    () =>
      findDecorators(
        (entry || registry.model.preset('1.17')) as Configured & Obj
      ),
    [entry, registry.model]
  );

  const [feature, setFeature] = useState<Configured & Obj>(_feature);
  const dispatchDecorators = useCrud<Configured & Obj>(_decorators);
  const decorators = dispatchDecorators.elements;

  const featureModel = registry.model.node as SwitchNodeParams;
  const handlePreset = useCallback(
    function (preset: Obj | Schema) {
      const [decorators, feature] = findDecorators(preset as Configured & Obj);
      setFeature(feature);
      dispatchDecorators.replace(decorators);
    },
    [dispatchDecorators]
  );
  const handleFeatureTypeChange = useCallback(
    function (type: string) {
      const preset = featureModel.preset[type];
      const immediate = { config: {}, type };
      if (preset) {
        if (typeof preset === 'string') {
          worldgen
            .vanillaResource(registryKey, preset, immediate, handlePreset)
            .then(handlePreset);
        } else {
          handlePreset(preset);
        }
      } else {
        console.warn(`No preset has been found for ${type}.`);
        setFeature(immediate);
      }
    },
    [featureModel.preset, handlePreset, worldgen]
  );

  const handleDecoratorChange = useCallback(
    function (values: Record<string, unknown>) {
      const index = parseInt(Object.keys(values)[0]);
      dispatchDecorators.update(values[index] as Obj & Configured, index);
    },
    [dispatchDecorators]
  );

  const handleVanillaSelect = useCallback(
    function (configured_feature) {
      const [decorators, feature] = findDecorators(configured_feature);
      setFeature(feature);
      dispatchDecorators.replace(decorators);
    },
    [dispatchDecorators]
  );

  const handleSubmit = useCallback(
    function (e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const key = (document.querySelector('[name=key]') as HTMLInputElement)
        .value;
      registry.register(key, buildDecorated(feature, decorators));
      history.push('/');
    },
    [decorators, feature, history, registry]
  );

  return (
    <form onSubmit={handleSubmit}>
      <NamespacedKey
        registry="worldgen/configured_feature"
        onSelectLoad={handleVanillaSelect}
      >
        <JsonViewer data={() => buildDecorated(feature, decorators)} />
      </NamespacedKey>
      <div className="form-group">
        <SelectSwitch
          name="feature"
          node={featureModel}
          value={feature}
          onChange={setFeature as (feature: Obj) => void}
          onTypeChange={handleFeatureTypeChange}
        />
      </div>
      <button onClick={dispatchDecorators.create}>Add decorator</button>
      {decorators.map((decorator, i) => (
        <SelectSwitch
          name={i.toString()}
          node={ConfiguredDecorator.node as SwitchNodeParams}
          value={decorators as Record<number, Obj>}
          onChange={handleDecoratorChange}
          key={decorator.__reactKey}
          isObject={true}
        />
      ))}
      <Button>Save</Button>
    </form>
  );
}
