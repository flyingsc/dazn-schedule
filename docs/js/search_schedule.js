$(document).ready(function(){
    function loadUserSetting(){
	var favorite_genre;
	var excluded_tournament;
	
	try {
	    favorite_genre = JSON.parse(localStorage.getItem("genre"));
	    excluded_tournament = JSON.parse(localStorage.getItem("tournament"));
	} catch(e) {
	    favorite_genre = [];
	    excluded_tournament = [];
	}

	return [favorite_genre, excluded_tournament];
    }

    function createSearchQuery(genre, tournament){
	var params = [];

	if(genre != "全て"){
	    params.push("genre=" + encodeURI(genre));
	}

	if(tournament != "全て" && tournament != undefined){
	    params.push("tournament=" + encodeURI(tournament));
	}

	return "?" + params.join("&");
    }
    
    function replaceLocationAfterSearch(search_query){
	if(window.history){
            if(search_query.length == 1){
                history.replaceState("", "", location.pathname);
            } else {
                history.replaceState("", "", search_query);
            }
        }
    }

    function showLocationAfterSearch(search_query){
	if(search_query.length == 1){
	    $("#for_bookmark").text("検索後のページにリンクを貼れるようにしました");
	} else {
	    $("#for_bookmark").html('<a id="for_bookmark" href="' + location.href.replace(location.search, "") + search_query + '">このページへのリンク</a>');
	}
    }

    function resetTournamentSelection(){
	$("select#tournament").val("全て");
    }

    function limitTournamentSelection(genre, favorite_genre, excluded_tournament){
	$("select#tournament>option").each(function(){
	    if($(this).attr("class") == genre || genre == "全て" || $(this).val() == "全て"){
		$(this).show();
	    } else if(genre == "お気に入り" && $.inArray($(this).attr("class"), favorite_genre) >= 0){
		if($.inArray($(this).val(), excluded_tournament) >= 0){
		    $(this).hide();
		} else {
		    $(this).show();
		}
	    } else {
		$(this).hide();
	    }
	});
    }

    function shouldShowProgram(genre, selected_genre, tournament, selected_tournament, favorite_genre, excluded_tournament){
	if(genre == undefined || tournament == undefined){
	    // 日付のとき
	    return true;
	} else if(selected_genre == "全て" || selected_genre == genre){
	    if(selected_tournament == "全て" || selected_tournament == tournament){
		return true;
	    }
	} else if(selected_genre == "お気に入り"){
	    if(selected_tournament == "全て"){
		if($.inArray(genre, favorite_genre) >= 0){
		    if($.inArray(tournament, excluded_tournament) < 0){
			return true;
		    }
		}
	    } else if(tournament == selected_tournament){
		return true;
	    }
	} 
	
	return false;
    }
    
    function showProgram(selected_genre, selected_tournament, favorite_genre, excluded_tournament){
	var count_for_coloring = 0;
	var needs_hide_date = false;
	var prev_date = 0;

	$("tr").each(function(){
	    var genre = $(this).find("td.genre").html();
	    var tournament = $(this).find("td.tournament").html();
	    
	    if(shouldShowProgram(genre, selected_genre, tournament, selected_tournament, favorite_genre, excluded_tournament)){
		$(this).show();
		
		if($(this).attr("class") == "date-row"){
		    if(needs_hide_date){
			$(prev_date).hide();
		    }

		    needs_hide_date = true;
		    prev_date = this;
		    count_for_coloring = 0;
		    return true;
		}

		needs_hide_date = false;
		
		if(count_for_coloring % 2 == 0){
		    $(this).css("background-color", "#ffffff");
		} else {
		    $(this).css("background-color", "#dddddd");
		}
		
		count_for_coloring++;
	    } else {
		$(this).hide();
	    }
	});

	if(needs_hide_date){
	    $(prev_date).hide();
	}
    }

    function applySearchQuery(){
	var params = location.search.substring(1).split("&");
	for(var i = 0; i < params.length; i++){
	    var a = params[i].split("=");
	    
	    if(a.length != 2){
		continue;
	    }
	    
	    var key = a[0];
	    var value = decodeURI(a[1])
	    
	    if(key == "genre"){
		$("#genre").val(value);
		$("#genre").change();
	    } else if(key == "tournament"){
		$("#tournament").val(value);
		$("#tournament").change();
	    }
	}
    }
    
    var favorite_genre;
    var excluded_tournament;
    var a = loadUserSetting();
    favorite_genre = a[0];
    excluded_tournament = a[1];

    $("select#genre").change(function(){
	var genre = $(this).val();
	var search_query = createSearchQuery(genre);
	
	replaceLocationAfterSearch(search_query);
	showLocationAfterSearch(search_query);

	resetTournamentSelection();
	limitTournamentSelection(genre, favorite_genre, excluded_tournament);
	
	showProgram(genre, "全て", favorite_genre, excluded_tournament);
    });

    $("select#tournament").change(function(){
	var tournament = $(this).val();
	var genre = $("select#genre").val();
	var count = 0;
	var date_show_flag = true;
	var prev_date = 0;
	var search_query = createSearchQuery(genre, tournament);

	replaceLocationAfterSearch(search_query);
	showLocationAfterSearch(search_query);
	
	showProgram(genre, tournament, favorite_genre, excluded_tournament);
    });

    applySearchQuery();
});

