$(document).ready(function () {

	window.adStarted	= 0;

	var game_id			= 0,
		lesson_id		= 0,
		mathChallenges  = '[role="start-math-challenge"]',
		countDownTimer  = '#count-down-timer',
		timeDownTimer   = '#time-down-timer',
		countDownNumber = '[role="count-down-number"]',
		timeDownNumber  = '[role="time-down-number"]',
		answerOption    = '[role="answer-option"]',
		musicHolder     = '#music-bgm-change',
		startScreen	    = '#start-screen',
		mathBuild	    = '#math-build',
		answerList		= '#answer-list',
		bestScores		= '#best-scores',
		gameLessons		= '#game-lessons',
		gameBackground	= '#game-background',
		teacherSeika	= '#obj-TSeika',
		gamePhoto		= '#game-photo-button',
		gameShare		= '[role="game-share-button"]',
		highestScoreBuild = '.highest-score-build',
		startGame	    = '[role="start-game"]',
		exitGame	    = '[role="exit-game"]',
		startLesson	    = '[role="start-lesson"]',
		scoreTrack	    = '[role="score-track"]',
		npcTalkButton	= '[role="game-npc-talk"]',
		npcBackButton	= '[role="game-backto"]',
		npcTalk			= '[role="game-talk"]:last-child',
		HighestScoreTrack = '[role="highest-score-track"]',
		gameBody	    = '[role="game-body"]',
		gScreenshot		= '[role="game-screenshot-canvas"]',
		url				= window.url,
		gamePath		= window.gamePath,
		user_id			= $.user_id(),
		countDown	    = '#count-down';

	var mathRound		= 1,
		wrongCounter	= 0,
		correctCounter  = 0,
		comboCounter	= 0;

	$('body').on('click', startGame, function(e) {
		
		var wWidth  = $(window).width(),
			wHeight = $(window).height(),
			game    = Number( $(gameBody).attr('data-id') );

		game_id = game;

		$.startGame('start', { game: game });

		$.playSFX('Tap', '[role="start-game"]', 1, { type: 'mp3' });
		
		if ( wWidth < 720 || wHeight < 640 ) {
			$.fullscreen('start', $('body')[0]);
		}

		$.startGame('ohayou');
		
	}).on('click', startLesson, function(e) {
		
		var Obj		    = this,
			lessonRound = 1,
			lesson_id   = Number( $(Obj).attr('data-id') );

		lesson_id = lesson_id;

		$(gameBody).data({
			lessonRound: 1
		});

		$.startGame('lesson', { lesson_id: lesson_id });

		$.playSFX('Tap', startLesson + '[data-id="' + lesson_id + '"]', 1, { type: 'mp3' });
		
	}).on('click', answerOption, function(e) {

		e.preventDefault();
		
		var Obj		 = this,
			operator = $(Obj).attr('data-option'),
			number   = $(Obj).text();

		if ( operator == 'NumA' ) {
			$.startGame('answer', { operator: operator, result: number, Obj: Obj });
		}
		else if ( operator == 'NumB' ) {
			$.startGame('answer', { operator: operator, result: number, Obj: Obj });
		}
		else if ( operator == 'result' ) {
			$.startGame('answer', { operator: operator, result: number, Obj: Obj });
		}
		else {
			$.startGame('answer', { operator: operator, Obj: Obj });
		}

		$(Obj).animateCss('rubberBand', '0.35s');

	}).on('click', exitGame, function() {
		
		$.startGame('exit'); 

	}).on('click', gamePhoto, function(e) {
		
		e.stopImmediatePropagation();

		$(this).animateCss('rubberBand', '0.5s');
		$.playSFX('camera-shutter', this);
		$.vibrate({ time: [5] });

		$.startGame('screenshot', { canvas: gScreenshot }); 

	}).on('click', npcTalkButton, function() {
		
		$.startGame('npcTalk/close'); 
		$.startGame('npcTalk/start'); 

	}).on('click', npcBackButton, function() {

		/*$.doTimeout(12000, function() {
			if ( !$('[role="splash-screen"]')[0] ) {
				$('#game-viewer').dialog('close');
			}
		});*/
		
		/*$.doTimeout(8000, function() {
			$('body').removeClass('gameBox');
			$('[aria-describedby="game-viewer"]').animateCss('fadeOut', '1s', function() {
				$(this).hide();
			});
		});*/
		

	}).on('click', npcTalk, function(e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		var Obj		     = this,
			message_id   = $(Obj).attr('data-id'),
			paragraph_id = $(Obj).attr('data-paragraph'),
			new_paragraph_id = Number( paragraph_id ) + 1;

		//$.startGame('npcTalk/close'); 
		$.startGame('npcTalk/start', { message_id: message_id, paragraph_id: new_paragraph_id }); 

	}).on('click', '#teacher-seika.target', function(e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		var Obj		     = this; 

		if ( $('#game-message-blob')[0] )
		{
			$(npcTalk).trigger('click');
		}

	});

	$.startGame = function(mode, options) {

		var options = options || {};
	
		switch (mode)
		{
			case 'start':

				var mathRound		= 1,
					currentScore	= 0,
					currentScoreSecond = 0,
					wrongCounter	= 0,
					correctCounter  = 0,
					lessonRound		= 1,
					comboCounter	= 0;

				$(gameBody).data({
					mathRound: mathRound,
					currentScore: currentScore,
					currentScoreSecond: currentScoreSecond,
					lessonRound: lessonRound,
					wrongCounter: wrongCounter,
					correctCounter: correctCounter,
					comboCounter: comboCounter
				});

				$(startScreen).hide();
				$(bestScores).addClass('hide');
				$(gameLessons).removeClass('hide').find('#game-select-screen').removeClass('hide');
				$('.game-ads').show();
				$('[aria-describedby="game-viewer"]').addClass('active');
				$('#game-end-screen').addClass('hide');
				$('#game-photo-button').addClass('hide');
				$('[role="game-effectiveness"]').addClass('hide');
				//$(gameShare).removeClass( 'hide' );

				$(teacherSeika).parent().parent().animateCss('headShake', '.3s');
				$('[role="game-npc-talk"], [role="game-backto"]').removeClass('hide').css({ 'animation-delay': '2s' }).animateCss('fadeIn', '1s');
				//$(highestScoreBuild).removeClass('hide').find('.score-group[data-lesson="1"]').removeClass('hide');
				$(highestScoreBuild).removeClass('hide');

				//$.startGame('countDown', options);

				if ( $.isFunction($.playBGM) ) {
					$.playBGM('start', { Obj: musicHolder, bgm: 'main_theme' });
				}		

				$('#best-scores').find('nav').css({
					'transform': 'translateX(0px)'
				});

			break;

			case 'lesson':

				var lesson_id    = options.lesson_id,
					lessonRound  = Number( $(gameBody).data('lessonRound') ) || 0;

				$(startScreen).hide();
				$(bestScores).addClass('hide');
				$(gameLessons).addClass('hide');
				$('[role="game-npc-talk"], [role="game-backto"]').addClass('hide');

				$(gameBody).data('lesson-id', lesson_id);

				$.startGame('countDown', options);

				console.log('MIMI_LESSON_' + lesson_id + '_' + lessonRound);
				
				var text	= ( lessonRound ) ? $.gt_translate('MIMI_LESSON_' + lesson_id + '_' + lessonRound) : $.gt_translate('MIMI_LESSON_' + lesson_id);

				$.startGame('npcTalk/close');
				$.startGame('npcTalk/start', { text: text });

				//$.doTimeout(3000, function() {
					//$.startGame('npcTalk/close');
				//});

			break;

			case 'timerDown':

				if ( $(timeDownTimer)[0] ) {
					return false;
				}

				var lessonRound    = Number( $(gameBody).data('lessonRound') );
					lesson_id	   = Number( $(gameBody).data('lesson-id') ),
					startCounter   = 30,
					timeDownBuild  = '<div id="time-down-timer" class="circle-area button-bigger animated"><span role="time-down-number" class="circle-text center noEvents" style="animation-duration: .66s;">' + startCounter + '</span></div>';

				$(timeDownBuild).prependTo(gameBackground);

				$.doTimeout(1000, function() {
				
					var startCounter = Number( $(timeDownNumber).text() );

					if ( startCounter >= 2 )
					{
						$(timeDownNumber).text( startCounter - 1 );
						return true;
					}
					else {

						$(countDownTimer).animateCss('fadeOut', '1s');
						$(timeDownNumber).hide();

						console.log('lesson_id', lesson_id);

						if ( lesson_id == 1 )
						{
							/*lessonRound++;
							$(gameBody).data('lessonRound', lessonRound);

							$.startGame('lesson', { lesson_id: 1, lessonRound: lessonRound });*/
							$.startGame('finish', options);

						}
						else {
							$.startGame('finish', options);
						}


						return false;
					}

				});

			break;

			case 'countDown':

				if ( $(countDownTimer)[0] ) {
					return false;
				}

				var startCounter    = 3,
					countDownBuild  = '<div id="count-down-timer"><span role="count-down-number" class="squiggly" style="animation-duration: .66s;">' + startCounter + '</span><div>',
					newMode			= options.lesson_id;

				//alert(newMode);
				
				$(countDownBuild).appendTo(gameBody);

				if ( $.isFunction($.playBGM) ) {
					$.playBGM('start', { Obj: musicHolder, bgm: 'Magic-Clock-Shop_Looping' });
				}

				$('.game-ads').hide();

				$.doTimeout(1000, function() {
				
					var startCounter = Number( $(countDownNumber).text() );

					if ( startCounter >= 2 )
					{
						$(countDownNumber).text( startCounter - 1 );
						return true;
					}
					else {

						//$(countDownTimer).effecCss('fadeOut');
						$(countDownTimer).remove();

						$.startGame('timerDown', options);
						$.startGame('score', options);
						$.startGame('npcTalk/close');
						$('[role="game-npc-talk"], [role="game-backto"]').addClass('hide');

						$.startGame(newMode, options);

						return false;
					}

				});

			break;

			case 1:
			case '1':

				if ( $('#math-build')[0] ) {
					return false;
				}

				var mathRound			= $(gameBody).data('mathRound') || 0,
					operatorObfuscated  = '',
					numAObfuscated		= '',
					numBObfuscated		= '',
					resultObfuscated	= '',
					obfuscate		    = $.getRandomInt(0,3);

				if ( mathRound > 5 )
				{
					var NumA		= $.getRandomInt(2,50),
						operators	= ['+', '-', 'x', '/'];
				}
				else 
				{
					var NumA		= $.getRandomInt(2,15),
						operators	= ['+', '-'];
				}

				var	operator			= operators[ $.getRandomInt(0, operators.length - 1) ];

				if ( operator == 'sum' || operator == '+' )
				{
					var NumB   = $.getRandomInt(0, 50),
						result = NumA + NumB;
				}
				else if ( operator == 'substract' || operator == '-' )
				{
					var NumB   = $.getRandomInt(0, NumA),
						result = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
				}
				else if ( operator == 'multiply' || operator == 'x' )
				{
					var NumB   = $.getRandomInt(2, 17),
						result = Math.round( NumA * NumB );
				}
				else if ( operator == 'divide'  || operator == '/' )
				{
					var NumB   = $.getRandomInt(1, 4),
						result = Math.round( NumA / NumB );
				}

				result = Number( result );

				if ( obfuscate === 0 ) {
					randomTitle	       = operator,
					operatorObfuscated = 'obfuscate';
				}
				else if ( obfuscate === 1 ) {
					randomTitle	       = 'NumA',
					numAObfuscated	   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(NumA),
					randomGuess        = NumA;
				}
				else if ( obfuscate === 2 ) {
					randomTitle	       = 'NumB',
					numBObfuscated	   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(NumB),
					randomGuess        = NumB;
				}
				else if ( obfuscate === 3 ) {
					randomTitle	       = 'result',
					resultObfuscated   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(result),
					randomGuess        = result;
				}/**/


				var	mathBuild  = '<div id="math-build" unselectable="on"><div class="math-group">';
					mathBuild += '<span role="numA" class="' + numAObfuscated + '">' + NumA + '</span>';
					mathBuild += '<span class="' + operatorObfuscated + '" role="operator">' + operator + '</span>';

					if ( obfuscate === 0 ) {
						mathBuild += '<ul id="answer-list" class="select-answer h-list"><li class="answer-option button-bigger target" data-option="+" role="answer-option" style="animation-duration: 1.2s;">+</li><li class="answer-option button-bigger target" style="animation-duration: 1s;" data-option="-" role="answer-option">-</li><li style="animation-duration: .8s; line-height: 55px;" class=" answer-option button-bigger target" data-option="x" role="answer-option" style="line-height: 58px;">x</li><li style="animation-duration: .6s;" class="answer-option button-bigger target" data-option="/" role="answer-option">/</li></ul>';
					
					}
					else {

						var randNumberA = randomNumbers.randNumberA,
							randNumberB = randomNumbers.randNumberB,
							randNumberC = randomNumbers.randNumberC;

						mathBuild += '<ul id="answer-list" class="select-answer h-list"><li class="answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option" style="animation-duration: 1.2s; line-height: 65px; font-size: 2rem;">' + randNumberA + '</li><li class="answer-option button-bigger target" style="animation-duration: 1s; line-height: 65px; font-size: 2rem;" data-option="' + randomTitle + '" role="answer-option">' + randNumberB + '</li><li style="animation-duration: .8s; line-height: 65px; font-size: 2rem;" class=" answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option">' + randNumberC + '</li><li style="animation-duration: .6s; line-height: 65px; font-size: 2rem;" class="answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option">' + randomGuess + '</li></ul>';/**/
					}

					mathBuild += '<span class="' + numBObfuscated + '" role="numB">' + NumB + '</span>';
					mathBuild += '<span class="' + resultObfuscated + '" role="result">' + result + '</span>';

					mathBuild += '</div></div>';

				$(mathBuild).appendTo(gameBody);

				if ( obfuscate )
				{
					var elems = $( $('#answer-list li').get() ).sort(function (a, b) {
					  return ($(a).text() < $(b).text() ? -1 
							: $(a).text() > $(b).text() ? 1 : 0);
					}); 
					$('#answer-list').html(elems);
				}

			break;

			case 2:
			case '2':

				if ( $('#math-build')[0] )
				{
					return false;
				}

				var mathRound			= $(gameBody).data('mathRound') || 0,
					operatorObfuscated  = 'obfuscate',
					obfuscate		    = 1;

				if ( mathRound > 5 )
				{
					var NumA		= $.getRandomInt(2,50),
						operators	= ['+', '-', 'x', '/'];
				}
				else 
				{
					var NumA		= $.getRandomInt(2,15),
						operators	= ['+', '-'];
				}
						
				var operator    = operators[ $.getRandomInt(0, operators.length - 1) ];

				if ( operator == 'sum' || operator == '+' )
				{
					var NumB   = $.getRandomInt(0, 50),
						result = NumA + NumB;
				}
				else if ( operator == 'substract' || operator == '-' )
				{
					var NumB   = $.getRandomInt(0, NumA),
						result = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
				}
				else if ( operator == 'multiply' || operator == 'x' )
				{
					var NumB   = $.getRandomInt(2, 17),
						result = Math.round( NumA * NumB );
				}
				else if ( operator == 'divide'  || operator == '/' )
				{
					var NumB   = $.getRandomInt(1, 4),
						result = Math.round( NumA / NumB );
				}

				result = Number( result );

				var	mathBuild  = '<div id="math-build" unselectable="on"><div class="math-group">';
					mathBuild += '<span role="numA" class="">' + NumA + '</span>';
					mathBuild += '<span class="' + operatorObfuscated + '" role="operator">' + operator + '</span>';
					if ( obfuscate === 1 ) {
					
						mathBuild += '<ul id="answer-list" class="select-answer h-list"><li class="answer-option button-bigger target" data-option="+" role="answer-option" style="animation-duration: 1.2s;">+</li><li class="answer-option button-bigger target" style="animation-duration: 1s;" data-option="-" role="answer-option">-</li><li style="animation-duration: .8s; line-height: 55px;" class=" answer-option button-bigger target" data-option="x" role="answer-option" style="line-height: 58px;">x</li><li style="animation-duration: .6s;" class="answer-option button-bigger target" data-option="/" role="answer-option">/</li></ul>';
					
					}
					mathBuild += '<span class="" role="numB">' + NumB + '</span>';
					mathBuild += '<span role="result">' + result + '</span>';

					mathBuild += '</div></div>';

				$(mathBuild).appendTo(gameBody);

			break;

			case 3:
			case '3':

				if ( $('#math-build')[0] )
				{
					return false;
				}

				var mathRound			= $(gameBody).data('mathRound') || 0,
					numAObfuscated		= '',
					numBObfuscated		= '',
					resultObfuscated	= '',
					obfuscate		    = $.getRandomInt(1,3);

				if ( mathRound > 5 )
				{
					var NumA		= $.getRandomInt(2,50),
						operators	= ['+', '-', 'x', '/'];
				}
				else 
				{
					var NumA		= $.getRandomInt(2,15),
						operators	= ['+', '-'];
				}
						
				var operator    = operators[ $.getRandomInt(0, operators.length - 1) ];

				if ( operator == 'sum' || operator == '+' )
				{
					var NumB   = $.getRandomInt(0, 50),
						result = NumA + NumB;
				}
				else if ( operator == 'substract' || operator == '-' )
				{
					var NumB   = $.getRandomInt(0, NumA),
						result = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
				}
				else if ( operator == 'multiply' || operator == 'x' )
				{
					var NumB   = $.getRandomInt(2, 17),
						result = Math.round( NumA * NumB );
				}
				else if ( operator == 'divide'  || operator == '/' )
				{
					var NumB   = $.getRandomInt(1, 4),
						result = Math.round( NumA / NumB );
				}

				result = Number( result );

				if ( obfuscate == 2 ) {
					randomTitle	       = 'NumB',
					numBObfuscated	   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(NumB),
					randomGuess        = NumB;
				}
				else if ( obfuscate == 1 ) {
					randomTitle	       = 'NumA',
					numAObfuscated	   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(NumA),
					randomGuess        = NumA;
				}
				else {
					randomTitle	       = 'result',
					resultObfuscated   = 'obfuscate',
					randomNumbers	   = $.randomiZeDices(result),
					randomGuess        = result;
				}


				var randNumberA = randomNumbers.randNumberA,
					randNumberB = randomNumbers.randNumberB,
					randNumberC = randomNumbers.randNumberC;

				console.log('randNumberA', randNumberA, 'randNumberB', randNumberB, 'randNumberC', randNumberC, 'result', result );

				var	mathBuild  = '<div id="math-build" unselectable="on"><div class="math-group">';
					mathBuild += '<span role="numA" class="' + numAObfuscated + '">' + NumA + '</span>';
					mathBuild += '<span class="" role="operator">' + operator + '</span>';


					mathBuild += '<span class="' + numBObfuscated + '" role="numB">' + NumB + '</span>';

						mathBuild += '<ul id="answer-list" class="select-answer h-list"><li class="answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option" style="animation-duration: 1.2s; line-height: 65px; font-size: 2rem;">' + randNumberA + '</li><li class="answer-option button-bigger target" style="animation-duration: 1s; line-height: 65px; font-size: 2rem;" data-option="' + randomTitle + '" role="answer-option">' + randNumberB + '</li><li style="animation-duration: .8s; line-height: 65px; font-size: 2rem;" class=" answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option">' + randNumberC + '</li><li style="animation-duration: .6s; line-height: 65px; font-size: 2rem;" class="answer-option button-bigger target" data-option="' + randomTitle + '" role="answer-option">' + randomGuess + '</li></ul>';/**/
					
					mathBuild += '<span class="' + resultObfuscated + '" role="result">' + result + '</span>';



					mathBuild += '</div></div>';

				$(mathBuild).appendTo(gameBody);

				var elems = $( $('#answer-list li').get() ).sort(function (a, b) {
				  return ($(a).text() < $(b).text() ? -1 
						: $(a).text() > $(b).text() ? 1 : 0);
				}); 
				$('#answer-list').html(elems);

			break;

			case 'score':

				if ( $('#score-build')[0] )
				{
					return false;
				}

				var	scoreBuild  = '<div id="score-build" class="" style="animation-duration: .66s;"><div class="score-group">';
					scoreBuild += '<span role="score-track" class="score-track" data-total="0">0</span>';
					scoreBuild += '</div></div>';

				$(scoreBuild).prependTo(gameBackground);

			break;

			case 'add-score':

				if ( !$('#score-build')[0] )
				{
					return false;
				}

				var current_score = Number( $(scoreTrack).attr('data-total') ),
					new_score	  = current_score + 1;

				if ( isNaN( new_score ) ) {
					return false;
				}

				$(scoreTrack).text( number_format( new_score ) ).attr('data-total', new_score);

			break;

			case 'substract-score':

				if ( !$('#score-build')[0] )
				{
					return false;
				}

				var current_score = Number( $(scoreTrack).attr('data-total') ),
					new_score	  = ( current_score - 1 <= 0 ) ? 0 : current_score - 1;


				if ( isNaN( new_score ) ) {
					return false;
				}

				$(scoreTrack).text( number_format( new_score ) ).attr('data-total', new_score);

			break;


			case 'answer':

				var mathRound		 = $(gameBody).data('mathRound'),
					Obj				 = options.Obj,
					flag			 = $(Obj).attr('data-flag'),
					operator		 = options.operator || $('[role="operator"]', mathBuild).text(),
					NumA			 = $('[role="numA"]', mathBuild).text(),
					NumB		     = $('[role="numB"]', mathBuild).text(),
					NumA			 = Number(NumA),
					NumB		     = Number(NumB),
					result			 = Number( options.result ),
					real_answer		 = Number( $('[role="result"]', mathBuild).text() );

				if ( flag ) {
					return false;
				}

				$(Obj).attr('data-flag', 1);

				$.doTimeout(400, function() {
					$(Obj).attr('remove-flag', 1);
				});

				if ( result )
				{
					if ( operator == 'NumA' && NumA == result )
					{
						$.startGame('correct', options);
						var isCorrect = true;
					}
					else if ( operator == 'NumB' && NumB == result )
					{
						$.startGame('correct', options);
						var isCorrect = true;

					}
					else if ( operator == 'result' && result == real_answer )
					{
						$.startGame('correct', options);
						var isCorrect = true;

					}
					else {
						$.startGame('wrong', options);	
						var isCorrect = false;

					}

					console.log('operator', operator, 'NumA', NumA, 'NumB', NumB, 'result', result, isCorrect);
				}
				else {

					if ( operator == 'sum' || operator == '+' )
					{
						var answer = NumA + NumB;
					}
					else if ( operator == 'substract' || operator == '-' )
					{
						var answer = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
					}
					else if ( operator == 'multiply' || operator == 'x' )
					{
						var answer = Math.round( NumA * NumB );
					}
					else if ( operator == 'divide'  || operator == '/' )
					{
						var answer = Math.round( NumA / NumB  );
					}

					//console.log('answer', answer, options);

					if ( answer === real_answer )
					{
						$.startGame('correct', options);
					}
					else {
						$.startGame('wrong', options);
					}
				}

				var mathRound =	Number( $(gameBody).data('mathRound') );

				mathRound++;
				$(gameBody).data('mathRound', mathRound);

			break;

			case 'ohayou':

				var game_id  = Number( $(gameBody).attr('data-id') ),
					answerID = time	= new Date().getTime();

				var correctBuild = '<div id="answer-' + answerID + '" class="ohayou-answer" style="animation-duration: .66s;bottom: 33vh;"><i class="animated bounce" style="background-image: url(\'' + gamePath + game_id + '/img/ohayou.png\'); width: 225px; height: 107px; background-size: cover; display: block; animation-duration: .35s; "></i></div>';

				$(correctBuild).appendTo(gameBody);

				//$.squash({ Obj: $(teacherSeika).parent(), squashClass: 'mega-squash', from: user_id, toServer: false });

				$.playSFX('smw_correct', '#answer-' + answerID, 1, { type: 'mp3' });
				$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-400px 0px' }).parent().parent().animateCss('headShake', '.3s');

				$.doTimeout(1666, function() {
					$(teacherSeika).css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika'  });

					$('#answer-' + answerID).find('i').removeAttr('class').animateCss('fadeOutUp', '.15s', function() {
						$(this).parent().remove();
					});
				});/**/

			break;

			case 'correct':

				var lesson_id = lesson_id || Number( $(gameBody).data('lesson-id') );

				$('#math-build').remove();
				//alert('correct');

				$.startGame(lesson_id);
				$.startGame('add-score');

				var correctCounter =	Number( $(gameBody).data('correctCounter') ),
					comboCounter   =	Number( $(gameBody).data('comboCounter') );

				correctCounter++;
				comboCounter++;
				$(gameBody).data('comboCounter', comboCounter);
				$(gameBody).data('correctCounter', correctCounter);

				var game_id  = Number( $(gameBody).attr('data-id') ),
					answerID = time	= new Date().getTime();

				var correctBuild = '<div id="answer-' + answerID + '" class="correct-answer combo-x' + comboCounter + ' squiggly" style="animation-duration: .66s;"><i class="animated bounce"  style="background-image: url(\'' + gamePath + game_id + '/img/correct-answer.png\'); width: 225px; height: 50px; background-size: cover; display: block; animation-duration: .35s;"></i></div>';

				$(correctBuild).appendTo(gameBody);

				//$.squash({ Obj: $(teacherSeika).parent(), squashClass: 'mega-squash', from: user_id, toServer: false });
				$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-400px 0px' }).parent().parent().animateCss('headShake', '.3s');

				$.playSFX('smw_correct', '#answer-' + answerID, 1, { type: 'mp3' });

				$.doTimeout(750, function() {

					$(teacherSeika).css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika'  });

					$('#answer-' + answerID).find('i').removeAttr('class').animateCss('fadeOutUp', '.15s', function() {
						$(this).parent().remove();
					});
				});

			break;

			case 'wrong':

				var lesson_id = lesson_id || Number( $(gameBody).data('lesson-id') );

				$('#math-build').remove();
				//alert(lesson_id);

				$.startGame(lesson_id);
				$.startGame('substract-score');

				var wrongCounter	=	Number( $(gameBody).data('wrongCounter') ),
					comboCounter    =	Number( $(gameBody).data('comboCounter') );

				wrongCounter++;

				if ( comboCounter )
				{
					$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '0px 0px' }).parent().parent().animateCss('headShake', '.3s');
				}
				else {
					$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-1200px 0px' }).parent().parent().animateCss('headShake', '.3s');
				}

				comboCounter == 0;
				$(gameBody).data('comboCounter', comboCounter);
				$(gameBody).data('wrongCounter', wrongCounter);

				var game_id  = Number( $(gameBody).attr('data-id') ),
					answerID = time	= new Date().getTime();

				var correctBuild = '<div id="answer-' + answerID + '" class="wrong-answer squiggly" style="animation-duration: .66s;"><i class="animated bounce"  style="background-image: url(\'' + gamePath + game_id + '/img/wrong-answer.png\'); width: 200px; height: 95px; background-size: contain; display: block; animation-duration: .35s; background-position: "></i></div>';

				$(correctBuild).appendTo(gameBody);

				//$.squash({ Obj: $(teacherSeika).parent(), squashClass: 'mega-squash', from: user_id, toServer: false });

				$.playSFX('smw_incorrect', '#answer-' + answerID, 1, { type: 'mp3' });


				$.doTimeout(750, function() {

					$(teacherSeika).css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika'  });

					$('#answer-' + answerID).find('i').removeAttr('class').animateCss('fadeOutUp', '.15s', function() {
						$(this).parent().remove();
					});
				});


			break;

			case 'finish':
				
				$(timeDownTimer).remove();

				$(answerList).remove();

				$('#math-build').remove();

				var user_featured   = Number( $.user('user_featured') ),
					user_fame       = Number( $.user('user_fame') ),
					fame_points     = ( user_featured ) ? 5 : 10,
					wrongCounter    = Number( $(gameBody).data('wrongCounter') ),
					correctCounter  = Number( $(gameBody).data('correctCounter') ),
					mathRound		= Number( $(gameBody).data('mathRound') );

				var	efectiveness    = $.calcEfectiveness( correctCounter, wrongCounter, mathRound ),
					current_score   = Number( $(scoreTrack).attr('data-total') );

				if ( $.user_id() > 1 )
				{
					if ( user_fame < fame_points )
					{
						$.warning({
							message: '<div class="center-text">' + $.translate('NOT_ENOUGH_FAME') + '</div><div class="center-text">' + $.translate('YOU_NEED') + ' <span class="strong">' + fame_points + ' Fame Points.</span></div>'
						});

						$.startGame('showResults', { score_second: efectiveness, score: current_score });
					}
					else {
						$.startGame('submit');
					}
				}
				else {
					
					$.startGame('showResults', { score_second: efectiveness, score: current_score });
				}

			break;

			case 'showResults':

				var user_featured = $.user('user_featured'),
					score_second  = options.score_second,
					score		  = options.score,
					lesson_id	  =Number( $(gameBody).data('lesson-id') ),
					currentScore  = $(gameBody).data('currentScore'),
					currentScoreSecond  = $(gameBody).data('currentScoreSecond'),
					grade		  = $.getGrade(score_second),
					efectivenessC = ( score_second > 50 ) ? '#00aadd' : '#FFFFFF';
			
				//console.log('score', score, 'score_second', score_second, 'grade', grade);

				$(bestScores).removeClass('hide');
				$(gameLessons).removeClass('hide').find('#game-select-screen').addClass('hide');
				$('#game-end-screen').removeClass('hide').find('[data-role="game-end-message"]').addClass('hide');
				$('[role="game-npc-talk"]').removeClass('hide');
				$('#game-photo-button').removeClass('hide');

				$('#score-build').remove();
				$('[role="final-score"]').text( number_format( score ) ).attr('data-total', score);
				$('[role="final-grade"]').text( grade );

				$('.game-end-lesson').addClass('hide');
				$('.game-end-lesson[data-id="' + lesson_id + '"]').removeClass('hide');
				
				if ( !$('#videoads-link')[0] && !user_featured )
				{
					$('.game-ads').show();
					
					var videoURL  = window.url + 'play',
						dataLink  = '{"parent":"play","param":{"mode":"video","app":1},"mode":"video","closeOverlay":false,"popID":"video-viewer","pop":1,"trgt":"#content","hideH":1,"showTitle":false,"removeData":true,"preload":false,"call":"videoAdStartB"}',
						videoLink = '<a id="videoads-link" data-link=' + dataLink + ' data-nopush href="' + videoURL + '"></a>';

					$(videoLink).appendTo('body').trigger('click');
				}

				$.doTimeout(2000, function() {
				
					if ( window.adStarted == 0 )
					{
						//alert('test');
						$('[role="game-effectiveness"]').removeClass('hide').text(grade).css({ color: efectivenessC });

						if ( highest_score < score ) {

							$(HighestScoreTrack).text( number_format( score ) ).attr('data-total', score);

							//TODO SEIKA IMPRESSED
							$('#game-end-message').find('[role="game-congratulations"]').removeClass('hide');
							$.playSFX('start', { Obj: musicHolder, bgm: 'Victory_Song' });

							$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-400px 0px' }).parent().parent().animateCss('headShake', '.3s');

							$.doTimeout(750, function() {
								$(teacherSeika).css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika'  });
							});

						}
						else if ( score >= 10 ) {

							$('[role="game-icon-starred"]').removeClass('hide');
							$('#game-end-message').find('[role="game-congratulations"]').removeClass('hide');
							$.playSFX('start', { Obj: musicHolder, bgm: 'Victory_Song' });

							$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-400px 0px' }).parent().parent().animateCss('headShake', '.3s');

							$.doTimeout(750, function() {
								$(teacherSeika).css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika'  });
							});

						}
						else {
							$('#game-end-message').find('[role="game-failed"]').removeClass('hide');
							$.playSFX('start', { Obj: musicHolder, bgm: 'Failed_Song' });

							$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': 'none', 'background-position': '-1600px 0px' }).parent().parent().animateCss('headShake', '.3s');

						}
						
						var objLeft = '[data-score="' + score + '"]';

						if ( $(objLeft, bestScores)[0] )
						{
							var	cPosition	= $(objLeft, bestScores).position(),
								cLeft		= ( cPosition ) ? cPosition.left : -1;
						}

						if ( cLeft === -1 )
						{
							$('.avatar-score[data-score]').each(function(idx, itm) {
							
								var cScore = Number( $(itm).attr('data-score') ),
									cScoreSecond = Number( $(itm).attr('data-second') );

								//alert(cScore);
								//conso.e.log(itm);

								if ( cScore <= score )
								{
									cPosition	= $(itm).position(),
									cLeft		= cPosition.left/* - $(itm).width() / 2*/;
								}
							
							});
						}

						$(gameBody).removeAttr('data-lesson');
						lesson_id = 0;

						$.doTimeout(500, function() {

							$('#best-scores').find('nav').css({
								'transform': 'translateX(-' + cLeft + 'px)'
							});

						});
					}

				
				});

			break;

			case 'submit':

				/*if ( user_id < 2 ) {

					$(startScreen).show().animateCss('1s', 'fadeIn');
					$.playBGM('start', { bgm: 'New_Eden_Town' });
					$('#score-build').remove();

					return false;
				}*/
				
				var url			  = window.url + 'play.php',
					lesson_id		= Number( $(gameBody).data('lesson-id') ),
					game_id			= Number( $(gameBody).attr('data-id') ),
					highest_score = Number( $(HighestScoreTrack + '[data-lesson="' + lesson_id + '"]').attr('data-total') ),
					current_score = Number( $(scoreTrack).attr('data-total') ),
					wrongCounter    = Number( $(gameBody).data('wrongCounter') ),
					correctCounter  = Number( $(gameBody).data('correctCounter') ),
					mathRound		= Number( $(gameBody).data('mathRound') ),
					efectiveness    = $.calcEfectiveness( correctCounter, wrongCounter, mathRound ),
					param		    = {
						mode: 'score/POST',
						game_id: game_id,
						lesson_id: lesson_id,
						score: current_score,
						score_second: efectiveness
					};

				/*if ( current_score <= 0 ) {

					$(startScreen).show().animateCss('1s', 'fadeIn');
					$.playBGM('start', { bgm: 'New_Eden_Town' });
					$('#score-build').remove();

					return false;
				}*/

				$.slowLoad('start');

				$.post(url, param).done(function(data) {
					
					//console.log(data);

					if ( data && current_score > 0 )
					{
						$.notification({ 
							message: data, 
							duration: 2000
						});
					}
					

				}).always(function() {
				
					$.slowLoad('stop');
					
					$.startGame('showResults', { score_second: efectiveness, score: current_score });


					/*var wWidth		  = $(window).width(),
						wHeight		  = $(window).height(),
						bottom		  = ( wWidth < 720 || wHeight < 720 ) ? '-100px' : '-250px';

					$(startScreen).show().effectCss('fadeIn');
					$(startGame).css({ left: '-80px', bottom: bottom });

					if ( highest_score < current_score ) {

						$(HighestScoreTrack).text( number_format( current_score ) ).attr('data-total', current_score);

						//TODO SEIKA IMPRESSED
					}

					$('#score-build').remove();

					var objLeft = '[data-score="' + current_score + '"]';

					if ( $(objLeft, bestScores)[0] )
					{
						var	cPosition	= $(objLeft, bestScores).position(),
							cLeft		= ( cPosition ) ? cPosition.left : -1;
					}

					if ( cLeft === -1 )
					{

						$('.avatar-score[data-score]').each(function(idx, itm) {
						
							var cScore = Number( $(itm).attr('data-score') );

							if ( cScore <= current_score )
							{
								cPosition	= $(itm).position(),
								cLeft		= cPosition.left;
							}
						
						});
					}

					$.playBGM('start', { Obj: musicHolder, bgm: 'New_Eden_Town' });

					$('[role="final-score"]').text( number_format( current_score ) ).attr('data-total', current_score);
					$(gameBody).removeAttr('data-lesson');
					lesson_id = 0;


					$.doTimeout(500, function() {

						$('#best-scores').find('nav').css({
							'transform': 'translateX(-' + cLeft + 'px)'
						});

					});*/
				});

			break;

			case 'exit':

				var game_id		= Number( $(gameData).attr('data-id') ),
					cLastPath	= $.getLastPath(),
					origin		= window.location.origin; 

				$('.keyframe-style').remove();
				$.preventLeave('unbind');
				$.fullscreen('stop', $('body')[0]);
				$('#game-link-' + game_id).remove();

				if ( typeof Android !== "undefined" && Android !== null ) {

					//Android.performClickExit();

				}
				else if ( origin == 'https://gamejolt.com' ) {
					
					/*var GJAPI_REFERER = $('body').attr('data-gjapi');

					if ( GJAPI_REFERER )
					{
						var GJAPI_USER		 = GJAPI_REFERER.split('&'),
							GJAPI_USERn      = GJAPI_USER[0].split("="),
							GJAPI_USERt      = GJAPI_USER[1].split("=");

							GJAPI.sUserName  = decodeURIComponent(GJAPI_USERn[1]);
							GJAPI.sUserToken = decodeURIComponent(GJAPI_USERt[1]);

						GJAPI.SendRequest('/sessions/close/?username=' + GJAPI.sUserName + '&user_token=' + GJAPI.sUserToken, GJAPI.SEND_GENERAL, function(pResponse) {

							$('html').remove();
							$('#moshaFrame').remove();
							
						});
					}*/

				}
				else if ( window.location.origin == 'moshagames.itch.io' ) {

					/*$('html').remove();
					$('#moshaFrame').remove();
					window.parent.close();
					window.close();*/

				}
				else if ( cLastPath.substring(0,4) == 'play' ) {

					/*$('html').remove();
					$('#moshaFrame').remove();
					window.parent.close();
					window.close();*/

				}
				else if ( cLastPath == 'games' ) {

					$.playBGM('stop');
					$('[role="exit-mosha"]').trigger('click');
					$.closeDialog();
					$('body').removeClass('gameBox noOverflow');

					/*$(overlay).remove();*/

					$('header').removeAttr('class').show();
					$('#dashboard').removeAttr('class').show();
					$('#page-content').removeAttr('class').show();

					$.doTimeout(666, function() {

						if ( !$('header').is(':visible') ) {
							$('header').removeClass('hide').show();
							$('#page-content').removeClass('hide').show();
							$('#dashoboard').removeClass('hide').show();
							return false;
						}

						return true;
								
					});

				}
				else if ( cLastPath.substring(0,4) == 'game' ) {

					/*$('html').remove();
					$('#moshaFrame').remove();
					window.parent.close();
					window.close();*/

					window.location = window.url + 'games';

				}
				else {

					window.location = window.url + 'games';

					/*$.playBGM('stop');
					$.closeDialog();
					
					$('body').removeClass('appbox gameBox noOverflow');
					$(overlay).remove();

					$('header').removeAttr('class').show();
					$('#dashboard').removeAttr('class').show();
					$('#page-content').removeAttr('class').show();

					$.doTimeout(1500, function() {

						$(Obj).removeClass('active').parent().removeClass('active');

						if ( !$('#page-content').is(':visible') ) {
							$('#page-content').removeClass('hide').show();
							$('#dashoboard').removeClass('hide').show();
							return false;
						}

						return true;
								
					});*/
				}

			break;

			case 'npcTalk/start':

				if ( !$('#game-talk-overlay')[0] )
				{
					var overlayBlob  = '<div id="game-talk-overlay" class="ui-widget-overlay" style="z-index: 10;"></div>';
					$(overlayBlob).insertAfter(gameLessons);

					$('#obj-game-bgs').parent().addClass('justBlur');
					$(gameLessons).removeClass('animated fadeIn').parent().addClass('littleBlur');
					$('#teacher-seika').addClass('target');
				}

				var message_id      = options.message_id || 0,
					paragraph_id    = options.paragraph_id || 0,
					user_featured   = Number( $.user('user_featured') );

				if ( message_id == 0 )
				{
					/*switch ( highScore )
					{
						case 1:
						default:
							message_id = 1;
						break;
					}*/
					var pool		= ( user_id > 1 ) ? [0, 1, 2, 3, 4, 5, 6, 7] : [1, 3, 4, 5, 6, 7],
						message_id  = pool[ $.getRandomInt(0, pool.length - 1) ];
				}

				var text			= options.text || $.startGame('npcTalk/text', { message_id: message_id, paragraph_id: paragraph_id });

				if ( !text || text == 'undefined' ) {
					$.startGame('npcTalk/close');
					return false;
				}

					//Hola, soy <span class="strong">Mimi</span>
				var	messageBlob  = '<div id="game-message-blob" data-id="' + message_id + '" data-paragraph="' + paragraph_id + '" role="game-talk" class="target animated zoomIn">';
					messageBlob += '<div id="game-npc" class="strong">Mimi Ashura:</div>';
					messageBlob += '<div id="game-message-text">' + text + '</div>';
					messageBlob += '</div>';

				$('[role="game-talk"]').removeClass('target animated zoomIn').addClass('noEvents squiggly').css({ 'margin-top': '-50px', 'margin-left': '-50px', 'animation-duration': '.' + $.getRandomInt(30, 99) + 's' });
					
				$(messageBlob).appendTo(gameBody);

				$('[role="game-npc-talk"]').addClass('hide');
				$(teacherSeika).removeClass('animated fadeIn').css({ 'animation': '5s steps(1, start) 0s infinite normal none running teacher_seika' });

				if ( message_id == 0 && paragraph_id == 1 ) {
					$(gameLessons).css({ 'z-index': 100 }).removeClass('animated fadeIn squiggly').parent().removeClass('littleBlur');
				}

			break;

			case 'npcTalk/text':
				
				var message_id   = options.message_id || 0,
					paragraph_id = options.paragraph_id || 0,
					text		 = 'Ohayou! n//n';

				if ( message_id == 0 && paragraph_id == 0 )
				{
					text = $.gt_translate('MIMI_0_0');
				}
				else {
					text = $.gt_translate('MIMI_' + message_id + '_' + paragraph_id);
				}

				return text;

			break;

			case 'npcTalk/close':

				$('#game-talk-overlay').remove();
				$('[role="game-talk"]').remove();

				if ( !$('#count-down-timer')[0])
				{
					$('[role="game-npc-talk"]').removeClass('hide');
				}
				$('#obj-game-bgs').removeClass('squiggly').parent().removeClass('justBlur');
				$(gameLessons).removeClass('animated fadeIn').removeClass('squiggly').parent().removeClass('littleBlur');
				$('#teacher-seika').removeClass('target');

			break;

			case 'screenshot':
				
				var height	 = options.height
					canvas	 = options.canvas,
					callback = options.callback;

				if ( !$(canvas)[0] ) {
					return false;
				}

				if ( !user_id )
				{
					var time	 = new Date().getTime(),
						target	 = 'screenshot-' + time;

					

					var	sWidth	 = $(gameBackground).width(),
						wWidth	 = $(window).width(),
						w		 = ( wWidth <= sWidth ) ? wWidth - 10 : 718;


					$.popWindow({
						id:	target,
						closeOverlay: false,
						title: 'Screenshot Preview',
						width: w,
						callback: function() {
							$.registerPhoto(height);
						}
					});					
					
					$(canvas).html2canvas({
						target: target,
						callback: function() {

						}
					});

				}
				else
				{
					var startPost = '[role="start-post"]';

					$(startPost).trigger('click');

					$.uBox('screenshot/game', canvas, '[role="comment"]');
				}

			break;

			default:

				//var	pop = $.pop('user-avatar', user_id);
				var defaultLanguage = 'en',
					user_language   = $.user('user_lang'),
					language		= user_language || defaultLanguage;

				$.loadGameLanguage(language);

				$.Particle($('#obj-Particles')[0], 100);

				if ( $.isFunction($.playBGM) ) {
					$.playBGM('start', { Obj: musicHolder, bgm: 'main_theme' });
				}

				$('body').addClass('gameBox').show();


				$(startGame).removeClass('noAlpha').animateCss('1s', 'fadeIn', function() {
					
					
				
				});

				var key_animations = '[data-keyframe]';

				$.requireScript('keyframes', function() {

					$.requireScript('animations', function() {

						$(key_animations, gameBody).each(function(idx, itm) {

							var animation = $(itm).attr('data-keyframe');

							$.object_animation(animation, {
								from: user_id,
								Obj: itm						
							});
						});
					});
				});

				if ( user_id > 1 )
				{
					$.doTimeout(66, function() {
					
						if ( $('#character-menu')[0] )
						{
							$('#character-menu').appendTo('#game-lessons').removeClass('gray noEvents');
							return false;
						}
						return true;
					});

					$.carrousel('start/navi', { Obj: '#game-lessons' });
				}

			break;

			case 'init':

				//alert('test');
				var gameData	= '[role="game-data"]',
					game_id		= Number( $(gameData).attr('data-id') ),
					map_id		= Number( $(gameData).attr('data-map') );

				/*if ( !$('#g3-' + game_id )[0] )
				{
					var URL		  = window.url + 'play',
						dataLink  = '{"parent":"play","param":{"mode":"game","app":1,"game_id":' + game_id + '},"mode":"game=' + game_id + '","closeOverlay":false,"popID":"game-viewer","pop":1,"trgt":"#content","hideH":1,"showTitle":false,"removeData":true,"preload":false,"call":"startGame","width":960,"dialogClass":"game-viewer","openAnimation":"fadeIn"}',
						gameLink = '<a id="g3-' + game_id + '" data-id="' + game_id + '" class="hidden" data-nopush href="game=' + game_id + '" data-link=' + dataLink + '></a>';

					$(gameLink).appendTo('body').trigger('click');
				}*/

				$.doTimeout(666, function() {
						
					if ( !isNaN(map_id) )
					{
						if ( !$('link-start-' + map_id)[0] && !$(window.map)[0] )
						{
							var URL		  = window.url + 'play',
								dataLink  = '{"parent":"play","param":{"map_id":"' + map_id + '","app":1},"mode":"game=' + game_id + '","closeOverlay":false,"popID":"mosha-viewer-' + map_id + '","pop":1,"trgt":".mosha-container","bpreCall":"loadPlay","hideH":1,"showTitle":false,"removeData":true,"dialogClass":"mosha-online","call":"startPlay","closeOnEscape":false,"width":960}',
								gameLink = '<a id="link-start-' + map_id + '" data-id="' + game_id + '"  data-nopush href="game=' + game_id + '" data-link=' + dataLink + ' style="color: white">click</a>';

							$(gameLink).appendTo('body').trigger('click');

							$('#link-start-' + map_id).remove();
							
							return false;

						}
						
					}

					return true;
				});

				
				

				/*	<span id="link-game-{games.MAP_ID}" role="link-play" data-id="{games.MAP_ID}" data-user="{games.MAP_USER_ID}" data-type="game" data-map-name="{games.MAP_NAME}" data-x="{games.MAP_START_X}" data-y="{games.MAP_START_Y}" style="padding-left: 10px;" nohref data-nopush data-link='{"parent":"play","trgt":".mosha-container","bpreCall":"loadPlay","call":"startPlay","removeData":true,"closeOverlay":false,"title":"Mosha {S_ONLINE}","popID":"mosha-viewer-{games.MAP_ID}","pop":"1","dialogClass":"mosha-online","width":960,"param":{"map_id":{games.MAP_ID}},"hideH":1,"closeOnEscape":false}' class="noEvents">
						<i class="icon icon-canvas" style="margin: -3px 1px 0px 0;"></i>
						<span class="strong" style="position: relative;">{L_PLAY}</span>
					</span>*/

			break;

		}
	
	};

	$.startGame('init');

	$.calcEfectiveness = function(counterA, counterB, totalRounds) {
	
		var Effectiveness	= 0,
			minRounds		= 10,
			totalRounds		= ( counterA + counterB != totalRounds ) ? counterA + counterB : totalRounds;

		//console.log('calcEfectiveness', counterA, 'counterB', counterB, 'totalRounds', totalRounds);
	
		if ( totalRounds < minRounds ) {
			totalRounds = minRounds;
		}

		if ( counterA >= counterB )
		{
			Effectiveness = ( ( counterA - counterB ) / totalRounds ) * 100;
		}
		else {
			Effectiveness = 0;
		}
		
		return Math.round(Effectiveness);
	
	};

	$.randomiZeDices = function(number) {

			var randNumberA = $.getRandomInt( 1, Math.max( 2, Math.abs( number - 1 ) ) ), //Un numero siempre menor al Numero Original.
				randNumberB = $.getRandomInt( number + 1, number + 50 ), //Un numero siempre mayor al Numero Original.
				randNumberC = $.getRandomInt( Math.max( 0, Math.abs( number - 49 ) ), number + 49 ); 

			if ( randNumberA == number ) {
				randNumberA = $.getRandomInt( 1, Math.max( 2, Math.abs( number - 1 ) ) ); //Un numero siempre menor o mayor al Numero Original pero no el Numbero Original.
			}
			if ( randNumberB == number ) {
				randNumberB = $.getRandomInt( number + 1, number + 50 ); //Un numero siempre menor o mayor al Numero Original pero no el Numbero Original.
			}
			if ( randNumberC == number ) {
				randNumberC = $.getRandomInt( Math.max( 0, Math.abs( number - 49 ) ), number + 49 ); //Un numero siempre menor o mayor al Numero Original pero no el Numbero Original.
			}
		
		return { randNumberA: randNumberA, randNumberB: randNumberB, randNumberC: randNumberC };
	};


});