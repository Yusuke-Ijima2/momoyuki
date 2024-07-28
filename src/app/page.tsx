import SearchMap from "./_component/search-map";
import Auth from "./_component/auth";
import { getServerSession } from "@/lib/auth";
import ViewPost from "./_component/view-post";
import SearchMapView from "./_component/search-map-view";

const Home = async ({
  searchParams,
}: {
  searchParams?: {
    location?: string;
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
      <SearchMap>
        <SearchMapView location={searchParams?.location} />
      </SearchMap>
    </div>
  );
};

export default Home;
