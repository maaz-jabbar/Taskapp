console.disableYellowBox = true;

import firebase from "firebase";
require("firebase/firestore");
import { ToastAndroid } from "react-native";

var firebaseConfig = {
  apiKey: "AIzaSyBvK7pI7fvpsAT63_kSGpMpEeJaPkUbEk8",
  authDomain: "blood-bank-whiz.firebaseapp.com",
  databaseURL: "https://blood-bank-whiz.firebaseio.com",
  projectId: "blood-bank-whiz",
  storageBucket: "blood-bank-whiz.appspot.com",
  messagingSenderId: "415401693680",
  appId: "1:415401693680:web:ffc09e2391195980"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

export function addTodo(docref,title,description,date,deadline,assignedTo){
  return dispatch =>{
    db.collection("Groups").doc(docref).collection("Tasks").add({
      title,
      description,
      date,
      completed:false,
      deadline,
      assignedTo,
    })
    .then((a)=>{
      console.log("added"+a)
      ToastAndroid.show("Task Assigned",ToastAndroid.SHORT)
    })
  }
}

export function signup(email, password, name, imguri, nav) {
  return async dispatch => {
    dispatch({ type: "LOADER" });
    if(imguri){


    const response = await fetch(imguri);
    const blob = await response.blob();

    var metadata = {
      contentType: 'image/jpeg',
    };
  
    let med = new Date().getTime() + "-media.jpg"
    const stref = firebase
      .storage()
      .ref()
      .child('assets/' + med)
  
    stref.put(blob, metadata)
  .then(function(imageSnapshot) {
    imageSnapshot.ref.getDownloadURL()
    .then((downloadURL)=>{
      console.log('File available at', downloadURL);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);

        db.collection("users").doc(user.user.uid)
          .set({
            email,
            password,
            name,
            uid: user.user.uid,
            downloadURL
          })
          .then(function(docRef) {
            dispatch({ type: "MYTODOS" });
            nav.navigate("Home");
            dispatch({
              type: "LOGGEDIN_USER",
              payload: { name, email, downloadURL, uid: user.user.uid, }
            });
            dispatch(getUsers());
            dispatch({ type: "LOADER" });
          })
          .catch(e => {
            alert(e);
            console.log("catched");
            dispatch({ type: "LOADER" });
          });
      })
      .catch(e => {
        alert(e);
        console.log("catched");
        dispatch({ type: "LOADER" });
      })
    }).catch(e => {
      alert(e);
      console.log("catched");
      dispatch({ type: "LOADER" });})
  }).catch( e => {
    alert(e);
    console.log("catched");
    dispatch({ type: "LOADER" });})
  }
  else{
    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log(user);

      db.collection("users").doc(user.user.uid)
        .set({
          email,
          password,
          name,
          uid: user.user.uid,
          downloadURL:''
        }).then(function(docRef) {
          dispatch({ type: "MYTODOS" });
          nav.navigate("Home");
          dispatch({
            type: "LOGGEDIN_USER",
            payload: { name, email, downloadURL:'', uid: user.user.uid, }
          });
          dispatch(getUsers());
          dispatch({ type: "LOADER" });
        })
        .catch(e => {
          alert(e);
          console.log("catched");
          dispatch({ type: "LOADER" });
        });
      })
      .catch(e => {
        alert(e);
        console.log("catched");
        dispatch({ type: "LOADER" });
      });
  }}
}

