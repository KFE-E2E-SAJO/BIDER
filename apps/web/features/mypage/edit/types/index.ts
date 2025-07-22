export interface GetEditProfileParams {
  userId: string;
}

export interface UseGetEditProfileParams {
  userId: string;
}

export interface ProfilePreviewProps {
  profileImg?: string | null;
  onChangeAvatar?: (avatar: UploadedImage) => void;
  onDelete?: () => void;
}

export interface UploadedImage {
  file: File;
  preview: string;
}
