/*
  
  File:Mélélémo.js
  Abstract: JavaScript for the index.html file
  
  Version: <1.2.1>
  
  Copyright (C) 2018 Patrice Fouquet. All Rights Reserved.
 
 */ 

/*
Version 1.1 (v2.4 MélissimoT)
 - Clic sur les compteurs de mots : on affiche les mots (trouvés/tous si manche terminée)
Version 1.2 
 - Ajout d'une cas "Oun" (issus de Diplikata 1.8 avec le nouveau jeton "Oun")
Version 1.2.1 : Règles d'utilisation des jetons "Oun" et "Ng" issus de Diplikata 1.8.1.1 (dico/anagrammes/tirages)
*/

// ---------
// Constants
// ---------

// Mélélémo 1.0 créé à partir de MélissimoT v2.3
const stVersion 			= '1.2.1'; // (Mélélémo 1.1 = MélissimoT 2.4) 

// Font of letters : Arial Rounded MT bold. Size 35 (green/red/gray).

const numberOfCellsBySide 	=  8; 
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
const pngExt				= '.png'; 
const fond					= '*'; 
const colorType             = new buildColorType();
const letterColorSuffix     = ['x', 'y', 'p', 'm', 'b'];
const idGrille				= 'grille' 
const prmDico			 	= 'dico'; 
const hrefDef			 	= 'def'; 
const sablier			 	= 'sablier'; 

// inline dictionaries
const nbDicosDef		 = 1;
const nomDico			 = ['Référence-Haïti'];
const pngDico            = ['dico-rh'];
const lnkDico			 = ['https://www.haiti-reference.com/pages/creole/diction/display.php?action=search&word='];
const idDefPrmImg		 = 'dd';
const idDefLnkImg		 = 'dl';
const idDefLnkLnk		 = 'll';
 
// Scores                      5,6,7,8-letter word
const scoreLen              = [5,3,2,1]; // word score = scoreLen * scoreDir 

// keyboard
const numberOfButtons       = 3;
const keyboard              = [['*','*','*'], // no action during building grid
                               ['i','a','s'], // (?) (i) (%)
                               ['i','a','s'], // (?) (i) (%)
                               ['m','s','p']] // (-) (%) (+)

 
// Dimensions
const counterDigitWidth         =  11;
const counterSeparatorWidth     =  12;
const counterMarginWidth        =  32;
const wordScoreDigitWidth       =  11;
const wordScoreMarginWidth      =  32;
const wordScoreLetterWidth      =  24;
const wordScoreDefPrmWidth		=  28; 
const wordScoreDefLnkWidth      =  14; 
const pointsGridDigitWidth      =  11;
const gridAndChancesDigitWidth  =  11; // Grid & Chances digits
const pointsGameDigitWidth      =  16;
const pointsLabelWidth          =  58;
const pointsMarginWidth         =  32;
const gridAndChancesLabelWidth  =  27; // Grid & Chances labels
const buttonWidth               =  33;

// onclick ids
// x=...
// 0~63    => grid 
const dicoDefPrmID				=  99; 
const wordScoreID               = 100; // wordlist for debugging
const gridLabelID               = 101;
const firstButtonID             = 102; // Buttons = 102/103/104
const firstWordCounterID        = 105; // Word counters = 105 (5), 106 (6), 107 (7), 108 (8)
const gridScoreID               = 109;
const gridBonusID               = 110;
const gridTotalID               = 111;
const gridNumberID              = 112;
const chancesCounterID          = 113;
const gameScoreID               = 114;
const wordFoundID               = 115;

// chances
const chancesAtTheBeginning     =  10;

// Status
const choiceStatusType      = new buildChoiceStatusType();
const statsAndTopsStatusType= new buildStatsAndTopsStatusType();

const welcomeMessage = 'Bienvenue dans Mélélémo.\n\nVous devez trouver les mots de 5 à 8 lettres cachés dans la grille, horizontalement, verticalement ou en diagonale dans les deux sens.\n\nAprès chaque mot découvert, les lettres de celui-ci se verdissent. La manche est gagnée lorsque toute la grille est verte. Il n\'est pas nécessaire de découvrir tous les mots de la grille mais un bonus est accordé si tous les mots sont découverts.';

// localStorage
const lsGrid				= 'grid'; 
 
// Dictionary
const minWordLength 		= 5;
const maxWordLength         = 8;

// numberOfWords[x] is loaded one time with dico[x].length in loadGame function
var numberOfWords 		= new Array (0, 0, 0, 0);

// ---------
// Variables
// ---------

// grid build
var lettersToFind = numberOfCellsBySide * numberOfCellsBySide; // not saved: for building grid only
var grid = []; 
var isGreen = []; 
var words = []; 	// list of words for searching 
var wordPos = []; 	// word infos (x0, y0), direction, found (true/false)
var idxByLength = [0, 0, 0, 0]; // index in words & wordPos of the first entry (0 = 5-letter ; 1 = 6-letter...)
var numberOfFound = [0, 0, 0, 0]; // number of words found (0 = 5-letter ; 1 = 6-letter...)
var numberToFind = [0, 0, 0, 0]; // number of words to find (0 = 5-letter ; 1 = 6-letter...)
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
var imgSrcGrilleSvg = ''; // Sauvegarde de la png pendant affichage du sablier

// stats & tops
var statsAndTops        = new loadStatsAndTops();
var statsAndTopsStatus  = statsAndTopsStatusType.satsTops; // tops avant stats

