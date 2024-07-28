"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface FormData {
  place: string;
}

const SearchMap = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${data.place}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const result = await response.json();

    if (result.results.length > 0) {
      const location = result.results[0].geometry.location;
      setLocation({ lat: location.lat, lng: location.lng });
    } else {
      alert("場所が見つかりませんでした");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center gap-x-2">
          <label>場所を検索</label>
          <input
            className="p-2 border rounded"
            type="text"
            {...register("place", { required: true })}
          />
          <button type="submit" className="border p-2">
            検索
          </button>
        </div>
      </form>
      {location ? (
        <div style={{ width: "100%", height: "100%" }}>
          <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            render={render}
          >
            <Map center={location} zoom={10} />
          </Wrapper>
        </div>
      ) : (
        <p>お気に入りの場所を検索してみよう！</p>
      )}
    </div>
  );
};

export default SearchMap;

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
