import { colorPalette } from "@/modules/shared/theme";
import { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  name: string;
  variant?: "groom" | "bride";
}

export const Avatar: FC<AvatarProps> = ({ name, variant = "bride" }) => {
  return (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <View style={styles.border}>
        <Image
          source={
            variant === "groom"
              ? require("./../../../assets/images/groom.jpeg")
              : require("./../../../assets/images/bride.jpeg")
          }
          style={styles.avatar}
        />
      </View>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  border: {
    borderWidth: 4,
    borderColor: colorPalette.secondary,
    borderRadius: 100,
  },
  text: { color: "white", paddingTop: 12, fontSize: 20 },
});
