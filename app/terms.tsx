import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
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
        <Text className="text-xl font-bold text-text-primary">Nutzungsbedingungen</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs text-text-muted mb-4">Stand: Februar 2026</Text>

        <Text className="text-base font-bold text-text-primary mb-2">1. Geltungsbereich</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Diese Nutzungsbedingungen gelten fuer die Nutzung der mobilen App "LNUP" (Local Nights, Unique Places). Mit der Registrierung und Nutzung der App erklaerst du dich mit diesen Bedingungen einverstanden.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">2. Registrierung</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Fuer die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Du bist verpflichtet, wahrheitsgemaesze Angaben zu machen und dein Konto vor unbefugtem Zugriff zu schuetzen. Du bist fuer alle Aktivitaeten unter deinem Konto verantwortlich.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">3. Nutzungsregeln</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Bei der Nutzung von LNUP ist Folgendes nicht gestattet:{"\n\n"}
          {"\u2022"} Veroeffentlichung falscher oder irreführender Event-Informationen{"\n"}
          {"\u2022"} Beleidigung, Diskriminierung oder Belaestigung anderer Nutzer{"\n"}
          {"\u2022"} Upload von urheberrechtlich geschuetztem Material ohne Erlaubnis{"\n"}
          {"\u2022"} Spam, Werbung oder kommerzielle Inhalte ohne Genehmigung{"\n"}
          {"\u2022"} Manipulation des Punkte- oder Rangsystems{"\n"}
          {"\u2022"} Nutzung der App fuer illegale Zwecke{"\n\n"}
          Verstoesze koennen zur Sperrung des Kontos und zum Verlust aller Punkte fuehren.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">4. Haftung</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          LNUP uebernimmt keine Haftung fuer die Richtigkeit, Vollstaendigkeit oder Aktualitaet der von Nutzern erstellten Events. Die Teilnahme an Events erfolgt auf eigene Verantwortung. LNUP haftet nicht fuer Schaeden, die aus der Nutzung der App entstehen, sofern kein Vorsatz oder grobe Fahrlaessigkeit vorliegt.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">5. Kuendigung</Text>
        <Text className="text-sm text-text-secondary mb-12 leading-5">
          Du kannst dein Konto jederzeit in den Einstellungen loeschen. LNUP behaelt sich das Recht vor, Konten bei Verstoesze gegen diese Bedingungen zu sperren oder zu loeschen. Nach der Kuendigung werden deine Daten gemaesz unserer Datenschutzerklaerung behandelt.
        </Text>
      </ScrollView>
    </View>
  );
}
