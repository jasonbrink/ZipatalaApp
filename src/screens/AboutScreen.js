import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ZipatalaConstants from '../config/constants';
import Constants from 'expo-constants';

const AboutScreen = ({ navigation }) => {
	const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date(ZipatalaConstants.ZipatalaAssetFilesDate));

	const getLastUpdatedDate = async () => {
		try {
			const value = await AsyncStorage.getItem(ZipatalaConstants.AS_LastDataUpdatedDate);
			if (value) {
				setLastUpdatedDate(new Date(value));
			}
		} catch(e) {
			// error reading value
			console.log('Error reading last data updated date from AsyncStorage');
			console.log(e);
		}
	}

	useEffect(() => {
		getLastUpdatedDate();
	}, []);

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.heading}>Zotech</Text>
				<Text style={styles.text}>This app was developed by Zotech to help people living in Malawi find quick, easy access to nearby health facilities.</Text>
				<TouchableOpacity
						style={styles.button}
						onPress={() => Linking.openURL('https://zotech.io')}>
					<Text style={styles.buttonText}>Visit Zotech Website</Text>
				</TouchableOpacity>
				<Text style={styles.heading}>Malawi Ministry of Health</Text>
				<Text style={styles.text}>The data for this app is provided by the Malawi Ministry of Health, through their public Zipatala website located at http://zipatala.health.gov.mw.</Text>
				<TouchableOpacity
						style={styles.button}
						onPress={() => Linking.openURL('http://zipatala.health.gov.mw')}>				
					<Text style={styles.buttonText}>Visit MOH Zipatala Website</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.debugSection}>
				<Text style={styles.smallText}>App version: {Constants.manifest.version}</Text>
				<Text style={styles.smallText}>Zipatala data last updated: {lastUpdatedDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</Text>
			</View>
		</View>
	);
};

AboutScreen.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
		<Feather name="menu" style={styles.iconStyle} onPress={() => navigation.openDrawer()} />
	)
});


const styles = StyleSheet.create({
	iconStyle: {
		fontSize: 28,
		marginHorizontal: 10,
		color: '#fff'
	},
	container: {
		flex: 1,
		margin: 20
	},
	debugSection: {
		borderTopWidth: 1,
		borderTopColor: '#ccc',
		marginTop: 10,
		paddingTop: 10
	},
	heading: {
		fontSize: 28,
		marginVertical: 10
	},
	text: {
		fontSize: 16
	},
	smallText: {
		fontSize: 14
	},
	button: {
		backgroundColor: '#CE1126',
		borderRadius: 5,
		padding: 10,
		margin: 10,
	},
	buttonText: {
		fontSize: 20,
		color: '#fff',
		alignSelf: 'center'
	}
});

export default AboutScreen;