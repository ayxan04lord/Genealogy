import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { collectGraphLocations } from "../data/graphData";
import "./MapPage.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function colorIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div class="map-marker" style="background:${color}"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7],
  });
}

function FitBounds({ locations }) {
  const map = useMap();
  if (locations.length > 0) {
    map.fitBounds(L.latLngBounds(locations.map(l => [l.lat, l.lng])), { padding: [60, 60], maxZoom: 10 });
  }
  return null;
}

export default function MapPage({ forest, activeForestName, onOpenForests }) {
  const locations = useMemo(() => collectGraphLocations(forest), [forest]);

  if (locations.length === 0) {
    return (
      <>
        <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />
        <div className="map-page__empty-wrap">
          <i className="bi bi-geo-alt display-4 text-muted d-block mb-3"></i>
          <p className="text-muted">Heç bir şəxs üçün coğrafi koordinat daxil edilməyib.</p>
          <p className="text-muted small">
            Şəxsləri redaktə edərkən <strong>Enlik (lat)</strong> və <strong>Uzunluq (lng)</strong> sahələrini doldurun.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />
      <div className="map-fullpage">
        <div className="map-page__info">
          <i className="bi bi-geo-alt-fill text-success me-1"></i>
          {locations.length} şəxs üçün coğrafi məlumat mövcuddur —
          <span className="text-muted ms-1 small">Marker-ə klik edərək şəxs məlumatına baxın</span>
        </div>
        <div className="map-page__container">
          <MapContainer center={[40.4, 49.8]} zoom={6} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds locations={locations} />
            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={colorIcon("#1e8449")}>
                <Popup>
                  <div className="map-popup">
                    {loc.photo && <img src={loc.photo} alt={loc.name} className="map-popup__photo" />}
                    <strong>{loc.name}</strong>
                    {loc.yer && <div className="map-popup__yer"><i className="bi bi-geo-alt me-1"></i>{loc.yer}</div>}
                    {(loc.doğum || loc.vəfat) && (
                      <div className="map-popup__dates">
                        <i className="bi bi-calendar3 me-1"></i>
                        {loc.doğum}{loc.vəfat ? ` – ${loc.vəfat}` : ""}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
