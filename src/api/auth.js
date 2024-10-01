import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';

export const login = async (email, password) => {
	const auth = getAuth();
	return signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email, password) => {
	const auth = getAuth();
	return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
	const auth = getAuth();
	return signOut(auth);
};
