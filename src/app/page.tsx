import Auth from "./_component/auth";
import { getServerSession } from "@/lib/auth";
import ViewPost from "./_component/view-post";
import MapView from "./_component/map-view";

const Home = async () => {
  const session = await getServerSession();

  return (
    <div className="space-y-2 p-1">
      <p className="text-xs">v1.1 ももかとゆきちゃんのために作ったアプリ</p>
      <MapView />
      <ViewPost />
      <div className="p-4">
        {session && `${session.user.name}でログイン中`} <Auth />
      </div>
    </div>
  );
};

export default Home;
