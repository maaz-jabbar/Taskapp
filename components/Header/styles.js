import { StyleSheet , Dimensions } from "react-native";

const { width , height} = Dimensions.get("window");

export default StyleSheet.create({
    headerContainer:{
        width,
        height : height * 0.2,
        backgroundColor : "red"
    }
});