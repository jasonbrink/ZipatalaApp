import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
	return (
		<View>
			<Text>Settings Page</Text>
		</View>
	);
};

SettingsScreen.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
		<Feather name="menu" style={styles.iconStyle} onPress={() => navigation.openDrawer()} />
	)
});


const styles = StyleSheet.create({
	iconStyle: {
		fontSize: 28,
		marginHorizontal: 10,
		color: '#fff'
	}
});

export default SettingsScreen;