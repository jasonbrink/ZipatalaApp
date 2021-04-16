import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import FilterDialog from '../components/FilterDialog';
import HealthFacilityImage from '../components/HealthFacilityImage'
import * as Constants from '../config/constants';
import zipatala from '../api/zipatala';


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
	 * We can get raw data a few ways - from the API, from AsyncStorage, or from an asset file. In any case,
	 * we take a few steps to process it.
	 */
	const processRawZipatalaData = (rawData) => {
		/* Next, filter the raw data to only include facilities that are actually functional */
		const _zipatalaData = rawData.data.filter(item => {
			return item.status == 'Functional';
		});

		console.log("Number of facilities:");
		console.log(_zipatalaData.length);
		
		/* Store the complete list of facilities */
		setZipatalaDataComplete(_zipatalaData);
	};


	/*
	 * This function will first check if the Zipatala data needs to be refresh (ie. if it has never
	 * been loaded from the API, or the last refresh is too old). If so, it will initaite an API call
	 * and stored the resulting data.
	 */
	const refreshZipatalaData = async() => {
		try {
			/* First, check to see the date when the Zipatala data was last updated from the server */
			const lastUpdatedDate = await AsyncStorage.getItem(Constants.AS_LastDataUpdatedDate);

			/* Initialize daysOld to a large number. If we've never gotten data from the server, this
			 * will trigger a refresh. */
			let daysOld = 999;

			/* If there is a last updated date, and it is within the last 3 days, try to use the stored data */
			if (lastUpdatedDate) {
				const today = new Date();
				/* Take the difference between the dates and divide by milliseconds per day.
				 * Round to nearest whole number to deal with DST. */
				daysOld = Math.round((today-new Date(lastUpdatedDate))/(1000*60*60*24));

				console.log("It appears data was last updated on " + lastUpdatedDate);
				console.log("This means data is " + daysOld + " days old.");
			}


			if (daysOld >= Constants.RefreshDataWhenDaysOld) {
				console.log("Querying API for fresh Zipatala data...");

				/* We want to get updated data, so call the API. */
				const response = await zipatala.get('/facilities/list');
			
				if (response) {
					const currentDate = new Date();
					console.log("Got response. Storing...");
		
					await AsyncStorage.setItem(Constants.AS_ZipatalaFacilitiesList, JSON.stringify(response.data));
					console.log("Stored!");
					await AsyncStorage.setItem(Constants.AS_LastDataUpdatedDate, currentDate.toString());
					console.log("Set last date");

					/* Finally, process the data so it will be displayed on the screen */
					processRawZipatalaData(response.data);
				} else {
					console.log('Response not received from Zipatala API');
				}
	
			}
			
		} catch(err) {
			console.log("Error in refreshing Zipatala data");
			console.log(err);
		}
	};


	/*
	 * Get all the Zipatala data. The goal here is to get data on the screen as quickly as possible from
	 * local cache, and then try to download updated data if the last update is old
	 */
	const getZipatalaData = async() => {
		try {
			let rawData = null;

			/* First, try to load data from AsyncStorage, from whenever the last call to the server was */
			const storedData = await AsyncStorage.getItem(Constants.AS_ZipatalaFacilitiesList);
			if (storedData) {
				rawData = JSON.parse(storedData);
				console.log("Got data from AsyncStorage");
			} else {
				/* If there is nothing in AsyncStorage, use the data in the asset file distributed with the app */
				rawData = require('../../assets/zipatala-facilities.json');
				console.log("Got data from asset file");
			}

			processRawZipatalaData(rawData);

			setMessageZipatala('');

			/* Now that we have SOMETHING available to display, see if we might need to REFRESH the data */
			refreshZipatalaData();
		}
		catch (err) {
			console.log(err);
			setMessageZipatala('Something went wrong getting Zipatala health facility data');
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