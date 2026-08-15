'use client';

import { Trash2Icon, UploadCloudIcon } from 'lucide-react';
import type { FocusEvent } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useObjectUrl } from '@/hooks/use-object-url';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type ImageUploadProps = {
  className?: string;
  name?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  invalid?: boolean;
};

export function ImageUpload({
  className,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  invalid,
}: ImageUploadProps) {
  const [
    { isDragging },
    {
      clearFiles,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/png',
    multiple: false,
    onFilesChange: (files) => {
      const file = files[0]?.file;
      onChange(file instanceof File ? file : null);
    },
  });
  const previewUrl = useObjectUrl(value);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 画像のドラッグ&ドロップ用のドロップゾーン
    <div
      data-invalid={invalid}
      className={cn(
        'w-full aspect-square relative overflow-hidden rounded-lg border transition-colors data-[invalid=true]:border-destructive',
        isDragging && 'border-primary bg-primary/5',
        className,
      )}
      onDragEnter={disabled ? undefined : handleDragEnter}
      onDragLeave={disabled ? undefined : handleDragLeave}
      onDragOver={disabled ? undefined : handleDragOver}
      onDrop={disabled ? undefined : handleDrop}
    >
      {previewUrl ? (
        <>
          {/** biome-ignore lint/performance/noImgElement: client file */}
          <img
            src={previewUrl}
            alt='preview'
            className='size-full object-cover [image-rendering:pixelated] pointer-events-none'
          />
          <Button
            className='absolute right-2 top-2'
            size='icon'
            variant='outline'
            disabled={disabled}
            onClick={() => {
              clearFiles();
              onChange(null);
            }}
          >
            <Trash2Icon className='text-destructive' />
          </Button>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center gap-2 w-full h-full p-2 text-center'>
          <Button type='button' disabled={disabled} onClick={openFileDialog}>
            <UploadCloudIcon />
            画像をアップロード
          </Button>
          <p className='text-xs text-muted-foreground'>または、画像をドラッグ&ドロップ</p>
          <input {...getInputProps({ id: name, name, disabled, onBlur })} className='sr-only' />
        </div>
      )}
    </div>
  );
}
