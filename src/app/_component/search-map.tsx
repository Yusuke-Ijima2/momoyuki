"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  query?: string;
};

interface FormData {
  place: string;
  description: string;
}

const postPost = async ({
  location,
  description,
}: {
  location: string;
  description: string;
}) => {
  const res = await fetch("http://localhost:3000/api/post", {
    method: "POST",
    body: JSON.stringify({ location, description }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to post post");
  }
  return res.json();
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

const AddMap = ({ query }: Props) => {
  const { register, handleSubmit } = useForm<FormData>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const result = await response.json();
      if (result.results.length > 0) {
        const location = result.results[0].geometry.location;
        setLocation({ lat: location.lat, lng: location.lng });
      } else {
        alert("場所が見つかりませんでした");
      }
    };

    fetchData();
  }, [query]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await postPost({
        location: data.place,
        description: data.description,
      });

      toast.success("追加しました", { id: "postPost" });

      router.refresh();
    } catch (error) {
      toast.error("Failed to post post", { id: "postPost" });
      console.error("Error posting post:", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>↓場所を追加する↓</label>
        <div className="space-y-2">
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="場所名"
            {...register("place", { required: true })}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="説明"
            {...register("description")}
          />
          <button type="submit" className="border p-2 ml-2">
            追加
          </button>
        </div>
      </form>
      {location ? (
        <div style={{ width: "100vw", height: "100vh" }}>
          <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            render={render}
          >
            <Map center={location} zoom={18} />
          </Wrapper>
        </div>
      ) : (
        <p>お気に入りの場所を追加してみよう！</p>
      )}
    </div>
  );
};

export default AddMap;
