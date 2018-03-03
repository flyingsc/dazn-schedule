function showGenre(genre){
    $.each(genre, function(index, g){
	$("fieldset:first").append('<label class="genre"><input type="checkbox" name="genre" value="' + g + '">' + g + "</label>");
    });
}

function showTournament(tournament){
    $.each(tournament, function(index, t){
	$("fieldset:last").append('<label class="tournament"><input type="checkbox" name="tournament" value="' + t + '">' + t + "</label>");
    });
}

function checkTournamentBox(tournament){
    $('input[name="tournament"]').each(function(){
	if($.inArray($(this).val(), tournament) >= 0){
	    $(this).prop("checked", true);
	} else {
	    $(this).prop("checked", false);
	}
    });
}

$(function(){
    $.getJSON("./js/genre_tournament.json", null, function(data, status){
	var genre_tournament = data;
	var saved_genre = [];
	var saved_tournament = [];

	try {
	    saved_genre = JSON.parse(localStorage.getItem("genre"));
	    saved_tournament = JSON.parse(localStorage.getItem("tournament"));
	} catch(e) {
	}

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

	    try {
		localStorage.setItem("genre", JSON.stringify(favorite_genre));
		localStorage.setItem("tournament", JSON.stringify(favorite_tournament));

		saved_genre = favorite_genre;
		saved_tournament = favorite_tournament;
		alert("設定を保存しました");
	    } catch(e) {
		alert("設定を保存できませんでした(プライベートモードになっていませんか？)");
	    }
	});
    });
});
