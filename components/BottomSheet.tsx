import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapComponent from '@/app/map';
import { Album } from '@/models/models';
import { AlbumBoxes } from './AlbumBoxes';
import { AlbumBox } from './AlbumBox';
import { COLORS, SIZES } from "@/constants/Colors";
export type Ref = BottomSheet;

interface Props {
	title: string;
  albums: Album[];
}

const BotSheet = forwardRef<Ref, Props>((props, ref) => {
  // ref
  // const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentHeight, setCurrentHeight] = useState<any>(200);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    const currentHeight = snapPoints[index];
    const realHeight = currentHeight
    setCurrentHeight(realHeight);
  }, []);

  const allMomentsAlbum: Album = {
    id: 'all', // Unique identifier for "All" album
    title: 'All Albums',
    moments: props.albums.reduce((acc: any, album) => [...acc, ...album.moments], []),
    createdBy: {
      id: "16b43208-ab8d-481d-a4d6-8b7e4b4c9478",
      avatar: "1706935707934-6y7u0youpgfb1.png",
      username: "test0",
      name: "Scott McGhie",
      userType: "regular",
      totalDataUsed: 0,
      friends: []
    },
    createdById: "all",
    sharedUsers: [],
    albumType: "Personal"
  };

  //const albumsForDisplay = [allMomentsAlbum, ...props.albums];

  useEffect(() => {
    console.log("IS OPEN: ", currentHeight);
  }, [currentHeight]);

  const snapPoints = useMemo(() => [24, 250, 400, 675], []);
  // renders
  return (
      <BottomSheet
        ref={ref}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        handleStyle={styles.container}
        contentHeight={currentHeight}
        containerHeight={650}
        backgroundStyle={styles.contentView}
      >
        
        <BottomSheetScrollView
         style={[styles.contentContainer, { height: (currentHeight-20) }]}>

        <AlbumBox key={allMomentsAlbum.id} album={allMomentsAlbum} />
        {props.albums.map((album, index) => (
        <AlbumBox key={index} album={album} />
      ))}

          {/* <AlbumBoxes albums={props.albums}/> */}
        </BottomSheetScrollView>
    
      </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: COLORS.dark1,
    //height: 675
  },
  container: {
    //height: '25%'
    //flex: 1,
    //padding: 24,
    backgroundColor: COLORS.tb3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
    //zIndex: 12000,
		// alignItems: 'center',
		// justifyContent: 'center'
  },
  contentContainer: {
    backgroundColor: COLORS.dark1,
    //flex: 1,
    //alignItems: 'center',
  },
});

export default BotSheet;