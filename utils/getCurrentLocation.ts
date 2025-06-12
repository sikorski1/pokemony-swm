import * as Location from "expo-location";
type CurrentLocationType = {
  handleOnError: () => void;
  handleOnSuccess: (location: Location.LocationObject) => void;
};
export const getCurrentLocation = async ({handleOnError, handleOnSuccess}:CurrentLocationType) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    handleOnError();
    return;
  }
  let location = await Location.getCurrentPositionAsync({});
  handleOnSuccess(location);
};
