import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { ImagePlus, Plus } from "lucide-react";
import { resizeImage, isImageFile } from "@/lib/imageUtils";

export default function DropArea({ setFiles }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        // Resize image if it's an image file
        if (isImageFile(file)) {
          try {
            const resizedFile = await resizeImage(file, 1920, 1920, 0.9);
            return Object.assign(resizedFile, {
              preview: URL.createObjectURL(resizedFile),
            });
          } catch (error) {
            console.error("Error resizing image:", error);
            // Fallback to original file if resize fails
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
          }
        }
        // Non-image files (shouldn't happen, but just in case)
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Card
      {...getRootProps()}
      className="
            min-h-[40vh] lg:min-h-[400px] border-dashed border-1   relative  bg-[#121420] text-gray-400"
    >
      <input {...getInputProps()} type="file" />
      {isDragActive ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-1/2 flex flex-col items-center ">
          <ImagePlus size={100} />
          <p>Drop the files here ...</p>
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-1/2 flex flex-col items-center">
          <ImagePlus size={100} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )}
    </Card>
  );
}

export function DropButton({ setFiles }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        // Resize image if it's an image file
        if (isImageFile(file)) {
          try {
            const resizedFile = await resizeImage(file, 1920, 1920, 0.9);
            return Object.assign(resizedFile, {
              preview: URL.createObjectURL(resizedFile),
            });
          } catch (error) {
            console.error("Error resizing image:", error);
            // Fallback to original file if resize fails
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
          }
        }
        // Non-image files (shouldn't happen, but just in case)
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card 
      {...getRootProps()} 
      className="h-[100px] lg:h-[200px] w-full flex justify-center items-center cursor-pointer"
    >
      <input {...getInputProps()} type="file" />
      <Plus size={40} color="white" className="opacity-60" />
    </Card>
  );
}
