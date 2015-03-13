console.log('hey I got added!');
function postArticle(){
			console.log('I got called!1');
			var array = $("#newArticleForm").serializeArray();
			console.log(JSON.stringify(array));
			$.ajax({
					url: '/blog/post',
					type: 'POST',
					contentType: 'application/json',
					dataType: 'json',
					data:  JSON.stringify(array),
					success: function(dataResponse, status, xhr){
						console.log(status);
					},
					error: function(jqXHR, status, error){
						console.log(error);
					}
			});
	}
