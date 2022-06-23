import React from 'react';

import styles from './ProfilePhoto.module.css';
import { ChannelInfo } from './types';
import { classes } from './utils';
import { useDevicePixelRatio } from './hooks';

type ProfilePhotoSize = 'sm' | 'md' | 'lg' | number;

interface ProfilePhotoProps {
  channelInfo: ChannelInfo | null | undefined;
  size?: ProfilePhotoSize;
}

const resizedProfileUrl = (url: string, size: number) => {
  // Twitch profile photo sizes, via https://github.com/justintv/Twitch-API/issues/28#issuecomment-11549604
  // 600x600, 300x300, 150x150, 70x70, 50x50, 28x28

  const size =
    size <= 28 ? '28x28'
    : size <= 50 ? '50x50'
    : size <= 70 ? '70x70'
    : size <= 150 ? '150x150'
    : size <= 300 ? '300x300'
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
          src={resizedProfileUrl(channelInfo.profilePictureUrl, sizePx)}
          alt={channelInfo.displayName}
          loading={loading}
        />
      }
    </div>
  )
});

export default ProfilePhoto;
