import * as React from 'react';
import { Button, Image, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker'
import {Entypo} from '@expo/vector-icons'
import { connect } from 'react-redux';

class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{flexDirection:'row', alignSelf:'stretch',justifyContent:'center', margin:20}}>
        <View style={{backgroundColor:'black',marginRight:20, height:80,width:80,justifyContent:'center',borderRadius: 80,alignItems:'center'}}>
            <Entypo
          name="images"
          size={50}
          color='white'
          onPress={this._pickImage}
        /></View>
                  <View style={{backgroundColor:'black', height:80,width:80,justifyContent:'center',borderRadius: 80,alignItems:'center'}}>
             <Entypo
          name="camera"
          size={50}
          color='white'
          onPress={this._pickCamera}
        /></View></View>
        ); 
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    console.log("HI")
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.props.sendUri(result.uri)
     
    }
    else{
      console.log("Cancelled")
    }
  };

  _pickCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.props.sendUri(result.uri)
     
    }
  };
}

function mapispatchToProps(dispatch){
  return({
    sendUri : (uri)=>{
      dispatch({type:'URI', payload:uri})
    }
  })
}
function mapStateToProps(state){
  return({

  })
}     
export default connect(mapStateToProps,mapispatchToProps)(ImagePickerExample)