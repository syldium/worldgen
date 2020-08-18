export const VANILLA_CARVERS = [
    { value: 'canyon', label: 'Canyon', probability: 0.02 },
    { value: 'cave', label: 'Cave', probability: 0.143 },
    { value: 'nether_cave', label: 'Nether cave', probability: 0.2 },
    { value: 'underwater_canyon', label: 'Underwater canyon', probability: 0.02  },
    { value: 'underwater_cave', label: 'Underwater cave', probability: 0.067 }
].map(option => {
    option.value = 'minecraft:' + option.value;
    return option;
});
