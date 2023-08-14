import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";

export default function Header({ title, style }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          //uri: "https://trimart.com.ng/wp-content/uploads/2020/01/web-logo.jpg",
        }}
        style={styles.logo}
      />
      <Text style={[styles.title, style]}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  logo: {
    //width: 100,
    //height: 55,
    //marginTop: 20
  },
});