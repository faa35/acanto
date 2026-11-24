import React, { useEffect, useRef, useState } from 'react';
import CardWrapper from './card-wrapper';

// Define custom interface for the Google Maps 3D element
interface GoogleMap3DElement extends HTMLElement {
  ready: () => Promise<void>;
  flyCameraAround?: (options: {
    camera: { center: { lat: number; lng: number; altitude: number }; tilt: number; range: number };
    durationMillis: number;
    repeatCount: number;
  }) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': React.DetailedHTMLProps<
        React.HTMLAttributes<GoogleMap3DElement> & {
          mode?: string;
          center?: string;
          range?: string | number;
          tilt?: string | number;
          heading?: string | number;
        },
        GoogleMap3DElement
      >;
    }
  }

  interface Window {
    google: {
      maps: {
        importLibrary: (library: string) => Promise<any>;
      };
    };
  }
}

// The Maps script must only ever be added to the page once. Adding it again
// (React dev double-mount, or navigating Projects -> Home) re-defines its custom
// elements and the 3D map crashes with "This page didn't load Google Maps correctly".
let mapsScriptPromise: Promise<void> | null = null;

function loadMapsScript(key: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (!mapsScriptPromise) {
    mapsScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=alpha&libraries=maps3d`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        mapsScriptPromise = null;
        script.remove();
        reject(new Error('Google Maps script failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return mapsScriptPromise;
}

const MapCard = () => {
  const mapRef = useRef<GoogleMap3DElement | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // Browser key from env (public by design; restrict it by HTTP referrer in Google Cloud)
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; showing the map placeholder.');
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const initializeMapRotation = () => {
      timers.push(
        setTimeout(async () => {
          try {
            const mapElement = mapRef.current;
            if (cancelled || !window.google?.maps || !mapElement) return;
            if (typeof mapElement.ready === 'function') {
              await mapElement.ready();
            }
            if (!cancelled) setMapInitialized(true);
          } catch (error) {
            console.error('Error initializing map rotation:', error);
          }
        }, 1500)
      );
    };

    const removeAlphaBanner = () => {
      timers.push(
        setTimeout(() => {
          const banner = document.querySelector('.vAygCK-api-load-alpha-banner');
          const dismissButton = banner?.querySelector('button[type="button"]') as HTMLButtonElement | null;
          dismissButton?.click();
        }, 1000)
      );
    };

    loadMapsScript(googleMapsApiKey)
      .then(() => {
        if (cancelled) return;
        initializeMapRotation();
        removeAlphaBanner();
      })
      .catch((error) => console.error('Error loading Google Maps:', error));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (mapInitialized && mapRef.current) {
      const flyCamera = () => {
        const mapElement = mapRef.current;

        if (!mapElement) {
          console.warn("Map element is not available");
          return;
        }

        if (typeof mapElement.flyCameraAround !== "function") {
          console.warn("flyCameraAround method is not available on mapElement");
          return;
        }

        const camera = {
          center: { lat: 49.2791, lng: -122.9202, altitude: 0 },
          tilt: 67, // 67 degrees
          range: 2100, // 2100 meters
        };

        mapElement.flyCameraAround({
          camera,
          durationMillis: 50000, // 50 seconds
          repeatCount: 1,
        });

      };

      flyCamera();
    }
  }, [mapInitialized]);

  return (
    <CardWrapper spotlight={false} className="media-card">
      <div className="relative h-full w-full overflow-hidden rounded-[27px]">
        {/* fallback shown until (or if) the 3D map loads */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--accent-soft),transparent_60%)]">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--grid-line-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-color)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[var(--accent)]" />
            <span className="relative block h-4 w-4 rounded-full border-2 border-white bg-[var(--accent)] shadow-lg" />
          </div>
        </div>

        {/* muted wrapper (a class on the Google custom element itself isn't applied) */}
        <div className="media-muted absolute inset-0">
          <gmp-map-3d
            ref={mapRef}
            mode="hybrid"
            center="49.2791, -122.9202"
            range="2000" // 2000 meters
            tilt="65" // 65 degrees
            heading="0"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          ></gmp-map-3d>
        </div>

        {/* soft vignette + label */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Simon Fraser University · Burnaby
        </div>
      </div>
    </CardWrapper>
  );
};

export default MapCard;
