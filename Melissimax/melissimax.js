/*
  
  File:Melissimax.js
  Abstract: JavaScript for the index.html file
  
  Version: <2.4>
  
  Copyright (C) 2012 Patrice Fouquet. All Rights Reserved.
 
 */ 

/*
Version 1.4
 - Sablier pour l'attente de création de grille
 - Accès aux définitions en ligne de définitions de mots
 - Affichage des pourcentages de mots trouvés dans l'aide contextuelle.
Version 1.5.1
 - Correction du lien vers 1mot.fr
Version 2.0
 - Refonte complète du style avec que la police Noteworthy Light/Bold
 - Affichage des tops avant les stats
 - Affichage du pourcentage dans les scores par rapport au max dans l'aide contextuelle
Version 2.1
 - Affichage des Pourcentages au lieu des max pour score, bonus et total
 - Plus de max dans les tops
Version 2.2
 - ODS7 (+4043 mots)
 - À propos : on compte les mots en temps réel !
Version 2.3.1
 - Site de définitions de mots : 1mot.net au lieu de 1mot.fr
 - Site de définitions de mots par défaut = 1mot.net au lieu de cnrtl
Version 2.4
 - Clic sur les compteurs de mots : on affiche les mots (trouvés/tous si manche terminée)
 - Site de définition de mots : 1mot.net au lieu de 1mot.fr
*/

// ---------
// Constants
// ---------

const stVersion 			= '2.4'; // v1.4
const stVerDico				= '7'; // v1.4

// Font of letters : Arial Rounded MT bold. Size 35 (green/red/gray).

const numberOfCellsBySide 	=  10; // vMax : more letters (9 & 10) 
const numberOfDirections	=  8;
const dirType 				= new buildDirectionType();

// Directions                    /,  N,  NE,  E,  SE,  S, SW,   W, NW  
const dx 					= [  0,  0,   1,  1,   1,  0, -1,  -1, -1 ];
const dy 					= [  0, -1,  -1,  0,   1,  1,  1,   0, -1 ];
const scoreDir              = [  0,  8,   6,  3,   5,  4,  9,   7, 10 ];
const invDir				= [  0,  5,   6,  7,   8,  1,  2,   3,  4 ];  
const stDir					= [ '','N','NE','E','SE','S','SW','W','NW'];

// images 
const pngFolder				= 'png/';
const pngExt				= '.png'; // v1.4
const fond					= '*'; // v1.4
const colorType             = new buildColorType();
const letterColorSuffix     = ['x', 'y', 'p', 'm', 'b'];
const idGrille				= 'grille' // v1.4
const prmDico			 	= 'dico'; // v1.4
const hrefDef			 	= 'def'; // v1.4
const sablier			 	= 'sablier'; // v1.4

// inline dictionaries
const nbDicosDef		 = 5;
const nomDico			 = ['Centre National de Ressources Textuelles et Lexicales', 'Wiktionnaire', 'Larousse', 'Reverso', '1mot.net']; // v2.3.1 : 1mot.net au lieu de 1mot.fr
const pngDico            = ['dico-cnrtl', 'dico-wikti', 'dico-lar', 'dico-reverso', 'dico-1mot'];
const lnkDico			 = ['http://www.cnrtl.fr/definition/', 'http://fr.wiktionary.org/w/index.php?search=', 'http://www.larousse.fr/dictionnaires/francais/', 'http://dictionnaire.reverso.net/francais-definition/', 'http://1mot.net/']; // v2.3.1 : 1mot.net au lieu de 1mot.fr
const idDefPrmImg		 = 'dd';
const idDefLnkImg		 = 'dl';
const idDefLnkLnk		 = 'll';
const extHTM			 = '.htm';
 
// Scores                      5,6,7,8,9,10-letter word
const scoreLen              = [6,5,4,3,2,1]; // word score = scoreLen * scoreDir. vMax : more letters (9 & 10) 

// keyboard
const numberOfButtons       = 3;
const keyboard              = [['*','*','*'], // no action during building grid
                               ['i','a','s'], // (?) (i) (%)
                               ['i','a','s'], // (?) (i) (%)
                               ['m','s','p']] // (-) (%) (+)
 
// Dimensions
const counterDigitWidth         =  20; // vMax : 11 -> 20

const counterDigitHeight		=  25; // vMax : 24 -> 25

const counterSeparatorWidth     =  24; // vMax : 12 -> 24
// const counterMarginWidth     =  32; // vMax : No margin
const wordScoreSeparatorWidth   =  20; // vMax : 42 -> 20
// const wordScoreMarginWidth   =  32; // vMax : No margin
const wordScoreLetterSize       =  50; // vMax : 24 -> 66 ; Width -> Size. v1.4 = 50 

const wordScoreDigitWidth		=  32; // vMax (new const) V1.4 : +12
const wordScoreDigitHeight		=  50; // vMax (new const)
const wordScoreDefPrmWidth		=  100; // v1.4
const wordScoreDefLnkWidth      =  56; // v1.4

const scoreLineHeight           =  40; // vMax (new const) 24 -> 40 (natural)
const pointsGridDigitWidth      =  32; // vMax : 11 -> 32 (natural)
const gridAndChancesDigitWidth  =  32; // vMax : 11 -> 32 (natural)
const pointsGameDigitWidth      =  49; // vMax : 16 -> 49 

const pointsLabelWidth          =  96; // vMax : 58 -> 96 (natural)

const pointsLabelSepWidth       =  20; // vMax (new const)
// const pointsMarginWidth      =  32; // vMax : No margin
const gridAndChancesLabelWidth  =  45; // vMax : 27 -> 45 (natural)

const gridAndChancesLblSepWidth =  26; // vMax (new const)
const buttonWidth               =  66; // vMax : 33 -> 66 

const buttonSeparatorWidth		=  49; // vMax (new const)

const thousandSeparatorWidth    =   2; // vMax (new cons)

// onclick ids
// x=...
// 0~63    => grid 
const wordScoreID               = 100; // wordlist for debugging
const gridLabelID               = 101;
const firstButtonID             = 102; // Buttons = 102/103/104
const firstWordCounterID        = 105; // Word counters = 105 (5), 106 (6), 107 (7), 108 (8). 
// vMax : 109 (9), 110 (10), next IDs are shifted (+2)
const gridScoreID               = 111;
const gridBonusID               = 112;
const gridTotalID               = 113;
const gridNumberID              = 114;
const chancesCounterID          = 115;
const gameScoreID               = 116;
const wordFoundID               = 117;
const dicoDefPrmID				= 118; // v1.4

// chances
const chancesAtTheBeginning     =  10;

// Status
const choiceStatusType      = new buildChoiceStatusType();
const statsAndTopsStatusType= new buildStatsAndTopsStatusType();

const welcomeMessage = 'Vous devez trouver les mots de 5 à 10 lettres cachés dans la grille, horizontalement, verticalement, en diagonale, dans les deux sens.\nAprès chaque mot trouvé, ses lettres se verdissent. La manche est gagnée lorsque toute la grille est verte. Il n\'est pas nécessaire de découvrir tous les mots de la grille mais un bonus est accordé si tous les mots sont découverts.';
// localStorage
const lsGrid				= 'grid'; // v1.4
 
// Dictionary
const minWordLength 		= 5;
const maxWordLength         = 10; // vMax : more letters (9 & 10)
// v2.3: numberOfWords[x] is loaded with dico[x].length in loadGame function
var numberOfWords 		= new Array (0, 0, 0, 0, 0, 0);
// const numberOfWords 		= new Array (7645, 17318, 31070, 46329, 57467, 60487); // vMax : more letters (9 & 10) 

// ---------
// Variables
// ---------

// grid build
var lettersToFind = numberOfCellsBySide * numberOfCellsBySide; // not saved: for building grid only
var grid = []; 
var isGreen = []; 
var words = []; 	// list of words for searching 
var wordPos = []; 	// word infos (x0, y0), direction, found (true/false)
var idxByLength = [0, 0, 0, 0, 0, 0]; // index in words & wordPos of the first entry (0 = 5-letter ; 1 = 6-letter...). vMax : more letters (9 & 10)
var numberOfFound = [0, 0, 0, 0, 0, 0]; // number of words found (0 = 5-letter ; 1 = 6-letter...). vMax : more letters (9 & 10)
var numberToFind = [0, 0, 0, 0, 0, 0]; // number of words to find (0 = 5-letter ; 1 = 6-letter...). vMax : more letters (9 & 10)
var numberOfGreenLetters = 0; // number of green letters of the grid

// scores
var maxGameScore = 0;
var maxGameBonus = 0;
var maxScore = 0;
var maxBonus = 0;
var gameScore = 0;
var gameBonus = 0;
var score = 0;
var bonus = 0;

// game status
var gridNumber = 1;
var chances = chancesAtTheBeginning; 
var status = choiceStatusType.csNoGame;
var xChoice = [-1, -1];
var yChoice = [-1, -1];
var dChoice = dirType.dUndefined;
var lChoice = 0;
var wordChoice = '';
var newGridRequest = false; // not saved but initialized to false in loadGame
var greenMsg = false;       // not saved but initialized to false in loadGame
var selectMsg = false;
var welcomeMsg = false;
var currentSolutionNotFound = -1;
var imgSrcGrilleSvg = ''; // v1.4. Sauvegarde de la png pendant affichage du sablier

// stats & tops
var statsAndTops        = new loadStatsAndTops();
var statsAndTopsStatus  = statsAndTopsStatusType.satsTops; // v2.0 tops avant stats

// Inline Definition dictionaries
var dicoDef = 4; // Par défaut = 1mot.net // v2.3.1
var stDrnMotForme = ''; // Permet d'afficher sa définition (non sauvegardé)
var affichagesChgtDico = 0; // Nombre d'affichages de changement de dico (limité au nombre de dicos). 

// ---------
// Functions
// ---------

function buildDirectionType()
{
	this.dUndefined	= 0;
	this.dN			= 1;
	this.dNE		= 2;
	this.dE			= 3;
	this.dSE		= 4;
	this.dS			= 5;
	this.dSW		= 6;
	this.dW			= 7;
	this.dNW		= 8;
}

function buildWordPosition(x, y, d)
{
	this.x = x;
	this.y = y;
	this.d = d;
    this.found = false;
}

function buildChoiceStatusType()
{
    this.csNoGame                   = 0;
    this.csWaitingForFirstLetter    = 1;
    this.csWaitingForLastLetter     = 2;
    this.csViewingSolutions         = 3;
}

function buildStatsAndTopsStatusType()
{
    this.satsTops                   = 0; // v2.0 inversion
    this.satsStats                  = 1; // v2.0 inversion
    this.satsRequest                = 2;
    this.satsReset                  = 3;
}

function buildColorType()
{
    this.cTransparent   = 0;
    this.cGrayed        = 1;
    this.cGray          = 2;
    this.cRed           = 3;
    this.cGreen         = 4;
}