// Inline Definition dictionaries
var dicoDef = 0; // Par défaut = cnrtl
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
    this.satsTops                   = 0; 
    this.satsStats                  = 1; 
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
        this.topGrid5LWToFnd    = parseInt(localStorage.topGrid5LWToFnd);
        this.topGrid6LWToFnd    = parseInt(localStorage.topGrid6LWToFnd);
        this.topGrid7LWToFnd    = parseInt(localStorage.topGrid7LWToFnd);
        this.topGrid8LWToFnd    = parseInt(localStorage.topGrid8LWToFnd);
        
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
        this.topGrid5LWToFnd    = 0;
        this.topGrid6LWToFnd    = 0;
        this.topGrid7LWToFnd    = 0;
        this.topGrid8LWToFnd    = 0;

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
        this.statGrid5LWToFnd   = parseInt(localStorage.statGrid5LWToFnd);
        this.statGrid6LWToFnd   = parseInt(localStorage.statGrid6LWToFnd);
        this.statGrid7LWToFnd   = parseInt(localStorage.statGrid7LWToFnd);
        this.statGrid8LWToFnd   = parseInt(localStorage.statGrid8LWToFnd);
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
        this.statGrid5LWToFnd   = 0;
        this.statGrid6LWToFnd   = 0;
        this.statGrid7LWToFnd   = 0;
        this.statGrid8LWToFnd   = 0;
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
    this.topGrid5LWToFnd    = 0;
    this.topGrid6LWToFnd    = 0;
    this.topGrid7LWToFnd    = 0;
    this.topGrid8LWToFnd    = 0;

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
    this.statGrid5LWToFnd   = 0;
    this.statGrid6LWToFnd   = 0;
    this.statGrid7LWToFnd   = 0;
    this.statGrid8LWToFnd   = 0;

    this.statGames          = 0;
    this.statGameScore      = 0;
    this.statGameBonus      = 0;
    this.statGameTotal      = 0;
    
    localStorage.removeItem('tops');
    localStorage.removeItem('gridStats');
    localStorage.removeItem('gameStats');
    
    alert('Statistiques et tops remis à zéro.');
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
    if (numberToFind[0]         > this.topGrid5LWToFnd) { this.topGrid5LWToFnd = numberToFind[0];       localStorage.topGrid5LWToFnd = numberToFind[0]; }
    if (numberToFind[1]         > this.topGrid6LWToFnd) { this.topGrid6LWToFnd = numberToFind[1];       localStorage.topGrid6LWToFnd = numberToFind[1]; }
    if (numberToFind[2]         > this.topGrid7LWToFnd) { this.topGrid7LWToFnd = numberToFind[2];       localStorage.topGrid7LWToFnd = numberToFind[2]; }
    if (numberToFind[3]         > this.topGrid8LWToFnd) { this.topGrid8LWToFnd = numberToFind[3];       localStorage.topGrid8LWToFnd = numberToFind[3]; }
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
    localStorage.topGrid5LWToFnd = this.topGrid5LWToFnd;
    localStorage.topGrid6LWToFnd = this.topGrid6LWToFnd;
    localStorage.topGrid7LWToFnd = this.topGrid7LWToFnd;
    localStorage.topGrid8LWToFnd = this.topGrid8LWToFnd;
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
    this.statGrid5LWToFnd   += numberToFind[0];
    this.statGrid6LWToFnd   += numberToFind[1];
    this.statGrid7LWToFnd   += numberToFind[2];
    this.statGrid8LWToFnd   += numberToFind[3];
    
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
    localStorage.statGrid5LWToFnd   = this.statGrid5LWToFnd;
    localStorage.statGrid6LWToFnd   = this.statGrid6LWToFnd;
    localStorage.statGrid7LWToFnd   = this.statGrid7LWToFnd;
    localStorage.statGrid8LWToFnd   = this.statGrid8LWToFnd;
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
    switch(statsAndTopsStatus) {
        case statsAndTopsStatusType.satsStats: // stats
            const msgNextStatus1 = '\nTouchez « % » pour initialiser stats & tops.'; 
            var msgStatGames = (this.statGames?'Sur '+this.statGames+' partie'+(this.statGames>1?'s':'')+
                                               ', vous avez en moyenne...\n• un score de '+Math.round(this.statGameScore/this.statGames)+
                                               ',\n• un bonus de '+Math.round(this.statGameBonus/this.statGames)+
                                               ',\n• un total de '+Math.round(this.statGameTotal/this.statGames)+'.\n\n':
                                               '');
            var msgStatGrids = (this.statGrids?'Sur '+this.statGrids+' grille'+(this.statGrids>1?'s':'')+
                                               ', vous avez en moyenne...\n• un score de '+Math.round(this.statGridScore/this.statGrids)+' ('+Math.round((100*this.statGridScore)/this.statGridMaxScore)+
                                               '%),\n• un bonus de '+                      Math.round(this.statGridBonus/this.statGrids)+' ('+Math.round((100*this.statGridBonus)/(2*this.statGridMaxBonus))+
                                               '%),\n• un total de '+                      Math.round(this.statGridTotal/this.statGrids)+' ('+Math.round((100*this.statGridTotal)/this.statGridMaxTotal)+
                                               '%),\n• trouvé '+                           Math.round(this.statGrid5LWFound/this.statGrids)+' mot'+(Math.round(this.statGrid5LWFound/this.statGrids)>1?'s':'')+' de 5 lettres'+(this.statGrid5LWToFnd?(' ('+Math.round((100*this.statGrid5LWFound/this.statGrid5LWToFnd))+'%)'):'')+
                                               ',\n• trouvé '+                             Math.round(this.statGrid6LWFound/this.statGrids)+' mot'+(Math.round(this.statGrid6LWFound/this.statGrids)>1?'s':'')+' de 6 lettres'+(this.statGrid6LWToFnd?(' ('+Math.round((100*this.statGrid6LWFound/this.statGrid6LWToFnd))+'%)'):'')+
                                               ',\n• trouvé '+                             Math.round(this.statGrid7LWFound/this.statGrids)+' mot'+(Math.round(this.statGrid7LWFound/this.statGrids)>1?'s':'')+' de 7 lettres'+(this.statGrid7LWToFnd?(' ('+Math.round((100*this.statGrid7LWFound/this.statGrid7LWToFnd))+'%)'):'')+
                                               ',\n• trouvé '+                             Math.round(this.statGrid8LWFound/this.statGrids)+' mot'+(Math.round(this.statGrid8LWFound/this.statGrids)>1?'s':'')+' de 8 lettres'+(this.statGrid8LWToFnd?(' ('+Math.round((100*this.statGrid8LWFound/this.statGrid8LWToFnd))+'%)'):'')+
                                               '.':
                                               '');
            if (msgStatGames+msgStatGrids == '') 
                alert('Il n\'y a aucune statistique.\n'+msgNextStatus1);
            else
                alert(msgStatGames+msgStatGrids+msgNextStatus1);
            break;
        case statsAndTopsStatusType.satsTops: // tops
            const msgNextStatus2 = '\nTouchez « % » pour voir les stats.';  
            var msgTopGames = 'Score '+this.topGameScore+' • Bonus '+this.topGameBonus+'\nTotal '+this.topGameTotal+' • Grilles '+this.topGridNumber+' • Chances '+this.topChances;
            var msgTopGrids = 'Score '+this.topGridScore+' • Bonus '+this.topGridBonus+' • Total '+this.topGridTotal+'\n'+ // v2.1 : max values in tops no longer exist
                              this.topGrid5LWFound+' mots de 5 lettres\n'+ 
                              this.topGrid6LWFound+' mots de 6 lettres\n'+ 
                              this.topGrid7LWFound+' mots de 7 lettres\n'+ 
                              this.topGrid8LWFound+' mots de 8 lettres\n'; 
            alert('Tops parties\n\n'+msgTopGames+'\n\nTops grilles\n\n'+msgTopGrids+msgNextStatus2);                  
            break;
        case statsAndTopsStatusType.satsRequest: // reset
            alert('Êtes-vous sûr(e) de vouloir réinitialiser les statistiques et les tops ?\n\nPour confirmer, touchez à nouveau « % ».'); 
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
            refreshDenominator(numberToFind[i], 0, 2, (minWordLength + i) + '', color); 
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
        refreshDenominator(maxScore, score, 4, 's', 'x'); 
        refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'x'); 
        refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'x'); 
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

