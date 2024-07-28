"use client";

import Link from "next/link";
import { PostProps } from "../types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type Props = {
  post: PostProps;
};

const ViewPostDetail = ({ post }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("location", term);
    } else {
      params.delete("location");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div key={post.id} className="border p-2">
      <h2 className="mr-auto font-semibold">{post.location}</h2>
      <button onClick={() => handleSearch(post.location)}>表示する</button>
      <Link href={`/post/edit/${post.id}`}>編集する</Link>
      <div className="mr-auto">
        <p>{post?.description}</p>
        <p>{post.createdBy.name}</p>
      </div>
      <blockquote className="">
        {new Date(post.createdAt).toDateString()}
      </blockquote>
    </div>
  );
};

export default ViewPostDetail;
