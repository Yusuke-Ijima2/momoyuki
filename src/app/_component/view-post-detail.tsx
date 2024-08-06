import Link from "next/link";
import { PostProps } from "../types";
import Image from "next/image";

type Props = {
  post: PostProps;
};

const ViewPostDetail = ({ post }: Props) => {
  return (
    <div key={post.id} className="border p-2">
      <h2 className="mr-auto font-semibold">{post.location}</h2>
      {post.image && (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${post.location}`}
        >
          <Image
            alt="画像"
            src={post.image}
            className="w-full sm:w-20 cursor-pointer"
            width={100}
            height={100}
          />
        </Link>
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
