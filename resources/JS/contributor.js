


class Requests
{
	constructor(request_phrase , filter_mode)
	{
		this.request_phrase = request_phrase;
		this.filter_mode = filter_mode;
	}

}

class Uploads
{
  constructor(name, category, keyword, link)
  {
    this.name = name;
    this.category = category;
    this.keyword = keyword;
    this.link = link;

  }
}

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

  Query(parameter , Phrase)
  {
  	const auth = firebase.auth();

  	const dbRef = firebase.database().ref();

    const articleRef = dbRef.child(parameter);

    var results = [[],[],[],[],[]] ;

    var results_index = 0

    Clear_history();

    articleRef.once("value") .then(function(snapshot) {

         var article_list = snapshot.val();

        if(article_list == null){
          alert("No articles found");
          return;
        }
        var found = 0;
         for (var i = article_list.length - 1; i >= 0; i--) {

           if( article_list[i]["Category"] == Phrase)
           {
              
              results[results_index++] = [article_list[i]['Name'] , article_list[i]['location']];

              addItem(article_list[i]['Name'] ,article_list[i]['location']);

              found = 1;
           }
         }
         if(found==0){
           alert("No articles are present in the given category")
         }

        });
    
    return results ;   

  }

  Insert(Category, Contributor, Keyword, Name, Link)
  {

    const dbRef = firebase.database().ref();
    const articleRef = dbRef.child('id');

    articleRef.once("value") .then(function(snapshot) {
      var id = snapshot.val();
      writeUserData(id, Category, Contributor, Keyword, Name, Link);
      firebase.database().ref('id').set(id + 1);
    });

    function writeUserData(UserId, category, contributor, keyword, name, link) {

      firebase.database().ref('pending_articles/' + UserId).set({
        Category: category,
        Contributor: contributor,
        Keyword: keyword,
        Name: name,
        location: link
      });
      alert("Document Uploaded Successfully");
    }

     

    
  }
}

function Pending_filter()
{
		if(Search_field.value.trim().length == 0 )
		{
				alert("Fill in The search Field");
		}

		else
		{
		
		Approved_submit_btn.disabled = true;

		var new_request  = new Requests(Search_field.value.trim() ,'pending_articles' );

		var query_aggregate = Firebase_handler.Query(new_request.filter_mode , new_request.request_phrase);

		/*alert(query_aggregate.length);

		for (var i = 0; i < query_aggregate.length; i++) {	

			if(query_aggregate[i].length)			
			{
				addItem(query_aggregate[i][0], query_aggregate[i][1]);
			}

		}*/

		Approved_submit_btn.disabled = false;

		}
}

function Approved_filter()
{

		if(Search_field.value.trim().length == 0 )
		{
				alert("Fill in The search Field");
		}

		else{

			Pending_submit_btn.disabled = true ;

			var new_request  = new Requests(Search_field.value.trim() ,'read_articles' );

			var query_aggregate = Firebase_handler.Query(new_request.filter_mode , new_request.request_phrase);

			/*console.log(query_aggregate.article_names.length);

			for (var i = 0; i < query_aggregate['article_names'].length; i++) {



				addItem(query_aggregate['article_names'][i] , query['article_links'][i]);

				
		}*/

			Pending_submit_btn.disabled = false ;
		}

}

function Upload()
{
  if(Upload_field.value.trim().length == 0 || Name_field.value.trim().length == 0 || Category_field.value.trim().length == 0 || Keyword_field.value.trim().length == 0)
  {
      alert("Fill in all the appropriate fields while uploading");
  }
  else
  {
      var email = sessionStorage.getItem("Contributor");

      var upload_obj = new Uploads(Name_field.value.trim(), Category_field.value.trim(), Keyword_field.value.trim(), Upload_field.value.trim());

			var insert = Firebase_handler.Insert(upload_obj.category, email, upload_obj.keyword, upload_obj.name, upload_obj.link);


  }
}

function addItem(article_name , article_link ){

    var ul = document.getElementById("DynamicResultsList");
    var article = document.createElement("li");
    var link = document.createElement('a');
    link.href = article_link;
    link.style.fontSize = '25px';
    link.style["margin-top"] = "20px";
    link.appendChild(document.createTextNode(article_name));
    //link.addEventListener('click', display_pdf);
    article.setAttribute('id',"article");
    article.style.height = "50px";
    article.style["padding-top"] = "10px";
    article.style["padding-bottom"] = "10px";
    article.style.background = "white";
    article.style.border = 'solid black 2px';
    article.style["margin-top"] = '5px';
    article.style.font = 'Garamond, serif';
    article.style.borderRadius = '2px';
    article.appendChild(link);
    article.style.cursor = 'pointer' ;

    ul.appendChild(article);
}

function Clear_text_lists()
{
	var ul = document.getElementById("DynamicResultsList");
	Search_field.value = '' ;
	while(ul.firstChild){
		ul.removeChild(ul.firstChild);
	}
}

function Clear_history()
{
	var ul = document.getElementById("DynamicResultsList");
	while(ul.firstChild){
		ul.removeChild(ul.firstChild);
	}
}

function Clear_all()
{
	Upload_field.value = '' ;
  Name_field.value = '' ;
  Category_field.value = '' ;
  Keyword_field.value = '' ;

}

const Firebase_handler = new AuthDatabase() ;

firebase.initializeApp(Firebase_handler.firebaseConfig);

var Upload_btn = document.getElementById("UploadBtn");

var Pending_submit_btn = document.getElementById("pendingBtn");

var Approved_submit_btn = document.getElementById("approvedBtn");

var Clear_btn = document.getElementById("ClearBtn");

var Clear_btn1 = document.getElementById("ClearBtn1");

var Search_field = document.getElementById("myInput");

var Upload_field = document.getElementById("myUpload");

var Name_field = document.getElementById("myName");

var Category_field = document.getElementById("myCategory");

var Keyword_field = document.getElementById("myKeyword");

Upload_btn.addEventListener("click",Upload);

ClearBtn.addEventListener("click",Clear_text_lists);

ClearBtn1.addEventListener("click",Clear_all);

Pending_submit_btn.addEventListener("click",Pending_filter);

Approved_submit_btn.addEventListener("click",Approved_filter);

