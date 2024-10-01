import React from 'react';
import { StyleSheet, Text, View } from 'react-native'; // Add missing imports

export default function Settings() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Settings</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
	},
});
