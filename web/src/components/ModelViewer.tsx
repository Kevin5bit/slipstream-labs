"use client";
import React, { useEffect } from "react";

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
  // model-viewer references `self` at import time, which breaks SSR:
  // register the custom element in the browser only.
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

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
