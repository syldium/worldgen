import {
  Control,
  ControlOptions,
  CRS,
  DomUtil,
  LeafletMouseEvent,
  Map,
  map
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { useBiomeColors } from '../../hook/useBiomeColors';
import {
  bgrCanvasToHexColor,
  hexColorToBgrCanvas
} from '../../util/ColorHelper';
import { debounce } from '../../util/debounce';
import { voidReturn } from '../../util/DomHelper';
import { BiomeSourceMapLayer } from '../../viewer/biome/BiomeSourceMapLayer';
import { ViewableBiomeSource } from '../../viewer/biome/types';
import { ViewerProps } from './Viewers';

type AskBiome = (
  x: number,
  z: number,
  callback: (biome: string) => void
) => void;
class MousePosition extends Control {
  private div?: HTMLElement;
  private readonly askBiome: AskBiome;
  private x = 0;
  private z = 0;
  private biome = '';

  constructor(askBiome: AskBiome, options?: ControlOptions) {
    super(options);
    this.askBiome = debounce(askBiome);
  }

  onMove({ latlng }: LeafletMouseEvent): void {
    this.x = Math.floor(latlng.lng * 256);
    this.z = Math.floor(-latlng.lat * 256);
    this.display();
    this.askBiome(this.x, this.z, (biome) => this.display(biome));
  }

  display(biome?: string): void {
    if (biome) {
      if (biome === this.biome) {
        return;
      }
      this.biome = biome;
    }
    this.div!.innerText = `${this.x} ${this.z}\n${this.biome}`;
  }

  onAdd(map: Map): HTMLElement {
    this.div = DomUtil.create(
      'div',
      'custom-panel leaflet-bar leaflet-control-mouseposition'
    );
    map.on({
      mousemove: this.onMove.bind(this)
    });
    return this.div;
  }

  onRemove(map: Map): void {
    map.off('mousemove', this.onMove);
  }
}

export interface BiomeSourceMapProps extends ViewerProps {
  value: ViewableBiomeSource;
}
const BiomeSourceMap = memo(function BiomeSourceMap ({
  value
}: BiomeSourceMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<BiomeSourceMapLayer>();
  const [colors, setColor] = useBiomeColors(value);

  useEffect(() => {
    if (divRef.current) {
      const m = map(divRef.current, {
        crs: CRS.Simple,
        center: [0, 0],
        zoom: 5,
        maxZoom: 10
      });
      const l = new BiomeSourceMapLayer(3).addTo(m);
      layerRef.current = l;
      new MousePosition(l.getBiomeAt.bind(l)).addTo(m);
      return voidReturn(() => m.remove());
    }
  }, []);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setSettings(value, colors);
      layerRef.current.redraw();
    }
  }, [colors, value]);

  return (
    <div className="biome-map">
      <div ref={divRef} />
      <ul>
        {Object.entries(colors).map(([biomeKey, color]) => (
          <BiomeColor
            key={biomeKey}
            biome={biomeKey}
            bgr={color}
            onChange={setColor}
          />
        ))}
      </ul>
    </div>
  );
});

interface BiomeColorProps {
  biome: string;
  bgr: number;
  onChange: (biome: string, bgr: number) => void;
}
function BiomeColor({ biome, bgr, onChange }: BiomeColorProps) {
  const debounced = useMemo(() => debounce(onChange, 500), [onChange]);

  const id = 'color-' + biome;
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      debounced(biome, hexColorToBgrCanvas(event.target.value)),
    [biome, debounced]
  );
  return (
    <li>
      <input
        type="color"
        value={bgrCanvasToHexColor(bgr)}
        onChange={handleChange}
        id={id}
      />
      <label htmlFor={id}>{biome}</label>
    </li>
  );
}

export default BiomeSourceMap;
