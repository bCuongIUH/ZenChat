import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Rect, Circle, Line, Path } from 'react-native-svg';

const TabIcons = () => {
  return (
    <View style={styles.customTabBar}>
      <Svg style={styles.customTab}>
        <Polygon points="12 1,23 10,23 23,16 23,16 14,8 14,8 23,1 23,1 10" fill="var(--focus-t)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </Svg>
      <Svg style={styles.customTab}>
        <Line x1="3" y1="1" x2="21" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="2" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Polygon points="9 3,15 7.5,9 11" fill="var(--focus-t)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Rect x="0" y="8" rx="2" ry="2" width="24" height="16" fill="none" />
      </Svg>
      <Svg style={styles.customTab}>
        <Rect x="1" y="1" rx="2" ry="2" width="11" height="19" fill="var(--focus-t)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Rect x="12" y="1" rx="2" ry="2" width="11" height="19" fill="var(--focus-t)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
      </Svg>
      <Svg style={styles.customTab}>
        <Circle cx="12" cy="6.5" r="5.5" fill="var(--focus-t)" stroke="currentColor" strokeWidth="2" />
        <Path d="M20.473,23H3.003c-1.276,0-2.228-1.175-1.957-2.422,.705-3.239,3.029-8.578,10.693-8.578s9.987,5.336,10.692,8.575c.272,1.248-.681,2.425-1.959,2.425Z" fill="none" stroke="currentColor" strokeWidth="2" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  customTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Thay đổi màu nền nếu cần
  },
  customTab: {
    alignItems: 'center',
  },
});

export default TabIcons;
