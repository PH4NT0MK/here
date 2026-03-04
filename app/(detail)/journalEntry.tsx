import { ThemedText } from '@/components/themed-text';
import { ThemedView } from "@/components/themed-view";
import { energyLevels } from '@/constants/energyLevels';
import { defaultTags } from '@/constants/tags';
import { addJournalEntry, updateJournalEntry } from '@/services/journal';
import { formatJournalDate, truncate } from '@/services/utils';
import { JournalEntry } from '@/types/journal';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, useColorScheme } from "react-native";
import { useAuth } from '../../context/authContext';
import { useJournal } from '../../context/journalContext';

const JournalEntryScreen = () => {
  const { id = null } = useLocalSearchParams();

  const { entries, setEntries } = useJournal();

  const [entry, setEntry] = useState(null as JournalEntry | null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();

  const navigation = useNavigation();

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const inputRef = useRef<TextInput>(null);

  const [selectedTags, setSelectedTags] = useState<{ text: string, isPermanent: boolean }[]>([]);
  const [content, setContent] = useState("");
  const MAX_CHARS = 5000;
  const [charsLeft, setCharsLeft] = useState(MAX_CHARS);

  const [energy, setEnergy] = useState(3);

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

  const [tags, setTags] = useState([...defaultTags]);

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
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    const newEntryData = {
      content,
      tags: selectedTags.map(tag => tag.text),
      energy,
    };

    if (isCreating) {
      const newEntry = await addJournalEntry(user.uid, newEntryData);

      setEntries(prev => [
        { id: newEntry.id, ...newEntryData, createdAt: Date.now(), updatedAt: Date.now() },
        ...prev,
      ]);
    }

    if (isEditing && entry) {
      await updateJournalEntry(user.uid, entry.id, newEntryData);

      setEntries(prev =>
        prev.map(e =>
          e.id === entry.id ? { ...e, ...newEntryData, updatedAt: Date.now() } : e
        )
      );
    }

    navigation.goBack();
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!id) {
      setIsCreating(true);
    } else {

      const entry = entries.find(e => e.id === id);

      if (!entry) {
        return;
      }

      setEntry(entry);

      if (!entry?.tags?.length) {
        setContent('');
        setSelectedTags([]);
        setTags([...defaultTags]);
        return;
      }

      setContent(entry.content);

      setTags(prevTags => {
        const updatedTags = [...prevTags];
        const resolvedSelected: { text: string; isPermanent: boolean }[] = [];

        entry.tags.forEach((text: string) => {
          let existing = updatedTags.find(t => t.text === text);

          if (!existing) {
            existing = { text, isPermanent: false };
            updatedTags.push(existing);
          }

          resolvedSelected.push(existing);
        });

        setSelectedTags(resolvedSelected);

        return updatedTags;
      });
    }
  }, [id, entries]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: isDark ? "#0c0c0c" : "#fafaf9" }}>
      {/* Header */}
      <ThemedView style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: isEditing || isCreating ? 'row-reverse' : 'row', alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: isDark ? "#1f2933" : "#e7e5e4" }}>

        {(isEditing || isCreating) && <Pressable onPress={handleSave} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: isDark ? "#e7e5e4" : "#1c1917" }}>
          <ThemedText style={{ fontSize: 13, fontWeight: "600", color: isDark ? "#1c1917" : "#ffffff" }}>Save</ThemedText>
        </Pressable>}

        {!isEditing && !isCreating && <Pressable onPress={() => setIsEditing(true)} style={{ padding: 6 }}>
          <Ionicons name="pencil" size={24} color={isDark ? "#a8a29e" : "#78716c"} />
        </Pressable>}

        <ThemedText style={{ fontSize: 18, fontWeight: "700", textAlign: 'center' }}>{isCreating ? 'New entry' : truncate(entry?.content ?? '', 24)}</ThemedText>

        <Pressable onPress={() => isEditing ? setIsEditing(false) : navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="close" size={24} color={isDark ? "#a8a29e" : "#78716c"} />
        </Pressable>
      </ThemedView>

      <ScrollView contentContainerStyle={{ padding: 24, flex: 1 }}>

        {(isEditing || isCreating) && <ThemedView style={{ flexDirection: 'column', gap: 12, marginBottom: 16, backgroundColor: 'transparent' }}>
          {/* Header */}
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' }}>
            <Ionicons name="flash" size={14} color={scheme === 'light' ? '#a1a1aa' : '#71717a'} />
            <ThemedText style={{ fontSize: 12, fontWeight: 'bold', color: scheme === 'light' ? '#a1a1aa' : '#71717a', letterSpacing: 1 }}>
              ENERGY LEVEL
            </ThemedText>
          </ThemedView>

          {/* Scrollable Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingBottom: 4, margin: 2, paddingRight: 8 }}>
            {energyLevels.map(level => (
              <Pressable
                key={level.value}
                onPress={() => setEnergy(level.value)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: energy === level.value ? level.borderColor : scheme === 'light' ? '#e5e7eb' : '#52525b',
                  backgroundColor: energy === level.value ? level.bgColor : scheme === 'light' ? '#ffffff' : '#1f1f1f',
                  transform: [{ scale: energy === level.value ? 1.05 : 1 }],
                }}
              >
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: energy === level.value ? level.textColor : scheme === 'light' ? '#52525b' : '#d4d4d8' }}>
                  {level.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>}

        {/* Tags */}
        <ThemedView style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
          <ThemedText style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: isDark ? "#78716c" : "#a8a29e", marginBottom: 8 }}>
            {isEditing || isCreating ? 'HOW ARE YOU FEELING?' : 'HOW YOU WERE FEELING'}
          </ThemedText>

          <ScrollView
            style={{ maxHeight: 180, backgroundColor: 'transparent' }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
          >
            {(isEditing || isCreating) ? tags.map(tag => {
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
            }) : entry?.tags && [energyLevels[entry.energy - 1].label, ...entry?.tags].map((tag, i) => <Pressable
              key={tag}
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, backgroundColor: i === 0 ? energyLevels[entry.energy - 1].bgColor : isDark ? "#064e3b" : "#d1fae5", borderColor: i === 0 ? energyLevels[entry.energy - 1].borderColor : isDark ? "#047857" : "#a7f3d0" }}
            >
              <ThemedText style={{ fontSize: 13, fontWeight: "500", color: i === 0 ? energyLevels[entry.energy - 1].textColor : isDark ? "#d1fae5" : "#065f46" }}>
                {truncate(tag, 20)}
              </ThemedText>
            </Pressable>)}

            {(isEditing || isCreating) && <>
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
            </>}

            {/* an energy slider - exhausted, tired, neutral, active, energetic */}
          </ScrollView>
        </ThemedView>

        {/* Content */}
        {isEditing || isCreating ? <Pressable onPress={() => inputRef.current?.focus()} style={{ flex: 1 }}>
          <ThemedView style={{ minHeight: 300, backgroundColor: 'transparent', flex: 1 }}>
            <TextInput
              ref={inputRef}
              value={content}
              onChangeText={handleChangeContent}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? "#525252" : "#2c2b2b"}
              multiline
              // autoFocus
              style={{ fontSize: 18, lineHeight: 26, color: isDark ? "#e7e5e4" : "#1c1917" }}
            />
          </ThemedView>

        </Pressable> : <ThemedText>
          {entry?.content}
        </ThemedText>}
      </ScrollView>

      {isEditing || isCreating && <ThemedView style={{ backgroundColor: 'transparent' }}>
        <ThemedText style={{ marginLeft: 'auto', padding: 8, color: charsLeft <= 500 ? '#cc1818' : isDark ? "#e7e5e4" : "#1c1917" }}>
          {MAX_CHARS - charsLeft} / {MAX_CHARS}
        </ThemedText>
      </ThemedView>}

      {/* Footer */}
      <ThemedView style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: isDark ? "#1f2933" : "#e7e5e4", alignItems: "center" }}>
        <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: isDark ? "#1c1917" : "#f5f5f4" }}>
          <Ionicons name="calendar-outline" size={12} color={isDark ? "#a8a29e" : "#78716c"} />
          <ThemedText style={{ fontSize: 12, fontWeight: "500", color: isDark ? "#a8a29e" : "#78716c" }}>
            {entry ? formatJournalDate(entry.createdAt) : `Today at ${timeString}`}
          </ThemedText>
          <Ionicons name='time-outline' size={12} color={isDark ? "#a8a29e" : "#78716c"} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default JournalEntryScreen;
