"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

type UpdatePostParams = {
  location: string;
  description: string;
  name: string;
  id: string;
};

const updatePost = async (data: UpdatePostParams) => {
  const res = fetch(`http://localhost:3000/api/post/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({
      location: data.location,
      description: data.description,
      name: data.name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res).json();
};

const getPostById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/post/${id}`);
  const data = await res.json();
  return data.post;
};

const deletePost = async (id: number) => {
  const res = fetch(`http://localhost:3000/api/post/${id}`, {
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
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const nameRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (locationRef.current && descriptionRef.current && nameRef.current) {
      toast.loading("Sending Request 🚀", { id: "1" }); // todo @see https://react-hot-toast.com/docs/toast#:~:text=Prevent%20duplicate%20toasts,%7D)%3B

      try {
        await updatePost({
          location: locationRef.current.value,
          description: descriptionRef.current.value,
          name: nameRef.current.value,
          id: params.id,
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

  const handleDelete = async () => {
    toast.loading("Deleting Post", { id: "2" });
    await deletePost(parseInt(params.id));
    toast.success("Deleted Post", { id: "2" });
  };

  useEffect(() => {
    toast.loading("Fetching Post Details 🚀", { id: "1" });
    getPostById(parseInt(params.id))
      .then((data) => {
        if (locationRef.current && descriptionRef.current && nameRef.current) {
          locationRef.current.value = data.location;
          descriptionRef.current.value = data.description;
          descriptionRef.current.value = data.description;
          nameRef.current.value = data.name;

          toast.success("Fetching Completed", { id: "1" });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error Fetching Post", { id: "1" });
      });
  }, []);

  return (
    <div className="w-full m-auto flex my-4">
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-2xl text-slate-200 font-bold p-3">
          Edit a Wonderful Post 🚀
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={locationRef}
            placeholder="Enter location"
            type="text"
            className="rounded-md px-4 w-full py-2 my-2"
          />
          <textarea
            ref={descriptionRef}
            placeholder="Enter Description"
            className="rounded-md px-4 py-2 w-full my-2"
          ></textarea>
          <textarea
            ref={nameRef}
            placeholder="Enter Name"
            className="rounded-md px-4 py-2 w-full my-2"
          ></textarea>
          <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
            Update
          </button>
          <button
            onClick={handleDelete}
            className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
