import React from "react";
import { signin } from "../../redux/actions/action";
import { connect } from "react-redux";
import { signInWithFacebook } from "../../redux/actions/action";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {Colors} from '../../constants/color'

import CustomHeader from "../../components/Header";
import styles from "./styles";

class Login extends React.Component {
  state = {
    loader: true,
    email: "new@new.com",
    password: "111111"
  };

  componentWillMount() {
    const { uid, navigation } = this.props;

    if (uid) {
      navigation.navigate("Home");
    } else {
      this.setState({
        loader: false
      });
    }
  }
  componentDidUpdate(prevprops) {
    const { uid, navigation } = this.props
    if (prevprops.uid !== uid) {
      
    if (uid) {
      navigation.navigate("Home");
    } else {
      this.setState({
        loader: false
      });
    }
    }
  }
  goToSignup() {
    this.props.navigation.navigate("Signup");
  }

  signin() {
    const { email, password } = this.state;
    this.props.signinn(email, password, this.props.navigation);
  }

  render() {
    const { loader } = this.state;
    const iconSize = 24
    return (
      <View style={styles.container}>
        <CustomHeader headerTitle="Sign In" />
        <KeyboardAvoidingView behavior="padding">
          {loader ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator color="#000" size="large" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", alignSelf: "stretch" }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 30
                  }}
                >
                  Sign In
                </Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={iconSize} />
                  <TextInput
                    style={styles.inputs}
                    placeholder="Email"
                    keyboardType="email-address"
                    underlineColorAndroid={Colors.darkTheme.primaryColor}
                    onChangeText={email => this.setState({ email })}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="vpn-key" size={iconSize} />
                  <TextInput
                    style={styles.inputs}
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid={Colors.darkTheme.primaryColor}
                    onChangeText={password => this.setState({ password })}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.buttonContainer, styles.signupButton]}
                  onPress={this.signin.bind(this)}
                >
                  {this.props.isLoading ? (
                    <ActivityIndicator styles={{ height: 26 }} color="black" />
                  ) : (
                    <Text style={styles.signUpText}>Sign In</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={signInWithFacebook}>
                  <View
                    style={[
                      styles.buttonContainer,
                      { backgroundColor: "#3d6dcc"}
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="facebook"
                      color="white"
                      size={25}
                    />
                    <Text style={[styles.screenTextStyle,{color:Colors.darkTheme.textPrimary}]}>
                      Login with Facebook
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goToSignup()}>
                  <Text>New here? Signup!</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  // console.log("TCL: mapStateToProps -> state", state);
  return {
    isLoading: state.basicInfo.isLoading,
    uid: state.basicInfo.uid || false
  };
}
function mapDispatchToProps(dispatch) {
  return {
    signinn: (email, pass, nav) => {
      dispatch(signin(email, pass, nav));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
