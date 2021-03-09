import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import DisclamerScreen from './src/screens/DisclamerScreen';
import FacilityScreen from './src/screens/FacilityScreen';

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
	Disclamer: DisclamerScreen,
	Facility: FacilityScreen
  },
  {
    initialRouteName: 'Disclamer',
    defaultNavigationOptions: {
      title: 'Zipatala Malawi Facilities'
    }
  }
);

export default createAppContainer(navigator);
