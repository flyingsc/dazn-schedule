$(document).ready(function(){
    function reverseSchedule(){
	var dates = [];
	var programs = {};
	
	$("tr").each(function(){
	    if($(this).attr("class") == "date-row"){
		dates.push(this);
	    } else {
		if(dates.length == 0){
		    return true;
		}
		
		var date = dates[dates.length - 1].innerText;
		
		if(programs[date]){
		    programs[date].push(this);
		} else {
		    programs[date] = [this];
		}
	    }
	});

	var table_header = null;
	if($("th").length > 0){
	    table_header = "<tr><th>時間</th><th>ジャンル</th><th>リーグ</th><th>対戦カード</th><th>実況・解説</th></tr>";
	}
	
	$("table").empty();
	if(table_header){
	    $("table").append(table_header);
	}
	
	$.each(dates.reverse(), function(index, date){
	    $("table").append(date);
	    
	    $.each(programs[date.innerText], function(i, row){
		$("table").append(row);
	    });
	});
    }
    
    function loadUserSetting(){
	var favorite_genre;
	var excluded_tournament;
	var view_setting;
	var date_order;
	
	try {
	    favorite_genre = JSON.parse(localStorage.getItem("genre"));
	    excluded_tournament = JSON.parse(localStorage.getItem("tournament"));
	    view_setting = JSON.parse(localStorage.getItem("view"));
	    date_order = localStorage.getItem("date_order");
	} catch(e) {
	    favorite_genre = [];
	    excluded_tournament = [];
	    view_setting = [];
	    date_order = "asc";
	}

	return [favorite_genre, excluded_tournament, view_setting, date_order];
    }

    function createSearchQuery(genre, tournament){
	var params = [];

	if(genre != "全て"){
	    params.push("genre=" + encodeURIComponent(genre));
	}

	if(tournament != "全て" && tournament != undefined){
	    params.push("tournament=" + encodeURIComponent(tournament));
	}

	return "?" + params.join("&");
    }
    
    function replaceLocationAfterSearch(search_query){
	if(history.replaceState){
            if(search_query.length == 1){
                history.replaceState("", "", location.pathname);
            } else {
                history.replaceState("", "", search_query);
            }
        }
    }

    function showLocationAfterSearch(search_query){
	if(history.replaceState){
	    return;
	}
	
	if(search_query.length == 1){
	    $("#for_bookmark").text("");
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
	if(genre === undefined || tournament === undefined || genre === "" || tournament === ""){
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
	    var genre = $(this).find("td.genre").text();
	    var tournament = $(this).find("td.tournament").text();

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
	    var value = decodeURIComponent(a[1])
	    
	    if(key == "genre"){
		$("#genre").val(value);
		$("#genre").change();
	    } else if(key == "tournament"){
		$("#tournament").val(value);
		$("#tournament").change();
	    }
	}
    }

    function hideGenre(){
	$("th:nth-child(2)").css("display", "none");
	$("td.genre").css("display", "none");
    }

    function hideTournament(){
	$("th:nth-child(3)").css("display", "none");
	$("td.tournament").css("display", "none");
    }

    function showGenre(){
	$("th:nth-child(2)").css("display", "");
	$("td.genre").css("display", "");
    }
    
    function showTournament(){
	$("th:nth-child(3)").css("display", "");
	$("td.tournament").css("display", "");
    }

    function shortenCommentator(){
	$("th:nth-child(5)").text("実");

	$("td:nth-child(5)").css("padding", "15px 0");
	$("td:nth-child(5)").css("text-align", "center");
	$("td:nth-child(5)").css("vertical-align", "middle");
	
	var re = /日本語/;
	$("td:nth-child(5)").each(function(){
	    if(re.test($(this).text())){
		$(this).html('<div style="display:none;">' + $(this).text() + "</div>△");
	    } else if($(this).text() != ""){
		$(this).html('<div style="display:none;">' + $(this).text() + "</div>○");
	    }
	});
	
	$("td:nth-child(5)").click(function(){
	    if($("div#footer").css("display") == "none"){
		$("div#footer").css("display", "");
	    }
	    
	    $("div#footer").text($(this).find("div").text());
	});
    }

    function moveCurrentTime(){
	var d = new Date();
	var hour = d.getHours();
	var date = d.getMonth() + 1 + "月" + d.getDate() + "日";
	var date_position = $('td:contains("' + date + '")').offset().top;
	
	$("td.date:visible").each(function(){
	    if($(this).offset().top >= date_position){
		if($(this).parent().nextAll(":visible").eq(0).attr("class") == "date-row"){
		    window.scroll(0, $(this).offset().top - 100);
		    return false
		}
		
		if(parseInt($(this).text(), 10) >= hour){
		    window.scroll(0, $(this).offset().top - 100);
		    return false
		}
	    }
	});
    }
    
    var favorite_genre;
    var excluded_tournament;
    var view_setting;
    var date_order;
    
    var a = loadUserSetting();
    favorite_genre = a[0];
    excluded_tournament = a[1];
    view_setting = a[2];
    date_order = a[3];
    
    if($.inArray("below_commentator", view_setting) >= 0){
	shortenCommentator();
	
	$("div#footer").css("display", "");
	$("div#footer").click(function(){
	    $(this).css("display", "none");
	});

	if(/\/sp\//.test(location.pathname)){
	    $("td.misc").removeClass("misc");
	}
    }

    if(date_order == "desc"){
	if(location.pathname.substring(location.pathname.length - 9) === "past.html"){
	    reverseSchedule();
	    $("a#reverse_schedule").text("日付昇順で表示");
	}
    }
    
    $("a#current_time").click(function(){
	moveCurrentTime();
    });
    
    $("select#genre").change(function(){
	var genre = $(this).val();
	var search_query = createSearchQuery(genre);
	
	replaceLocationAfterSearch(search_query);
	showLocationAfterSearch(search_query);

	resetTournamentSelection();
	limitTournamentSelection(genre, favorite_genre, excluded_tournament);
	
	showProgram(genre, "全て", favorite_genre, excluded_tournament);

	if($.inArray("hide_row", view_setting) >= 0){
	    if(genre == "全て"){
		showGenre();
	    } else {
		hideGenre();
	    }

	    showTournament();
	}
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

	if($.inArray("hide_row", view_setting) >= 0){
	    if(tournament == "全て"){
		if(genre == "全て"){
		    showGenre();
		}
		showTournament();
	    } else {
		hideGenre();
		hideTournament();
	    }
	}
    });

    $("a#reverse_schedule").click(function(){
	reverseSchedule();
	
	if(date_order == "desc"){
	    date_order = "asc";
	    $("a#reverse_schedule").text("日付降順で表示");
	} else {
	    date_order = "desc";
	    $("a#reverse_schedule").text("日付昇順で表示");
	}

	try{
	    localStorage.setItem("date_order", date_order);
	} catch(e){
	    console.log("localStorage can not save.");
	}
    });
    
    applySearchQuery();
});

