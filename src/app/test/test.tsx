// import Image from "next/image";
// import Link from "next/link";
// import { PostProps } from "./types";
// import { getServerSession } from "@/lib/auth";

// async function fetchPosts() {
//   const res = await fetch("${process.env.NEXTAUTH_URL}/api/post", {
//     cache: "no-store",
//   });

//   const data = await res.json();

//   return data.posts;
// }

// export default async function Home() {
//   const posts = await fetchPosts();
//   const session = await getServerSession();

//   console.log(session);

//   return (
//     <main className="w-full h-full">
//       <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-blue-900 drop-shadow-xl">
//         <h1 className="text-slate-200 text-center text-2xl font-extrabold">
//           <div>{session?.user.name}でログイン中</div>
//           Full Stack Post App
//         </h1>
//       </div>
//       {/* Link */}
//       <div className="flex my-5">
//         <Link
//           href={"/post/add"}
//           className=" md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-300 font-semibold"
//         >
//           Add New Post 🚀
//         </Link>
//       </div>

//       <div className="w-full flex flex-col justify-center items-center">
//         {posts.map((post: PostProps) => (
//           <div
//             key={post.id}
//             className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-200 flex flex-col justify-center"
//           >
//             <div className="flex items-center my-3">
//               <div className="mr-auto">
//                 <h2 className="mr-auto font-semibold">{post.location}</h2>
//               </div>
//               <Link
//                 href={`/post/edit/${post.id}`}
//                 className="px-4 py-1 text-center text-xl bg-slate-900 rounded-md font-semibold text-slate-200"
//               >
//                 Edit
//               </Link>
//             </div>

//             <div className="mr-auto my-1">
//               <blockquote className="font-bold text-slate-700">
//                 {new Date(post.createdAt).toDateString()}
//               </blockquote>
//             </div>

//             <div className="mr-auto my-1">
//               <h2>{post.description}</h2>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }
