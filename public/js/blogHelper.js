
$(document).ready(function(){
	var pCount = 0;
	var iCount = 0;

		// Dynamic parragraphs
    $('#addParr').click(function(){
        $('#article-body-content').append('<label id="labelParr'+pCount+'" for="parragraph'+pCount+'">parragraph'+pCount+'</label><textarea rows="4" cols="100" id="parragraph'+pCount+'" name="parragraph'+pCount+'"></textarea>');
    		pCount++;
    		console.log('incrementing pCount to: ' + pCount);
    });

    $('#addImg').click(function(){
        $('#article-body-content').append('<label id="labelImg'+iCount+'" for="img'+iCount+'">Image URL#'+iCount+': </label><input type="text" id="img'+iCount+'" name="img'+iCount+'" >');
        iCount++;
        console.log('incrementing iCount to: ' + iCount);
    });

    // Removing last dynamically added parragraphs
    $('#remParr').click(function(){
    		if(pCount != 0)
	    	{	
	    		pCount--;
	    		console.log('decrementing pCount to: ' + pCount);
	    		$('#labelParr'+pCount).remove();
	        $('#parragraph'+pCount).remove();
    		}
    });

    $('#remImg').click(function(){
     		if(iCount != 0)
     		{	
	     		iCount--;
	     		console.log('decrementing iCount to: ' + iCount);
	     		$('#labelImg'+iCount).remove();
	        $('#img'+iCount).remove();
    		}
    });

});
