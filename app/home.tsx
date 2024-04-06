import { StyleSheet } from "react-native";
import MapComponent from "./map";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BotSheet from "@/components/BottomSheet";
import { useEffect, useRef, useState } from "react";
import BottomSheet from '@gorhom/bottom-sheet';
import { Album } from "@/models/models";
import testData from './testData.json';
import store from './store';
import { Provider } from 'react-redux';
const HomeScreen = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        setAlbums(testData)
    }, []);

    useEffect(() => {
        console.log("ALBUMS: ", albums)
    }, [albums]);

    
  return (
    <GestureHandlerRootView style={styles.container}>
        <Provider store={store}>
            <MapComponent albums={albums}/>
            {albums && albums.length > 0 && (
            <BotSheet 
                ref={bottomSheetRef} 
                title={"title"}
                albums={albums}
                />
            )}
        </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: 'grey',
      zIndex: 1,
  
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });

export default HomeScreen;
