"use client";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";

const postPost = async ({
  location,
  description,
}: {
  location: string;
  description: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/post`, {
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

const AddPost = () => {
  const router = useRouter();
  const locationRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (locationRef.current && descriptionRef.current) {
      toast.loading("Sending Request 🚀", { id: "1" });

      try {
        await postPost({
          location: locationRef.current.value,
          description: descriptionRef.current.value,
        });

        toast.success("Post Posted Successfully", { id: "1" });

        router.push("/");
        router.refresh();
      } catch (error) {
        toast.error("Failed to post post", { id: "1" });
        console.error("Error posting post:", error);
      }
    }
  };

  return (
    <div className="w-full m-auto flex my-4">
      <div className="flex flex-col justify-center items-center m-auto">
        <form onSubmit={handleSubmit}>
          <input
            ref={locationRef}
            placeholder="場所"
            type="text"
            className="rounded-md px-4 w-full py-2 my-2 border"
          />
          <textarea
            ref={descriptionRef}
            placeholder="説明"
            className="rounded-md px-4 py-2 w-full my-2 border"
          ></textarea>
          <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
