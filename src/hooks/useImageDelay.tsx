//@ts-nocheck
import React from 'react';
import isSafariBrowser from '../Utils/isSafariBrowser';

function useImageDelay(
  elementRef: any,
  delay: number | null,
  imageName: string,
  tintColor?: string,
) {
  React.useEffect(() => {
    if (!isSafariBrowser()) return;
    // The following block allows to repaint the icon
    let imageElement: any;
    if (elementRef && elementRef.current) {
      const imageContainer = elementRef.current as any;
      if (imageContainer && imageContainer.children.length > 0) {
        imageElement = imageContainer.children[0];
        imageElement.style.display = 'none';
      }
    }
    const timer = setTimeout(() => {
      if (imageElement) {
        imageElement.style.display = 'initial';
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [imageName, tintColor]);
}

export default useImageDelay;
