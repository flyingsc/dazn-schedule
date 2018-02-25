$(document).ready(function(){
    $("select#genre").change(function(){
	var genre = $(this).val();
	var date_show_flag = true;
	var prev_date = 0;

	if(window.history){
            if(genre == "全て"){
                history.replaceState("", "", location.pathname);
            } else {
                history.replaceState("", "", "?genre=" + encodeURI(genre));
            }
        }
	
	if(genre == "全て"){
	    $("#for_bookmark").text("検索後のページにリンクを貼れるようにしました");
	} else {
	    $("#for_bookmark").html('<a id="for_bookmark" href="' + location.href.replace(location.search, "") + "?genre=" + encodeURI(genre) + '">このページへのリンク</a>');
	}
	
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
	var param = [];

	if(genre != "全て"){
	    param.push("genre=" + encodeURI(genre));
	}

	if(tournament != "全て"){
	    param.push("tournament=" + encodeURI(tournament));
	}

	if(window.history){
            if(param.length == 0){
                history.replaceState("", "", location.pathname);
            } else {
                history.replaceState("", "", "?" + param.join("&"));
            }
        }
	
	if(param.length == 0){
	    $("#for_bookmark").text("検索後のページにリンクを貼れるようにしました");
	} else {
	    $("#for_bookmark").html('<a id="for_bookmark" href="' + location.href.replace(location.search, "") + "?" + param.join("&") + '">このページのリンク</a>');
	}
	
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

    var params = location.search.substring(1).split("&");
    for(var i = 0; i < params.length; i++){
	var a = params[i].split("=");

	if(a.length != 2){
	    continue;
	}
	
	var key = a[0];
	var value = decodeURI(a[1]);

	if(key == "genre"){
	    $("#genre").val(value);
	    $("#genre").change();
	} else if(key == "tournament"){
	    $("#tournament").val(value);
	    $("#tournament").change();
	}
    }
});
