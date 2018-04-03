function showGenre(genre){
    $.each(genre, function(index, g){
	$("fieldset#genre").append('<label class="genre"><input type="checkbox" name="genre" value="' + g + '">' + g + "</label>");
    });
}

function showTournament(tournament){
    $.each(tournament, function(index, t){
	$("fieldset#tournament").append('<label class="tournament"><input type="checkbox" name="tournament" value="' + t + '">' + t + "</label>");
    });
}

function checkTournamentBox(tournament){
    $('input[name="tournament"]').each(function(){
	if($.inArray($(this).val(), tournament) >= 0){
	    $(this).prop("checked", true);
	}
    });
}

function checkViewSettingBox(view_setting){
    $('input[name="view"]').each(function(){
	if($.inArray($(this).val(), view_setting) >= 0){
	    $(this).prop("checked", true);
	}
    });
}

$(function(){
    try {
	localStorage.setItem("test", "1");
	localStorage.removeItem("test");
    } catch(e) {
	$("form").hide();
	$("body").append("<p>プライベートモードになっていませんか?(localStorageにアクセスできません)</p>");
	return;
    }
    
    $.getJSON("https://flyingsc.github.io/dazn-schedule/js/genre_tournament.json", null, function(data, status){
	var genre_tournament = data;
	var saved_genre = [];
	var saved_tournament = [];
	var saved_view_setting = [];
	
	try {
	    saved_genre = JSON.parse(localStorage.getItem("genre"));
	    saved_tournament = JSON.parse(localStorage.getItem("tournament"));
	    saved_view_setting = JSON.parse(localStorage.getItem("view"));
	} catch(e) {
	}

	checkViewSettingBox(saved_view_setting);
	
	showGenre(Object.keys(genre_tournament));
	
	$('input[name="genre"]').each(function(){
	    if($.inArray($(this).val(), saved_genre) >= 0){
		$(this).prop("checked", true);

		showTournament(genre_tournament[$(this).val()]);
	    } else {
		$(this).prop("checked", false);
	    }
	});

	checkTournamentBox(saved_tournament);

	$('input[name="genre"]').change(function(){
	    var tournament = genre_tournament[$(this).val()];

	    if(this.checked){
		showTournament(tournament);
		checkTournamentBox(saved_tournament);
	    } else {
		$.each(tournament, function(index, t){
		    $('input[name="tournament"][value="' + t + '"]').parent().remove();
		});
	    }
	});

	$("button").click(function(){
	    var favorite_genre = [];
	    $('input[name="genre"]').each(function(){
		if($(this).prop("checked")){
		    favorite_genre.push($(this).val());
		}
	    });

	    var favorite_tournament = [];
	    $('input[name="tournament"]').each(function(){
		if($(this).prop("checked")){
		    favorite_tournament.push($(this).val());
		}
	    });

	    var view_setting = [];
	    $('input[name="view"]').each(function(){
		if($(this).prop("checked")){
		    view_setting.push($(this).val());
		}
	    });
	    
	    try {
		localStorage.setItem("genre", JSON.stringify(favorite_genre));
		localStorage.setItem("tournament", JSON.stringify(favorite_tournament));
		localStorage.setItem("view", JSON.stringify(view_setting));
		
		saved_genre = favorite_genre;
		saved_tournament = favorite_tournament;
		saved_view_setting = view_setting;
		alert("設定を保存しました");
		history.back();
	    } catch(e) {
		alert("設定を保存できませんでした(プライベートモードになっていませんか？)");
	    }
	});
    });
});
