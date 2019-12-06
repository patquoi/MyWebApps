 /*
  
  File:Motissimax.js
  Abstract: JavaScript for the index.html file
  
  Version: <2.3>
  
  Copyright (C) 2012 Patrice Fouquet. All Rights Reserved.
 
 */ 

/* 
Version 1.1 : 
 - clic instead of click
 - stVersion
Version 1.2 :
 - online definitions
Version 1.2.2
 - definition website link update (1mot.fr)
Version 2.0 
 - Lifting
Version 2.1
 - ODS7
Version 2.2
 - Le nombre de mots n'est plus stocké (numberOfWord) mais calculé à la volée
Version 2.3
 - ODS8
*/

// ---------
// Constants
// ---------

const stVersion = '2.3'; // v1.1
const stVerDico = '8'; // v2.1

// Font of letters : Arial Rounded MT bold. Size 35 (green/red/gray).
// Version 2.0 : NoteWorthy Bold 48

// Keyboard dimensions
const numberOfColumnsK = 10;
const numberOfRowsK = 3;

// Help dimensions
const numberOfColumnsH = 10;
const numberOfRowsH = 12; // vMax : +3

// Grid dimensions
const numberOfColsMin = 5;
const numberOfColsMax = 12; // vMax : more letters (9 & 10). = wordLengthMax + 2 (score or mark)
const numberOfRowsMax = 10; // vMax : 7 -> 10 !
const wordLengthMin   = 5;
const wordLengthMax   = 10; // vMax : more letters (9 & 10)
const letterSize	  = 60; // vMax (new const). 32 -> 60

// setAttributes properties (vMax)
const attId		= 'id';
const attSrc    = 'src';
const attHeight = 'height';
const attWidth  = 'width';

// Interface IDs
const alphabet  = '_$ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const keyboard  = 'AZERTYUIOPQSDFGHJKLM£WXCVBN09!';
const mark      = 'xmbpd'; 
const pngFolder = 'png/';
const pngExt	= '.png';

// Keyboard IDs
const infoRAZId = 29;
const strengthId = 13;
const dspFndLtrsId = 3;
const mstrmndMdId = 19;
const dspDblBPLId = 22;

// Level definitions by Strength
const strengthCount = 5; // (very easy, easy, medium, difficult, very difficult)
const strengthShortLabel = new Array ('très facile', 'facile', 'moyenne', 'difficile', 'très difficile');
const strengthLabel = new Array ('Très facile (verte)', 'Facile (bleue)', 'Moyenne (grise)', 'Difficile (orange)', 'Très difficile (rouge)');
const wordLengthByStrength = new Array (new Array (5,5,6,6,7,7,8,8,9,9,10,10), // vMax : more letters (9 & 10) : +4 levels
     						 			new Array (5,5,6,6,7,7,8,8,9,9,10,10), // vMax : more letters (9 & 10) : +4 levels
     						 			new Array (5,5,6,6,7,7,8,8,9,9,10,10), // vMax : more letters (9 & 10) : +4 levels
     						 			new Array (5,5,6,6,7,7,8,8,9,9,10,10), // vMax : more letters (9 & 10) : +4 levels
     						 			new Array (5,5,6,6,7,7,8,8,9,9,10,10));// vMax : more letters (9 & 10) : +4 levels
const initialByStrength = new Array (new Array (1,1,1,1,1,1,1,1,1,1,1,1), // vMax : more letters (9 & 10) : +4 levels
									 new Array (1,1,1,1,1,1,1,0,1,0,1,0), // vMax : more letters (9 & 10) : +4 levels
									 new Array (1,0,1,0,1,0,1,0,1,0,1,0), // vMax : more letters (9 & 10) : +4 levels
									 new Array (1,0,1,0,1,0,0,0,0,0,0,0), // vMax : more letters (9 & 10) : +4 levels
									 new Array (0,0,0,0,0,0,0,0,0,0,0,0));// vMax : more letters (9 & 10) : +4 levels
const finalByStrength = new Array (new Array (1,0,1,0,1,0,1,0,1,0,1,0), // vMax : more letters (9 & 10) : +4 levels
								   new Array (1,0,1,0,1,0,0,0,0,0,0,0), // vMax : more letters (9 & 10) : +4 levels
								   new Array (0,0,0,0,0,0,0,0,0,0,0,0), // vMax : more letters (9 & 10) : +4 levels
								   new Array (0,0,0,0,0,0,0,0,0,0,0,0), // vMax : more letters (9 & 10) : +4 levels
								   new Array (0,0,0,0,0,0,0,0,0,0,0,0));// vMax : more letters (9 & 10) : +4 levels
const suffixImgStrength = 'bcpfm';

// Dictionary. v2.2 :dico[x].length instead of numberOfWords[x]
// const numberOfWords 		= new Array (7645, 17318, 31070, 46329, 57467, 60487); // vMax : more letters (9 & 10) 

// v1.2: inline dictionaries
const nbDicosDef		 = 5;
const nomDico			 = ['Centre National de Ressources Textuelles et Lexicales', 'Wiktionnaire', 'Larousse', 'Reverso', '1mot.fr'];
const lnkDico			 = ['http://www.cnrtl.fr/definition/', 'http://fr.wiktionary.org/w/index.php?search=', 'http://www.larousse.fr/dictionnaires/francais/', 'http://dictionnaire.reverso.net/francais-definition/', 'http://1mot.fr/'];
const lnkId			 	 = 'll';

// ---------
// Variables
// ---------

var level = 0;
var numberOfColumnsG; 
var numberOfRowsG; 

var grid = [];
var answer = []; // 0=x (bad word) 1=m (bad placed) 2=b (good placed) 3=p (bad letter) 4=d (double bad placed)
var goodPlaces = []; // in Mastermind mode only
var badPlaces = []; // in Mastermind mode only
var validWord = [];

var rownum = 0;
var colnum = 0;

var word = '__________'; // vMax : more letters (9 & 10)

// Interface
var allowClicks = false;
var helpShown = false;
var gameSaved = 'Y'; // indicates game datas saved
var gameLoaded = false; 
var gameOver = false;   

// Flags
var resetGameRequest = false;
var resetStatsRequest = false;
var resetOptionsRequest = false;

// Scores
var roundScore = 0;
var gameScore = 0;

// Options
var optionShowSolution = false; // /!\ WARNING /!\ not stored in localSession. Used for debugging only

// Current game options
var currentStrength = 0;
var currentOptionShowFoundLetters = true;
var currentOptionMastermindMode = false;
var currentOptionShowDoubleBadPlacedLetters = true; 

// /!\ not only initial and final given letters
var initialPos = 0; var finalPos = 0;

// ---------
// Functions
// ---------

