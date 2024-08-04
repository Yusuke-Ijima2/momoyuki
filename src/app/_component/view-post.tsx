import { PostProps } from "../types";
import ViewPostDetail from "./view-post-detail";

async function fetchPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/post`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

const ViewPost = async () => {
  const posts = await fetchPosts();

  console.log(posts);

  return (
    <div className="grid grid-cols-3">
      {posts.map((post: PostProps) => (
        <ViewPostDetail key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ViewPost;
