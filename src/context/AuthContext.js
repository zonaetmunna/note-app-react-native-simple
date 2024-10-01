import { initializeApp } from 'firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseConfig } from '../firebase/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider(); // GoogleAuthProvider for Google sign-in

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Subscribe to auth state changes
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});
		return unsubscribe; // Cleanup subscription on unmount
	}, []);

	const login = async (email, password) => {
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const googleSignIn = async () => {
		setLoading(true);
		try {
			await signInWithPopup(auth, googleProvider); // Google sign-in
		} catch (error) {
			console.error('Google sign-in failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, googleSignIn, logout, loading, db }}>
			{children}
		</AuthContext.Provider> // Pass googleSignIn to the context
	);
};

export const useAuth = () => useContext(AuthContext);
