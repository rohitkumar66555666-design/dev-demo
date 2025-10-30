import { useWindowDimensions, ScrollView, Image, Text } from "react-native";
import { Tables } from "../types/database.types";

export default function AssetItem({ asset }: { asset: Tables<'assets'> }) {
  const { width } = useWindowDimensions();
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
  if (!asset.asset_id) return null;
  // Detect type by extension for future (video support)
  const isVideo = asset.asset_id.match(/\.(mp4|mov)$/i);
  const url = `${SUPABASE_URL}/storage/v1/object/public/photos/${asset.asset_id}`;
  return (
    <ScrollView>
      {!isVideo ? (
        <Image
          source={{ uri: url }}
          style={{ width, height: width * 0.6, backgroundColor: "#111" }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: "white" }}>Video support coming soon...</Text>
      )}
    </ScrollView>
  );
}