import { Ionicons } from '@expo/vector-icons';
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ActionCardProps {
  topLabel: string;
  topIcon: keyof typeof Ionicons.glyphMap;
  mainText: string;
  buttonText: string;
  onPress: () => void;
  colorScheme?: 'light' | 'dark';
}

const ActionCard: React.FC<ActionCardProps> = ({
  topLabel,
  topIcon,
  mainText,
  buttonText,
  onPress,
  colorScheme = 'light',
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: colorScheme === 'light' ? '#353535' : '#0f0f0e',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 16,
  };

  const topLabelContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  };

  const topLabelText: TextStyle = {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#10b981',
  };

  const mainTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 12,
  };

  const buttonStyle: ViewStyle = {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  };

  const buttonTextStyle: TextStyle = {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  };

  return (
    <ThemedView style={containerStyle}>
      <ThemedView style={topLabelContainer}>
        <Ionicons name={topIcon} size={18} color="#10b981" />
        <ThemedText style={topLabelText}>{topLabel}</ThemedText>
      </ThemedView>

      <ThemedText style={mainTextStyle}>{mainText}</ThemedText>

      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <ThemedText style={buttonTextStyle}>{buttonText}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ActionCard;
