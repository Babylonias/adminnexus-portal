import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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

// Composant pour gérer les clics sur la carte
const MapClickHandler = ({
  onLocationSelect,
  disabled
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  disabled: boolean;
}) => {
  useMapEvents({
    click: (e) => {
      if (!disabled) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const LocationSelector = ({
  value,
  onChange,
  disabled = false,
  className
}: LocationSelectorProps) => {
  const [activeTab, setActiveTab] = useState<'map' | 'coordinates'>('map');
  const [address, setAddress] = useState(value?.address || '');
  const [lat, setLat] = useState(value?.lat?.toString() || '');
  const [lng, setLng] = useState(value?.lng?.toString() || '');
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    value?.lat && value?.lng ? [value.lat, value.lng] : null
  );

  // Synchroniser les valeurs quand les props changent
  useEffect(() => {
    if (value) {
      setAddress(value.address || '');
      setLat(value.lat?.toString() || '');
      setLng(value.lng?.toString() || '');

      if (value.lat && value.lng) {
        setMarkerPosition([value.lat, value.lng]);
      }
    }
  }, [value]);

  // Gérer la sélection d'une position sur la carte
  const handleLocationSelect = async (lat: number, lng: number) => {
    setLat(lat.toString());
    setLng(lng.toString());
    setMarkerPosition([lat, lng]);

    // Essayer de récupérer l'adresse via géocodage inverse (Nominatim)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        const newAddress = data.display_name;
        setAddress(newAddress);
        onChange({
          address: newAddress,
          lat,
          lng,
        });
      } else {
        onChange({
          address: address || value?.address,
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      onChange({
        address: address || value?.address,
        lat,
        lng,
      });
    }
  };

  const handleCoordinateChange = () => {
    const latValue = parseFloat(lat);
    const lngValue = parseFloat(lng);

    if (!isNaN(latValue) && !isNaN(lngValue)) {
      setMarkerPosition([latValue, lngValue]);
      onChange({
        address: address || value?.address,
        lat: latValue,
        lng: lngValue,
      });
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
          setMarkerPosition([latValue, lngValue]);

          onChange({
            address: value?.address,
            lat: latValue,
            lng: lngValue,
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };



  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Localisation</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab(activeTab === 'coordinates' ? 'map' : 'coordinates')}
          className="text-xs"
        >
          {activeTab === 'coordinates' ? 'Utiliser la carte' : 'Coordonnées manuelles'}
        </Button>
      </div>

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
          <div className="w-full h-64 rounded-lg border overflow-hidden">
            <MapContainer
              center={markerPosition || [48.8566, 2.3522]} // Paris par défaut
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              key={markerPosition ? `${markerPosition[0]}-${markerPosition[1]}` : 'default'}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={!disabled}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      handleLocationSelect(position.lat, position.lng);
                    },
                  }}
                />
              )}
              <MapClickHandler
                onLocationSelect={handleLocationSelect}
                disabled={disabled}
              />
            </MapContainer>
          </div>
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
                      setMarkerPosition([latValue, lngValue]);
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
                      setMarkerPosition([latValue, lngValue]);
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
        </TabsContent>
      </Tabs>

      {(lat && lng) && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p><strong>Coordonnées:</strong> {lat}, {lng}</p>
          {address && <p><strong>Adresse:</strong> {address}</p>}
        </div>
      )}
    </div>
  );
};