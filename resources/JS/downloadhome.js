


class Requests
{
	constructor(request_phrase , filter_mode)
	{
		this.request_phrase = request_phrase;
		this.filter_mode = filter_mode;
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

    Clear_text_lists();

  	const auth = firebase.auth();

  	const dbRef = firebase.database().ref();

    const articleRef = dbRef.child('read_articles');

    var results = [[],[],[],[],[]] ;

    var results_index = 0

    var flag = 0 ;

    articleRef.on("value", function(snapshot) {

         var article_list = snapshot.val();

         for (var i = article_list.length - 1; i >= 0; i--) {

           if( article_list[i][parameter] == Phrase)
           {
              flag = 1;

              results[results_index++] = [article_list[i]['Name'] , article_list[i]['location']];

              addItem(article_list[i]['Name'] ,article_list[i]['location']);
           }
         }

         if (flag == 0) {

          alert("No Matching Results Found");
         }

        });


    

    return results ;   


  }
}

function Category_filter()
{
		if(Search_field.value.trim().length == 0 )
		{
				alert("Fill in The search Field");
		}

		else
		{
		
		Keyword_submit_btn.disabled = true;

		var new_request  = new Requests(Search_field.value.trim() ,"Category" );

		var query_aggregate = Firebase_handler.Query(new_request.filter_mode , new_request.request_phrase);

		/*alert(query_aggregate.length);

		for (var i = 0; i < query_aggregate.length; i++) {	

			if(query_aggregate[i].length)			
			{
				addItem(query_aggregate[i][0], query_aggregate[i][1]);
			}

		}*/

		Keyword_submit_btn.disabled = false;

		}
}

function Keyword_filter()
{

		if(Search_field.value.trim().length == 0 )
		{
				alert("Fill in The search Field");
		}

		else{

			Category_submit_btn.disabled = true ;

			var new_request  = new Requests(Search_field.value.trim() ,"Keyword" );

			var query_aggregate = Firebase_handler.Query(new_request.filter_mode , new_request.request_phrase);

			/*console.log(query_aggregate.article_names.length);

			for (var i = 0; i < query_aggregate['article_names'].length; i++) {



				addItem(query_aggregate['article_names'][i] , query['article_links'][i]);

				
		}*/

			Category_submit_btn.disabled = false ;
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

const Firebase_handler = new AuthDatabase() ;

firebase.initializeApp(Firebase_handler.firebaseConfig);

var Category_submit_btn = document.getElementById("categoryBtn");

var Keyword_submit_btn = document.getElementById("KeywordBtn");

var Clear_btn = document.getElementById("ClearBtn");

var Search_field = document.getElementById("myInput");

ClearBtn.addEventListener("click",Clear_text_lists);

Category_submit_btn.addEventListener("click",Category_filter);

Keyword_submit_btn.addEventListener("click",Keyword_filter);

