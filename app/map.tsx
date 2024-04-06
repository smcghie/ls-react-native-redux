import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import MapboxGL, { Camera } from "@rnmapbox/maps";
import { Feature } from "geojson";
import testData from "./testData.json";
import { useSelector, useDispatch } from "react-redux";
import { Album } from "@/models/models";
import PhotoPopup from "@/components/PhotoPopup";
import { setActivePhoto } from "@/app/albumSlice";
import { MAPBOX_TOKEN, API_URL } from '@env';

MapboxGL.setAccessToken(
  MAPBOX_TOKEN
);

MapboxGL.Logger.setLogCallback((log) => {
  const filteredMessages = [
    "RNMBX-mapview-point-annotations_drag",
    "RNMBX-mapview-callouts_drag",
  ];

  const shouldFilterOut = filteredMessages.some((filteredMessage) =>
    log.message.includes(filteredMessage)
  );

  return shouldFilterOut;
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    zIndex: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
  popup: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    width: 150,
  },
  popupImage: {
    width: 150,
    height: 150,
  },
  calloutView: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: 8,
    padding: 4,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0, 0, 0, 0.65)",
    alignSelf: "center",
  },
});



interface ImageInfo {
  uri: string;
}

interface ImagesState {
  [key: string]: ImageInfo;
}

interface MapComponentProps {
  albums: Album[];
}

