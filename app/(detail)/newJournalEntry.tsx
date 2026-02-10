import { ThemedText } from '@/components/themed-text';
import { ThemedView } from "@/components/themed-view";
import { truncate } from '@/services/utils';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, useColorScheme } from "react-native";

const NewJournalEntryScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const inputRef = useRef<TextInput>(null);

  const [selectedTags, setSelectedTags] = useState<{ text: string, isPermanent: boolean }[]>([]);
  const [content, setContent] = useState("");
  const MAX_CHARS = 5000;
  const [charsLeft, setCharsLeft] = useState(MAX_CHARS);

  const handleChangeContent = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setCharsLeft(MAX_CHARS - text.length);
    }
  };

  const toggleTag = (tag: { text: string, isPermanent: boolean }) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    if (!tag.isPermanent) {
      setTags(prev => prev.filter(t => t !== tag));
    }
  };

  const [tags, setTags] = useState([
    { text: "happy", isPermanent: true },
    { text: "anxious", isPermanent: true },
    { text: "creative", isPermanent: true },
    { text: "tired", isPermanent: true },
    { text: "focused", isPermanent: true },
    { text: "bored", isPermanent: true },
    { text: "nostalgic", isPermanent: true },
    { text: "alone", isPermanent: true },
    { text: "sick", isPermanent: true },
    { text: "studying", isPermanent: true },
    { text: "working", isPermanent: true },
  ]);

  const [addingTag, setAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');

  const handleNewTagText = () => {
    if (newTagText.trim() !== "") {
      const newTag = { text: newTagText.trim(), isPermanent: false };

      setSelectedTags([...selectedTags, newTag]);
      setTags(prev => [...prev, newTag]);
      setNewTagText("");
    }
    setAddingTag(false);
  }

  const handleSave = () => navigation.goBack();

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <ThemedView style={{ flex: 1, backgroundColor: isDark ? "#0c0c0c" : "#fafaf9" }}>
      {/* Header */}
      <ThemedView style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: isDark ? "#1f2933" : "#e7e5e4" }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="close" size={24} color={isDark ? "#a8a29e" : "#78716c"} />
        </Pressable>

        <ThemedText style={{ fontSize: 18, fontWeight: "700" }}>New entry</ThemedText>

        <Pressable onPress={handleSave} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: isDark ? "#e7e5e4" : "#1c1917" }}>
          <ThemedText style={{ fontSize: 13, fontWeight: "600", color: isDark ? "#1c1917" : "#ffffff" }}>Save</ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView contentContainerStyle={{ padding: 24, flex: 1 }}>
        {/* Tags */}
        <ThemedView style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
          <ThemedText style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: isDark ? "#78716c" : "#a8a29e", marginBottom: 8 }}>
            HOW ARE YOU FEELING?
          </ThemedText>

          <ScrollView
            style={{ maxHeight: 180, backgroundColor: 'transparent' }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
          >
            {tags.map(tag => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag.text}
                  onPress={() => toggleTag(tag)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, backgroundColor: selected ? (isDark ? "#064e3b" : "#d1fae5") : (isDark ? "#0c0c0c" : "#ffffff"), borderColor: selected ? (isDark ? "#047857" : "#a7f3d0") : (isDark ? "#262626" : "#e7e5e4") }}
                >
                  <ThemedText style={{ fontSize: 13, fontWeight: "500", color: selected ? (isDark ? "#d1fae5" : "#065f46") : (isDark ? "#a8a29e" : "#78716c") }}>
                    {truncate(tag.text, 20)}
                  </ThemedText>
                </Pressable>
              );
            })}

            {!addingTag ? (
              <Pressable
                onPress={() => setAddingTag(true)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderStyle: "dashed", borderColor: isDark ? "#404040" : "#d6d3d1" }}
              >
                <Ionicons name="add" size={14} color={isDark ? "#a8a29e" : "#78716c"} />
                <ThemedText style={{ fontSize: 13, fontWeight: "500", color: isDark ? "#a8a29e" : "#78716c" }}>
                  Add tag
                </ThemedText>
              </Pressable>
            ) : (
              <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 0, borderRadius: 999, borderWidth: 1, borderStyle: "dashed", borderColor: isDark ? "#404040" : "#d6d3d1" }}>
                <TextInput
                  maxLength={100}
                  value={newTagText}
                  onChangeText={setNewTagText}
                  onSubmitEditing={() => handleNewTagText()}
                  autoFocus
                  placeholder="New tag"
                  placeholderTextColor={isDark ? "#a8a29e" : "#78716c"}
                  style={{ fontSize: 13, fontWeight: "500", color: isDark ? "#e7e5e4" : "#1c1917", minWidth: 60, maxWidth: 280 }}
                />
                <Pressable onPress={() => handleNewTagText()}>
                  <Ionicons name="checkmark" size={16} color={isDark ? "#a8a29e" : "#78716c"} />
                </Pressable>
              </ThemedView>
            )}
          </ScrollView>
        </ThemedView>

        {/* Content */}
        <Pressable onPress={() => inputRef.current?.focus()} style={{ flex: 1 }}>
          <ThemedView style={{ minHeight: 300, backgroundColor: 'transparent', flex: 1 }}>
            <TextInput
              ref={inputRef}
              value={content}
              onChangeText={handleChangeContent}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? "#525252" : "#d6d3d1"}
              multiline
              // autoFocus
              style={{ fontSize: 18, lineHeight: 26, color: isDark ? "#e7e5e4" : "#1c1917" }}
            />
          </ThemedView>

        </Pressable>
      </ScrollView>

      <ThemedView style={{backgroundColor: 'transparent'}}>
        <ThemedText style={{ marginLeft: 'auto', padding: 8 }}>
          {MAX_CHARS - charsLeft} / {MAX_CHARS}
        </ThemedText>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: isDark ? "#1f2933" : "#e7e5e4", alignItems: "center" }}>
        <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: isDark ? "#1c1917" : "#f5f5f4" }}>
          <Ionicons name="calendar-outline" size={12} color={isDark ? "#a8a29e" : "#78716c"} />
          <ThemedText style={{ fontSize: 12, fontWeight: "500", color: isDark ? "#a8a29e" : "#78716c" }}>
            Today at {timeString}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default NewJournalEntryScreen;