export function signin(email, password, nav) {
  return dispatch => {
    console.log("aaaaa")
    dispatch({ type: "LOADER" });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        db.collection("users")
          .where("uid", "==", user.user.uid)
          .get()
          .then(function(userSnapshot) {
            userSnapshot.forEach(function(userDoc) {
              dispatch({ type: "LOADER" });
              var { name, email, downloadURL, uid } = userDoc.data();
              console.log(userDoc.data())
              dispatch({
                type: "LOGGEDIN_USER",
                payload: { name, email, downloadURL, uid }
              });
              dispatch({ type: "MYTODOS" });
              dispatch(getUsers());
              dispatch(getGroups(uid));
              nav.navigate("Home");
            });
          })
          .catch(e => {
            console.log("catched");
            dispatch({ type: "LOADER" });
            alert(e);
          });
      })
      .catch(e => {
        console.log("catched");
        dispatch({ type: "LOADER" });
        alert(e);
      });
  };
}
export function createGroup(
  username,
  uid,
  title,
  description,
  date,
  navigation
) {
  return dispatch => {
    db.collection("Groups")
      .add({
        createdByUid: uid,
        members: [uid],
        admins: [uid],
        invites:[],
        groupTitle: title,
        groupDescription: description,
        dateCreated: date
      })
      .then(() => {
        dispatch(getGroups(uid));
      });
  };
}
export function makeAdmin(uid,docRef,navigation) {
  return dispatch =>{
    console.log("hi",uid,docRef)
    db.collection("Groups")
      .doc(docRef)
      .set({
        admins: firebase.firestore.FieldValue.arrayUnion(uid) 
      },{merge:true})
      .then((a) => {
        console.log(a)
        dispatch(getGroups(myuid))
        navigation.navigate("Home")
      });
  }
}
export function removeUser(uid,docRef,navigation, myuid) {
  return dispatch => {
    console.log("hi",uid,docRef)
    db.collection("Groups")
      .doc(docRef)
      .set({
        members: firebase.firestore.FieldValue.arrayRemove(uid) ,
        admins: firebase.firestore.FieldValue.arrayRemove(uid) 
      },{merge:true})
      .then((a) => {
        console.log(a)
        dispatch(getGroups(myuid))
        navigation.navigate("Home")
      });
  }
}
export function leaveGroup(uid,docRef,nav, myuid) {
  return dispatch => {
    console.log("hi",uid,docRef)
    db.collection("Groups")
      .doc(docRef)
      .set({
        members: firebase.firestore.FieldValue.arrayRemove(uid) ,
        admins: firebase.firestore.FieldValue.arrayRemove(uid) 
      },{merge:true})
      .then((a) => {
        console.log(a)
        dispatch(getGroups(myuid))
        nav.navigate("Home")
      });
  }
}
export function inviteUsers(selected,groupDocref,nav){

  return dispatch => {
    for(var i =0 ; i<selected.length;i++){
      firebase
      .firestore()
      .collection("users")
      .where("uid", "==", selected[i])
      .get()
          .then(function(userSnapshot) {
            userSnapshot.forEach(function(userDoc) {
             
              db.collection("users").doc(userDoc.id)
              .set({
                invited: firebase.firestore.FieldValue.arrayUnion(groupDocref) 
              },{merge:true})
              .then((a)=>{
                console.log(a)
                ToastAndroid.show("Invited", ToastAndroid.SHORT)
                nav.navigate('Group')
              })
              .catch((e)=>{
                alert(e)
              })
              
              
            })})}
            
          }
        }
        
export function cancelInvite(uid,groupDocref){
  return dispatch => {
    console.log("1")
    firebase
    .firestore()
    .collection("users")
    .where("uid", "==", uid)
    .get()
    .then(function(userSnapshot) {
            userSnapshot.forEach(function(userDoc) {
             
              db.collection("users").doc(userDoc.id)
              .set({
                invited: firebase.firestore.FieldValue.arrayRemove(groupDocref) 
              },{merge:true})
              .then((a)=>{
                console.log(a)
              })
              .catch((e)=>{
                alert(e)
              })
              
              
            })})}
            
      }
        
export function acceptInvite(uid,groupDocref){
  return dispatch => {
    dispatch(cancelInvite(uid,groupDocref));
    firebase
      .firestore()
      .collection("Groups")
      .doc(groupDocref)
      .set({
                members: firebase.firestore.FieldValue.arrayUnion(uid) 
              },{merge:true})
              .then((a)=>{
                dispatch(getGroups(uid))
                console.log(a)
              })
              .catch((e)=>{
                alert(e)
              })


            }          
      }

export const getAllNotify = (uid) => {
  return firebase.firestore().collection("users").doc(uid)
}

export const getAllGroups = (groupId) => {
  return firebase.firestore().collection("Groups").doc(groupId).get();
}

// export const getUsername = (uid) =>{
//   return firebase.firestore().collection("users").where
// }

