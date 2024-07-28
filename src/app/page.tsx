import SearchMap from "./_component/search-map";
import Auth from "./_component/auth";
import { getServerSession } from "@/lib/auth";

const Home = async () => {
  const session = await getServerSession();

  return (
    <>
      <div className="p-4">
        {session ? `${session.user.name}でログイン中` : <Auth />}
      </div>
      <SearchMap />
    </>
  );
};

export default Home;