function refreshDigit(digit, id, pngSuffix, space) 
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
 if ((idSuffix<minWordLength.toString()) || (idSuffix>maxWordLength.toString())) 
 	switch(idSuffix) {
 		case 's': refreshDenominator(maxScore, number, 4, idSuffix, pngSuffix); break;
 		case 'b': refreshDenominator(2 * maxBonus, number, 4, idSuffix, pngSuffix); break;
 		case 't': refreshDenominator(maxScore + 2 * maxBonus, number, 4, idSuffix, pngSuffix); break;
 	}
}
 
function refreshDenominator(maxNumber, number, numberLength, idSuffix, pngSuffix) 
{
 var n = maxNumber; 
 var pourcents = false;
 if ((idSuffix<minWordLength.toString()) || (idSuffix>maxWordLength.toString())) { 
 	n = 10 *Math.round((100*number)/maxNumber); 
 	pourcents = true;
 }
 var s = Math.floor(n / 1000) % 10;
 var h = Math.floor(n / 100) % 10; 
 var t = Math.floor(n / 10) % 10; 
 if  (numberLength >= 4)
	refreshDigit(s, 'sd' + idSuffix, pngSuffix, true);
 if  (numberLength >= 3)
    refreshDigit(h, 'hd' + idSuffix, pngSuffix, !s); 
 refreshDigit(t, 'td' + idSuffix, pngSuffix); 
 if (pourcents) // v2.1
	document.images['ud'+idSuffix].src = pngFolder+'!'+pngSuffix+'.png'; 
 else
 	refreshDigit(n % 10, 'ud' + idSuffix, pngSuffix);    
}
 
function addPointsType(row, pngName)
{
    var col = document.createElement('td');
    var img = document.createElement('img'); 
    img.setAttribute('src', pngFolder+pngName+'.png');
    img.setAttribute('width', pointsLabelWidth);
    img.setAttribute('height', 24);
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
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
}

function addSeparator(row, width)
{
    var col = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute('src', pngFolder+'*.png');
    img.setAttribute('width', width);
    img.setAttribute('height', 24);
    col.appendChild(img);
    row.appendChild(col);			
}

function addGameScore(row, suffix)
{
	var gsab = gameScore + gameBonus;
    if (suffix == 's') {
        for(var i = 0; i < numberOfButtons; i++) 
            addButton(row, i);
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
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(gridNumber / 10)) + 'o.png');
        img.setAttribute('id', 'tgb');
        img.setAttribute('onclick', 'clic('+gridNumberID+')'); 
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (gridNumber % 10) + 'o.png');
        img.setAttribute('id', 'ugb');
        img.setAttribute('onclick', 'clic('+gridNumberID+')'); 
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);
        row.appendChild(col);
        
        addSeparator(row, 1); // separator between grid number and chances counter : 99 = 27+2x11 + 1 + 27+2x11
        
        // chances counter
        var col = document.createElement('td');
        var img = document.createElement('img'); 
        img.setAttribute('src', pngFolder+'chances'+(chances?'v':'x')+'.png'); // font: Gloucester MT Extra Condensed, Extra-Condensed
        img.setAttribute('onclick', 'clic('+chancesCounterID+')'); 
        img.setAttribute('id', 'chances');
        img.setAttribute('width', gridAndChancesLabelWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(chances / 10)) + 'o.png');
        img.setAttribute('id', 'tcb');
        img.setAttribute('onclick', 'clic('+chancesCounterID+')'); 
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (chances % 10) + 'o.png');
        img.setAttribute('id', 'ucb');
        img.setAttribute('onclick', 'clic('+chancesCounterID+')'); 
        img.setAttribute('width', gridAndChancesDigitWidth);
        img.setAttribute('height', 24);
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
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // tens of thouSands 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 10000) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')'); 
        img.setAttribute('id', 'ngs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // thouSands 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 1000) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')'); 
        img.setAttribute('id', 'sgs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        
        addSeparator(row, 3); // thousand separator! : 99 = 3x16 + 3 + 3x16
        
        var col = document.createElement('td');
        var img = document.createElement('img'); // Hundreds 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 100) % 10) + 'o.png');
        img.setAttribute('onclick', 'clic('+gameScoreID+')'); 
        img.setAttribute('id', 'hgs');
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Tens 
        img.setAttribute('src', pngFolder + (Math.floor(gsab / 10) % 10) + 'o.png');
        img.setAttribute('id', 'tgs');
        img.setAttribute('onclick', 'clic('+gameScoreID+')'); 
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
        var col = document.createElement('td');
        var img = document.createElement('img'); // Units 
        img.setAttribute('src', pngFolder + (gsab % 10) + 'o.png');
        img.setAttribute('id', 'ugs');
        img.setAttribute('onclick', 'clic('+gameScoreID+')'); 
        img.setAttribute('width', pointsGameDigitWidth);
        img.setAttribute('height', 24);
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
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Hundreds of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'hn'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'tn'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'un'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Division Separator
    img.setAttribute('src', pngFolder+'*.png'); 
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // thouSands of Denominator
    img.setAttribute('src', pngFolder+'*.png'); 
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'sd'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Hundreds of Denominator
    img.setAttribute('src', pngFolder+'*.png'); 
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'hd'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'td'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Denominator
    img.setAttribute('src', pngFolder+'!x.png'); 
    img.setAttribute('onclick', 'clic('+gridPointsID+')'); 
    img.setAttribute('id', 'ud'+suffix);
    img.setAttribute('width', pointsGridDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
}

function addPointsRow(pointsType)
{
    var scoreTable = document.getElementById(pointsType);
    removeAllChildren(scoreTable);
	var row = document.createElement('tr');
    addSeparator(row, pointsMarginWidth);
    addGameScore(row, pointsType[0]);
    addPointsType(row, pointsType);
    addGridScore(row, pointsType[0]);
    addSeparator(row, pointsMarginWidth);
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
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Numerator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'un'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')'); 
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Division Separator
    img.setAttribute('src', pngFolder+'-o.png');
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')'); 
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Tens of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'td'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')'); 
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
    var col = document.createElement('td');
    var img = document.createElement('img'); // Units of Denominator
    img.setAttribute('src', pngFolder+'0x.png');
    img.setAttribute('id', 'ud'+suffix);
    img.setAttribute('onclick', 'clic('+(firstWordCounterID+suffix-minWordLength)+')'); 
    img.setAttribute('width', counterDigitWidth);
    img.setAttribute('height', 24);
    col.appendChild(img);			
    row.appendChild(col);
}

