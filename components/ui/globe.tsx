"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import {
  type ThreeElement,
  useFrame,
  useThree,
  Canvas,
  extend,
} from "@react-three/fiber";
import {
  type GlobePoint,
  buildGlobePointsFromArcs,
  filterSafeArcs,
  genRandomNumbers,
  getRingRepeatPeriod,
  pickArcStroke,
} from "./globe-helpers";

extend({ ThreeGlobe });

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElement<typeof ThreeGlobe>;
  }
}

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type CountriesFeatureCollection = {
  type: "FeatureCollection";
  features: object[];
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const [countriesData, setCountriesData] =
    useState<CountriesFeatureCollection | null>(null);
  const [globeData, setGlobeData] = useState<GlobePoint[]>([]);

  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = useMemo(
    () => ({
      pointSize: 0.8,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/data/globe.json", { cache: "force-cache" });
        if (!res.ok) return;
        const json = (await res.json()) as CountriesFeatureCollection;
        if (!cancelled) setCountriesData(json);
      } catch {
        // ignore
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const buildMaterial = useCallback(() => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity || 0.1;
    globeMaterial.shininess = defaultProps.shininess || 0.9;
  }, [
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.globeColor,
    defaultProps.shininess,
  ]);

  const buildData = useCallback(() => {
    setGlobeData(buildGlobePointsFromArcs(data, defaultProps.pointSize));
  }, [data, defaultProps.pointSize]);

  useEffect(() => {
    if (!globeRef.current) return;
    buildData();
    buildMaterial();
  }, [buildData, buildMaterial]);

  const startAnimation = useCallback(() => {
    if (!globeRef.current || globeData.length === 0) return;

    const safeArcs = filterSafeArcs(data);

    globeRef.current
      .arcsData(safeArcs)
      .arcStartLat((d) => (d as { startLat: number }).startLat)
      .arcStartLng((d) => (d as { startLng: number }).startLng)
      .arcEndLat((d) => (d as { endLat: number }).endLat)
      .arcEndLng((d) => (d as { endLng: number }).endLng)
      .arcColor((e: unknown) => (e as { color: string }).color)
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt)
      .arcStroke(pickArcStroke)
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      // IMPORTANT: points require lat/lng. Use the computed globeData points.
      .pointsData(globeData)
      .pointLat((d) => (d as { lat: number }).lat)
      .pointLng((d) => (d as { lng: number }).lng)
      .pointColor((d) => (d as { color: (t: number) => string }).color(0))
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(defaultProps.pointSize);

    globeRef.current
      .ringsData([])
      .ringColor(
        (e: unknown) => (t: number) =>
          (e as { color: (x: number) => string }).color(t),
      )
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        getRingRepeatPeriod(
          defaultProps.arcTime,
          defaultProps.arcLength,
          defaultProps.rings,
        ),
      );
  }, [
    data,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.maxRings,
    defaultProps.pointSize,
    defaultProps.rings,
    globeData,
  ]);

  useEffect(() => {
    if (!globeRef.current || globeData.length === 0 || !countriesData) return;

    globeRef.current
      .hexPolygonsData(countriesData.features || [])
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    startAnimation();
  }, [
    countriesData,
    defaultProps.atmosphereAltitude,
    defaultProps.atmosphereColor,
    defaultProps.polygonColor,
    defaultProps.showAtmosphere,
    globeData,
    startAnimation,
  ]);

  useEffect(() => {
    if (!globeRef.current || globeData.length === 0) return;

    let numbersOfRings: number[] = [0];

    const interval = setInterval(() => {
      if (!globeRef.current || globeData.length === 0) return;
      numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5),
      );

      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i)),
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeData, data.length]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size]);

  return null;
}

function Controls({
  autoRotate,
  autoRotateSpeed,
}: {
  autoRotate: boolean;
  autoRotateSpeed: number;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<{
    update: () => void;
    dispose: () => void;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let localControls: { update: () => void; dispose: () => void } | null =
      null;

    const run = async () => {
      try {
        const mod =
          await import("three/examples/jsm/controls/OrbitControls.js");
        if (cancelled) return;

        const OrbitControlsCtor = (
          mod as unknown as {
            OrbitControls: new (
              cam: typeof camera,
              dom: HTMLElement,
            ) => {
              enablePan: boolean;
              enableZoom: boolean;
              minDistance: number;
              maxDistance: number;
              autoRotate: boolean;
              autoRotateSpeed: number;
              minPolarAngle: number;
              maxPolarAngle: number;
              update: () => void;
              dispose: () => void;
            };
          }
        ).OrbitControls;

        const controls = new OrbitControlsCtor(camera, gl.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minDistance = cameraZ;
        controls.maxDistance = cameraZ;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = autoRotateSpeed;
        controls.minPolarAngle = Math.PI / 3.5;
        controls.maxPolarAngle = Math.PI - Math.PI / 3;

        localControls = controls;
        controlsRef.current = controls;
      } catch {
        // ignore
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (localControls) {
        localControls.dispose();
      }
      if (controlsRef.current === localControls) {
        controlsRef.current = null;
      }
    };
  }, [autoRotate, autoRotateSpeed, camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0xffffff, 400, 2000);
    return s;
  }, []);

  const camera = useMemo(
    () => new PerspectiveCamera(50, aspect, 180, 1800),
    [],
  );

  return (
    <Canvas scene={scene} camera={camera}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <directionalLight
        color={globeConfig.ambientLight}
        position={new Vector3(400, -100, -400)}
        intensity={0.35}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <Controls
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
      />
    </Canvas>
  );
}

// Re-export helpers to preserve any existing import paths.
export { hexToRgb, genRandomNumbers } from "./globe-helpers";
