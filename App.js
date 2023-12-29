import { useState } from "react";
import CameraView from "./CameraView";
import * as MediaLibrary from "expo-media-library";
import DisplayPhotoView from "./DisplayPhotoView";
import { Alert } from "react-native";
import Aptabase from "@aptabase/react-native";

Aptabase.init("A-US-9385020089");

export default function App() {
  const [takenPhoto, setTakenPhoto] = useState(false);
  const [backCameraImageUri, setBackCameraImageUri] = useState("");
  const [frontCameraImageUri, setFrontCameraImageUri] = useState("");
  const [mediaLibraryPermissionsStatus, mediaLibraryUsePermissions] =
    MediaLibrary.usePermissions();

  function onBackCameraPictureSaved(photo) {
    setBackCameraImageUri(photo.uri);
  }

  function onFrontCameraPictureSaved(photo) {
    setFrontCameraImageUri(photo.uri);
    setTakenPhoto(true);
  }

  function onCancel() {
    setTakenPhoto(false);
    setBackCameraImageUri("");
    setFrontCameraImageUri("");
  }

  function onSave(resultUri) {
    MediaLibrary.saveToLibraryAsync(resultUri).then(() => {
      Alert.alert("Saved photo!");
      onCancel();
    });
  }

  return takenPhoto ? (
    <DisplayPhotoView
      backCameraImageUri={backCameraImageUri}
      frontCameraImageUri={frontCameraImageUri}
      onCancel={onCancel}
      onSave={onSave}
    />
  ) : (
    <CameraView
      onBackCameraPictureSaved={onBackCameraPictureSaved}
      onFrontCameraPictureSaved={onFrontCameraPictureSaved}
    />
  );
}
