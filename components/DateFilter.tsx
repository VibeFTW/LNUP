import { ScrollView, TouchableOpacity, Text, Platform } from "react-native";
import { DATE_FILTERS } from "@/lib/categories";
import type { DateFilter as DateFilterType } from "@/types";

interface DateFilterProps {
  selected: DateFilterType;
  onSelect: (filter: DateFilterType) => void;
}

export function DateFilter({ selected, onSelect }: DateFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      contentContainerClassName="px-4 gap-2"
      style={{ flexShrink: 0 }}
    >
      {DATE_FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => onSelect(filter.id)}
          className={`rounded-full px-4 py-2 ${
            selected === filter.id
              ? "bg-primary"
              : "bg-card border border-border"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selected === filter.id ? "text-white" : "text-text-secondary"
            }`}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
