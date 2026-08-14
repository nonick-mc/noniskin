'use client';

import { useEffect, useRef, useState } from 'react';
import { SkinViewer, WalkingAnimation } from 'skinview3d';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const skinUrl = useObjectUrl(file);
  const capeUrl = useObjectUrl(capeFile);
  const hasSize = size.width > 0 && size.height > 0;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
      viewerRef.current?.setSize(width, height);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // react-skinview3d(ReactSkinview3d)はmodelを指定せずloadSkinを呼ぶため
  // auto-detectでbodyTypeの指定が上書きされてしまう。
  // SkinViewerを直接使い、コンストラクタでskin/modelを同時に渡すことで
  // 確実に一度だけ正しいmodelでロードさせる。
  // サイズは初回確定時のみ使用し、以降のリサイズは上のResizeObserver内でsetSizeする
  // biome-ignore lint/correctness/useExhaustiveDependencies: 上記の理由によりsize.width/size.heightは意図的に依存配列から除外
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !skinUrl || !hasSize) return;

    const viewer = new SkinViewer({
      canvas,
      width: size.width,
      height: size.height,
      skin: skinUrl,
      model: bodyType === 'slim' ? 'slim' : 'default',
      cape: capeUrl ?? undefined,
      zoom: 0.9,
      animation: new WalkingAnimation(),
    });
    viewer.autoRotate = true;
    viewer.autoRotateSpeed = 0.5;
    viewerRef.current = viewer;

    return () => {
      viewer.dispose();
      viewerRef.current = null;
    };
  }, [skinUrl, capeUrl, bodyType, hasSize]);

  return (
    <div ref={containerRef} className={className}>
      {skinUrl && <canvas ref={canvasRef} className='size-full' />}
    </div>
  );
}
