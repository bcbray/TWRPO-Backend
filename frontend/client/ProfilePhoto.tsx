import React from 'react';
import { ChannelInfo } from '@twrpo/types';

import styles from './ProfilePhoto.module.css';
import { classes } from './utils';
import { useDevicePixelRatio } from './hooks';

type ProfilePhotoSize = 'sm' | 'md' | 'lg' | number;

interface ProfilePhotoProps {
  channelInfo: ChannelInfo | null | undefined;
  size?: ProfilePhotoSize;
}

const resizedProfileUrl = (url: string, size: number, scale: number = 1) => {
  // Twitch profile photo sizes, via https://github.com/justintv/Twitch-API/issues/28#issuecomment-11549604
  // 600x600, 300x300, 150x150, 70x70, 50x50, 28x28

  const useSize = size * scale;

  const urlSize =
    useSize <= 28 ? '28x28'
    : useSize <= 50 ? '50x50'
    : useSize <= 70 ? '70x70'
    : useSize <= 150 ? '150x150'
    : useSize <= 300 ? '300x300'
    : '600x600';

  const result = url.replace(/(profile_image-)(\d+x\d+)(\.\w+)$/, (_, prefix, __, suffix) => {
    return `${prefix}${urlSize}${suffix}`
  });
  return result;
};

export const ProfilePhoto = React.forwardRef<
  HTMLDivElement,
  ProfilePhotoProps
    & React.HTMLAttributes<HTMLDivElement>
    & Pick<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'>
>((
  { channelInfo, size = 'sm', className, loading = 'lazy', style, ...rest }, ref
) => {
  const scale = useDevicePixelRatio();

  const sizePx =
    size === 'sm' ? 30
    : size === 'md' ? 60
    : size === 'lg' ? 150
    : size;

  return (
    <div
      className={classes(
        className,
        styles.pfp,
        channelInfo && styles.hasPfp,
        className
      )}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        borderRadius: `${sizePx/2}px`,
        ...style,
      }}
      ref={ref}
      {...rest}
    >
      {channelInfo &&
        <img
          src={resizedProfileUrl(channelInfo.profilePictureUrl, sizePx, scale)}
          alt={channelInfo.displayName}
          loading={loading}
        />
      }
    </div>
  )
});

export default ProfilePhoto;
