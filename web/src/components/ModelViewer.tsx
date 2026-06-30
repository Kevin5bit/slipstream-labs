"use client";
import React from "react";
import "@google/model-viewer";

interface ModelViewerProps {
  src: string;
  alt?: string;
  cameraControls?: boolean;
  autoRotate?: boolean;
  disablePan?: boolean;
}

export function ModelViewer({
  src,
  alt = "3D Model",
  cameraControls = true,
  autoRotate = true,
  disablePan = false,
}: ModelViewerProps) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      {/* @ts-expect-error — model-viewer is a custom element without full TS types */}
      <model-viewer
        src={src}
        alt={alt}
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        disable-pan={disablePan}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
