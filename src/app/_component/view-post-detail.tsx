"use client";

import Link from "next/link";
import { PostProps } from "../types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
      {post.image && (
        <Image
          alt="画像"
          src={post.image}
          onClick={() => handleSearch(post.location)}
          className="w-full sm:w-20"
          width={100}
          height={100}
        />
      )}
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
