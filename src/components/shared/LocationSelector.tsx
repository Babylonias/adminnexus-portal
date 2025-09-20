import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

/// <reference types="google.maps" />

interface LocationData {
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationSelectorProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  disabled?: boolean;
  className?: string;
}

// Clé API Google Maps (à remplacer par une vraie clé)
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export const LocationSelector = ({ 
  value, 
  onChange, 
  disabled = false, 
  className 
}: LocationSelectorProps) => {
  const [activeTab, setActiveTab] = useState<'map' | 'coordinates'>('map');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState(value?.address || '');
  const [latitude, setLatitude] = useState(value?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(value?.longitude?.toString() || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [useApiKey, setUseApiKey] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  // Initialiser Google Maps
  useEffect(() => {
    if (activeTab === 'map' && !mapLoaded && (GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' || useApiKey)) {
      const loader = new Loader({
        apiKey: useApiKey ? apiKeyInput : GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places'],
      });

      loader.load().then(() => {
        if (mapRef.current) {
          const defaultLocation = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
          
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: value?.latitude && value?.longitude 
              ? { lat: value.latitude, lng: value.longitude }
              : defaultLocation,
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,
          });

          // Ajouter un marqueur si des coordonnées existent
          if (value?.latitude && value?.longitude) {
            markerInstance.current = new google.maps.Marker({
              position: { lat: value.latitude, lng: value.longitude },
              map: mapInstance.current,
              draggable: !disabled,
            });

            if (!disabled) {
              markerInstance.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                  const lat = event.latLng.lat();
                  const lng = event.latLng.lng();
                  
                  // Géocodage inverse pour obtenir l'adresse
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === 'OK' && results?.[0]) {
                      onChange({
                        address: results[0].formatted_address,
                        latitude: lat,
                        longitude: lng,
                      });
                      setAddress(results[0].formatted_address);
                      setLatitude(lat.toString());
                      setLongitude(lng.toString());
                    } else {
                      onChange({
                        address: value?.address,
                        latitude: lat,
                        longitude: lng,
                      });
                      setLatitude(lat.toString());
                      setLongitude(lng.toString());
                    }
                  });
                }
              });
            }
          }

          // Clic sur la carte pour placer un marqueur
          if (!disabled) {
            mapInstance.current.addListener('click', (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                // Supprimer l'ancien marqueur
                if (markerInstance.current) {
                  markerInstance.current.setMap(null);
                }

                // Créer un nouveau marqueur
                markerInstance.current = new google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstance.current,
                  draggable: true,
                });

                // Géocodage inverse
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                  if (status === 'OK' && results?.[0]) {
                    onChange({
                      address: results[0].formatted_address,
                      latitude: lat,
                      longitude: lng,
                    });
                    setAddress(results[0].formatted_address);
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                  } else {
                    onChange({
                      address: value?.address,
                      latitude: lat,
                      longitude: lng,
                    });
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                  }
                });

                // Ajouter l'événement de drag au nouveau marqueur
                markerInstance.current.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
                  if (dragEvent.latLng) {
                    const newLat = dragEvent.latLng.lat();
                    const newLng = dragEvent.latLng.lng();
                    
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
                      if (status === 'OK' && results?.[0]) {
                        onChange({
                          address: results[0].formatted_address,
                          latitude: newLat,
                          longitude: newLng,
                        });
                        setAddress(results[0].formatted_address);
                        setLatitude(newLat.toString());
                        setLongitude(newLng.toString());
                      } else {
                        onChange({
                          address: value?.address,
                          latitude: newLat,
                          longitude: newLng,
                        });
                        setLatitude(newLat.toString());
                        setLongitude(newLng.toString());
                      }
                    });
                  }
                });
              }
            });
          }

          setMapLoaded(true);
        }
      }).catch((error) => {
        console.error('Erreur lors du chargement de Google Maps:', error);
      });
    }
  }, [activeTab, mapLoaded, value, onChange, disabled, apiKeyInput, useApiKey]);

  const handleCoordinateChange = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onChange({
        address: address || value?.address,
        latitude: lat,
        longitude: lng,
      });

      // Mettre à jour la carte si elle est chargée
      if (mapInstance.current && markerInstance.current) {
        const position = { lat, lng };
        mapInstance.current.setCenter(position);
        markerInstance.current.setPosition(position);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          
          onChange({
            address: value?.address,
            latitude: lat,
            longitude: lng,
          });

          // Mettre à jour la carte
          if (mapInstance.current) {
            const pos = { lat, lng };
            mapInstance.current.setCenter(pos);
            
            if (markerInstance.current) {
              markerInstance.current.setPosition(pos);
            } else {
              markerInstance.current = new google.maps.Marker({
                position: pos,
                map: mapInstance.current,
                draggable: !disabled,
              });
            }
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  // Interface pour la clé API si elle n'est pas configurée
  if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' && !useApiKey) {
    return (
      <div className={cn("space-y-4 p-4 border rounded-lg bg-muted/50", className)}>
        <div className="text-center space-y-3">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-medium">Configuration Google Maps</h3>
            <p className="text-sm text-muted-foreground">
              Pour utiliser la sélection par carte, entrez votre clé API Google Maps
            </p>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Clé API Google Maps"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              type="password"
            />
            <Button 
              onClick={() => setUseApiKey(true)}
              disabled={!apiKeyInput.trim()}
              className="w-full"
            >
              Utiliser Google Maps
            </Button>
          </div>
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('coordinates')}
              className="w-full"
            >
              Utiliser les coordonnées manuellement
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label>Localisation</Label>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'map' | 'coordinates')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger value="coordinates" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Coordonnées
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-3">
          <div 
            ref={mapRef} 
            className="w-full h-64 rounded-lg border bg-muted"
          />
          {!disabled && (
            <p className="text-xs text-muted-foreground">
              Cliquez sur la carte ou déplacez le marqueur pour sélectionner une position
            </p>
          )}
          {address && (
            <div className="p-2 bg-muted rounded text-sm">
              <strong>Adresse:</strong> {address}
            </div>
          )}
        </TabsContent>

        <TabsContent value="coordinates" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="ex: 48.8566"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                onBlur={handleCoordinateChange}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="ex: 2.3522"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onBlur={handleCoordinateChange}
                disabled={disabled}
              />
            </div>
          </div>
          
          {!disabled && (
            <Button 
              type="button"
              variant="outline" 
              onClick={getCurrentLocation}
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Utiliser ma position actuelle
            </Button>
          )}

          {address && (
            <div className="space-y-2">
              <Label htmlFor="address">Adresse (optionnelle)</Label>
              <Input
                id="address"
                placeholder="ex: Paris, France"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  onChange({
                    address: e.target.value,
                    latitude: parseFloat(latitude) || value?.latitude,
                    longitude: parseFloat(longitude) || value?.longitude,
                  });
                }}
                disabled={disabled}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};