function loadGame() 
{
	level = parseInt(localStorage.level, 10);
	numberOfColumnsG = parseInt(localStorage.numberOfColumnsG, 10);
	numberOfRowsG = parseInt(localStorage.numberOfRowsG, 10);

	grid = new Array(numberOfColumnsG);
	answer = new Array(numberOfColumnsG);
	for( var x = 0; x < numberOfColumnsG; x++ ) {
		grid[x] = new Array(numberOfRowsG);
		answer[x] = new Array(numberOfRowsG);
		for( var y = 0; y < numberOfRowsG; y++ ) {
			grid[x][y] = parseInt(localStorage.getItem('grid'+x+y), 10);
			answer[x][y] = parseInt(localStorage.getItem('answer'+x+y), 10);
		}
	}
	for( var y = 0; y < numberOfRowsG; y++) {
		goodPlaces[y] = parseInt(localStorage.getItem('goodPlaces'+y), 10);
		badPlaces[y] = parseInt(localStorage.getItem('badPlaces'+y), 10); 
		validWord[y] = (localStorage.getItem('validWord'+y) == 'true');
	}

	rownum = parseInt(localStorage.rownum, 10);
	colnum = parseInt(localStorage.colnum, 10);
		
	word = localStorage.word;
		
	roundScore = parseInt(localStorage.roundScore, 10);
	gameScore = parseInt(localStorage.gameScore, 10);
		
	currentStrength = parseInt(localStorage.currentStrength, 10);
	currentOptionShowFoundLetters = (localStorage.currentOptionShowFoundLetters.toString() == 'true');
	currentOptionMastermindMode = (localStorage.currentOptionMastermindMode.toString() == 'true');
    
    currentOptionShowDoubleBadPlacedLetters = true;
    if (localStorage.getItem('currentOptionShowDoubleBadPlacedLetters'))
        currentOptionShowDoubleBadPlacedLetters = (localStorage.currentOptionShowDoubleBadPlacedLetters.toString() == 'true');
    
    // /!\ not only initial & final given letters 
    initialPos = 0; finalPos = 0;
    if (localStorage.getItem('initialPos')) {
        initialPos = parseInt(localStorage.initialPos, 10);
        finalPos = parseInt(localStorage.finalPos, 10);
    }
    else {
        if (finalByStrength[currentStrength][level])
            finalPos = wordLengthByStrength[currentStrength][level] - 1;
    }
    
	gameOver = (localStorage.gameOver.toString() == 'true');
	gameLoaded = true;
}

function resetOptions(refresh)
{
	localStorage.clear();	
	localStorage.saved = 'Y';
	localStorage.strength = 0; // easy (green) by default
	localStorage.optionShowFoundLetters = true; // letters found are shown in the next line by default
	localStorage.optionMastermindMode = false; // Mastermind mode
	localStorage.optionShowDoubleBadPlacedLetters = true; 
    if (refresh) refreshKeyboard();
}

function defineOptions()
{
	if (!localStorage.getItem('saved'))
		resetOptions(false);
}

//Remove all elements of the grid
function removeAllChildren(parent)
{
	while (parent.hasChildNodes()) {
		parent.removeChild(parent.firstChild);
	}
}

//Reset the grid
function resetGrid()
{
	grid = new Array(numberOfColumnsG);
	answer = new Array(numberOfColumnsG);
	for( var x = 0; x < numberOfColumnsG; x++ ) {
		grid[x] = new Array(numberOfRowsG);
		answer[x] = new Array(numberOfRowsG);
		for( var y = 0; y < numberOfRowsG; y++ ) {
			grid[x][y] = ((y==0)?1:0);
			answer[x][y] = 0;
			localStorage.setItem('grid'+x+y, grid[x][y]);
			localStorage.setItem('answer'+x+y, answer[x][y]);
		}
	}
	for( var y = 0; y < numberOfRowsG; y++) {
		goodPlaces[y] = 0;
		badPlaces[y] = 0; 
		validWord[y] = false;
		localStorage.setItem('goodPlaces'+y, goodPlaces[y]);
		localStorage.setItem('badPlaces'+y, badPlaces[y]);
		localStorage.setItem('validWord'+y, validWord[y]);
	}
}

function doStats(Action, TheLastGameIsWon)
{
	var bestScore = 0; 
	var gamesPlayed = 0; 
	var gamesWon = 0; 
	var levelsPlayed = 0;
	var levelsWon = 0; 
	
	if (Action != 'reset') {
		// Reading Stats...
		if (localStorage.getItem('gamesPlayed')) {
			bestScore = localStorage.getItem('bestScore');
			gamesPlayed = localStorage.getItem('gamesPlayed'); 
			gamesWon = localStorage.getItem('gamesWon'); 
			levelsPlayed = localStorage.getItem('levelsPlayed'); 
    		levelsWon = localStorage.getItem('levelsWon'); 
		}
	}

	if (Action == 'display') { 
		var statsAndBestScoresMsg = 
            'Parties jouées : ' + gamesPlayed.toString() + '\ndont ' + gamesWon.toString() + ' gagnée' + ((gamesWon>1)?'s':'') + (gamesPlayed?(' (' + (Math.round((100*gamesWon)/gamesPlayed)) +'%)'):'') + '.\n\n' +
			'Niveaux joués : ' + levelsPlayed.toString() + '\ndont ' + levelsWon.toString() + ' gagné' + ((levelsWon>1)?'s':'') + (levelsPlayed?(' (' + (Math.round((100*levelsWon)/levelsPlayed)) +'%)'):'') + '.\n\n' +
			'Meilleur score : ' + bestScore.toString() + '.'; 
		alert('Statistiques\n\n'+statsAndBestScoresMsg);
	}
	
	if (Action == 'update') {

		// Games...
		gamesPlayed++; 
		if (gameScore > bestScore) bestScore = gameScore;
		if (TheLastGameIsWon) {
			gamesWon++; 
		}
		
		// Levels...
		for(var i = 0; i < level; i++) {
			levelsPlayed++;
			levelsWon++; 
		}
		levelsPlayed++;
		if (TheLastGameIsWon) levelsWon++; 

		localStorage.setItem('bestScore', bestScore); 
		localStorage.setItem('gamesPlayed', gamesPlayed);
		localStorage.setItem('gamesWon', gamesWon); 
		localStorage.setItem('levelsPlayed', levelsPlayed); 
		localStorage.setItem('levelsWon', levelsWon); 
	}
	
	if (Action == 'reset') {
		localStorage.removeItem('bestScore'); 
		localStorage.removeItem('gamesPlayed');
		localStorage.removeItem('gamesWon');
		localStorage.removeItem('levelsPlayed');
		localStorage.removeItem('levelsWon');
	}
}
	

function showSolution(show)
{
	for( var x = 0; x < numberOfColumnsG; x++) {
		var newSrc;
		if (show) {
			newSrc = pngFolder+word[x]+'b'+pngExt;
			
			// v1.2: activating definitions website links here...
			document.links[lnkId+x].href = lnkDico[x%nbDicosDef] + word;
			if (x%nbDicosDef==nbDicosDef-1)
				document.links[lnkId+x].href = document.links[lnkId+x].href.toLowerCase() + '.htm'; // v1.2.2 - toLowerCase()
			document.links[lnkId+x].target = '_blank';

		}
		else {
			newSrc = pngFolder+'$b'+pngExt;
		}
    	document.images[x+'_'+(numberOfRowsG+1)].src = newSrc;	
	}
}

