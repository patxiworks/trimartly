import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { height, heightToDp } from "rn-responsive-screen";
import Products from "../../views/Products";
import Button from "../Button";
import baseURL from "../../constants/serverUrl";
import currency from "../../constants/currency";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function MetaInfo({ product }) {
    const [activeSize, setActiveSize] = useState(0);
    const inventory = product?.variants[0]?.inventory_quantity;
    const cost = product?.variants[0]?.prices[0]?.amount;

    const addToCart = async () => {
        const cartId = await AsyncStorage.getItem("cart_id");
        //alert(cartId)
        axios.post(`${baseURL}/store/carts/${cartId}/line-items`, {
                variant_id: product.variants[0].id,
                quantity: 1,
            })
            .then(({ data }) => {
                alert(`Item ${product.title} added to cart`);
            })
            .catch((err) => {
                console.log(err);
                alert(err+`: ${baseURL}/store/carts/${cartId}/line-items`)
            });
        };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>{product.title}</Text>
                <View>
                <Text style={styles.price}>
                    {product?.variants[0] ? currency.NGN + product.variants[0].prices[0].amount / 100 : 'N/A'}
                </Text>
                
                </View>
            </View>
            {product?.options[0]?.values.length > 1 ?
                <View style={styles.sizerow}>
                    <Text style={styles.heading}>Available Sizes:</Text>
                    <View style={styles.sizes}>
                        {product.options[0].values.map((size, index) => (
                        <Text
                            key={index}
                            onPress={() => {
                            setActiveSize(index);
                            }}
                            style={[
                            styles.sizeTag,
                            {
                                borderWidth: activeSize === index ? 3 : 0,
                            },
                            ]}
                        >
                            {size.value}
                        </Text>
                        ))}
                    </View>
                </View>
                : ''}
            <View>
            {product.description ?
                <View style={styles.descriptionBox}>
                    <Text style={styles.heading}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            : ''
            }
            </View>
            {inventory && cost ?
            <TouchableOpacity onPress={addToCart} style={styles.cartButton}>
                <Button title="Add to Cart" large={true} />
            </TouchableOpacity>
            :
            <View style={styles.cartButton}>
                <Button title="Not available!" large={true} style={{backgroundColor: '#ccc'}} />
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 'auto',
    padding: 15,
    marginBottom: 5
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sizerow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingBottom: 5
  },
  sizes: {
    flexDirection: "row",
    marginLeft: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0687C8",
  },
  heading: {
    fontSize: 15,
    marginTop: 3,
  },
  star: {
    fontSize: 13,
    marginTop: 1,
  },
  sizeTag: {
    borderColor: "#C37AFF",
    backgroundColor: "#F7F6FB",
    color: "#000",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 2,
    overflow: "hidden",
    fontSize: 14,
    marginBottom: 2,
  },
  descriptionBox: {
    marginTop: 15,
  },
  description: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 2,
  },
  cartButton: {
    marginTop: 20,
  }
});