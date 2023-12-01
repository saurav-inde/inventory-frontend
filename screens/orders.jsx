import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "./../context/authContext"; // Import your authentication context

const CurrentOrdersScreen = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const { email } = useAuth(); // Assuming useAuth provides user information including the email

  useEffect(() => {
    const fetchCurrentOrders = async () => {
      try {
        const response = await fetch(
          "https://inventory-backend-t23d.onrender.com/get_orders"
        );
        const result = await response.json();

        if (response.ok) {
          // Filter orders based on the current user's email
          const userOrders = result.orders.filter(
            (order) => order.user_email === email
          );
          console.log(email);
          console.log("_____________________");

          setCurrentOrders(userOrders);
        } else {
          console.error("Failed to fetch current orders:", result.message);
        }
      } catch (error) {
        console.error("Error fetching current orders:", error);
      }
    };

    fetchCurrentOrders();
  }, ["user@example.com"]); // Add user.email to the dependency array to re-fetch orders when the user changes

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text
        style={styles.orderItemText}
      >{`Product Name: ${item.product_name}`}</Text>
      <Text style={styles.orderItemText}>{`Quantity: ${item.quantity}`}</Text>
      <Text style={styles.orderItemText}>{`Time: ${item.created_at}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Placed Orders</Text>
      <FlatList
        data={currentOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
  orderItem: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  orderItemText: {
    fontSize: 16,
  },
});

export default CurrentOrdersScreen;
