import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import axios from "axios";
import baseURL from "../constants/serverUrl";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightToDp, widthToDp } from "rn-responsive-screen";
import Button from "../components/Button";
import ShippingAddress from "../components/ContactDetails";
//import Payment from "../components/Payment";
//import { publishable_key } from "../constants/stripe";
import RadioButton from "../components/RadioButton";
//import { CardField, useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { StripeProvider } from "@stripe/stripe-react-native";
import  { Paystack }  from 'react-native-paystack-webview';
import currency from "../constants/currency";

const NGN = currency.NGN;

export function CheckoutContact({ navigation, route }) {
    const [paymentInfo, setPaymentInfo] = useState({});
    const [shippingAddress, setShippingAddress] = useState({});
    //console.log(route.params);
    
    const handlePaymentInputChange = (card) => {
        setPaymentInfo(card.values);
    };
    
    const handleAddressInputChange = (address) => {
        setShippingAddress(address);
    };

    const handlePayment = async () => {
      // Getting client secret from the payment session state
      const clientSecret = paymentSession.data ? paymentSession.data.client_secret : paymentSession.client_secret
      const billingDetails = {
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          addressCity: shippingAddress.city,
          addressCountry: shippingAddress.country,
          addressLine1: shippingAddress.address_1,
          addressLine2: shippingAddress.address_2,
          //addressPostalCode: shippingAddress.postalCode,
      };
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails,
      });
      if (error) {
          alert("Payment failed", error);
      }
      if (paymentIntent) {
          alert("Payment successful");
          //navigation.navigate('Products')
          // Calling the complete cart function to empty the cart and redirect to the home screen
          completeCart();
      }
    };

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.address}>
            <ShippingAddress onChange={handleAddressInputChange} />
            <TouchableOpacity onPress={() => navigation.navigate('PaymentDelivery', {shippingAddress: shippingAddress})}>
              <Button title="Next" large />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
}

