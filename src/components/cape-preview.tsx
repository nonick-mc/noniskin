import { useEffect, useRef } from 'react';

const CapePreviewCrop = { sx: 1, sy: 1, sWidth: 10, sHeight: 16 } as const;

export function CapePreview({ file }: { file: File }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    createImageBitmap(
      file,
      CapePreviewCrop.sx,
      CapePreviewCrop.sy,
      CapePreviewCrop.sWidth,
      CapePreviewCrop.sHeight,
    ).then((bitmap) => {
      if (cancelled) {
        bitmap.close();
        return;
      }
      canvasRef.current?.getContext('bitmaprenderer')?.transferFromImageBitmap(bitmap);
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <canvas
      ref={canvasRef}
      width={CapePreviewCrop.sWidth}
      height={CapePreviewCrop.sHeight}
      className='size-full object-contain [image-rendering:pixelated]'
    />
  );
}
