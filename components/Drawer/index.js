import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { signOut } from "../../redux/actions/action";
import { signInWithFacebook } from "../../redux/actions/action";
import { Images } from "../../utils";

import ElevatedView from "react-native-elevated-view";
import { Colors } from "../../constants/color";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";
import firebase from "firebase";
require("firebase/firestore");

class Drawer extends React.Component {
  state = {
    imageUri: "",
    activeItemKey: "Home"
  };
  // componentDidMount(){
  //   alert(this.props.uid)
  // }
  navigateToScreen(route) {
    this.props.changeNav(route);
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  async handleSubmit() {
    try {
      const credentials = await signInWithFacebook();
      const newUser = credentials.additionalUserInfo.isNewUser;
      const name = credentials.user.displayName;
      const email = credentials.user.email;
      const imageUri = credentials.user.photoURL;
      if (newUser) {
        firebase
          .firestore()
          .collection("users")
          .add({
            email,
            password,
            name
          });
      }
      this.setState({
        imageUri
      });
      this.props.change(name, email);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const iconSize = 20;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          {!this.props.downloadURL ? (
            <Image source={Images.no_photo_available} style={styles.image} />
          ) : (
            <Image
              source={{ uri: this.props.downloadURL }}
              style={styles.image}
            />
          )}
          <View style={styles.username}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.darkTheme.textPrimary,
                fontWeight: "bold"
              }}
            >
              {this.props.username}
            </Text>
            <Text style={{ fontSize: 15, color: "white" }}>
              {this.props.email}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: "stretch", padding: 10 }}>
          <View style={styles.screenContainer}>
            <TouchableOpacity
              onPress={this.navigateToScreen.bind(this, "Home")}
            >
              <View
                style={[
                  styles.screenStyle,
                  this.props.activeItemKey == "Home"
                    ? styles.activeBackgroundColor
                    : null
                ]}
              >
                <Entypo
                  name="home"
                  size={iconSize}
                  color={Colors.darkTheme.textPrimary}
                  style={{ marginLeft: 20 }}
                />
                <Text
                  style={[
                    styles.screenTextStyle,
                    this.props.activeItemKey == "Home"
                      ? styles.selectedTextStyle
                      : styles.unselected
                  ]}
                >
                  Groups
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.navigateToScreen.bind(this, "Assigned")}
            >
              <View
                style={[
                  styles.screenStyle,
                  this.props.activeItemKey == "Assigned"
                    ? styles.activeBackgroundColor
                    : null
                ]}
              >
                <MaterialIcons
                  name="assignment-returned"
                  size={iconSize}
                  color={Colors.darkTheme.textPrimary}
                  style={{ marginLeft: 20 }}
                />
                <Text
                  style={[
                    styles.screenTextStyle,
                    this.props.activeItemKey == "Assigned"
                      ? styles.selectedTextStyle
                      : styles.unselected
                  ]}
                >
                  Assigned
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.navigateToScreen.bind(this, "Notifications")}
            >
              <View
                style={[
                  styles.screenStyle,
                  this.props.activeItemKey == "Notifications"
                    ? styles.activeBackgroundColor
                    : null
                ]}
              >
                <Ionicons
                  name="ios-notifications"
                  size={iconSize}
                  color={Colors.darkTheme.textPrimary}
                  style={{ marginLeft: 23, marginRight: 3 }}
                />
                <Text
                  style={[
                    styles.screenTextStyle,
                    this.props.activeItemKey == "Notifications"
                      ? styles.selectedTextStyle
                      : styles.unselected
                  ]}
                >
                  Notifications
                </Text>
                <ElevatedView elevation={10} style={styles.notiCountView}>
                  <Text style={styles.notiCountText}>
                    {this.props.count.length}
                  </Text>
                </ElevatedView>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.signOut(this.props.navigation)}
            >
              <View style={styles.screenStyle}>
                <MaterialCommunityIcons
                  name="logout"
                  color={Colors.darkTheme.textPrimary}
                  size={iconSize}
                  style={{ marginLeft: 20 }}
                />
                <Text style={[styles.screenTextStyle, styles.unselected]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

function mapstate(state) {
  return {
    username: state.basicInfo.username,
    email: state.basicInfo.email,
    downloadURL: state.basicInfo.downloadURL,
    activeItemKey: state.basicInfo.activeItemKey,
    count: state.basicInfo.notifications
  };
}
function mapdispatch(dispatch) {
  return {
    signOut: nav => {
      dispatch(signOut(nav));
    },
    change: (name, email) => {
      dispatch({ type: "LOGGEDIN_USER", payload: { name, email } });
    },
    changeNav: route => {
      dispatch({ type: "CHANGE_NAV", payload: route });
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(Drawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.darkTheme.backgroundColor
  },
  screenContainer: {
    paddingTop: 10,
    width: "100%"
  },
  screenStyle: {
    height: 40,
    flexDirection: "row",
    marginBottom: 1,
    alignItems: "center",
    width: "100%"
  },
  screenTextStyle: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 20
  },
  selectedTextStyle: {
    fontWeight: "bold",
    color: Colors.darkTheme.textPrimary
  },
  unselected: {
    color: Colors.darkTheme.textPrimary
  },
  activeBackgroundColor: {
    backgroundColor: Colors.darkTheme.buttonColor,
    borderRadius: 5
  },
  username: {
    marginLeft: 10
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 80
  },
  upperContainer: {
    alignSelf: "stretch",
    backgroundColor: Colors.darkTheme.primaryColor,
    paddingBottom: 15,
    paddingTop: 40,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center"
    // justifyContent:'space-around'
  },
  notiCountView: {
    position: "absolute",
    right: 15,
    backgroundColor: "white",
    borderRadius: 25,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  notiCountText:{
    color:Colors.darkTheme.buttonColor,
    fontWeight:'bold'
  }
});
