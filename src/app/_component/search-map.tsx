"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
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

const SearchMap = ({ children }: Props) => {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

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
      {children}
    </div>
  );
};

export default SearchMap;
