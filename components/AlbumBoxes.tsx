import { Album } from '@/models/models';
import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { AlbumBox } from './AlbumBox';

interface Props{
  albums: Album[];
}

export const AlbumBoxes: React.FC<Props> = ({
  albums
}) => {
  return (
    <ScrollView
     //showsVerticalScrollIndicator={false}
      style={styles.container}
    >
            {albums.map((album, index) => (
        <AlbumBox key={index} album={album} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 0,
    backgroundColor: 'grey',
    //zIndex: 12000,
		// alignItems: 'center',
		// justifyContent: 'center'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});