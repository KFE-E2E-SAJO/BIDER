'use client';

import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import { Camera, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';

interface ProfilePreviewProps {
  profileImg?: string | null;
  onChangeAvatar?: (avatar: UploadedImage) => void;
  onDelete?: () => void;
}

export interface UploadedImage {
  file: File;
  preview: string;
}

const ProfilePreview = ({ profileImg, onChangeAvatar, onDelete }: ProfilePreviewProps) => {
  const [avatar, setAvatar] = useState<UploadedImage | null>(null);
  const [open, setOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      const newAvatar = { file, preview };
      setAvatar(newAvatar);
      onChangeAvatar?.(newAvatar);
    }

    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleGallerySelect = () => fileInputRef.current?.click();
  const handleCameraCapture = () => cameraInputRef.current?.click();

  const removeImage = () => {
    if (avatar) URL.revokeObjectURL(avatar.preview);
    setAvatar(null);
    onDelete?.();
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (avatar) URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);

  const getAvatarSrc = () => {
    if (avatar?.preview) return avatar.preview;
    if (profileImg) return profileImg;
    return undefined;
  };

  return (
    <>
      <div className="relative">
        <Avatar className="size-[95px]" src={getAvatarSrc()} />
        <div
          className="bg-main absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full"
          onClick={() => setOpen(true)}
        >
          <Camera className="size-5.5 stroke-neutral-0" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-3">
            <Button onClick={handleCameraCapture} variant="outline" className="items-center">
              <Camera size={20} className="flex-shrink-0" />
              <span>카메라로 촬영</span>
            </Button>
            <Button onClick={handleGallerySelect}>
              <Plus size={20} />
              <span>갤러리에서 선택</span>
            </Button>
            <Button variant="link" onClick={removeImage} className="text-danger h-fit">
              <span>이미지 삭제</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </>
  );
};

export default ProfilePreview;
