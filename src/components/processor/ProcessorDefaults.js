export const VANILLA_PROCESSORS = [
    'empty',
    'zombie_plains',
    'zombie_savanna',
    'zombie_snowy',
    'zombie_taiga',
    'zombie_desert',
    'mossify_10_percent',
    'mossify_20_percent',
    'mossify_70_percent',
    'street_plains',
    'street_savanna',
    'street_snowy_or_taiga',
    'farm_plains',
    'farm_savanna',
    'farm_snowy',
    'farm_taiga',
    'farm_desert',
    'outpost_rot',
    'bottom_rampart',
    'treasure_rooms',
    'housing',
    'side_wall_degradation',
    'stable_degradation',
    'bastion_generic_degradation',
    'rampart_degradation',
    'entrance_replacement',
    'bridge',
    'roof',
    'high_wall',
    'high_rampart'
].map(processor_list => ({ value: 'minecraft:' + processor_list, label: processor_list }));

export const PROCESSORS_OPTIONS = [
    { value: 'blackstone_replace', label: 'Blackstone replace' },
    { value: 'block_age', label: 'Block age' },
    { value: 'block_ignore', label: 'Block ignore' },
    { value: 'block_rot', label: 'Block rot' },
    { value: 'gravity', label: 'Gravity' },
    { value: 'jigsaw_replacement', label: 'Jigsaw replacement' },
    { value: 'lava_submerged_block', label: 'Lava submerged block' },
    { value: 'nop', label: 'Nop' },
    { value: 'rule', label: 'Rule' }
].map(o => {
    o.value = 'minecraft:' + o.value;
    return o;
});

export const PROCESSOR_RULE_DEFAULTS = {
    output_state: {
        Properties: {
            age: "0"
        },
        Name: "minecraft:potatoes"
    },
    input_predicate: {
        block: "minecraft:wheat",
        probability: 0.2,
        predicate_type: "minecraft:random_block_match"
    },
    location_predicate: {
        predicate_type: "minecraft:always_true"
    }
};
