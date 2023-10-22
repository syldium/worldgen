# worldgen

An online datapack generator for Minecraft Java Edition 1.19/1.19.4/1.20.2 and custom biomes/dimensions. [Visit the latest version](https://worldgen.syldium.dev).

The `v1` branch is now the default one and replace the old and [initial version](https://github.com/syldium/worldgen/tree/master) [available here](https://master.worldgen.pages.dev).

## Getting started

Customizing the world generation can lead to very different results depending on the settings you choose.
A good introduction is to make small changes to the vanilla generation and observe how it affects the generated world.

### Tweaking an existing biome

In this example, we will tweak the plains vanilla biome. To do this, go to [the homepage of the website](https://worldgen.syldium.dev) linked above and select the "Biome" category in the top navigation bar.
We want to replace the vanilla biome with our biome, so use the "Replace vanilla" button to select a biome to start from.
Now that the vanilla values automatically are filled in, you can change the colors of the biomes.
The sounds can also be changed: enable the sound by checking the checkbox next to the sound you want to add or edit and select a sound. They can also be heard in the game with the `/playsound` command.

### Concepts

Next, you can change what will be generated in the biome below, with what is called "carvers" and "features". Chunk generation follow a specific order:

1. First, determine which biome will be generated (using a biome source).
2. Then determine the shape and the height of the terrain will have (using noise).
3. Next, place the surface blocks of the biome (`surface_rule` in noise settings).
4. Carve the terrain (`carvers` in biome)
5. Place structures. (config of each structure) Theses can be placed manually using the `/place structure` command in Minecraft 1.19.
6. Place decorations like tree, grass, ores... (`features` in biome). Theses can be placed manually using the `/place feature` command in Minecraft 1.19 or the `/placefeature` in 1.18.2.
7. Finally, spawn appropriates mobs (`spawners` in biome).

Each part of the generation have its own configuration that the game rely on.
Configurations are instances of a specific type. For instance, the ocean biome is an instance of a biome, and it's a resource used by one dimension.
Having each part separated allow to reuse the exact same biome in several dimensions. This is the same for features: the same configured tree can be used in several biomes.

Try adding or removing several features. The select input allows you to see which one are already existing in the vanilla game.

### Try it

Save the edited plains biome with the button at the end of the page. On the main page, hit the "Generate" button to download a datapack with your modifications.

Now open the game in the appropriate game version the datapack was generated for. Start creating a new world and in the creation screen, select "Data Packs".
Drag and drop the download .zip file and put the datapack into the "Selected" column. You can set the default game mode and the difficulty as usual.

You are now ready to try it! Create the world and locate your modified plains biome.

If you have created a new dimension, you can teleport to it: `execute in test:my_custom_dimension run tp @s ~ ~ ~`