function addBlank(row)
{ 
	var colBlank = document.createElement('td');			
	var imgBlank = document.createElement('img');
	imgBlank.setAttribute(attSrc, pngFolder+'_x'+pngExt);
 	imgBlank.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
 	imgBlank.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
 	colBlank.appendChild(imgBlank);
 	row.appendChild(colBlank);						
}

function addScore(row, y)
{ 
	var colScore = document.createElement('td');			
	var imgScore = document.createElement('img');
	imgScore.setAttribute(attSrc, pngFolder+'_x'+pngExt);
	imgScore.setAttribute(attId, 's'+y);
 	imgScore.setAttribute(attWidth, letterSize);
 	imgScore.setAttribute(attHeight, letterSize);
 	colScore.appendChild(imgScore);
 	row.appendChild(colScore);						
}

function addHalfBlankScore(row, y)
{ 
	var colHalfBlankScore = document.createElement('td');			
	var imgHalfBlankScore = document.createElement('img');
	imgHalfBlankScore.setAttribute(attSrc, pngFolder+'_x'+pngExt);
	imgHalfBlankScore.setAttribute(attId, 'hs'+y);
 	imgHalfBlankScore.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
 	imgHalfBlankScore.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
 	colHalfBlankScore.appendChild(imgHalfBlankScore);
 	row.appendChild(colHalfBlankScore);						
}

function changeLevel(newLevel, rowCountToAdd) // if parameters are 0, it's a reset initialization 
{
	if ((newLevel == 0) && (rowCountToAdd == 0)) { 
		
		// game variables
		level = 0;
		gameScore = 0;

 		// options applied
		currentStrength = parseInt(localStorage.strength, 10);
		currentOptionShowFoundLetters = (localStorage.optionShowFoundLetters.toString() == 'true');
		currentOptionMastermindMode = (localStorage.optionMastermindMode.toString() == 'true');

        currentOptionShowDoubleBadPlacedLetters = true;
        if (localStorage.getItem('optionShowDoubleBadPlacedLetters'))
            currentOptionShowDoubleBadPlacedLetters = (localStorage.optionShowDoubleBadPlacedLetters.toString() == 'true');
		
		// level definitions
		numberOfColumnsG = wordLengthByStrength[currentStrength][level]; 
 		numberOfRowsG = (currentOptionMastermindMode?7:5); // vMax : +2 rows for Mastermind mode
 	}
 	else {		
		
		// game variables
		level = newLevel;
		
		// level definitions
 		numberOfColumnsG = wordLengthByStrength[currentStrength][level]; 
 		if (rowCountToAdd > 0) // vMax : one row at a time. Mean of +1 row per level = max of +5 rows
 			numberOfRowsG++;
		if (numberOfRowsG > numberOfRowsMax) { 
			numberOfRowsG = numberOfRowsMax; 
		}
	}
	gameOver = true; // it indicates that a setup() call is needed after the loadGameInProgress() call
	localStorage.gameSaved = gameSaved;	// indicates game datas saved
 	localStorage.gameOver = gameOver; 
	localStorage.level = level;
	localStorage.gameScore = gameScore;
	localStorage.currentStrength = currentStrength;
	localStorage.currentOptionShowFoundLetters = currentOptionShowFoundLetters;
	localStorage.currentOptionMastermindMode = currentOptionMastermindMode;
    localStorage.currentOptionShowDoubleBadPlacedLetters = currentOptionShowDoubleBadPlacedLetters; 
	localStorage.numberOfColumnsG = numberOfColumnsG;
	localStorage.numberOfRowsG = numberOfRowsG;
	
	if (newLevel||rowCountToAdd) { 
		// v1.2: touch word letters to see online definition 
		alert('Niveau réussi !\n\nTouchez une lettre du mot à trouver pour avoir sa définition en ligne.\nTouchez une lettre pour passer au niveau suivant.');
	}
}

function refreshKeyboard()
{
	var keybTable = document.getElementById('keyboard');
	removeAllChildren(keybTable);
	for( var y = 0; y < numberOfRowsK; y++ ) {
		var row = document.createElement('tr');
		addBlank(row); // vMax : more letters (9 & 10). The keyboard is centered (+1 column in each side)
		for( var x = 0; x < numberOfColumnsK; x++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			img.setAttribute('onclick', 'clic('+(10*y+x)+')'); // v1.1
			if (helpShown)  
				switch(10*y+x) {
					case infoRAZId:		
						img.setAttribute(attSrc, pngFolder+'$x'+pngExt);
						break;
					case strengthId:	
						img.setAttribute(attSrc, pngFolder+'F'+suffixImgStrength[parseInt(localStorage.strength, 10)]+pngExt);
						break;
					case dspFndLtrsId:	
						if (localStorage.optionShowFoundLetters.toString() == 'true')
							img.setAttribute(attSrc, pngFolder+'Rb'+pngExt);
						else
							img.setAttribute(attSrc, pngFolder+'Rm'+pngExt);
						break;
                    case dspDblBPLId: 
                        if (localStorage.getItem('optionShowDoubleBadPlacedLetters'))
                            if (localStorage.optionShowDoubleBadPlacedLetters.toString() == 'true')
                                img.setAttribute(attSrc, pngFolder+'Xb'+pngExt);
                            else
                                img.setAttribute(attSrc, pngFolder+'Xm'+pngExt);
                        else
                            img.setAttribute(attSrc, pngFolder+'Xb'+pngExt);
						break;
					case mstrmndMdId:
						if (localStorage.optionMastermindMode.toString() == 'true')
							img.setAttribute(attSrc, pngFolder+'Mb'+pngExt);
						else
							img.setAttribute(attSrc, pngFolder+'Mm'+pngExt);
						break;
					default:
						switch(keyboard[10*y+x]) {
							case 'A':
							case 'C':
							case 'D':
							case 'N':	
							case 'O':
							case 'S':
							case 'Z':
							case '£':
								img.setAttribute(attSrc, pngFolder+keyboard[10*y+x]+'x'+pngExt);
								break;
							default:
								img.setAttribute(attSrc, pngFolder+keyboard[10*y+x]+'y'+pngExt);
								break;
						}
						break;
				}
			else 	
				img.setAttribute(attSrc, pngFolder+keyboard[10*y+x]+'x'+pngExt);
			img.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
			img.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
			col.appendChild(img);
			row.appendChild(col);
		}
		addBlank(row); // vMax : more letters (9 & 10). The keyboard is centered (+1 column in each side)
		keybTable.appendChild(row);
	}
}

