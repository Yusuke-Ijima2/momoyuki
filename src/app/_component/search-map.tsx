"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
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
    `${process.env.API_HOST}/api/post?filename=${file.name}`,
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

const SearchMap = ({ children }: Props) => {
  const { register, handleSubmit } = useForm<FormData>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    try {
      const response = await postPost(data, selectedImage);

      toast.success("追加しました", { id: "postPost" });
      console.log("Uploaded image URL:", response.imageUrl);
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
          <input type="file" onChange={handleImageChange} />
          <button type="submit" className="border p-2 ml-2">
            追加
          </button>
        </div>
      </form>
      {children}
    </div>
  );
};

export default SearchMap;