const MapComponent: React.FC<MapComponentProps> = ({ albums }) => {
  const [selectedMarker, setSelectedMarker] =
    useState<Feature<GeoJSON.Geometry> | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<ImagesState>({});
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [currentAlbum, setCurrentAlbum] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>({
  type: "FeatureCollection",
  features: [],
  });
  const [firstMoment, setFirstMoment] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>({
    type: "FeatureCollection",
    features: [],
    });
  const openAlbum = useSelector((state: any) => state.album.openAlbum);
  const [selectedAlbum, setSelectedAlbum] = useState<Album[]>();
  const activePhoto = useSelector((state: any) => state.album.activePhoto);
  const dispatch = useDispatch();
  const [popupVisible, setPopupVisible] = useState(false);
  const openPopup = () => {
    setPopupVisible(true);
    console.log("POPUP VISIBLE: ", popupVisible)
  };

  const generateMarkerData = (): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
    const albumToUse = openAlbum === 'all' ? albums : albums.filter(album => album.id === openAlbum);
    setSelectedAlbum(albumToUse)
    const features: Feature<GeoJSON.Geometry>[] = albumToUse.flatMap(album =>
      album.moments.map(moment => ({
        type: "Feature",
        properties: {
          albumId: album.id,
          momentId: moment.id,
          title: album.title,
          avatar: `${moment.id}-avatar`,
          image: `${moment.id}-image`,
          createdByAvatar: moment.createdBy.avatar,
        },
        geometry: {
          type: "Point",
          coordinates: moment.coordinates,
        },
      }))
    );
  
    return {
      type: "FeatureCollection",
      features: features,
    };
  };

  const generateFirstMomentMarkers = (): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
    const albumToUse = openAlbum === 'all' ? albums : albums.filter(album => album.id === openAlbum);
    const features: Feature<GeoJSON.Geometry>[] = albumToUse.flatMap(album => {
      const firstMoment = album.moments[0];
      if (firstMoment) {
        return [{
          type: "Feature",
          properties: {
            albumId: album.id,
            momentId: firstMoment.id,
            title: album.title,
            avatar: `${firstMoment.id}-avatar`,
            image: `${firstMoment.id}-image`,
            createdByAvatar: firstMoment.createdBy.avatar,
          },
          geometry: {
            type: "Point",
            coordinates: firstMoment.coordinates,
          },
        }];
      } else {
        return [];
      }
    });
  
    return {
      type: "FeatureCollection",
      features: features,
    };
  };

  useEffect(() => {
    const markerData = generateMarkerData();
    const firstMoment = generateFirstMomentMarkers();
    setCurrentAlbum(markerData);
    setFirstMoment(firstMoment);
  }, [albums, openAlbum]);

  const [currentCoordinates, setCurrentCoordinates] = useState<number[]>([
    0, 0,
  ]);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);

    const initialImages = {
      'pin': require('../assets/images/pin.png'),
    };

    const transformedImages = testData.reduce((acc: ImagesState, album) => {
      album.moments.forEach((moment) => {
        const avatarKey = `${moment.id}-avatar`;
        acc[avatarKey] = { uri: moment.createdBy.avatar };

        const imageKey = `${moment.id}-image`;
        acc[imageKey] = { uri: moment.image };
      });
      return acc;
    }, initialImages);
    setImages(transformedImages);
  }, []);

  function isPointGeometry(
    geometry: GeoJSON.Geometry
  ): geometry is GeoJSON.Point {
    return geometry.type === "Point";
  }

    useEffect(() => {
    if(currentAlbum && currentAlbum.features[0]){
    if(openAlbum === "all"){
      setZoomLevel(1)
    }else{
      setZoomLevel(9);
      if (currentAlbum && currentAlbum.features[0].geometry.type === "Point") {
        //console.log("CURRENT ALBUM: ", currentAlbum);
        setCurrentCoordinates(currentAlbum.features[0].geometry.coordinates);
      } else {
        console.log("The geometry is not a point.");
      }
    }
  }
  }, [currentAlbum]);

  function findFeatureMomentByMomentId(
    momentId: string
  ): GeoJSON.Feature<GeoJSON.Geometry>[] {
    return currentAlbum.features.filter(
      (feature) => feature.properties?.momentId === momentId
    );
  }

  useEffect(() => {
    const currentMoment = findFeatureMomentByMomentId(activePhoto);
    if (currentMoment[0] && currentMoment[0].geometry.type === "Point") {
      //console.log("CURRENT MOMENT: ", currentMoment);
      setSelectedMarker(currentMoment[0]);
      const imageUri = images[currentMoment[0].properties?.image]?.uri;
      setSelectedImage(imageUri);
      setZoomLevel(14);
      setCurrentCoordinates(currentMoment[0].geometry?.coordinates);
    }
  }, [activePhoto]);

  const shapeSourceRef = useRef<MapboxGL.ShapeSource>(null);
  const pinShapeSourceRef = useRef<MapboxGL.ShapeSource>(null);

  const handleRegionDidChange = (e: any) => {
    const currentZoomLevel = e.properties.zoomLevel;
    console.log("Current Zoom Level:", currentZoomLevel);
  };

  const camera = useRef<Camera>(null);

  const onMarkerPress = async (e: any) => {
    const feature: Feature<GeoJSON.Geometry> = e.features[0];

    if (feature.properties?.cluster && feature.geometry.type === "Point") {
      var nextZoomLevel = await shapeSourceRef.current?.getClusterExpansionZoom(
        feature
      );
      if (nextZoomLevel === 10) {
        nextZoomLevel = 11;
      }
      const clusterCoordinates = feature.geometry.coordinates;
      if (camera.current) {
        camera.current.setCamera({
          zoomLevel: nextZoomLevel,
          animationDuration: 500,
          centerCoordinate: clusterCoordinates,
          
        });
      }
    } else {
      if (feature.properties?.image && feature.geometry.type === "Point") {
        const imageUri = images[feature.properties.image]?.uri;
        dispatch(setActivePhoto(feature.properties.momentId));
        if (imageUri && camera.current) {
          setSelectedMarker(feature);
          setSelectedImage(imageUri);
          setZoomLevel(14);
          setCurrentCoordinates(feature.geometry.coordinates);
          
        } else {
          console.error("Image URI not found for the selected feature");
        }
      }
    }
  };

  const onPinPress = async (e: any) => {
    const feature: Feature<GeoJSON.Geometry> = e.features[0];
    console.log("PIN PRESS: ", feature)

    if (camera.current && feature.geometry.type === "Point") {
        camera.current.setCamera({
          zoomLevel: 9,
          animationDuration: 1500,
          centerCoordinate: feature.geometry.coordinates,
          padding: { paddingTop: 0, paddingRight: 0, paddingBottom: 175, paddingLeft: 0 }
        });
    }
  };

  const renderPinMarkerLayer = () => (
    <MapboxGL.ShapeSource
      id="pinSource"
      ref={pinShapeSourceRef}
      shape={firstMoment}
      onPress={(e) => onPinPress(e)}
      hitbox={{width: 5, height: 5}}
    >
      <MapboxGL.SymbolLayer
        id="pinSymbols"
        minZoomLevel={1}
        maxZoomLevel={5}
        style={{
          iconImage: 'pin',
          iconAllowOverlap: true,
          iconSize: 0.15,
          iconAnchor: 'bottom',
          iconPitchAlignment: 'viewport',
        }}
      />
          <MapboxGL.SymbolLayer
      id="avatarSymbols"
      minZoomLevel={1}
      maxZoomLevel={5}
      style={{
        iconImage: ["get", "avatar"],
        iconAllowOverlap: true,
        iconSize: 0.27,
        iconOffset: [0, -140],
        iconAnchor: 'bottom',
        iconPitchAlignment: 'viewport',
      }}
    />

    </MapboxGL.ShapeSource>
    
  );
  
  const renderMarkers = () => (
    <MapboxGL.ShapeSource
      id="markerSource"
      ref={shapeSourceRef}
      shape={currentAlbum}
      onPress={(e) => onMarkerPress(e)}
      cluster={true}
      clusterRadius={50}
      maxZoomLevel={10}
      hitbox={{ width: 10, height: 10 }}
    >
      {/* Layer for individual points */}
      <MapboxGL.SymbolLayer
        id="markerSymbols"
        minZoomLevel={9}
        style={{
          iconImage: ["get", "avatar"],
          iconSize: 0.2,
          iconAllowOverlap: true,
        }}
      />
      {/* Layer for cluster circles */}
      <MapboxGL.CircleLayer
        id="clusterCircles"
        belowLayerID="markerSymbols"
        minZoomLevel={5}
        filter={["has", "point_count"]}
        style={{
          circleColor: "#EA2CB3",
          circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          circleOpacity: 0.84,
          circleStrokeWidth: 2,
          circleStrokeColor: "#fff",
        }}
      />
      <MapboxGL.CircleLayer
        id="individualPoints"
        belowLayerID="clusterCircles"
        minZoomLevel={5}
        maxZoomLevel={9}
        filter={["!", ["has", "point_count"]]}
        style={{
          circleColor: "#EA2CB3",
          circleRadius: 20,
          circleOpacity: 0.84,
          circleStrokeWidth: 2,
          circleStrokeColor: "#fff",
        }}
      />
      {/* Layer for cluster counts */}
      <MapboxGL.SymbolLayer
        id="clusterCount"
        filter={["has", "point_count"]}
        style={{
          textField: "{point_count_abbreviated}",
          textSize: 12,
          textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          textColor: "#ffffff",
          textIgnorePlacement: true,
          textAllowOverlap: true,
        }}
      />
      <MapboxGL.SymbolLayer
        id="individualCircle"
        maxZoomLevel={10}
        filter={["!", ["has", "point_count"]]}
        style={{
          textField: "1",
          textSize: 12,
          textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          textColor: "#ffffff",
          textIgnorePlacement: true,
          textAllowOverlap: true,
        }}
      />
    </MapboxGL.ShapeSource>
  );

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          onDidFinishLoadingMap={() => console.log("Map fully loaded")}
          onRegionDidChange={handleRegionDidChange}
          onPress={() => {
            setSelectedMarker(null);
            setSelectedImage(null);
            console.log("Map pressed, marker and image reset");
          }}
          logoPosition={{bottom: 30, left: 8}}
          attributionEnabled={false}
          styleURL={"RNMBXModule.StyleURL.Standard"}
        >
          <MapboxGL.Camera
            ref={camera}
            zoomLevel={zoomLevel}
            minZoomLevel={1}
            centerCoordinate={currentCoordinates}
            padding={{ paddingTop: 0, paddingRight: 0, paddingBottom: 175, paddingLeft: 0 }} 
            pitch={-25}
            
          />
          <MapboxGL.Images images={images} />
          {renderMarkers()}

          {renderPinMarkerLayer()}
          {selectedMarker && isPointGeometry(selectedMarker.geometry) && (
            <MapboxGL.MarkerView
              key={`selectedMarker_${"aedf"}`}
              id={`selectedMarker_${"asedf"}`}
              coordinate={selectedMarker.geometry.coordinates}
              anchor={{ x: 0.5, y: 1.0 }}
            >
              <TouchableOpacity
                onPress={() => openPopup()}
              >
                <View style={styles.calloutView}>
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.popupImage}
                    />
                  )}
                </View>
                <View style={styles.calloutArrow} />
              </TouchableOpacity>
            </MapboxGL.MarkerView>
          )}
        </MapboxGL.MapView>
      </View>
      {selectedAlbum && popupVisible && (
        <PhotoPopup
        album={selectedAlbum}
        isVisible={popupVisible}
        onClose={() => setPopupVisible(false)}
        selectedImage={selectedImage}
      />
      )}

    </View>
  );
};

export default MapComponent;
