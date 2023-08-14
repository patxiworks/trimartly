import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ImageBackground, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import baseURL from "./constants/serverUrl";
import Products from "./views/Products";
import ProductInfo from "./views/ProductInfo";
import Cart from "./views/Cart";
import { CheckoutContact, CheckoutPayment } from "./views/Checkout";
import Header from "./components/Header";

const UserContext = React.createContext();

function HomeScreen({ navigation }) {
  const image = { uri: "http://trimart.com.ng/wp-content/uploads/2020/07/WhatsApp-Image-2020-07-08-at-16.19.29.jpeg" };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={image} resizeMode="cover" style={{flex: 1, justifyContent: "center"}}>
      <Text 
        style={{
          color: "white",
          fontSize: 42,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          backgroundColor: "#000000a0"
        }}
      >Welcome to Trimart</Text>
      {/*<Image
        source={{
          uri: "https://trimart.com.ng/wp-content/uploads/2020/01/web-logo.jpg",
        }}
        style={{width: 200, height: 100, marginVertical: 20}}
      />*/}
      <View style={{width: '80%', justifyContent: 'center', marginHorizontal: 30}}>
        <Button
          onPress={() => navigation.navigate('Products')}
          title="Check out our products"
          color="#000"
        />
      </View>
      </ImageBackground>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();


function CheckoutScreens({ navigation }) {
  const route = useRoute();
  const context = React.useContext(UserContext); //context api
  const screens = ["Contact Information", "Payment & Delivery"]

  return (
    <Stack.Navigator 
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: '#000' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { textTransform: 'none' },
        tabBarIndicatorStyle: {
          backgroundColor: '#0687C8',
        },
    }}
    screenListeners={{
      state: (e) => {
        // Do something with the state
        //const screen = e.data.state.routeNames[e.data.state.index];
        context.setCheckoutScreen(screens[e.data.state.index])
      },
    }}
    >
      <Stack.Screen name="ContactInformation" component={CheckoutContact} 
        options={{
          title: 'Contact information',
          headerBackVisible: false,
          headerShown: false
        }} 
      />
      <Stack.Screen name="PaymentDelivery" component={CheckoutPayment} 
        options={{
          title: 'Payment & Delivery', 
          headerBackVisible: false,
          headerShown: false
        }}
        initialParams={{ cart: route.params.cart }}
      />
    </Stack.Navigator>
  );
}


//// CART STACK SCREEN

function CartStack() {
  const context = React.useContext(UserContext);
  const { checkoutScreen } = context;

  return (
    <Stack.Navigator 
      screenOptions={{
        headerTitleAlign: 'left',
        headerStyle: {
          height: 50, // Specify the height of your custom header
          backgroundColor: '#E6F5FC',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        },
      }}
    >
      <Stack.Screen name="Cart" component={Cart} options={{headerShown:false}} />
      <Stack.Screen 
        name={"Checkout"}
        component={CheckoutScreens} 
        options={{ 
          title: "Checkout / " + checkoutScreen,
          headerTitleStyle: {fontSize: 13, fontWeight: 'normal'}
        }} />
    </Stack.Navigator>
  )
}

function CartNav() {
  const route = useRoute();
  const context = React.useContext(UserContext);
  const { store, productGroup, cartCount } = context;

  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="CartStack" component={CartStack} />
    </Drawer.Navigator>
  )
}


//// PRODUCTS STACK SCREEN

function ProductStack() {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'left'}}>
      <Stack.Screen name="ProductList" component={Products} options={{headerShown:false}} />
      <Stack.Screen name="ProductInfo" component={ProductInfo} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}


/// PRODUCT DRAWER NAVIGATION

