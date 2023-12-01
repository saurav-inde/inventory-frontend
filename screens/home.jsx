// HomeScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useAuth } from "../context/authContext";
import Modal from "react-native-modal";

const VendorUI = () => {
  const { isVendor } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://inventory-backend-t23d.onrender.com/get_orders"
        );
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardContent}>
        <Text style={styles.cardHeaderText}>Product: {item.product_name}</Text>
        <Text style={styles.cardHeaderText}>Quantity: {item.quantity}</Text>
        <Text style={styles.cardBodyText}>User: {item.user_email}</Text>
        <Text style={styles.cardBodyText}>
          Time: {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const ClearOrdersButton = () => {
    return (
      <TouchableOpacity style={styles.button} onPress={handleClearOrders}>
        <Text style={styles.buttonText}>Cancel All Orders</Text>
      </TouchableOpacity>
    );
  };

  const handleClearOrders = async () => {
    try {
      // Calling backend endpoint to clear orders
      const response = await fetch(
        "https://inventory-backend-t23d.onrender.com/clear_orders",
        // "http://172.16.7.91:3030/clear_orders",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Orders cleared successfully, you can handle it as needed
        Alert.alert("All the orders have been cancelled");
        console.log(result.message);
      } else {
        // Clearing orders failed, handle the error
        console.error("Clearing orders failed:", result.message);
      }
    } catch (error) {
      console.error("Error clearing orders:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(
        "https://inventory-backend-t23d.onrender.com/add_products",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productName,
            price: price,
            qtty: quantity,
            rating: "5",
            // vendorId: /* Add logic to get the vendor ID */,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Product added successfully, you can handle it as needed
        console.log(result.message);
      } else {
        // Product addition failed, handle the error
        console.error("Product addition failed:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.canvas}>
      {/* <Text>This is the Vendor UI</Text> */}

      <TouchableOpacity
        onPress={isModalVisible ? () => {} : () => setModalVisible(true)}
        style={styles.outlinedButton}
      >
        <Text style={styles.outlinedButtonText}>Add New Product</Text>
      </TouchableOpacity>
      {/* Add more vendor-specific components */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Product</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            onChangeText={(text) => setProductName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            onChangeText={(text) => setPrice(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            onChangeText={(text) => setQuantity(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={handleAddProduct}
            style={styles.filledButton}
          >
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.outlinedButton}
          >
            <Text style={styles.outlinedButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ClearOrdersButton />

      <Text style={styles.title}>Active Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const BuyerUI = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { email } = useAuth();

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://inventory-backend-t23d.onrender.com/get_products",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response);
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
          // print(data);
          console.log(data);
          console.log(products);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const cartSize = cart.reduce((total, item) => total + item.quantity, 0);

  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={require("./../assets/placeholder-item.jpg")}
        style={styles.image}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.quantity}>Available Quantity: {item.qtty}</Text>
      <TouchableOpacity
        onPress={() => addToCart(item)}
        style={styles.addToCartButton}
      >
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const addToCart = (product, qtty) => {
    if (cart.includes(product)) {
      // Find the index of the product in the cart
      const index = cart.findIndex((item) => item.name === product.name);

      // Increase the quantity of the product by one
      const updatedCart = [...cart];
      updatedCart[index].quantity += 1;

      // Update the cart state with the updated product quantity
      setCart(updatedCart);
    } else {
      const newProduct = { ...product, quantity: 1 };
      console.log(newProduct);
      // Update the cart state by adding the selected product
      setCart([...cart, newProduct]);
    }
  };
  const clearCart = () => {
    setCart([]);
  };

  const goToCart = () => {
    navigation.navigate("Cart", { cart, clearCart });
  };

  return (
    <View>
      <Text style={styles.title}>Hello, {email}</Text>
      <View style={styles.cartBadge}>
        <TouchableOpacity onPress={goToCart}>
          <Text style={styles.cartBadgeText}> Cart: {cartSize} </Text>
        </TouchableOpacity>
        {/* {false ? null : (
        )} */}
      </View>

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { token, email, isVendor, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const base = "https://inventory-backend-t23d.onrender.com";

  console.log("is vendor" + isVendor);
  return (
    <View>
      {/* <Text>Welcome to the Home Screen! {isVendor} </Text> */}

      {isVendor ? <VendorUI /> : <BuyerUI navigation={navigation} />}
    </View>
  );
};
const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outlinedButton: {
    alignSelf: "center",
    width: "50%",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "black", // Change the color as needed
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  filledButton: {
    width: "50%",
    backgroundColor: "black", // Change the color as needed
    padding: 16,
    // padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white", // Text color for both buttons
    textAlign: "center",
    fontSize: 18,
  },
  outlinedButtonText: {
    color: "black", // Text color for both buttons
    textAlign: "center",
    fontSize: 18,
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginBottom: 10,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 15,
    color: "green",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: "gray",
  },

  cartBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red", // Customize color as needed
    borderRadius: 10,
    padding: 5,
  },
  cartBadgeText: {
    color: "white",
    fontWeight: "bold",
  },
  productList: {
    flexGrow: 1,
  },

  orderItem: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignContent: "center",
    textAlign: "center",
  },

  orderCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardBody: {
    marginBottom: 8,
  },
  cardBodyText: {
    fontSize: 14,
  },

  button: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "red",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
export default HomeScreen;