var groups = [];
export function getGroups(uid) {
  return dispatch => {
    firebase
      .firestore()
      .collection("Groups")
      .where("members", "array-contains", uid)
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
          const comment = doc.data();
          comment.docref = doc.id;
          groups.push(comment);
          console.log("all", groups);
        });

        dispatch({ type: "LIST_GROUPS", payload: groups });
        dispatch({ type: "MYTODOS" });

        groups = [];
      });
    console.log("dispatchedd");
  };
}

export function deleteTodo(docref) {
  return dispatch => {
    db.collection("Todos")
      .doc(docref)
      .delete()
      .then(function() {
        dispatch(gettodos());
        dispatch({ type: "MYTODOS" });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
}

export function updateComplete(docref, dec, nav) {
  return dispatch => {
    dispatch({ type: "UPDATELOADER" });
    db.collection("Todos")
      .doc(docref)
      .update({
        completed: dec
      })
      .then(function() {
        dispatch({ type: "UPDATELOADER" });
        dispatch(gettodos());
        nav.navigate("Home");
        if (dec === true)
          ToastAndroid.show("Todo Completed", ToastAndroid.SHORT);
        else ToastAndroid.show("Todo NOT Completed", ToastAndroid.SHORT);
      })
      .catch(function(error) {
        dispatch({ type: "UPDATELOADER" });
        nav.navigate("Home");
        console.log("Error removing document: ", error);
      });
  };
}
export function updateGroupInfo(docref, groupTitle,groupDescription,uid) {
  return dispatch => {
    dispatch({ type: "UPDATELOADER" });
    db.collection("Groups")
      .doc(docref)
      .update({
        groupTitle,
        groupDescription,
      })
      .then(function() {
        
        dispatch(getGroups(uid));
       ToastAndroid.show("Group Updated", ToastAndroid.SHORT);
        })
      .catch(function(error) {
        alert(error)
      });
  };
}

// var allTodos=[{completed:true,todo:'Todo Descripti',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019, 6:04:15 ", by:'hello@hello.com'},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019, 6:04:15 ",by:"maazmaster1@gmail.com"},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019, 6:04:15 ",by:'hello@hello.com'},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},{todo:'Todo Description 1',author:'Maaz',title:'Todo1',timedate:"Wed Sep 04 2019 6:04:15 "},]
var allTodos = [];
export function gettodos() {
  return dispatch => {
    firebase
      .firestore()
      .collection("Todos")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          const comment = doc.data();
          comment.docref = doc.id;
          allTodos.push(comment);
        });

        dispatch({ type: "LIST_TODOS", payload: allTodos });
        dispatch({ type: "MYTODOS" });

        allTodos = [];
      });

    // dispatch({type:'LIST_TODOS' , payload:allTodos})
  };
}

export const getGroupMembers = () => {
  return firebase.firestore().collection("users")
}

export function getUsers() {
  var allUsers = [];
  return dispatch => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          const comment = doc.data();
          comment.docref = doc.id;
          allUsers.push(comment);
        })

        dispatch({ type: "LIST_USERS", payload: allUsers });

        allUsers = [];
      })
  }
}
export function addd(author, title, todo, timedate, email, nav) {
  return dispatch => {
    db.collection("Todos")
      .add({
        title,
        author,
        todo,
        by: email,
        timedate,
        completed: false
      })
      .then(function(docRef) {
        dispatch(gettodos());
        ToastAndroid.show("Todo added", ToastAndroid.SHORT);

        nav.navigate("Home");
      });
  };
}


export function signOut(nav) {
  return dispatch => {
    dispatch({ type: "LOGOUT"})
    nav.navigate("Auth")
  }}
import * as Facebook from "expo-facebook";
export async function signInWithFacebook() {
  const appId = 465316527656749;
  const permissions = ["public_profile", "email"]; // Permissions required, consult Facebook docs

  const { type, token } = await Facebook.logInWithReadPermissionsAsync(appId, {
    permissions
  });

  // switch (type) {
  //   case 'success': {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Set persistent auth state
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return await firebase.auth().signInAndRetrieveDataWithCredential(credential); // Sign in with Facebook credential

  // console.log(credential)
  // console.log(facebookProfileData)
  // // Do something with Facebook profile data
  // // OR you have subscribed to auth state change, authStateChange handler will process the profile data

  // return Promise.resolve({type: 'success'});
  //   }
  //   case 'cancel': {
  //     return Promise.reject({type: 'cancel'});
  //   }
  // }
}