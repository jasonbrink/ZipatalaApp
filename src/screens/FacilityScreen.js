import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import openMap from 'react-native-open-maps';
import HealthFacilityImage from '../components/HealthFacilityImage'
import zipatala from '../api/zipatala';

const FacilityScreen = ({ navigation }) => {
	const facility = navigation.getParam('facility');

	/*
	 * Not sure if we need to make a seperate call to get more details?
	 *
	const [details, setDetails] = useState(null);

	const getMoreDetails = async () => {
		const response = await zipatala.get(`/facilities/${id}`,
		{
			params: {
				filter: {"include":["owner","facilityType","operationalStatus","regulatoryStatus","contactPeople","addresses","locations","geolocations",{"district":"zone"}]}
			}
		});
		setDetails(response.data);
	};
	*/
	
	const goToMap = () => {
		const endString = String(facility.latitude) + ',' + String(facility.longitude);
		console.log(endString);
		
		/* We want to open the map with a marker at the designated spot. The way to do that
		 * is a bit different on each platform 
		 */
		if (Platform.OS === 'ios') {
			openMap({
				latitude: Number(facility.latitude), 
				longitude: Number(facility.longitude),
				query: facility.name
				});
		} else {
			openMap({
				latitude: Number(facility.latitude), 
				longitude: Number(facility.longitude),
				end: endString
				});
		}
	};
	
	return (
		<View style={styles.container}>
			<View style={styles.imageIcon}>
				<HealthFacilityImage
					facilityType={facility.type}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.heading}>{facility.name}</Text>
				<Text style={styles.normal}>Facility Type: {facility.type}</Text>
				<Text style={styles.normal}>Operational Status: {facility.status}</Text>
				<Text style={styles.normal}>District: {facility.district}</Text>
				<Text style={styles.normal}>Ownership: {facility.ownership}</Text>
				<Text style={styles.normal}>Latitude: {facility.latitude}</Text>
				<Text style={styles.normal}>Longitude: {facility.longitude}</Text>
				<TouchableOpacity style={styles.mapButton} onPress={goToMap}>
					<Text style={styles.buttonText}>Open Map</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

FacilityScreen.navigationOptions = ({ navigation }) => ({
    title: 'Facility Details'
});

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		backgroundColor: '#fff',
		flexDirection: 'row'
	},
	imageIcon: {
		width: 60,
		height: 60
	},
	textContainer: {
		flex: 1,
		paddingLeft: 10
	},
	heading: {
		fontSize: 24,
		marginBottom: 10
	},
	normal: {
		fontSize: 16
	},
	mapButton: {
		marginVertical: 20,
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#CE1126',
		alignItems: 'center'
	},
	buttonText: {
		fontSize: 20,
		color: '#fff'
	}
});

export default FacilityScreen;