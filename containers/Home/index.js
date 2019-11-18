import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  ToastAndroid
} from "react-native";
import {Colors} from '../../constants/color'
import {
  gettodos,
  createGroup,
  getGroups,
  updateGroupInfo,
  getAllNotify,
  getAllGroups,
} from "../../redux/actions/action";
import { addd } from "../../redux/actions/action";
import { connect } from "react-redux";
import ElevatedView from "react-native-elevated-view";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome
} from "@expo/vector-icons";
import Modal from "react-native-modal";

import CustomHeader from "../../components/Header";
import firebase from "firebase";
require('firebase/firestore')

class Home extends React.Component {
  handlenotify = async () => {
    try {
      var ar = [];
      console.log(`getting notify with ${this.props.uid}`)
      const invitedArray = await getAllNotify(this.props.uid);
      invitedArray.onSnapshot(async invitation => {
        for (let i = 0; i < invitation.data().invited.length; i++) {
          const singleGroup = await getAllGroups(invitation.data().invited[i]);
          const comment = singleGroup.data();
          comment.docref = singleGroup.id;
          const getNamePromise = () =>
            firebase
              .firestore()
              .collection("users")
              .doc(comment.createdByUid)
              .get();
          const doc = await getNamePromise();
          comment.sender = doc.data().name;
          ar.push(comment);
        }
        console.log("!"+ ar)
        this.props.notify(ar)
        // this.setState({
        //   invited: ar,
        //   loader: false
        // });
        ar = [];
      });
    } catch (e) {
      alert(e);
    }
  };
  async componentDidMount() {
    if (this.props.uid) {
      await this.props.getGroups(this.props.uid);
      if (this.props.uid) this.handlenotify();
      console.log("did mount state" + this.props.groups);
      this.setState({
        uid: this.props.uid,
        groups: this.props.groups,
        loader: false
      });
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.uid) {
      return {
        uid: props.uid,
        groups: props.groups,
        loader: false
      };
    } else {
      return {
        uid: "",
        groups: [],
        loader: false
      };
    }
  }
  handleSubmit() {
    const { title, description } = this.state;
    const { uid, username, navigation } = this.props;
    let date = new Date().toDateString();

    if (title && description) {
      this.props.createGroup(
        username,
        uid,
        title,
        description,
        date,
        navigation
      );
      this.setState({
        modalVisible: !this.state.modalVisible
      });
    } else if (!title) {
      alert("Please enter Title for your Group");
    } else if (!description) {
      alert("Please enter Description for your Group");
    }
  }
  state = {
    modalVisible: false,
    title: "",
    description: "",
    editMode: false,
    docref: "",
    uid: "",
    groups: [],
    loader: true
  };
  render() {
    const opacity = this.state.modalVisible ? 0.2 : 1;
    return (
      <View style={[styles.container, { opacity }]}>
        <CustomHeader
          headerTitle="Home"
          leftIcon={{
            icon: "menu",
            color: Colors.darkTheme.secondaryColor,
            onPress: () => this.props.navigation.openDrawer()
          }}
        />
        <ElevatedView>
          <Modal
            animationIn="bounce"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            visible={this.state.modalVisible}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                paddingTop: 20,
                borderWidth: 1,
                borderColor: Colors.darkTheme.primaryColor,
                elevation: 2,
                borderRadius: 8
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: !this.state.modalVisible });
                }}
                style={{ position: "absolute", right: -10, top: -10 }}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Entypo name="cross" size={20} color="white" />
                </View>
              </TouchableOpacity>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={[styles.inputContainer]}>
                  <MaterialIcons name="subtitles" size={30} />
                  <TextInput
                    value={this.state.title}
                    style={styles.inputs}
                    placeholder="Group Title"
                    keyboardType="email-address"
                    underlineColorAndroid={Colors.darkTheme.primaryColor}
                    onChangeText={title => this.setState({ title })}
                  />
                </View>
                <View style={[styles.inputContainer]}>
                  <MaterialIcons name="subtitles" size={30} />
                  <TextInput
                    value={this.state.description}
                    style={styles.inputs}
                    placeholder="Description"
                    keyboardType="email-address"
                    underlineColorAndroid={Colors.darkTheme.primaryColor}
                    onChangeText={description => this.setState({ description })}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "stretch"
                  }}
                >
                  {/* <Text>{JSON.stringify(this.state.docref,this.state.title)}</Text> */}
                  {this.state.editMode ? (
                    <Button
                      raised
                      onPress={() => {
                        const { docref, title, description } = this.state;
                        if (docref && title) {
                          this.props.updateGroupInfo(
                            docref,
                            title,
                            description,
                            this.props.uid
                          );
                          this.setState({
                            modalVisible: !this.state.modalVisible
                          });
                        } else if (!title) {
                          ToastAndroid.show(
                            "Group Title cannot be empty",
                            ToastAndroid.SHORT
                          );
                        }
                      }}
                      title="Update"
                      color={Colors.darkTheme.primaryColor}
                    />
                  ) : (
                    <Button
                      raised
                      onPress={this.handleSubmit.bind(this)}
                      title="Add"
                      color={Colors.darkTheme.primaryColor}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </ElevatedView>

        {this.state.uid ? (
          this.state.loader ? (
            <ActivityIndicator size="large" color="black" />
          ) : this.state.groups.length ? (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 80 }}
              style={{
                alignSelf: "stretch",
                // paddingBottom:70,
                flex: 1
              }}
            >
              {this.state.groups.map((item, i) => {
                var months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "June",
                  "July",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ];
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      this.props.navigation.navigate("Group", item);
                    }}
                  >
                    <ElevatedView
                      elevation={1}
                      style={{
                        flexDirection: "row",
                        borderRadius: 3,
                        margin: 10,
                        padding: 10,
                        alignItems: "center",
                        backgroundColor : Colors.darkTheme.primaryColor
                      }}
                    >
                      <View
                        style={{
                          height: 45,
                          width: 45,
                          backgroundColor: Colors.darkTheme.buttonColor,
                          borderRadius: 45,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <MaterialCommunityIcons
                          name="account-group"
                          color={Colors.darkTheme.secondaryColor}
                          size={30}
                        />
                      </View>
                      <View style={{ marginLeft: 15 }}>
                        <Text style={{color:Colors.darkTheme.textPrimary}}>{item.groupTitle}</Text>
                        <Text style={{ fontSize: 12, color: "grey" }}>
                          {
                            months[
                              new Date().getMonth(item.dateCreated.seconds)
                            ]
                          }{" "}
                          {new Date().getDate(item.dateCreated.seconds)}
                        </Text>
                      </View>
                      {item.admins.map((admin, i) => {
                        return this.props.uid === admin ? (
                          <TouchableOpacity
                            key={i}
                            onPress={() => {
                              this.setState({
                                modalVisible: !this.state.modalVisible,
                                editMode: true,
                                title: item.groupTitle,
                                description: item.groupDescription,
                                docref: item.docref
                              });
                            }}
                            style={{ right: 10, position: "absolute" }}
                          >
                            <FontAwesome name="edit" size={25} color={Colors.darkTheme.buttonColor} />
                          </TouchableOpacity>
                        ) : null;
                      })}
                    </ElevatedView>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text>You don't have any groups yet!</Text>
            </View>
          )
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text>You need to Sign In</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.floater}
          //  onPress={this.addTodo.bind(this)}
          onPress={() => {
            this.props.username === ""
              ? this.props.navigation.openDrawer()
              : this.setState({
                  title: "",
                  description: "",
                  editMode: false,
                  docref: "",
                  modalVisible: !this.state.modalVisible
                });
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              height: 50,
              width: 50,
              backgroundColor: Colors.darkTheme.buttonColor
            }}
          >
            <MaterialIcons name="add" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapstate(state) {
  return {
    email: state.basicInfo.email,
    groups: state.basicInfo.groups,
    uid: state.basicInfo.uid,
    username: state.basicInfo.username
  };
}
function mapdispatch(dispatch) {
  return {
    gettodosfirebase: () => {
      dispatch(gettodos());
    },
    addTodo: (author, title, todo, timedate, email, nav) => {
      dispatch(addd(author, title, todo, timedate, email, nav));
    },
    createGroup: (username, uid, title, description, date, navigation) => {
      dispatch(
        createGroup(username, uid, title, description, date, navigation)
      );
    },
    getGroups: uid => {
      dispatch(getGroups(uid));
    },
    updateGroupInfo: (docref, title, description, uid) => {
      dispatch(updateGroupInfo(docref, title, description, uid));
    },
    notify:(ar)=>{
      dispatch({type:'NOTIFICATIONS', payload:ar})
    }
  };
}
export default connect(
  mapstate,
  mapdispatch
)(Home);

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
    bottom: 30,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  }
});