function loadStatsAndTops()
{
    // methods
    this.registerTops = registerTops;
    this.registerGridStats = registerGridStats;
    this.registerGameStats = registerGameStats;
    this.displayStatsAndTops = displayStatsAndTops;
    this.resetStatsAndTops = resetStatsAndTops;
    // properties
    if (localStorage.getItem('tops')) {
        this.topGridScore       = parseInt(localStorage.topGridScore);
        this.topGridBonus       = parseInt(localStorage.topGridBonus);
        this.topGridTotal       = parseInt(localStorage.topGridTotal);
        this.topGridMaxScore    = parseInt(localStorage.topGridMaxScore);
        this.topGridMaxBonus    = parseInt(localStorage.topGridMaxBonus);
        this.topGridMaxTotal    = parseInt(localStorage.topGridMaxTotal);
        this.topGrid5LWFound    = parseInt(localStorage.topGrid5LWFound);
        this.topGrid6LWFound    = parseInt(localStorage.topGrid6LWFound);
        this.topGrid7LWFound    = parseInt(localStorage.topGrid7LWFound);
        this.topGrid8LWFound    = parseInt(localStorage.topGrid8LWFound);
        this.topGrid9LWFound    = parseInt(localStorage.topGrid9LWFound); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.topGrid10LWFound   = parseInt(localStorage.topGrid10LWFound); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.topGrid5LWToFnd    = parseInt(localStorage.topGrid5LWToFnd);
        this.topGrid6LWToFnd    = parseInt(localStorage.topGrid6LWToFnd);
        this.topGrid7LWToFnd    = parseInt(localStorage.topGrid7LWToFnd);
        this.topGrid8LWToFnd    = parseInt(localStorage.topGrid8LWToFnd);
        this.topGrid9LWToFnd    = parseInt(localStorage.topGrid9LWToFnd); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.topGrid10LWToFnd   = parseInt(localStorage.topGrid10LWToFnd); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        
        this.topGameScore       = parseInt(localStorage.topGameScore);
        this.topGameBonus       = parseInt(localStorage.topGameBonus);
        this.topGameTotal       = parseInt(localStorage.topGameTotal);
        
        this.topGridNumber      = parseInt(localStorage.topGridNumber);
        this.topChances         = parseInt(localStorage.topChances);
    }
    else {
        this.topGridScore       = 0;
        this.topGridBonus       = 0;
        this.topGridTotal       = 0;
        this.topGridMaxScore    = 0;
        this.topGridMaxBonus    = 0;
        this.topGridMaxTotal    = 0;
        this.topGrid5LWFound    = 0;
        this.topGrid6LWFound    = 0;
        this.topGrid7LWFound    = 0;
        this.topGrid8LWFound    = 0;
        this.topGrid9LWFound    = 0; // vMax : more letters (9 & 10)
        this.topGrid10LWFound   = 0; // vMax : more letters (9 & 10)       
        this.topGrid5LWToFnd    = 0;
        this.topGrid6LWToFnd    = 0;
        this.topGrid7LWToFnd    = 0;
        this.topGrid8LWToFnd    = 0;
        this.topGrid9LWToFnd    = 0; // vMax : more letters (9 & 10)
        this.topGrid10LWToFnd   = 0; // vMax : more letters (9 & 10)

        this.topGameScore       = 0;
        this.topGameBonus       = 0;
        this.topGameTotal       = 0;

        this.topGridNumber      = 0;
        this.topChances         = chancesAtTheBeginning;
    }
    if (localStorage.getItem('gridStats')) {
        this.statGrids          = parseInt(localStorage.statGrids);
        this.statGridScore      = parseInt(localStorage.statGridScore);
        this.statGridBonus      = parseInt(localStorage.statGridBonus);
        this.statGridTotal      = parseInt(localStorage.statGridTotal);
        this.statGridMaxScore   = parseInt(localStorage.statGridMaxScore);
        this.statGridMaxBonus   = parseInt(localStorage.statGridMaxBonus);
        this.statGridMaxTotal   = parseInt(localStorage.statGridMaxTotal);
        this.statGrid5LWFound   = parseInt(localStorage.statGrid5LWFound);
        this.statGrid6LWFound   = parseInt(localStorage.statGrid6LWFound);
        this.statGrid7LWFound   = parseInt(localStorage.statGrid7LWFound);
        this.statGrid8LWFound   = parseInt(localStorage.statGrid8LWFound);
        this.statGrid9LWFound   = parseInt(localStorage.statGrid9LWFound); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.statGrid10LWFound  = parseInt(localStorage.statGrid10LWFound); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.statGrid5LWToFnd   = parseInt(localStorage.statGrid5LWToFnd);
        this.statGrid6LWToFnd   = parseInt(localStorage.statGrid6LWToFnd);
        this.statGrid7LWToFnd   = parseInt(localStorage.statGrid7LWToFnd);
        this.statGrid8LWToFnd   = parseInt(localStorage.statGrid8LWToFnd);
        this.statGrid9LWToFnd   = parseInt(localStorage.statGrid9LWToFnd); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
        this.statGrid10LWToFnd  = parseInt(localStorage.statGrid10LWToFnd); // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
    }
    else {
        this.statGrids          = 0;
        this.statGridScore      = 0;
        this.statGridBonus      = 0;
        this.statGridTotal      = 0;
        this.statGridMaxScore   = 0;
        this.statGridMaxBonus   = 0;
        this.statGridMaxTotal   = 0;
        this.statGrid5LWFound   = 0;
        this.statGrid6LWFound   = 0;
        this.statGrid7LWFound   = 0;
        this.statGrid8LWFound   = 0;
        this.statGrid9LWFound   = 0; // vMax : more letters (9 & 10)
        this.statGrid10LWFound  = 0; // vMax : more letters (9 & 10)
        this.statGrid5LWToFnd   = 0;
        this.statGrid6LWToFnd   = 0;
        this.statGrid7LWToFnd   = 0;
        this.statGrid8LWToFnd   = 0;
        this.statGrid9LWToFnd   = 0; // vMax : more letters (9 & 10)
        this.statGrid10LWToFnd  = 0; // vMax : more letters (9 & 10)
    }
    if (localStorage.getItem('gameStats')) {
        this.statGames          = parseInt(localStorage.statGames);
        this.statGameScore      = parseInt(localStorage.statGameScore);
        this.statGameBonus      = parseInt(localStorage.statGameBonus);
        this.statGameTotal      = parseInt(localStorage.statGameTotal);
    }
    else {
        this.statGames          = 0;
        this.statGameScore      = 0;
        this.statGameBonus      = 0;
        this.statGameTotal      = 0;
    }
}

function resetStatsAndTops()
{
    this.topGridScore       = 0;
    this.topGridBonus       = 0;
    this.topGridTotal       = 0;
    this.topGridMaxScore    = 0;
    this.topGridMaxBonus    = 0;
    this.topGridMaxTotal    = 0;
    this.topGrid5LWFound    = 0;
    this.topGrid6LWFound    = 0;
    this.topGrid7LWFound    = 0;
    this.topGrid8LWFound    = 0;
    this.topGrid9LWFound    = 0; // vMax : more letters (9 & 10)
    this.topGrid10LWFound   = 0; // vMax : more letters (9 & 10)
    this.topGrid5LWToFnd    = 0;
    this.topGrid6LWToFnd    = 0;
    this.topGrid7LWToFnd    = 0;
    this.topGrid8LWToFnd    = 0;
    this.topGrid9LWToFnd    = 0; // vMax : more letters (9 & 10)
    this.topGrid10LWToFnd   = 0; // vMax : more letters (9 & 10)

    this.topGameScore       = 0;
    this.topGameBonus       = 0;
    this.topGameTotal       = 0;

    this.topGridNumber      = 0;
    this.topChances         = chancesAtTheBeginning;

    this.statGrids          = 0;
    this.statGridScore      = 0;
    this.statGridBonus      = 0;
    this.statGridTotal      = 0;
    this.statGridMaxScore   = 0;
    this.statGridMaxBonus   = 0;
    this.statGridMaxTotal   = 0;
    this.statGrid5LWFound   = 0;
    this.statGrid6LWFound   = 0;
    this.statGrid7LWFound   = 0;
    this.statGrid8LWFound   = 0;
    this.statGrid9LWFound   = 0; // vMax : more letters (9 & 10)
    this.statGrid10LWFound  = 0; // vMax : more letters (9 & 10)
    this.statGrid5LWToFnd   = 0;
    this.statGrid6LWToFnd   = 0;
    this.statGrid7LWToFnd   = 0;
    this.statGrid8LWToFnd   = 0;
    this.statGrid9LWToFnd   = 0; // vMax : more letters (9 & 10)
    this.statGrid10LWToFnd  = 0; // vMax : more letters (9 & 10)

    this.statGames          = 0;
    this.statGameScore      = 0;
    this.statGameBonus      = 0;
    this.statGameTotal      = 0;
    
    localStorage.removeItem('tops');
    localStorage.removeItem('gridStats');
    localStorage.removeItem('gameStats');
    
    alert('Remise à zéro\n\nLes statistiques et les records ont été remis à zéro.');
}

function registerTops()
{
    if (score                   > this.topGridScore)    { this.topGridScore = score;                    localStorage.topGridScore = score; }
    if (bonus                   > this.topGridBonus)    { this.topGridBonus = bonus;                    localStorage.topGridBonus = bonus; }
    if (score + bonus           > this.topGridTotal)    { this.topGridTotal = score + bonus;            localStorage.topGridTotal = score + bonus; }
    if (maxScore                > this.topGridMaxScore) { this.topGridMaxScore = maxScore;              localStorage.topGridMaxScore = maxScore; }
    if (maxBonus                > this.topGridMaxBonus) { this.topGridMaxBonus = maxBonus;              localStorage.topGridMaxBonus = maxBonus; }
    if (maxScore + 2*maxBonus   > this.topGridMaxTotal) { this.topGridMaxTotal = maxScore + 2*maxBonus; localStorage.topGridMaxTotal = maxScore + 2*maxBonus; }
    if (numberOfFound[0]        > this.topGrid5LWFound) { this.topGrid5LWFound = numberOfFound[0];      localStorage.topGrid5LWFound = numberOfFound[0]; }
    if (numberOfFound[1]        > this.topGrid6LWFound) { this.topGrid6LWFound = numberOfFound[1];      localStorage.topGrid6LWFound = numberOfFound[1]; }
    if (numberOfFound[2]        > this.topGrid7LWFound) { this.topGrid7LWFound = numberOfFound[2];      localStorage.topGrid7LWFound = numberOfFound[2]; }
    if (numberOfFound[3]        > this.topGrid8LWFound) { this.topGrid8LWFound = numberOfFound[3];      localStorage.topGrid8LWFound = numberOfFound[3]; }
    if (numberOfFound[4]        > this.topGrid9LWFound) { this.topGrid9LWFound = numberOfFound[4];      localStorage.topGrid9LWFound = numberOfFound[4]; } // vMax : more letters (9 & 10)
    if (numberOfFound[5]        > this.topGrid10LWFound){ this.topGrid10LWFound = numberOfFound[5];     localStorage.topGrid10LWFound = numberOfFound[5]; } // vMax : more letters (9 & 10)
    if (numberToFind[0]         > this.topGrid5LWToFnd) { this.topGrid5LWToFnd = numberToFind[0];       localStorage.topGrid5LWToFnd = numberToFind[0]; }
    if (numberToFind[1]         > this.topGrid6LWToFnd) { this.topGrid6LWToFnd = numberToFind[1];       localStorage.topGrid6LWToFnd = numberToFind[1]; }
    if (numberToFind[2]         > this.topGrid7LWToFnd) { this.topGrid7LWToFnd = numberToFind[2];       localStorage.topGrid7LWToFnd = numberToFind[2]; }
    if (numberToFind[3]         > this.topGrid8LWToFnd) { this.topGrid8LWToFnd = numberToFind[3];       localStorage.topGrid8LWToFnd = numberToFind[3]; }
    if (numberToFind[4]         > this.topGrid9LWToFnd) { this.topGrid9LWToFnd = numberToFind[4];       localStorage.topGrid9LWToFnd = numberToFind[4]; } // vMax : more letters (9 & 10)
    if (numberToFind[5]         > this.topGrid10LWToFnd){ this.topGrid10LWToFnd = numberToFind[5];      localStorage.topGrid10LWToFnd = numberToFind[5]; } // vMax : more letters (9 & 10)
    if (gameScore               > this.topGameScore)    { this.topGameScore = gameScore;                localStorage.topGridScore = gameScore; }
    if (gameBonus               > this.topGameBonus)    { this.topGameBonus = gameBonus;                localStorage.topGridBonus = gameBonus; }
    if (gameScore + gameBonus   > this.topGameTotal)    { this.topGameTotal = gameScore + gameBonus;    localStorage.topGridTotal = gameScore + gameBonus; }
    if (gridNumber              > this.topGridNumber)   { this.topGridNumber = gridNumber;              localStorage.toptopGridNumber = gridNumber; }
    if (chances                 > this.topChances)      { this.topChances   = chances;                  localStorage.topChances   = chances; }

    localStorage.tops = true;
    
    localStorage.topGridScore    = this.topGridScore;
    localStorage.topGridBonus    = this.topGridBonus;
    localStorage.topGridTotal    = this.topGridTotal;
    localStorage.topGridMaxScore = this.topGridMaxScore;
    localStorage.topGridMaxBonus = this.topGridMaxBonus;
    localStorage.topGridMaxTotal = this.topGridMaxTotal;
    localStorage.topGrid5LWFound = this.topGrid5LWFound;
    localStorage.topGrid6LWFound = this.topGrid6LWFound;
    localStorage.topGrid7LWFound = this.topGrid7LWFound;
    localStorage.topGrid8LWFound = this.topGrid8LWFound;
    localStorage.topGrid9LWFound = this.topGrid9LWFound; // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
    localStorage.topGrid10LWFound = this.topGrid10LWFound; // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
    localStorage.topGrid5LWToFnd = this.topGrid5LWToFnd;
    localStorage.topGrid6LWToFnd = this.topGrid6LWToFnd;
    localStorage.topGrid7LWToFnd = this.topGrid7LWToFnd;
    localStorage.topGrid8LWToFnd = this.topGrid8LWToFnd;
    localStorage.topGrid9LWToFnd = this.topGrid9LWToFnd; // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
    localStorage.topGrid10LWToFnd = this.topGrid10LWToFnd; // vMax : more letters (9 & 10). v1.1 : lecture de la mauvaise valeur
    localStorage.topGameScore    = this.topGameScore;
    localStorage.topGameBonus    = this.topGameBonus;
    localStorage.topGameTotal    = this.topGameTotal;
    localStorage.topGridNumber   = this.topGridNumber;
    localStorage.topChances      = this.topChances;
}

function registerGridStats()
{
    this.statGrids++;
    this.statGridScore      += score;
    this.statGridBonus      += bonus;
    this.statGridTotal      += (score + bonus);
    this.statGridMaxScore   += maxScore;
    this.statGridMaxBonus   += maxBonus;
    this.statGridMaxTotal   += (maxScore + 2*maxBonus);
    this.statGrid5LWFound   += numberOfFound[0];
    this.statGrid6LWFound   += numberOfFound[1];
    this.statGrid7LWFound   += numberOfFound[2];
    this.statGrid8LWFound   += numberOfFound[3];
    this.statGrid9LWFound   += numberOfFound[4]; // vMax : more letters (9 & 10)
    this.statGrid10LWFound   += numberOfFound[5]; // vMax : more letters (9 & 10)
    this.statGrid5LWToFnd   += numberToFind[0];
    this.statGrid6LWToFnd   += numberToFind[1];
    this.statGrid7LWToFnd   += numberToFind[2];
    this.statGrid8LWToFnd   += numberToFind[3];
    this.statGrid9LWToFnd   += numberToFind[4]; // vMax : more letters (9 & 10)
    this.statGrid10LWToFnd   += numberToFind[5]; // vMax : more letters (9 & 10)
    
    localStorage.gridStats          = true;
    
    localStorage.statGrids          = this.statGrids;
    localStorage.statGridScore      = this.statGridScore;
    localStorage.statGridBonus      = this.statGridBonus;
    localStorage.statGridTotal      = this.statGridTotal;
    localStorage.statGridMaxScore   = this.statGridMaxScore;
    localStorage.statGridMaxBonus   = this.statGridMaxBonus;
    localStorage.statGridMaxTotal   = this.statGridMaxTotal;
    localStorage.statGrid5LWFound   = this.statGrid5LWFound;
    localStorage.statGrid6LWFound   = this.statGrid6LWFound;
    localStorage.statGrid7LWFound   = this.statGrid7LWFound;
    localStorage.statGrid8LWFound   = this.statGrid8LWFound;
    localStorage.statGrid9LWFound   = this.statGrid9LWFound; // vMax : more letters (9 & 10)
    localStorage.statGrid10LWFound  = this.statGrid10LWFound; // vMax : more letters (9 & 10)
    localStorage.statGrid5LWToFnd   = this.statGrid5LWToFnd;
    localStorage.statGrid6LWToFnd   = this.statGrid6LWToFnd;
    localStorage.statGrid7LWToFnd   = this.statGrid7LWToFnd;
    localStorage.statGrid8LWToFnd   = this.statGrid8LWToFnd;
    localStorage.statGrid9LWToFnd   = this.statGrid9LWToFnd; // vMax : more letters (9 & 10)
    localStorage.statGrid10LWToFnd   = this.statGrid10LWToFnd; // vMax : more letters (9 & 10)
}

