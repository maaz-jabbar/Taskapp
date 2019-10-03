import React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import {Colors} from '../../constants/color'
import { connect } from "react-redux";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Header, CheckBox } from "react-native-elements";
import { ToastAndroid, Image } from "react-native";
import { getUsers, inviteUsers } from "../../redux/actions/action";

class ChooseUser extends React.Component {
  state = {
    selected: [],
    notUsers: [],
    docref: "868799"
  };
  componentDidMount() {
    this.props.getUsers();
    var members = this.props.navigation.getParam("members");
    var docref = this.props.navigation.getParam("docref");
    var notUsers = this.props.allUsers.filter(user => {
      return members.indexOf(user.uid) === -1;
    });

    this.setState({
      notUsers,
      docref
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Ionicons
              name="md-arrow-round-back"
              size={30}
              color="white"
              onPress={() => this.props.navigation.navigate("Home")}
            />
          }
          centerComponent={{
            text: "Select Users",
            style: { color: "#fff", fontSize: 18, fontFamily: "Roboto" }
          }}
          containerStyle={{
            backgroundColor: Colors.darkTheme.primaryColor,
            justifyContent: "space-around"
          }}
        />
        <ScrollView style={{ flex: 1, alignSelf: "stretch" }}>
          <CheckBox
            checked={this.state.notUsers.length === this.state.selected.length}
            onPress={() => {
              var temp = [];
              if (this.state.notUsers.length === this.state.selected.length) {
                this.setState({
                  selected: []
                });
              } else {
                for (let i = 0; i < this.state.notUsers.length; i++) {
                  temp.push(this.state.notUsers[i].uid);
                }
                this.setState({
                  selected: temp
                });
              }
            }}
            title="Select All"
          />
          {/* <Text>{JSON.stringify(this.state.selected)}</Text> */}
          {this.state.notUsers.map(item => {
            var checked =
              this.state.selected.indexOf(item.uid) !== -1 ? true : false;
            return (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 7
                  }}
                >
                  <CheckBox
                    checked={checked}
                    onPress={() => {
                      var a = this.state.selected.indexOf(item.uid);
                      if (a === -1) {
                        this.setState({
                          selected: [...this.state.selected, item.uid]
                        });
                      } else {
                        var temp = this.state.selected;
                        temp.splice(a, 1);
                        this.setState({
                          selected: temp
                        });
                      }
                    }}
                  />
                  <View style={{ alignSelf: "stretch", width: "100%" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={{ uri: item.downloadURL }}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 50,
                          borderWidth: 0.5,
                          borderColor: "black"
                        }}
                      />
                      <Text style={{ marginLeft: 20 }}>{item.name}</Text>
                    </View>
                    <View
                      style={{
                        height: 0.5,
                        marginTop: 7,
                        width: "80%",
                        backgroundColor: "#000",
                        alignSelf: "stretch",
                        backgroundColor: "#ccc"
                      }}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {this.state.selected.length ? (
          <TouchableOpacity
            style={styles.floater}
            onPress={() => {
              this.props.inviteUsers(
                this.state.selected,
                this.state.docref,
                this.props.navigation
              );
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                height: 50,
                width: 50,
                backgroundColor: Colors.darkTheme.primaryColor,
                elevation: 2
              }}
            >
              <MaterialIcons name="done" size={40} color="white" />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

function mapstate(state) {
  return {
    uid: state.basicInfo.uid,
    allUsers: state.basicInfo.allUsers
  };
}
function mapdispatch(dispatch) {
  return {
    getUsers: () => {
      dispatch(getUsers());
    },
    inviteUsers: (selected, docref, nav) => {
      dispatch(inviteUsers(selected, docref, nav));
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(ChooseUser);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor : Colors.darkTheme.backgroundColor,
  },
  floater: {
    //Here is the trick
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 30,
    bottom: 30
  }
});
