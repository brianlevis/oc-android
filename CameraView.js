import { Camera, CameraType } from "expo-camera";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraView(props) {
  const [type, setType] = useState(CameraType.back);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [saveBackPhoto, setSaveBackPhoto] = useState(true);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    if (cameraPermission.status !== "granted") {
      alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  function onPictureSaved(photo) {
    if (saveBackPhoto) {
      props.onBackCameraPictureSaved(photo);
    } else {
      props.onFrontCameraPictureSaved(photo);
    }
    setSaveBackPhoto(false);
    toggleCameraType();
  }

  function takePhoto() {
    if (this.camera) {
      this.camera.takePictureAsync({
        onPictureSaved: onPictureSaved,
      });
    }
  }

  function getTakePhotoText() {
    return `Take ${type === CameraType.back ? "back" : "front"} photo`;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          this.camera = ref;
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>{getTakePhotoText()}</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
