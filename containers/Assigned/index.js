import React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import { Colors } from "../../constants/color";
import { connect } from "react-redux";
import CustomHeader from "../../components/Header";

class Assigned extends React.Component {
 
  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          headerTitle="Profile"
          leftIcon={{
            icon: "menu",
            color: Colors.darkTheme.secondaryColor,
            onPress: () => this.props.navigation.openDrawer()
          }}
        />
        <Text styles={styles.noTasks}>No Assigned Tasks</Text>
      </View>
    );
  }
}

function mapstate(state) {
  return {
  };
}
function mapdispatch(dispatch) {
  return {
  };
}
export default connect(
  mapstate,
  mapdispatch
)(Assigned);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.darkTheme.backgroundColor
  },
  noTasks:{
    color:Colors.darkTheme.textPrimary,
  }
});
