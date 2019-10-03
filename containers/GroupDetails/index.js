import React from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {Colors} from '../../constants/color'
import { connect } from "react-redux";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Images } from "../../utils";
import { makeAdmin, removeUser, leaveGroup } from "../../redux/actions/action";
import  CustomHeader from "../../components/Header";
import Modal from "react-native-modal";
import firebase from "firebase";
require("firebase/firestore");

class GroupDetails extends React.Component {
  async componentDidMount() {
    const { navigation } = this.props;
    const groupTitle = navigation.getParam("groupTitle");
    const groupDescription = navigation.getParam("groupDescription");
    const docref = navigation.getParam("docref");
    this.setState({
      groupDescription,
      groupTitle,
      docref
    });
    await firebase
      .firestore()
      .collection("Groups")
      .doc(docref)
      .onSnapshot(doc => {
        this.setState({
          admins: doc.data().admins,
          members: doc.data().members
        });
        this.handleUser(doc.data().members);
      });
  }
  async handleUser(members) {
    try {
      var users = [];
      for (let i = 0; i < members.length; i++) {
        const memberss = firebase
          .firestore()
          .collection("users")
          .doc(members[i]);

        await memberss.onSnapshot(doc => {
          this.setState(p => {
            const { users } = p;
            const data = doc.data();
            const flag = users.find(o => o.uid === data.uid);
            if (!flag) {
              return { ...p, users: [...p.users, doc.data()] };
            }
            const temp = users.map(i => (i.uid === data.uid ? flag : i));
            return { ...p, users: [...temp] };
          });
        });

        this.setState({
          users
        });
      }
      users = [];
    } catch (e) {
      alert(e);
    }
  }
  state = {
    groupDescription: "",
    groupTitle: "",
    members: [],
    admins: [],
    docref: "",
    users: [],
    modal: false,
    selectedUid: ""
  };
  render() {
    const {
      groupDescription,
      groupTitle,
      members,
      docref,
      admins
    } = this.state;
    const opacity = this.state.modal ? 0.5 : 1;
    return (
      <View style={[styles.container, { opacity }]}>
        <CustomHeader
          leftIcon={
            <Ionicons
              name="md-arrow-round-back"
              size={30}
              color={Colors.darkTheme.secondaryColor}
              onPress={() => this.props.navigation.goBack()}
            />
          }
          headerTitle = {groupTitle + " Details"}
           
         
        />
        <ImageBackground
          source={
            this.state.groupPic
              ? this.state.groupPic
              : Images.default_background
          }
          style={{ width: "100%", flex: 1 }}
        >
          <View style={{ position: "absolute", bottom: 10, left: 20 }}>
            <Text style={{ fontSize: 32 }}>{groupTitle}</Text>
            <Text style={{ fontSize: 12 }}>{groupDescription}</Text>
          </View>
        </ImageBackground>

        <View style={styles.innerContainer}>
          <Text style={{ color: "grey", marginTop: 20, marginBottom: 10 }}>
            Members:{" "}
          </Text>
          <ScrollView>
            {this.state.users.map((user, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    user.uid !== this.props.uid &&
                    admins.indexOf(this.props.uid) !== -1
                      ? this.setState({
                          modal: !this.state.modal,
                          selectedUid: user.uid
                        })
                      : null;
                  }}
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10
                  }}
                >
                  <Image
                    source={{ uri: user.downloadURL }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      borderWidth: 0.5,
                      borderColor: "black"
                    }}
                  />
                  <Text style={{ marginLeft: 10 }}>
                    {user.name}
                    {user.uid == this.props.uid ? (
                      <Text style={{ color: "grey" }}> (You)</Text>
                    ) : null}
                  </Text>
                  {admins.indexOf(user.uid) !== -1 ? (
                    <View
                      style={{
                        position: "absolute",
                        right: 20,
                        borderWidth: 1,
                        paddingRight: 3,
                        paddingLeft: 3,
                        borderRadius: 5,
                        borderColor: "#00FF00"
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "#00FF00" }}>
                        Admin
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                console.log(admins);
                if (
                  admins.indexOf(this.props.uid) !== -1 &&
                  admins.length === 1 && members.length < 1
                ) {
                  let temp = members.filter(member => {
                    return member !== this.props.uid;
                  });
                  let temp1 = Math.ceil(Math.random() * temp.length - 1);
                  this.props.makeAdmin(
                    temp[temp1],
                    docref,
                    this.props.navigation
                  );
                }
                this.props.leaveGroup(
                  this.props.uid,
                  docref,
                  this.props.navigation,
                  this.props.uid
                );
              }}
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                marginBottom: 3,
                height: 50,
                backgroundColor: "#f0f0f0",
                borderRadius: 5,
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons
                name="logout"
                color="red"
                size={25}
                style={{ marginLeft: 20 }}
              />
              <Text style={{ color: "red", marginLeft: 10 }}>Leave Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.deleteGroup(docref)}
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                height: 50,
                backgroundColor: "#f0f0f0",
                borderRadius: 5,
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons
                name="delete"
                color="red"
                size={25}
                style={{ marginLeft: 20 }}
              />
              <Text style={{ color: "red", marginLeft: 10 }}>Delete Group</Text>
            </TouchableOpacity>
          </ScrollView>
          <Modal
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            visible={this.state.modal}
            onBackButtonPress={() => {
              this.setState({ modal: !this.state.modal, selectedUid: "" });
            }}
          >
            <View
              style={{
                alignSelf: "center",
                alignItems: "center",
                borderWidth: 0.5,
                borderColor: "#ccc",
                width: "80%"
              }}
            >
              {admins.indexOf(this.state.selectedUid) === -1 ? (
                <TouchableOpacity
                  onPress={() => {
                    this.props.makeAdmin(
                      this.state.selectedUid,
                      docref,
                      this.props.navigation
                    );
                    this.setState({
                      modal: !this.state.modal
                    });
                  }}
                  style={styles.modal}
                >
                  <Text>Make Admin</Text>
                </TouchableOpacity>
              ) : null}
              <View
                style={{ height: 0.5, backgroundColor: "#ccc", width: "100%" }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.props.removeUser(
                    this.state.selectedUid,
                    docref,
                    this.props.navigation,
                    this.props.uid
                  );
                  this.setState({
                    modal: !this.state.modal
                  });
                }}
                style={styles.modal}
              >
                <Text>Remove User</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

function mapstate(state) {
  return {
    username: state.basicInfo.username,
    uid: state.basicInfo.uid,
    email: state.basicInfo.email
  };
}
function mapdispatch(dispatch) {
  return {
    removeUser: (selected, docref, nav, myuid) => {
      dispatch(removeUser(selected, docref, nav, myuid));
    },
    makeAdmin: (uid, docref, nav) => {
      dispatch(makeAdmin(uid, docref, nav));
    },
    leaveGroup: (selected, docref, nav, myuid) => {
      dispatch(leaveGroup(selected, docref, nav, myuid));
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(GroupDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor : Colors.darkTheme.backgroundColor,
  },
  innerContainer: {
    margin: 20,
    flex: 2
  },
  modal: {
    backgroundColor: "white",
    height: 40,
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
  }
});
