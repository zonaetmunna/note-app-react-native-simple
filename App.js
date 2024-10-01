import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer Navigator
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';

import CustomDrawerContent from './src/components/CustomDrawerContent';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Create from './src/screens/create';
import Home from './src/screens/home';
import Login from './src/screens/login';
import Profile from './src/screens/Profile'; // Profile screen
import Settings from './src/screens/Settings'; // Settings screen
import Signup from './src/screens/signup';
import Update from './src/screens/update';

const AppTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'white',
	},
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerTitleAlign: 'center', // Center the header title for all screens in the drawer
			}}>
			<Drawer.Screen name='Home' component={Home} />
			<Drawer.Screen name='Profile' component={Profile} />
			<Drawer.Screen name='Settings' component={Settings} />
		</Drawer.Navigator>
	);
}

function AppRoutes() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator color='blue' size='large' />
			</View>
		);
	}

	return (
		<Stack.Navigator
			screenOptions={{
				headerTitleAlign: 'center', // Center the header title for all stack screens
			}}>
			{user?.email ? (
				<>
					<Stack.Screen
						name='DrawerRoutes'
						component={DrawerNavigator} // Use DrawerNavigator
						options={{ headerShown: false }} // Hide header for drawer
					/>
					<Stack.Screen name='Create' component={Create} />
					<Stack.Screen name='Update' component={Update} />
				</>
			) : (
				<>
					<Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
					<Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
				</>
			)}
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<NavigationContainer theme={AppTheme}>
				<AppRoutes />
				<FlashMessage position='top' />
			</NavigationContainer>
		</AuthProvider>
	);
}
