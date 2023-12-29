import { Camera, CameraType, requestCameraPermissionsAsync } from "expo-camera";
import { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ActivityIndicator } from "react-native";
import { trackEvent } from "@aptabase/react-native";


export default function CameraView(props) {
  const [type, setType] = useState(CameraType.back);
  const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions();
  const [tookBackPhoto, setTookBackPhoto] = useState(false);
  const [backCameraImageUri, setBackCameraImageUri] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const [takePhotoCount, setTakePhotoCount] = useState(0);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function onPictureSaved(photo, backPhoto) {
    if (backPhoto) {
      setTookBackPhoto(true);
      setBackCameraImageUri(photo.uri);
      props.onBackCameraPictureSaved(photo);
    } else {
      props.onFrontCameraPictureSaved(photo);
    }
  }

  async function getCameraPermission() {
    const cameraPermission = await requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.granted);
  }

  async function takePhoto() {
    if (!cameraReady) {
      return;
    }
    if (!cameraRef) {
      return;
    }
    setTakePhotoCount(takePhotoCount + 1);
    trackEvent("increment", { takePhotoCount });

    await cameraRef.current.takePictureAsync({
      onPictureSaved: (photo) => onPictureSaved(photo, true),
    });
    toggleCameraType();
    setTimeout(
      async () => {
        await cameraRef.current.takePictureAsync({
          onPictureSaved: (photo) => onPictureSaved(photo, false),
        })
      }, 1000
    )

  }

  function getTakePhotoText() {
    return `Take photo`;
  }

  return (
    <View style={styles.container}>
      {cameraPermission && cameraPermission.granted ?

        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
        >{
            tookBackPhoto ?
              <ImageBackground
                source={{ uri: backCameraImageUri }}
                style={styles.container}
              >
                <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
              </ImageBackground>
              :
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={async () => { await takePhoto() }}>
                  <Text style={styles.text}>{getTakePhotoText()}</Text>
                </TouchableOpacity>
              </View>
          }
        </Camera>




        : <TouchableOpacity style={styles.askPermissionButton} onPress={getCameraPermission} >
          <Text>
            Camera permission not granted, click here to grant permission
          </Text>
        </TouchableOpacity>
      }
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  askPermissionButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    justifyContent: "center",
  },
});
