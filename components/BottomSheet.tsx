import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ref } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function BottomSheet({ ref }: { ref: Ref<BottomSheetModal> }) {
  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetView>
        <SafeAreaView edges={["bottom"]}>
          <Text>123</Text>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
