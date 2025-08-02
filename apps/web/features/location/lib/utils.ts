export const getGeoPermissionState = async (): Promise<
  'granted' | 'prompt' | 'denied' | 'unknown'
> => {
  if (!('permissions' in navigator)) return 'unknown';
  try {
    // 일부 브라우저는 타입 캐스팅 필요
    // @ts-ignore
    const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return status.state as 'granted' | 'prompt' | 'denied';
  } catch {
    return 'unknown';
  }
};
