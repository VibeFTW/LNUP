import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useToastStore } from "@/stores/toastStore";
import { COLORS } from "@/lib/constants";
import type { ReportReason } from "@/types";

const REASONS: { id: ReportReason; label: string; icon: string }[] = [
  { id: "fake", label: "Fake Event", icon: "alert-circle-outline" },
  { id: "wrong_info", label: "Falsche Infos", icon: "information-circle-outline" },
  { id: "spam", label: "Spam", icon: "megaphone-outline" },
  { id: "duplicate", label: "Duplikat", icon: "copy-outline" },
];

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string;
}

export function ReportModal({ visible, onClose, eventId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const showToast = useToastStore((s) => s.showToast);

  const handleSubmit = () => {
    if (!selectedReason) return;
    // TODO: Submit to Supabase
    showToast("Event wurde gemeldet. Danke!", "success");
    setSelectedReason(null);
    setDetails("");
    onClose();
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDetails("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-background rounded-t-3xl px-4 pt-6 pb-10">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold text-text-primary">Event melden</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6B6B80" />
            </TouchableOpacity>
          </View>

          {/* Reason Options */}
          <Text className="text-sm text-text-secondary mb-3">Warum meldest du dieses Event?</Text>
          <View className="gap-2 mb-4">
            {REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <TouchableOpacity
                  key={reason.id}
                  onPress={() => setSelectedReason(reason.id)}
                  className={`flex-row items-center gap-3 px-4 py-3.5 rounded-xl border ${
                    isSelected ? "bg-primary/10 border-primary/40" : "bg-card border-border"
                  }`}
                >
                  <Ionicons
                    name={reason.icon as any}
                    size={20}
                    color={isSelected ? "#6C5CE7" : "#A0A0B8"}
                  />
                  <Text
                    className={`text-sm ${
                      isSelected ? "text-primary font-semibold" : "text-text-primary"
                    }`}
                  >
                    {reason.label}
                  </Text>
                  {isSelected && (
                    <View className="flex-1 items-end">
                      <Ionicons name="checkmark-circle" size={20} color="#6C5CE7" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Optional Details */}
          <Text className="text-sm text-text-secondary mb-1.5">Details (optional)</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Beschreibe das Problem..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-sm mb-5 min-h-[80px]"
          />

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!selectedReason}
            className={`rounded-xl py-4 items-center ${
              selectedReason ? "bg-danger" : "bg-danger/30"
            }`}
          >
            <Text className="text-white font-bold text-base">Melden</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
