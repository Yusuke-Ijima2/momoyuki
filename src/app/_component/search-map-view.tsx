import MapView from "./map-view";

type Props = {
  location?: string;
};

const SearchMapView = async ({ location }: Props) => {
  async function fetchLocation() {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      {
        cache: "no-store",
      }
    );
    const result = await response.json();

    if (result.results.length > 0) {
      const location = result.results[0].geometry.location;
      return location;
    } else {
      new Error("場所が見つかりませんでした");
    }
  }
  const centerLocation = await fetchLocation();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapView center={centerLocation} />
    </div>
  );
};

export default SearchMapView;
