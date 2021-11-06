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

  Query()
  {

    const auth = firebase.auth();
  	const dbRef = firebase.database().ref();
    const articleRef = dbRef.child('pending_articles');
  
    articleRef.on("value", function(snapshot) {
      var article_list = snapshot.val(); 
      if(article_list != null)
      {
        for (var i = article_list.length - 1; i >= 0; i--) 
        {
          addItem(article_list[i]['Name'] ,article_list[i]['location'], article_list[i]['Contributor'], article_list[i]['Category'], article_list[i]['Keyword']);
        }
      }
      
      else
      {
        document.getElementById("Done").innerHTML = "No articles to approve";
        console.log("Final");
      }
    });
  }
}

// Global Variables
var i = 1;
var j = 1;
var temp=0;

function addItem(article_name , article_link, article_contr, article_cat, article_key){
  const auth = firebase.auth();
  const dbRef = firebase.database().ref();
  const articleRef = dbRef.child('read_articles');

  articleRef.on("value", function(snapshot) {
    temp =  snapshot.val().length;
  });

  var ul = document.getElementById("PendingList");
  var article = document.createElement("li");
  var link = document.createElement('a');
  var contributor = document.createElement('p');
  var button = document.createElement("button");
  var button2 = document.createElement("button");
  var input  = document.createElement("input");


  contributor.innerHTML = "Contributor : " + article_contr;
  contributor.style.fontWeight = "bold";
  contributor.style.fontSize = "20px";

  link.href = article_link;
  link.style.fontSize = '25px';
  link.style["margin-top"] = "20px";
  link.appendChild(document.createTextNode(article_name));
  
  article.setAttribute('id',"article");
  article.style.height = "50px";
  article.style["padding-top"] = "10px";
  article.style["padding-bottom"] = "30px";
  article.style.background = "grey";
  article.style.border = 'solid black 2px';
  article.style["margin-top"] = '5px';
  article.style.font = 'Garamond, serif';
  article.style.borderRadius = '2px';
  article.style.cursor = 'pointer' ;
  article.appendChild(link);
  article.appendChild(contributor);
  
  ul.style.background = "grey";
  ul.appendChild(article);

  
    
  btn_id = String(i) + "approve";
  i = i + 1;
  button.setAttribute('id',btn_id);
  button.style["marginTop"] = "20px";
  button.style["marginBottom"] = "20px";
  button.style["marginRight"] = "20px";
  button.style.width = "100px";
  button.style.height = "30px";
  button.style.background = "green";
  button.textContent = "Approve";
  button.style.fontWeight = "bold";
  
  ul.appendChild(button);

  document.getElementById(btn_id).addEventListener("click", UpdateDB,false);
  document.getElementById(btn_id).name = article_name;
  document.getElementById(btn_id).link = article_link;
  document.getElementById(btn_id).contr = article_contr;
  document.getElementById(btn_id).cat = article_cat;
  document.getElementById(btn_id).key = article_key;

  
  btn2_id = String(j) + "reject";
  j = j + 1;
  button2.setAttribute('id',btn2_id);
  button2.style["marginTop"] = "20px";
  button2.style["marginRight"] = "20px";
  button2.style["marginBottom"] = "20px";
  button2.style.width = "100px";
  button2.style.height = "30px";
  button2.style.background = "red";
  button2.textContent = "Reject";
  button2.style.fontWeight = "bold";
  
  ul.appendChild(button2);
  
  document.getElementById(btn2_id).addEventListener("click", RejectDoc,false);
  document.getElementById(btn2_id).name = article_name;
  document.getElementById(btn2_id).link = article_link;
    

  
  inp = String(j) + "inp_msg";
  input.setAttribute('id',inp);
  document.getElementById(btn2_id).inp_id = inp;

  input.name = 'generated_input';
  input.placeholder = "Enter Rejection Reason Here ... "
  input.style["marginRight"] = "20px";
  input.style.width = "200px";
  input.style.height = "30px";
  input.style["marginBottom"] = "20px";
  input.style.align = "center";

  ul.appendChild(input);

}


function RejectDoc(evt)
{
  alert("Message from moderator = " + document.getElementById(evt.currentTarget.inp_id).value);

  var article_n = evt.currentTarget.name;
  var article_l = evt.currentTarget.link;
  

  const auth = firebase.auth();
  const dbRef = firebase.database().ref();
  const pendingRef = dbRef.child('pending_articles/');

  pendingRef.on("value", function(snapshot) {
    var article_list = snapshot.val();

    for (var i = article_list.length - 1; i >= 0; i--) {

      if(article_list[i]['Name'] == article_n)
      {
       pendingRef.child(i).remove();
       window.location.reload();
      }   
    }
  }); 

}



function UpdateDB(evt)
{
  var article_n = evt.currentTarget.name;
  var article_l = evt.currentTarget.link;
  var article_con = evt.currentTarget.contr;
  var article_catt = evt.currentTarget.cat;
  var article_keyword = evt.currentTarget.key;

  const auth = firebase.auth();
  const dbRef = firebase.database().ref();
  const articleRef = dbRef.child('read_articles');


  d =  {  
    "Category" : article_catt,
    "Contributor" : article_con,
    "Keyword" : article_keyword,           
    "Name" : article_n,
    "location" : article_l
  }

  if (temp==0)
  {
    console.log("Waiting");
    return;
  }

  firebase.database().ref('read_articles/' + temp).set(d);

  const pendingRef = dbRef.child('pending_articles/');
  pendingRef.on("value", function(snapshot) {

    var article_list = snapshot.val();
    for (var i = article_list.length - 1; i >= 0; i--) 
    {
      if(article_list[i]['Name'] == article_n)
      {  
        pendingRef.child(i).remove();
       window.location.reload();
      }
    }

  });
  
  alert("Article Approved");
}



const Firebase_handler = new AuthDatabase() ;
firebase.initializeApp(Firebase_handler.firebaseConfig);
Firebase_handler.Query();