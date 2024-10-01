import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function Input({
	placeholder,
	onChangeText,
	secureTextEntry = false,
	value,
	autoCapitalize,
	multiline,
}) {
	return (
		<TextInput
			style={styles.input}
			placeholder={placeholder}
			onChangeText={onChangeText}
			autoCorrect={false}
			secureTextEntry={secureTextEntry}
			value={value}
			autoCapitalize={autoCapitalize}
			multiline={multiline}
			underlineColorAndroid='transparent' // Ensures no underline or extra focus border on Android
			selectionColor='#4CAF50' // Optional: sets the color of the cursor
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderBottomWidth: 1,
		borderBottomColor: '#4CAF50', // Set the bottom border color (green in this case)
		paddingVertical: 10,
		marginBottom: 20,
		fontSize: 16, // Optional: to adjust text size for better UX
	},
});