function addWordDefButtons(row) 
{
	// definition website choice
    var col = document.createElement('td');
    var img = document.createElement('img'); // parameter: website choice
   	img.setAttribute('src', pngFolder + fond + pngExt); 
    img.setAttribute('id', idDefPrmImg);
    img.setAttribute('onclick', 'clic('+dicoDefPrmID+')'); 
    img.setAttribute('width', wordScoreDefPrmWidth);
    img.setAttribute('height', 24);
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
    img.setAttribute('height', 24);
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
        refreshDenominator(numberToFind[i], 0, 2, (minWordLength + i) + '', (numberToFind[i]?'x':'o')); 
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
    
    refreshDenominator(maxScore, score, 4, 's', 'x'); 
    refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'x'); 
    refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'x'); 
    
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
                    imgSrcGrilleSvg = pngFolder + 'grillev.png'; 
                    document.images[idGrille].src = imgSrcGrilleSvg;
                    alert('Une partie est en cours.\nVous avez déjà verdi toute la grille.\n\nVous pouvez passer à une nouvelle en touchant\n« Grille » ou continuer à trouver tous les mots pour toucher les bonus.'); 
                }
                else
                    if (!numberOfGreenLetters)
                        if (gridNumber==1)
                            alert('Voici une nouvelle partie...'); 
                        else
                            alert('Une partie est en cours...\n\nVoici une nouvelle grille...');
                    else
                        alert('Une partie est en cours...'); 
                break;
            case choiceStatusType.csWaitingForLastLetter:
                paintLetterInGrid(xChoice[0], yChoice[0], colorType.cRed);
                alert('Une partie est en cours.\n\nVous avez déjà sélectionné la première lettre d\'un mot...');
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
			img.setAttribute('width', 32);
			img.setAttribute('height', 32);
			col.appendChild(img);			
			row.appendChild(col);
		}
		gridTable.appendChild(row);
	}
	
    // 2. counters
    var countersTable = document.getElementById('counters');
    removeAllChildren(countersTable);
    var row = document.createElement('tr');
    addSeparator(row, counterMarginWidth);
    addCounter(row, 5);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 6);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 7);
    addSeparator(row, counterSeparatorWidth);
    addCounter(row, 8);
    addSeparator(row, counterMarginWidth);
    countersTable.appendChild(row);

    // 3. word found and his score
    var wordTable = document.getElementById('word');
    removeAllChildren(wordTable);
    // 3a. word found
	var row = document.createElement('tr');
    addSeparator(row, wordScoreMarginWidth);
    for( var x = 0; x < maxWordLength; x++ ) {
        var col = document.createElement('td');
        var img = document.createElement('img');
        img.setAttribute('src', pngFolder+'*.png');
        img.setAttribute('onclick', 'clic('+wordFoundID+')'); 
        img.setAttribute('id', 'w'+x);
        img.setAttribute('width', wordScoreLetterWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
    }
    // 3b. word score
    for( var x = 0; x < 2; x++ ) {
        var col = document.createElement('td');
        var img = document.createElement('img');
        img.setAttribute('src', pngFolder+'*.png'); // on affiche pas '00'
		img.setAttribute('onclick', 'clic('+wordScoreID+')'); 
        if (x) 
            img.setAttribute('id', 'wsu'); // word score units
        else
            img.setAttribute('id', 'wst'); // word score tens
        img.setAttribute('width', counterDigitWidth);
        img.setAttribute('height', 24);
        col.appendChild(img);			
        row.appendChild(col);
    }
    // 3c. word definition (parameter & links)
    addWordDefButtons(row); 
    
    addSeparator(row, wordScoreMarginWidth);
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

	// Dictionnaire de définition 
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
    // numberOfWords[x] is loaded one time with dico[x].length in loadGame function
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

// new access of dico
function countWordsLike(filter) // returns integer
{
	var n = 0;
	var numberOfLetters = filter.length;
	for(var i = 0; i < numberOfWords[numberOfLetters-minWordLength]; i++) {
			if (((filter[0] == '-') || (filter[0] == dico[numberOfLetters-minWordLength][i][0])) &&
			    ((filter[1] == '-') || (filter[1] == dico[numberOfLetters-minWordLength][i][1])) &&
			    ((filter[2] == '-') || (filter[2] == dico[numberOfLetters-minWordLength][i][2])) &&
			    ((filter[3] == '-') || (filter[3] == dico[numberOfLetters-minWordLength][i][3])) &&
			    ((filter[4] == '-') || (filter[4] == dico[numberOfLetters-minWordLength][i][4])) &&
			    ((numberOfLetters-minWordLength < 1) || (filter[5] == '-') || (filter[5] == dico[numberOfLetters-minWordLength][i][5])) &&
			    ((numberOfLetters-minWordLength < 2) || (filter[6] == '-') || (filter[6] == dico[numberOfLetters-minWordLength][i][6])) &&
			    ((numberOfLetters-minWordLength < 3) || (filter[7] == '-') || (filter[7] == dico[numberOfLetters-minWordLength][i][7])))
				n++;
		}
	return n;
}

// new access of dico
function chooseWordLike(filter)
{
	var numberOfLetters = filter.length;
	var wordIndex = 0;
	var n = 0;
	if (numberOfLetters  == 1) {
		numberOfLetters = parseInt(filter);
		wordIndex = Math.floor(Math.random() * numberOfWords[numberOfLetters - minWordLength]);
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
	for(var i = 0; i < numberOfWords[numberOfLetters-minWordLength]; i++) {
			if (((filter[0] == '-') || (filter[0] == dico[numberOfLetters-minWordLength][i][0])) &&
			    ((filter[1] == '-') || (filter[1] == dico[numberOfLetters-minWordLength][i][1])) &&
			    ((filter[2] == '-') || (filter[2] == dico[numberOfLetters-minWordLength][i][2])) &&
			    ((filter[3] == '-') || (filter[3] == dico[numberOfLetters-minWordLength][i][3])) &&
			    ((filter[4] == '-') || (filter[4] == dico[numberOfLetters-minWordLength][i][4])) &&
			    ((numberOfLetters-minWordLength < 1) || (filter[5] == '-') || (filter[5] == dico[numberOfLetters-minWordLength][i][5])) &&
			    ((numberOfLetters-minWordLength < 2) || (filter[6] == '-') || (filter[6] == dico[numberOfLetters-minWordLength][i][6])) &&
			    ((numberOfLetters-minWordLength < 3) || (filter[7] == '-') || (filter[7] == dico[numberOfLetters-minWordLength][i][7]))) {
				n++;
				if (n - 1 == wordIndex) {
					return dico[numberOfLetters-minWordLength][i];
				}
			}	
		}
	return '';
}

// use of dictionary in dictionnissimot.js
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
	// Special Mélélémo
	var letter;
	switch(l) {
		case 'Â': letter='AN'; break;
		case 'Ç': letter='CH'; break;
		case 'Ê': letter='EN'; break;
		case 'Î': letter='UI'; break;
		case 'Ñ': letter='NG'; break;
		case 'Ô': letter='ON'; break;
		case 'Û': letter='OU'; break;
		case 'Ü': letter='OUN'; break; // v1.2 : Ajout de la nouvelle case "Oun" issu de Dipliakta 1.8 (nouveau jeton éponyme)
		default:  letter=l; break;
	}
	newSrc = pngFolder+letter+'p.png';
	document.images[x+'*'+y].src = newSrc;
}

function findAndPutWordsInGrid()
{
	var occurrences = 0;
	while(occurrences < 64) {
		occurrences++;
		var d = 1 + Math.floor(Math.random() * numberOfDirections);
		var dl = Math.floor(Math.random() * 4);
		var numberOfLetters = 8 - dl; // word length
		var x = 0;
		var y = 0;
		switch(d) {
			case dirType.dN:
				x = Math.floor(Math.random() * numberOfCellsBySide);
				y = 7 - Math.floor(Math.random() * dl);
				break;
			case dirType.dNE:
			    x = Math.floor(Math.random() * dl);
				y = 7 - Math.floor(Math.random() * dl);
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
				x = 7 - Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * dl);
				break;
			case dirType.dW:
				x = 7 - Math.floor(Math.random() * dl);
				y = Math.floor(Math.random() * numberOfCellsBySide);
				break;
			case dirType.dNW:
				x = 7 - Math.floor(Math.random() * dl);
				y = 7 - Math.floor(Math.random() * dl);
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

		for(var i = 0; i < numberOfLetters; i++) {
			addLetterInGrid(word[i], x + i * dx[d], y + i * dy[d]);
            //alert('1:('+x+','+y+','+stDir[d]+'):'+filter+'>'+word);   
        }
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
	for(var d = dirType.dNE; d <= dirType.dS; d++) {
		switch(d) {
			case dirType.dNE:
				// only in diagonales, only seven lines to seek because of minimum of five letters
				for(var i = 0; i < 7; i++) {
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var j = 0; j < ((i > 3)?(11 - i):(i + 5)); j++) {
						if (grid[((i > 3)?(i - 3):0) + j * dx[d]][((i < 4)?(i + 4):7) + j * dy[d]] == '-') {
							numberOfCellsToFill++;
							if (j > M) M = j;
							if (j < m) m = j;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //alert('NE:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
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
						xToFill[l] = ((i > 3)?(i - 3):0);
						yToFill[l] = ((i < 4)?(i + 4):7);
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = ((i > 3)?(11 - i):(i + 5));
                        //alert('NE:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
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
                    //alert('E:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
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
                        //alert('E:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
			case dirType.dSE:
				// only in diagonales, only seven lines to seek because of minimum of five letters
				for(var i = 0; i < 7; i++) {
					numberOfCellsToFill = 0;
					m = numberOfCellsBySide; M = 0;
					for(var j = 0; j < ((i > 3)?(11 - i):(i + 5)); j++) {
						if (grid[((i < 4)?(3 - i):0) + j * dx[d]][((i > 3)?(i - 3):0) + j * dy[d]] == '-') {
							numberOfCellsToFill++;
							if (j > M) M = j;
							if (j < m) m = j;
						}
					}
                    if (!numberOfCellsToFill) continue;
                    //alert('SE:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
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
						xToFill[l] = ((i < 4)?(3 - i):0);
						yToFill[l] = ((i > 3)?(i - 3):0);
						maxi[l] = M; mini[l] = m;
						maxLengthToSeek[l] = ((i > 3)?(11 - i):(i + 5));
                        //alert('SE:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
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
                    //alert('S:('+numberOfCellsToFill+','+(M - m + 1)+')->('+maxNumberOfCellsToFill+','+minDistance+')\n');
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
                        //alert('S:('+maxNumberOfCellsToFill+','+minDistance+') k='+l);
					}
				}
				break;
		}
	}
    
	// let's try to fill using record table !
    
    if (maxNumberOfCellsToFill)
        for(var k = 0; k < dirToFill.length; k++) {
            //alert(maxNumberOfCellsToFill + ' cases distantes de '+ minDistance + ' avec longueur max de ' + maxLengthToSeek[k] + ' (' + mini[k] + ', ' + maxi[k] + '): d = ' + stDir[dirToFill[k]] + ' & (x, y) = (' + xToFill[k] + ', ' + yToFill[k] + ')'); 
            for(var l = maxLengthToSeek[k]; l >= Math.max(minDistance, minWordLength); l--) {
                for(var i = Math.max(0, maxi[k] + 1 - l); i <= Math.min(maxLengthToSeek[k] - l, mini[k]); i++) {
                    var word = '';
                    var filter = ''; 
                    var numberOfJokers = 0; 

                    for(var j = 0; j < l; j++) 
                        filter = filter + grid[xToFill[k] + (i + j) * dx[dirToFill[k]]][yToFill[k] + (i + j) * dy[dirToFill[k]]];

                    //alert('De ' + i + ' à ' + (i + l - 1) + ' : filtre = ' + filter);

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
                        //alert(word);
                        lettersToFind -= numberOfJokers;
                        for(var j = 0; j < l; j++) {
                            addLetterInGrid(word[j], xToFill[k] + (i + j) * dx[dirToFill[k]], yToFill[k] + (i + j) * dy[dirToFill[k]]);
                            //alert('2:'+'('+(xToFill[k]+i*dx[dirToFill[k]])+','+(yToFill[k]+i*dy[dirToFill[k]])+','+stDir[dirToFill[k]]+'):'+filter+'>'+word);
                        }
                    }
                    else {
                        filter = '';
                        for(var j = l - 1; j >= 0; j--) 
                            filter = filter + grid[xToFill[k] + (i + j) * dx[dirToFill[k]]][yToFill[k] + (i + j) * dy[dirToFill[k]]];
                        
                        //alert('De ' + (i + l - 1) + ' à ' + i + ' : filtre = ' + filter);

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
                            //alert(word);
                            lettersToFind -= numberOfJokers;
                            for(var j = l - 1; j >= 0; j--) {
                                addLetterInGrid(word[l-1-j], xToFill[k] + (i + j) * dx[dirToFill[k]], yToFill[k] + (i + j) * dy[dirToFill[k]]);
                                //alert('2:'+'('+(xToFill[k]+i*dx[dirToFill[k]])+','+(yToFill[k]+i*dy[dirToFill[k]])+','+stDir[dirToFill[k]]+'):'+filter+'>'+word);
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
	var word = '';
    
    /*
    var gridAlert = '';
    for(var y=0; y<8; y++) {
        for(var x=0; x<8; x++)
            gridAlert = gridAlert + grid[x][y];
        gridAlert = gridAlert + '\n';
    }
    alert(gridAlert);
    */
    
	// Initialization
	words.length = 0;
	wordPos.length = 0;
	for(var l = numberOfCellsBySide; l >= minWordLength; l--) {
        var N = 1 + numberOfCellsBySide - l; // used in the loops for(var n = ; ...
		idxByLength[l - minWordLength] = words.length;
        numberOfFound[l - minWordLength] = 0; // Initialization	
		for(var d = dirType.dN; d <= dirType.dNW; d++) {
			switch(d) {
				case dirType.dN:
					for(var x = 0; x < numberOfCellsBySide; x++) {
						for(var y = numberOfCellsBySide - 1; y >= l - 1; y--) {
							word = '';
							for(var i = 0; i < l; i++)
								word = word + grid[x + i * dx[d]][y + i * dy[d]];
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length; 
                                //alert('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dNE:
					for(var k = 0; k < 1 + 2 * (numberOfCellsBySide - l); k++) 
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = Math.max(0, k + l - 8);
                            var y = Math.min(7, l + k - 1);
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
                                i = words.length;
                                //alert('Mot n°'+i);
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
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //alert('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dSE:
					for(var k = 0; k < 1 + 2 * (numberOfCellsBySide - l); k++) 
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = Math.max(0, 8 - l - k);
                            var y = Math.max(0, k + l - 8);
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
                                i = words.length;
                                //alert('Mot n°'+i);
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
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //alert('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dSW:
					for(var k = 0; k < 1 + 2 * (numberOfCellsBySide - l); k++)  
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = 7 - Math.max(0, k + l - 8);
                            var y = 7 - Math.min(7, l + k - 1);
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
                                i = words.length;
                                //alert('Mot n°'+i);
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
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
								i = words.length;
                                //alert('Mot n°'+i);
								words[i] = word;
								wordPos[i] = new buildWordPosition(x, y, d);
							}
						}
					}
					break;
				case dirType.dNW:
					for(var k = 0; k < 1 + 2 * (numberOfCellsBySide - l); k++)  
                        for(var n = 0; n < N - Math.abs(N - 1 - k); n++) {
                            var x = 7 - Math.max(0, 8 - l - k);
                            var y = 7 - Math.max(0, k + l - 8);
                            word = '';
                            for(var i = 0; i < l; i++)
                                word = word + grid[x + (i+n) * dx[d]][y + (i+n) * dy[d]];
                            //alert('('+x+','+y+','+stDir[d]+')='+word);    
							if (isValid(word)) { 
                                i = words.length;
                                //alert('Mot n°'+i);
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
	// Special Mélélémo
	var letter;
	switch(grid[x][y]) {
		case 'Â': letter='AN'; break;
		case 'Ç': letter='CH'; break;
		case 'Ê': letter='EN'; break;
		case 'Î': letter='UI'; break;
		case 'Ñ': letter='NG'; break;
		case 'Ô': letter='ON'; break;
		case 'Û': letter='OU'; break;
		case 'Ü': letter='OUN'; break; // v1.2 : Ajout de la nouvelle case "Oun" issu de Dipliakta 1.8 (nouveau jeton éponyme)
		default:  letter=grid[x][y]; break;
	}
	newSrc = pngFolder+letter+letterColorSuffix[color]+'.png';
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
   	stDrnMotForme = ''; 
    for(var i = 0; i < l; i++) {
		var lm = grid[x+i*dx[d]][y+i*dy[d]]; 
		var letter;
		switch(lm) {
			case 'Â': letter='AN'; break;
			case 'Ç': letter='CH'; break;
			case 'Ê': letter='EN'; break;
			case 'Î': letter='UI'; break;
			case 'Ñ': letter='NG'; break;
			case 'Ô': letter='ON'; break;
			case 'Û': letter='OU'; break;
			case 'Ü': letter='OUN'; break; // v1.2 : Ajout de la nouvelle case "Oun" issu de Dipliakta 1.8 (nouveau jeton éponyme)
			default:  letter=lm; break;
		}
		stDrnMotForme = stDrnMotForme + letter; // avec doubles lettres
		var newSrc;
        newSrc = pngFolder + letter + letterColorSuffix[isGreen[x+i*dx[d]][y+i*dy[d]]?colorType.cGreen:colorType.cGray] + '.png';
        document.images['w'+ (i + maxWordLength - l)].src = newSrc;
    }
    // word score
    refreshDigit(Math.floor(s / 10) % 10, 'wst', 'o');
    refreshDigit(s % 10, 'wsu', 'o');    
    
    // word definitions
   	nvSrc = pngFolder + pngDico[dicoDef] + pngExt; 
	document.images[idDefPrmImg].src = nvSrc;	
	
	document.links['ll'].href = lnkDico[dicoDef] + stDrnMotForme.toLowerCase();
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
        refreshDenominator(maxScore, score, 4, 's', 'v'); 

    // bonus...
    colorSuffix = ((bonus == 2 * maxBonus)?'v':'x');
    refreshNumerator(bonus, 4, 'b', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(2 * maxBonus, bonus, 4, 'b', 'v'); 

    // total...
    colorSuffix = ((score + bonus == maxScore + 2 * maxBonus)?'v':'x');
    refreshNumerator(score + bonus, 4, 't', colorSuffix);
    if (colorSuffix == 'v') 
        refreshDenominator(maxScore + 2 * maxBonus, score + bonus, 4, 't', 'v'); 
        
    // game + bonus score 
    refreshGamePoints();
    
    // next grid activated ? Yes = green. No = red.
    if ((!greenMsg) && (numberOfGreenLetters == numberOfCellsBySide * numberOfCellsBySide)) {
        greenMsg = true;
       	imgSrcGrilleSvg = pngFolder + 'grillev.png'; 
        document.images[idGrille].src = imgSrcGrilleSvg;
        if ((score < maxScore)&&(!quiet))
            alert('Bravo, vous avez verdi toute la grille.\nVous pouvez passer à une nouvelle en touchant\n« Grille » ou continuer à trouver tous les mots pour toucher les bonus.');
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
        refreshDenominator(ntf, 0, 2, l + '', colorSuffix); 

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
{   // v1.1 : ajout "ou les compteurs de mots"
    var msg = msgPrefix + 'Vous pouvez voir les mots que vous n\'avez pas trouvés en touchant « < » et « > » ou les compteurs de mots.\n« % » affiche les statistiques de la grille et de la partie.\n\nPour commencer une nouvelle ' + whatIsNew + ', touchez à nouveau « Grille ».'; 
    alert(msg);
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
	alert('Statistiques grille et partie\n\n' + msg);
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

function afficheSablier(affiche) 
{
	if (affiche) {
		imgSrcGrilleSvg = document.images[idGrille].src;
		document.images[idGrille].src = pngFolder + sablier + pngExt;
	}
	else
		document.images[idGrille].src = imgSrcGrilleSvg;
}

function translateWordToShow(word) // spécial Créole Haïtien
{
  var wordToShow = '';
  for(var i=0; i<word.length;i++) {
	 switch(word[i])
   		{
     	 case 'Î': wordToShow=wordToShow+'UI'; break;
     	 case 'Û': wordToShow=wordToShow+'OU'; break;
     	 case 'Ü': wordToShow=wordToShow+'OUN'; break; // v1.2 : Ajout de la nouvelle case "Oun" issu de Dipliakta 1.8 (nouveau jeton éponyme)
     	 case 'Ñ': wordToShow=wordToShow+'NG'; break;
     	 case 'Ç': wordToShow=wordToShow+'CH'; break;
     	 case 'Ô': wordToShow=wordToShow+'ON'; break;
     	 case 'Ê': wordToShow=wordToShow+'EN'; break;
     	 case 'Â': wordToShow=wordToShow+'AN'; break;
     	 default : wordToShow=wordToShow+word[i]; break;
   		}
	 }
  return wordToShow;
}

function afficheMots(n)// v1.1
{
    var showAll = (status == choiceStatusType.csViewingSolutions) || (score == maxScore);
    var wordlist = '';
    var iMax = ((n>0)?idxByLength[n-1]:words.length);
    for(var i = idxByLength[n]; i < iMax; i++) {
        if (wordPos[i].found) 
            wordlist = wordlist + translateWordToShow(words[i]) + ' ';
        else
            if (showAll)
                wordlist = wordlist + translateWordToShow(words[i]).toLowerCase() + ' ';
    }
    if (wordlist == '')
        wordlist = 'Aucun mot trouvé ';
    return wordlist.substring(0, wordlist.length-1)+'.';
}

function clic(x) 
{ 
 // x=...
 // 0~63    => grid 
 //  99     => dico def parameter
 // 100     => word score (wordlist for debugging)
 // 101     => "grid" label (red/green) 
 // 102~104 => buttons (-/?/+) 
 // 105~108 => word counters (context help)
 // 109~111 => Score/Bonus/Total (context help)
 // 112     => grid number (context help)
 // 113     => chances counter (context help)
 // 114     => game score (context help)
 // 115     => last word found in the grid (context help)
 
    var choice = parseInt(x);

	var n=0; // on compte les mots en temps réel !
	for(var i=0; i<dico.length; i++)
		n+=dico[i].length;
	var info    =	'Mélélémo version '+stVersion+'\n\n' + 
					'Développé par Patrice Fouquet\n' +
					'Dictionnaire : '+n+' mots\n\n' + 
					'patquoi.fr/MelissimoT.html\nmelissimot@patquoi.fr\n\n' + 
					'Vous avez une tablette ?\nMélissimax lui est dédiée.\n' + 
					'patquoi.fr/Melissimax.html\n\n' + 
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
                        alert('À propos de Mélélémo\n\n' + info);
                        break;
                    case 103: // (i)
                        alert(welcomeMessage);
                        break;
                    case 104: // (%)
                        statsAndTops.displayStatsAndTops();
                        break;
                    default:
                        break;
                }
                if (choice != 104)
                    statsAndTopsStatus = statsAndTopsStatusType.satsTops;
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
                statsAndTopsStatus = statsAndTopsStatusType.satsTops;
                break;
            default:
                statsAndTopsStatus = statsAndTopsStatusType.satsTops;
                break;
        }
        return;
    }

    statsAndTopsStatus = statsAndTopsStatusType.satsTops; 
    
    // It's a context help...
    if ((choice >= firstWordCounterID) && (choice <= wordFoundID) && parseInt(status)) {
        if (parseInt(status) != choiceStatusType.csViewingSolutions)
            newGridRequest = false;
        if ((choice >= firstWordCounterID) && (choice <= firstWordCounterID + maxWordLength - minWordLength)) {
        	var stPourcents = numberToFind[choice-firstWordCounterID]?(' ('+Math.round((100*numberOfFound[choice-firstWordCounterID])/numberToFind[choice-firstWordCounterID]) +'%)'):''; 
            // v1.1 : Ajout afficheMots à la fin du message et suppression de la phrase avec la couleur verte.
            alert('Il s\'agit du nombre de mots de '+(choice - firstWordCounterID + minWordLength)+' lettres que vous avez relevés parmi le nombre total à trouver'+stPourcents+'.\n\nVoici la liste des mots : '+afficheMots(choice - firstWordCounterID)); 
            return;
        }
        else {
            switch(choice) { 
                case gridScoreID: 
                    alert('Il s\'agit de votre score et la part du score maximal possible dans la grille ('+maxScore+').\n\nLa couleur verte indique que vous avez obtenu le score maximal.');
                    break;
                case gridBonusID: 
                    alert('Il s\'agit du bonus que vous avez gagné et la part du bonus maximal possible dans la grille ('+(2*maxBonus)+').\nLa couleur verte indique que vous avez obtenu le bonus maximal.\nVous avez un bonus à chaque fois que vous avez trouvé tous les mots d\'une même taille.\nLe bonus est doublé lorsque vous avez trouvé tous les mots de la grille.');
                    break;
                case gridTotalID: 
                    alert('Il s\'agit de votre score total (score + bonus) et la part du score total maximal possible dans la grille courante ('+(2*maxBonus+maxScore)+').\n\nLa couleur verte indique que vous avez obtenu le score total maximal.');
                    break;
                case gameScoreID:
                    alert('Il s\'agit de votre score de partie, cumul des scores et bonus toutes grilles confondues y compris ceux de la grille courante.');
                    break;
                case gridNumberID:
                    alert('Il s\'agit du numéro de la grille courante.\n\nLa première grille a le numéro « 01 ».');
                    break;
                case chancesCounterID:
                    alert('Il s\'agit du nombre d\'erreur(s) que vous pouvez encore faire dans la partie. Vous avez droit à '+ chancesAtTheBeginning +' erreurs dans la première grille, puis '+ (chancesAtTheBeginning - 1) +' et ainsi de suite. Les chances non utilisées d\'une grille sont reportées sur la grille suivante.');
                    break;
                case wordFoundID:
           	        if (document.images['w7'].src[document.images['w7'].src.length-5][0] != fond[0]) 
	                    alert('Ici est affiché le dernier mot trouvé dans la grille.\n\nÀ côté est indiqué le score empoché.\n\nLa couleur des lettres reflète la situation avant la découverte du mot.');
                    break;
            }
            return;
        }
    } 

    // Grid label
    if (choice == gridLabelID) {
        if (numberOfGreenLetters < numberOfCellsBySide * numberOfCellsBySide) {
            if (!newGridRequest) {
                alert('Abandonner la partie ?\n\nVous n\'avez pas verdi toute la grille. Voulez-vous abandonner et recommencer une nouvelle partie ?\n\nPour confirmer, touchez à nouveau « Grille ».');
                newGridRequest = true;
            }
            else {
                if (parseInt(status) == choiceStatusType.csViewingSolutions) {
                    newGridRequest = false;
                    statsAndTops.registerGridStats();
                    statsAndTops.registerGameStats();
                    statsAndTops.registerTops();
					afficheSablier(true); 
        			setTimeout(function() { 
        				newGame(false);
                   		afficheSablier(false); 
                   	}, 500); 
                }
                else 
                    showFirstSolutionNotFound('partie', '');
            }
        }
        else {
            if (!newGridRequest) {
                alert('Poursuivre la partie sur une nouvelle grille ?\n\nVous avez verdi toute la grille et vous pouvez continuer la partie sur une nouvelle.\n\nPour confirmer touchez à nouveau « Grille ».');
                newGridRequest = true;
            }
            else {
                if ((parseInt(status) == choiceStatusType.csViewingSolutions)||
					(score == maxScore)) {
                    newGridRequest = false;
					afficheSablier(true); 
        			setTimeout(function() { 
                    	nextGrid(false);
                   		afficheSablier(false); 
                   	}, 500); 
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

	if ((choice == dicoDefPrmID) && 
		(document.images[idDefLnkImg].src[document.images[idDefLnkImg].src.length-5][0] != fond[0])) { 
		dicoDef = 0; // Pas de changement de dictionnaire possible
		localStorage.ddd = dicoDef;
		document.images[idDefPrmImg].src = pngFolder + pngDico[dicoDef] + pngExt; 
		document.links[idDefLnkLnk].href = lnkDico[dicoDef] + stDrnMotForme;
		return;
	}
    if (choice == wordScoreID) {
        /*    
		var wordList = '';
		for(var i = 0; i < words.length; i++)
			wordList = wordList + words[i] + ' ';
        alert(wordList);
        */
        if (document.images['wsu'].src[document.images['wsu'].src.length-5][0] != fond[0]) 
        	alert('Il s\'agit du score du dernier mot trouvé affiché à gauche.');
        return;
    }
    
    if ((choice < 99) && parseInt(status)) { 

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
                            alert('Anomalie !\n\nLe mot existe mais n\'a pas été relevé !');
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
                                        alert('Le mot '+words[wordIndex]+' a déjà été trouvé dans cette position.');
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
                                            alert('Bravo, vous avez trouvé tous les mots de la grille !\n\nPour passer à la manche suivante, touchez « Grille » et patientez jusqu\'à ce qu\'une nouvelle grille apparaisse.');
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
                        var msgPrefix = 'Le mot ' + translateWordToShow(wordChoice) + ' n\'est pas valable.\n\n';
                        chances--; localStorage.chances = chances;
                        if (chances >= 0) { 
                            refreshDigit(Math.floor(chances / 10) % 10, 'tcb', 'o');
                            refreshDigit(chances % 10, 'ucb', 'o');
                            if (chances > 0)
                                alert(msgPrefix + 'Il vous reste encore ' + chances + ' chance' + ((chances > 1)?'s':'') + ' de vous tromper.');
                            else {
                                var newSrc;
                                newSrc = pngFolder + 'chancesx.png';
                                document.images['chances'].src = newSrc;
                                alert(msgPrefix + 'Attention, vous n\'avez plus droit à l\'erreur !');
                            }
                        }
                        else {
                            var msg = msgPrefix;
                            chances++; localStorage.chances = chances;
                            if (numberOfGreenLetters < numberOfCellsBySide * numberOfCellsBySide) 
                                msg = msg + 'Malheureusement, vous avez épuisé toutes vos chances.\n\nLa partie est terminée !\n\n';
                            else
                                msg = msg + 'Vous avez épuisé toutes vos chances mais vous avez verdi toute la grille. Vous passez obligatoirement à grille suivante.\n\n';
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
    } // end of if (choice < 99)
}
