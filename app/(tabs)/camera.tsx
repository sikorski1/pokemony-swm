import BottomSheet from "@/components/BottomSheet";
import BottomSheetContent from "@/components/BottomSheetContent";
import { Colors } from "@/constants/Colors";
import { useAnimatedCorner } from "@/hooks/useAnimatedCorner";
import { useGetFavouritePokemon } from "@/hooks/usePokemon";
import { Pokemon } from "@/types/pokemon";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { storage } from "@/utils/storage";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { PlatformPressable } from "@react-navigation/elements";
import { useIsFocused } from "@react-navigation/native";
import {
  CameraType,
  CameraView,
  Point,
  useCameraPermissions,
} from "expo-camera";
import { LocationObject } from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import Animated from "react-native-reanimated";
import Toast, { ToastShowParams } from "react-native-toast-message";
type CornerPointsSize = {
  width: number;
  height: number;
  opacity: number;
};
export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cornerPoints, setCornerPoints] = useState<Point[] | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [favouritePokemon, setFavouritePokemon] =
    useMMKVString("favouritePokemon");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const isFocused = useIsFocused();
  const [bottomSheetPokemon, setBottomSheetPokemon] = useState<Pokemon | null>(
    null,
  );
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { name } = useLocalSearchParams();
  const { data: singlePokemonData } = useGetFavouritePokemon(name as string);
  const [cornerPointsSize, setCornerPointsSize] =
    useState<CornerPointsSize | null>(null);
  const cornerResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leftTopStyle = useAnimatedCorner(
    cornerPoints?.[0]?.x,
    cornerPoints?.[0]?.y,
  );
  const leftBottomStyle = useAnimatedCorner(
    cornerPoints?.[1]?.x,
    cornerPoints?.[1]?.y,
  );
  const rightBottomStyle = useAnimatedCorner(
    cornerPoints?.[2]?.x,
    cornerPoints?.[2]?.y,
  );
  const rightTopStyle = useAnimatedCorner(
    cornerPoints?.[3]?.x,
    cornerPoints?.[3]?.y,
  );
  const theme = useColorScheme();
  const handlePokemonCatch = (pokemonName: string) => {
    Toast.hide();
    setIsToastVisible(false);
    setIsBottomSheetOpen(true);
    router.replace({
      pathname: "/camera",
      params: { name: pokemonName },
    });
  };
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const handleShowToast = (params: ToastShowParams) => {
    Toast.show(params);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetPokemon(null);
    setIsBottomSheetOpen(false);
    router.replace({ pathname: "/camera", params: {} });
  };
  const handleAddToFavorite = (name: string) => {
    setFavouritePokemon(name);
  };
  const handleGetCurrentLocationOnSuccess = useCallback(
    (location: LocationObject) => {
      if (singlePokemonData) {
        setBottomSheetPokemon(singlePokemonData);
        bottomSheetRef.current?.present();
        handleShowToast({
          type: "success",
          text1: `${singlePokemonData.name.charAt(0).toUpperCase() + singlePokemonData.name.slice(1)} saved!`,
        });
        const newMarker = {
          name:
            singlePokemonData.name.charAt(0).toUpperCase() +
            singlePokemonData.name.slice(1),
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
        const currentMarkers = storage.getString("markers");
        const parsed = currentMarkers ? JSON.parse(currentMarkers) : {};
        parsed[singlePokemonData.name] = newMarker;
        storage.set("markers", JSON.stringify(parsed));
      }
    },
    [singlePokemonData],
  );
  const handleGetCurrentLocationOnError = useCallback(() => {
    if (singlePokemonData) {
      handleShowToast({
        type: "error",
        text1: `${singlePokemonData.name.charAt(0).toUpperCase() + singlePokemonData.name.slice(1)} couldn't be saved!`,
        text2: "Turn on location permission in settings",
      });
    }
  }, [singlePokemonData]);
  useEffect(() => {
    (async () =>
      await getCurrentLocation({
        handleOnError: handleGetCurrentLocationOnError,
        handleOnSuccess: handleGetCurrentLocationOnSuccess,
      }))();
  }, [handleGetCurrentLocationOnSuccess, handleGetCurrentLocationOnError]);

  useEffect(() => {
    if (!cornerPoints) return;

    if (cornerResetTimeoutRef.current) {
      clearTimeout(cornerResetTimeoutRef.current);
    }
    cornerResetTimeoutRef.current = setTimeout(() => {
      setCornerPoints(null);
      setCornerPointsSize((prev) => ({ ...prev!, opacity: 0 }));
    }, 500);

    return () => {
      if (cornerResetTimeoutRef.current) {
        clearTimeout(cornerResetTimeoutRef.current);
      }
    };
  }, [cornerPoints]);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <PlatformPressable onPress={requestPermission}>
          <Text>Grant permission</Text>
        </PlatformPressable>
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={(scan) => {
            if (!isBottomSheetOpen && isFocused) {
              setCornerPoints(scan.cornerPoints);
              setCornerPointsSize({
                width: scan.bounds.size.width / 3,
                height: scan.bounds.size.height / 3,
                opacity: 1,
              });
              if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
                toastTimeoutRef.current = null;
              }
              if (!isToastVisible) {
                toastTimeoutRef.current = setTimeout(() => {
                  setIsToastVisible(true);
                  handleShowToast({
                    type: "saveButton",
                    onPress: () => handlePokemonCatch(scan.data.split("=")[1]),
                    text1: "Catch a pokemon!",
                    onHide: () => setIsToastVisible(false),
                  });
                }, 200);
              }
            }
          }}
          facing={facing}
        >
          <View style={styles.buttonContainer}>
            <PlatformPressable
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </PlatformPressable>
          </View>
          <Animated.View
            style={[
              {
                borderLeftWidth: 2,
                borderTopWidth: 2,
                borderColor: Colors[theme ?? "light"]["bgRedPrimary"],
              },
              styles.corner,
              cornerPointsSize,
              leftTopStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                transform: [{ translateY: -(cornerPointsSize?.height || 0) }],
                borderColor: Colors[theme ?? "light"]["bgRedPrimary"],
              },
              styles.corner,
              leftBottomStyle,
              cornerPointsSize,
            ]}
          />
          <Animated.View
            style={[
              {
                borderRightWidth: 2,
                borderBottomWidth: 2,
                transform: [
                  { translateX: -(cornerPointsSize?.width || 0) },
                  { translateY: -(cornerPointsSize?.height || 0) },
                ],
                borderColor: Colors[theme ?? "light"]["bgRedPrimary"],
              },
              styles.corner,
              cornerPointsSize,
              rightBottomStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                borderTopWidth: 2,
                borderRightWidth: 2,
                transform: [{ translateX: -(cornerPointsSize?.width || 0) }],
                borderColor: Colors[theme ?? "light"]["bgRedPrimary"],
              },
              styles.corner,
              cornerPointsSize,
              rightTopStyle,
            ]}
          />
        </CameraView>
      </View>
      <BottomSheet ref={bottomSheetRef} onDismiss={handleCloseBottomSheet}>
        {bottomSheetPokemon !== null ? (
          <BottomSheetContent
            pokemon={bottomSheetPokemon}
            handleAddToFavorite={handleAddToFavorite}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    position: "relative",
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
  corner: {
    position: "absolute",
  },
});
