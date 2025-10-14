import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

export default function DropArea({ setFiles }) {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Card
      {...getRootProps()}
      className="
            min-h-[400px] border-dashed border-1 p-8 relative"
    >
      <input {...getInputProps()} type="file" />
      {isDragActive ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-1/2 flex flex-col items-center">
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