function registerGameStats()
{
    this.statGames++;
    this.statGameScore += gameScore;
    this.statGameBonus += gameBonus;
    this.statGameTotal += (gameScore + gameBonus);
    
    localStorage.gameStats          = true;
    
    localStorage.statGames          = this.statGames;
    localStorage.statGameScore      = this.statGameScore;
    localStorage.statGameBonus      = this.statGameBonus;
    localStorage.statGameTotal      = this.statGameTotal;
}

function displayStatsAndTops()
{
	const statsTitle = 'Statistiques';
    switch(statsAndTopsStatus) {
        case statsAndTopsStatusType.satsStats: // stats
            const msgNextStatus1 = '\nToucher « % » = RAZ stats+tops.'; // v2.0 RAZ au lieu de stats
			var msgStatGames = (this.statGames?
								'En moyenne, sur '+this.statGames+' partie'+(this.statGames>1?'s':'')+
								' :\nscore '+Math.round(this.statGameScore/this.statGames)+
								' • bonus '+Math.round(this.statGameBonus/this.statGames)+
								'\ntotal '+Math.round(this.statGameTotal/this.statGames)+'.\n':'');
			var msgStatGrids = (this.statGrids?
								'En moyenne, sur '+this.statGrids+' grille'+(this.statGrids>1?'s':'')+
								' :\nscore '+Math.round(this.statGridScore/this.statGrids)+
								' ('+Math.round((100*this.statGridScore)/this.statGridMaxScore)+
								'%)\nbonus '+Math.round(this.statGridBonus/this.statGrids)+
								' ('+Math.round((100*this.statGridBonus)/(2*this.statGridMaxBonus))+
								'%)\ntotal '+Math.round(this.statGridTotal/this.statGrids)+
								' ('+Math.round((100*this.statGridTotal)/(this.statGridMaxScore+2*this.statGridMaxBonus))+
								'%),\n'+Math.round(this.statGrid10LWFound/this.statGrids)+' mot'+(Math.round(this.statGrid10LWFound/this.statGrids)>1?'s':'')+' de 10 lettres'+(this.statGrid10LWToFnd?(' ('+Math.round((100*this.statGrid10LWFound/this.statGrid10LWToFnd))+'%)'):'')+ // vMax : more letters (9 & 10)
								'\n'+   Math.round(this.statGrid9LWFound/this.statGrids)+ ' mot'+(Math.round(this.statGrid9LWFound/this.statGrids)>1?'s':'')+ ' de 9 lettres'+ (this.statGrid9LWToFnd? (' ('+Math.round((100*this.statGrid9LWFound/ this.statGrid9LWToFnd))+ '%)'):'')+ // vMax : more letters (9 & 10)
								'\n'+   Math.round(this.statGrid8LWFound/this.statGrids)+ ' mot'+(Math.round(this.statGrid8LWFound/this.statGrids)>1?'s':'')+ ' de 8 lettres'+ (this.statGrid8LWToFnd? (' ('+Math.round((100*this.statGrid8LWFound/ this.statGrid8LWToFnd))+ '%)'):'')+
								'\n'+   Math.round(this.statGrid7LWFound/this.statGrids)+ ' mot'+(Math.round(this.statGrid7LWFound/this.statGrids)>1?'s':'')+ ' de 7 lettres'+ (this.statGrid7LWToFnd? (' ('+Math.round((100*this.statGrid7LWFound/ this.statGrid7LWToFnd))+ '%)'):'')+
								'\n'+   Math.round(this.statGrid6LWFound/this.statGrids)+ ' mot'+(Math.round(this.statGrid6LWFound/this.statGrids)>1?'s':'')+ ' de 6 lettres'+ (this.statGrid6LWToFnd? (' ('+Math.round((100*this.statGrid6LWFound/ this.statGrid6LWToFnd))+ '%)'):'')+
								'\n'+   Math.round(this.statGrid5LWFound/this.statGrids)+ ' mot'+(Math.round(this.statGrid5LWFound/this.statGrids)>1?'s':'')+ ' de 5 lettres'+ (this.statGrid5LWToFnd? (' ('+Math.round((100*this.statGrid5LWFound/ this.statGrid5LWToFnd))+ '%)'):'')+
								'.':'');
			if (msgStatGames+msgStatGrids == '') 
				alert(statsTitle+'\n\nIl n\'y a aucune statistique.\n'+msgNextStatus1);
			else
				alert(statsTitle+'\n\n'+msgStatGames+msgStatGrids+msgNextStatus1);
			break;
		case statsAndTopsStatusType.satsTops: // tops
            const msgNextStatus2 = '\nToucher « % » pour voir les stats.';  // v2.0 stats au lieu de tops 
			var msgTopGames = 'score '+this.topGameScore+' • bonus '+this.topGameBonus+'\ntotal '+this.topGameTotal+' • '+this.topGridNumber+' grille'+(this.topGridNumber>1?'s':'')+' • '+this.topChances+' chances\n';
			var msgTopGrids = 'score '+this.topGridScore+' • bonus '+this.topGridBonus+' • total '+this.topGridTotal+'\n'+ // v2.1: max values no longer exist
							  this.topGrid5LWFound+ ' mot'+(this.topGrid5LWFound>1?'s':'')+ ' de 5 lettres\n'+ // v2.1: max values no longer exist
							  this.topGrid6LWFound+ ' mot'+(this.topGrid6LWFound>1?'s':'')+ ' de 6 lettres\n'+ // v2.1: max values no longer exist
							  this.topGrid7LWFound+ ' mot'+(this.topGrid7LWFound>1?'s':'')+ ' de 7 lettres\n'+ // v2.1: max values no longer exist
							  this.topGrid8LWFound+ ' mot'+(this.topGrid8LWFound>1?'s':'')+ ' de 8 lettres\n'+ // v2.1: max values no longer exist
							  this.topGrid9LWFound+ ' mot'+(this.topGrid9LWFound>1?'s':'')+ ' de 9 lettres\n'+ // vMax : more letters (9 & 10). v2.1: max values no longer exist
							  this.topGrid10LWFound+' mot'+(this.topGrid10LWFound>1?'s':'')+' de 10 lettres.\n'; // vMax : more letters (9 & 10). v2.1: max values no longer exist
			alert('TOPS\n\nTops de parties :\n'+msgTopGames+'\nTops de grilles :\n'+msgTopGrids+msgNextStatus2);                  
            break;
        case statsAndTopsStatusType.satsRequest: // reset
            alert('Confirmation\n\nÊtes-vous sûr(e) de vouloir réinitialiser stats et tops ?\n\nPour confirmer,\ntouchez à nouveau « % ».'); 
            break;
        case statsAndTopsStatusType.satsReset: // reset
            this.resetStatsAndTops();
            break;
        default:
            break;
    }
    
    statsAndTopsStatus = (statsAndTopsStatus + 1) % 4;
}

//Remove all elements of the grid
function removeAllChildren(parent)
{
	while (parent.hasChildNodes()) {
		parent.removeChild(parent.firstChild);
	}
}

//Reset the grid (grid & isGreen arrays)
function resetGrid()
{
	grid = new Array(numberOfCellsBySide);
    isGreen = new Array(numberOfCellsBySide);
	for( var x = 0; x < numberOfCellsBySide; x++ ) {
		grid[x] = new Array(numberOfCellsBySide);
        isGreen[x] = new Array(numberOfCellsBySide);
		for( var y = 0; y < numberOfCellsBySide; y++ ) {
			grid[x][y] = '-';
            isGreen[x][y] = false;
		}
	}
}

function loadGrid()
{
    if (localStorage.getItem(lsGrid)) {
        // grid
        gridNumber = parseInt(localStorage.gridNumber);
        grid = new Array(numberOfCellsBySide);
        isGreen = new Array(numberOfCellsBySide);
        for( var x = 0; x < numberOfCellsBySide; x++ ) {
            grid[x] = new Array(numberOfCellsBySide);
            isGreen[x] = new Array(numberOfCellsBySide);
            for( var y = 0; y < numberOfCellsBySide; y++ ) {
                grid[x][y] = localStorage.getItem(lsGrid+(x)+(y));
                isGreen[x][y] = (localStorage.getItem('isGreen'+(x)+(y)) == 'true');
                // refresh grid
                paintLetterInGrid(x, y, (isGreen[x][y]?colorType.cGreen:colorType.cGray));
            }
        }
        // words found & to find
        for(var i = 0; i <= numberOfCellsBySide - minWordLength; i++) {
            idxByLength[i] = parseInt(localStorage.getItem('idxByLength'+i));
            numberOfFound[i] = parseInt(localStorage.getItem('numberOfFound'+i));
            numberToFind[i] = parseInt(localStorage.getItem('numberToFind'+i));
            color = (numberToFind[i]?((numberOfFound[i]==numberToFind[i])?'v':'x'):'o');
            refreshNumerator(numberOfFound[i], 2, (minWordLength + i) + '', color);
            refreshDenominator(numberToFind[i], 0, 2, (minWordLength + i) + '', color); // v2.1 : numerator added as parameter (unused for number of words)
        }
        
        // words to find (words)
        var numberOfWords = localStorage.numberOfWords;
        words.length = numberOfWords;
        wordPos.length = numberOfWords;
        for ( var i = 0; i < words.length; i++) {
            words[i] = localStorage.getItem('words'+i);
            wordPos[i] = new buildWordPosition( parseInt(localStorage.getItem('wordPosX'+i)),
                                                parseInt(localStorage.getItem('wordPosY'+i)),
                                                parseInt(localStorage.getItem('wordPosD'+i)));
            wordPos[i].found = (localStorage.getItem('wordPosFound'+i) == 'true');
        }
        // grid points
        maxScore = parseInt(localStorage.maxScore);
        maxBonus = parseInt(localStorage.maxBonus);
        
        refreshPoints(true);

        // refreshing max points
        refreshDenominator(maxScore, score, 4, 's', 'x'); // v2.1 : numerator added as parameter
        refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'x'); // v2.1 : numerator added as parameter
        refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'x'); // v2.1 : numerator added as parameter 
        refreshButtons();
    }
    else
        newGrid();
}

function registerGrid()
{
    // grid
    localStorage.grid = true;
    localStorage.gridNumber = gridNumber;
    for( var x = 0; x < numberOfCellsBySide; x++ ) 
        for( var y = 0; y < numberOfCellsBySide; y++ ) {
            localStorage.setItem(lsGrid+(x)+(y), grid[x][y]);
            localStorage.setItem('isGreen'+(x)+(y), isGreen[x][y]);
        }
    // words to find (counters)
    for( var i = 0; i <= numberOfCellsBySide - minWordLength; i++) {
        localStorage.setItem('idxByLength'+i, idxByLength[i]);
        localStorage.setItem('numberOfFound'+i, numberOfFound[i]);
        localStorage.setItem('numberToFind'+i, numberToFind[i]);
    }
    // words to find (words)
    localStorage.numberOfWords = words.length; 
    for( var i = 0; i < words.length; i++) {
        localStorage.setItem('words'+i, words[i]);
        localStorage.setItem('wordPosX'+i, wordPos[i].x);
        localStorage.setItem('wordPosY'+i, wordPos[i].y);
        localStorage.setItem('wordPosD'+i, wordPos[i].d);
        localStorage.setItem('wordPosFound'+i, wordPos[i].found);
    }
    // grid points
    localStorage.maxScore = maxScore;
    localStorage.maxBonus = maxBonus;
    // initialization
    localStorage.numberOfGreenLetters = numberOfGreenLetters;
    localStorage.score = score; 
    localStorage.bonus = bonus;
    localStorage.gameScore = gameScore;
    localStorage.gameBonus = gameBonus;
}

function refreshDigit(digit, id, pngSuffix, space) // v2.1: add facultative parameter : space character replace zero if space is true
{
	var newSrc;
	if ((space!=undefined)&&space&&(!digit)) 
		newSrc = pngFolder+'*.png';
	else
		newSrc = pngFolder+digit+pngSuffix+'.png';
	document.images[id].src = newSrc;	
}

