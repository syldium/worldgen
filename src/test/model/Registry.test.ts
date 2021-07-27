import { WorldgenRegistry } from '../../main/model/Registry';
import type { Model } from '../../main/model/Model';
import type { Option } from '../../main/component/ui/Select';
import { customOption, labelizeOption } from '../../main/util/LabelHelper';

const emptyModel: Model = {
  node: {},
  preset: () => ({})
};
const key = 'key:resource';
const key2 = 'key:2';
const option = customOption(key);
const option2 = customOption(key2);
const schema = { version: 1 };
const vanilla = () => [key, key2, 'key:3'].map(labelizeOption);
const sort = (a: Option, b: Option) => a.value.localeCompare(b.value);

describe('Registry', function () {
  it('should create an entry and a option', () => {
    const vanilla: Option[] = [];
    const registry = new WorldgenRegistry(emptyModel, vanilla);
    registry.register(key, schema);

    expect(registry.entries[key]).toBe(schema);
    expect(registry.options).toEqual([option]);
    expect(registry.vanilla).toBe(vanilla);
  });

  it('should create an entry and rename the option only in the global options array', () => {
    const vanilla: Option[] = [key].map(labelizeOption);
    const registry = new WorldgenRegistry(emptyModel, vanilla);
    registry.register(key, schema);

    expect(registry.entries[key]).toBe(schema);
    expect(registry.options).toEqual([option]);
    expect(registry.vanilla).toBe(vanilla);
  });

  it('should update the existing entry', () => {
    const registry = new WorldgenRegistry(emptyModel);
    registry.register(key, schema);
    expect(registry.entries[key]).toBe(schema);

    const v2 = { version: 2 };
    registry.register(key, v2);
    expect(registry.entries[key]).toBe(v2);
    expect(registry.options).toEqual([option]);
  });

  it('should remove the entry and the option', () => {
    const registry = new WorldgenRegistry(emptyModel);
    registry.register(key, schema);
    registry.remove(key);

    expect(registry.entries).not.toHaveProperty(key);
    expect(registry.options).toEqual([]);
  });

  it('should remove the schema and keep the vanilla option', () => {
    const registry = new WorldgenRegistry(emptyModel, vanilla());
    registry.register(key, schema);
    registry.remove(key);

    expect(registry.entries).not.toHaveProperty(key);
    expect(registry.options.sort(sort)).toEqual(vanilla().sort(sort));
  });

  it("shouldn't remove the vanilla option", () => {
    const registry = new WorldgenRegistry(emptyModel, vanilla());
    registry.remove(key);
    expect(registry.options).toEqual(vanilla());
    expect(registry.vanilla).toEqual(vanilla());
  });

  it('should add vanilla options without duplication', () => {
    const original = new WorldgenRegistry(emptyModel, vanilla());
    const target = new WorldgenRegistry(emptyModel, [key2].map(labelizeOption));
    target.register(key, schema);
    target.withVanilla(original);
    expect(target.vanilla.sort(sort)).toEqual(vanilla().sort(sort));
    expect(target.options).toEqual([
      labelizeOption(key2),
      option,
      labelizeOption('key:3')
    ]);
  });

  it('should merge registries', () => {
    const original = new WorldgenRegistry(emptyModel);
    original.register(key, schema);
    const target = new WorldgenRegistry(emptyModel);
    target.register(key2, schema);
    target.merge(original);
    expect(target.entries[key]).toBe(schema);
    expect(target.entries[key2]).toBe(schema);
    expect(target.options).toEqual([option2, option]);
  });
});
