import sharp from 'sharp';

export async function generateBlurDataURL(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  const blurBuffer = await sharp(Buffer.from(buffer))
    .resize(32, 32, { fit: 'inside' }) // 저해상도
    .blur() // 블러 처리
    .toFormat('jpeg') // jpeg 형식 고정 (base64 크기 줄이기)
    .toBuffer();

  const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
  return blurDataURL;
}
