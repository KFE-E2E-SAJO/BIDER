import loadImage from 'blueimp-load-image';

// HEIC 파일을 WebP로 변환하는 함수
const convertHeicToWebP = async (file: File): Promise<File> => {
  try {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') {
      throw new Error('브라우저 환경에서만 사용 가능합니다.');
    }

    // Dynamic import로 브라우저에서만 로드
    const heic2any = (await import('heic2any')).default;

    const convertedBlob = (await heic2any({
      blob: file,
      toType: 'image/webp',
      quality: 0.8,
    })) as Blob;

    // 변환된 Blob을 File 객체로 변환
    const convertedFile = new File([convertedBlob], file.name.replace(/\.heic$/i, '.webp'), {
      type: 'image/webp', // MIME 타입도 WebP로 변경
    });

    return convertedFile;
  } catch (error) {
    console.error('HEIC → WebP 변환 실패:', error);
    throw error;
  }
};

export const convertAndFixOrientation = async (file: File): Promise<File> => {
  let processedFile = file;

  // 1. HEIC 파일인 경우 WebP로 변환
  if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
    processedFile = await convertHeicToWebP(file);
  }

  // 2. blueimp-load-image로 EXIF Orientation 적용
  const fixedBlob = await new Promise<Blob>((resolve, reject) => {
    loadImage(
      processedFile,
      (canvasOrEvent) => {
        if (canvasOrEvent instanceof HTMLCanvasElement) {
          canvasOrEvent.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Blob 생성 실패'));
              }
            },
            'image/webp',
            0.9
          );
        } else {
          reject(new Error('이미지 회전 처리 실패'));
        }
      },
      { orientation: true, canvas: true }
    );
  });

  // 3. Blob → File 객체로 변환
  const fixedFile = new File([fixedBlob], processedFile.name.replace(/\.\w+$/, '.webp'), {
    type: 'image/webp',
  });

  return fixedFile;
};
