import React from 'react';
import { Text, View,TextInput ,ScrollView,StyleSheet,ActivityIndicator,TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons , MaterialIcons, Ionicons, AntDesign,Entypo} from "@expo/vector-icons";
import {Button, CheckBox} from 'react-native-elements'
import { Colors } from "../../constants/color";
import CustomHeader from "../../components/Header";
import ElevatedView from "react-native-elevated-view";
import {addTodo,getUsers} from '../../redux/actions/action'
import Modal from "react-native-modal";
import moment from "moment";

import DateTimePicker from 'react-native-modal-datetime-picker';
import firebase from "firebase";
require("firebase/firestore");

class Group extends React.Component {

state={
modal:false,
assignmentModal:false,
groupTitle :'',
isAdmin:false,
admins:[],
groupDescription:'',
members:[],
docref:'',
title:'',
description:'',
tasks:[],
loader:true,
isDateTimePickerVisible: false,
deadline:''
,button:false,
temp:[],
selected:[],

} 
showDateTimePicker = () => {
  this.setState({ isDateTimePickerVisible: true });
};

hideDateTimePicker = () => {
  this.setState({ isDateTimePickerVisible: false });
};

handleDatePicked = deadline => {
  console.log("A date has been picked: ", deadline);
  this.setState({
    deadline
  })
  this.hideDateTimePicker();
};
getTasks(docref){
  
  try{var tasks = []
  firebase.firestore().collection("Groups").doc(docref).collection("Tasks").orderBy("date","desc")
  .onSnapshot((doc)=>{
    doc.forEach((docu)=>{
      tasks.push(docu.data())
    })
    console.log(tasks)
    this.setState({
      tasks,
      loader:false
    })
    tasks=[]
  })}
  catch(e){
    alert(e)
  }
}
getMembers(members){
console.log(this.props.allUsers)

let temp = this.props.allUsers.filter((item)=>{
  if (members.indexOf(item.uid) !== -1 )
  return item
})
console.log(temp)

  this.setState({temp})
}


componentDidMount(){
  this.props.getUsers();
  const {navigation} = this.props;
  const admins = navigation.getParam('admins')
  const docref = navigation.getParam('docref')
  const members = navigation.getParam('members')
  const groupTitle = navigation.getParam('groupTitle')
  const groupDescription = navigation.getParam('groupDescription')
  var isAdmin = admins.find((admin)=>admin === this.props.uid)
  this.getTasks(docref)
  this.getMembers(members)
  this.setState({
    groupTitle,
    isAdmin,
    admins,
    groupDescription,
    members,
    docref,
  })
}
render() {
 
const {groupTitle,isAdmin,groupDescription,docref,members,admins} = this.state
const opacity = (this.state.assignmentModal)?0.2:1;
    return (
        <View style={[styles.container,{opacity}]}>
            
            <CustomHeader
            leftIcon={<TouchableOpacity  onPress={()=>this.props.navigation.navigate('Home')}><Ionicons name='md-arrow-round-back' size={30} color='white'/></TouchableOpacity>}
            headerTitle={groupTitle}
            rightComponent={<TouchableOpacity onPress={()=>{this.props.navigation.navigate('GroupDetails', {admins,groupTitle,groupDescription, members,docref})}}><MaterialCommunityIcons name='account-group'  size={30} color='white' /></TouchableOpacity>}
           />

          <Modal
            animationIn="bounce"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            visible={this.state.assignmentModal}
            onBackButtonPress={()=>this.setState({assignmentModal:!this.state.assignmentModal, selected:[],deadline:''})}
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
                  this.setState({ assignmentModal: !this.state.assignmentModal,selected:[],deadline:'' });
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
                    placeholder="Task Title"
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
<View style={{ alignSelf:'stretch', marginBottom:10,alignItems:'center'}}>
                    <Text style={{fontWeight:'bold'}}>Deadline: </Text>
                  { (this.state.deadline)? <View style={{flexDirection:'row', alignItems:'center'}}><Text style= {{marginLeft:10, marginRight:10}}>{moment(new Date(this.state.deadline).getTime()).fromNow()}</Text><AntDesign onPress={this.showDateTimePicker} name='retweet' size={20} /></View>
                   :<Button title="Select Deadline" onPress={this.showDateTimePicker} />}
                  </View>
                  
                 
                  
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    is24Hour={false}
                    minimumDate={new Date()}
                    // minuteInterval={45}
                    mode={'datetime'}
                  />
        <View style={{alignSelf:'stretch',marginBottom:10,alignItems:'center'}}>
                   <Text style={{fontWeight:'bold'}}>Select Users to Assign: </Text>
                   {!this.state.button?<Button title="Choose Users" onPress={()=>this.setState({button:!this.state.button})} />
                :<View>
{/* <Text>{JSON.stringify(this.state.temp)}</Text> */}
<View style={{height:150}}>
<ScrollView style={{alignSelf: "stretch",}}>
          <View style={{flexDirection:'row', alignSelf:'stretch',alignItems:'center'}}>
            <CheckBox
            checked={this.state.temp.length === this.state.selected.length}
            onPress={() => {
              var temp = [];
              if (this.state.temp.length === this.state.selected.length) {
                this.setState({
                  selected: []
                });
              } else {
                for (let i = 0; i < this.state.temp.length; i++) {
                  temp.push(this.state.temp[i].uid);
                }
                this.setState({
                  selected: temp
                });
              }
            }}
            title="Select All"
          />
          <TouchableOpacity onPress={()=>this.setState({button:!this.state.button,selected:[]})} 
          style={{padding:2, width:'40%'}}>
            <View 
            style={{borderRadius:3,borderWidth:1,borderColor:'#f0f0f0', alignItems:'center',backgroundColor:'#f8f8f8', justifyContent:'center',height:46}}>
              <Text style={{fontWeight:'bold'}}>Cancel</Text>
            </View>
          </TouchableOpacity>
          </View>
          {this.state.temp.map((item,i) => {
            var checked =
              this.state.selected.indexOf(item.uid) !== -1 ? true : false;
            return (
              <View key ={i}>
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
        </ScrollView></View>
                </View>}
          </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "stretch",
                  }}
                >
                  
                    <Button
                      raised
                      onPress={() => {
                        const {docref,title,description, deadline,selected} = this.state
                        this.props.addTodo(docref,title,description, new Date().getTime(),new Date(deadline).getTime(),selected )
                        this.setState({assignmentModal:!this.state.assignmentModal,
                        title:'',
                        description:'',
                        deadline:''
                        })
                      }}
                      title="Add"
                      color={Colors.darkTheme.primaryColor}
                    />
                </View>
              </View>
            </View>
          </Modal>


            {/* <Text>{moment(new Date("2020").getTime()).fromNow()}</Text>
            <Text>{JSON.stringify(new Date("2001").getTime())}</Text> */}
            {/* <Text>{JSON.stringify(this.state.tasks)}</Text> */}




              {this.state.loader ? <View style={{flex:1,justifyContent:'center'}}><ActivityIndicator size='large' color='black'/></View>
               : (!this.state.tasks.length) ? <View style={{flex:1,justifyContent:'center'}}><Text>No Tasks</Text></View>
              : 
                <ScrollView style={styles.taskContainer} contentContainerStyle={{padding:5, paddingBottom:60}}>
              {this.state.tasks.map((task,i)=>{
                var right = 0;
                if(task.assignedTo)
                  {var tempo = this.props.allUsers.filter((user)=>{
                  if(task.assignedTo.indexOf(user.uid) !== -1)
                  return user
                  })}
                return(
                <ElevatedView key={i} elevation={2} style={styles.elevated}>
                  <View style={[styles.innerContainer,,{borderLeftColor:(task.completed)?'blue':'red'}]}>
                      <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={[styles.text,{fontSize:20}]}>{task.title}</Text>
                        {(tempo)?
                        <View style={{flexDirection:'row', marginLeft:10, marginBottom:5}}>
                        {tempo.map((user,i)=>{ (i !== 0)?right+=10:null
                        if(i<3)
                        return <Image key={i} source={(user.downloadURL)?{uri:user.downloadURL}:require('../../assets/Images/noPhotoAvailable.png')} style={[styles.avatar,{right}]}/>
                        if(i==3)
                        return <View key = {i} style={[styles.avatar,{right,backgroundColor:'#f0f0f0',justifyContent:'center',alignItems:'center'}]}>
                          <Text>+{tempo.length-3}</Text>
                        </View>
                        })}
                        
                        </View>
                        :null}
                      </View>
                      <Text style={[styles.text,{fontSize:15}]}>{task.description}</Text>
                      <View style={styles.timer}>
                        <MaterialCommunityIcons style={{marginLeft:10}} name='calendar' color='grey' size={12}/>
                        <Text style={styles.timerText}>{moment(task.date).format("D/MM/YY")}</Text>
                        <MaterialCommunityIcons style={{marginLeft:30}} name='timer' color='grey' size={12}/>
                        <Text style={styles.timerText}>{moment(task.date).fromNow()}</Text>
                      </View>
                      
                      {task.completed ?
                      <View style={styles.lowerView}>
                        <AntDesign name='checkcircle' size={14} color='blue'/>
                        <Text style={styles.daysLeft}>Task Completed</Text>
                      </View>
                      :<View style={styles.lowerView}>
                        <AntDesign name='exclamationcircle' size={14} color='orange'/>
                        {/* {console.log(i,task.deadline)} */}
                        {(task.deadline)?(task.deadline > new Date().getTime())?<Text style={styles.daysLeft}>Ending {moment(new Date(task.deadline).getTime()).fromNow()}</Text>:<Text style={styles.daysLeft}>Ended {moment(new Date(task.deadline).getTime()).fromNow()}</Text>
                        :<Text style={styles.daysLeft}>No Deadline</Text>}
                      </View>}
                  </View>
                </ElevatedView>
                )
              })}
            </ScrollView>
              }
            
            
            
            
            
            
            
            
            
            {(isAdmin)
            ?<View style={styles.float}>
              <TouchableOpacity style={styles.floater}
            
            onPress={() => {
              var {members} = this.state
              this.props.navigation.navigate('ChooseUser',{members,docref})
            }}> 
              <AntDesign name="adduser" size={30} color="white" />
           
          </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {
              this.setState({assignmentModal:!this.state.assignmentModal})
              
            }}
            style={[{marginTop:10},styles.floater]}> 

              <MaterialIcons name="assignment" size={30} color="white" />
            
          </TouchableOpacity>
          </View>
          :null
          }
          </View>
        )
    }
}



function mapstate(state){
  return({
    uid:state.basicInfo.uid,
    allUsers: state.basicInfo.allUsers,
  })
}
function mapdispatch(dispatch){
  return({
    getUsers: () => {
      dispatch(getUsers());
    },
    addTodo : (docref,title,description,date,deadline,selected)=>{
      dispatch(addTodo(docref,title,description,date,deadline,selected))
    }
  })
}
export default connect(mapstate,mapdispatch)(Group);

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems : 'center',
backgroundColor:Colors.darkTheme.backgroundColor
  },
  taskContainer:{
    flex:1, margin:5, alignSelf:'stretch',
  },
  elevated:{
    backgroundColor:Colors.darkTheme.primaryColor,
  padding:10, 
  borderRadius:3,
  marginBottom:15,
},
innerContainer:{
  
  borderLeftWidth:5
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
text:{
  marginLeft:10, 
  color:Colors.darkTheme.secondaryColor
},
timer:{
  flexDirection:'row', 
  marginBottom:5, 
  marginTop:5,
  alignItems:'center',
},
avatar:{
  height:30,
  width:30,
  borderRadius:30,
  marginRight:1,
  borderWidth:0.5,
  borderColor:'white',
  position:'absolute'
},
timerText:{
  marginLeft:5,
  color:'grey', 
  fontSize:10
},
lowerView:{
  flexDirection:'row', 
  backgroundColor:Colors.darkTheme.backgroundColor, 
  padding:10, 
  alignItems:'center',
  paddingBottom:12, 
  paddingTop:12
},
daysLeft:{
  marginLeft:5, 
  fontSize:12, 
  fontWeight:'bold',
  color:Colors.darkTheme.secondaryColor
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
},
float:{
  
  position: 'absolute',
  right: 10,
  bottom:10,
},
floater: {
   //Here is the trick
   alignItems: 'center',
   height: 50,
   justifyContent: 'center',
   width: 50,
   backgroundColor: Colors.darkTheme.buttonColor,
   borderRadius:50,
}
   
})