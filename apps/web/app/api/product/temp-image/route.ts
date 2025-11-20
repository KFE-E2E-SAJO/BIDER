// import { createServerClient } from '@supabase/ssr';
// import sharp from 'sharp';
// import { randomUUID } from 'crypto';
// import * as fs from 'fs';
// import { createClient } from '@/shared/lib/supabase/client';

// // --- (1) Next.js API Route 설정: bodyParser 비활성화 ---
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method Not Allowed' });
//     }
//     const supabase = createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//         // 로그인하지 않은 사용자는 접근 불가
//         return res.status(401).json({ message: 'Authentication required.' });
//     }

//     const userId = user.id; // ✅ 인증된 사용자 ID 확보!

//     // --- (3) 파일 수신 및 파싱 ---
//     const form = formidable({});
//     const [fields, files] = await form.parse(req);
//     const file = files.image ? files.image[0] : null;

//     if (!file) {
//         return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     const tempId = randomUUID();

//     try {
//         const originalBuffer = await fs.promises.readFile(file.filepath);

//         // --- (4) Sharp 변환 및 Storage 저장 ---

//         // a. 70px 미리보기 WebP 생성
//         const previewBuffer = await sharp(originalBuffer)
//             .rotate()
//             .resize(70, 70, { fit: 'cover' })
//             .webp({ quality: 80 })
//             .toBuffer();

//         const tempBucket = 'product-image'; // 생성하신 버킷 이름
//         const basePath = `temp-products/${userId}/${tempId}`; // 경로에 userId 포함
//         const originalPath = `${basePath}/original.heic`;
//         const previewPath = `${basePath}/preview_70px.webp`;

//         // b. 원본 HEIC 저장 (Service Role Key가 아닌, Public Key를 사용한 세션 기반 업로드 시도)
//         // RLS 정책이 Storage 버킷에 대해 'authenticated' 권한의 INSERT를 허용해야 합니다.
//         const { error: originalError } = await supabase.storage
//             .from(tempBucket)
//             .upload(originalPath, originalBuffer, {
//                 contentType: file.mimetype,
//                 upsert: false,
//             });

//         // c. 미리보기 WebP 저장
//         const { error: previewError } = await supabase.storage
//             .from(tempBucket)
//             .upload(previewPath, previewBuffer, {
//                 contentType: 'image/webp',
//                 upsert: false,
//             });

//         // (Storage RLS 설정이 'authenticated'를 허용해야 이 단계가 성공합니다.)

//         if (originalError || previewError) {
//             console.error('Storage Error:', originalError || previewError);
//             return res.status(500).json({ message: 'Failed to upload files to storage.' });
//         }

//         // --- (5) Supabase DB 레코드 저장 (Authenticated 권한) ---
//         // RLS가 INSERT를 허용하며, user_id를 자동으로 채워주도록 설정되어 있어야 합니다.
//         const { error: dbError } = await supabase
//             .from('temp_product_image')
//             .insert({
//                 id: tempId,
//                 user_id: userId, // RLS 검증을 위해 명시적으로 전달하거나, DB 기본값 사용 (선택)
//                 original_path: originalPath,
//                 preview_path: previewPath,
//             });

//         if (dbError) {
//             console.error('DB Error:', dbError);
//             return res.status(500).json({ message: 'Failed to save DB record.' });
//         }

//         // --- (6) 클라이언트 응답 ---
//         const previewUrl = supabase.storage
//             .from(tempBucket)
//             .getPublicUrl(previewPath).data.publicUrl;

//         return res.status(200).json({
//             temp_id: tempId,
//             preview_url: previewUrl,
//         });

//     } catch (error) {
//         console.error('Processing Error:', error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     } finally {
//         if (file && file.filepath) {
//             await fs.promises.unlink(file.filepath).catch(e => console.error('Failed to unlink temp file:', e));
//         }
//     }
// }
