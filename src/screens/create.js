import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Image } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../App";
import Button from "../components/button";
import Input from "../components/input";
import RadioInput from "../components/radio-input";

const noteColorOptions = ["red", "blue", "green"];

export default function Create({ navigation, route, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noteColor, setNoteColor] = useState("blue");
  const [loading, setLoading] = useState(false);

  const onPressCreate = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: title,
        description: description,
        color: noteColor,
        uid: user.uid,
      });
      console.log("docRef ", docRef);
      setLoading(false);
      showMessage({
        message: "Note created successfully",
        type: "success",
      });
      navigation.goBack();
    } catch (err) {
      console.log("err ", err);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      <Input placeholder="Title" onChangeText={(text) => setTitle(text)} />

      <Input
        placeholder="Description"
        onChangeText={(text) => setDescription(text)}
        multiline={true}
      />

      <View style={{ marginTop: 25, marginBottom: 15 }}>
        <Text>Select your note color</Text>
      </View>
      {noteColorOptions.map((option, index) => (
        <RadioInput
          key={index}
          label={option}
          value={noteColor}
          setValue={setNoteColor}
        />
      ))}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Submit"
          customStyles={{
            marginTop: 25,
            alignSelf: "center",
            marginTop: 60,
            width: "100%",
          }}
          onPress={onPressCreate}
        />
      )}
    </SafeAreaView>
  );
}
