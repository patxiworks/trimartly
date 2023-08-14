import { View, Text, ScrollView,TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Images from "../components/ProductInfo/Image";
import MetaInfo from "../components/ProductInfo/MetaInfo";
import baseURL from "../constants/serverUrl";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProductInfo({ route }) {
    const { productId } = route.params;
    const [productInfo, setproductInfo] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [cart, setCart] = useState(null);

    /*const fetchCart = async () => {
        try {
            const id = await AsyncStorage.getItem('cart_id');
            if (id !== null) {
                axios.get(`${baseURL}/store/carts/${id}`).then((res) => {
                    setCartId(res.data.cart.id);
                });
            }
        } catch(e) {
            alert(e)
        }
    }*/

    
    
    /*function addCartItem() {
        fetch(`${baseURL}/store/carts/${cartId}/line-items`, {
            method: 'POST',
            //credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              variant_id: productInfo.variants[0].id,
              quantity: 1
            })
          })
          .then((response) => response.json())
          .then(({ cart }) => {alert(JSON.stringify(cartId));setCart(cart)});
    }*/

    useEffect(() => {
        axios.get(`${baseURL}/store/products/${productId}`).then((res) => {
            setproductInfo(res.data.product);
        });

        //fetchCart();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/*<TouchableOpacity onPress={() => alert()}>
                <Ionicons
                style={styles.icon}
                name="arrow-back-outline"
                size={24}
                color="black"
                />
            </TouchableOpacity>*/}
            <ScrollView style={styles.imageView}>
                {productInfo && (
                <View style={styles.container}>
                    <Images images={productInfo.images} />
                    <MetaInfo product={productInfo} />
                    <View style={styles.button}>
                        {/*<TouchableOpacity onPress={() => addToCart()}>
                            <Button title="Add to Cart" onPress={addToCart} large={true} />
                        </TouchableOpacity>*/}
                    </View>
                </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
},
icon: {
    marginLeft: 10,
},
imageView: {
    marginTop: -30
},
button: {
    flex: 1,
    alignItems: 'flex-end',
    margin: 10,
    marginBottom: 40
}
});