#!/bin/bash

set -euo pipefail

CACHE_DIR="$HOME/.cache/buildmc"
VERSIONS_CACHE="$CACHE_DIR/versions"
mkdir -p "$VERSIONS_CACHE"
MANIFEST_LOCATION="$HOME/.minecraft/versions/version_manifest_v2.json"
if ! [ -r "$MANIFEST_LOCATION" ]; then
  wget https://piston-meta.mojang.com/mc/game/version_manifest.json -O "$MANIFEST_LOCATION"
fi

GAME_VERSIONS=('1.19.3' '1.19.4' '1.20.2' '1.20.4' '1.21.4')
REGISTRIES=(
  'worldgen/biome'
  'worldgen/configured_carver'
  'worldgen/configured_feature'
  'worldgen/density_function'
  'worldgen/flat_level_generator_preset'
  'worldgen/material_rule'
  'worldgen/multi_noise_biome_source_parameter_list'
  'worldgen/noise'
  'worldgen/noise_settings'
  'worldgen/placed_feature'
  'worldgen/processor_list'
  'worldgen/structure'
  'worldgen/structure_set'
  'worldgen/template_pool'
  'worldgen/world_preset'
  'tags/blocks'
  'tags/worldgen/biome'
  'tags/worldgen/flat_level_generator_preset'
  'tags/worldgen/structure'
  'tags/worldgen/world_preset'
)

mkdir -p {generated,condensed}
for version in "${GAME_VERSIONS[@]}"; do
  echo "Generating $version"
  version_url=$(jq -r ".versions[] | select(.id == \"$version\").url" "$MANIFEST_LOCATION")
  version_file="$VERSIONS_CACHE/$version.json"
  if ! [ -r "$version_file" ]; then
    wget "$version_url" -O "$version_file"
  fi
  server_url=$(jq -r '.downloads.server.url' "$version_file")

  server_file="$VERSIONS_CACHE/server-$version.jar"
  if ! [ -f "$server_file" ]; then
    wget "$server_url" -O "$server_file"
  fi

  java -DbundlerMainClass=net.minecraft.data.Main -jar "$server_file" --server --output generated/"$version"
  for registry in "${REGISTRIES[@]}"; do
    if ! [[ -d generated/"$version"/data/minecraft/"$registry" ]]; then
      continue
    fi
    echo "condensed/$version/${registry}.json"
    mkdir -p "condensed/$version/$(dirname "$registry")"
    (cd generated/"$version"/data/minecraft/"$registry" && find * -type f -name '*.json') | rev | cut -d '.' -f 2- | rev | sort | jq --raw-input --slurp 'split("\n") | map(select(. != ""))' > condensed/$version/${registry}.json
  done
done
