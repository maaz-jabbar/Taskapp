import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import { Colors } from "../../constants/color";
import { connect } from "react-redux";
import { Entypo, Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import CustomHeader from "../../components/Header";
import ElevatedView from "react-native-elevated-view";
import firebase from "firebase";
require("firebase/firestore");
import {
  getAllNotify,
  getAllGroups,
  acceptInvite,
  cancelInvite
} from "../../redux/actions/action";

class Notifications extends React.Component {


  state = {
    invited: [],
    loader: false
  };
  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          headerTitle="Notifications"
          leftIcon={{
            icon: "menu",
            color: Colors.darkTheme.secondaryColor,
            onPress: () => this.props.navigation.openDrawer()
          }}
        />
        {this.props.uid ? (
          !this.state.loader ? (
            <ScrollView style={{ alignSelf: "stretch", padding: 5, flex: 1 }}>
              {this.props.invited.length ? (
                this.props.invited.map((group, i) => {
                  return (
                    <ElevatedView key={i} elevation={5} style={styles.Notification}>
                      <View
                        
                        style={{ elevation: 1, padding: 10, margin: 10 }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <AntDesign
                            color={Colors.darkTheme.buttonColor}
                            name="addusergroup"
                            size={12}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.darkTheme.buttonColor
                            }}
                          >
                            Group Invite
                          </Text>
                        </View>
                        <Text>
                          <Text style={styles.bold}>{group.sender}</Text>{" "}
                          invited you to join{" "}
                          <Text style={styles.bold}>{group.groupTitle}</Text>
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: 5
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.props.acceptInvite(
                                this.props.uid,
                                group.docref
                              );
                            }}
                            style={styles.acceptDecline}
                          >
                            <Entypo name="check" size={25} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.acceptDecline}
                            onPress={() => {
                              this.props.cancelInvite(
                                this.props.uid,
                                group.docref
                              );
                            }}
                          >
                            <Entypo name="cross" size={25} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ElevatedView>
                  );
                })
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 22 }}>No new Notifications</Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="black" />
            </View>
          )
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text>You need to Sign In</Text>
          </View>
        )}
      </View>
    );
  }
}

function mapstate(state) {
  return {
    uid: state.basicInfo.uid,
    invited :state.basicInfo.notifications
  };
}
function mapdispatch(dispatch) {
  return {
    cancelInvite: (uid, docref) => {
      dispatch(cancelInvite(uid, docref));
    },
    acceptInvite: (uid, docref) => {
      dispatch(acceptInvite(uid, docref));
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(Notifications);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.darkTheme.backgroundColor
  },
  bold: {
    fontWeight: "bold"
  },
  acceptDecline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkTheme.buttonColor,
    borderRadius: 25,
    padding: 5,
    marginLeft: 5
  },
  Notification: {
    margin: 5,
    backgroundColor: Colors.darkTheme.secondaryColor,
    borderBottomColor: Colors.darkTheme.buttonColor,
    borderBottomWidth: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  }
});
