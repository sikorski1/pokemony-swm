import { useThemeColor } from "@/hooks/useThemeColor";
import QRCode from "react-native-qrcode-svg";
type Props = {
  deepLink: string;
};
export default function QrCode({ deepLink }: Props) {
  return (
    <QRCode
      value={deepLink}
    />
  );
}
