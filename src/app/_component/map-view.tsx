"use client";

import React, { useState, useRef, useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading maps</div>;
  return <div>Map Loaded</div>;
};

interface FormData {
  place: string;
  description: string;
}

const postPost = async (formData: FormData, file: File) => {
  const data = new FormData();
  data.append("location", formData.place);
  data.append("description", formData.description);
  data.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/post?filename=${file.name}`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to post post");
  }
  return res.json();
};

const SearchBox: React.FC<{}> = () => {
  const placeRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const initAutocomplete = async () => {
      if (
        placeRef.current &&
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          placeRef.current,
          {
            types: ["establishment"],
            componentRestrictions: { country: "jp" },
            fields: ["name", "geometry"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          if (place.name) {
            if (placeRef.current) {
              placeRef.current.value = place.name;
            }
            setValue("place", place.name);
          }
        });

        // 入力フィールドの値が変更されたときのイベントリスナーを追加
        placeRef.current.addEventListener("input", () => {
          setValue("place", placeRef.current?.value || "");
        });
      }
    };

    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, [setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedImage) {
      toast.error("画像を選択してください");
      return;
    }
    toast.loading("追加しています...", { id: "postPost" });

    try {
      await postPost(data, selectedImage);

      router.refresh();
      toast.success("追加しました", { id: "postPost" });
    } catch (error) {
      console.error("Error posting post:", error);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    handleSubmit(onSubmit)(); // フォーム送信を手動で実行
  };

  return (
    <div className="my-2 text-sm space-y-2 p-1">
      <label>↓場所を追加する↓</label>
      <div className="flex align-center items-center">
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="登録名"
          {...register("place", { required: true })}
          ref={placeRef}
        />
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="説明"
          {...register("description")}
        />
      </div>
      <div className="flex  align-center items-center">
        <input type="file" onChange={handleImageChange} />
        <button
          type="button"
          className="border p-1"
          onClick={handleButtonClick}
        >
          追加
        </button>
      </div>
    </div>
  );
};

const MapView = () => {
  return (
    <Wrapper
      apiKey={process.env.GOOGLE_MAPS_API_KEY!}
      render={render}
      libraries={["places"]}
    >
      <SearchBox />
    </Wrapper>
  );
};

export default MapView;