// Always show game score
function showGameScore()
{
	if (gameScore > 99) {
		var newExtraGameSrc;
		if (gameScore > 99) 
			newExtraGameSrc = pngFolder+'_'+((gameScore-gameScore%100)/100)+'xx'+pngExt;
		document.images['hs'+(numberOfRowsG+1)].src = newExtraGameSrc;
	}

	var newGameSrc;
	if ((gameScore%100) < 10)
		if (gameScore > 99)
			newGameSrc = pngFolder+'x0'+(gameScore%100)+pngExt;
		else
			newGameSrc = pngFolder+'00'+(gameScore%100)+pngExt;
	else
		newGameSrc = pngFolder+'0'+(gameScore%100)+pngExt;
	document.images['s'+(numberOfRowsG+1)].src = newGameSrc;
}

function showRoundScore()
{
	if (roundScore > 99) {
		var newExtraRoundSrc;
		if (roundScore > 99) 
			newExtraRoundSrc = pngFolder+'_'+((roundScore-roundScore%100)/100)+'xx'+pngExt;
		document.images['hs'+numberOfRowsG].src = newExtraRoundSrc;
	}

	var newRoundSrc;
	if ((roundScore%100) < 10)
		if (roundScore > 99)
			newRoundSrc = pngFolder+'x0'+(roundScore%100)+pngExt;
		else
			newRoundSrc = pngFolder+'00'+(roundScore%100)+pngExt;
	else
		newRoundSrc = pngFolder+'0'+(roundScore%100)+pngExt;
	document.images['s'+numberOfRowsG].src = newRoundSrc;
}

function showLevel(img, x, numberOfLetters)
{
	var i0=Math.floor((wordLengthMax-numberOfLetters)/2);
	var levelNum = level + 1;
	var levelWidth = (levelNum > 9 ? 4 : 3);
	switch(x) {
				case 0: 				img.setAttribute(attSrc, pngFolder + '!d' + pngExt); break;
    			case numberOfLetters-1:	img.setAttribute(attSrc, pngFolder + '!f' + pngExt); break;
    			default:				var di = ((levelWidth % 2) != (numberOfLetters % 2)); 
    									switch(x - Math.floor((numberOfLetters - levelWidth) / 2)) {
    										case 0:		if (di)
    														img.setAttribute(attSrc, pngFolder + '!Niveau13' + pngExt);
    													else
    													img.setAttribute(attSrc, pngFolder + '!Niveau12' + pngExt);
    													break;
    										case 1:		if (di)
    													img.setAttribute(attSrc, pngFolder + '!Niveau23' + pngExt);
    													else
    														img.setAttribute(attSrc, pngFolder + '!Niveau22' + pngExt);
    													break;
    										case 2:		if (di)
    														img.setAttribute(attSrc, pngFolder + '!Niveau33' + pngExt);
    													else
    														img.setAttribute(attSrc, pngFolder + '!' + (levelNum > 9 ? Math.floor(levelNum / 10) : levelNum)   + pngExt);
    													break;
    										case 3:		if (di) 
    														img.setAttribute(attSrc, pngFolder + (levelNum > 9 ? '!' + Math.floor(levelNum / 10) : ('!x' + levelNum))   + pngExt);
    													else
    														img.setAttribute(attSrc, pngFolder + (levelNum > 9 ? ('!x' + Math.floor(levelNum % 10)) : '!m') + pngExt); 
    													break;
    										case 4: 	if (di)
    														img.setAttribute(attSrc, pngFolder + (levelNum > 9 ? ('!x' + Math.floor(levelNum % 10)) : '!m') + pngExt); 
    													else
    														img.setAttribute(attSrc, pngFolder + '!m' + pngExt);
    													break;
    										default:	img.setAttribute(attSrc, pngFolder + '!m' + pngExt); break; 
    									}
    									break;		
    			}
}

//Set up the game on the page using DOM elements
function setup()
{
	var numberOfLetters = wordLengthByStrength[currentStrength][level];
    // v2.2 :dico[x].length instead of numberOfWords[x]	
	// word = dico[numberOfLetters-wordLengthMin][Math.floor(Math.random() * numberOfWords[numberOfLetters-wordLengthMin])];
	word = dico[numberOfLetters-wordLengthMin][Math.floor(Math.random() * dico[numberOfLetters-wordLengthMin].length)];
		
    // /!\ not only initial and final given letters
    initialPos = 0; finalPos = 0;
    if (initialByStrength[currentStrength][level])
        initialPos = Math.floor(Math.random() * numberOfLetters);
    if (finalByStrength[currentStrength][level])
        do
            finalPos = Math.floor(Math.random() * numberOfLetters);
        while(initialByStrength[currentStrength][level] && (initialPos == finalPos)); 
        
	// grid
 	resetGrid();
	
	var gridTable = document.getElementById('grid');
	removeAllChildren(gridTable);
	for( var y = 0; y <= numberOfRowsG + 1; y++ ) {
		var row = document.createElement('tr');
		if (numberOfLetters-wordLengthMin < 5) addBlank(row); // vMax : more letters (9 & 10)
		if (numberOfLetters-wordLengthMin < 3) addBlank(row); // vMax : the grid is now centered
		if (numberOfLetters-wordLengthMin < 1) addBlank(row); 
		for( var x = 0; x < numberOfColumnsG; x++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			if (!y) { // grid & answer is affected here according to the level (initial & final)
				switch(initialByStrength[currentStrength][level] + 2*finalByStrength[currentStrength][level]) {
					case 0: 
						img.setAttribute(attSrc, pngFolder+'$x'+pngExt);
						break;
					case 3: 
						if ((x == initialPos) || (x == finalPos)) {
							img.setAttribute(attSrc, pngFolder+word[x]+'b'+pngExt);
							grid[x][y] = word.charCodeAt(x) - 63; 
							answer[x][y] = 2;
						}
						else
							img.setAttribute(attSrc, pngFolder+'$x'+pngExt);
						break;
					case 2: 
						if (x == finalPos) {
							img.setAttribute(attSrc, pngFolder+word[x]+'b'+pngExt);
							grid[x][y] = word.charCodeAt(x) - 63; 
							answer[x][y] = 2;
						}
						else
							img.setAttribute(attSrc, pngFolder+'$x'+pngExt);
						break;
					case 1: 
						if (x == initialPos) {
							img.setAttribute(attSrc, pngFolder+word[x]+'b'+pngExt);
							grid[x][y] = word.charCodeAt(x) - 63; 
							answer[x][y] = 2;
						}
						else
							img.setAttribute(attSrc, pngFolder+'$x'+pngExt);
						break;
				}
				localStorage.setItem('grid'+x+y, grid[x][y]);
				localStorage.setItem('answer'+x+y, answer[x][y]);			
			}
			else if (y == numberOfRowsG) 
				showLevel(img, x, numberOfLetters); //  vMax : like MotissimoDuo : the level number is centered.
			else 
				img.setAttribute(attSrc, pngFolder+'_x'+pngExt);
			img.setAttribute(attId, x+'_'+y);
			img.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
			img.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
			// v1.2: begin preparing definition website accesses here (disabled)
    		if (y == numberOfRowsG + 1) {
			    var lnk = document.createElement('a');
				lnk.setAttribute('href', '#');
				lnk.setAttribute('target', '_self');
				lnk.setAttribute('id', lnkId+x);
    			lnk.appendChild(img);
    			col.appendChild(lnk);			
    		}
    		else // v1.2: end
				col.appendChild(img);			
			row.appendChild(col);
		}
		addHalfBlankScore(row, y);  
		addScore(row, y);
		if (numberOfLetters-wordLengthMin < 4) addBlank(row); // vMax : more letters (9 & 10)
		if (numberOfLetters-wordLengthMin < 2) addBlank(row); // vMax : the grid is now centered
		gridTable.appendChild(row);
	}

	showGameScore();
	showSolution(optionShowSolution);
	for( var y = numberOfRowsG; y < numberOfRowsMax; y++ ) {
		var row = document.createElement('tr');
		for( var x = 0; x < numberOfColsMax; x++ ) {
			addBlank(row);
		}
		gridTable.appendChild(row);
	}		
	
	refreshKeyboard();
	
	rownum = 0;
	colnum = 0;	

	gameOver = false;
	localStorage.gameOver = gameOver; // it indicates that a setup() call is no more needed after the loadGameInProgress() call
	localStorage.word = word;
	localStorage.rownum = rownum;
	localStorage.colnum = colnum;

	localStorage.initialPos = initialPos;
    localStorage.finalPos = finalPos;
    
	allowClicks=true;
}

