import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';

type TopBarAction = {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
};

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: TopBarAction[];
  backgroundColor?: string;
  foregroundColor?: string;
  rightContent?: ReactNode;
  rightContentWidth?: number;
};

/**
 * Shared page header. The title layer is positioned independently from the
 * controls, so it stays at the physical centre of the screen even when the
 * two sides contain a different number of buttons.
 */
export function AppTopBar({
  title,
  subtitle,
  onBack,
  backLabel = 'Quay lại',
  actions = [],
  backgroundColor = '#FFFFFF',
  foregroundColor = '#172033',
  rightContent,
  rightContentWidth = 52,
}: Props) {
  const sideButtonCount = Math.max(onBack ? 1 : 0, rightContent ? 1 : actions.length);
  const controlInset = rightContent ? rightContentWidth + 8 : sideButtonCount * 44 + 8;
  const safeTitleInset = Math.max(52, controlInset);

  return (
    <Surface elevation={1} style={[styles.bar, { backgroundColor }]}>
      <View pointerEvents="none" style={[styles.titleLayer, { paddingHorizontal: safeTitleInset }]}>
        <View style={styles.titleStack}>
          <Text numberOfLines={1} style={[styles.title, { color: foregroundColor }]}>{title}</Text>
          {subtitle ? <Text numberOfLines={1} style={[styles.subtitle, { color: foregroundColor }]}>{subtitle}</Text> : null}
        </View>
      </View>

      {onBack ? (
        <View style={styles.leftControls}>
          <IconButton
            icon="arrow-left"
            iconColor={foregroundColor}
            size={24}
            style={styles.iconButton}
            onPress={onBack}
            accessibilityLabel={backLabel}
          />
        </View>
      ) : null}

      <View style={styles.rightControls}>
        {rightContent ?? actions.map((action, index) => (
          <IconButton
            key={`${action.icon}-${index}`}
            icon={action.icon}
            iconColor={foregroundColor}
            size={23}
            style={styles.iconButton}
            onPress={action.onPress}
            accessibilityLabel={action.accessibilityLabel}
            accessibilityState={action.accessibilityState}
          />
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 60,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  titleLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    height: 44,
    margin: 0,
    width: 44,
  },
  titleStack: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: -1,
    opacity: 0.72,
    textAlign: 'center',
  },
  leftControls: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  rightControls: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
