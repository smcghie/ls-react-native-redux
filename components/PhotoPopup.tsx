import { Album, Moment } from "@/models/models";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import ImageZoom from "react-native-image-pan-zoom";
const { width, height } = Dimensions.get("window");

interface PhotoPopupProps {
  album: Album[];
  isVisible: boolean;
  onClose: () => void;
  selectedImage: string | null;
}

const PhotoPopup: React.FC<PhotoPopupProps> = ({
  album,
  isVisible,
  onClose,
  selectedImage,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [flattenedMoments, setFlattenedMoments] = useState<Moment[]>([]);

  // Combine all moments from every album in album array
  useEffect(() => {
    const allMoments: Moment[] = album.reduce((acc: Moment[], currentAlbum) => {
      return [...acc, ...currentAlbum.moments];
    }, [] as Moment[]);

    setFlattenedMoments(allMoments);
  }, [album]);

  //Take the image string to find index position in combined moments array
  useEffect(() => {
    if (
      selectedImage &&
      album &&
      album.length > 0 &&
      album[0].moments.length > 0
    ) {
      const index = flattenedMoments.findIndex((moment) =>
        moment.image.includes(selectedImage)
      );
      if (index !== -1) {
        setImageIndex(index);
      }
    }
  }, [selectedImage, album, flattenedMoments]);

  //   useEffect(() => {
  //     console.log("flattenedMoments: ", flattenedMoments);
  //     console.log("imageIndex: ", imageIndex);
  //     //console.log("SELECTED: ", selectedImage)
  //     //console.log("MARKER: ", selectedMarker)
  //     //console.log("IMAGE: ", images[0])
  //     //console.log("IMAGES: ", images)
  //   }, [album]);

  //Set index of selected carousel item
  const setItem = (index: number) => {
    console.log("index: ", index);
    setImageIndex(index);
  };

  //Render the enlarged image on the carousel on opening of carousel
  const renderItem = ({ item }: any) => (
    <View style={{ flex: 1 }}>
      <ImageZoom
        cropWidth={width}
        cropHeight={height * 0.75}
        imageWidth={width}
        imageHeight={height * 0.75}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width, height: height * 0.75 }}
          resizeMode="contain"
        />
      </ImageZoom>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>

    // <TouchableOpacity onPress={onClose}>
    //   <Image
    //     source={{ uri: item.image }}
    //     style={{ width, height: height * 0.75 }}
    //     resizeMode="contain"
    //   />
    // </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.9)",
        }}
      >
        <Carousel
          data={flattenedMoments}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) => setItem(index)}
          firstItem={imageIndex}
          vertical={false}
        />
        <View style={{ position: "absolute", bottom: 50 }}>
          <Carousel
            data={flattenedMoments}
            renderItem={({ item, index }: any) => (
              <TouchableOpacity onPress={() => setItem(index)}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80, margin: 4 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            sliderWidth={width}
            itemWidth={80}
            inactiveSlideScale={0.5}
            inactiveSlideOpacity={0.6}
            vertical={false}
            firstItem={imageIndex}
            //currentActiveIndex={imageIndex}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PhotoPopup;

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
});