function refreshNumerator(number, numberLength, idSuffix, pngSuffix)
{
 if  (numberLength >= 4)
    refreshDigit(Math.floor(number / 1000) % 10, 'sn' + idSuffix, pngSuffix);
 if  (numberLength >= 3)
    refreshDigit(Math.floor(number / 100) % 10, 'hn' + idSuffix, pngSuffix);
 refreshDigit(Math.floor(number / 10) % 10, 'tn' + idSuffix, pngSuffix);
 refreshDigit(number % 10, 'un' + idSuffix, pngSuffix);
 if ((idSuffix<'1') || (idSuffix>'9')) // v2.1: display pourcents except for number of words
 	switch(idSuffix) {
 		case 's': refreshDenominator(maxScore, number, 4, idSuffix, pngSuffix); break;
 		case 'b': refreshDenominator(2 * maxBonus, number, 4, idSuffix, pngSuffix); break;
 		case 't': refreshDenominator(maxScore + 2 * maxBonus, number, 4, idSuffix, pngSuffix); break;
 	}
}
 
function refreshDenominator(maxNumber, number, numberLength, idSuffix, pngSuffix) // v2.1 : numerator (number) added as parameter
{
 var n = maxNumber; // v2.1 var n replaces var number
 var pourcents = false;
 if ((idSuffix<'1') || (idSuffix>'9')) { // v2.1: display pourcents instead of max except for number of words
 	n = 10 *Math.round((100*number)/maxNumber); 
 	pourcents = true;
 }
 var s = Math.floor(n / 1000) % 10; // v2.1
 var h = Math.floor(n / 100) % 10; // v2.1
 var t = Math.floor(n / 10) % 10; // v2.1
 if  (numberLength >= 4)
	refreshDigit(s, 'sd' + idSuffix, pngSuffix, true);
 if  (numberLength >= 3)
    refreshDigit(h, 'hd' + idSuffix, pngSuffix, !s); // v2.1: space replace zero if digit 4 is zero
 refreshDigit(t, 'td' + idSuffix, pngSuffix); // v2.1: space replace zero if digit 4 and 3 are zero and not a word counter
 if (pourcents) // v2.1
	document.images['ud'+idSuffix].src = pngFolder+'!'+pngSuffix+'.png'; // v2.1: '!' = pourcent 	
 else
 	refreshDigit(n % 10, 'ud' + idSuffix, pngSuffix);    
}
 
function addPointsType(row, pngName)
{
    var col = document.createElement('td');
    var img = document.createElement('img'); 
    img.setAttribute('src', pngFolder+pngName+'.png');
    img.setAttribute('width', pointsLabelWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
}

function addButton(row, i)
{
    var col = document.createElement('td');
    var img = document.createElement('img'); 
    img.setAttribute('src', pngFolder+keyboard[1][i]+'.png');
    img.setAttribute('id', 'b'+i);
    img.setAttribute('onclick', 'clic('+(firstButtonID+i)+')');
    img.setAttribute('width', buttonWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
}

function addSeparator(row, width)
{
    var col = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute('src', pngFolder+'*.png');
    img.setAttribute('width', width);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);
    row.appendChild(col);			
}

function addGameScore(row, suffix)
{
	var gsab = gameScore + gameBonus;
    if (suffix == 's') {
        for(var i = 0; i < numberOfButtons; i++) {
        	if (i) // vMax
        		addSeparator(row, buttonSeparatorWidth);
            addButton(row, i);
        }
        return;
    }
    if (suffix == 'b') { // display the grid number and chances counter in the bonus line
    
        // grid number
        var col = document.createElement('td');
        var img = document.createElement('img'); 
        img.setAttribute('src', pngFolder+'grillex.png'); // font: Gloucester MT Extra Condensed, Extra-Condensed
        img.setAttribute('onclick', 'clic('+gridLabelID+')');
        img.setAttribute('id', idGrille);
        img.setAttribute('width', gridAndChancesLabelWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);

        addSeparator(row, gridAndChancesLblSepWidth); // vMax : width updated from 1 to gridAndChancesLblSepWidth

        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(gridNumber / 10)) + 'o.png');
        img.setAttribute('id', 'tgb');
        img.setAttribute('onclick', 'clic('+gridNumberID+')');
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (gridNumber % 10) + 'o.png');
        img.setAttribute('id', 'ugb');
        img.setAttribute('onclick', 'clic('+gridNumberID+')');
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);
        row.appendChild(col);
        
        addSeparator(row, gridAndChancesLblSepWidth); // vMax : width updated from 1 to gridAndChancesLblSepWidth
        
        // chances counter
        var col = document.createElement('td');
        var img = document.createElement('img'); 
        img.setAttribute('src', pngFolder+'chances'+(chances?'v':'x')+'.png'); // font: Gloucester MT Extra Condensed, Extra-Condensed
        img.setAttribute('onclick', 'clic('+chancesCounterID+')');
        img.setAttribute('id', 'chances');
        img.setAttribute('width', gridAndChancesLabelWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        
        addSeparator(row, gridAndChancesLblSepWidth); // vMax
        
        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(chances / 10)) + 'o.png');
        img.setAttribute('id', 'tcb');
        img.setAttribute('onclick', 'clic('+chancesCounterID+')');
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (chances % 10) + 'o.png');
        img.setAttribute('id', 'ucb');
        img.setAttribute('onclick', 'clic('+chancesCounterID+')');
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);
        row.appendChild(col);

    }
    else { 
        var col = document.createElement('td');
        var img = document.createElement('img'); // hundreds of thouSands 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 100000) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('id', 'dgs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // tens of thouSands 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 10000) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('id', 'ngs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // thouSands 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 1000) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('id', 'sgs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        
        addSeparator(row, thousandSeparatorWidth); // thousand separator. vMax : updated from 3 to thousandSeparatorWidth
        
        var col = document.createElement('td');
        var img = document.createElement('img'); // Hundreds 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 100) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('id', 'hgs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 10) % 10) + 'o.png');
        img.setAttribute('id', 'tgs');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (gsab % 10) + 'o.png');
        img.setAttribute('id', 'ugs');
        img.setAttribute('onclick', 'clic('+gameScoreID+')');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
        col.appendChild(img);
        row.appendChild(col);
    }
}

function addGridScore(row, suffix)
{
    var gridPointsID = 0;
    switch(suffix) {
        case 's': gridPointsID = gridScoreID; break;
        case 'b': gridPointsID = gridBonusID; break;
        case 't': gridPointsID = gridTotalID; break;
    }
    var col = document.createElement('td');
    var img = document.createElement('img'); // thouSands of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'sn'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Hundreds of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'hn'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'tn'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'un'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Division Separator
    img.setAttribute('src', pngFolder+'*.png'); // v2.1: '*.png' instead of '-o.png'
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // thouSands of Denominator
    img.setAttribute('src', pngFolder+'*.png'); // v2.1: '*.png' instead of '0x.png'
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'sd'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Hundreds of Denominator
    img.setAttribute('src', pngFolder+'*.png'); // v2.1: '*.png' instead of '0x.png'
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'hd'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'td'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Denominator
    img.setAttribute('src', pngFolder+'!x.png'); // v2.1: pourcent instead of zero ('!x.png' instead of '0x.png')
    img.setAttribute('onclick', 'clic('+gridPointsID+')');
    img.setAttribute('id', 'ud'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', scoreLineHeight); // vMax : 24 -> 40
    col.appendChild(img);			
    row.appendChild(col);
}

function addPointsRow(pointsType)
{
    var scoreTable = document.getElementById(pointsType);
    removeAllChildren(scoreTable);
	var row = document.createElement('tr');
    // addSeparator(row, pointsMarginWidth); // vMax
    addGameScore(row, pointsType[0]);
    addSeparator(row, pointsLabelSepWidth); // vMax
    addPointsType(row, pointsType);
    addSeparator(row, pointsLabelSepWidth); // vMax
    addGridScore(row, pointsType[0]);
    // addSeparator(row, pointsMarginWidth); // vMax
    scoreTable.appendChild(row);
}

function addCounter(row, suffix)
{
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'tn'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')');
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', counterDigitHeight);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'un'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')');
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', counterDigitHeight);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Division Separator
    img.setAttribute('src', pngFolder+'-o.png');
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')');
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', counterDigitHeight);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'td'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')');
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', counterDigitHeight);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'ud'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')');
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', counterDigitHeight);
    col.appendChild(img);			
    row.appendChild(col);
}

function addWordDefButtons(row) // v1.4
{
	// definition website choice
    var col = document.createElement('td');
    var img = document.createElement('img'); // parameter: website choice
   	img.setAttribute('src', pngFolder + fond + pngExt); 
    img.setAttribute('id', idDefPrmImg);
    img.setAttribute('onclick', 'clic('+dicoDefPrmID+')'); 
    img.setAttribute('width', wordScoreDefPrmWidth);
    img.setAttribute('height', wordScoreLetterSize);
    col.appendChild(img);			
    row.appendChild(col);

	// website link
    var col = document.createElement('td');
    var lnk = document.createElement('a');
	lnk.setAttribute('href', '#');
	lnk.setAttribute('target', '_self');
	lnk.setAttribute('id', 'll');
	
	// including the image source...
    var img = document.createElement('img'); // website link button
   	img.setAttribute('src', pngFolder + fond + pngExt); 
    img.setAttribute('id', idDefLnkImg);
    img.setAttribute('width', wordScoreDefLnkWidth);
    img.setAttribute('height', wordScoreLetterSize);
    lnk.appendChild(img);
    col.appendChild(lnk);			
    row.appendChild(col);
}

function refreshButtons()
{
    for(var i = 0; i < numberOfButtons; i++) {
        var newSrc;
        newSrc = pngFolder+keyboard[parseInt(status)][i]+'.png';
        document.images['b'+i].src = newSrc;	
    }
}

function registerChoice()
{
    for( var i = 0; i < 2; i++) {
        localStorage.setItem('xChoice'+i, xChoice[i]);
        localStorage.setItem('yChoice'+i, yChoice[i]);
    }
    localStorage.dChoice = dChoice;
    localStorage.lChoice = lChoice;
    localStorage.wordChoice = wordChoice;
}

function newGrid()
{ 
    //var top = new Date();
	var lettersToFindBefore = lettersToFind;
    do {
        lettersToFind = numberOfCellsBySide * numberOfCellsBySide;
        resetGrid();
        localStorage.removeItem(lsGrid);
        findAndPutWordsInGrid();
        if (lettersToFind > 0) {
            do {
                lettersToFindBefore = lettersToFind;
                findAndfillGrid();
            } while((lettersToFind > 0) && (lettersToFind < lettersToFindBefore));
		}
    } while(lettersToFind > 0);
	collectWordsInGrid();
    
    // define & display max scores
    maxBonus = 0;
    for( var i = 0; i <= maxWordLength - minWordLength; i++ ) {
        numberToFind[i] = (i?idxByLength[i-1]:words.length) - idxByLength[i];
        refreshDenominator(numberToFind[i], 0, 2, (minWordLength + i) + '', (numberToFind[i]?'x':'o')); // v2.1 : numerator added as parameter (unused for number of words)
        if (!numberToFind[i])
            refreshNumerator(0, 2, (minWordLength + i) + '', 'o');
        maxBonus += (scoreLen[i] * numberToFind[i]);
    }
    maxGameBonus += (2 * maxBonus); localStorage.maxGameBonus = maxGameBonus;

    maxScore = 0;  
    for( var i = 0; i < words.length; i++ )
      maxScore += (scoreDir[wordPos[i].d] * scoreLen[words[i].length - minWordLength]);
    maxGameScore += maxScore; localStorage.maxGameScore = maxGameScore;

    numberOfGreenLetters = 0;
    score = 0;
    bonus = 0;

    registerGrid();
    
    refreshDenominator(maxScore, score, 4, 's', 'x'); // v2.1 : numerator added as parameter
    refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'x'); // v2.1 : numerator added as parameter
    refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'x'); // v2.1 : numerator added as parameter 
    
    status = choiceStatusType.csWaitingForFirstLetter; localStorage.status = status;
    refreshButtons();

    greenMsg = false;
    
    for( var i = 0; i < 2; i++) {
        xChoice[i] = -1;
        yChoice[i] = -1;
    }
    dChoice = dirType.dUndefined;
    lChoice = 0;
    wordChoice = '';
    registerChoice();
}

function showWelcome()
{
	const welcomeTitle = 'Bienvenue dans Mélissimax';
	const welcomeButton = 'Commencer';
    if (!welcomeMsg) {
        alert(welcomeMessage);
        welcomeMsg = true;
        localStorage.welcomeMsg = true;
    }
    else 
        switch(parseInt(status)) {
            case choiceStatusType.csWaitingForFirstLetter:
                if (numberOfGreenLetters == numberOfCellsBySide * numberOfCellsBySide) {
                    greenMsg = true;
                    imgSrcGrilleSvg = pngFolder + 'grillev.png'; // v1.4
                    document.images[idGrille].src = imgSrcGrilleSvg;
                    alert(welcomeTitle+'\n\nUne partie est en cours.\nVous avez déjà verdi toute la grille.\n\nVous pouvez passer à une nouvelle\nen touchant « Grille » ou\ncontinuer à trouver tous les mots pour toucher les bonus.');
                }
                else
                    if (!numberOfGreenLetters)
                        if (gridNumber==1)
                            alert(welcomeTitle+'\n\nVoici une nouvelle partie...');
                        else
                            alert(welcomeTitle+'\n\nUne partie est en cours...\n\nVoici la grille suivante...');
                    else
                        alert(welcomeTitle+'\n\nUne partie est en cours...');
                break;
            case choiceStatusType.csWaitingForLastLetter:
                paintLetterInGrid(xChoice[0], yChoice[0], colorType.cRed);
                alert(welcomeTitle+'\n\nUne partie est en cours.\n\nVous avez déjà sélectionné la première lettre d\'un mot...');
                break;
        }
}

