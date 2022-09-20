import {
  StyleSheet,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
  Share,
} from "react-native";
import { useState } from "react";

import { captureRef } from "react-native-view-shot";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";

export default function DisplayPhotoView(props) {
  [hideButtons, setHideButtons] = useState(false);
  [imageUri, setImageUri] = useState("");

  async function makeImageUri() {
    setHideButtons(true);
    resultUri = await captureRef(this.imageRef);
    setImageUri(resultUri);
  }

  async function savePhoto() {
    await makeImageUri();
    props.onSave(imageUri);
  }

  async function sharePhoto() {
    await makeImageUri();
    await Share.share({
      url: imageUri,
    });
  }
  return (
    <View>
      <ImageBackground
        style={styles.container}
        source={{ uri: props.backCameraImageUri }}
        ref={(ref) => {
          this.imageRef = ref;
        }}
      >
        <Image
          style={styles.smallImage}
          source={{ uri: props.frontCameraImageUri }}
        />
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={sharePhoto}>
          <EvilIcons name="share-apple" size={72} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={props.onCancel}>
          <EvilIcons name="close" size={72} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    zIndex: 0,
  },
  smallImage: {
    zIndex: 2,
    height: "30%",
    width: "40%",
    marginLeft: "5%",
    marginTop: "-120%",
    borderColor: "black",
    borderWidth: "2px",
    borderRadius: "25px",
    transform: [{ scaleX: -1 }],
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    height: "20%",
    width: "100%",
    zIndex: 2,
    justifyContent: "center",
  },
  button: {
    marginTop: "-30%",
    marginHorizontal: "5%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
