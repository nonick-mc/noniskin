'use client';

import type { ComponentProps } from 'react';
import { ImageUpload } from '../image-upload';
import { useControlledField } from './field';

export function ControlledImageUpload({
  className,
}: Pick<ComponentProps<typeof ImageUpload>, 'className'>) {
  const { field, fieldState } = useControlledField();

  return (
    <ImageUpload
      className={className}
      name={field.name}
      value={field.value as File | null}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={field.disabled}
      invalid={fieldState.invalid}
    />
  );
}
