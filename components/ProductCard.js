import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { widthToDp, heightToDp } from "rn-responsive-screen";
import Button from "./Button";
import currency from "../constants/currency";

export default function ProductCard({ key, product }) {
  const inventory = product?.variants[0]?.inventory_quantity;

  return (
    <View style={styles.container} key={key}>
      <Image
        source={{
          uri: product.thumbnail,
        }}
        style={styles.image}
      />
      <View style={styles.productInfo}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.category}>{inventory ? 'In Stock ('+inventory+')' : 'Out of stock'}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
          {product?.variants[0] ? 
          currency.NGN+product?.variants[0]?.prices[0]?.amount / 100
          : 'N/A'
          }
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    //elevation: 2,
    padding: 0,
    width: 190,
    backgroundColor: "#fff",
  },
  image: {
    height: 150,
    borderRadius: 7,
    marginBottom: 0,
  },
  productInfo: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    backgroundColor: '#F7F9FA',
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    //alignItems: "flex-end",
    marginTop: 3,
  },
  category: {
    fontSize: 11,
    color: "#828282",
    marginTop: 3,
  },
  price: {
    marginTop: -10,
    fontSize: 13,
    fontWeight: "bold",
    color: '#0687C8',
    backgroundColor: '#E6F5FC',
    paddingHorizontal: 10,
  },
});