export function CheckoutPayment({ navigation, route }) {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("paystack");
  const [paymentSession, setPaymentSession] = useState({});
  const paystackWebViewRef = useRef(); 
  const { shippingAddress, cart } = route?.params || '';
  console.log(shippingAddress)

  // Calling the API when user presses the "Place Order" button
  const placeOrder = async () => {
    //console.log(route)
    // Getting cart id from async storage
    let cart_id = await AsyncStorage.getItem("cart_id");
    // Post shipping address to server
    axios
    .post(`${baseURL}/store/carts/${cart_id}`, {
        shipping_address: {
          //"company": shippingAddress.company,
          "first_name": shippingAddress.first_name,
          "last_name": shippingAddress.last_name,
          "address_1": shippingAddress.address_1,
          "address_2": shippingAddress.address_2,
          "city": shippingAddress.city,
          //"province": shippingAddress.province,
          "phone": shippingAddress.phone,
        },
    })
    .then(({ data }) => {
        // Post shipping method to server
        axios
        .post(`${baseURL}/store/carts/${cart_id}/shipping-methods`, {
            option_id: selectedShippingOption,
        })
        .then(({ data }) => {
            //alert(JSON.stringify(data))
            // Calling the handle Payment API
            handlePayment();
            //paystackWebViewRef.current.startTransaction()
        });
    });
  };

  const handlePayment = async () => {
    // Getting client secret from the payment session state
    const clientSecret = paymentSession.data ? paymentSession.data.client_secret : paymentSession.client_secret
    const billingDetails = {
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressCity: shippingAddress.city,
        addressCountry: shippingAddress.country,
        addressLine1: shippingAddress.address_1,
        addressLine2: shippingAddress.address_2,
        addressPostalCode: shippingAddress.postalCode,
    };
    paystackWebViewRef.current.startTransaction()
  };

  const completeCart = async () => {
    const cartId = await AsyncStorage.getItem("cart_id");
    // Sending a request to the server to empty the cart
    axios
      .post(`${baseURL}/store/carts/${cartId}/complete`)
      .then(async (res) => {
        // Removing the cart_id from the local storage
        await AsyncStorage.removeItem("cart_id");
        // Redirecting to the home screen
        navigation.navigate("products");
      });
  };

  const InitializePaymentSessions = async () => {
    // Getting cart id from async storage
    let cart_id = await AsyncStorage.getItem("cart_id");
    // Intializing payment session
    axios
      .post(`${baseURL}/store/carts/${cart_id}/payment-sessions`)
      .then(({ data }) => {
        axios
          .post(`${baseURL}/store/carts/${cart_id}/payment-session`, {
            provider_id: "paystack",
          })
          .then(({ data }) => {
            setPaymentSession(data.cart.payment_session);
          });
      });
  };

  const fetchPaymentOption = async () => {
    // Getting cart id from async storage
    let cart_id = await AsyncStorage.getItem("cart_id");
    // Fetch shipping options from server
    axios
    .get(`${baseURL}/store/shipping-options/${cart_id}`)
    .then(({ data }) => {
        //alert(JSON.stringify(data))
        setShippingOptions(data.shipping_options);
        // Initializing payment session
        InitializePaymentSessions();
    });
  };

  useEffect(() => {
      // Calling the function to fetch the payment options when the component mounts
      fetchPaymentOption();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.payment}>
          <Text style={styles.title}>Payment Method</Text>
            <View style={styles.shippingOption}>
              {/*<Select>
                <option value='Paystack'>Paystack</option>
                <option value='flutterwave'>Flutterwave</option>
                <option value='Stripe'>Stripe</option>
                <option value='gtbpay'>GTBPay</option>
              </Select>*/}
              <RadioButton
                onPress={() => setSelectedPaymentOption('paystack')}
                selected={selectedPaymentOption === 'paystack'}
                children='Paystack'
              />
              <RadioButton
                onPress={() => setSelectedPaymentOption('stripe')}
                selected={selectedPaymentOption === 'stripe'}
                children='Stripe'
              />
            </View>
        </View>
        <View style={styles.shipping}>
          <Text style={styles.title}>Shipping Options</Text>
          {shippingOptions.map((option, i) => (
            <View style={styles.shippingOption}>
              <RadioButton
                onPress={() => setSelectedShippingOption(option.id)}
                key={i}
                selected={selectedShippingOption === option.id}
                children={option.name}
              />
            </View>
          ))}
        </View>
        <View style={styles.shipping}>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Your order: {cart.items.length} items ({NGN + cart.total / 100})</Text>
          <TouchableOpacity onPress={placeOrder}>
            <Button large title={`Pay now`} />
          </TouchableOpacity>
          <Paystack
            buttonText="Pay now"
            showPayButton={true}
            paystackKey="pk_test_93c8926eec74a57a38b28951e0136b34258adb8d"
            amount={cart.total / 100}
            billingEmail="patxiworks@gmail.com"
            activityIndicatorColor=""
            onCancel={(e) => {
              // handle response here
            }}
            onSuccess={(res) => {
              alert("Payment successful"); 
              // Calling the complete cart function to empty the cart and redirect to the home screen
              completeCart();
            }}
            ref={paystackWebViewRef}
          />
          
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: 0,
    },
    formHeader: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "flex-end",
      width: '100%',
      paddingHorizontal: 25,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
      width: '100%',
      marginTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    address: {
      marginHorizontal: widthToDp(5),
    },
    payment: {
      marginHorizontal: widthToDp(5),
      marginTop: heightToDp(10),
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    shipping: {
      marginHorizontal: widthToDp(5),
      marginTop: heightToDp(5),
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    title: {
      fontSize: widthToDp(4.5),
      fontWeight: 'bold'
    },
    shippingOption: {
      flexDirection: 'row',
      marginTop: heightToDp(5),
      marginBottom: heightToDp(5)
    },
  });

