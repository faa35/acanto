



// ***********WITH THE SET TIME OUT***************

import React, { useEffect, useRef } from 'react'; 
import axios from 'axios';
import CardWrapper from "./card-wrapper";

// Declare the global google object to satisfy TypeScript
declare global {
  interface Window {
    google: {
      maps: {
        importLibrary: (library: string) => Promise<any>;
      };
    };
  }
}

const MapCard = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map3DElementRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Use Axios to fetch the Google Maps API key from your backend
        const { data } = await axios.get('http://localhost:8080/api/details');
        const googleMapsApiKey = data.googleMapsApiKey;

        // Dynamically load the Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=maps3d,places,elevation&v=alpha`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = async () => {
          const { Map3DElement } = await window.google.maps.importLibrary("maps3d");
          
          if (mapRef.current) {
            // Create the 3D map element
            const map3DElement = new Map3DElement({
              center: { lat: 49.2767, lng: -122.9192, altitude: 16000000 }, // SFU coordinates
            });
            
            // Clear any existing content and append the new map
            mapRef.current.innerHTML = '';
            mapRef.current.appendChild(map3DElement);
            
            // Store reference to the map element
            map3DElementRef.current = map3DElement;

            // Optional: Add location marker or customize map view
            await showLocation(map3DElement);

            // Fly the camera around the map
            const camera = {
              center: { lat: 49.2791, lng: -122.9202 , altitude: 50},
              tilt: 55,
              range: 2500
            };

            map3DElement.flyCameraAround({
              camera,
              durationMillis: 60000,  // 60 seconds to complete the camera movement
              rounds: 1
            });

            // Delay dismissing the Google Maps API load banner
            setTimeout(removeAlphaBanner, 1); // setTimeout call inside the script.onload method with a delay of 2000 milliseconds (2 seconds)
          }
        };
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    // Function to show specific location with elevation
    const showLocation = async (map3DElement: any) => {
      const { AltitudeMode, Polyline3DElement } = await window.google.maps.importLibrary("maps3d");
      const { ElevationService } = await window.google.maps.importLibrary("elevation");

      const location = { lat: 49.2791, lng: -122.9202 }; // SFU coordinates
      const elevatorService = new ElevationService();

      try {
        const elevationResponse = await elevatorService.getElevationForLocations({
          locations: [location],
        });

        const elevation = elevationResponse.results[0]?.elevation || 10;

        // Create location marker
        const locationPoints = [
          { lat: location.lat, lng: location.lng },
          { lat: location.lat, lng: location.lng },
          { lat: location.lat, lng: location.lng },
          { lat: location.lat, lng: location.lng },
          { lat: location.lat, lng: location.lng }
        ];

        const locationPolyline = new Polyline3DElement({
          altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
          strokeColor: "blue",
          strokeWidth: 10,
          coordinates: locationPoints,
        });

        map3DElement.append(locationPolyline);

        // Configure map view
        map3DElement.center = {
          lat: location.lat,
          lng: location.lng,
          altitude: elevation + 50
        };
        map3DElement.heading = 0;
        map3DElement.range = 2200;  // Zoom level
        map3DElement.tilt = 65;
      } catch (error) {
        console.error('Error getting elevation:', error);
      }
    };

    // Function to remove the Google Maps "API load alpha" banner
    const removeAlphaBanner = () => {
      const banner = document.querySelector('.vAygCK-api-load-alpha-banner');
      if (banner) {
        // Cast the banner's dismiss button to an HTMLButtonElement
        const dismissButton = banner.querySelector('button[type="button"]') as HTMLButtonElement;
        if (dismissButton) {
          // Click the dismiss button
          dismissButton.click();
        }
      }
    };

    loadGoogleMaps();
  }, []);

  return (
    <CardWrapper>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '300px', 
          borderRadius: '1.5rem' 
        }} 
      />
    </CardWrapper>
  );
};

export default MapCard;


