import { PostProps, UpdatePostParams } from "../types";
import ViewPostDetail from "./view-post-detail";

async function fetchPosts() {
  const res = await fetch("http://localhost:3000/api/post", {
    cache: "no-store",
  });

  const data = await res.json();

  return data.posts;
}

const updatePost = async (data: UpdatePostParams) => {
  const res = fetch(`http://localhost:3000/api/post/${data.id}`, {
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

const deletePost = async (id: number) => {
  const res = fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res).json();
};

const ViewPost = async () => {
  const posts = await fetchPosts();

  return (
    <div className="grid grid-cols-3">
      {posts.map((post: PostProps) => (
        <ViewPostDetail key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ViewPost;
