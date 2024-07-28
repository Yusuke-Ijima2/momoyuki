"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface FormData {
  place: string;
}

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

const Home: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral>({
    lat: 35.68238,
    lng: 139.76556,
  });
  const [submittedText, setSubmittedText] = useState<string>("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${data.place}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const result = await response.json();
    console.log(result);

    if (result.results.length > 0) {
      const location = result.results[0].geometry.location;
      setLocation({ lat: location.lat, lng: location.lng });
      setSubmittedText(data.place);
    } else {
      alert("場所が見つかりませんでした");
    }
  };

  return (
    <div className="">
      <h1>Search Location</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Place:</label>
          <input type="text" {...register("place", { required: true })} />
        </div>
        <button type="submit">Search</button>
      </form>
      <div style={{ width: "100%", height: "100vh" }}>
        <Wrapper
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          render={render}
        >
          <Map center={location} zoom={10} />
        </Wrapper>
      </div>
      {submittedText && (
        <div>
          <h2>Submitted Place</h2>
          <p>{submittedText}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
