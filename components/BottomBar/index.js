import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";
import { Colors } from "../../constants/color";

class BottomBar extends React.Component {
  state = {
    imageUri: ""
  };

  navigateToScreen(route) {
    this.props.changeNav(route);
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);

  }
  render() {
    const {activeItemKey} = this.props;
    const iconSize = 20;
    return (
      <View style={styles.container}>

        <TouchableOpacity
          onPress={this.navigateToScreen.bind(this, "Assigned")}
          style={styles.routeView}
        >

           
            <FontAwesome
              name= {activeItemKey == "Assigned" ?"user":"user-o"}
              size={iconSize}
              color={activeItemKey == "Assigned" ? "white" : Colors.darkTheme.secondaryColor}
            />
            <Text style={[styles.bottomBarText,{color:(activeItemKey == "Assigned" )? "white" : Colors.darkTheme.secondaryColor}]}>Assigned</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigateToScreen.bind(this, "Home")}
          style={styles.routeView}
        >

            {activeItemKey === 'Home'
            ?<Entypo
              name="home"
              size={iconSize}
              color="white"
            />
          :<MaterialCommunityIcons name="home-outline"
          size={iconSize}
          color={Colors.darkTheme.secondaryColor}/>
          }
            <Text style={[styles.bottomBarText,{color:(activeItemKey == "Home" )? "white" : Colors.darkTheme.secondaryColor}]}>My Groups</Text>

        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.navigateToScreen.bind(this, "Notifications")}
          style={styles.routeView}>

        <Ionicons
        name = {(activeItemKey == 'Notifications')?"ios-notifications":"ios-notifications-outline"}
        size={iconSize}
        color={activeItemKey == "Notifications" ? "white" : Colors.darkTheme.secondaryColor}
        />

            <Text style={[styles.bottomBarText,{color:(activeItemKey == "Notifications" )? "white" : Colors.darkTheme.secondaryColor}]}>Notifications</Text>

        </TouchableOpacity>
      </View>
    );
  }
}

function mapstate(state) {
  return {
    activeItemKey: state.basicInfo.activeItemKey
  };
}
function mapdispatch(dispatch) {
  return {
    changeNav: route => {
      dispatch({ type: "CHANGE_NAV", payload: route });
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(BottomBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.darkTheme.primaryColor,
    height: 60,
    alignItems: "center"
  },
  bottomBarText: {
    fontSize: 10,
    marginTop:3
  },
  routeView:{
      justifyContent: "center",
      height: 50,
      alignItems: "center",
      width:100,
  }
});