// Calculate & show round score
function calcAndShowScore() // if word is found
{ 
	var newRoundSrc;
	roundScore = 0;
	for(var y = 0; y < numberOfRowsG; y++) {
		var lineScore = 0;
		if (y >= rownum - 1) {
			var newLineSrc;
			lineScore = numberOfColumnsG - initialByStrength[currentStrength][level] - finalByStrength[currentStrength][level];
			if (currentOptionMastermindMode)
				roundScore += (lineScore * lineScore);
			else
				roundScore += lineScore;
			if (currentOptionMastermindMode) {
				if (y == rownum - 1)
					newLineSrc = pngFolder+lineScore+'xmt'+pngExt;
				else
					newLineSrc = pngFolder+lineScore+'xce'+pngExt;
				document.images['hs'+y].src = newLineSrc;
			}
			if (y == rownum - 1)
				newLineSrc = pngFolder+'00'+lineScore+'mt'+pngExt;
			else
				newLineSrc = pngFolder+'00'+lineScore+'ce'+pngExt;
			document.images['s'+y].src = newLineSrc;
		}
	}
	
    showRoundScore();
    
	// Game score
	gameScore += roundScore;
	
	localStorage.roundScore = roundScore;
	localStorage.gameScore = gameScore;
	
	showGameScore();
}

//Update image at position represented by (x,y)
function updateCell(x, y)
{
    var newSrc;
	newSrc = pngFolder+alphabet[grid[x][y]]+mark[answer[x][y]]+pngExt;
    document.images[x+'_'+y].src = newSrc;
}

// update image mark in Mastermind mode at position y
function updateMark(y)
{
    var newSrc;
	newSrc = pngFolder+wordLengthByStrength[currentStrength][level]+goodPlaces[y]+badPlaces[y]+pngExt;
    document.images['s'+y].src = newSrc;
}

//Update all images on the grid
function updateAllCells()
{
	for( var y = 0; y < numberOfRowsG; y++ ) {
		for( var x = 0; x < numberOfColumnsG; x++ ) {
			updateCell(x, y);
		}
	}
}

function erasePlace(x)
{
	var y = 0;
	var found = false;
	if (currentOptionShowFoundLetters && 
		(!currentOptionMastermindMode))
		while((!found) && (y<rownum)) {
			found = (mark[answer[x][y]] == 'b');
			if (found) {
				grid[x][rownum] = grid[x][y];
				answer[x][rownum] = answer[x][y];
				localStorage.setItem('grid'+x+rownum, grid[x][y]);
				localStorage.setItem('answer'+x+rownum, answer[x][y]);
			}
			y++;
		}
	if (currentOptionShowFoundLetters) { 
		if (!found) 
			switch(initialByStrength[currentStrength][level] + 2*finalByStrength[currentStrength][level]) {
				case 0: grid[x][rownum] = 1; 
						answer[x][rownum] = 0;
						break;
				case 3: if ((x == initialPos) || (x == finalPos)) {
							grid[x][rownum] = word.charCodeAt(x) - 63; 
							answer[x][rownum] = 2;
						}
						else {
							grid[x][rownum] = 1; 
							answer[x][rownum] = 0;
						}	
						break;
				case 2:	if (x == finalPos) {
							grid[x][rownum] = word.charCodeAt(x) - 63; 
							answer[x][rownum] = 2;
						}
						else {
							grid[x][rownum] = 1; 
							answer[x][rownum] = 0;
						}	
						break;
				case 1: if (x == initialPos) {
							grid[x][rownum] = word.charCodeAt(x) - 63; 
							answer[x][rownum] = 2;
						}
						else {
							grid[x][rownum] = 1; 
							answer[x][rownum] = 0;
						}	
						break;
			
			}
	}
	else {
		grid[x][rownum] = 1; 
		answer[x][rownum] = 0;
	}
	
	localStorage.setItem('grid'+x+rownum, grid[x][rownum]);
	localStorage.setItem('answer'+x+rownum, answer[x][rownum]);

	updateCell(x, rownum);
}

function prepareNextLine()
{
	for( var x = 0; x < numberOfColumnsG; x++) {
		erasePlace(x);
	}
}

