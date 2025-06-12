import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ref } from "react";
type Props = {
  ref: Ref<BottomSheetModal>;
  children: React.ReactNode;
  onDismiss?: () => void;
};
export default function BottomSheet({ ref, children, onDismiss }: Props) {
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
      handleStyle={{
        backgroundColor: useThemeColor({}, "bgSoftPrimary"),
        borderRadius: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor: useThemeColor({}, "bgStrongPrimary"),
      }}
      onDismiss={onDismiss}
    >
      <BottomSheetView
        style={{
          backgroundColor: useThemeColor({}, "bgSoftPrimary"),
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
