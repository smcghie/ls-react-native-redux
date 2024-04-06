import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setActivePhoto } from "@/app/albumSlice";
import { Album } from "@/models/models";
import PhotoPopup from "./PhotoPopup";

interface Moment {
  id: string;
  image: string;
  commentCount: number;
}

interface Props {
  //moments: Moment[];
  album: Album;
}

const ITEM_WIDTH = 100; // Width of the image
const MARGIN = 5; // Margin on each side
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + MARGIN * 2;

export const AlbumContents: React.FC<Props> = ({ album }) => {
  const screenWidth = Dimensions.get("window").width;
  const numColumns = Math.floor(screenWidth / TOTAL_ITEM_WIDTH);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const setSelectedMoment = (momentId: string) => {
    //console.log("momentId: ", momentId)

    dispatch(setActivePhoto(momentId));
    //setSelectedMomentId(momentId);
  };
  const activePhoto = useSelector((state: any) => state.album.activePhoto);

  // Handle press on the expand icon
  const onExpandPress = (event: any, image: string) => {
    // Here you can handle the expand action
    //console.log(`Expand icon pressed for momentId: ${momentId}`);
    setPopupVisible(true);
    setSelectedImage(image);
    //setSelectedMoment(activePhoto);
    // Prevents parent onPress from being triggered
    event.stopPropagation();
  };

  const openPopup = () => {
    //setSelectedImageIndex(index);
    setPopupVisible(true);
    console.log("POPUP VISIBLE: ", popupVisible);
  };

  const renderRows = (moments: Moment[]) => {
    let rows = [];
    for (let i = 0; i < moments.length; i += numColumns) {
      const rowItems = moments.slice(i, i + numColumns);
      rows.push(
        <View key={i} style={styles.row}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedMoment(item.id)}
            >
              <View
                style={[
                  styles.momentContainer,
                  activePhoto === item.id ? styles.selectedMoment : {},
                ]}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                {activePhoto === item.id && (
                  <>
                    <TouchableOpacity
                      style={styles.expandIcon}
                      onPress={(event) => onExpandPress(event, item.image)}
                    >
                      <Image
                        source={require("../assets/images/expand.png")}
                        style={{ width: 50, height: 50, opacity: 0.75 }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.selectedText}>{item.commentCount} comments</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {popupVisible && (
            <PhotoPopup
              album={[album]}
              isVisible={popupVisible}
              onClose={() => setPopupVisible(false)}
              selectedImage={selectedImage}
            />
          )}
        </View>
      );
    }
    return rows;
  };

  return <View style={styles.container}>{renderRows(album.moments)}</View>;
};

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    marginBottom: MARGIN,
  },
  momentContainer: {
    margin: MARGIN,
    padding: 5,
  },
  image: {
    width: ITEM_WIDTH,
    height: 100,
  },
  expandIcon: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 50,
    height: 50,
    opacity: 0.7,
    transform: [{ translateX: -20 }, { translateY: -25 }],
  },
  selectedMoment: {
    backgroundColor: "lightblue",
    padding: 5,
    borderRadius: 10,
  },
  selectedText: {
    textAlign: "center",
    marginTop: 5,
  },
});

// import React, { useState } from "react";
// import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { useSelector, useDispatch } from "react-redux";
// import { setActivePhoto } from "@/app/albumSlice";
// //import ExpandIcon from "../assets/images/expand.png";

// interface Moment {
//   id: string;
//   image: string;
// }

// interface Props {
//   moments: Moment[];
// }

// const ITEM_WIDTH = 100; // Width of the image
// const MARGIN = 5; // Margin on each side
// const TOTAL_ITEM_WIDTH = ITEM_WIDTH + MARGIN * 2;

// export const AlbumContents: React.FC<Props> = ({ moments }) => {
//   const screenWidth = Dimensions.get("window").width;
//   const numColumns = Math.floor(screenWidth / TOTAL_ITEM_WIDTH);
//   const dispatch = useDispatch();
//   const [selectedMomentId, setSelectedMomentId] = useState<string | null>(null);

//   const setSelectedMoment = (momentId: string) => {
//     dispatch(setActivePhoto(momentId));
//     setSelectedMomentId(momentId); // Update local state
//   };

