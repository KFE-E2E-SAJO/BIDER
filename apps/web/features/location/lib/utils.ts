export async function getAddressFromLatLng(
  coords: { lat: number; lng: number },
  apiKey: string
): Promise<string | null> {
  const { lat, lng } = coords;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ko`
  );
  const data = await res.json();

  const results = data?.results;
  if (!results || results.length === 0) return null;

  let rawSido: string | undefined;
  let gu: string | undefined;

  for (const result of results) {
    for (const comp of result.address_components) {
      if (!rawSido && comp.types.includes('administrative_area_level_1')) {
        rawSido = comp.long_name;
      }
      if (
        !gu &&
        (comp.types.includes('sublocality_level_1') ||
          comp.types.includes('administrative_area_level_2'))
      ) {
        gu = comp.long_name;
      }
    }
    if (rawSido && gu) break;
  }

  if (rawSido) {
    rawSido = rawSido
      .replace('특별시', '시')
      .replace('광역시', '시')
      .replace('자치시', '시')
      .replace('특별자치도', '도')
      .replace('특별자치시', '시');
  }

  const result = [rawSido, gu].filter(Boolean).join(' ');
  return result || null;
}
