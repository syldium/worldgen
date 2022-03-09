import { useCallback, useContext, useMemo, useState } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { CountDecoratorConfig } from '../../data/1.17/ConfiguredDecorator';
import { useCrud } from '../../hook/useCrud';
import { useRegistry } from '../../hook/useRegistry';
import { useResourceSubmit } from '../../hook/useResourceSubmit';
import { Configured, Model } from '../../model/Model';
import { SwitchNodeParams } from '../../model/node/SwitchNode';
import type { Schema } from '../../model/Registry';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';
import { Obj } from '../../util/DomHelper';
import { buildDecorated, findDecorators } from '../../util/FeatureHelper';
import { NamespacedKey } from '../NamespacedKey';
import { ObjectKey, SwitchInput } from '../NodeElement';
import { Button } from '../ui/Button';
import { JsonViewer } from '../ui/JsonViewer';

interface ConfiguredFeatureProps {
  id: string | undefined;
}

export function ConfiguredFeature({ id }: ConfiguredFeatureProps): JSX.Element {
  const worldgen = useContext(GameContext).worldgen!;
  const registryKey: WorldgenRegistryKey = 'worldgen/configured_feature';
  const [registry, previousKey, initial, postLoad] = useRegistry<
    Configured & Obj
  >(registryKey, id);

  const [_decorators, _feature] = useMemo(
    () => findDecorators(initial),
    [initial]
  );

  const hasDecorators = worldgen.packFormat < 8;
  const decoratorNode =
    worldgen.worldgen['worldgen/configured_decorator'].model.node;
  const [feature, setFeature] = useState<Configured & Obj>(_feature);
  const handleFeatureChange = useCallback(
    (name: ObjectKey, value: unknown) => setFeature(value as Configured & Obj),
    []
  );
  const dispatchDecorators = useCrud<Configured & Obj>(
    hasDecorators ? _decorators : [],
    () => ({
      ...(CountDecoratorConfig as Configured & Obj)
    })
  );
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
  postLoad(handlePreset);
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
    (index: ObjectKey, value: unknown) =>
      dispatchDecorators.update(value as Obj & Configured, index as number),
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
  const handleSubmit = useResourceSubmit(
    registryKey,
    previousKey,
    () => buildDecorated(feature, decorators)
  );

  return (
    <form onSubmit={handleSubmit}>
      <NamespacedKey
        registry={registryKey}
        value={previousKey}
        onSelectLoad={handleVanillaSelect}
      >
        <JsonViewer data={() => buildDecorated(feature, decorators)} />
      </NamespacedKey>
      <div className="form-group">
        <SwitchInput
          name="feature"
          node={featureModel}
          value={feature}
          onChange={handleFeatureChange}
          onTypeChange={handleFeatureTypeChange}
        />
      </div>
      {hasDecorators && (
        <fieldset>
          <legend>
            Decorators wrapper{' '}
            <Button onClick={dispatchDecorators.create}>Add decorator</Button>
          </legend>
          {decorators.map((decorator, i) => (
            <SwitchInput
              name={i}
              node={decoratorNode as SwitchNodeParams}
              value={decorator}
              onChange={handleDecoratorChange}
              key={decorator.__reactKey}
            >
              <Button
                cat="danger"
                className="mlm"
                onClick={(e) => dispatchDecorators.remove(i, e)}
              >
                Remove
              </Button>
            </SwitchInput>
          ))}
        </fieldset>
      )}
      <Button>Save</Button>
    </form>
  );
}
