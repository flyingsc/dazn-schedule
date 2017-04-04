$(document).ready(function(){
    var now = new Date();
    $("td.date").each(function(){
	var date = $(this).html();
	var a = date.split(" ")[0].split("/");
	var mon = parseInt(a[0]);
	var day = parseInt(a[1]);

	if(mon < now.getMonth() + 1 || day < now.getDate()){
	    $(this).parent().remove();
	}
    });
    
    $("select#genre").change(function(){
	var genre = $(this).val();
	
	$("select#tournament").val("全て");
	$("select#tournament>option").each(function(){
	    if($(this).attr("class") == genre || genre == "全て" || $(this).val() == "全て"){
		$(this).show();
	    } else {
		$(this).hide();
	    }
	});
	    
	var count = 0;
	$("tr").each(function(){
	    var txt = $(this).find("td.genre").html();
	    
	    if(txt == genre || genre == "全て" || txt == undefined){
		$(this).show();
		
		if(count % 2 == 0){
		    $(this).css("background-color", "#ffffff");
		} else {
		    $(this).css("background-color", "#dddddd");
		}
		
		count++;
	    } else {
		$(this).hide();
	    }
	});
    });

    $("select#tournament").change(function(){
	//$("select#genre").val("全て");
	
	var tournament = $(this).val();
	var genre = $("select#genre").val();
	var count = 0;

	$("tr").each(function(){
	    var txt = $(this).find("td.tournament").html();

	    if(txt == tournament || (tournament == "全て" && genre == $(this).find("td.genre").html()) || genre == "全て" || txt == undefined){
		$(this).show();
		
		if(count % 2 == 0){
		    $(this).css("background-color", "#ffffff");
		} else {
		    $(this).css("background-color", "#dddddd");
		}
		
		count++;
	    } else {
		$(this).hide();
	    }
	});
    });
});
