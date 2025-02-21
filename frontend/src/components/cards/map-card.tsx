import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CardWrapper from './card-wrapper';

// Define custom interface for the Google Maps 3D element
interface GoogleMap3DElement extends HTMLElement {
  ready: () => Promise<void>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': React.DetailedHTMLProps<React.HTMLAttributes<GoogleMap3DElement> & {
        mode?: string;
        center?: string;
        range?: string | number;
        tilt?: string | number;
        heading?: string | number;
      }, GoogleMap3DElement>;
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
  const [mapInitialized, setMapInitialized] = useState(false); // Track initialization state
  const map3DInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        // Get API key from backend
        const { data } = await axios.get('https://journey-genie-v2.onrender.com/api/details');
        const googleMapsApiKey = data.googleMapsApiKey;

        // Create script element if it doesn't exist yet
        if (!scriptRef.current) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&v=alpha&libraries=maps3d`;
          script.async = true;

          // Setup onload handler to initialize rotation
          script.onload = () => {
            console.log('Google Maps script loaded, initializing rotation');
            initializeMapRotation();
            removeAlphaBanner();
          };

          // Add to document
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

          // Access the map element instance
          const mapElement = mapRef.current;

          // Wait for the map to be fully loaded
          if (typeof mapElement.ready === 'function') {
            await mapElement.ready();
          }

          // Store map instance for cleanup
          map3DInstanceRef.current = mapElement;

          // Set map as initialized
          setMapInitialized(true);

          console.log('Map rotation initialized');
        } catch (error) {
          console.error('Error initializing map rotation:', error);
        }
      }, 1500); // Give the map time to initialize
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

    // Cleanup
    return () => {
      // Remove script if it exists
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
        const camera = {
          center: { lat: 49.2791, lng: -122.9202, altitude: 0 },
          tilt: 67,
          range: 2100,
        };

        mapElement.flyCameraAround({
          camera,
          durationMillis: 50000, // Reduced to 50 seconds for smoother experience
          rounds: 1,
        });
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
          center="49.2791, -122.9202" // SFU location
          range="2000"
          tilt="65"
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
