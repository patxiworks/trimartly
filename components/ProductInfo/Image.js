import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
//import { widthToDp } from "rn-responsive-screen";

export default function Images({ images }) {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setActiveImage(images[0].url);
  }, []);

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: activeImage }} style={styles.image} />
      {/*<View style={styles.previewContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setActiveImage(image.url);
            }}
          >
            <Image
              source={{ uri: image.url }}
              style={[
                styles.imagePreview,
                {
                  borderWidth: activeImage === image.url ? 3 : 0,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
        </View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
  },
  previewContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10,
  },
  imageContainer: {
    backgroundColor: "#F7F6FB",
    paddingBottom: 0,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  imagePreview: {
    width: 35,
    marginRight: 5,
    borderColor: "#C37AFF",
    borderRadius: 10,
    height: 35,
  },
});