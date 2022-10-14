import React, { useEffect } from "react";
import {View,Text,Pressable,Image,FlatList,ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import {collection,deleteDoc,doc,onSnapshot,query,where,} from "firebase/firestore";
import { db } from "../../App";

export default function Home({ navigation, route, user }) {
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // create the query
    const q = query(collection(db, "notes"), where("uid", "==", user.uid));

    // create listener to listen to the query that we just made
    const notesListenerSubscription = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot ---> ", querySnapshot);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      setNotes(list);
      setLoading(false);
    });

    return notesListenerSubscription;
  }, []);

  const renderItem = ({ item }) => {
    const { title, description, color } = item;
    return (
      <Pressable
        style={{
          backgroundColor: color,
          marginBottom: 25,
          borderRadius: 16,
          padding: 15,
        }}
        onPress={() => {
          navigation.navigate("Update", { item });
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            padding: 15,
            zIndex: 4,
          }}
          onPress={() => {
            deleteDoc(doc(db, "notes", item.id));
          }}
        >
          <AntDesign name="delete" size={24} color="red" />
        </Pressable>
        <Text style={{ color: "white", fontSize: 24 }}>{title}</Text>
        <Text style={{ color: "white", fontSize: 18, marginTop: 16 }}>
          {description}
        </Text>
      </Pressable>
    );
  };

  // go to create page
  const onPressCreate = () => {
    navigation.navigate("Create");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text>My Notes</Text>
        <Pressable onPress={onPressCreate}>
          <AntDesign name="pluscircleo" size={24} color="black" />
        </Pressable>
      </View>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}
