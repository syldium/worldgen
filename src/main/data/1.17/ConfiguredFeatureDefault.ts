export const DECORATED_FILL_LAYER = {
  config: {
    height: 64,
    state: {
      Name: 'minecraft:green_concrete'
    }
  }
};

export const DECORATED_NO_BONEMEAL_FLOWER = {
  config: {
    feature: {
      config: {
        feature: {
          config: {
            feature: {
              config: {
                feature: {
                  config: {
                    whitelist: [],
                    blacklist: [],
                    tries: 64,
                    state_provider: {
                      state: {
                        Name: 'minecraft:lily_of_the_valley'
                      },
                      type: 'minecraft:simple_state_provider'
                    },
                    block_placer: {
                      type: 'minecraft:simple_block_placer'
                    }
                  },
                  type: 'minecraft:no_bonemeal_flower'
                },
                decorator: {
                  config: {
                    count: {
                      type: 'minecraft:clamped',
                      value: {
                        source: {
                          type: 'minecraft:uniform',
                          value: {
                            min_inclusive: -3,
                            max_inclusive: 1
                          }
                        },
                        min_inclusive: 0,
                        max_inclusive: 1
                      }
                    }
                  },
                  type: 'minecraft:count'
                }
              },
              type: 'minecraft:decorated'
            },
            decorator: {
              config: {},
              type: 'minecraft:spread_32_above'
            }
          },
          type: 'minecraft:decorated'
        },
        decorator: {
          config: {
            outer: {
              config: {},
              type: 'minecraft:square'
            },
            inner: {
              config: {
                heightmap: 'MOTION_BLOCKING'
              },
              type: 'minecraft:heightmap'
            }
          },
          type: 'minecraft:decorated'
        }
      },
      type: 'minecraft:decorated'
    },
    decorator: {
      config: {
        count: 5
      },
      type: 'minecraft:count'
    }
  },
  type: 'minecraft:decorated'
};

export const DECORATED_TREE = {
  config: {
    feature: {
      config: {
        feature: {
          config: {
            decorators: [],
            ignore_vines: true,
            force_dirt: false,
            dirt_provider: {
              state: {
                Name: 'minecraft:dirt'
              },
              type: 'minecraft:simple_state_provider'
            },
            minimum_size: {
              limit: 1,
              lower_size: 0,
              upper_size: 1,
              type: 'minecraft:two_layers_feature_size'
            },
            foliage_provider: {
              state: {
                Properties: {
                  persistent: 'false',
                  distance: '7'
                },
                Name: 'minecraft:oak_leaves'
              },
              type: 'minecraft:simple_state_provider'
            },
            sapling_provider: {
              state: {
                Properties: {
                  stage: '0'
                },
                Name: 'minecraft:oak_sapling'
              },
              type: 'minecraft:simple_state_provider'
            },
            foliage_placer: {
              radius: 2,
              offset: 0,
              height: 3,
              type: 'minecraft:blob_foliage_placer'
            },
            trunk_provider: {
              state: {
                Properties: {
                  axis: 'y'
                },
                Name: 'minecraft:oak_log'
              },
              type: 'minecraft:simple_state_provider'
            },
            trunk_placer: {
              base_height: 4,
              height_rand_a: 2,
              height_rand_b: 0,
              type: 'minecraft:straight_trunk_placer'
            }
          },
          type: 'minecraft:tree'
        },
        decorator: {
          config: {
            outer: {
              config: {},
              type: 'minecraft:square'
            },
            inner: {
              config: {
                outer: {
                  config: {
                    max_water_depth: 0
                  },
                  type: 'minecraft:water_depth_threshold'
                },
                inner: {
                  config: {
                    heightmap: 'OCEAN_FLOOR'
                  },
                  type: 'minecraft:heightmap'
                }
              },
              type: 'minecraft:decorated'
            }
          },
          type: 'minecraft:decorated'
        }
      },
      type: 'minecraft:decorated'
    },
    decorator: {
      config: {
        count: 10,
        extra_chance: 0.1,
        extra_count: 1
      },
      type: 'minecraft:count_extra'
    }
  },
  type: 'minecraft:decorated'
};
