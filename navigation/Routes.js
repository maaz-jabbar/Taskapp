import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createBottomTabNavigator
} from "react-navigation";
import {Entypo,FontAwesome, Ionicons} from "@expo/vector-icons";
import { FlexibleTabBarComponent,withCustomStyle} from 'react-navigation-custom-bottom-tab-component/FlexibleTabBarComponent';
//Screens
import Home from "../containers/Home";
import Login from "../containers/Login";
import Signup from "../containers/SignUp";
import Assigned from "../containers/Assigned";
import ChooseUser from "../containers/ChooseUser";
import Notifications from "../containers/Notifications";
import Group from "../containers/Group";
import GroupDetails from "../containers/GroupDetails";
import { Colors } from "../constants/color";
//Components
import Drawer from "../components/Drawer";
const iconSize = 25

const stackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null
      }
    },Notifications: {
      screen: Notifications,
      navigationOptions: {
        header: null
      }
    },
    GroupDetails: {
      screen: GroupDetails,
      navigationOptions: {
        header: null
      }
    },
    
    Group: {
      screen: Group,
      navigationOptions: {
        header: null
      }
    },
    
    ChooseUser: {
      screen: ChooseUser,
      navigationOptions: {
        header: null
      }
    }
  },
  { initialRouteName: "Home" }
);
const assigned = createStackNavigator({
  Assigned: {
    screen: Assigned,
    navigationOptions: {
      header: null
    }
  },
})
const bottom = createBottomTabNavigator(
  {
    Profile:{
      screen:assigned,
      navigationOptions:{
        tabBarIcon: <FontAwesome name= "user" size={iconSize} color={Colors.darkTheme.textPrimary}/>
      }
    },
    Groups:{
      screen:stackNavigator,
      navigationOptions: {
        tabBarIcon :  <Entypo name="home" size={iconSize} color={Colors.darkTheme.textPrimary}/>,
        
      }
    },
  },
  {
    initialRouteName: "Groups",
    tabBarComponent: withCustomStyle({
      style: {
        backgroundColor: Colors.darkTheme.primaryColor,
      },
      backgroundViewStyle: {
        backgroundColor: Colors.darkTheme.buttonColor
      },
      activeTintColor: Colors.darkTheme.textPrimary,
    })(FlexibleTabBarComponent)
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      showLabel: true,
      showIcon: true,
      indicatorStyle: {
        backgroundColor: 'transparent'
      },
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 2,
        borderTopColor: 'transparent'
      },
      labelStyle: {
        fontSize: 12
      }
    },
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true
  }
);
const AppNavigator = createDrawerNavigator(
  {
    bottom
  },
  {
    initialRouteName: "bottom",
    contentComponent: ({ navigation }) => <Drawer navigation={navigation} />
  }
);

const authStackNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Signup: {
      screen: Signup,
      navigationOptions: {
        header: null
      }
    }
  },
  { initialRouteName: "Login" }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      App: AppNavigator,
      Auth : authStackNavigator
    },
    {
      initialRouteName: "Auth"
    }
  )
);
