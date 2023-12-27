import {
  StyleSheet,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Share,
  PanResponder,
  Animated,
} from "react-native";
import { useState, useRef } from "react";


import { captureRef } from "react-native-view-shot";
import { EvilIcons } from "@expo/vector-icons";

export default function DisplayPhotoView(props) {
  [hideButtons, setHideButtons] = useState(false);
  [imageUri, setImageUri] = useState("");


  // For dragging
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;




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
        {
          props.frontCameraImageUri &&
            <Animated.View
              style={{...styles.smallImageContainer, transform: [{ translateX: pan.x }, { translateY: pan.y }]}}
              {...panResponder.panHandlers}
            >
              <Image
                source={{ uri: props.frontCameraImageUri }}
                style={styles.smallImage}
              />
            </Animated.View>
        }
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
  smallImageContainer: {
    height: "30%",
    width: "40%",
    marginLeft: "5%",
    marginTop: "-120%",
  },
  smallImage: {
    flex: 1,
    borderWidth: "2px",
    borderRadius: "25px",
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
