import { PostProps } from "../types";
import ViewPostDetail from "./view-post-detail";

async function fetchPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/post`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data.posts;
}

const ViewPost = async () => {
  const posts = await fetchPosts();

  console.log(posts);

  return (
    <div className="grid grid-cols-3">
      {posts.map((post: PostProps) => (
        // <ViewPostDetail key={post.id} post={post} />
        <></>
      ))}
    </div>
  );
};

export default ViewPost;
