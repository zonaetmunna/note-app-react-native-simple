import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	CheckBox,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteNote, getUserNotes } from '../api/note'; // Import API functions
import { useAuth } from '../context/AuthContext';

export default function Home({ navigation }) {
	const { db, user } = useAuth();
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe;
		if (user && db) {
			// Fetch notes using the API function
			unsubscribe = getUserNotes(db, user.uid, setNotes, setLoading);
		}
		return () => unsubscribe && unsubscribe(); // Clean up the listener
	}, [user, db]);

	const handleDelete = async (id) => {
		const result = await deleteNote(db, id); // Use the API function to delete the note
		if (result.success) {
			console.log('Note deleted successfully');
		} else {
			console.error('Error deleting note:', result.error);
		}
	};

	// Render right action for swipeable row
	const renderRightActions = (itemId) => (
		<View style={styles.deleteButtonContainer}>
			<Pressable style={styles.deleteButton} onPress={() => handleDelete(itemId)}>
				<AntDesign name='delete' size={24} color='white' />
			</Pressable>
		</View>
	);

	// Helper function to render checklist items
	const renderChecklist = (checklist) => (
		<View>
			{checklist.map((item, index) => (
				<View key={index} style={styles.checklistItem}>
					<CheckBox value={item.checked} />
					<Text style={styles.checklistText}>{item.label}</Text>
				</View>
			))}
		</View>
	);

	// Render note card with swipeable action and handle different note types
	const renderItem = ({ item }) => (
		<GestureHandlerRootView>
			<Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
				<View style={[styles.card, { backgroundColor: item.color }]}>
					<Pressable onPress={() => navigation.navigate('Update', { item })}>
						{/* If the note has an image, display it */}
						{item.image && <Image source={{ uri: item.image }} style={styles.noteImage} />}

						<Text style={styles.title}>{item.title}</Text>

						{/* Render different content based on note type */}
						{item.type === 'Checklist' ? (
							renderChecklist(item.checklist) // Render checklist items
						) : (
							<Text style={styles.description}>{item.description}</Text>
						)}
					</Pressable>
				</View>
			</Swipeable>
		</GestureHandlerRootView>
	);

	if (loading) {
		return (
			<SafeAreaView style={styles.centered}>
				<ActivityIndicator />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Notes</Text>
				<Pressable onPress={() => navigation.navigate('Create')}>
					<AntDesign name='pluscircleo' size={24} color='black' />
				</Pressable>
			</View>

			<FlatList
				data={notes}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ padding: 20 }}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// Centered view for loading spinner
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Modern header with shadow
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5, // For Android shadow
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},

	// Modern card design with shadow
	card: {
		borderRadius: 15,
		padding: 20,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5, // For Android shadow
	},

	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 5,
	},
	description: {
		fontSize: 14,
		color: '#eee',
	},

	// Styling for the note image
	noteImage: {
		width: '100%',
		height: 150,
		borderRadius: 15,
		marginBottom: 10,
	},

	// Checklist item styling
	checklistItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	checklistText: {
		marginLeft: 10,
		color: '#eee',
	},

	// Delete button for swipe
	deleteButtonContainer: {
		width: 40,
		backgroundColor: '#FF4D4D',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 15,
		borderBottomRightRadius: 15,
	},
	deleteButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
