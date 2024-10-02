import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CustomDrawerContent(props) {
	const { user, logout } = useAuth(); // Access user info and logout function from AuthContext
	console.log('🚀 ~ CustomDrawerContent ~ user:', user);

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }} // Pushes content to the top and bottom
		>
			<View>
				<View style={styles.userInfoSection}>
					{user?.photoURL && <Image source={{ uri: user?.photoURL }} style={styles.userImage} />}
					<Text style={styles.username}>{user?.displayName || 'User Name'}</Text>
					<Text style={styles.userEmail}>{user?.email}</Text>
				</View>

				<DrawerItemList {...props} />
			</View>

			{/* Logout Button at the bottom */}
			<View style={styles.logoutButtonContainer}>
				<TouchableOpacity style={styles.logoutButton} onPress={logout}>
					<Text style={styles.logoutButtonText}>Logout</Text>
				</TouchableOpacity>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	userInfoSection: {
		padding: 20,
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		marginBottom: 10,
	},
	userImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 10,
	},
	username: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	userEmail: {
		fontSize: 14,
		color: '#777',
	},
	logoutButtonContainer: {
		padding: 20,
	},
	logoutButton: {
		padding: 15,
		backgroundColor: '#FF4D4D',
		borderRadius: 10,
		alignItems: 'center',
	},
	logoutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
