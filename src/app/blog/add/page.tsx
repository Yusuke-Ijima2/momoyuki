"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";

const postBlog = async ({
  title,
  description,
  name,
}: {
  title: string;
  description: string;
  name: string;
}) => {
  const res = await fetch("http://localhost:3000/api/blog", {
    method: "POST",
    body: JSON.stringify({ title, description, name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to post blog");
  }
  return res.json();
};

const AddBlog = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const nameRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (titleRef.current && descriptionRef.current && nameRef.current) {
      toast.loading("Sending Request 🚀", { id: "1" });

      try {
        await postBlog({
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          name: nameRef.current.value,
        });

        toast.success("Blog Posted Successfully", { id: "1" });

        router.push("/");
        router.refresh();
      } catch (error) {
        toast.error("Failed to post blog", { id: "1" });
        console.error("Error posting blog:", error);
      }
    }
  };

  return (
    <div className="w-full m-auto flex my-4">
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-2xl text-slate-200 font-bold p-3">
          <button onClick={() => signIn()}>ログイン</button>
          <button onClick={() => signOut()}>ログアウト</button>
          Add a Wonderful Blog 🚀
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            placeholder="Enter Title"
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
