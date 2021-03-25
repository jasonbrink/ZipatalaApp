import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import zipatala from '../api/zipatala';
import FilterDialog from '../components/FilterDialog';
import HealthFacilityImage from '../components/HealthFacilityImage'
import {Picker} from '@react-native-picker/picker';

const HomeScreen = ({ navigation }) => {
	const [zipatalaDataComplete, setZipatalaDataComplete] = useState([]);
	const [zipatalaDataFiltered, setZipatalaDataFiltered] = useState([]);
	const [messageZipatala, setMessageZipatala] = useState('Waiting for Zipatala data...');
	const [location, setLocation] = useState(null);
	const [errorMsgLoc, setErrorMsgLoc] = useState('');
	const [dataSorted, setDataSorted] = useState(false);
	const [filterDialogVisible, setFilterDialogVisible] = useState(false);
	const [facilityFilter, setFacilityFilter] = useState(null);
	
	const _MAX_FACILITIES = 50;

	/*
	 * Sort Zipatala data based on distance from current location
	 */
	const sortZipatalaByDistance = () => {
		console.log('Starting sortZipatala');
		
		/* First, ensure we have zipatala data AND location information */
		if (zipatalaDataFiltered.length == 0 || !location) {
			console.log('Abandoning sort as some data is not present');
			console.log('Zipatala data length: ' + zipatalaDataFiltered.length);
			console.log(location);
			return;
		}

		/* Add distance information to the whole list of businesses */
		const withDist = zipatalaDataFiltered.map((item) => {
			item.dist = getDistance(location.coords, {lat: item.latitude, lng: item.longitude});
			return item;
		});

		/* Finally, sort by distance */
		setZipatalaDataFiltered(withDist.sort( (a, b) => a.dist - b.dist ) );
		
		setDataSorted(true);
	};
	
	/*
	 * If the facility data or the filter has changed, apply the filter to the complete list of facilities
	 */
	const filterFacilityData = () => {
		setZipatalaDataFiltered(zipatalaDataComplete.filter(item => {
			/* If there is no filter, include ALL facilities */
			if (facilityFilter == null) {
				return true;
			} else {
				return (facilityFilter.type == null || item.type == facilityFilter.type) &&
					   (facilityFilter.district == null || item.district == facilityFilter.district);
			}
		}));
		
		/* Indicate that data needs re-sorting */
		setDataSorted(false);
	};

	/*
	 * Get data from the Zipatala API
	 */
	const getZipatalaData = async() => {
		try {
			/*const response = await zipatala.get('/facilities/list');*/
			/*setZipatalaDataComplete(response.data.data);*/
			
			/* Load the complete data from an asset file first */
			const response = require('../../assets/zipatala-facilities.json');
			
			/* Only include functional facilities */
			const _zipatalaData = response.data.filter(item => {
				return item.status == 'Functional';
			});
			
			/* Store the complete list of facilities */
			setZipatalaDataComplete(_zipatalaData);

			setMessageZipatala('');
		}
		catch (err) {
			console.log(err);
			setMessageZipatala('Something went wrong with Zipatala request');
		}
	};
	
	
	/*
	 * Get the current location of the user
	 */
	const getLocation = async() => {
		try {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsgLoc('Permission to access location was denied');
				return;
			}

			let _location = await Location.getCurrentPositionAsync({});
			setLocation(_location);
			
			/* Indicate that data needs re-sorting */
			setDataSorted(false);
		}
		catch(err) {
			console.log(err);
			setErrorMsgLoc('Problem getting location access');
		}
	};

	// Functions to call when component initially loads
	useEffect(() => {
		// Try to get current location
		getLocation();

		// Try to get Zipatala data from web API call
		getZipatalaData();
		
		// Set up a parameter for the filter button
		navigation.setParams({setFilterDialogVisible: setFilterDialogVisible});
	}, []);

	useEffect(() => {
		console.log("Facility filter:");
		console.log(facilityFilter);
		filterFacilityData();
	}, [facilityFilter, zipatalaDataComplete]);


	let locationText = 'Attempting to find your location...';
	if (errorMsgLoc) {
		locationText = errorMsgLoc;
	} else if (location) {
		locationText = null; /*'Got location! Lat: ' + location.coords.latitude + ' / Long: ' + location.coords.longitude;*/
	}
	
	if (zipatalaDataComplete.length > 0 && location && !dataSorted) {
		/* Attempt to sort by distance */
		sortZipatalaByDistance();
	}

	return (
	<View style={styles.container}>
		<FilterDialog 
			dialogVisible={filterDialogVisible}
			setDialogVisible={visible => setFilterDialogVisible(visible)}
			facilityFilter={facilityFilter}
			setFacilityFilter={setFacilityFilter}
		/>
		
		{ locationText &&
		<Text>{locationText}</Text>
		}

		{ !location && !errorMsgLoc &&
		<ActivityIndicator />
		}

		{zipatalaDataFiltered.length == 0 ? <Text>{messageZipatala}</Text> : 
		<FlatList
			data={zipatalaDataFiltered.slice(0, Math.min(zipatalaDataFiltered.length, _MAX_FACILITIES))}
			keyExtractor={(facility) => facility.code}
			renderItem={({ item }) => {
				return (
				<View style={styles.facilityContainer}>
				  <TouchableOpacity 
						style={styles.facility}
						onPress={() => navigation.navigate('Facility', 
						{
							facility: {
								id: item.id,
								name: item.name,
								ownership: item.ownership,
								type: item.type,
								status: item.status,
								district: item.district,
								latitude: item.latitude,
								longitude: item.longitude,
								dist: item.dist
							}
						})}>
					<View style={styles.imageIcon}>
						<HealthFacilityImage
							facilityType={item.type}
						/>
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.heading}>{item.name}</Text>
						<Text style={styles.subheading}>{item.type}</Text>
						<Text style={styles.subheading}>Ownership: {item.ownership}</Text>
						{item.dist ?
						<Text style={styles.subheading}>Distance: {item.dist / 1000.0} km</Text>
						:
						<Text style={styles.subheading}>District: {item.district}</Text>
						}
					</View>
				  </TouchableOpacity>
				</View>
				);
			}}
			ListFooterComponent={
				<View>
					{zipatalaDataFiltered.length > _MAX_FACILITIES &&
					<Text style={styles.footerText}>Maximum of {_MAX_FACILITIES} facilities shown. Use filters to further restrict your search.</Text>
					}
				</View>}
		/>
		}
	</View>
	);
};


HomeScreen.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
		<Feather name="menu" style={styles.iconStyle} onPress={() => navigation.openDrawer()} />
	),
	headerRight: () => (
		<TouchableOpacity
				onPress={() => {
					let displayFilter = navigation.getParam('setFilterDialogVisible');
					displayFilter(true);
				}} >
			<Feather name="filter" style={styles.iconStyle} />
		</TouchableOpacity>
	)
});



const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	facilityContainer: {
		borderTopWidth: 1,
		borderTopColor: '#ccc',
		marginBottom: 10,
		paddingTop: 10,
		paddingLeft: 10
	},
	facility: {
		marginHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'flex-end'
	},
	imageIcon: {
		width: 60,
		height: 60,
		alignSelf: 'center'
	},
	textContainer: {
		flex: 1,
		alignSelf: 'center',
		paddingLeft: 10
	},
	heading: {
		fontSize: 18,
		color: '#CE1126'
	},
	subheading: {
		fontSize: 14
	},
	iconStyle: {
		fontSize: 28,
		marginHorizontal: 10,
		color: '#fff'
	},
	footerText: {
		margin: 10
	}
});

export default HomeScreen;