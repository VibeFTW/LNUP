import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen() {
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
        <Text className="text-xl font-bold text-text-primary">Datenschutz</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs text-text-muted mb-4">Stand: Februar 2026</Text>

        <Text className="text-base font-bold text-text-primary mb-2">1. Verantwortlicher</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:{"\n\n"}
          [Dein Name]{"\n"}
          [Deine Adresse]{"\n"}
          E-Mail: kontakt@lnup.app
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">2. Erhobene Daten</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Bei der Nutzung von LNUP werden folgende Daten erhoben:{"\n\n"}
          {"\u2022"} Kontodaten: E-Mail-Adresse, Benutzername, Passwort (verschluesselt){"\n"}
          {"\u2022"} Nutzungsdaten: Erstellte Events, gespeicherte Events, hochgeladene Fotos{"\n"}
          {"\u2022"} Technische Daten: Geraetetyp, Betriebssystem, App-Version{"\n"}
          {"\u2022"} Standortdaten: Nur bei aktiver Nutzung der Kartenfunktion, nicht im Hintergrund
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">3. Zweck der Datenverarbeitung</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Deine Daten werden ausschliesslich verwendet fuer:{"\n\n"}
          {"\u2022"} Bereitstellung und Verbesserung der App-Funktionen{"\n"}
          {"\u2022"} Anzeige relevanter Events in deiner Naehe{"\n"}
          {"\u2022"} Verwaltung deines Benutzerkontos und Rangsystems{"\n"}
          {"\u2022"} Moderation von Inhalten (Events, Fotos, Meldungen)
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">4. Speicherdauer</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Deine Daten werden gespeichert, solange dein Konto aktiv ist. Nach Loeschung deines Kontos werden alle personenbezogenen Daten innerhalb von 30 Tagen unwiderruflich geloescht.
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">5. Deine Rechte</Text>
        <Text className="text-sm text-text-secondary mb-4 leading-5">
          Du hast das Recht auf:{"\n\n"}
          {"\u2022"} Auskunft ueber deine gespeicherten Daten{"\n"}
          {"\u2022"} Berichtigung unrichtiger Daten{"\n"}
          {"\u2022"} Loeschung deiner Daten{"\n"}
          {"\u2022"} Einschraenkung der Verarbeitung{"\n"}
          {"\u2022"} Datenuebertragbarkeit{"\n"}
          {"\u2022"} Widerspruch gegen die Verarbeitung{"\n\n"}
          Wende dich dazu an: kontakt@lnup.app
        </Text>

        <Text className="text-base font-bold text-text-primary mb-2">6. Kontakt</Text>
        <Text className="text-sm text-text-secondary mb-12 leading-5">
          Bei Fragen zum Datenschutz erreichst du uns unter:{"\n"}
          kontakt@lnup.app
        </Text>
      </ScrollView>
    </View>
  );
}