function CustomDrawerContent(props) {
  const context = React.useContext(UserContext); //context api
  const [productTypes, setProductTypes] = useState([]);

  function fetchProductTypes() {
      axios.get(`${baseURL}/store/product-types`).then((res) => {
        setProductTypes(res.data.product_types);
    }); 
  }

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {productTypes.map((productType) => (
        <DrawerItem
          key={productType.id}
          label={productType.value}
          onPress={() => {
            // Navigates to products screen
            props.navigation.navigate('ProductList', { productTypeId: productType.id })
            // Changes headerTitle of drawer navigation
            context.setProductGroup(productType.value)
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

function ProductNav() {
  const route = useRoute();
  const context = React.useContext(UserContext);
  const { store, productGroup, cartCount } = context;

  return (
    <Drawer.Navigator 
      initialRouteName="Product" 
      useLegacyImplementation
      screenOptions={{ 
        headerTitle: store+' / '+(productGroup ? productGroup : 'All items'),
        headerTitleStyle: {
          fontSize: 12, // Specify the height of your custom header
          fontWeight: '100',
          //color: 'blue'
        },
        headerStyle: {
          height: 50, // Specify the height of your custom header
          backgroundColor: '#E6F5FC',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 200,
        },
      }}
      drawerContent={(props) => {
        return <CustomDrawerContent {...props} />
      }}
    >
      <Drawer.Screen name="Product" component={ProductStack} />
      {/* Add product list from medusa */}
    </Drawer.Navigator>
  )
}


//// TAB NAVIGATION

function TabNav() {
  const context = React.useContext(UserContext);
  const { store, productGroup, cartCount } = context;
  
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: '#000' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { textTransform: 'none' },
        tabBarIndicatorStyle: {
          backgroundColor: '#0687C8',
        },
    }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductNav} />
      <Tab.Screen name={`Carts`} component={CartNav} />
      {/*<Tab.Screen name={`Carts (${cartCount})`} component={CartNav} />*/}
    </Tab.Navigator>
  );
}


//// MAIN SCREEN

function App() {
  const dimensions = useWindowDimensions();

  // Set contexts
  const contextInitialState = {
      store: 'Trimart',
      productGroup: '',
      cartCount: 0,
      checkoutScreen: '',
  };
  const [headerInfo, setHeaderInfo] = useState(contextInitialState);

  function setStore(store) {
    const newState = { ...headerInfo, store };
    setHeaderInfo(newState);
  }

  function setProductGroup(productGroup) {
    const newState = { ...headerInfo, productGroup };
    setHeaderInfo(newState);
  }
  
  function setCartCount(cartCount) {
    const newState = { ...headerInfo, cartCount };
    setHeaderInfo(newState);
  }

  function setCheckoutScreen(checkoutScreen) {
    const newState = { ...headerInfo, checkoutScreen };
    setHeaderInfo(newState);
  }

  const contextSetters = { setStore, setProductGroup, setCartCount, setCheckoutScreen }
  // end contexts

  const getCartCount = (cartId) => {
    axios.get(`${baseURL}/store/carts/${cartId}`).then(({ data }) => {
      // Set the cart state to the products in the cart
      setCartCount(data.cart.items.length)
    });
  }

  const setCartId = () => {
    axios.post(`${baseURL}/store/carts`, {region_id: "reg_01GKRS06CQGJDKMMMSHN9MB1G6"}).then((res) => {
      AsyncStorage.setItem("cart_id", res.data.cart.id);
      getCartCount(res.data.cart.id);
    });
  };
  
  // Check cart_id 
  const checkCartId = async () => {
    const cartId = await AsyncStorage.getItem("cart_id");
    if (!cartId) {
      setCartId();
    } else {
      getCartCount(cartId);
    }
  };
  
  useEffect(() => {
    //AsyncStorage.removeItem("cart_id");
    checkCartId();
  }, []);

  return (
    <UserContext.Provider value={{ ...headerInfo, ...contextSetters }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign: 'left'}}>
          <Stack.Screen 
            name="Trimart" 
            component={TabNav} 
            options={{
              headerTitle: (props) => <Header title="Trimartly" style={{color: '#fff'}} />,
              headerStyle: {
                backgroundColor: '#0687C8',
              },
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;