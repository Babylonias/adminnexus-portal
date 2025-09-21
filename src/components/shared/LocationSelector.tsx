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
  lat?: number;
  lng?: number;
}

interface LocationSelectorProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  disabled?: boolean;
  className?: string;
}

// Clé API Google Maps depuis les variables d'environnement
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const LocationSelector = ({
  value,
  onChange,
  disabled = false,
  className
}: LocationSelectorProps) => {
  const [activeTab, setActiveTab] = useState<'map' | 'coordinates'>('map');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState(value?.address || '');
  const [lat, setLat] = useState(value?.lat?.toString() || '');
  const [lng, setLng] = useState(value?.lng?.toString() || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [useApiKey, setUseApiKey] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  // Synchroniser les valeurs quand les props changent
  useEffect(() => {
    if (value) {
      console.log('LocationSelector received value:', value); // Debug
      setAddress(value.address || '');
      setLat(value.lat?.toString() || '');
      setLng(value.lng?.toString() || '');

      // Mettre à jour la carte si elle est chargée et qu'on a des coordonnées
      if (mapInstance.current && value.lat && value.lng) {
        const position = { lat: value.lat, lng: value.lng };
        mapInstance.current.setCenter(position);

        // Supprimer l'ancien marqueur s'il existe
        if (markerInstance.current) {
          markerInstance.current.setMap(null);
        }

        // Créer un nouveau marqueur
        markerInstance.current = new google.maps.Marker({
          position: position,
          map: mapInstance.current,
          draggable: !disabled,
        });
      }
    }
  }, [value, disabled]);

  // Initialiser Google Maps
  useEffect(() => {
    if (activeTab === 'map' && !mapLoaded && (GOOGLE_MAPS_API_KEY || useApiKey)) {
      const loader = new Loader({
        apiKey: useApiKey ? apiKeyInput : GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places'],
      });

      loader.load().then(() => {
        if (mapRef.current) {
          const defaultLocation = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut

          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: value?.lat && value?.lng
              ? { lat: value.lat, lng: value.lng }
              : defaultLocation,
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,
          });

          // Ajouter un marqueur si des coordonnées existent
          if (value?.lat && value?.lng) {
            markerInstance.current = new google.maps.Marker({
              position: { lat: value.lat, lng: value.lng },
              map: mapInstance.current,
              draggable: !disabled,
            });

            if (!disabled) {
              markerInstance.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                  const newLat = event.latLng.lat();
                  const newLng = event.latLng.lng();

                  // Géocodage inverse pour obtenir l'adresse
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
                    if (status === 'OK' && results?.[0]) {
                      onChange({
                        address: results[0].formatted_address,
                        lat: newLat,
                        lng: newLng,
                      });
                      setAddress(results[0].formatted_address);
                      setLat(newLat.toString());
                      setLng(newLng.toString());
                    } else {
                      onChange({
                        address: value?.address,
                        lat: newLat,
                        lng: newLng,
                      });
                      setLat(newLat.toString());
                      setLng(newLng.toString());
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
                const clickLat = event.latLng.lat();
                const clickLng = event.latLng.lng();

                // Supprimer l'ancien marqueur
                if (markerInstance.current) {
                  markerInstance.current.setMap(null);
                }

                // Créer un nouveau marqueur
                markerInstance.current = new google.maps.Marker({
                  position: { lat: clickLat, lng: clickLng },
                  map: mapInstance.current,
                  draggable: true,
                });

                // Géocodage inverse
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: clickLat, lng: clickLng } }, (results, status) => {
                  if (status === 'OK' && results?.[0]) {
                    onChange({
                      address: results[0].formatted_address,
                      lat: clickLat,
                      lng: clickLng,
                    });
                    setAddress(results[0].formatted_address);
                    setLat(clickLat.toString());
                    setLng(clickLng.toString());
                  } else {
                    onChange({
                      address: value?.address,
                      lat: clickLat,
                      lng: clickLng,
                    });
                    setLat(clickLat.toString());
                    setLng(clickLng.toString());
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
                          lat: newLat,
                          lng: newLng,
                        });
                        setAddress(results[0].formatted_address);
                        setLat(newLat.toString());
                        setLng(newLng.toString());
                      } else {
                        onChange({
                          address: value?.address,
                          lat: newLat,
                          lng: newLng,
                        });
                        setLat(newLat.toString());
                        setLng(newLng.toString());
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
    const latValue = parseFloat(lat);
    const lngValue = parseFloat(lng);

    if (!isNaN(latValue) && !isNaN(lngValue)) {
      onChange({
        address: address || value?.address,
        lat: latValue,
        lng: lngValue,
      });

      // Mettre à jour la carte si elle est chargée
      if (mapInstance.current) {
        const position = { lat: latValue, lng: lngValue };
        mapInstance.current.setCenter(position);

        // Supprimer l'ancien marqueur s'il existe
        if (markerInstance.current) {
          markerInstance.current.setMap(null);
        }

        // Créer un nouveau marqueur
        markerInstance.current = new google.maps.Marker({
          position: position,
          map: mapInstance.current,
          draggable: !disabled,
        });

        // Ajouter l'événement de drag si pas désactivé
        if (!disabled) {
          markerInstance.current.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
            if (dragEvent.latLng) {
              const newLat = dragEvent.latLng.lat();
              const newLng = dragEvent.latLng.lng();

              setLat(newLat.toString());
              setLng(newLng.toString());

              onChange({
                address: address || value?.address,
                lat: newLat,
                lng: newLng,
              });
            }
          });
        }
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latValue = position.coords.latitude;
          const lngValue = position.coords.longitude;

          setLat(latValue.toString());
          setLng(lngValue.toString());

          onChange({
            address: value?.address,
            lat: latValue,
            lng: lngValue,
          });

          // Mettre à jour la carte
          if (mapInstance.current) {
            const pos = { lat: latValue, lng: lngValue };
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
  if (!GOOGLE_MAPS_API_KEY && !useApiKey && activeTab !== 'coordinates') {
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

  // Interface pour les coordonnées manuelles uniquement
  if (activeTab === 'coordinates' && !GOOGLE_MAPS_API_KEY && !useApiKey) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Label>Localisation (Coordonnées manuelles)</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('map')}
            className="text-xs"
          >
            Retour à la carte
          </Button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                placeholder="ex: 48.8566"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  // Mettre à jour immédiatement si c'est un nombre valide
                  const latValue = parseFloat(e.target.value);
                  const lngValue = parseFloat(lng);
                  if (!isNaN(latValue) && !isNaN(lngValue)) {
                    onChange({
                      address: address || value?.address,
                      lat: latValue,
                      lng: lngValue,
                    });
                  }
                }}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                placeholder="ex: 2.3522"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  // Mettre à jour immédiatement si c'est un nombre valide
                  const latValue = parseFloat(lat);
                  const lngValue = parseFloat(e.target.value);
                  if (!isNaN(latValue) && !isNaN(lngValue)) {
                    onChange({
                      address: address || value?.address,
                      lat: latValue,
                      lng: lngValue,
                    });
                  }
                }}
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
                  lat: parseFloat(lat) || value?.lat,
                  lng: parseFloat(lng) || value?.lng,
                });
              }}
              disabled={disabled}
            />
          </div>

          {(lat && lng) && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p><strong>Coordonnées:</strong> {lat}, {lng}</p>
              {address && <p><strong>Adresse:</strong> {address}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Localisation</Label>
        {(GOOGLE_MAPS_API_KEY || useApiKey) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(activeTab === 'coordinates' ? 'map' : 'coordinates')}
            className="text-xs"
          >
            {activeTab === 'coordinates' ? 'Utiliser la carte' : 'Coordonnées manuelles'}
          </Button>
        )}
      </div>

      {(GOOGLE_MAPS_API_KEY || useApiKey) ? (
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
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    placeholder="ex: 48.8566"
                    value={lat}
                    onChange={(e) => {
                      setLat(e.target.value);
                      // Mettre à jour immédiatement si c'est un nombre valide
                      const latValue = parseFloat(e.target.value);
                      const lngValue = parseFloat(lng);
                      if (!isNaN(latValue) && !isNaN(lngValue)) {
                        onChange({
                          address: address || value?.address,
                          lat: latValue,
                          lng: lngValue,
                        });
                      }
                    }}
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    placeholder="ex: 2.3522"
                    value={lng}
                    onChange={(e) => {
                      setLng(e.target.value);
                      // Mettre à jour immédiatement si c'est un nombre valide
                      const latValue = parseFloat(lat);
                      const lngValue = parseFloat(e.target.value);
                      if (!isNaN(latValue) && !isNaN(lngValue)) {
                        onChange({
                          address: address || value?.address,
                          lat: latValue,
                          lng: lngValue,
                        });
                      }
                    }}
                    disabled={disabled}
                  />
                </div>
              </div>

              {!disabled && (lat || lng) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCoordinateChange}
                  className="w-full"
                  disabled={isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Mettre à jour la position sur la carte
                </Button>
              )}
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
                      lat: parseFloat(lat) || value?.lat,
                      lng: parseFloat(lng) || value?.lng,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        // Interface simplifiée pour coordonnées seulement (quand pas de Google Maps)
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                placeholder="ex: 48.8566"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  const latValue = parseFloat(e.target.value);
                  const lngValue = parseFloat(lng);
                  if (!isNaN(latValue) && !isNaN(lngValue)) {
                    onChange({
                      address: address || value?.address,
                      lat: latValue,
                      lng: lngValue,
                    });
                  }
                }}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                placeholder="ex: 2.3522"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  const latValue = parseFloat(lat);
                  const lngValue = parseFloat(e.target.value);
                  if (!isNaN(latValue) && !isNaN(lngValue)) {
                    onChange({
                      address: address || value?.address,
                      lat: latValue,
                      lng: lngValue,
                    });
                  }
                }}
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
                  lat: parseFloat(lat) || value?.lat,
                  lng: parseFloat(lng) || value?.lng,
                });
              }}
              disabled={disabled}
            />
          </div>

          {(lat && lng) && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p><strong>Coordonnées:</strong> {lat}, {lng}</p>
              {address && <p><strong>Adresse:</strong> {address}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};