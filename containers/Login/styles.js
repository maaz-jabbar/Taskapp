import { StyleSheet, Dimensions } from "react-native";
import {Colors} from '../../constants/color'

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  
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
  loaderWrapper: {
    width,
    height: height * 0.85,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
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
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 12,
    borderBottomColor: Colors.darkTheme.primaryColor,
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
    marginBottom: 10,
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
