import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
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
  const noteItem = route.params.item;
  const [title, setTitle] = useState(noteItem.title);
  const [description, setDescription] = useState(noteItem.description);
  const [noteColor, setNoteColor] = useState(noteItem.color);
  const [loading, setLoading] = useState(false);

  const onPressUpdate = async () => {
    const noteRef = doc(db, "notes", noteItem.id);

    setLoading(true);
    try {
      await updateDoc(doc(db, "notes", noteItem.id), {
        title: title,
        description: description,
        color: noteColor,
      });
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
      <Input
        placeholder="Title"
        onChangeText={(text) => setTitle(text)}
        value={title}
      />

      <Input
        placeholder="Description"
        onChangeText={(text) => setDescription(text)}
        multiline={true}
        value={description}
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
          onPress={onPressUpdate}
        />
      )}
    </SafeAreaView>
  );
}
