import SearchMap from "./_component/search-map";
import Auth from "./_component/auth";
import { getServerSession } from "@/lib/auth";
import ViewPost from "./_component/view-post";

const Home = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const session = await getServerSession();

  return (
    <div className="space-y-2">
      <p>v1.0</p>
      <div className="p-4">
        {session && `${session.user.name}でログイン中`} <Auth />
      </div>
      <ViewPost />
      <SearchMap query={searchParams?.query} />
    </div>
  );
};

export default Home;
