'use client';

import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/DIalog/dialog';
import { Camera, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  order_index: number;
}

interface ImageUploadPreviewProps {
  onImagesChange: (images: UploadedImage[]) => void;
}

const ImageUploadPreview = ({ onImagesChange }: ImageUploadPreviewProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 5;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file?.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: `${Date.now()}-${i}`,
          file,
          preview,
          order_index: images.length === 0 && i === 0 ? 0 : 1,
        });
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setShowActionSheet(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  };

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  const openActionSheet = () => {
    if (images.length >= maxImages) return;
    setShowActionSheet(true);
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <div className="w-full">
      <div className="scroll-container flex gap-[18px] pt-[10px]">
        <div
          className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[5px] border border-neutral-400"
          onClick={openActionSheet}
        >
          <div className="flex flex-col items-center">
            <Camera size={20} className="text-neutral-600" />
            <div className="text-[10px]">
              <span className="text-main">{images.length}</span> / {maxImages}
            </div>
          </div>
        </div>
        {images.map((image, index) => (
          <div key={image.id} className="relative">
            <Avatar
              className="h-[60px] w-[60px] rounded-[5px]"
              src={image.preview}
              alt={index === 0 ? '대표 이미지' : '업로드된 이미지'}
            />
            {index === 0 && (
              <div className="text-neutral-0 absolute bottom-0 left-0 right-0 flex h-[15px] items-center justify-center rounded-b-[5px] bg-neutral-800 text-[8px]">
                대표 사진
              </div>
            )}
            <Button
              size="icon"
              shape="rounded"
              className="absolute right-0 top-0 h-[20px] w-[20px] -translate-y-1/2 translate-x-1/2 bg-neutral-800"
              onClick={() => removeImage(image.id)}
            >
              <X size={12} />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={showActionSheet} onOpenChange={setShowActionSheet}>
        {/* 타이틀 (화면에서 안 보이게 처리) */}
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
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
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
    </div>
  );
};

export default ImageUploadPreview;
