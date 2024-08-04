"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

type UpdatePostParams = {
  location: string;
  description: string;
  id: string;
};

const updatePost = async (data: UpdatePostParams) => {
  const res = fetch(`${process.env.API_HOST}/api/post/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({
      location: data.location,
      description: data.description,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res).json();
};

const getPostById = async (id: number) => {
  const res = await fetch(`${process.env.API_HOST}/api/post/${id}`);
  const data = await res.json();
  return data.post;
};

const deletePost = async (id: number) => {
  const res = fetch(`${process.env.API_HOST}/api/post/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res).json();
};

const EditPost = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const locationRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (locationRef.current && descriptionRef.current) {
      try {
        toast.loading("更新中です...", { id: "updatePost" });
        await updatePost({
          location: locationRef.current.value,
          description: descriptionRef.current.value,
          id: params.id,
        });
        toast.success("更新しました", { id: "updatePost" });

        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error posting post:", error);
      }
    }
  };

  const handleDelete = async () => {
    toast.loading("削除中です...", { id: "deletePost" });
    await deletePost(parseInt(params.id));
    toast.success("削除しました", { id: "deletePost" });
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    getPostById(parseInt(params.id))
      .then((data) => {
        if (locationRef.current && descriptionRef.current) {
          locationRef.current.value = data.location;
          descriptionRef.current.value = data.description;
          descriptionRef.current.value = data.description;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  return (
    <div className="w-full m-auto flex my-4">
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-2xl text-slate-200 font-bold p-3">
          Edit a Wonderful Post 🚀
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={locationRef}
            placeholder="場所"
            type="text"
            className="p-2 border rounded"
          />
          <input
            ref={descriptionRef}
            placeholder="説明"
            className="p-2 border rounded"
          />
          <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
            編集
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
          >
            削除
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
