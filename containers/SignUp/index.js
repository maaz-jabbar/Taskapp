import React from "react";
import { signup } from "../../redux/actions/action";
import { connect } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Alert
} from "react-native";
import {Colors} from '../../constants/color'

import CustomHeader from "../../components/Header";

import ImagePickerExample from "../../ImagePicker";

class Login extends React.Component {
  goToSignin() {
    this.props.navigation.navigate("Login");
  }

  signup() {
    const { email, password, name } = this.state;
    const { navigation, imgUri } = this.props;

    if (email && password && name)
      this.props.signup(email, password, name, imgUri, navigation);

    if (!email && !password && !name) {
      alert("Please enter credentials");
    } else if (!email) {
      alert("Please enter your Email");
    } else if (!password) {
      alert("Please enter a valid Password");
    } else if (!name) {
      alert("Please enter your Name");
    }
  }

  state = {
    email: "",
    password: "",
    name: ""
  };
  render() {
    return (
      <View style={styles.container}>
        <CustomHeader headerTitle="Sign Up" />
        <KeyboardAvoidingView behavior="padding">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {this.props.imgUri !== "" ? (
              <Image
                source={{ uri: this.props.imgUri }}
                style={{
                  height: 130,
                  width: 130,
                  borderRadius: 130,
                  margin: 20
                }}
              />
            ) : (
              <ImagePickerExample />
            )}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="rename-box" size={30} />
              <TextInput
                style={styles.inputs}
                placeholder="Name"
                keyboardType="email-address"
                underlineColorAndroid={Colors.darkTheme.primaryColor}
                onChangeText={name => this.setState({ name })}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={30} />
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid={Colors.darkTheme.primaryColor}
                onChangeText={email => this.setState({ email })}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="onepassword" size={30} />
              <TextInput
                style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid={Colors.darkTheme.primaryColor}
                onChangeText={password => this.setState({ password })}
              />
            </View>

            <TouchableHighlight
              style={[styles.buttonContainer, styles.signupButton]}
              onPress={this.signup.bind(this)}
            >
              {this.props.isLoading ? (
                <ActivityIndicator styles={{ height: 26 }} color="black" />
              ) : (
                <Text style={styles.signUpText}>Sign Up</Text>
              )}
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.goToSignin()}>
              <Text>Already a Member?</Text>
            </TouchableHighlight>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps(states) {
  return {
    isLoading: states.basicInfo.isLoading,
    imgUri: states.basicInfo.imgUri
  };
}
function mapDispatchToProps(dispatch) {
  return {
    signup: (email, pass, name, imgUri, nav) => {
      dispatch(signup(email, pass, name, imgUri, nav));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white"
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: 250,
    height: 45,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30
  },
  signupButton: {
    backgroundColor: Colors.darkTheme.primaryColor
  },
  signUpText: {
    color: "white"
  }
});