//   const onExpandPress = (event: any, momentId: string) => {
//     // Here you can handle the expand action
//     console.log(`Expand icon pressed for momentId: ${momentId}`);
//     // Prevents parent onPress from being triggered
//     event.stopPropagation();
//   };

//   const renderRows = (moments: Moment[]) => {
//     let rows = [];
//     for (let i = 0; i < moments.length; i += numColumns) {
//       const rowItems = moments.slice(i, i + numColumns);
//       rows.push(
//         <View key={i} style={styles.row}>
//           {rowItems.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               onPress={() => setSelectedMoment(item.id)}
//             >
//               <View
//                 style={[
//                   styles.momentContainer,
//                   selectedMomentId === item.id ? styles.selectedMoment : {},
//                 ]}
//               >
//                 <TouchableOpacity
//                   style={styles.expandIcon}
//                   onPress={(event) => onExpandPress(event, item.id)}
//                 >
//                   <Image source={{ uri: item.image }} style={styles.image} />
//                 </TouchableOpacity>
//                 {selectedMomentId === item.id && (
//                   <>
//                     <Image
//                       source={require("../assets/images/expand.png")}
//                       style={styles.expandIcon}
//                     />
//                     <Text style={styles.selectedText}>Selected</Text>
//                   </>
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       );
//     }
//     return rows;
//   };

//   return <View style={styles.container}>{renderRows(moments)}</View>;
// };

// const styles = StyleSheet.create({
//   container: {},
//   row: {
//     flexDirection: "row",
//     marginBottom: MARGIN,
//   },
//   momentContainer: {
//     margin: MARGIN,
//     padding: 5,
//   },
//   image: {
//     width: ITEM_WIDTH,
//     height: 100,
//   },
//   expandIcon: {
//     position: "absolute",
//     left: "50%",
//     top: "50%",
//     width: 50, // Set as needed
//     height: 50, // Set as needed
//     opacity: 0.7,
//     transform: [{ translateX: -20 }, { translateY: -25 }], // Adjusts the icon to be centered
//   },
//   selectedMoment: {
//     backgroundColor: "lightblue", // Highlight color
//     padding: 5,
//   },
//   selectedText: {
//     textAlign: "center",
//     marginTop: 5,
//   },
// });

// import { setActivePhoto } from "@/app/albumSlice";
// import React from "react";
// import { View, Image, StyleSheet, Dimensions } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { useSelector, useDispatch } from "react-redux";
// interface Moment {
//   id: string;
//   image: string;
// }

// interface Props {
//   moments: Moment[];
// }

// const ITEM_WIDTH = 100; // Width of the image
// const MARGIN = 5; // Margin on each side
// const TOTAL_ITEM_WIDTH = ITEM_WIDTH + MARGIN * 2;

// export const AlbumContents: React.FC<Props> = ({ moments }) => {
//   const screenWidth = Dimensions.get("window").width;
//   const numColumns = Math.floor(screenWidth / TOTAL_ITEM_WIDTH);

//   const dispatch = useDispatch();

//   const setSelectedMoment = (openMomentId: string) => {
//     dispatch(setActivePhoto(openMomentId));
//   };

//   const renderRows = (moments: Moment[]) => {
//     let rows = [];
//     for (let i = 0; i < moments.length; i += numColumns) {
//       const rowItems = moments.slice(i, i + numColumns);
//       rows.push(
//         <View key={i} style={styles.row}>
//           {rowItems.map((item) => (
//             <TouchableOpacity key={item.id} onPress={() => { setSelectedMoment(item.id);}}>
//             <Image
//               //key={item.id}
//               source={{ uri: item.image }}
//               style={styles.image}
//             />
//             </TouchableOpacity>
//           ))}
//         </View>
//       );
//     }
//     return rows;
//   };

//   return <View style={styles.container}>{renderRows(moments)}</View>;
// };

// const styles = StyleSheet.create({
//   container: {},
//   row: {
//     flexDirection: "row",
//     //justifyContent: 'center',
//     marginBottom: MARGIN,
//   },
//   image: {
//     width: ITEM_WIDTH,
//     height: 100,
//     margin: MARGIN,
//   },
// });
