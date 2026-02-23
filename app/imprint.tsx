import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ImprintScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-primary">Impressum</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-base font-bold text-text-primary mb-2">Angaben gemaesz § 5 TMG</Text>
        <Text className="text-sm text-text-secondary mb-6 leading-5">
          [Dein vollstaendiger Name]{"\n"}
          [Strasse und Hausnummer]{"\n"}
          [PLZ und Ort]{"\n"}
          Deutschland
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">Kontakt</Text>
        <Text className="text-sm text-text-secondary mb-6 leading-5">
          E-Mail: kontakt@lnup.app
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">Verantwortlich fuer den Inhalt nach § 55 Abs. 2 RStV</Text>
        <Text className="text-sm text-text-secondary mb-6 leading-5">
          [Dein vollstaendiger Name]{"\n"}
          [Adresse wie oben]
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">Haftungsausschluss</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Die Inhalte dieser App wurden mit groesztmoeglicher Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der von Nutzern erstellten Inhalte uebernehmen wir keine Gewaehr.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">Urheberrecht</Text>
        <Text className="text-sm text-text-secondary mb-12 leading-5">
          Die durch den Betreiber erstellten Inhalte und Werke in dieser App unterliegen dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung und Verbreitung auszserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </Text>
      </ScrollView>
    </View>
  );
}
