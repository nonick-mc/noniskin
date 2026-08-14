'use client';

import { useEffect, useRef, useState } from 'react';
import { ReactSkinview3d } from 'react-skinview3d';
import { WalkingAnimation } from 'skinview3d';
import { useObjectUrl } from '@/hooks/use-object-url';
import type { BodyType } from '@/types/skin-pack';

type SkinPreview3dProps = {
  file: File;
  bodyType: BodyType;
  capeFile?: File | null;
  className?: string;
};

export function SkinPreview3d({ file, bodyType, capeFile, className }: SkinPreview3dProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const skinUrl = useObjectUrl(file);
  const capeUrl = useObjectUrl(capeFile);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {skinUrl && size.width > 0 && size.height > 0 && (
        <ReactSkinview3d
          // bodyType変更時にoptions.modelを反映させるため強制的に再マウントする
          // (ReactSkinview3dはoptionsをマウント時にしか適用しないため)
          key={bodyType}
          className='size-full'
          width={size.width}
          height={size.height}
          skinUrl={skinUrl}
          capeUrl={capeUrl ?? undefined}
          options={{
            model: bodyType === 'slim' ? 'slim' : 'default',
            zoom: 0.9,
            animation: new WalkingAnimation(),
          }}
          onReady={({ viewer }) => {
            viewer.autoRotate = true;
            viewer.autoRotateSpeed = 0.5;
          }}
        />
      )}
    </div>
  );
}
