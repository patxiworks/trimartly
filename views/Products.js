import { ScrollView, StyleSheet,TouchableOpacity, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { widthToDp } from "rn-responsive-screen";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import BlankScreen from "../components/BlankScreen";
import baseURL from "../constants/serverUrl";

export default function Products({ navigation, route }) {
  const { productTypeId } = route.params || '';
  const [products, setProducts] = useState([]);

  function fetchProducts() {
    axios.get(`${baseURL}/store/products`).then((res) => {
      setProducts(res.data.products.filter(product => !productTypeId || product.type_id == productTypeId));
    }); 
 }

  useEffect(() => {
    //navigation.addListener('tabPress', (e) => {
      fetchProducts();
    //});
  }, [productTypeId]);

  return (
    <View style={styles.container}>
      {products.length > 0 ?
      <ScrollView>
        <View style={styles.products}>
          {products.map((product) => (
            <View key={product.id}>
              {product?.variants[0] 
              ?
              <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('ProductInfo', { productId: product.id })}>
                <ProductCard product={product} />
              </TouchableOpacity>
              : 
              <ProductCard product={product} />
              }
            </View>
          ))}
        </View>
      </ScrollView>
      :
      <BlankScreen />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  products: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: widthToDp(100),
    paddingTop: widthToDp(3),
    paddingHorizontal: widthToDp(3),
    justifyContent: "space-between",
  },
});