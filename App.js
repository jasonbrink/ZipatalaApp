import React from 'react';
import { SafeAreaView, ScrollView, View, Dimensions } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import HomeScreen from './src/screens/HomeScreen';
import DisclamerScreen from './src/screens/DisclamerScreen';
import FacilityScreen from './src/screens/FacilityScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import AboutScreen from './src/screens/AboutScreen';

/*
 * This is the stack navigator for the main part of the app. It includes the Home screen, plus the facility detail
 * screen you can navigate down to and back from
 */
const mainStack = createStackNavigator(
	{
	  Home: HomeScreen,
	  Facility: FacilityScreen
	},
	{
	  defaultNavigationOptions: {
		title: 'Zipatala Health Facilities',
		headerStyle: {
		  backgroundColor: '#CE1126'
		},
		headerTintColor: '#fff'
	  }
	}
);

/*
 * Create a stack navigator for other pages accessed from the menu. These
 * pages don't really need it, but seems to be the only way to get the 
 * header bar to show up
 */
const feedbackStack = createStackNavigator(
	{ Feedback: FeedbackScreen },
	{ defaultNavigationOptions: {
		title: 'Feedback',
		headerStyle: { backgroundColor: '#CE1126' },
		headerTintColor: '#fff'
	}}
);

const aboutStack = createStackNavigator(
	{ About: AboutScreen },
	{ defaultNavigationOptions: {
		title: 'About',
		headerStyle: { backgroundColor: '#CE1126' },
		headerTintColor: '#fff'
	}}
);

/*
 * This is the drawer for the main part of the app.
 */
const { width } = Dimensions.get('window');

const drawerNavigationContent = (props) => {
	return(
		<SafeAreaView style={{ flex: 1}}>
			<View style={{ margin: 20 }}>
			</View>
			<ScrollView>
				<DrawerItems {...props} labelStyle={{ fontSize: 20 }} activeTintColor='#CE1126' />
			</ScrollView>
		</SafeAreaView>
	);
};

/*
 * To the drawer navigator, we add a number of stack navigators. This is needed, even if
 * each stack navigator only has one screen, to get the header to show up. The drawer
 * navigator does not seem to display the header.
 */
const mainDrawerNavigator = createDrawerNavigator({
	Home: mainStack,
	Feedback: feedbackStack,
	About: aboutStack
},
{
	drawerPosition: 'left',
	contentComponent: drawerNavigationContent,
	drawerOpenRoute: 'DrawerOpen',
	drawerCloseRoute: 'DrawerClose',
	drawerToggleRoute: 'DrawerToggle',
	drawerWidth: (width / 3) * 2
}
);

/*
 * Finally, everything is wrapped in a switch navigator. This allows us to add the Disclaimer
 * page to the start of the app, which will only show once, followed by the main Drawer
 * navigator.
 */
const switchNavigator = createSwitchNavigator(
	{
		Disclamer: DisclamerScreen,
		MainApp: mainDrawerNavigator
	},
	{
		initialRouteName: 'Disclamer'
	}
)

export default createAppContainer(switchNavigator);
