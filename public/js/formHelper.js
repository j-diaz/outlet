console.log('hey I got added!');
function postArticle(){

			console.log('I got called!1');
			var array = $("#newArticleForm").serializeArray();
			var jsonReady = formatJSON(array);
			console.log('Attempting to create article.');
			$.ajax({
					url: '/blog/post',
					type: 'POST',
					contentType: 'application/json',
					dataType: 'json',
					data:  JSON.stringify(jsonReady),
					success: function(dataResponse, status, xhr){
						console.log(status);
					},
					error: function(jqXHR, status, error){
						console.log(error);
					}
			});
	}

function formatJSON(array){
	console.log(array);
	console.log('I recieved this: '+JSON.stringify(array));
	 result = {};

	 result.title = array[0].value;
	 result.author = array[1].value;
	 result.preview = array[2].value;
	 result.body = new Array();

	 for(var i=3; i<array.length; i++)
	 { 
	 	result.body.push({ 'name':array[i].name, 'value':array[i].value}); 	
	 }

	 console.log('result in JSON: '+JSON.stringify(result));
	 return result;
}