//Set up the game on the page using DOM elements
function setup(isNewGrid)
{
	// 1. grid
 	resetGrid();
    if (isNewGrid) 
        localStorage.removeItem(lsGrid);
 	var gridTable = document.getElementById(lsGrid);
	removeAllChildren(gridTable);
	for( var y = 0; y < numberOfCellsBySide; y++ ) {
		var row = document.createElement('tr');
		for( var x = 0; x < numberOfCellsBySide; x++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			img.setAttribute('src', pngFolder+'-.png');
			img.setAttribute('onclick', 'clic('+(10*y+x)+')');
			img.setAttribute('id', x+'*'+y);
			img.setAttribute('width', 72); // vMax : 32x32 -> 72x72
			img.setAttribute('height', 72); // vMax : 32x32 -> 72x72
			col.appendChild(img);			
			row.appendChild(col);
		}
		gridTable.appendChild(row);
	}
	
    // 2. counters
    var countersTable = document.getElementById('counters');
    removeAllChildren(countersTable);
    var row = document.createElement('tr');
    // addSeparator(row, counterMarginWidth); // vMax : No margin
    addCounter(row, 5);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 6);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 7);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 8);
    addSeparator(row, counterSeparatorWidth); // vMax : more letters (9 & 10)
    addCounter(row, 9); // vMax : more letters (9 & 10)
    addSeparator(row, counterSeparatorWidth); // vMax : more letters (9 & 10)
    addCounter(row, 10); // vMax : more letters (9 & 10)
    // addSeparator(row, counterMarginWidth); // vMax : No margin
    countersTable.appendChild(row);

    // 3. word found and his score
    var wordTable = document.getElementById('word');
    removeAllChildren(wordTable);
    // 3a. word found
	var row = document.createElement('tr');
    // addSeparator(row, wordScoreMarginWidth); // vMax : No margin
    for( var x = 0; x < maxWordLength; x++ ) {
        var col = document.createElement('td');
        var img = document.createElement('img');
        img.setAttribute('src', pngFolder+'*.png');
        img.setAttribute('onclick', 'clic('+wordFoundID+')');
        img.setAttribute('id', 'w'+x);
        img.setAttribute('width', wordScoreLetterSize);
        img.setAttribute('height', wordScoreLetterSize);
        col.appendChild(img);			
        row.appendChild(col);
    }
    //addSeparator(row, wordScoreSeparatorWidth);
    // 3b. word score
    for( var x = 0; x < 2; x++ ) {
        var col = document.createElement('td');
        var img = document.createElement('img');
        img.setAttribute('src', pngFolder+'*.png'); // v1.4 : on affiche pas '00'
		img.setAttribute('onclick', 'clic('+wordScoreID+')');
        if (x) 
            img.setAttribute('id', 'wsu'); // word score units
        else
            img.setAttribute('id', 'wst'); // word score tens
        img.setAttribute('width', wordScoreDigitWidth);
        img.setAttribute('height', wordScoreDigitHeight);
        col.appendChild(img);			
        row.appendChild(col);
    }
    // 3c. word definition (parameter & links)
    addWordDefButtons(row); // v1.4
    
    // addSeparator(row, wordScoreMarginWidth); // vMax : No margin
    wordTable.appendChild(row);
    
    // 4. score
    addPointsRow('score');
    
    // 5. bonus (and grid number and chances counter)
    addPointsRow('bonus');
 
    // 6. total
    addPointsRow('total');
    
    if (isNewGrid)
        newGrid();
    else
        loadGrid();
}

function loadChoice()
{
    for( var i = 0; i < 2; i++) {
        xChoice[i] = parseInt(localStorage.getItem('xChoice'+i));
        yChoice[i] = parseInt(localStorage.getItem('yChoice'+i));
    }
    dChoice = parseInt(localStorage.dChoice);
    lChoice = parseInt(localStorage.lChoice);
    wordChoice = localStorage.wordChoice;
}

function loadGameInProgress()
{
    maxGameScore = parseInt(localStorage.maxGameScore);
    maxGameBonus = parseInt(localStorage.maxGameBonus);
    gameScore = parseInt(localStorage.gameScore);
    gameBonus = parseInt(localStorage.gameBonus);

    numberOfGreenLetters = parseInt(localStorage.numberOfGreenLetters);
    score = parseInt(localStorage.score);
    bonus = parseInt(localStorage.bonus);
	maxScore = parseInt(localStorage.maxScore);
	maxBonus = parseInt(localStorage.maxBonus);

    // game status
    gridNumber = parseInt(localStorage.gridNumber);
    chances = parseInt(localStorage.chances);
    status = parseInt(localStorage.status);
    loadChoice();

	// Dictionnaire de définition (v1.4)
	if (localStorage.getItem('ddd')) 
		dicoDef = parseInt(localStorage.ddd); 
	if (localStorage.getItem('acd')) 
		affichagesChgtDico = parseInt(localStorage.acd);

    newGridRequest = false;
    greenMsg = false;		
    selectMsg = (localStorage.selectMsg == 'true');
    if (localStorage.getItem('welcomeMsg'))
        welcomeMsg = true;
    else
        welcomeMsg = false;
    currentSolutionNotFound = parseInt(localStorage.currentSolutionNotFound);
}

function loadGame()
{
	// v2.3: numberOfWords[x] is loaded one time with dico[x].length in loadGame function
	for(var i=0; i<dico.length; i++)
		numberOfWords[i] = dico[i].length;
		
   if (localStorage.getItem(lsGrid)) {
        loadGameInProgress();
        if ((status == choiceStatusType.csNoGame)||
            (status == choiceStatusType.csViewingSolutions)||
            (score == maxScore)) {
            if (numberOfGreenLetters < numberOfCellsBySide * numberOfCellsBySide) 
                newGame(true);
            else
                nextGrid(true);
        }
        else
            setup(false); // setup with NO new grid
    }
    else
        newGame(true);
}

function countWordsLike(filter) // returns integer
{
	var n = 0;
	var numberOfLetters = filter.length;
	// v2.2: dico[x].length instead of numberOfWords[x]
	for(var i = 0; i < dico[numberOfLetters-minWordLength].length; i++) {
			if (((filter[0] == '-') || (filter[0] == dico[numberOfLetters-minWordLength][i][0])) &&
			    ((filter[1] == '-') || (filter[1] == dico[numberOfLetters-minWordLength][i][1])) &&
			    ((filter[2] == '-') || (filter[2] == dico[numberOfLetters-minWordLength][i][2])) &&
			    ((filter[3] == '-') || (filter[3] == dico[numberOfLetters-minWordLength][i][3])) &&
			    ((filter[4] == '-') || (filter[4] == dico[numberOfLetters-minWordLength][i][4])) &&
			    ((numberOfLetters-minWordLength < 1) || (filter[5] == '-') || (filter[5] == dico[numberOfLetters-minWordLength][i][5])) &&
			    ((numberOfLetters-minWordLength < 2) || (filter[6] == '-') || (filter[6] == dico[numberOfLetters-minWordLength][i][6])) &&
			    ((numberOfLetters-minWordLength < 3) || (filter[7] == '-') || (filter[7] == dico[numberOfLetters-minWordLength][i][7])) &&
			    ((numberOfLetters-minWordLength < 4) || (filter[8] == '-') || (filter[8] == dico[numberOfLetters-minWordLength][i][8])) && // vMax : more letters (9 & 10)
			    ((numberOfLetters-minWordLength < 5) || (filter[9] == '-') || (filter[9] == dico[numberOfLetters-minWordLength][i][9])))   // vMax : more letters (9 & 10)
				n++;
		}
	return n;
}

function chooseWordLike(filter)
{
	var numberOfLetters = filter.length;
	var wordIndex = 0;
	var n = 0;
	if (numberOfLetters  == 1) {
		numberOfLetters = parseInt(filter);
		// v2.2: dico[x].length instead of numberOfWords[x]
		wordIndex = Math.floor(Math.random() * dico[numberOfLetters - minWordLength].length);
		filter = '';
		for(var i = 0; i < numberOfLetters; i++)
			filter = filter + '-';
	}
	else {
		var wc = countWordsLike(filter);
		if (wc == 0)
			return '';
		wordIndex = Math.floor(Math.random() * wc);
	}
	// v2.2: dico[x].length instead of numberOfWords[x]
	for(var i = 0; i < dico[numberOfLetters-minWordLength].length; i++) {
			if (((filter[0] == '-') || (filter[0] == dico[numberOfLetters-minWordLength][i][0])) &&
			    ((filter[1] == '-') || (filter[1] == dico[numberOfLetters-minWordLength][i][1])) &&
			    ((filter[2] == '-') || (filter[2] == dico[numberOfLetters-minWordLength][i][2])) &&
			    ((filter[3] == '-') || (filter[3] == dico[numberOfLetters-minWordLength][i][3])) &&
			    ((filter[4] == '-') || (filter[4] == dico[numberOfLetters-minWordLength][i][4])) &&
			    ((numberOfLetters-minWordLength < 1) || (filter[5] == '-') || (filter[5] == dico[numberOfLetters-minWordLength][i][5])) &&
			    ((numberOfLetters-minWordLength < 2) || (filter[6] == '-') || (filter[6] == dico[numberOfLetters-minWordLength][i][6])) &&
			    ((numberOfLetters-minWordLength < 3) || (filter[7] == '-') || (filter[7] == dico[numberOfLetters-minWordLength][i][7])) &&
			    ((numberOfLetters-minWordLength < 4) || (filter[8] == '-') || (filter[8] == dico[numberOfLetters-minWordLength][i][8])) && // vMax : more letters (9 & 10)
			    ((numberOfLetters-minWordLength < 5) || (filter[9] == '-') || (filter[9] == dico[numberOfLetters-minWordLength][i][9]))) { // vMax : more letters (9 & 10)
				n++;
				if (n - 1 == wordIndex) {
					return dico[numberOfLetters-minWordLength][i];
				}
			}	
		}
	return '';
}

function isValid(word)
{
    if (dico[word.length-minWordLength].indexOf(word)>-1) 
        return true;
    else
        return false;
}


function addLetterInGrid(l, x, y)
{
	grid[x][y] = l;
    var newSrc;
	newSrc = pngFolder+l+'p.png';
    document.images[x+'*'+y].src = newSrc;
}

function findAndPutWordsInGrid()
{
	var occurrences = 0;
	//console.log('1.Find&PutWordsInGrid');
	while(occurrences < numberOfCellsBySide*numberOfCellsBySide) { // vMax : the const replaces the number
		occurrences++;
		var d = 1 + Math.floor(Math.random() * numberOfDirections);
		var dl = Math.floor(Math.random() * (1 + maxWordLength - minWordLength)); 
		var numberOfLetters = maxWordLength - dl; // word length
		var x = 0;
		var y = 0;
		switch(d) {
			case dirType.dN:
				x = Math.floor(Math.random() * numberOfCellsBySide);
				y = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				break;
			case dirType.dNE:
			    x = Math.floor(Math.random() * dl);
				y = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				break;
			case dirType.dE:
			    x = Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * numberOfCellsBySide);
				break;
			case dirType.dSE:
				x = Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * dl);
				break;
			case dirType.dS:
				x = Math.floor(Math.random() * numberOfCellsBySide);
				y = Math.floor(Math.random() * dl);
				break;
			case dirType.dSW:
				x = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * dl);
				break;
			case dirType.dW:
				x = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * numberOfCellsBySide);
				break;
			case dirType.dNW:
				x = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				y = (numberOfCellsBySide-1) - Math.floor(Math.random() * dl);
				break;
			default:
				break;
		}
		var filter = '';  
		for(var i = 0; i < numberOfLetters; i++) 
			filter = filter + grid[x + i * dx[d]][y + i * dy[d]];

		var numberOfJokers = 0;
		for(var i = 0; i < numberOfLetters; i++)
			if (filter[i] == '-') 
				numberOfJokers++;
		if (!numberOfJokers) 
			continue;
		if (numberOfJokers == numberOfLetters) 
			filter = numberOfLetters+'';
		var word = chooseWordLike(filter);

		if (word == '')
			continue;
		
		lettersToFind -= numberOfJokers;
		occurrences = 0;

		for(var i = 0; i < numberOfLetters; i++) 
			addLetterInGrid(word[i], x + i * dx[d], y + i * dy[d]);
        //console.log('('+x+','+y+','+stDir[d]+'):'+filter+'>'+word);   
	}
}

