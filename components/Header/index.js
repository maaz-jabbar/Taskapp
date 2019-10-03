import React from "react";
import { Header } from "react-native-elements";
import styles from "./styles";

import {Colors} from '../../constants/color'

export default class CustomHeader extends React.Component {
  render() {
    const { leftIcon, headerTitle } = this.props;
    const rightComponent = this.props.rightComponent || null;
    return (
      <Header
        leftComponent={leftIcon}
        centerComponent={{
          text: headerTitle,
          style: { color: Colors.darkTheme.secondaryColor, fontSize: 18, fontFamily: "Roboto" }
        }}
        rightComponent={rightComponent}
        containerStyle={{
          backgroundColor: Colors.darkTheme.primaryColor,
          justifyContent: "space-around",
        }}
      />
    );
  }
}
