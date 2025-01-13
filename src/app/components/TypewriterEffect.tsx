import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { themes } from '../../1up/theme/theme';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
}

const TypewriterText = ({ text, onComplete }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const lastUpdateTime = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());
  const expectedIndex = useRef<number>(0);

  useEffect(() => {
    if (!text) { return; }

    const animate = (currentTime: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = currentTime;
      }

      const elapsedTime = Date.now() - startTime.current;
      expectedIndex.current = Math.floor(elapsedTime / 7);

      if (expectedIndex.current <= text.length) {
        setDisplayText(text.slice(0, expectedIndex.current));
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [text, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.fullscreenWinningMoveDesc}>{displayText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  fullscreenWinningMoveDesc: {
    fontSize: 14,
    color: themes.colors.white,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 2,
    lineHeight: 20,
  },
});

export default TypewriterText;
