const INITIAL_STATES = {
  username: "",
  alltodoss: [],
  email: "",
  mytodos: [],
  assignedTodos:[],
  isLoading:false,
  uid:'',
  invited:[],
  isUpdateLoading:false,
  allUsers:[],
  imgUri:'',
  groups:[],
  notifications:[],
downloadURL:'',
activeItemKey :'Home'
};

export default function(state = INITIAL_STATES, action) {
  switch (action.type) {
    case "LOGOUT":
      return{
        username: "",
  alltodoss: [],
  email: "",
  mytodos: [],
  assignedTodos:[],
  isLoading:false,
  uid:'',
  invited:[],
  isUpdateLoading:false,
  allUsers:[],
  imgUri:'',
  groups:[],
downloadURL:'',
activeItemKey :'Home'
      }
      case "NOTIFICATIONS":
        console.log(`dispatch hogya ${action.payload}`)
        return{
          ...state,
          notifications:action.payload
        }
    case 'ASSIGNED':
      var assignedTodos;
      assignedTodos.push(action.payload)
      return{
        ...state,
        assignedTodos,
      }
    case "LIST_TODOS":
      return {
        ...state,
        alltodoss: action.payload
      };
    case "INVITES":
      return {
        ...state,
        invited: action.payload
      };
      case 'CHANGE_NAV':
        return{
          ...state,
          activeItemKey:action.payload
        }
      case 'URI':
        
        // console.log("uri", action.payload);
      return{
        ...state,
        imgUri:action.payload
      }
    case "LIST_USERS":
        
      console.log("userssss", action.payload);
      return {
        ...state,
        allUsers: action.payload
      };
      case 'LOADER':
        return{
          ...state,
          isLoading:!state.isLoading,
        }
      case 'UPDATELOADER':
        return{
          ...state,
          isUpdateLoading:!state.isUpdateLoading,
        }
      case 'LIST_GROUPS':
        return{
          ...state,
          groups:action.payload,
        }
    case "LOGGEDIN_USER":
      console.log(action.payload);

      return {
        ...state,
        username: action.payload.name,
        email: action.payload.email,
        uid: action.payload.uid,
        downloadURL: action.payload.downloadURL
      };
    case "MYTODOS":
      let mytodos = state.alltodoss.filter(todo => {
        // console.log("todofiltering");
        if (todo.by === state.email) {
          // console.log(todo, "Bro");
          return todo;
        }
      });
      return {
        ...state,
        mytodos,
      };
    default:
      return state;
  }
}
