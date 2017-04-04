$(document).ready(function(){
    $("select#genre").change(function(){
	var genre = $(this).val();
	var date_show_flag = true;
	var prev_date = 0;
	
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

		if($(this).attr("class") == "date-row"){
		    if(date_show_flag == false){
			$(prev_date).hide();
		    }

		    date_show_flag = false;
		    prev_date = this;
		    count = 0;
		    return true;
		}

		date_show_flag = true;
		
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

	if(date_show_flag == false){
	    $(prev_date).hide();
	}
    });

    $("select#tournament").change(function(){
	var tournament = $(this).val();
	var genre = $("select#genre").val();
	var count = 0;
	var date_show_flag = true;
	var prev_date = 0;
	
	$("tr").each(function(){
	    var txt = $(this).find("td.tournament").html();

	    if(txt == tournament || (tournament == "全て" && (genre == "全て" || genre == $(this).find("td.genre").html())) || txt == undefined){
		$(this).show();
		
		if($(this).attr("class") == "date-row"){
		    if(date_show_flag == false){
			$(prev_date).hide();
		    }

		    date_show_flag = false;
		    prev_date = this;
		    count = 0;
		    return true;
		}

		date_show_flag = true;
		
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

	if(date_show_flag == false){
	    $(prev_date).hide();
	}
    });
});