function isValidWord()
{
	var numberOfLetters = wordLengthByStrength[currentStrength][level];
	var wordnum = 0;
	var found = false;
	
	// v2.2 :dico[x].length instead of numberOfWords[x]	
	// while((!found)&&(wordnum < numberOfWords[numberOfLetters-wordLengthMin])) { 
	while((!found)&&(wordnum < dico[numberOfLetters-wordLengthMin].length)) { 
        found = (alphabet[grid[0][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][0]) &&
                (alphabet[grid[1][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][1]) &&
                (alphabet[grid[2][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][2]) &&
                (alphabet[grid[3][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][3]) &&
                (alphabet[grid[4][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][4]) &&
                ((numberOfLetters-wordLengthMin < 1) || (alphabet[grid[5][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][5])) &&
                ((numberOfLetters-wordLengthMin < 2) || (alphabet[grid[6][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][6])) &&
                ((numberOfLetters-wordLengthMin < 3) || (alphabet[grid[7][rownum]] == dico[numberOfLetters-wordLengthMin][wordnum][7]));
		wordnum++;
	}
 return found;
}


function showWelcome(button)
{
	const message = 'À chaque niveau vous devez découvrir le mot caché en tapant... des mots (noms communs ou verbes conjugués). ' +
					'Le vert signale une lettre bien placée, le rouge une lettre mal placée. ' +
					'Si vous arrivez à trouver le mot, vous passez au niveau suivant un peu plus difficile. ' +
					'Si vous avez économisé au moins un coup, vous en gagnez un supplémentaire au tour suivant (soit 10 max au total).\n' +
					'Pour plus d\'infos, touchez (i) puis ?.';
	const reprise = 'Une partie est toujours en cours.\n\n'+
					'Poursuivez la partie ou\ntouchez RAZ deux fois pour\ncommencer une nouvelle partie.\n\n' +
					'Si vous voulez jouer à deux,\ndécouvrez MotissimoDuo…\nhttp://patquoi.fr/MotissimoDuo.html'; 
	const newgame = 'Vous allez commencer\nune nouvelle partie.\n\n' +
					'Si vous voulez jouer à deux,\ndécouvrez MotissimoDuo…\nhttp://patquoi.fr/MotissimoDuo.html'; 
	
	if (gameLoaded && (button!='OK')) { 
		if ((!level)&&(!rownum)&&(!colnum)) {
			alert('Bienvenue dans Motissimax\n\n'+newgame);
		}
		else {
			alert('Bienvenue dans Motissimax\n\n'+reprise);
		}		
	}
	else {
		alert('Bienvenue dans Motissimax\n\n'+message);
	}
}

function showGameOver()
{
	for( var x = 0; x < (currentOptionMastermindMode?8:10); x++) {
		var newSrc;
		if (currentOptionMastermindMode)
			switch(x) {
				case 0:
					newSrc = pngFolder+'!d'+pngExt;
					break;
				case 1: 
					newSrc = pngFolder+'!B'+pngExt;
					break;
				case 2:
					newSrc = pngFolder+'!R'+pngExt;
					break;
				case 3:
					newSrc = pngFolder+'!A'+pngExt;
					break;
				case 4:
					newSrc = pngFolder+'!V'+pngExt;
					break;
				case 5:
					newSrc = pngFolder+'!O'+pngExt;
					break;
				case 6:
					newSrc = pngFolder+'!!'+pngExt;
					break;
				case 7: 
					newSrc = pngFolder+'!f'+pngExt; 
					break;
				default:
					newSrc = pngFolder+'!m'+pngExt; 
					break;
			}		
		else
			switch(x) {
				case 0:
					newSrc = pngFolder+'!d'+pngExt;
					break;
				case 2: // vMax : more letters (9 & 10) : +1
					newSrc = pngFolder+'!B'+pngExt;
					break;
				case 3:
					newSrc = pngFolder+'!R'+pngExt;
					break;
				case 4:
					newSrc = pngFolder+'!A'+pngExt;
					break;
				case 5:
					newSrc = pngFolder+'!V'+pngExt;
					break;
				case 6:
					newSrc = pngFolder+'!O'+pngExt;
					break;
				case 7:
					newSrc = pngFolder+'!!'+pngExt;
					break;
				case 9: // vMax : more letters (9 & 10) : +1
					newSrc = pngFolder+'!f'+pngExt; 
					break;
				default: // vMax : more letters (9 & 10). !m between !d and !B or between !! and !f. 
					newSrc = pngFolder+'!m'+pngExt; 
					break;
			}		
    	document.images[x+'_'+numberOfRowsG].src = newSrc;
	}
	changeLevel(0, 0);	
}

function markProposition()
{	
	var found = 0;
	var changeStrength = false; 
	
	if (isValidWord()) {		
		var wordDone = new Array (false, false, false, false, false, false, false, false); 
		var gridDone = new Array (false, false, false, false, false, false, false, false); 
		badPlaces[rownum] = 0;
		goodPlaces[rownum] = 0;
		validWord[rownum] = true;
		for( var x = 0; x < numberOfColumnsG; x++) {
			if (alphabet[grid[x][rownum]] == word[x]) {
				if (currentOptionMastermindMode) {
					goodPlaces[rownum]++;
					if (((x == initialPos) && initialByStrength[currentStrength][level]) ||
						((x == finalPos) && finalByStrength[currentStrength][level]))
						answer[x][rownum] = 2; // good place for initial or final given letters						
					else
						answer[x][rownum] = 3;
				}
				else
					answer[x][rownum] = 2; // good place
				updateCell(x, rownum);
				wordDone[x] = true;
				gridDone[x] = true;
				found++;
			}
			else {
				answer[x][rownum] = 3; // not placed by default
				updateCell(x, rownum);
			}
			localStorage.setItem('answer'+x+rownum, answer[x][rownum]);
		}
		for( var x = 0; x < numberOfColumnsG; x++) {
			for( var y = 0; y < numberOfColumnsG; y++) { 
				if ((!gridDone[x]) && 
					(!wordDone[y]) && 
					(alphabet[grid[x][rownum]] == word[y]) && 
					(x != y)) {
					
					if (currentOptionMastermindMode) {
						badPlaces[rownum]++;
						answer[x][rownum] = 3;
					}
					else
						answer[x][rownum] = 1; // bad place
					if (!currentOptionMastermindMode)
						updateCell(x, rownum);
					gridDone[x] = true;
					wordDone[y] = true;
				}
			}
			localStorage.setItem('answer'+x+rownum, answer[x][rownum]);
		}
        
        if (currentOptionShowDoubleBadPlacedLetters && (!currentOptionMastermindMode)) 
            for( var y = 0; y < numberOfColumnsG; y++) {
                for( var x = 0; x < numberOfColumnsG; x++) { 
                    if (!wordDone[y]) {
                    // letter not marked: potential double bad placed letter
                        if ((alphabet[grid[x][rownum]] == word[y]) && 
                            (x != y) &&
                            (answer[x][rownum] == 1)) {
                            
                            answer[x][rownum] = 4; // Double bad placed !
                            updateCell(x, rownum);
                            wordDone[y] = true;
                            localStorage.setItem('answer'+x+rownum, answer[x][rownum]);
                        }
                    }
                }
            }
        
		if (currentOptionMastermindMode) { // display Mastermind flag in the score place
			if (goodPlaces[rownum] == numberOfColumnsG) // if word found then display all green letters
				for( var x = 0; x < numberOfColumnsG; x++) {
					answer[x][rownum] = 2;
					localStorage.setItem('answer'+x+rownum, answer[x][rownum]);
					updateCell(x, rownum);
				}
			updateMark(rownum);
		}
	}
			
	localStorage.setItem('goodPlaces'+rownum, goodPlaces[rownum]);
	localStorage.setItem('badPlaces'+rownum, badPlaces[rownum]);
	localStorage.setItem('validWord'+rownum, validWord[rownum]);

 	colnum = 0;
 	rownum++;

	localStorage.colnum = colnum;
	localStorage.rownum = rownum;
 	
	if ((rownum == numberOfRowsG) || (found == numberOfColumnsG)) { // Last line or the solution is found 
 		showSolution(true);
		allowClicks = false; // need a setup() call
		if (found == numberOfColumnsG) { // Solution found?
 			calcAndShowScore();
			if (level < (currentOptionMastermindMode?7:11)) {
				changeLevel(level + 1, numberOfRowsG-rownum);
 				return;
 			}
 			else {
		 		doStats('update', true);
				showGameOver();
				var lastStrength = currentStrength; 
				if (currentOptionMastermindMode && (currentStrength + 1 == strengthCount)) 
					changeStrength = false; // Post Change due to autosave
				else { 
					changeStrength = true;  // Post Change due to autosave
					if (currentStrength + 1 < strengthCount) {
						currentStrength++;
						localStorage.strength = currentStrength;
		 			}
					else {
						if (!currentOptionMastermindMode) {
							currentStrength = 0;
							currentOptionMastermindMode = true;
							localStorage.strength = currentStrength;
							localStorage.optionMastermindMode = currentOptionMastermindMode;			
						}
					}
				} 
				changeLevel(0, 0);
				// Post Change due to autosave
				if (!changeStrength) {
					alert('Vous avez terminé une partie de force '+strengthShortLabel[currentStrength]+' !\n\nTouchez une lettre pour commencer une nouvelle partie.');
				}
				else { 
					alert('Vous avez terminé une partie de force '+strengthShortLabel[lastStrength]+' !\n\nVous passez automatiquement à la force suivante.\n\nTouchez une lettre pour commencer une nouvelle partie.');
				}
				return;
 			}
 		}
 		else {
			doStats('update', false);
 			changeLevel(0, 0);
			// v1.2: touch word letters to see online definition
			alert('Vous avez échoué !\n\nTouchez une lettre du mot à trouver pour avoir sa définition en ligne.\nTouchez une lettre pour recommencer une nouvelle partie.');
 			return;
 		}
 	}  	 
 	else {
 		prepareNextLine();
 		return;
 	}   			    
}

function showHelp()
{
	var helpTable = document.getElementById('grid');
	removeAllChildren(helpTable);
	for( var x = 0; x < numberOfRowsH; x++ ) {
		var row = document.createElement('tr');
		addBlank(row); // vMax : more letters (9 &10)
		for( var y = 0; y < numberOfColumnsH; y++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			if ((!x)||(x>9)) // vMax : 3 more lines (1 at the top and 2 at the end)
				img.setAttribute(attSrc, pngFolder+'_x'+pngExt);
			else
				img.setAttribute(attSrc, pngFolder+(x-1)+''+y+pngExt); // vMax : shifted 1 row down
			img.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
			img.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
			col.appendChild(img);
			row.appendChild(col);
		}
		addBlank(row); // vMax : more letters (9 &10)
		helpTable.appendChild(row);
	}
	helpShown = true;
	refreshKeyboard();
}

function returnToGame()
{
	var numberOfLetters = wordLengthByStrength[currentStrength][level];
	var gridTable = document.getElementById('grid');
	
	removeAllChildren(gridTable);
	
	for( var y = 0; y <= numberOfRowsG + 1; y++ ) {
		var row = document.createElement('tr');
		if (numberOfLetters-wordLengthMin < 5) addBlank(row); // vMax : more letters (9 & 10)
		if (numberOfLetters-wordLengthMin < 3) addBlank(row); // vMax : the grid is now centered 
		if (numberOfLetters-wordLengthMin < 1) addBlank(row); 
		for( var x = 0; x < numberOfColumnsG; x++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			if (y == numberOfRowsG)  //  vMax : like MotissimoDuo : the level number is centered.
				showLevel(img, x, numberOfLetters);
			else
				if (y < numberOfRowsG)
					img.setAttribute(attSrc, pngFolder+alphabet[grid[x][y]]+mark[answer[x][y]]+pngExt);
				else 
					img.setAttribute(attSrc, pngFolder+'_x'+pngExt);
			img.setAttribute(attId, x+'_'+y);
			img.setAttribute(attWidth, letterSize); // vMax : 32 -> 60
			img.setAttribute(attHeight, letterSize); // vMax : 32 -> 60
			// v1.2: begin preparing definition website accesses here (disabled)
    		if (y == numberOfRowsG + 1) {
			    var lnk = document.createElement('a');
				lnk.setAttribute('href', '#');
				lnk.setAttribute('target', '_self');
				lnk.setAttribute('id', lnkId+x);
    			lnk.appendChild(img);
    			col.appendChild(lnk);			
    		}
    		else // v1.2: end
				col.appendChild(img);			
			row.appendChild(col);
		}
		addHalfBlankScore(row, y);  
		addScore(row, y);
		if (numberOfLetters-wordLengthMin < 4) addBlank(row); // vMax : more letters (9 & 10)
		if (numberOfLetters-wordLengthMin < 2) addBlank(row); // vMax : the grid is now centered 
		gridTable.appendChild(row);
		if (currentOptionMastermindMode && validWord[y] && (y < rownum))
			updateMark(y);
	}
	
	showGameScore();
	showSolution(optionShowSolution);
	
	for( var y = numberOfRowsG; y < numberOfRowsMax; y++ ) {
		var row = document.createElement('tr');
		for( var x = 0; x < numberOfColsMax; x++ ) {
			addBlank(row);
		}
		gridTable.appendChild(row);
	}			
	helpShown = false;
	refreshKeyboard();
}

function loadGameInProgress()
{
	if (localStorage.getItem('gameSaved')) {
		loadGame();
		if (gameOver) {
			setup();
		}
		else {
			returnToGame();
			allowClicks = true;
		}
	}
	else {
		changeLevel(0, 0);
		setup();
	}
}

function clic(x)
{ 	
	const warning =	'Êtes-vous sûr(e) de vouloir recommencer une nouvelle partie ?\n\nPour confirmer, veuillez\nà nouveau toucher RAZ.';
	const solution= 'Le mot à trouver était...\n';
	const options = '? = À propos, A = Aide, O = Options\n' +
					'C = aide Comptage des points\n' +
					'N = aide Niveaux & forces\n' +
					'S = Statistiques et records\n' +
					'F°= Force, M°= Mode Mastermind\n' +
					'R°= Rappel des lettres bien placées\n' +
                    'X°= lettres mal placées deuX fois\n' +
					'D*= options par Défaut\n' + 
					'Z*= remise à Zéro des statistiques\n\n' +
					'(*) Nécessite une confirmation.\n' +
					'(°) La couleur renseigne sur l\'état.'; 
	const countHelp='À chaque niveau, le score est égal à\n' +
					'(Nb lettres du mot à trouver -\nNb lettres données) x\n' +
					'(Nombre de coups économisés + 1).\n\n' +
					'Exemple : un mot de 5 lettres avec 2 lettres données trouvé en 3 coups sur 7 possibles donne...\n' +
					'(5 - 2) x (7 - 3 + 1) = 15 points.\n\n' +
					'En mode Mastermind le score par ligne est multiplié par lui-même.'; 
	const levelHelp='Quelle que soit la force de la partie, il y a 12 niveaux avec des mots de 5 à 10 lettres.\n\n' +
					'Pour changer de force, touchez F jusqu\'à la force souhaitée.';

	// v2.1 : on recalcule le nombre de mots
	var n=0;
	for(var i=0; i<dico.length; i++)
		n+=dico[i].length;
	var info    =	'Motissimax version '+stVersion+'\n' +
					'Développé par Patrice Fouquet\n\n' +
					'http://patquoi.fr/Motissimax.html\nmotissimax@patquoi.fr\n\n' +
					'Découvrez MotissimoDuo !\nhttp://patquoi.fr/MotissimoDuo.html\n\n' +
					'Dictionnaire : '+n+' mots (ODS'+stVerDico+')\n\n' + // v2.1: ajout de n et stVerDico
					'Touchez O pour avoir\ntoutes les options & infos.';

	// Out of keyboard
	if (keyboard[x] == '_') return;
	
	if (!allowClicks) {
		setup();
		return;
	}
	
	// Actions on help screen
	if (helpShown) {
		switch(keyboard[x]) {
			case 'A':	
				showWelcome('OK');
				break;
			case 'C':
				alert('Comptage des points\n\n'+countHelp);
				break;
			case 'D': 
				if (resetOptionsRequest) {
					resetOptions(true);
					alert('Réinitialisation des options\n\nLes options ont été remises par défaut.');
					resetOptionsRequest = false;
				}
				else { 
					alert('Réinitialisation des options\n\nÊtes-vous sûr(e) de vouloir remettre les options par défaut et réinitialiser records, stats et partie en cours ?\n\nPour confirmer ce choix,\ntouchez à nouveau D.');
					resetOptionsRequest = true;
				}
				break;
			case 'M':
				localStorage.optionMastermindMode = !(localStorage.optionMastermindMode.toString() == 'true');
				refreshKeyboard();
				if (localStorage.optionMastermindMode.toString() == 'true')
					alert('Mode Mastermind\n\nMode activé.\n\nSeul le nombre de lettres bien ou mal placées est indiqué (sauf pour les lettres données).\nLe nombre de coups est maximal.\nLe score par ligne est\nmultiplié par lui-même.\n\nAttention : cette option sera appliquée à la prochaine partie.');
				else
					alert('Mode Mastermind\n\nMode désactivé.\n\nLes lettres bien ou mal placées sont indiquées (mode par défaut).\n\nAttention : cette option sera appliquée à la prochaine partie.');
				break;
			case 'N':	
				alert('Niveaux & Forces\n\n'+levelHelp);
				break;
			case 'O':	
				alert('Options\n\n'+options);
				break;
			case 'R':
				localStorage.optionShowFoundLetters = !(localStorage.optionShowFoundLetters.toString() == 'true');
				refreshKeyboard();
				if (localStorage.optionShowFoundLetters.toString() == 'true')
					alert('Option de rappel des lettres bien placées\n\nOption activée. Les lettres bien placées seront affichées sur la ligne suivante.\n\nAttention : cette option sera appliquée à la prochaine partie.');
				else
					alert('Option de rappel des lettres bien placées\n\nOption désactivée. Les lettres bien placées trouvées ne seront plus affichées sur la ligne suivante.\n\nAttention : cette option sera appliquée à la prochaine partie.');
				break;
            case 'X': 
                if (!localStorage.getItem('optionShowDoubleBadPlacedLetters'))
                    localStorage.optionShowDoubleBadPlacedLetters = false;
                else
                    localStorage.optionShowDoubleBadPlacedLetters = !(localStorage.optionShowDoubleBadPlacedLetters.toString() == 'true');
				refreshKeyboard();
				if (localStorage.optionShowDoubleBadPlacedLetters.toString() == 'true')
					alert('Option d\'affichage des doubles lettres mal placées\n\nOption activée. Les lettres mal placées deux fois sont indiquées en orange.\n\nAttention : cette option sera appliquée à la prochaine partie.');
				else
					alert('Option d\'affichage des doubles lettres mal placées\n\nOption désactivée. Les lettres mal placées une ou deux fois sont indiquées en rouge.\n\nAttention : cette option sera appliquée à la prochaine partie.');
				break;                
			case 'S':	
				doStats('display', false);
				break;
			case 'F':	
				localStorage.strength = (parseInt(localStorage.strength, 10) + 1) % strengthCount; 
				refreshKeyboard();
				alert('Nouvelle force\n\n'+strengthLabel[parseInt(localStorage.strength, 10)]+'.\n\nAttention : cette force sera appliquée à la prochaine partie.');
				break;
			case 'Z':
				if (resetStatsRequest) {
					doStats('reset', false);
					alert('Remise à zéro des statistiques et des records\n\nLes statistiques et les records ont été remis à zéro.');
					resetStatsRequest = false;
				}
				else { 
					alert('Remise à zéro des statistiques et des records\n\nÊtes-vous sûr(e) de vouloir remettre à zéro statistiques et records ?\n\nPour confirmer ce choix,\ntouchez à nouveau Z.');
					resetStatsRequest = true;
				}
				break;
			case '£': 
				returnToGame();
				break;
			case '!':
				alert('À propos…\n\n'+info);
				break;
			default: break;	
			}
		if (keyboard[x] != 'Z') 
			resetStatsRequest = false;
		return;
	}
	else { // Out of Help screen (game in progress)
		switch(keyboard[x]) {
			case '!': // RAZ button
				if (resetGameRequest) {
					alert(solution+word+'.');
					changeLevel(0, 0);
					setup();
					resetGameRequest = false;
				}
				else {
					alert('Nouvelle partie\n\n'+warning);
					resetGameRequest = true;
				}
				break;
			case '£': // Help button
				showHelp();
				break;
			case '0': // Erase last letter
				if (colnum > 0) { 
					colnum--; 
					erasePlace(colnum);
				}
				localStorage.colnum = colnum;
				break;
			case '9': // Erase entire row
				for( var y = 0; y < numberOfColumnsG; y++) 
					erasePlace(y);
				colnum = 0; 
				localStorage.colnum = colnum;
				break;
			default: // Other characters = letters!
				var y = 0; 
				while (keyboard[x] != alphabet[y]) 
					y++; 
				grid[colnum][rownum] = y;
				answer[colnum][rownum] = 0;
				updateCell(colnum, rownum);
				localStorage.setItem('grid'+colnum+rownum, grid[colnum][rownum]);
				localStorage.setItem('answer'+colnum+rownum, answer[colnum][rownum]);
				colnum++; 
				localStorage.colnum = colnum;
				if (colnum == numberOfColumnsG)  
					markProposition();
				break;
		}
		if (keyboard[x] != '!') 
			resetGameRequest = false;
		return;
	}
}
