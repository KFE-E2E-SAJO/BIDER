import { Button } from '@repo/ui/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { Camera, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatImage } from '../types';
import { convertHeicToWebP } from '@/shared/lib/convertHeicToWebP';

interface ImageUploadForChatProps {
  onImagesChange: (images: ChatImage[]) => void;
  open?: boolean;
  onClose?: () => void;
}

const ImageUploadForChat = ({ onImagesChange, open = false, onClose }: ImageUploadForChatProps) => {
  const [images, setImages] = useState<ChatImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const notifyParent = useCallback(
    (updatedImages: ChatImage[]) => {
      onImagesChange(updatedImages);
    },
    [onImagesChange]
  );

  useEffect(() => {
    if (images.length > 0) {
      notifyParent(images);
    }
  }, [images, notifyParent]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    onClose?.();

    const processedImages: ChatImage[] = await Promise.all(
      Array.from(files).map(async (f, i) => {
        let file: File = f;
        let isConverted = false;

        if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
          try {
            file = await convertHeicToWebP(file);
            isConverted = true;
          } catch (error) {
            console.error(`HEIC 변환 실패 (${file.name}):`, error);
          }
        }

        return {
          id: `image-${Date.now()}-${i}`,
          file,
          preview: URL.createObjectURL(file),
          isConverted,
        };
      })
    );

    onImagesChange(processedImages);

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current && !isConverting) {
      fileInputRef.current.click();
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current && !isConverting) {
      cameraInputRef.current.click();
    }
  };

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-3">
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              className="items-center"
              disabled={isConverting}
            >
              <Camera size={20} className="flex-shrink-0" />
              <span>카메라로 촬영</span>
            </Button>
            <Button onClick={handleGallerySelect} disabled={isConverting}>
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
    </>
  );
};

export default ImageUploadForChat;
