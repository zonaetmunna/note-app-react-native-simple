import * as ImagePicker from 'expo-image-picker'; // Import image picker
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateNote } from '../api/note'; // Import updateNote API function
import Button from '../components/button';
import RadioInput from '../components/radio-input';
import { useAuth } from '../context/AuthContext';

const noteColorOptions = ['red', 'blue', 'green'];
const noteTypeOptions = ['Description', 'Checklist']; // Note types

export default function Update({ navigation, route }) {
	const noteItem = route.params.item;
	const [title, setTitle] = useState(noteItem.title);
	const [description, setDescription] = useState(noteItem.description || '');
	const [checklist, setChecklist] = useState(
		noteItem.checklist || [{ id: 1, text: '', completed: false }]
	); // Checklist state
	const [noteColor, setNoteColor] = useState(noteItem.color);
	const [noteType, setNoteType] = useState(noteItem.type || 'Description');
	const [image, setImage] = useState(noteItem.image || null); // For storing selected image
	const [loading, setLoading] = useState(false);

	const { db } = useAuth(); // Get db from AuthContext

	// Function to pick an image
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.uri); // Set image URI from picker
		}
	};

	const updateChecklistItem = (id, text) => {
		const updatedChecklist = checklist.map((item) =>
			item.id === id ? { ...item, text: text } : item
		);
		setChecklist(updatedChecklist);
	};

	const addChecklistItem = () => {
		setChecklist([...checklist, { id: checklist.length + 1, text: '', completed: false }]);
	};

	const onPressUpdate = async () => {
		setLoading(true);
		try {
			// Prepare the updated data
			const updatedData = {
				title: title,
				description: noteType === 'Description' ? description : null,
				checklist: noteType === 'Checklist' ? checklist.filter((item) => item.text) : null,
				color: noteColor,
				type: noteType,
				image, // Add image if it exists
			};

			// Use updateNote from the API
			const result = await updateNote(db, noteItem.id, updatedData);

			if (result.success) {
				showMessage({
					message: 'Note updated successfully',
					type: 'success',
				});
				navigation.goBack();
			} else {
				showMessage({
					message: 'Failed to update note',
					type: 'danger',
				});
			}
		} catch (err) {
			console.log('Error updating note:', err);
			showMessage({
				message: 'An error occurred while updating the note',
				type: 'danger',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.formContainer}>
				<Text style={styles.header}>Update Your Note</Text>

				<TextInput
					placeholder='Title'
					onChangeText={(text) => setTitle(text)}
					value={title}
					style={styles.input}
				/>

				{/* Conditionally render input or checklist options based on note type */}
				{noteType === 'Description' ? (
					<TextInput
						placeholder='Description'
						onChangeText={(text) => setDescription(text)}
						multiline={true}
						value={description}
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

				{/* Image picker */}
				<View style={styles.imagePickerContainer}>
					<Button
						title={image ? 'Change Image' : 'Add Image'}
						customStyles={styles.imageButton}
						onPress={pickImage}
					/>
					{image && <Image source={{ uri: image }} style={styles.imagePreview} />}
				</View>

				{/* Note Type Selection */}
				<View style={styles.noteTypeContainer}>
					<Text style={styles.label}>Note Type</Text>
					<View style={styles.radioGroup}>
						{noteTypeOptions.map((option, index) => (
							<RadioInput key={index} label={option} value={noteType} setValue={setNoteType} />
						))}
					</View>
				</View>

				{/* Color Selection */}
				<View style={styles.colorPickerContainer}>
					<Text style={styles.label}>Select your note color</Text>
					<View style={styles.radioGroup}>
						{noteColorOptions.map((option, index) => (
							<RadioInput key={index} label={option} value={noteColor} setValue={setNoteColor} />
						))}
					</View>
				</View>

				{loading ? (
					<ActivityIndicator style={styles.loader} />
				) : (
					<Button title='Update Note' customStyles={styles.updateButton} onPress={onPressUpdate} />
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f4f7',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	formContainer: {
		width: '100%',
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 10,
		marginBottom: 20,
		fontSize: 16,
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
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

	// Styles for the image picker section
	imagePickerContainer: {
		marginBottom: 20,
		alignItems: 'center',
	},
	imageButton: {
		backgroundColor: '#3b5998',
		color: '#fff',
		width: '100%',
	},
	imagePreview: {
		width: '100%',
		height: 200,
		borderRadius: 15,
		marginTop: 10,
	},

	// Styles for radio group for note type and color
	radioGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	noteTypeContainer: {
		marginBottom: 20,
	},
	colorPickerContainer: {
		marginTop: 15,
		marginBottom: 25,
	},
	label: {
		fontSize: 16,
		color: '#333',
		marginBottom: 10,
	},
	updateButton: {
		marginTop: 20,
		alignSelf: 'center',
		width: '100%',
		backgroundColor: '#4CAF50', // A modern color for the button
	},
	loader: {
		marginTop: 20,
	},
});
