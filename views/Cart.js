import { ScrollView, StyleSheet,TouchableOpacity, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { width, widthToDp } from "rn-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import CartItem from "../components/CartItem";
import baseURL from "../constants/serverUrl";
import currency from "../constants/currency";

const NGN = currency.NGN;

export default function Cart({ navigation, route }) {
    const { productTypeId } = route.params || '';
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        try {
            // Get the cart id from the device storage
            const cartId = await AsyncStorage.getItem("cart_id");
            // Fetch the products from the cart API using the cart id
            axios.get(`${baseURL}/store/carts/${cartId}`).then(({ data }) => {
                // Set the cart state to the products in the cart
                //alert(JSON.stringify(data.cart))
                setCart(data.cart);
            });
        } catch(e) {
            alert('Error fetching cart');
        }
        
    };

    const deleteCartItem = async (lineItemId) => {
        try {
            axios.delete(`${baseURL}/store/carts/${cart.id}/line-items/${lineItemId}`).then(({ data }) => {
                // Set the cart state to the products in the cart
                setCart(data.cart);
            });
        } catch(e) {
            alert(e)
        }
    };
    
    useEffect(() => {
      navigation.addListener('focus', (e) => {
            //alert('tab pressed')
            // Calling the fetchCart function when the component mounts
            fetchCart();
        });
    },[]);

    return (
        // SafeAreaView is used to avoid the notch on the phone */}
        <View style={[styles.container]}>
            <View style={styles.cartHeader}>
                <Text>Your cart</Text>
                <Text></Text>
            </View>
          {/* ScrollView is used in order to scroll the content */}
          <ScrollView style={styles.contentContainer}>
            {/* Mapping the products into the Cart component */}
            {cart?.items?.map((product) => (
              <CartItem key={product.id} product={product} cartId={cart.id} delete={deleteCartItem} />
            ))}
          </ScrollView>
          {/* Creating a seperate view to show the total amount and checkout button */}
          <View style={styles.totalsBox}>
            <View style={styles.row}>
              <Text style={styles.cartTotalText}>Gross</Text>
    
              {/* Showing Cart Total */}
              <Text
                style={[
                  styles.cartTotalText,
                  {
                    color: "#4C4C4C",
                  },
                ]}
              >
                {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
                {cart?.total ? NGN+cart?.total / 100 : NGN+0}
              </Text>
            </View>
            <View style={styles.row}>
              {/* Showing the discount (if any) */}
              <Text style={styles.cartTotalText}>Discount</Text>
              <Text
                style={[
                  styles.cartTotalText,
                  {
                    color: "#4C4C4C",
                  },
                ]}
              >
                - {cart.length ? NGN+cart?.discount_total / 100 : NGN+0}
              </Text>
            </View>
            <View style={[styles.row, styles.total]}>
              <Text style={styles.cartTotalText}>Total</Text>
              <Text
                style={[
                  styles.cartTotalText,
                  {
                    color: "#4C4C4C",
                  },
                ]}
              >
                {/* Calculating the total */}
                {cart?.total ? NGN+(cart?.total / 100 - cart?.discount_total / 100) : NGN+0}
              </Text>
            </View>
            <View>
              {/* A button to navigate to checkout screen */}
              <Button
                large={true}
                style={styles.checkoutButton}
                onPress={() => {
                  navigation.navigate('Checkout', {
                    cart
                  });
                }}
                title={cart?.items?.length > 0 ? "Checkout" : "Empty Cart"}
              />
            </View>
          </View>
        </View>
      );
    }
    
    // Styles....
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
      },
      contentContainer: {
        flex: 1,
        backgroundColor: "#fff",
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      },
      cartHeader: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 13,
        backgroundColor: '#E6F5FC',
        borderBottomColor: '#ccc'
      },
      totalsBox: {
        borderTopWidth: 1,
        borderTopColor: '#AEE3FE',
        backgroundColor: '#DEF3FE',
        width: '100%', 
        paddingHorizontal: 20,
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 2
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: widthToDp(90),
        marginTop: 10,
      },
      total: {
        borderTopWidth: 1,
        paddingTop: 10,
        borderTopColor: "#AEE3FE",
        marginBottom: 10,
      },
      cartTotalText: {
        fontSize: widthToDp(3.5),
        fontWeight: '500',
        color: "#0687C8",
      },
      checkoutButton: {
        marginBottom: 10,
    }
    });
    