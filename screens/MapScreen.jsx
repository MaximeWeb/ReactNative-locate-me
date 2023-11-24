import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { addPlace } from "../reducers/users";

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentLocation(location.coords);
        });
      }
    })();
  }, []);

  const markers = user.places.map((place, i) => {
    return (
      <Marker
        key={i}
        title={place.cityName}
        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      />
    );
  });

  const handleLongPress = (e) => {
    setIsModalVisible(true);
    setTempLocation(e.nativeEvent.coordinate);
  };

  const addPlaceToStore = () => {
    dispatch(
      addPlace({
        cityName: newPlace,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      })
    );
    setIsModalVisible(false);
    setNewPlace("");
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="New place"
              style={styles.input}
              onChangeText={(value) => setNewPlace(value)}
              value={newPlace}
            />
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => addPlaceToStore()}
            >
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => handleClose()}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <MapView
        mapType="hybrid"
        style={styles.map}
        onLongPress={(e) => handleLongPress(e)}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="My location"
            pinColor="yellow"
          />
        )}
        {markers}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
});
