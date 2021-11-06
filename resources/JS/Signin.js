class User{

    constructor(email , password , role){
      
      this.email = email.trim() ;
      this.password = password.trim();
      this.role = role.trim() ;
    }
}

//Singleton class for Firebase connection
class AuthDatabase{

  constructor()
  {
    //guard condition for maintaining only one connection

    if (AuthDatabase.instance instanceof AuthDatabase)
    {
      return AuthDatabase.instance ;
    }

    //else enter and create first instance

    this.firebaseConfig = {

                          apiKey: "AIzaSyBfgsQawX_se4-1uo5zf3uT76iMPzmumrk",
                          authDomain: "knowledge-repository-3e9e8.firebaseapp.com",
                          projectId: "knowledge-repository-3e9e8",
                          storageBucket: "knowledge-repository-3e9e8.appspot.com",
                          messagingSenderId: "696516878925",
                          appId: "1:696516878925:web:b214d42e023f751e7f3204",
                          measurementId: "G-E6R6KZDJC2"

                          };

    Object.freeze(this.firebaseConfig);

    Object.freeze(this) ;

    AuthDatabase.instance = this;

  }

  get(key){

    return this.firebaseConfig[key] ;
  }

  Authenticate(user){

        const auth = firebase.auth(); //composition 

        let passkey = user.password ;

        let email = user.email ;

        auth.signInWithEmailAndPassword(email, passkey).then(function(firebaseUser) {

        const dbRef = firebase.database().ref();

        const usersRef = dbRef.child('users');

        usersRef.on("value", function(snapshot) {

         var users_list = snapshot.val();

         for (var i = users_list.length - 1; i >= 0; i--) {

           if( users_list[i]['email'] == user.email)
           {
              if (users_list[i]['role'] == user.role && user.role == "Moderator")
              {
                alert("welcome " + users_list[i]['name']);
                window.open("moderator.html");
              }

              else if (users_list[i]['role'] == user.role && user.role == "Contributor")
              {
                alert("welcome " + users_list[i]['name']);
                sessionStorage.setItem("Contributor", user.email);
                window.open("contributor.html");
              }

              else if (users_list[i]['role'] == user.role && user.role == "Reader")
              {
                alert("welcome " + users_list[i]['name']);
                window.open("downloadhome.html");
              }

              else{

                alert ("INVALID ROLE!!!");

              }
           }
         }

        });          
       // Success 
         })
        .catch(function(error) {
             // Error Handling

              alert(error + "Sign Up As A New User!!!");
             
        });

  }

  Enroll(user , enroller_name)
  {
        const auth = firebase.auth(); //composition 

        let passkey = user.password ;

        let email = user.email ;

        auth.createUserWithEmailAndPassword(email, passkey).then((userCredential) => {

        // Signed in

        const dbRef = firebase.database().ref();

        const usersRef = dbRef.child('user_count');

        usersRef.once("value").then(function(snapshot){

          var id = snapshot.val();

          firebase.database().ref('users/' + id).set({name : enroller_name , role : user.role , email : user.email});

          alert("SIGNED UP SUCCESSFULLY");

          firebase.database().ref('user_count').set(id + 1);

        });        

        })
        .catch((error) => {

          alert(error);
         
        });


  }



}

function Authenticate(clicked_id)
{

  console.log(this.id);

  const username = document.getElementById("email").value ;

  const passkey = document.getElementById("password").value ;

  const role_choices = document.getElementsByName("role");

  var role_played;

  for (var i = 0, length = role_choices.length; i < length; i++) {

        if (role_choices[i].checked) {
          // do whatever you want with the checked radio
          role_played = role_choices[i].value;

          // only one radio can be logically checked, don't check the rest
          break;
        }
  }


  if (username.length == 0 || passkey.length == 0 || role_played == undefined)
  {
    window.alert("Fill All The Fields");  
  } 

  else{

    var active_user = new User(username , passkey , role_played) ;

    if (this.id.localeCompare("submitBtn") == 0 || !this.id)
      {
        Firebase_handler.Authenticate(active_user); 
      }
    else {

         var enroller_name = prompt("Enter Your Name : "); 
         Firebase_handler.Enroll(active_user , enroller_name);
       }   

  }


}


const Firebase_handler = new AuthDatabase() ;

firebase.initializeApp(Firebase_handler.firebaseConfig);

var Submit_button = document.getElementById("submitBtn") ;

var SignUp_button = document.getElementById("submitBtn2");

SignUp_button.addEventListener("click", Authenticate) ;

Submit_button.addEventListener("click", Authenticate) ;










