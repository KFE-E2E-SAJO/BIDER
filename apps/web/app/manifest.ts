import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bider',
    short_name: 'Bider',
    description: '가장 가까운 경매장 Bider',
    start_url: '/',
    display: 'standalone',
    background_color: '#64b5f7',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/android/android-launchericon-48-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-72-72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-96-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-144-144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-512-512-transparent.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
