import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ref } from "react";
export default function BottomSheet({
  ref,
  children,
}: {
  ref: Ref<BottomSheetModal>;
  children: React.ReactNode;
}) {
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
      handleStyle={{ backgroundColor: useThemeColor({}, "bgSoftPrimary") }}
      handleIndicatorStyle={{
        backgroundColor: useThemeColor({}, "bgStrongPrimary"),
      }}
    >
      <BottomSheetView
        style={{ backgroundColor: useThemeColor({}, "bgSoftPrimary") }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
