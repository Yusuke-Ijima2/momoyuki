import Link from "next/link";
import { PostProps } from "../types";
import Image from "next/image";

type Props = {
  post: PostProps;
};

const ViewPostDetail = ({ post }: Props) => {
  return (
    <div key={post.id} className="border p-1 space-y-1">
      <h2 className="font-semibold text-xs line-clamp-1">{post.location}</h2>
      {post.image && (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${post.location}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-full max-h-[300px]"
        >
          <Image
            alt="画像"
            src={post.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              maxHeight: "300px",
            }}
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

      {/* {post.description !== "undefined" ? (
        <p className="text-sm p-1 border"> {post?.description}</p>
      ) : (
        <p className="text-sm p-1 border">なし</p>
      )} */}

      <p className="text-[8px]">by {post.createdBy.name}</p>
      {/* <blockquote className="">
        {new Date(post.createdAt).toDateString()}
      </blockquote> */}
    </div>
  );
};

export default ViewPostDetail;
