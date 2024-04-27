import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Linking, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

export default function App() {
  const [accountDetails, setAccountDetails] = useState({});
  const [transactionHashes, setTransactionHashes] = useState("");

  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log(event);

      const url = event?.url;
      if (url) {
        const parsedUrl = new URL(url);
        const account_id = parsedUrl.searchParams.get("account_id");
        const public_key = parsedUrl.searchParams.get("public_key");
        const transactionHashes =
          parsedUrl.searchParams.get("transactionHashes");

        if (account_id && public_key) {
          setAccountDetails({ account_id, public_key });
        }
        if (transactionHashes) {
          setTransactionHashes(transactionHashes);
        }

        WebBrowser.dismissBrowser();
      }
    };

    Linking.addEventListener("url", handleDeepLink);
  }, []);

  const handleLogin = async () => {
    await WebBrowser.openBrowserAsync(
      "https://wallet.mintbase.xyz/connect?success_url=exp://192.168.1.40:8081"
    );
  };
  const handleSubmitTransaction = async () => {
    const tx = [
      {
        receiverId: "0.drop.proxy.mintbase.near",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "mint",
              args: {
                metadata:
                  '{"media":"C6iWEOxKqUHJ2eAr5_3i0jyiYPLCcpUdoxRvM38xViM","creatorAddress":"aurora-ahghara.near","title":"","description":""}',
                nft_contract_id: "drops.mintbase1.near",
              },
              gas: "200000000000000",
              deposit: "13500000000000000000000",
            },
          },
        ],
      },
    ];

    await WebBrowser.openBrowserAsync(
      `https://wallet.mintbase.xyz/sign-transaction?transactions_data=${encodeURI(
        JSON.stringify(tx)
      )}&callback_url=exp://192.168.1.40:8081`
    );
  };

  return (
    <View style={styles.container}>
      {accountDetails.account_id && (
        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>Account Details</Text>
          <Text style={styles.detailText}>
            Account ID: {accountDetails.account_id}
          </Text>
          <Text style={styles.detailText}>
            Public Key: {accountDetails.public_key}
          </Text>
        </View>
      )}
      {transactionHashes && (
        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>Transaction Status</Text>
          <Text style={styles.detailText}>
            Transaction Hash: {transactionHashes}
          </Text>
          <Text style={styles.detailText}>Transaction Submitted!</Text>
        </View>
      )}
      {!accountDetails.account_id ? (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Connect Account</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmitTransaction}
        >
          <Text style={styles.buttonText}>Submit Transaction</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#f5f5f5", // Softer background color
  },
  button: {
    backgroundColor: "#6200EE", // Vibrant button color
    color: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16, // Clearer, larger text
  },
  detailsContainer: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: "#FFFFFF", // Light background for the detail boxes
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#333333", // Softer text color for details
    lineHeight: 20,
    textAlign: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5, // Adds a little space below the title
    color: "#333",
  },
});
