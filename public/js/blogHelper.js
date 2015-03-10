// function fromWhitespaceToDashes(title){
// 		return title.replace(/ +/g,'-');
// 	}

// function fromDashToWhitespace(title){
// 		return title.replace(/-/g,' ');
// }


$(document).ready(function(){
    $("#addParr").click(function(){
        $("#body-content").after("<p>Jquery FTW</p>");
    });

    $("#addImg").click(function(){
        $("#body-content").after("<p>Jquery FTWimg</p>");
    });
});
