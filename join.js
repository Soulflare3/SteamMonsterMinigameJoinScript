// ==UserScript==
// @name JesterEE's Steam Monster Minigame JoinGame Script
// @namespace  https://github.com/jesteree/SteamMonsterMinigameJoinScript
// @description  Adds a dialog box to the Steam Monster Minigame to join a game of your choice.
// @version    1.2
// @match      http://steamcommunity.com/minigame
// @match      http://steamcommunity.com/minigame/
// @copyright  2015, JesterEE
// @author  JesterEE
// @grant unsafeWindow
// @updateURL https://raw.githubusercontent.com/jesteree/SteamMonsterMinigameJoinScript/master/join.js
// @downloadURL https://raw.githubusercontent.com/jesteree/SteamMonsterMinigameJoinScript/master/join.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////
// CSS
////////////////////////////////////////////////////////////////////////////////

// http://greasemonkey.win-start.de/patterns/add-css.html
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
'.gameidcss {' +
'  background-color: #884691;' +
'  font-family: "Press Start 2P", arial, sans-serif;' +
'  color: #ee7aff;' +
'  border: 2px solid #a554b1;' +
'  font-size: 14px;' +
'  text-align: center;' +
'  display: inline-block;' +
'  box-shadow: 2px 2px 0px #000;' +
'  padding: 4px;' +
'  position: relative;' +
'  top: 50%;' +
'  transform: translateY(-125%);' +
'}');

addGlobalStyle(
'.gameid2css {' +
'  font-family: "Press Start 2P", arial, sans-serif;' +
'  color: #ee7aff;' +
'  font-size: 14px;' +
'  text-align: center;' +
'  display: inline-block;' +
'}');

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////

// Do bad things: http://www.codedisqus.com/CyVkUkVqPX/how-to-call-a-greasemonkey-function-when-a-javascript-link-is-clicked.html
// Hijack the JoinGame() function
var JoinGame_orig = unsafeWindow.JoinGame;
unsafeWindow.JoinGame = function() {
JoinThisGame( )
};


function JoinThisGame(  ) {
    // Removes some errors of the original JoinGame and tries to join again on those occurrences.
    // Removes all non-numeric characters from the Game ID to prevent typing mistakes/inaccuracies.
    // If nothing is entered in the Game ID dialog, the default behavior is preserved.
    var gameid = document.getElementsByName('gameid_input')[0].value;
    gameid = gameid.replace(/\D/g,'')
    document.getElementsByName('gameid_input')[0].value = gameid;
    $J.post('http://steamcommunity.com/minigame/ajaxjoingame/',
            { 'gameid' : gameid }
            ).done( function( json ) {
                if ( json.success == '1' ) {
                    top.location.href = 'http://steamcommunity.com/minigame/towerattack/';
                }
                else {
                    JoinThisGame( gameid )
                }
            }
        	).fail( function( jqXHR )
                   {
                       var responseJSON = jqXHR.responseText.evalJSON();
                       if ( responseJSON.success == '24' && responseJSON.errorMsg ) {
				           ShowAlertDialog( 'Error', responseJSON.errorMsg );
    			       }
	    		       else if ( responseJSON.success == '25' ) {
		    		       ShowAlertDialog( 'Error', 'There was a problem trying to join the game: it already has the maximum number of players.' );
			           }
    			       else {
	    			       JoinThisGame( gameid )
		    	       }
		           }
            );
}

////////////////////////////////////////////////////////////////////////////////
// Update the landing page HTML
////////////////////////////////////////////////////////////////////////////////

var game_div;
try {
    game_div = document.getElementsByClassName('current_game')[0].children[0]
    game_div.outerHTML = '<span class="gameidcss">Game ID: <input name="gameid_input" class="gameid2css" type="text" value="" onkeydown="javascript:JoinGame();"></span></br><a href="javascript:JoinGame();" class="main_btn"><span>Play Sucka!</span><a><p class="start_new">or, <a href="javascript:StartNewGame();">start a new game</a></p>'
}
catch(err) {
        game_div = document.getElementsByClassName('new_game')[0].children[0]
        game_div.outerHTML = '<span class="gameidcss">Game ID: <input name="gameid_input" class="gameid2css" type="text" value="" onkeydown="javascript:JoinGame();"></span></br><a href="javascript:JoinGame();" class="main_btn"><span>Play Sucka!</span><a>'
}

