// api/note.js
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';

// Function to add a new note
export const createNote = async (db, noteData) => {
	try {
		const docRef = await addDoc(collection(db, 'notes'), noteData);
		return { success: true, id: docRef.id };
	} catch (error) {
		console.error('Error creating note: ', error);
		return { success: false, error };
	}
};

// Function to get notes for a specific user
export const getUserNotes = (db, uid, setNotes, setLoading) => {
	try {
		const q = query(collection(db, 'notes'), where('uid', '==', uid));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const notesList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNotes(notesList);
			setLoading(false);
		});

		return unsubscribe;
	} catch (error) {
		console.error('Error fetching notes:', error);
		setLoading(false);
	}
};

// Function to delete a note
export const deleteNote = async (db, noteId) => {
	try {
		await deleteDoc(doc(db, 'notes', noteId));
		return { success: true };
	} catch (error) {
		console.error('Error deleting note:', error);
		return { success: false, error };
	}
};

// Function to update a note
export const updateNote = async (db, noteId, noteData) => {
	try {
		await updateDoc(doc(db, 'notes', noteId), noteData);
		return { success: true };
	} catch (error) {
		console.error('Error updating note: ', error);
		return { success: false, error };
	}
};
