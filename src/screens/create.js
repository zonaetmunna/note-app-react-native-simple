import * as ImagePicker from 'expo-image-picker'; // Import Image Picker for selecting images
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNote } from '../api/note'; // Import the Firestore logic
import Button from '../components/button';
import RadioInput from '../components/radio-input';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook to access db and user

const noteColorOptions = ['red', 'blue', 'green'];
const noteTypeOptions = ['Description', 'Checklist']; // Note types

export default function Create({ navigation }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [checklist, setChecklist] = useState([{ id: 1, text: '', completed: false }]); // Checklist state
	const [noteColor, setNoteColor] = useState('blue');
	const [noteType, setNoteType] = useState('Description');
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);

	// Get db and user from AuthContext
	const { db, user } = useAuth();

	// Function to handle image selection from the device
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.uri);
		}
	};

	const addChecklistItem = () => {
		setChecklist([...checklist, { id: checklist.length + 1, text: '', completed: false }]);
	};

	const updateChecklistItem = (id, text) => {
		const updatedChecklist = checklist.map((item) =>
			item.id === id ? { ...item, text: text } : item
		);
		setChecklist(updatedChecklist);
	};

	const onPressCreate = async () => {
		if (!user || !user.uid) {
			showMessage({
				message: 'User not authenticated',
				type: 'danger',
			});
			return;
		}

		if (
			!title ||
			(!description && noteType === 'Description') ||
			(noteType === 'Checklist' && checklist.every((item) => !item.text))
		) {
			showMessage({
				message: 'Please provide title and description or checklist',
				type: 'danger',
			});
			return;
		}

		setLoading(true);
		const noteData = {
			title,
			description: noteType === 'Description' ? description : null, // Only add description if it's a description-type note
			checklist: noteType === 'Checklist' ? checklist.filter((item) => item.text) : null, // Only add checklist if it's a checklist-type note
			color: noteColor,
			type: noteType,
			image: image, // Add the image URI to the note data
			uid: user.uid, // Attach user ID to the note
		};

		const result = await createNote(db, noteData); // Use the API function to create a note

		if (result.success) {
			showMessage({
				message: 'Note created successfully',
				type: 'success',
			});
			navigation.goBack(); // Navigate back after creation
		} else {
			showMessage({
				message: 'Failed to create note',
				type: 'danger',
			});
		}

		setLoading(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.formContainer}>
				<Text style={styles.header}>Create New Note</Text>
				<TextInput
					placeholder='Title'
					onChangeText={(text) => setTitle(text)}
					style={styles.input}
				/>

				{/* Conditional Input based on note type */}
				{noteType === 'Description' ? (
					<TextInput
						placeholder='Description'
						onChangeText={(text) => setDescription(text)}
						multiline={true}
						style={[styles.input, styles.textArea]}
					/>
				) : (
					<View style={styles.checklistContainer}>
						<Text style={styles.checklistLabel}>Checklist</Text>
						{checklist.map((item, index) => (
							<View key={item.id} style={styles.checklistItem}>
								<TextInput
									placeholder={`Item ${index + 1}`}
									style={styles.checklistInput}
									value={item.text}
									onChangeText={(text) => updateChecklistItem(item.id, text)}
								/>
							</View>
						))}
						<Button
							title='Add Checklist Item'
							customStyles={styles.addChecklistButton}
							onPress={addChecklistItem}
						/>
					</View>
				)}

				<View style={styles.colorSection}>
					<Text style={styles.colorLabel}>Select your note color</Text>
					<View style={styles.radioGroup}>
						{noteColorOptions.map((option, index) => (
							<RadioInput key={index} label={option} value={noteColor} setValue={setNoteColor} />
						))}
					</View>
				</View>

				<View style={styles.typeSection}>
					<Text style={styles.colorLabel}>Select Note Type</Text>
					<View style={styles.radioGroup}>
						{noteTypeOptions.map((option, index) => (
							<RadioInput key={index} label={option} value={noteType} setValue={setNoteType} />
						))}
					</View>
				</View>

				{/* Image Picker */}
				<View style={styles.imageSection}>
					<Text style={styles.colorLabel}>Add Image (Optional)</Text>
					<TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
						<Text style={styles.imagePickerText}>Pick an Image</Text>
					</TouchableOpacity>
					{image && <Image source={{ uri: image }} style={styles.image} />}
				</View>

				{loading ? (
					<ActivityIndicator style={styles.loading} />
				) : (
					<Button title='Submit' customStyles={styles.submitButton} onPress={onPressCreate} />
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center', // Center vertically
		alignItems: 'center', // Center horizontally
		backgroundColor: '#f9f9f9', // Light background
		paddingHorizontal: 20, // Padding for responsiveness
	},

	formContainer: {
		width: '100%', // Full width
		maxWidth: 400, // Limit max width for larger screens
		backgroundColor: '#fff', // Card-like background
		borderRadius: 20, // Soft corners for a modern look
		padding: 20, // Padding inside the form
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5, // Android shadow
	},

	header: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20, // Space below the header
		color: '#333', // Darker text color for contrast
	},

	input: {
		marginBottom: 15, // Space between inputs
		backgroundColor: '#f2f2f2', // Light input background
		padding: 15, // Input padding for better touch target
		borderRadius: 10, // Rounded input
		fontSize: 16,
	},

	textArea: {
		height: 100, // Larger height for description
		textAlignVertical: 'top', // Start text at the top of the area
	},

	checklistContainer: {
		marginBottom: 15,
	},

	checklistLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 10,
	},

	checklistItem: {
		marginBottom: 10,
	},

	checklistInput: {
		backgroundColor: '#f2f2f2',
		padding: 10,
		borderRadius: 10,
	},

	addChecklistButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		marginTop: 10,
		borderRadius: 10,
	},

	colorSection: {
		marginBottom: 20, // Space before the button
	},

	colorLabel: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 10,
		color: '#333', // Darker text color
	},

	radioGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between', // Spread radio inputs evenly
	},

	typeSection: {
		marginBottom: 20, // Space before the button
	},

	imageSection: {
		marginBottom: 20, // Space before the button
	},

	imagePicker: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 10,
		alignItems: 'center',
	},

	imagePickerText: {
		color: '#fff',
		fontWeight: 'bold',
	},

	image: {
		marginTop: 10,
		width: 200,
		height: 200,
		borderRadius: 10,
	},

	loading: {
		marginVertical: 20, // Space above/below loading indicator
	},

	submitButton: {
		alignSelf: 'center', // Center the button
		width: '100%', // Full width button
		padding: 15,
		backgroundColor: '#4CAF50', // Green submit button
		color: '#fff', // White text
		borderRadius: 10, // Rounded button
		fontSize: 18, // Larger button text
	},
});
