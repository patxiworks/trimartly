import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import axios from "axios";
import { heightToDp, width, widthToDp } from "rn-responsive-screen";
import Button from "../components/Button";
//import { TouchableOpacity } from "react-native-gesture-handler";
import baseURL from "../constants/serverUrl";
import currency from "../constants/currency";

export default function CartItem(props) {
    const product = props.product;

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.thumbnail }} style={styles.image} />
            <View style={styles.info}>
                <View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>{product.title} 
                        </Text>
                        <TouchableOpacity style={styles.delete} onPress={()=>props.delete(product.id)}>
                            <View style={styles.deleteButton}><Text style={styles.deleteText}>x</Text></View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>
                        {product.quantity} • {product?.unit_price ? currency['NGN']+product.unit_price / 100 : ''}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.price}>{currency['NGN']+product.total / 100}</Text>
                    {/*<Text style={styles.quantity}>x{product.quantity}</Text>*/}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingLeft: 0,
    paddingBottom: 10,
    borderColor: "#e6e6e6",
    width: widthToDp("100%"),
  },
  image: {
    width: widthToDp(25),
    height: heightToDp(20),
    borderRadius: 10,
  },
  titleBox: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  title: {
    fontSize: widthToDp(3.5),
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  info: {
    marginLeft: widthToDp(3),
    paddingHorizontal: widthToDp(3),
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: heightToDp(2),
    width: widthToDp(70),
    borderLeftWidth: 1,
    borderColor: '#eee'
  },
  description: {
    fontSize: widthToDp(3),
    color: "#8e8e93",
    marginTop: heightToDp(2),
  },

  price: {
    fontSize: widthToDp(3.5),
  },
  quantity: {
    fontSize: widthToDp(4),
    fontWeight: 'normal',
  },
  delete: {
    fontSize: widthToDp(3),
  },
  deleteButton: {
    paddingHorizontal: widthToDp(1), 
    backgroundColor: '#000', 
    borderWidth: 2, 
    borderRadius: 20
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: widthToDp(2),
  }
});