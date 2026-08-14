'use client';

import { useEffect, useState } from 'react';
import { ReactSkinview3d } from 'react-skinview3d';
import { useObjectUrl } from '@/hooks/use-object-url';
import type { BodyType } from '@/types/skin-pack';

type SkinPreviewImageProps = {
  file: File;
  bodyType: BodyType;
  capeFile?: File | null;
  className?: string;
};

const SnapshotWidth = 128;
const SnapshotHeight = 256;

export function SkinPreviewImage({ file, bodyType, capeFile, className }: SkinPreviewImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const skinUrl = useObjectUrl(file);
  const capeUrl = useObjectUrl(capeFile);

  // biome-ignore lint/correctness/useExhaustiveDependencies: いずれもトリガーとして使うのみで本文では参照しない
  useEffect(() => {
    setImageUrl(null);
  }, [skinUrl, capeUrl, bodyType]);

  return (
    <div className={className}>
      {imageUrl ? (
        // biome-ignore lint/performance/noImgElement: ReactSkinview3dのcanvasから書き出したPNGのため
        <img
          src={imageUrl}
          alt=''
          className='size-full object-contain [image-rendering:pixelated]'
        />
      ) : (
        skinUrl && (
          <ReactSkinview3d
            className='size-full'
            width={SnapshotWidth}
            height={SnapshotHeight}
            skinUrl={skinUrl}
            capeUrl={capeUrl ?? undefined}
            options={{
              model: bodyType === 'slim' ? 'slim' : 'default',
              enableControls: false,
              zoom: 0.8,
            }}
            onReady={({ viewer, canvasRef }) => {
              viewer
                .loadSkin(skinUrl, { model: bodyType === 'slim' ? 'slim' : 'default' })
                .then(async () => {
                  if (capeUrl) {
                    await viewer.loadCape(capeUrl);
                  }
                  viewer.render();
                  setImageUrl(canvasRef.toDataURL('image/png'));
                  viewer.dispose();
                });
            }}
          />
        )
      )}
    </div>
  );
}