function findAndfillGrid() 
{
	var maxNumberOfCellsToFill 	= 0;
	var minDistance				= numberOfCellsBySide;
	var numberOfCellsToFill 	= 0;
	var m						= numberOfCellsBySide;
	var M						= 0;
	var dirToFill 				= [];
	var xToFill					= [];
	var yToFill					= [];
	var maxLengthToSeek			= [];				
	var mini					= [];
	var maxi					= [];
	// Find maxline of ? and fill it
	//console.log('2.Find&FillGrid');
	for(var d = dirType.dNE; d <= dirType.dS; d++) {
		switch(d) {
			case dirType.dNE:
				// only in diagonales, only eleven lines to seek because of minimum of five letters. vMax : more letters : eleven instead of seven
				for(var i = 0; i < 1+2*(maxWordLength-5); i++) { // vMax : more letters : eleven instead of seven = 1+2(n-5)
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var j = 0; j < ((i > 5)?(15 - i):(i + 5)); j++) { // vMax : (i>3) -> (i>5) ; (11-i) -> (15-i).
						if (grid[((i > 5)?(i - 5):0) + j * dx[d]][((i < 6)?(i + 4):9) + j * dy[d]] == '-') { // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(i+4):7 -> (i<6)?(i+4):9.
							numberOfCellsToFill++;
							if (j > M) M = j;
							if (j < m) m = j;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //console.log('NE:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
					if ((numberOfCellsToFill > maxNumberOfCellsToFill) ||
					    ((numberOfCellsToFill == maxNumberOfCellsToFill) &&
						 (M - m + 1 <= minDistance))) {
                        if ((numberOfCellsToFill > maxNumberOfCellsToFill) || (M - m + 1 < minDistance)) { 
                            // new record
                            maxNumberOfCellsToFill = numberOfCellsToFill;
                            minDistance = M - m + 1;
                            // reset record table
                            dirToFill.length = 0;
                            xToFill.length = 0;
                            yToFill.length = 0;
                            maxi.length = 0;
                            mini.length = 0;
                            maxLengthToSeek.length = 0;
                        }
                        var l = dirToFill.length;
						dirToFill[l] = d;
						xToFill[l] = ((i > 5)?(i - 5):0); // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(i+4):7 -> (i<6)?(i+4):9.
						yToFill[l] = ((i < 6)?(i + 4):9); // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(i+4):7 -> (i<6)?(i+4):9.
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = ((i > 5)?(15 - i):(i + 5)); // vMax : (i>3) -> (i>5) ; (11-i) -> (15-i).
                        //console.log('NE:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
			case dirType.dE:
				for(var y = 0; y < numberOfCellsBySide; y++) {
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var x = 0; x < numberOfCellsBySide; x++) {
						if (grid[x][y] == '-') {
							numberOfCellsToFill++;
							if (x > M) M = x;
							if (x < m) m = x;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //console.log('E:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
					if ((numberOfCellsToFill > maxNumberOfCellsToFill) ||
					    ((numberOfCellsToFill == maxNumberOfCellsToFill) &&
						 (M - m + 1 <= minDistance))) {
                        if ((numberOfCellsToFill > maxNumberOfCellsToFill) || (M - m + 1 < minDistance)) { 
                            // new record
                            maxNumberOfCellsToFill = numberOfCellsToFill;
                            minDistance = M - m + 1;
                            // reset record table
                            dirToFill.length = 0;
                            xToFill.length = 0;
                            yToFill.length = 0;
                            maxi.length = 0;
                            mini.length = 0;
                            maxLengthToSeek.length = 0;
                        }
                        var l = dirToFill.length;
						dirToFill[l] = d;
						xToFill[l] = 0;
						yToFill[l] = y;
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = numberOfCellsBySide;
                        //console.log('E:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
			case dirType.dSE:
				// only in diagonales, only eleven lines to seek because of minimum of five letters. vMax : more letters : eleven instead of seven
				for(var i = 0; i < 1+2*(maxWordLength-5); i++) { // vMax : more letters : eleven instead of seven = 1+2(n-5)
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var j = 0; j < ((i > 5)?(15 - i):(i + 5)); j++) { // vMax : (i>3) -> (i>5) ; (11-i) -> (15-i).
						if (grid[((i < 6)?(5 - i):0) + j * dx[d]][((i > 5)?(i - 5):0) + j * dy[d]] == '-') { // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(3-i) -> (i<6)?(5-i).
							numberOfCellsToFill++;
							if (j > M) M = j;
							if (j < m) m = j;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //console.log('SE:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
					if ((numberOfCellsToFill > maxNumberOfCellsToFill) ||
					    ((numberOfCellsToFill == maxNumberOfCellsToFill) &&
						 (M - m + 1 <= minDistance))) {
                        if ((numberOfCellsToFill > maxNumberOfCellsToFill) || (M - m + 1 < minDistance)) { 
                            // new record
                            maxNumberOfCellsToFill = numberOfCellsToFill;
                            minDistance = M - m + 1;
                            // reset record table
                            dirToFill.length = 0;
                            xToFill.length = 0;
                            yToFill.length = 0;
                            maxi.length = 0;
                            mini.length = 0;
                            maxLengthToSeek.length = 0;
                        }
                        var l = dirToFill.length;
						dirToFill[l] = d;
						xToFill[l] = ((i < 6)?(5 - i):0); // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(3-i) -> (i<6)?(5-i).
						yToFill[l] = ((i > 5)?(i - 5):0); // vMax : (i>3)?(i-3) -> (i>5)?(i-5) ; (i<4)?(3-i) -> (i<6)?(5-i).
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = ((i > 5)?(15 - i):(i + 5));  // vMax : (i>3) -> (i>5) ; (11-i) -> (15-i).
                        //console.log('SE:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
			case dirType.dS:
				for(var x = 0; x < numberOfCellsBySide; x++) {
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var y = 0; y < numberOfCellsBySide; y++) {
						if (grid[x][y] == '-') {
							numberOfCellsToFill++;
							if (y > M) M = y;
							if (y < m) m = y;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //console.log('S:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
					if ((numberOfCellsToFill > maxNumberOfCellsToFill) ||
					    ((numberOfCellsToFill == maxNumberOfCellsToFill) &&
						 (M - m + 1 <= minDistance))) {
                        if ((numberOfCellsToFill > maxNumberOfCellsToFill) || (M - m + 1 < minDistance)) { 
                            // new record
                            maxNumberOfCellsToFill = numberOfCellsToFill;
                            minDistance = M - m + 1;
                            // reset record table
                            dirToFill.length = 0;
                            xToFill.length = 0;
                            yToFill.length = 0;
                            maxi.length = 0;
                            mini.length = 0;
                            maxLengthToSeek.length = 0;
                        }
                        var l = dirToFill.length;
						dirToFill[l] = d;
						xToFill[l] = x;
						yToFill[l] = 0;
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = numberOfCellsBySide;
                        //console.log('S:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
		}
	}
    
	// let's try to fill using record table !
    
    if (maxNumberOfCellsToFill)
        for(var k = 0; k < dirToFill.length; k++) {
            //console.log(maxNumberOfCellsToFill + ' cases distantes de '+ minDistance + ' avec longueur max de ' + maxLengthToSeek[k] + ' (' + mini[k] + ', ' + maxi[k] + '): d = ' + stDir[dirToFill[k]] + ' & (x, y) = (' + xToFill[k] + ', ' + yToFill[k] + ')'); 
            for(var l = maxLengthToSeek[k]; l >= Math.max(minDistance, minWordLength); l--) {
                for(var i = Math.max(0, maxi[k] + 1 - l); i <= Math.min(maxLengthToSeek[k] - l, mini[k]); i++) {
                    var word = '';
                    var filter = ''; 
                    var numberOfJokers = 0; 

                    for(var j = 0; j < l; j++) 
                        filter = filter + grid[xToFill[k] + (i + j) * dx[dirToFill[k]]][yToFill[k] + (i + j) * dy[dirToFill[k]]];

                    //console.log('De ' + i + ' à ' + (i + l - 1) + ' : filtre = ' + filter);

                    numberOfJokers = 0;
                    for(var j = 0; j < l; j++)
                        if (filter[j] == '-') 
                            numberOfJokers++;

                    if (!numberOfJokers) 
                        continue;
                        
                    if (numberOfJokers == l) 
                        filter = numberOfJokers+'';
                    
                    word = chooseWordLike(filter);

                    if (word != '') {
                        ////console.log(word);
                        lettersToFind -= numberOfJokers;
                        for(var j = 0; j < l; j++) {
                            addLetterInGrid(word[j], xToFill[k] + (i + j) * dx[dirToFill[k]], yToFill[k] + (i + j) * dy[dirToFill[k]]);
                            //console.log('('+(xToFill[k]+i*dx[dirToFill[k]])+','+(yToFill[k]+i*dy[dirToFill[k]])+','+stDir[dirToFill[k]]+'):'+filter+'>'+word);
                        }
                    }
                    else {
                        filter = '';
                        for(var j = l - 1; j >= 0; j--) 
                            filter = filter + grid[xToFill[k] + (i + j) * dx[dirToFill[k]]][yToFill[k] + (i + j) * dy[dirToFill[k]]];
                        
                        //console.log('De ' + (i + l - 1) + ' à ' + i + ' : filtre = ' + filter);

                        numberOfJokers = 0;
                        for(var j = 0; j < l; j++)
                            if (filter[j] == '-') 
                                numberOfJokers++;

                        if (!numberOfJokers) 
                            continue;
                            
                        if (numberOfJokers == l) 
                            filter = numberOfJokers+'';
                        
                        word = chooseWordLike(filter);

                        if (word != '') {
                            //console.log(word);
                            lettersToFind -= numberOfJokers;
                            for(var j = l - 1; j >= 0; j--) {
                                addLetterInGrid(word[l-1-j], xToFill[k] + (i + j) * dx[dirToFill[k]], yToFill[k] + (i + j) * dy[dirToFill[k]]);
                                //console.log('('+(xToFill[k]+i*dx[dirToFill[k]])+','+(yToFill[k]+i*dy[dirToFill[k]])+','+stDir[dirToFill[k]]+'):'+filter+'>'+word);
                            }
                        }
                    }
                    if (!lettersToFind) return;
                }
            }
        }
}

function collectWordsInGrid()
{
	//console.log('3:CollectWordsInGrid');
	var word = '';
    var gridAlert = '';
    for(var y=0; y<10; y++) {
        for(var x=0; x<10; x++)
            gridAlert = gridAlert + grid[x][y];
        gridAlert = gridAlert + '\n';
    }
    //console.log(gridAlert);
    
	// Initialization
	words.length = 0;
	wordPos.length = 0;
	for(var l = maxWordLength; l >= minWordLength; l--) {
		//console.log('>l=', l);
        var N = 1 + maxWordLength - l; // used in the loops for(var n = ; ...
		idxByLength[l - minWordLength] = words.length;
        numberOfFound[l - minWordLength] = 0; // Initialization	
		for(var d = dirType.dN; d <= dirType.dNW; d++) {
		//console.log('>>d=', d, ' (0=N,1=NE,2=E,3=SE,4=S,5=SW,6=W,7=NW)');
			switch(d) {
				case dirType.dN:
					for(var x = 0; x < numberOfCellsBySide; x++) {
						for(var y = numberOfCellsBySide - 1; y >= l - 1; y--) {
							word = '';
							for(var i = 0; i < l; i++)
								word = word + grid[x + i * dx[d]][y + i * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length; 
                                //console.log('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dNE:
					for(var k = 0; k < 1 + 2 * (maxWordLength - l); k++) 
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = Math.max(0, k + l - 10); // vMax : 8 -> 10. 
                            var y = Math.min(9, l + k - 1); // vMax : 7 -> 9.
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
                            if (isValid(word)) { 
                                i = words.length;
                                //console.log('Mot n°'+i);
                                words[i] = word;
                                wordPos[i] = new buildWordPosition(x+n*dx[d], y+n*dy[d], d);
                            }
						}
					break;
				case dirType.dE:
					for(var y = 0; y < numberOfCellsBySide; y++) {
						for(var x = 0; x <= numberOfCellsBySide - l; x++) {
							word = '';
							for(var i = 0; i < l; i++)
								word = word + grid[x + i * dx[d]][y + i * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //console.log('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dSE:
					for(var k = 0; k < 1 + 2 * (maxWordLength - l); k++) 
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = Math.max(0, 10 - l - k); // vMax : 8 -> 10. 
                            var y = Math.max(0, k + l - 10); // vMax : 8 -> 10. 
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
                            if (isValid(word)) { 
                                i = words.length;
                                //console.log('Mot n°'+i);
                                words[i] = word;
                                wordPos[i] = new buildWordPosition(x+n*dx[d], y+n*dy[d], d);
                            }
						}
					break;
				case dirType.dS:
					for(var x = 0; x < numberOfCellsBySide; x++) {
						for(var y = 0; y <= numberOfCellsBySide - l; y++) {
							word = '';
							for(var i = 0; i < l; i++)
								word = word + grid[x + i * dx[d]][y + i * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //console.log('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dSW:
					for(var k = 0; k < 1 + 2 * (maxWordLength - l); k++)
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = 9 - Math.max(0, k + l - 10); // vMax : 7 -> 9 ; 8 -> 10.  
                            var y = 9 - Math.min(9, l + k - 1);  // vMax : 7 -> 9 ; 8 -> 10.
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
                            if (isValid(word)) { 
                                i = words.length;
                                //console.log('Mot n°'+i);
                                words[i] = word;
                                wordPos[i] = new buildWordPosition(x+n*dx[d], y+n*dy[d], d);
                        	}
						}
					break;
				case dirType.dW:
					for(var y = 0; y < numberOfCellsBySide; y++) {
						for(var x = numberOfCellsBySide - 1; x >= l - 1; x--) {
							word = '';
							for(var i = 0; i < l; i++)
								word = word + grid[x + i * dx[d]][y + i * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //console.log('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dNW:
					for(var k = 0; k < 1 + 2 * (maxWordLength - l); k++)  
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = 9 - Math.max(0, 10 - l - k); // vMax : 7 -> 9 ; 8 -> 10. 
                            var y = 9 - Math.max(0, k + l - 10); // vMax : 7 -> 9 ; 8 -> 10. 
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //console.log('('+x+','+y+','+stDir[d]+')='+word);    
                            if (isValid(word)) { 
                                i = words.length;
                                //console.log('Mot n°'+i);
                                words[i] = word;
                                wordPos[i] = new buildWordPosition(x+n*dx[d], y+n*dy[d], d);
                            }
						}
					break;
			}
		}
	}
}

function paintLetterInGrid(x, y, color)
{
	var newSrc;
	newSrc = pngFolder+grid[x][y]+letterColorSuffix[color]+'.png';
	document.images[x+'*'+y].src = newSrc;	
}

function showWordAndHisScore(x, y, d, l, s)
{
    // align=right!
    for(var i = 0; i < maxWordLength - l; i++) {
        var newSrc;
        newSrc = pngFolder + '*.png';
        document.images['w'+i].src = newSrc;
    }
    // word selected...
   	stDrnMotForme = ''; // v1.4
    for(var i = 0; i < l; i++) {
		var lettre = grid[x+i*dx[d]][y+i*dy[d]]; // v1.4
		stDrnMotForme = stDrnMotForme + lettre; // v1.4
		var newSrc;
        newSrc = pngFolder + lettre + letterColorSuffix[isGreen[x+i*dx[d]][y+i*dy[d]]?colorType.cGreen:colorType.cGray] + '.png';
        document.images['w'+ (i + maxWordLength - l)].src = newSrc;
    }
    // word score
    refreshDigit(Math.floor(s / 10) % 10, 'wst', 'o');
    refreshDigit(s % 10, 'wsu', 'o');    
    
    // v1.4. word definitions
   	nvSrc = pngFolder + pngDico[dicoDef] + pngExt; 
	document.images[idDefPrmImg].src = nvSrc;	
	
	document.links['ll'].href = lnkDico[dicoDef] + stDrnMotForme;
	if (dicoDef==nbDicosDef-1)
		document.links['ll'].href = document.links['ll'].href.toLowerCase() + extHTM; // v1.5.1 - toLowerCase()
	document.links['ll'].target = '_blank';
	
	// link img src
	id = idDefLnkImg;	
	nvSrc = pngFolder + hrefDef + pngExt;
	document.images[id].src = nvSrc;	
}

function refreshGamePoints()
{
    var gsab = gameScore + gameBonus;
    refreshDigit(Math.floor(gsab / 100000) % 10, 'dgs', 'o');
    refreshDigit(Math.floor(gsab / 10000) % 10, 'ngs', 'o');
    refreshDigit(Math.floor(gsab / 1000) % 10, 'sgs', 'o');
    refreshDigit(Math.floor(gsab / 100) % 10, 'hgs', 'o');
    refreshDigit(Math.floor(gsab / 10) % 10, 'tgs', 'o');
    refreshDigit(gsab % 10, 'ugs', 'o');
}

function refreshPoints(quiet)
{
    // score...
    var colorSuffix = ((score == maxScore)?'v':'x');
    refreshNumerator(score, 4, 's', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(maxScore, score, 4, 's', 'v'); // v2.1 : numerator added as parameter

    // bonus...
    colorSuffix = ((bonus == 2 * maxBonus)?'v':'x');
    refreshNumerator(bonus, 4, 'b', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'v'); // v2.1 : numerator added as parameter

    // total...
    colorSuffix = ((score + bonus == maxScore + 2 * maxBonus)?'v':'x');
    refreshNumerator(score + bonus, 4, 't', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'v'); // v2.1 : numerator added as parameter 
        
    // game + bonus score 
    refreshGamePoints();
    
    // next grid activated ? Yes = green. No = red.
    if ((!greenMsg) && (numberOfGreenLetters == numberOfCellsBySide * numberOfCellsBySide)) {
        greenMsg = true;
       	imgSrcGrilleSvg = pngFolder + 'grillev.png'; // v1.4
        document.images[idGrille].src = imgSrcGrilleSvg; // v1.4
        if ((score < maxScore)&&(!quiet))
        	alert('Bravo !\nVous avez verdi toute la grille.\n\nVous pouvez passer à une nouvelle en touchant « Grille » ou continuer à trouver tous les mots pour empocher les bonus.');
    }
}

function calculateAndRefreshScores(l, s)
{
    gameScore += s;
    score += s;
    numberOfFound[l - minWordLength]++;
    var ntf = numberToFind[l - minWordLength];
    var nof = numberOfFound[l - minWordLength];
    if (ntf == nof) { 
        gameBonus += ntf * scoreLen[l - minWordLength];
        bonus += ntf * scoreLen[l - minWordLength];
        if (bonus == maxBonus) {
            gameBonus += bonus;
            bonus += bonus;
        }
    }
    
    // registering
    localStorage.setItem('numberOfFound'+(l - minWordLength), numberOfFound[l - minWordLength]);
    localStorage.gameScore = gameScore;
    localStorage.gameBonus = gameBonus;
    localStorage.score = score;
    localStorage.bonus = bonus;
    
    // number of words...
    var colorSuffix = ((ntf == nof)?'v':'x');
    refreshNumerator(nof, 2, l + '', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(ntf, 0, 2, l + '', colorSuffix); // v2.1 : numerator added as parameter (unused for number of words)

    refreshPoints(false);
}

function findNextSolutionNotFound(direction)
{
    do {
        currentSolutionNotFound = (currentSolutionNotFound + direction) % wordPos.length;
    } while(wordPos[currentSolutionNotFound].found);
    localStorage.currentSolutionNotFound = currentSolutionNotFound;
}

function hideCurrentSolutionNotFound()
{
    var x = wordPos[currentSolutionNotFound].x;
    var y = wordPos[currentSolutionNotFound].y;
    var d = wordPos[currentSolutionNotFound].d;
    var l = words[currentSolutionNotFound].length;
    var s = scoreLen[l - minWordLength] * scoreDir[d];
    
    showWordAndHisScore(x, y, d, l, s); // show the selected solution and his score 

    for(var i = 0; i < l; i++)
        paintLetterInGrid(x + i*dx[d], y + i*dy[d], (isGreen[x + i*dx[d]][y + i*dy[d]]?colorType.cGreen:colorType.cGray));
}

function showCurrentSolutionNotFound()
{
    var x = wordPos[currentSolutionNotFound].x;
    var y = wordPos[currentSolutionNotFound].y;
    var d = wordPos[currentSolutionNotFound].d;
    var l = words[currentSolutionNotFound].length;
    var s = scoreLen[l - minWordLength] * scoreDir[d];
    
    showWordAndHisScore(x, y, d, l, s); // show the selected solution and his score 

    for(var i = 0; i < l; i++)
        paintLetterInGrid(x + i*dx[d], y + i*dy[d], colorType.cRed);
}

function showFirstSolutionNotFound(whatIsNew, msgPrefix)
{   // v2.4 : ajout "ou les compteurs de mots"
    var msg = msgPrefix + 'Vous pouvez voir les mots que vous n\'avez pas trouvés en touchant\n« < » et « > » ou les compteurs de mots.\n« % » affiche les stats.\nPour commencer\nune nouvelle ' + whatIsNew + ',\ntouchez à nouveau « Grille ».'; 
    alert('Solutions\n\n'+msg);
    status = choiceStatusType.csViewingSolutions; localStorage.status = status;
    refreshButtons();
    currentSolutionNotFound = -1;
    findNextSolutionNotFound(+1);
    showCurrentSolutionNotFound();
}

function showGridAndGameStatistics()
{
	var msg =	'Grille n°' + gridNumber + ' :\n' +
				'• Score à '+ Math.round((100*score)/maxScore) + '%.\n' +
				'• Bonus à '+ Math.round((100*bonus)/(2*maxBonus)) + '%.\n' +
				'• Total à '+ Math.round((100*(score+bonus))/(maxScore+(2*maxBonus))) + '%.' +
				'\n\nPartie :\n' +
				'• Score à '+ Math.round((100*gameScore)/maxGameScore) + '%.\n' +
				'• Bonus à '+ Math.round((100*gameBonus)/maxGameBonus) + '%.\n' +
				'• Total à '+ Math.round((100*(gameScore+gameBonus))/(maxGameScore+maxGameBonus)) + '%.';
	alert('Statistiques grille & partie\n\n'+msg);
}

// intialization for new game
function newGame(loadingGame)
{
    gameScore = 0; localStorage.maxScore = maxScore;
    gameBonus = 0; localStorage.maxBonus = maxBonus;
    maxGameScore = 0; localStorage.maxGameScore = maxGameScore;
    maxGameBonus = 0; localStorage.maxGameBonus = maxGameBonus;
    gridNumber = 1; localStorage.gridNumber = gridNumber;
    chances = 0; 
    chances += Math.min(99, Math.max(1, chancesAtTheBeginning + 1 - gridNumber)); 
    localStorage.chances = chances;
    status = choiceStatusType.csNoGame; localStorage.status = status;
    
    setup(true); // setup with new grid
}

function nextGrid(loadingGame)
{
    statsAndTops.registerGridStats();
    localStorage.chances = chances;
    statsAndTops.registerTops();
    gridNumber++; localStorage.gridNumber = gridNumber;
    chances += Math.min(99, Math.max(1, chancesAtTheBeginning + 1 - gridNumber)); 
    localStorage.chances = chances;
    status = choiceStatusType.csNoGame; localStorage.status = status;
    
    setup(true); // setup with new grid
}

function afficheSablier(affiche) // v1.4
{
	if (affiche) {
		imgSrcGrilleSvg = document.images[idGrille].src;
		document.images[idGrille].src = pngFolder + sablier + pngExt;
	}
	else
		document.images[idGrille].src = imgSrcGrilleSvg;
}

function afficheMots(n)// v2.4
{
    var showAll = (status == choiceStatusType.csViewingSolutions) || (score == maxScore);
    var wordlist = '';
    for(var i = idxByLength[n]; i < ((n>0)?idxByLength[n-1]:words.length); i++) {
        if (wordPos[i].found) 
            wordlist = wordlist + words[i] + ' ';
        else
            if (showAll)
                wordlist = wordlist + words[i].toLowerCase() + ' ';
    }
    if (wordlist == '')
        wordlist = 'Aucun mot trouvé ';
    return wordlist.substring(0, wordlist.length-1)+'.';
}

function clic(x) // v1.3 instead of click
{ 
 // x=...
 // 0~99    => grid 
 // 100     => word score (wordlist for debugging)
 // 101     => "grid" label (red/green) 
 // 102~104 => buttons (-/?/+) 
 // 105~108 => word counters (context help)
 // 109~111 => Score/Bonus/Total (context help)
 // 112     => grid number (context help)
 // 113     => chances counter (context help)
 // 114     => game score (context help)
 // 115     => last word found in the grid (context help)
 // 116		=> game score
 // 117		=> Last word found
 // 118     => dico def parameter
    var choice = parseInt(x);

	const infoTitle = 'Information';

	// v2.2 : on calcule en temps réel le nombre de mots du dico...
	var n=0;
	for(var i=0; i<dico.length; i++)
		n+=dico[i].length;
	var info    =	'Mélissimax version '+stVersion+'\n\n' +
					'Développé par Patrice Fouquet\n\n' +
					'http://patquoi.fr/Melissimax.html\nmelissimax@patquoi.fr\n\n' +
					'Dictionnaire : '+n+' mots (ODS'+stVerDico+')\n\n' + // v2.2 (n) 
					'Touchez « i » pour plus d\'infos.\n' +
                    'Touchez une zone pour plus d\'infos.';

    // It's a button...
    if ((choice >= firstButtonID) && (choice < firstWordCounterID) && parseInt(status)) {
        switch(parseInt(status)) {
            case choiceStatusType.csWaitingForFirstLetter:
            case choiceStatusType.csWaitingForLastLetter:
                newGridRequest = false;
                switch(choice) {
                    case 102: // (?)
                        alert('À propos de Mélissimax\n\n'+info);
                        break;
                    case 103: // (i)
                        alert('Bienvenue à Mélissimax\n\n'+welcomeMessage);
                        break;
                    case 104: // (%)
                        statsAndTops.displayStatsAndTops();
                        break;
                    default:
                        break;
                }
                if (choice != 104)
                    statsAndTopsStatus = statsAndTopsStatusType.satsTops; // v2.0 Top avant Stats
                break;
            case choiceStatusType.csViewingSolutions:
                switch(choice) {
                    case 102: // (-)
                        hideCurrentSolutionNotFound();
                        findNextSolutionNotFound(words.length - 1);
                        showCurrentSolutionNotFound();
                        break;
					case 103: // (%)
						showGridAndGameStatistics();
						break;
                    case 104: // (+)
                        hideCurrentSolutionNotFound();
                        findNextSolutionNotFound(+1);
                        showCurrentSolutionNotFound();
                        break;
                    default:
                        break;
                }
                statsAndTopsStatus = statsAndTopsStatusType.satsTops; // v2.0 Tops avant Stats
                break;
            default:
                statsAndTopsStatus = statsAndTopsStatusType.satsTops; // v2.0 Tops avant Stats
                break;
        }
        return;
    }

    statsAndTopsStatus = statsAndTopsStatusType.satsTops; // v2.0 Tops avant Stats
    
    // It's a context help...
    if ((choice >= firstWordCounterID) && (choice <= wordFoundID) && parseInt(status)) {
        if (parseInt(status) != choiceStatusType.csViewingSolutions)
            newGridRequest = false;
        if ((choice >= firstWordCounterID) && (choice <= firstWordCounterID + maxWordLength - minWordLength)) {
        	var stPourcents = numberToFind[choice-firstWordCounterID]?(' ('+Math.round((100*numberOfFound[choice-firstWordCounterID])/numberToFind[choice-firstWordCounterID]) +'%)'):''; // v1.4 (stPourcents) + above
            // v2.4 : Ajout afficheMots à la fin du message et suppression de la phrase avec la couleur verte.
            alert(infoTitle+'\n\nIl s\'agit du nombre de mots de '+(choice - firstWordCounterID + minWordLength)+' lettres que vous avez relevés parmi le nombre total à trouver'+stPourcents+'.\n\nVoici la liste des mots : '+afficheMots(choice - firstWordCounterID)); 
            return;
        }
        else {
            switch(choice) { // v2.0 : pourcents in help. v2.1 max instead of pourcents in help + text changes.
                case gridScoreID: 
                    alert(infoTitle+'\n\nIl s\'agit de votre score\net la part du score maximal\npossible dans la grille ('+maxScore+').\n\nLa couleur verte indique que vous avez obtenu le score maximal.');
                    break;
                case gridBonusID: 
                    alert(infoTitle+'\n\nIl s\'agit du bonus que vous avez gagné et la part du bonus maximal possible dans la grille ('+(2*maxBonus)+').\n\nLa couleur verte indique que vous avez obtenu le bonus maximal.\n\nVous avez un bonus à chaque fois que vous avez trouvé tous les mots d\'une même taille. Le bonus est doublé lorsque vous avez trouvé tous les mots de la grille.');
                    break;
                case gridTotalID: 
                    alert(infoTitle+'\n\nIl s\'agit de votre score total\n(score + bonus)\net la part du score total\nmaximal possible dans la grille ('+(2*maxBonus+maxScore)+').\n\nLa couleur verte indique que vous avez obtenu le score total maximal.');
                    break;
                case gameScoreID:
                    alert(infoTitle+'\n\nIl s\'agit de votre score de partie, cumul des scores et bonus toutes grilles confondues y compris ceux de la grille courante.');
                    break;
                case gridNumberID:
                    alert(infoTitle+'\n\nIl s\'agit du numéro\nde la grille courante.\n\nLa première grille\nporte le numéro « 01 ».');
                    break;
                case chancesCounterID:
                    alert(infoTitle+'\n\nIl s\'agit du nombre d\'erreur(s) que vous pouvez encore faire dans la partie. Vous avez droit à '+ chancesAtTheBeginning +' erreurs dans la première grille, puis '+ (chancesAtTheBeginning - 1) +' et ainsi de suite. Les chances non utilisées d\'une grille sont reportées sur la grille suivante.');
                    break;
                case wordFoundID:
                    alert(infoTitle+'\n\nIci est affiché le dernier mot\ntrouvé dans la grille.\n\nÀ côté est indiqué\nle score empoché.\n\nLa couleur des lettres\nreflète la situation avant\nla découverte du mot.');
                    break;
            }
            return;
        }
    } 
    
    // Grid label
    if (choice == gridLabelID) {
        if (numberOfGreenLetters < numberOfCellsBySide * numberOfCellsBySide) {
            if (!newGridRequest) {
                alert('Abandonner ?\n\nVous n\'avez pas verdi toute la grille. Voulez-vous abandonner et recommencer une nouvelle partie ?\n\nPour confirmer,\ntouchez à nouveau « Grille ».');
                newGridRequest = true;
            }
            else {
                if (parseInt(status) == choiceStatusType.csViewingSolutions) {
                    newGridRequest = false;
                    statsAndTops.registerGridStats();
                    statsAndTops.registerGameStats();
                    statsAndTops.registerTops();
					afficheSablier(true); // v1.4
        			setTimeout(function() { // v1.4
        				newGame(false);
                   		afficheSablier(false); // v1.4
                   	}, 500); // v1.4
                }
                else 
                    showFirstSolutionNotFound('partie', '');
            }
        }
        else {
            if (!newGridRequest) {
                alert('Grille suivante ?\n\nVous avez verdi toute la grille : vous pouvez continuer la partie sur une nouvelle grille.\n\nPour confirmer,\ntouchez à nouveau « Grille ».');
                newGridRequest = true;
            }
            else {
                if ((parseInt(status) == choiceStatusType.csViewingSolutions)||
					(score == maxScore)) {
                    newGridRequest = false;
					afficheSablier(true); // v1.4
        			setTimeout(function() { // v1.4
                    	nextGrid(false);
                   		afficheSablier(false); // v1.4
                   	}, 500); // v1.4
                }
                else
                    showFirstSolutionNotFound('manche', '');
            }
        }
        return;
    }

    if (parseInt(status) == choiceStatusType.csViewingSolutions)
        return;
    
    // From this point no command available in csViewingSolutions status.      

    newGridRequest = false;

	if ((choice == dicoDefPrmID) && // v1.4
		(document.images[idDefLnkImg].src[document.images[idDefLnkImg].src.length-5][0] != fond[0])) { 
		dicoDef = (dicoDef + 1) % nbDicosDef; // Changement du dictionnaire de définitions
		localStorage.ddd = dicoDef;
		document.images[idDefPrmImg].src = pngFolder + pngDico[dicoDef] + pngExt; 
		document.links[idDefLnkLnk].href = lnkDico[dicoDef] + stDrnMotForme;
		if (dicoDef==nbDicosDef-1)
			document.links[idDefLnkLnk].href = document.links[idDefLnkLnk].href.toLowerCase() + extHTM; // v1.5.1 - toLowerCase()
		if (affichagesChgtDico < nbDicosDef) { 
			alert('Vous changez de dictionnaire de définitions pour...\n\n' + nomDico[dicoDef] + '\n\nQuand un mot est affiché à gauche du livre ouvert, touchez "?" pour accéder à la définition sur le site choisi ci-dessus.'); 
			affichagesChgtDico++;
			localStorage.acd = affichagesChgtDico;
		}
		return;
	}
    if (choice == wordScoreID) {
        /*    
		var wordList = '';
		for(var i = 0; i < words.length; i++)
			wordList = wordList + words[i] + ' ';
        alert('Liste de mots :\n\n'+wordList);
        */
        if (document.images['wsu'].src[document.images['wsu'].src.length-5][0] != fond[0]) // v1.4
			alert(infoTitle+'\n\n\Il s\'agit du score du dernier mot trouvé affiché à gauche.');
        return;
    }
    
    if ((choice < 100) && parseInt(status)) { 

        xChoice[status - 1] = choice % 10;
        yChoice[status - 1] = Math.floor(choice / 10);
        switch(parseInt(status)) { // parseInt car Javascript le prend pour une chaîne alors qu'il est initialisé avec une constante entière... Cherchez l'erreur
            case choiceStatusType.csWaitingForFirstLetter:
                paintLetterInGrid(xChoice[0], yChoice[0], colorType.cRed);
                registerChoice();
                status = choiceStatusType.csWaitingForLastLetter; localStorage.status = status;
                if (!selectMsg) {
                    selectMsg = true; localStorage.selectMsg = true;
                    alert('Sélection d\'un mot\n\nPour sélectionner un mot dans la grille, touchez la première lettre (qui s\'affiche alors en rouge) puis la dernière lettre du mot dans le sens de lecture.\n\nLes lettres du mot se verdissent dans la grille et le mot apparaît sous les compteurs avec le score empoché.');
                }
                break;
            case choiceStatusType.csWaitingForLastLetter:
                paintLetterInGrid(xChoice[0], yChoice[0], (isGreen[xChoice[0]][yChoice[0]]?colorType.cGreen:colorType.cGray)); // return to the original color of the first letter 
                if ((xChoice[0] == xChoice[1]) && (yChoice[0] == yChoice[1])) {
                    registerChoice();
                    status = choiceStatusType.csWaitingForFirstLetter; localStorage.status = status;
                    return; // same choice = reset
                }
                dxChoice = xChoice[1] - xChoice[0];
                dyChoice = yChoice[1] - yChoice[0];
                
                if (((!dxChoice) && (Math.abs(dyChoice) + 1 >= minWordLength)) || // Vertically at least 5 letters
                    ((!dyChoice) && (Math.abs(dxChoice) + 1 >= minWordLength)) || // Horizontally at least 5 letters
                    ((Math.abs(dxChoice) == Math.abs(dyChoice)) && (Math.abs(dxChoice) + 1 >= minWordLength))) { // Choice is valid then let's test the word...
                    lChoice = Math.abs(dxChoice) + 1;
                    // Let's define the direction (dChoice, lChoice)...
                    if (!dyChoice) // Horizontally
                        if (dxChoice > 0)
                            dChoice = dirType.dE;
                        else
                            dChoice = dirType.dW;
                    
                    else
                        if (!dxChoice) { // Vertically
                            if (dyChoice > 0)
                                dChoice = dirType.dS;
                            else
                                dChoice = dirType.dN;
                            lChoice = Math.abs(dyChoice) + 1;
                        }
                        else // diagonally
                            if (dxChoice > 0)
                                if (dyChoice > 0)
                                    dChoice = dirType.dSE;
                                else
                                    dChoice = dirType.dNE;
                            else
                                if (dyChoice > 0)
                                    dChoice = dirType.dSW;
                                else
                                    dChoice = dirType.dNW;
                    wordChoice = '';
                    for( var i = 0; i < lChoice; i++)
                        wordChoice = wordChoice + grid[xChoice[0]+i*dx[dChoice]][yChoice[0]+i*dy[dChoice]];
                    registerChoice();
                    //alert(wordChoice + ', ' + isValid(wordChoice) + ', ' + words.indexOf(wordChoice));   
                    
                    status = choiceStatusType.csWaitingForFirstLetter; localStorage.status = status;
                    
                    // let's watch the word selected...
                    if (isValid(wordChoice)) { 
                        //alert('Mot valide');
                        var wordIndex = words.indexOf(wordChoice);
                        if (wordIndex == -1) { // ...but the word is not found in the list... abnormal program termination...
                            alert( 'Anomalie !\n\nLe mot existe mais n\'a pas été relevé !');
                            return;
                        }
                        else { // valid word and word found in the list...  
                            //alert('Mot dans la liste...');
                            wordPosFound = false;
                            do { // searching in the wordlist in case of multiple occurrences...
                                var x = wordPos[wordIndex].x;
                                var y = wordPos[wordIndex].y;
                                var d = wordPos[wordIndex].d;
                                var l = words[wordIndex].length;
                                var s = scoreLen[l - minWordLength] * scoreDir[d];
                                if ((x == xChoice[0]) && (y == yChoice[0]) && (d == dChoice)) {
                                    if (wordPos[wordIndex].found) { // word already found
                                        alert('Attention !\n\nLe mot '+words[wordIndex]+' a déjà été trouvé dans cette position.');
                                        return;
                                    }
                                    else { // new word found
                                        wordPos[wordIndex].found = true;
                                        localStorage.setItem('wordPosFound'+wordIndex, wordPos[wordIndex].found);
                                        showWordAndHisScore(x, y, d, l, s); // show the selected word and his score before the letters become green
                                        for( var i = 0; i < l; i++) {
                                            var X = x+i*dx[d];
                                            var Y = y+i*dy[d];
                                            if (!isGreen[X][Y]) {
                                                isGreen[X][Y] = true; localStorage.setItem('isGreen'+(X)+(Y), isGreen[X][Y]);
                                                numberOfGreenLetters++; localStorage.numberOfGreenLetters = numberOfGreenLetters;
                                                paintLetterInGrid(X, Y, colorType.cGreen);
                                            }
                                        }
                                        wordPosFound = true;
                                        calculateAndRefreshScores(l, s);
                                        if (score == maxScore) {
                                            alert('Bravo !\n\Vous avez trouvé tous les mots de la grille !\n\nPour passer à la manche suivante, touchez « Grille » et patientez jusqu\'à ce qu\'une nouvelle grille apparaisse.');
                                            newGridRequest = true; // To avoid the warning message when the player touches "Grid".
                                        }
                                        break; // do while
                                    }
                                }
                            } 
                            while((wordIndex = words.indexOf(wordChoice, wordIndex + 1)) > -1);                
                            if (!wordPosFound) {
                                alert('Anomalie !\n\nLe mot existe et a été relevé mais pas dans la position et la direction sélectionnée !');
                                return;
                            }
                        }
                    }
                    else {
                        var msgPrefix = 'Le mot ' + wordChoice + ' n\'est pas valable.\n';
                        chances--; localStorage.chances = chances;
                        if (chances >= 0) { 
                            refreshDigit(Math.floor(chances / 10) % 10, 'tcb', 'o');
                            refreshDigit(chances % 10, 'ucb', 'o');
                            if (chances > 0)
                                alert('Mot non valable\n\n'+msgPrefix + '\nIl vous reste encore\n' + chances + ' chance' + ((chances > 1)?'s':'') + ' de vous tromper.');
                            else {
                                var newSrc;
                                newSrc = pngFolder + 'chancesx.png';
                                document.images['chances'].src = newSrc;
                                alert('Mot non valable\n\n'+msgPrefix + '\nAttention !\nvous n\'avez plus droit à l\'erreur !');
                            }
                        }
                        else {
                            var msg = msgPrefix;
                            chances++; localStorage.chances = chances;
                            if (numberOfGreenLetters < numberOfCellsBySide * numberOfCellsBySide) 
                                msg = msg + 'Vous avez épuisé\ntoutes vos chances.\nLa partie est terminée !\n\n';
                            else
                                msg = msg + 'Vous avez épuisé toutes vos chances mais comme vous avez verdi toute la grille, vous passez à la grille suivante.\n\n';
                            newGridRequest = true; // To avoid the warning message when the player touches "Grid".
                            showFirstSolutionNotFound('partie', msg);
                        }
                        return;
                    }
                    return; 
                }
                else { // not enough letters then lastletter become first letters
                    xChoice[0] = xChoice[1];
                    yChoice[0] = yChoice[1];
                    paintLetterInGrid(xChoice[0], yChoice[0], colorType.cRed);
                    registerChoice();
                    return;
                }
                break;
            default: 
                //alert('default');
                break;
        }
        return;
    } // end of if (choice < 100)
}

