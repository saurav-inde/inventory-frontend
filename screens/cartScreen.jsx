// CartScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Icon,
} from "react-native";
import { useAuth } from "../context/authContext";

const CartScreen = ({ route, navigation }) => {
  const { cart, clearCart } = route.params;
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const {email} = useAuth()

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.totalQuantity}>
        Total Quantity: {item.totalQuantity}
      </Text>
    </View>
  );

  const uniqueItems = Array.from(new Set(cart.map((item) => item.name)));

  const cartItemsWithTotalQuantity = uniqueItems.map((itemName) => {
    const totalQuantity = cart.reduce((total, currentItem) => {
      if (currentItem.name === itemName) {
        return total + currentItem.quantity;
      }
      return total;
    }, 0);

    return { name: itemName, totalQuantity };
  });

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);

      // Extract unique items and their quantities
      const uniqueItems = Array.from(new Set(cart.map((item) => item.name)));
      const orderDetails = uniqueItems.map((itemName) => {
        const totalQuantity = cart.reduce((total, currentItem) => {
          if (currentItem.name === itemName) {
            return total + currentItem.quantity;
          }
          return total;
        }, 0);

        return { name: itemName, quantity: totalQuantity };
      });

      // Replace the URL with your actual backend endpoint for placing orders
      const response = await fetch(
        "https://inventory-backend-t23d.onrender.com/store_order",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orders: orderDetails,
            user_email: email, // Replace with the actual user email
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Clear the cart
        clearCart();

        Alert.alert("Order Placed", "Your order has been placed successfully!");
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        // Order placement failed, handle the error
        Alert.alert("Order Failed", `Failed to place order: ${result.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Cart Screen</Text> */}
      <TouchableOpacity
        style={styles.orderScreenButton}
        onPress={() => navigation.navigate("Orders")}
      >
        <Text style={styles.orderScreenButtonText}>Check current Orders</Text>
        <Text style={styles.orderScreenButtonText}></Text>

      </TouchableOpacity>
      <FlatList
        data={cartItemsWithTotalQuantity}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.name}
      />
      <TouchableOpacity
        onPress={handlePlaceOrder}
        style={[styles.button, isPlacingOrder && styles.disabledButton]}
        disabled={isPlacingOrder}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalQuantity: {
    fontSize: 16,
    color: "grey",
    marginTop: 8,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  orderScreenButton: {
    // flexDirection: "row",


    backgroundColor: "black",
    // padding: 16,
    paddingTop: 16,
    borderRadius: 8,
    marginTop: 0,
    alignItems: "center",
    // justifyContent: "center",
    alignContent  : "center",
    justifyContent: "center",
  },
  orderScreenButtonText: {
    color: "white",
    fontSize: 18,
 
    // paddingTop: 16,
  },
});

export default CartScreen;
