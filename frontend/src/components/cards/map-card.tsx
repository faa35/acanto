import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CardWrapper from './card-wrapper';

// Define custom interface for the Google Maps 3D element
interface GoogleMap3DElement extends HTMLElement {
  ready: () => Promise<void>;
  flyCameraAround?: (options: {
    camera: { center: { lat: number; lng: number; altitude: number }; tilt: number; range: number };
    durationMillis: number;
    rounds: number;
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

const MapCard = () => {
  const mapRef = useRef<GoogleMap3DElement | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map3DInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        const { data } = await axios.get('https://journey-genie-v2.onrender.com/api/details');
        const googleMapsApiKey = data.googleMapsApiKey;

        if (!scriptRef.current) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&v=alpha&libraries=maps3d`;
          script.async = true;

          script.onload = () => {
            console.log('Google Maps script loaded, initializing rotation');
            initializeMapRotation();
            removeAlphaBanner();
          };

          document.head.appendChild(script);
          scriptRef.current = script;
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    const initializeMapRotation = async () => {
      setTimeout(async () => {
        try {
          if (!window.google || !window.google.maps) {
            console.warn('Google Maps not yet available for rotation setup');
            return;
          }

          if (!mapRef.current) {
            console.warn('Map reference not available');
            return;
          }

          console.log('Setting up map rotation');

          const mapElement = mapRef.current;

          console.log('Map Element Instance:', mapElement); // Debugging log

          if (typeof mapElement.ready === 'function') {
            await mapElement.ready();
          }

          map3DInstanceRef.current = mapElement;
          setMapInitialized(true);

          console.log('Map rotation initialized');
        } catch (error) {
          console.error('Error initializing map rotation:', error);
        }
      }, 1500);
    };

    const removeAlphaBanner = () => {
      setTimeout(() => {
        const banner = document.querySelector('.vAygCK-api-load-alpha-banner');
        if (banner) {
          const dismissButton = banner.querySelector('button[type="button"]') as HTMLButtonElement;
          if (dismissButton) {
            dismissButton.click();
            console.log('Alpha banner dismissed');
          }
        }
      }, 1000);
    };

    loadGoogleMapsScript();

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
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

        console.log("Checking mapElement methods:", mapElement);

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
          rounds: 1,
        });

        console.log("flyCameraAround executed successfully");
      };

      flyCamera();
    }
  }, [mapInitialized]);

  return (
    <CardWrapper>
      <div
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <gmp-map-3d
          ref={mapRef}
          mode="hybrid"
          center="49.2791, -122.9202"
          range="2000" // 2000 meters
          tilt="65" // 65 degrees
          heading="0"
          style={{
            width: '100%',
            height: '100%',
          }}
        ></gmp-map-3d>
      </div>
    </CardWrapper>
  );
};

export default MapCard;
