import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilterStore } from "@/stores/filterStore";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { id: SortOption; label: string; icon: string }[] = [
  { id: "date", label: "Datum (Standard)", icon: "calendar-outline" },
  { id: "popular", label: "Beliebtheit", icon: "trending-up" },
  { id: "newest", label: "Neueste zuerst", icon: "time-outline" },
];

interface SortDropdownProps {
  visible: boolean;
  onClose: () => void;
}

export function SortDropdown({ visible, onClose }: SortDropdownProps) {
  const sortBy = useFilterStore((s) => s.sortBy);
  const setSortBy = useFilterStore((s) => s.setSortBy);

  const handleSelect = (option: SortOption) => {
    setSortBy(option);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className="absolute top-28 right-4 w-56 bg-card border border-border rounded-2xl overflow-hidden">
          {SORT_OPTIONS.map((option, i) => {
            const isSelected = sortBy === option.id;
            const isLast = i === SORT_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                className={`flex-row items-center px-4 py-3.5 gap-3 ${
                  isLast ? "" : "border-b border-border"
                }`}
              >
                <Ionicons
                  name={option.icon as any}
                  size={18}
                  color={isSelected ? "#6C5CE7" : "#A0A0B8"}
                />
                <Text
                  className={`flex-1 text-sm ${
                    isSelected ? "text-primary font-semibold" : "text-text-primary"
                  }`}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={18} color="#6C5CE7" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
