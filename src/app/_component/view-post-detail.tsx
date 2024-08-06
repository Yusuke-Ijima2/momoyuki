import Link from "next/link";
import { PostProps } from "../types";
import Image from "next/image";

type Props = {
  post: PostProps;
};

const ViewPostDetail = ({ post }: Props) => {
  return (
    <div key={post.id} className="border p-1 space-y-2">
      <h2 className="font-semibold text-sm">{post.location}</h2>
      {post.image && (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${post.location}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            alt="画像"
            src={post.image}
            objectFit="contain"
            width={150}
            height={150}
          />
        </Link>
      )}
      <div>
        <Link href={`/post/edit/${post.id}`} className="underline text-sm">
          編集する
        </Link>
      </div>
      <p className="text-sm p-1 border">{post?.description}</p>
      <p className="text-xs">by {post.createdBy.name}</p>
      {/* <blockquote className="">
        {new Date(post.createdAt).toDateString()}
      </blockquote> */}
    </div>
  );
};

export default ViewPostDetail;
