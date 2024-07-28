"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

type Props = {
  center: any;
};

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading maps</div>;
  return <div>Map Loaded</div>;
};

const Map: React.FC<{ center: google.maps.LatLngLiteral; zoom: number }> = ({
  center,
  zoom,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new google.maps.Map(ref.current, {
        center,
        zoom,
      });

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: center,
        map: map,
      });
    }
  }, [center, zoom]);

  return <div ref={ref} style={{ width: "100%", height: "100vh" }} />;
};

const MapView = ({ center }: Props) => {
  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      render={render}
    >
      <Map center={center} zoom={18} />
    </Wrapper>
  );
};

export default MapView;
