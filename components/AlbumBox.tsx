import { COLORS, SIZES } from "@/constants/Colors";
import { Album } from "@/models/models";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { setOpenAlbum } from "../app/albumSlice";
import { convertExifDateToReadable } from "@/utilities/helpers";
import { AlbumContents } from "./Album";

interface Props {
  album: Album;
}

export const AlbumBox: React.FC<Props> = ({ album }) => {
  //const [bgColor, setBgColor] = useState('#1E90FF');

  const dispatch = useDispatch();
  const openAlbum = useSelector((state: any) => state.album.openAlbum);

  const [isOpen, setIsOpen] = useState(false);

  const handleSetActiveAlbum = (openAlbumId: string) => {
    dispatch(setOpenAlbum(openAlbumId));
  };
  const activeAlbum = openAlbum === album.id ? true : false;
  const activeBgColor = activeAlbum ? COLORS.tb2 : COLORS.tb1;

  const handleOpenClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    console.log("IS OPEN: ", isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!activeAlbum) {
      setIsOpen(false);
    }
  }, [activeAlbum]);

  return (
    <View style={[styles.mainContainer, { backgroundColor: activeBgColor }]}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: activeBgColor }]}
        onPress={() => handleSetActiveAlbum(album.id)}
      >
        <View style={styles.leftSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{album.title} - </Text>
            <Text style={styles.momentCount}>
              {album.moments.length} moments
            </Text>
          </View>
          <Text style={styles.dates}>{`${convertExifDateToReadable(
            album.moments[0].captureDate
          )}-${convertExifDateToReadable(
            album.moments[album.moments.length - 1].captureDate
          )}`}</Text>
        </View>
        {album.id != "all" && (
          <View style={styles.profileContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{album.moments[0].createdBy.name}</Text>
              <Text style={styles.username}>
                @{album.moments[0].createdBy.username}
              </Text>
            </View>
            <Image
              source={{ uri: album.createdBy?.avatar }}
              style={styles.profilePic}
            />
          </View>
        )}
      </TouchableOpacity>
      {activeAlbum && (
        <TouchableOpacity
          onPress={() => handleOpenClick()}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <Image
            source={require("../assets/images/down-arrow.png")}
            style={{
              width: 35,
              height: 15,
              transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      )}
      {isOpen && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <AlbumContents album={album} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    //justifyContent: "space-between",
    //alignItems: "center",
    backgroundColor: COLORS.tb1,
    paddingBottom: 2,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.tb1,
    padding: 4,
    overflow: "hidden",
  },
  leftSection: {
    flexDirection: "column",
    flex: 1,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: SIZES.medium,
  },
  momentCount: {
    paddingTop: 2,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: SIZES.small,
    flexShrink: 1,
  },
  dates: {
    color: "#FFFFFF",
    fontSize: 14,
    fontStyle: "italic",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  userInfo: {
    justifyContent: "center",
    paddingEnd: 3,
  },
  name: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  username: {
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginTop: 5,
  },
});
