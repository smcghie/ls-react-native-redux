// Example: custom-types.d.ts
declare module 'react-native-image-pan-zoom' {
    import { ComponentType } from 'react';
    import { ImageZoomProps } from 'react-native-image-pan-zoom';
  
    interface CustomImageZoomProps extends ImageZoomProps {
      children?: React.ReactNode; // Allow children
      cropWidth: number;
      cropHeight: number;
      imageWidth: number;
      imageHeight: number;
      style?: ImageStyle | ImageStyle[];
    }
  
    const ImageZoom: ComponentType<CustomImageZoomProps>;
    export default ImageZoom;
  }
  