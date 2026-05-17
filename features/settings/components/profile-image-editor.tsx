"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getCroppedImg } from "../utils/crop-image";

import { createPortal } from "react-dom";

interface ProfileImageEditorProps {
  image: string;
  onConfirm: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export function ProfileImageEditor({ image, onConfirm, onCancel }: ProfileImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        onConfirm(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 p-6">
            <div>
              <h3 className="text-xl font-bold">Edit Profile Photo</h3>
              <p className="text-sm text-muted-foreground">Adjust the position and zoom of your image</p>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cropper Container */}
          <div className="relative h-[350px] w-full bg-muted sm:h-[450px]">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Controls */}
          <div className="space-y-8 p-8">
            <div className="flex items-center gap-4 px-4">
              <Minus className="h-5 w-5 text-muted-foreground" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-3xl h-14 text-base font-semibold" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-3xl h-14 text-base font-bold shadow-xl shadow-primary/20" onClick={handleConfirm}>
                <Check className="mr-3 h-5 w-5" />
                Apply Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
