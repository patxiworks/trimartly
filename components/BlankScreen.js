import { View, Text, StyleSheet } from 'react-native';

export default function BlankScreen() {
    return (
      <View style={styles.container}>
        <Text>Nothing found here!</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%', 
        width: '100%',
    },
  });