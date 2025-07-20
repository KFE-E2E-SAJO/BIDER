export const getAddressFromLatLng = async (coords: {
  lat: number;
  lng: number;
}): Promise<string | null> => {
  const { lat, lng } = coords;
  const res = await fetch(`/api/vworld?point=${lng},${lat}`);
  const data = await res.json();
  const results = data.response.result;

  if (!results || results.length === 0) return null;

  const structure = results[0].structure;

  const eupmyeondong = structure?.level4L;

  return eupmyeondong || null;
};
