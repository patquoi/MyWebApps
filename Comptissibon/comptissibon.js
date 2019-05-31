 /*
 
 File: Comptissibon.js
 
 Abstract: JavaScript for the index.html file
  
 Version: <2.3>
 
 Copyright (C) 2008 Patrice Fouquet. All Rights Reserved.
 
Version 2.3 
 - Nouvelle police pour nombres & opérateurs : Chalkduster
 - Option "firstSolutionOnly" est faux par défaut.
 - Le rang de la proposition apparaît en rouge dans la liste des solutions 
 */ 

// NOTE : font = Chalkduster for typed characters (numbers and operators)
//               NoteWorthy Bold for the six numbers shown under the count to find 

/********** /
/ CONSTANTS /
/ **********/

const stVersion                 = '2.3';

//---- //
// IA  //
//-----//

const iaType					= new buildIAType();
const mainOperatorType			= new buildMainOperatorType();
const stOperatorEqual			= '=';
const stOperator				= ['+', '*'];
const stContraryOperator		= ['-', '/'];
const mainOf                    = [mainOperatorType.moUndefined, // mainOf[operator] <=> mainOperator. Used for resultMainOperator[]
                                   mainOperatorType.moPlus,      mainOperatorType.moPlus, 
                                   mainOperatorType.moMultiply,  mainOperatorType.moMultiply]; 
const numberOfOperandChoices	= // NbChoixOperandes /!\ array of [0..4][0..4] not array of [2..6][2..6] like Pascal arrays!
[[ 1, 3, 6,10,15],
 [ 0, 1, 4,10,20],
 [ 0, 0, 1, 5,15],
 [ 0, 0, 0, 1, 6],
 [ 0, 0, 0, 0, 1]];      
const numberOfContrarietyChoices = [1,2,4,8,16,32,64]; // NbChoixContrarietes
const operandNumberChoice = // NumeroOperandeChoix /!\ array of [0..4][0..4][][] not array of [2..6][2..6][][] like Pascal arrays!
[[[[0,1,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,0,0,0,0],[0,2,0,0,0,0],[1,2,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,0,0,0,0],[0,2,0,0,0,0],[0,3,0,0,0,0],[1,2,0,0,0,0],[1,3,0,0,0,0],[2,3,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,0,0,0,0],[0,2,0,0,0,0],[0,3,0,0,0,0],[0,4,0,0,0,0],[1,2,0,0,0,0],[1,3,0,0,0,0],[1,4,0,0,0,0],[2,3,0,0,0,0],[2,4,0,0,0,0],[3,4,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,0,0,0,0],[0,2,0,0,0,0],[0,3,0,0,0,0],[0,4,0,0,0,0],[0,5,0,0,0,0],[1,2,0,0,0,0],[1,3,0,0,0,0],[1,4,0,0,0,0],[1,5,0,0,0,0],[2,3,0,0,0,0],[2,4,0,0,0,0],[2,5,0,0,0,0],[3,4,0,0,0,0],[3,5,0,0,0,0],[4,5,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]],
 [[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,0,0,0],[0,1,3,0,0,0],[0,2,3,0,0,0],[1,2,3,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,0,0,0],[0,1,3,0,0,0],[0,1,4,0,0,0],[0,2,3,0,0,0],[0,2,4,0,0,0],[0,3,4,0,0,0],[1,2,3,0,0,0],[1,2,4,0,0,0],[1,3,4,0,0,0],[2,3,4,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,0,0,0],[0,1,3,0,0,0],[0,1,4,0,0,0],[0,1,5,0,0,0],[0,2,3,0,0,0],[0,2,4,0,0,0],[0,2,5,0,0,0],[0,3,4,0,0,0],[0,3,5,0,0,0],[0,4,5,0,0,0],[1,2,3,0,0,0],[1,2,4,0,0,0],[1,2,5,0,0,0],[1,3,4,0,0,0],[1,3,5,0,0,0],[1,4,5,0,0,0],[2,3,4,0,0,0],[2,3,5,0,0,0],[2,4,5,0,0,0],[3,4,5,0,0,0]]],
 [[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,0,0],[0,1,2,4,0,0],[0,1,3,4,0,0],[0,2,3,4,0,0],[1,2,3,4,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,0,0],[0,1,2,4,0,0],[0,1,2,5,0,0],[0,1,3,4,0,0],[0,1,3,5,0,0],[0,1,4,5,0,0],[0,2,3,4,0,0],[0,2,3,5,0,0],[0,2,4,5,0,0],[0,3,4,5,0,0],[1,2,3,4,0,0],[1,2,3,5,0,0],[1,2,4,5,0,0],[1,3,4,5,0,0],[2,3,4,5,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]],
 [[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,4,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,4,0],[0,1,2,3,5,0],[0,1,2,4,5,0],[0,1,3,4,5,0],[0,2,3,4,5,0],[1,2,3,4,5,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]],
 [[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  [[0,1,2,3,4,5],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]]];


//-----------//
// Interface //
//-----------//

// Grid dimensions
const numberOfColumnsG = 20;
const numberOfRowsG    = 5; 

// Keyboard dimensions
const numberOfColumnsK = 10;

// Infoline dimensions
const numberOfColumnsI = 14;

// Count dimensions
const numberOfColumnsC = 3;

// Numbers dimensions
const numberOfColumnsN = 11;

// interface management
const modeType  = new buildModeType(); // used to choice the right keyboard
const keyboard  = ['pmfd*e*-*k','','pmfdeziksc']; // use of keyboard: keyboard[mode][x] where x is the clic() function parameter
const keybinfo  = 'antor*';
const alphabet  = '*0123456789pmfde-kantor';
const pngFolder = 'png/';
// v2.1 : some others constants
const pngExt	= '.png'; 
const srcAttr	= 'src';  
const idAttr	= 'id'; 
const hghtAttr	= 'height';
const wdthAttr	= 'width';
const imgAttr	= 'img';
const trAttr	= 'tr';
const tdAttr	= 'td';


// Limits
const numberOfNumberPossibilities = 24;
const countMin = 101;
const countMax = 999;
const numberOfCountPossibilities = 1 + countMax - countMin;
const numberMaxofOperands = 11;
const numberMaxOfNumbers = 6;
const numberMaxOfLines = numberMaxOfNumbers - 1;
const numberMaxOfResults = numberMaxOfLines;

// object index 
const operatorIndexType = new buildOperatorIndexType();
const firstOperatorIndex = operatorIndexType.oiAdd;
const lastOperatorIndex = operatorIndexType.oiDivide;
const firstChosenNumberIndex = 20;
const lastChosenNumberIndex = 25;
const infoIndex = 10; // index for the clic() actions of the keybinfo buttons

// formula editing steps
const stepType = new buildStepType();
const deletionStepType = new buildDeletionStepType();

// current operation (don't mix operator types [+,-] and [*,/] on a same line) 
const operatorKindType = new buildOperatorKindType();
const operatorType = new buildOperatorType();

// current values
const valueType = new buildValueType();

// game modes for function setup()
const gameModeType = new buildGameModeType();

// given number possibilities
const numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 25, 50, 75, 100];

const kindOf = new Array(operatorKindType.okUndefined, 
					     operatorKindType.okAddOrSubstract, 
						 operatorKindType.okAddOrSubstract, 
						 operatorKindType.okMultiplyOrDivide, 
						 operatorKindType.okMultiplyOrDivide);


/********** /
/ VARIABLES /
/ **********/

//---- //
// IA  //
//-----//

var numberOfConsideredCalculations = 0;
var searchDistance = 0x7FFFFFFF; 
var firstSolutionOnly = false; // v2.3: Option "firstSolutionOnly" is false by default now!
var topChrono = new Date();
var iaOptimizations = new buildIAOptimizations();
var stSolutions = new Array();
var solutionStats = new Array();
var solutionIndexSortedByComplexity = new Array();
var lastPropositionComplexityRank = 0; // v2.3. display proposition rank in red in solution lists

//-----------//
// Interface //
//-----------//

var grid = [];

var rownum = 0;
var colnum = 0;
var equalAvailable = false;

var allowClicks = false;

var count = 0; // warning : used in IA functions TOO

// Numbers...
var numbersChosen = new Array(0, 0, 0, 0, 0, 0);  
var numbersTaken = new Array(false, false, false, false, false, false);
var lineUsingNumber = new Array (0, 0, 0, 0, 0, 0);

// Results by line...
var results = new Array(0, 0, 0, 0, 0);
var resultsTaken = new Array(false, false, false, false, false);
var resultColFrom = new Array(0, 0, 0, 0, 0);
var resultColTo = new Array(0, 0, 0, 0, 0); 
var lineUsingResult = new Array (0, 0, 0, 0, 0); //  /!\ 0=no used else lineUsingResult is linenumber + 1 /!\ 
var resultMainOperator = new Array (mainOperatorType.moUndefined, mainOperatorType.moUndefined, mainOperatorType.moUndefined, mainOperatorType.moUndefined, mainOperatorType.moUndefined);
								 
// line buffers
var currentLineBufferResult = 0;
var lastSelectedValue = 0;
var lastSelectedValueType = valueType.vtUndefined;
var lastSelectedNumberCol = 0;
var lastSelectedResultRow = 0;

// current operation (don't mix operator types [+,-] and [*,/] on a same line) 
var operatorKind = operatorKindType.okUndefined;
var operator = operatorType.oUndefined;
var step = stepType.sUndefined;
var deletionStep = deletionStepType.dsLineDeletion;
var mode = modeType.mTypingSolution;
var currentSolutionIndex = 0;

// Statistics
var statistics = new buildStatistics();
var propositionStat = null; // statistics of the proposition calculated in gameOver() function (to retrive the complexity rank of the proposition)

// requests
var resetStatsRequest = false;
var endOfPropRequest = false;

// welcome mode
var welcomeMode = gameModeType.gmNew;

// Times & duration of typing...
var topProp;     // v1.1: time when the proposition has begun. The duration is available only if the proposition is entered once.
var durProp = 0; // v1.1: duration of proposition typing. This value is saved. 
var tmsProp = 0; // v1.1: number of times (+1 if quit). This value is saved. Be careful: timesnumber of times is (tmsProp+1).

/********** /
/ FUNCTIONS /
/***********/

//-----//
// IA  //
//-----//

function buildIAOptimizations()
{
	this.iaoNoMultiplyOrDivideBy1 = true;
	this.iaoNoResultWithSameOperandType = true;
	this.iaoNoResultEqualToOperand = true;
	this.iaoNoContraryOperands = true;
}

// build type to recognize object class for methods having same signature
function buildIAType()
{
	this.iatUndefined = 0;
	this.iatOperand = 1; // Delphi:TNombre
	this.iatOperation = 2; // Delphi:TOperation
	this.iatSituation = 3; // Delphi:TSituation
	this.iatSolutionStat = 4; // Delphi:TStatSolution
}

// build for mainOperator type (Delphi:TOperateur)
function buildMainOperatorType()
{
    this.moUndefined = -1;
	this.moPlus = 0;
	this.moMultiply = 1;
}

function initializeSolutions()
{
    stSolutions.length = 0;
    solutionStats.length = 0;
    solutionIndexSortedByComplexity.length = 0;
}

//---------------------------------
// OPERAND methods (Delphi:TNombre)
//---------------------------------

// Delphi:constructor TNombre.Cree(s,v)
function buildOperand(situation, value)
{	
    // methods
    this.isResult = isResult;
    //this.copyIn = copyIn; // inline function
    this.stPreviewSpeech = stPreviewSpeech;
	// properties
	this.situation = situation;
	this.value = value;
	this.operation = null;
	this.isUsed = false;
}

// Delphi:constructor TNombre.Cree(s,n)
function buildOperandAsCopy(situation, operand)
{
    // methods
    this.isResult = isResult;
    //this.copyIn = copyIn; // inline function
    this.stPreviewSpeech = stPreviewSpeech;
	// properties
	this.situation = situation;
	this.value = operand.value;
	this.isUsed = operand.isUsed;
	if (operand.isResult()) 
		this.operation = operand.operation;
	else
		this.operation = null;
}

// Delphi:constructor TNombre.Cree(o);
function buildOperandAsResult(operation)
{
    // methods
    this.isResult = isResult;
    //this.copyIn = copyIn; // inline function
    this.stPreviewSpeech = stPreviewSpeech;
    // properties
	this.situation = operation.situation;
	this.value = operation.getResult();
	this.operation = operation;
	this.isUsed = false;
}

// Delphi:TNombre.CalculeSiResultat
function isResult() // returns boolean
{
	return (this.operation != null);
}

// Delphi:TNombre.Copie (inline function due to possible build of new instance)

// Delphi:TNombre.stApercuEnonce
function stPreviewSpeech(type) // return string
{
	switch(type) {
		case iaType.iatOperand:
			return this.value+'';
			break;
		case iaType.iatOperation:
			var stPreview = '';
			for(var i = 0; i < this.numberOfOperands; i++)
				if (this.situation.operand[this.operandIndex[i]].isResult())
					stPreview = stPreview + this.situation.operand[this.operandIndex[i]].operation.stPreviewSpeech(iaType.iatOperation);
			stPreview = stPreview + ' ';
			for(var i = 0; i < this.numberOfOperands; i++) {
				if (i > 0)
					if (this.contrary[i])
						stPreview = stPreview + stContraryOperator[this.mainOperator];
					else
						stPreview = stPreview + stOperator[this.mainOperator];
				stPreview = stPreview + this.situation.operand[this.operandIndex[i]].stPreviewSpeech(iaType.iatOperand);
			}
			stPreview = stPreview + stOperatorEqual + this.result;
			return stPreview;
			break;
		default:
			return '';
			break;
	}
}

//--------------------------------------
// OPERATION methods (Delphi:TOperation)
//--------------------------------------

// Delphi:constructor TOperation.Cree(s, operateur)
function buildOperation(situation, mainOperator)
{
    // methods
    this.setResult = setResult;
    this.getResult = getResult;
    this.operandToPostBefore = operandToPostBefore;
    this.addOperandInOperation = addOperandInOperation;
    this.copyOperandsIn = copyOperandsIn;
    this.flagOperandsToUsed = flagOperandsToUsed;
    this.numberOfOperations = numberOfOperations;
    this.maxResult = maxResult; 
    this.stPreviewSpeech = stPreviewSpeech;       
    // properties
    this.contentsAreIdentical = false; // used by function operandToPostBefore because original integer parameter result was passed by reference
	this.situation = situation;
	this.mainOperator = mainOperator;
	this.result = 0;
	this.numberOfOperands = 0;
    this.operandIndex = new Array();
    this.contrary = new Array();
}

// Delphi:constructor TOperation.Cree(s, operation)
function buildOperationAsCopy(situation, operation)
{
    // methods
    this.setResult = setResult;
    this.getResult = getResult;    
    this.operandToPostBefore = operandToPostBefore;
    this.addOperandInOperation = addOperandInOperation;
    this.copyOperandsIn = copyOperandsIn;
    this.flagOperandsToUsed = flagOperandsToUsed;
    this.numberOfOperations = numberOfOperations;
    this.maxResult = maxResult;
    this.stPreviewSpeech = stPreviewSpeech;        
    // properties
    this.contentsAreIdentical = false; // used by function operandToPostBefore because original integer parameter result was passed by reference
	this.numberOfOperands = 0;
    this.operandIndex = new Array();
    this.contrary = new Array();
	this.situation = situation;
	this.mainOperator = operation.mainOperator;
	this.result = operation.getResult();
	for(var i = 0; i < operation.numberOfOperands; i++)
		this.addOperandInOperation(operation.operandIndex[i], operation.contrary[i], false); // false = without sort
}

// Delphi:TOperation.CalculeResultat
function setResult() 
{ // for internal use only because the reuslt is calculated and set in the variable this.result 
	switch(this.mainOperator) {
		case mainOperatorType.moPlus: 
			this.result = 0; 
			break;
		case mainOperatorType.moMultiply:
			this.result = 1; 
			break;
		default:
			this.result = 0; 
			break;			
	}
	for(var i = 0; i < this.numberOfOperands; i++) {
		var operand = this.situation.operand[this.operandIndex[i]];
		switch(this.mainOperator) {
			case mainOperatorType.moPlus: 
				if (this.contrary[i])
					this.result -= operand.value;
				else
					this.result += operand.value;
				break;
			case mainOperatorType.moMultiply:
				if (this.contrary[i])
					this.result /= operand.value;
				else
					this.result *= operand.value;
				break;
			default:
				this.result = 0; 
				break;			
		}
	}	
}

// Delphi:TOperation.DonneResultat = read property of TOperation.Result
function getResult() 
{
	if (this.result == 0)
		this.setResult();
	return this.result;
}

// Delphi:TOperation.OperandeAClasserAvant
function operandToPostBefore(operationSrc, operandIndexSrc, contrarySrc, 
							 operationIndexDst) // returns boolean
{
	var operandsAreIdentical = false;
	var operandIsPrevious = false;
	var operandDst = null;
    var operandSrc = null;
	
	this.contentsAreIdentical = false;
	
	if (contrarySrc != this.contrary[operationIndexDst])
		return (contrarySrc < this.contrary[operationIndexDst]);
	
	operandDst = this.situation.operand[this.operandIndex[operationIndexDst]];		
	operandSrc = operationSrc.situation.operand[operandIndexSrc];
	
	if (operandSrc.value != operandDst.value)
		return ((operandSrc.value > operandDst.value) && !contrarySrc) ||
		       ((operandSrc.value < operandDst.value) && contrarySrc);
	
	if (operandSrc.isResult() != operandDst.isResult())
		return (operandSrc.isResult > operandDst.isResult);
	
	if (!operandSrc.isResult()) {
		this.contentsAreIdentical = true;
        return false;
	}
    
	if (operandSrc.operation.numberOfOperands != operandDst.operation.numberOfOperands)
		return (operandSrc.operation.numberOfOperands > operandDst.operation.numberOfOperands);
	
	for(var i = 0; i < operandSrc.operation.numberOfOperands; i++) {
		operandIsPrevious = operandDst.operation.operandToPostBefore(operandSrc.operation,
																	 operandSrc.operation.operandIndex[i],
																	 operandSrc.operation.contrary[i],
																	 i);
        operandsAreIdentical = this.contentsAreIdentical; // It's impossible in Javascript to pass in a function an integer parameter by reference so the modified value is in the property this.contentsAreIdentical!
		if (!operandsAreIdentical)
			return operandIsPrevious;
	}
}

// Delphi:TOperation.AjouteOperande
function addOperandInOperation(operandIndex, contrary, withSort) 
{
	this.numberOfOperands++;
	if (withSort) {
		if (this.numberOfOperands > 1)
			for(var i = this.numberOfOperands - 2; i >= 0; i--) {
				if (this.operandToPostBefore(this, operandIndex, contrary, i)) {
 					this.operandIndex[i+1] = this.operandIndex[i];
					this.contrary[i+1]     = this.contrary[i];
				}
				else {
					this.operandIndex[i+1] = operandIndex;
					this.contrary[i+1]     = contrary;
					return;
				}
			}
		this.operandIndex[0] = operandIndex;
		this.contrary[0]     = contrary;
	}
	else { // without sort
		this.operandIndex[this.numberOfOperands - 1] = operandIndex;
		this.contrary[this.numberOfOperands - 1] = contrary;
	}
}

// Delphi:TOperation.CopieNombresDans
function copyOperandsIn(situation)
{
	for(var i = 0; i < this.situation.operand.length; i++)
		situation.addOperandByCopy(this.situation.operand[i]);
}

// Delphi:TOperation.MarqueOperandesUtilises
function flagOperandsToUsed()
{
	for(var i = 0; i < this.numberOfOperands; i++)
		this.situation.operand[this.operandIndex[i]].isUsed = true;
}

// Delphi:TOperation.NbOperations
function numberOfOperations() // returns integer
{
	var n = 0;
	for(var i = 0; i < this.operandIndex.length; i++)
        if (this.situation.operand[this.operandIndex[i]].isResult())
            n += (1 + this.situation.operand[this.operandIndex[i]].operation.numberOfOperations());
	return n;
}

// Delphi:TOperation.ResultatMax
function maxResult() // returns integer
{
	var n = 0;
	for(var i = 0; i < this.operandIndex.length; i++)
        if (this.situation.operand[this.operandIndex[i]].isResult() &&
            (n < this.situation.operand[this.operandIndex[i]].value)) 
            n += Math.max(  this.situation.operand[this.operandIndex[i]].value,
                            this.situation.operand[this.operandIndex[i]].operation.maxResult());
	return n;
}

// Delphi:TOperation.stApercuEnonce
// see function stPreviewSpeech() common function with other objects

//--------------------------------------
// SITUATION methods (Delphi:TSituation)
//--------------------------------------

// Delphi:constructor TSituation.Cree()
function buildSituation()
{
    // methods
    this.getMaxNumberOfOperands = getMaxNumberOfOperands;
    this.addOperand = addOperand;
    this.addOperandByCopy = addOperandByCopy;
    this.addResult = addResult;
    this.showPreviewSpeechIfNotExists = showPreviewSpeechIfNotExists;
    this.numberOfResultsUnused = numberOfResultsUnused;
    this.numberOfNumbersUsed = numberOfNumbersUsed;
    this.isPossibleOperation = isPossibleOperation;
    this.searchSolutions = searchSolutions;
    // properties
    this.result = 0; // used by function isPossibleOperation because original integer parameter result was passed by reference
	this.operand = new Array();
}

// Delphi:constructor TSituation.Cree(operation)
function buildSituationByOperation(operation)
{
    // methods
    this.getMaxNumberOfOperands = getMaxNumberOfOperands;
    this.addOperand = addOperand;
    this.addOperandByCopy = addOperandByCopy;
    this.addResult = addResult;
    this.showPreviewSpeechIfNotExists = showPreviewSpeechIfNotExists;
    this.numberOfResultsUnused = numberOfResultsUnused;
    this.numberOfNumbersUsed = numberOfNumbersUsed;
    this.isPossibleOperation = isPossibleOperation;
    this.searchSolutions = searchSolutions;
    // properties
    this.result = 0; // used by function isPossibleOperation because original integer parameter result was passed by reference
	this.operand = new Array();
	var operationDst = new buildOperationAsCopy(this, operation);
	operation.copyOperandsIn(this);
	operationDst.flagOperandsToUsed();
	this.addResult(operationDst);
}

// Delphi:TSituation.CalculeNbMaxOperandes
function getMaxNumberOfOperands() // returns integer
{
	var n = 0;
	for(var i = 0; i < this.operand.length; i++)
		if (!this.operand[i].isUsed)
			n++;
	return n;
}


// Delphi:TSituation.AjouteNombre(nombre)
function addOperand(value)
{
	this.operand[this.operand.length] = new buildOperand(this, value);
}

// Delphi:TSituation.AjouteNombre(nombre)
function addOperandByCopy(operand)
{
	//this.operand[this.operand.length] = operand.copyIn(this); // function inline here
    if (operand.isUsed)
        this.operand[this.operand.length] = operand;
    else
        this.operand[this.operand.length] = new buildOperandAsCopy(this, operand);
}

function addResult(operation)
{
	this.operand[this.operand.length] = new buildOperandAsResult(operation);
}

// Delphi:TSituation.EcritApercuEnonceSiInexistant
function showPreviewSpeechIfNotExists(result) // returns boolean
{
	var BestResult = (Math.abs(result - count) < searchDistance);
	var stPreview = '';
	for(var i = 0; i < this.operand.length; i++)
		if (this.operand[i].isResult() && (!this.operand[i].isUsed)) {
			stPreview = this.operand[i].operation.stPreviewSpeech(iaType.iatOperation);
			break;
		}
	if (BestResult || (stSolutions.indexOf(stPreview) < 0)) {
		if (BestResult) {
			searchDistance = Math.abs(result - count);
			initializeSolutions();
		}
        if ((!firstSolutionOnly) || (!stSolutions.length)) {
            var i = stSolutions.length;
            stSolutions[i] = stPreview;
            solutionStats[i] = new buildSolutionStat(this.numberOfNumbersUsed(),
                                                     1+this.operand[this.operand.length-1].operation.numberOfOperations(), 
                                                     this.operand[this.operand.length-1].operation.maxResult());
        }
		return true;
	}
	else
		return false;
}

// Delphi:TSituation.NbResultatsInutilises
function numberOfResultsUnused() // returns integer
{
	var n = 0;
	for(var i = 0; i < this.operand.length; i++)
		if (this.operand[i].isResult() && (!this.operand[i].isUsed))
			n++;
	return n;
}

// Delphi:TSituation.NbPlaquesUtilisees
function numberOfNumbersUsed() // returns integer
{
	var n = 0;
    for(var i = 0; i < numberMaxOfNumbers; i++)
		if (this.operand[i].isUsed)
			n++;
	return n;
}

// Delphi:TSituation.EstOperationPossible
function isPossibleOperation(/*var*/result, mainOperator, operandIndex, operandContrary) // returns boolean
{
    this.result = result; // original integer parameter is passed by reference
	var operand = this.operand[operandIndex];
	switch(mainOperator) {
		case mainOperatorType.moPlus:
			if (operandContrary) {
				if (this.result <= operand.value) 
					return false;
				this.result -= operand.value;
				return true;
			}
			else {
				this.result += operand.value;
				return true;
			}
			break;
		case mainOperatorType.moMultiply:
			if (iaOptimizations.iaoNoMultiplyOrDivideBy1 && (operand.value == 1))
				return false;
			if (operandContrary) {
				if (this.result % operand.value)
					return false;
				this.result /= operand.value;
				return true;
			}
			else {
				this.result *= operand.value;
				return true;
			}
			break;
		default: return false;	
	}
}
	
// Delphi:TSituation.Cherche
function searchSolutions(depth)
{
	//var numberIndex; // IndexNombre (declared integer in for instruction)
	//var operandIndex; // IndexOperande (declared integer in for instruction)
	var contraryOperandIndex = 0; // IndexOperandeContraire (integer)
	var maxNumberOfOperands = 0; // NbMaxOperandes (integer)
	//var numberOfOperands; // NbOperandes (declared integer in for instruction)
	//var mainOperator; // Operateur (declared TOperateur in for instruction)
	//var operandChoiceNumber; // NumeroChoixOperandes (declared integer in for instruction)
	var operandNumber = new Array(0, 0, 0, 0, 0, 0); // NumeroOperande (array of integer)
	var operandContrary = new Array(false, false, false, false, false, false); // ContraireOperande (array of boolen) 
	//var contrarietyChoiceNumber; // NumeroChoixContrarietes (declared integer in for instruction)
	var availableOperandIndex = new Array(0, 0, 0, 0, 0, 0); // IndexNombreDisponible (array of integer)
	var numberOfAvailableOperands = 0; // NbNombresDisponibles (integer)
	//var operation = null; // Operation (TOperation) // declared inline
	//var situation = null; // Situation (TSituation) // declared inline
	var isSameTypeResultOperand = false; // OperandeResultatMemeType (boolean)
	var isImpossibleOperation = false; // OperationImpossible (boolean)
	var isEqualToResultOperand = false; // OperandeEgalResultat (boolean)
	var areContraryOperands = false; // OperandesContraires (boolean)
	// var contrariety = false; // Contrariete (declared boolean in for instruction)
	var result = 0; // Resultat (integer)
	
	maxNumberOfOperands = this.getMaxNumberOfOperands();
	// 1. Calculating indexes of available numbers in the array this.operand
	for(var i = 0; i < this.operand.length; i++)
		if (!this.operand[i].isUsed) {
			availableOperandIndex[numberOfAvailableOperands] = i;
			numberOfAvailableOperands++;
		}
	
	// 2. Choosing an operation in the possible cases
	for(var numberOfOperands = 2; numberOfOperands <= maxNumberOfOperands; numberOfOperands++) 
		for(var mainOperator = mainOperatorType.moPlus; mainOperator <= mainOperatorType.moMultiply; mainOperator++) 
			for(var operandChoiceNumber = 0; operandChoiceNumber < numberOfOperandChoices[numberOfOperands-2][maxNumberOfOperands-2]; operandChoiceNumber++)
				for(var contrarietyChoiceNumber = 0; contrarietyChoiceNumber < numberOfContrarietyChoices[numberOfOperands]-1; contrarietyChoiceNumber++) {
					isSameTypeResultOperand = false;
					isImpossibleOperation = false;
					isEqualToResultOperand = false;
					areContraryOperands = false;
					if (mainOperator == mainOperatorType.moPlus) 
						result = 0;
					else
						result = 1;
					for(var contrariety = false; contrariety <= true; contrariety++) {
						for(var operandIndex = 0; operandIndex < numberOfOperands; operandIndex++)
							if (contrariety == ((contrarietyChoiceNumber & numberOfContrarietyChoices[operandIndex]) > 0)) {
								operandNumber[operandIndex] = availableOperandIndex[operandNumberChoice[numberOfOperands-2][maxNumberOfOperands-2][operandChoiceNumber][operandIndex]];
								operandContrary[operandIndex] = contrariety;
								if (!this.isPossibleOperation(  result,
                                                                mainOperator,
                                                                operandNumber[operandIndex],
                                                                operandContrary[operandIndex])) {
									isImpossibleOperation = true;
									break;
								}
                                result = this.result; // It's impossible in Javascript to pass in a function an integer parameter by reference so the modified value is in the property this.result!
								if (iaOptimizations.iaoNoResultWithSameOperandType &&
									this.operand[operandNumber[operandIndex]].isResult() &&
									(this.operand[operandNumber[operandIndex]].operation.mainOperator == mainOperator)) {
									isSameTypeResultOperand = true;
									break;
								}
							}
					}	
					if (isImpossibleOperation || isSameTypeResultOperand) {
						numberOfConsideredCalculations++;
						continue;							
					}
					for(var operandIndex = 0; operandIndex < numberOfOperands; operandIndex++) 
						if (iaOptimizations.iaoNoResultEqualToOperand &&
							(this.operand[operandNumber[operandIndex]].value == result)) {
							isEqualToResultOperand = true;
							break;
						}
					if (isEqualToResultOperand) {	
						numberOfConsideredCalculations++;
						continue;
					}
					if ((mainOperator == mainOperatorType.moPlus) || (numberOfOperands > 2))
						for(var operandIndex = 0; operandIndex < numberOfOperands - 1; operandIndex++)
							for(var contraryOperandIndex = operandIndex + 1; contraryOperandIndex < numberOfOperands; contraryOperandIndex++)
								if (iaOptimizations.iaoNoContraryOperands &&
									(this.operand[operandNumber[operandIndex]].value == this.operand[operandNumber[contraryOperandIndex]].value) &&
									(operandContrary[operandIndex] == !operandContrary[contraryOperandIndex])) {
									areContraryOperands = true;
									break;
								}
					if (areContraryOperands) {
						numberOfConsideredCalculations++;
						continue;
					}
					var operation = new buildOperation(this, mainOperator);
					for(var operandIndex = 0; operandIndex < numberOfOperands; operandIndex++)
						operation.addOperandInOperation(operandNumber[operandIndex], operandContrary[operandIndex], true);
					operation.setResult();
					var situation = new buildSituationByOperation(operation);
					if ((Math.abs(operation.result - count) <= searchDistance) &&
						(situation.numberOfResultsUnused() == 1))
						situation.showPreviewSpeechIfNotExists(operation.result);
					if (operation.result != count)
						situation.searchSolutions(depth+1);
					numberOfConsideredCalculations++;
                    situation = null;
                    operation = null;
                    if (firstSolutionOnly && (!searchDistance))
                        return;
				}
}

//---------------------------------------------------------
// SOLUTIONSTAT (& PROPSTAT) methods (Delphi:TStatSolution)
//---------------------------------------------------------

// Delphi:TStatSolution.Cree
function buildSolutionStat(numberOfNumbers, numberOfLines, lineMaxResult)
{
    // properties
    var d = new Date();
	this.numberOfNumbers = numberOfNumbers;
	this.numberOfLines = numberOfLines;
	this.lineMaxResult = lineMaxResult;
	this.complexityRank = 1; // defined after
    this.time = d.getTime()-topChrono.getTime();
}

function numberOfOperationsInLine(line) // recursive calculation of numberOfLines in buildPropositionStat() function
{
    var n = 0; // return value
    for(var i = 0; i < lineUsingResult.length; i++)
        if (lineUsingResult[i] == line + 1) {
            if (resultMainOperator[line] != resultMainOperator[i]) {
                n++;
                if (this.lineMaxResult < results[i]) 
                    this.lineMaxResult = results[i];
            }
            n += this.numberOfOperationsInLine(i);
        } 
    return n;
}

// propositionStat : the solutionStat for the proposition
 
function buildPropositionStat() // Calculate SolutionStat from proposition
{
    var numberOfResults = 0;
    // methods
    this.calculateComplexityRank = calculateComplexityRank;
    this.numberOfOperationsInLine = numberOfOperationsInLine;
    // properties
    this.finalResult = (rownum?results[rownum - 1]:0); // used only by propositionStat for comparing with final results of solutions found
    this.numberOfNumbers = 0;
    this.lineMaxResult = 0;
	this.complexityRank = 1; // defined after
    this.time = 0; // no time
    for(var i = 0; i < numbersTaken.length; i++)
        if (numbersTaken[i])
            this.numberOfNumbers++;
    this.numberOfLines = (rownum ? (1 + this.numberOfOperationsInLine(rownum - 1)) : 0); // set this.lineMaxResult too depending of mainOperator
}

function calculateComplexityRank()
{   
    for(var i = 0; i < solutionStats.length; i++)
        if ((this.numberOfNumbers > solutionStats[i].numberOfNumbers) ||
            ((this.numberOfNumbers == solutionStats[i].numberOfNumbers) &&
             (this.numberOfLines > solutionStats[i].numberOfLines)) ||
            ((this.numberOfNumbers == solutionStats[i].numberOfNumbers) &&
             (this.numberOfLines == solutionStats[i].numberOfLines) &&
             (this.lineMaxResult > solutionStats[i].lineMaxResult))) 
             this.complexityRank++;
}

//-------------------
// STATISTICS methods
//-------------------

function buildStatistics() 
{
    if (localStorage.getItem('searched')) { // loading stats if saved
        this.searched = parseInt(localStorage.searched);
        this.proposed = parseInt(localStorage.proposed);
        this.maxFound = parseInt(localStorage.maxFound);
        this.cntFound = parseInt(localStorage.cntFound);
        this.fullCalc = parseInt(localStorage.fullCalc);
        this.complexity = parseInt(localStorage.complexity);

        // v1.1 statistics of duration & times of propositions
        if (localStorage.getItem('proposedTimed')) {
            this.proposedTimed = parseInt(localStorage.proposedTimed); // number of propositions timed (all since v1.1)
            this.proposedOnce = parseInt(localStorage.proposedOnce); // number of propositions typed once (then with duration statistics)
            this.propDuration = parseInt(localStorage.propDuration); // duration in seconds
            this.proposedTimes = parseInt(localStorage.proposedTimes); // Number of times needed to propose the calculation (then no duration stats) 
        }
        else { // v1.1 properties (reset) 
            this.proposedTimed = 0;
            this.proposedOnce = 0;
            this.propDuration = 0; 
            this.proposedTimes = 0;
        }
        
    }
    else { // properties (reset)
        this.searched = 0; // one is searched at the moment of a solution is calculated (one or all solutions)
        this.proposed = 0; // one is proposed at the moment of a result is calculated in the porposition
        this.maxFound = 0; // one is max found when the final result in the solution(s) found and the final result in the proposition are identical
        this.cntFound = 0; // one is cnt found when the final result in the solution(s) found is equal to the count (le compte est bon)
        this.fullCalc = 0; // one is full calc when all solutions are calculated (for the complexity calculation) 
        this.complexity=0; // the complexity is sum of the rank of the proposition in the complexity classification divided by the number of the solutions (in percents). O%=simplest.
        // v1.1 
        this.proposedTimed = 0;
        this.proposedOnce = 0;
        this.propDuration = 0; 
        this.proposedTimes = 0;
    }
    // methods
    this.showStatistics = showStatistics;
    this.addStatistics = addStatistics;
    this.resetStatistics = resetStatistics;
}

function addStatistics(searched, proposed, maxFound, cntFound, fullCalc, complexity, /* v1.1 */ proposedTimed, proposedOnce, propDuration, proposedTimes)
{
    if (searched)
        this.searched++;
    if (proposed)
        this.proposed++;
    if (maxFound)
        this.maxFound++;
    if (cntFound)
        this.cntFound++;
    if (fullCalc)
        this.fullCalc++;
    this.complexity += complexity;
    
    // v1.1
    if (proposedTimed) { // if nothing proposed, no time statistics
        this.proposedTimed++; 
        if (proposedOnce)
            this.proposedOnce++;
        if (propDuration)
            this.propDuration += propDuration;
        if (proposedTimes > 1)
            this.proposedTimes += proposedTimes;
    }
    
    // saving stats...
    localStorage.searched = this.searched;
    localStorage.proposed = this.proposed;
    localStorage.maxFound = this.maxFound;
    localStorage.cntFound = this.cntFound;
    localStorage.fullCalc = this.fullCalc;
    localStorage.complexity = this.complexity;

    // v1.1
    localStorage.proposedTimed = this.proposedTimed;
    localStorage.proposedOnce = this.proposedOnce;
    localStorage.propDuration = this.propDuration;
    localStorage.proposedTimes = this.proposedTimes;
}

function showStatistics()
{
    var msg = (this.searched?
               ('Sur '+this.searched+' compte'+((this.searched>1)?'s':'')+', vous avez...\n'+
                ' • proposé '+this.proposed+' fois une solution'+(this.searched?' ('+Math.round((100*this.proposed)/this.searched)+'%)':'')+',\n'+
                ' • trouvé '+this.maxFound+' fois le meilleur'+(this.proposed?' ('+Math.round((100*this.maxFound)/this.proposed)+'%)':'')):
                'Il n\'y a aucune statistique');
    
    // v1.1 : not yet displayed (always around 100%)
    /*
    if (this.maxFound)
        msg = msg + ' dont '+Math.round((100*this.cntFound)/this.maxFound)+'% de bons comptes';
    */

    msg = msg + '.\n\n';
    
    // v1.1
    if (this.proposedTimed) {
        msg = msg + 'Sur '+this.proposedTimed+' proposition'+((this.proposedTimed>1)?'s':'')+', vous en avez...\n';
        if (this.proposedOnce) {
            msg = msg + ' • saisie'+((this.proposedOnce > 1)?'s ':' ')+this.proposedOnce+' en 1 fois ('+Math.round((100*this.proposedOnce)/this.proposedTimed)+'%)';
            msg = msg + ' en '+Math.round(this.propDuration/this.proposedOnce)+' secondes en moyenne';
            if (this.proposedTimed - this.proposedOnce)
                msg = msg + ',\n';
            else
                msg = msg + '.\n';
        }
        if (this.proposedTimed - this.proposedOnce) {
            msg = msg + ' • saisie'+(((this.proposedTimed - this.proposedOnce) > 1)?'s ':' ')+(this.proposedTimed - this.proposedOnce)+' en + d\'1 fois ('+Math.round((100*(this.proposedTimed - this.proposedOnce))/this.proposedTimed)+'%)';
            msg = msg + ' : '+(Math.round((10.0 * this.proposedTimes)/(this.proposedTimed - this.proposedOnce))/10).toString().replace('.',',')+' fois en moyenne';
            msg = msg + '.\n';
        }
    }
    
    if (this.fullCalc)
        msg = msg + '\nVotre « tendance » à la complexité est de '+Math.round(this.complexity/this.fullCalc)+'% sur '+this.fullCalc+' compte'+((this.fullCalc>1)?'s.':'.');
        // v1.1 - remark not yet displayed
        //+'*.\n\n(*) le taux de complexité n\'est calculé que si la recherche de toutes les solutions est activée.';
    
    alert('Statistiques\n\n'+msg);
}

function resetStatistics()
{
    this.searched = 0;
    this.proposed = 0; 
    this.maxFound = 0; 
    this.cntFound = 0; 
    this.fullCalc = 0; 
    this.complexity=0; 
    
    /* replaced by a localStorage.clear()
    localStorage.removeItem('searched');
    localStorage.removeItem('proposed'); 
    localStorage.removeItem('maxFound'); 
    localStorage.removeItem('cntFound'); 
    localStorage.removeItem('fullCalc'); 
    localStorage.removeItem('complexity'); 
    */
    
    // v1.1
    this.proposedTimed = 0;
    this.proposedOnce = 0;
    this.propDuration = 0; 
    this.proposedTimes = 0;
}

//-----------------
// IA function call
//-----------------

function sortSolutionsByComplexity()
{   // setting solutionStats[].complexityRank and populating array solutionIndexSortedByComplexity
    solutionIndexSortedByComplexity.length = solutionStats.length;
    for(var i = 0; i < solutionStats.length; i++) {
        for(var j = 0; j < solutionStats.length; j++)
            if ((solutionStats[i].numberOfNumbers > solutionStats[j].numberOfNumbers) ||
                ((solutionStats[i].numberOfNumbers == solutionStats[j].numberOfNumbers) &&
                 (solutionStats[i].numberOfLines > solutionStats[j].numberOfLines)) ||
                ((solutionStats[i].numberOfNumbers == solutionStats[j].numberOfNumbers) &&
                 (solutionStats[i].numberOfLines == solutionStats[j].numberOfLines) &&
                 (solutionStats[i].lineMaxResult > solutionStats[j].lineMaxResult)) ||
                ((solutionStats[i].numberOfNumbers == solutionStats[j].numberOfNumbers) &&
                 (solutionStats[i].numberOfLines == solutionStats[j].numberOfLines) &&
                 (solutionStats[i].lineMaxResult == solutionStats[j].lineMaxResult) &&
                 (stSolutions[i] > stSolutions[j]))) 
                 solutionStats[i].complexityRank++;
        solutionIndexSortedByComplexity[solutionStats[i].complexityRank - 1] = i;
    }
}

// Second line of buttons : Info + Options buttons left aligned and solution index right aligned 
function showSolutionInfo(reset) 
{
	var keybTable = document.getElementById('info');
	var row = document.createElement('tr');
	removeAllChildren(keybTable);
    var stInfo = (reset?'*':((currentSolutionIndex+1)+'l'+stSolutions.length)); // max length of stInfo : 7 (xxx/xxx)
    var l = numberOfColumnsI - stInfo.length;
    for(var x = l - 1; x >= 0; x--)
        stInfo = ((x < keybinfo.length)?keybinfo[x]:'*') + stInfo; // right alignment
	for(var x = 0; x < numberOfColumnsI; x++ ) {
		var col = document.createElement('td');
		var img = document.createElement('img');
		img.setAttribute('onclick', 'clic(' + ((x < keybinfo.length)?(infoIndex+x):0) + ')'); // clic() action for keybinfo buttons
        img.setAttribute(srcAttr, pngFolder+stInfo[x]+((x<keybinfo.length)?((keybinfo[x]=='o')?(firstSolutionOnly?'x':'v'):''):(currentSolutionIndex+1==lastPropositionComplexityRank?'x':'v'))+pngExt); // v2.3: personal solution in red if the best one found
        img.setAttribute(wdthAttr, ((x < keybinfo.length)?32:16));
		img.setAttribute(hghtAttr, 30);
		col.appendChild(img);
		row.appendChild(col);
	}
	keybTable.appendChild(row);
}
 
function displayCurrentSolution()
{ // Display stSolutions[currentSolutionIndex]

    setup(gameModeType.gmReset); // setup with new game (reset screen)
    
    showSolutionInfo(false); // show the solution index (1=simplest). False = no reset
    
    var stOperand = '';
    var resultIsComing = false;

    for(var i = 0; i < stSolutions[solutionIndexSortedByComplexity[currentSolutionIndex]].length; i++) {
        var o = stSolutions[solutionIndexSortedByComplexity[currentSolutionIndex]][i];
        if ((o >= '0') && (o <= '9')) {// digits
            if (resultIsComing)
                continue; // Result is ignored after '=' because the result is already displayed on the screen by the calculate() function
            else
                stOperand = stOperand + o;
        }
        else { // operators
            if (resultIsComing)
                resultIsComing = false;
            if (o == ' ') // New line then continue
                continue; 
                
            // Search about the operand (number or result?)
            var valueTypeFound = valueType.vtUndefined;
            var operand = parseInt(stOperand);

            stOperand = '';    
            
            // 1. Results first
            for(var j = 0; j < results.length; j++) 
                if ((!resultsTaken[j]) && (operand == results[j])) {
                    chooseResult(100 * (1 + j) + resultColFrom[j]);
                    valueTypeFound = valueType.vtResult;
                    break;
                }
                
            // 2. Numbers
            if (valueTypeFound != valueType.vtResult) {
                for(var j = 0; j < numbersChosen.length; j++)
                    if ((!numbersTaken[j]) && (operand == numbers[numbersChosen[j]])) {
                        chooseNumber(firstChosenNumberIndex + j);
                        valueTypeFound = valueType.vtNumber;
                        break;
                    }
            }
            
            // Now testing the operator...
            switch(o) {
                case '+': o = 'p'; break;
                case '-': o = 'm'; break;
                case '*': o = 'f'; break;
                case '/': o = 'd'; break;
                case '=': o = 'e'; break;
                default:  o = '*'; break;
            }
            
            if (o == '*') continue;
            
            var y = 0;
            while(o != alphabet[y])
                y++;
            
            // ... (+ - * /)
            if (operate(y)) continue;
        
            // ... (=)
            if (calculate(y)) {
                resultIsComing = true;
                continue;           
            }
        }
    }
}
 
function searchAndDisplaySolutions()
{
    var noSearch = (firstSolutionOnly && (propositionStat.finalResult == count)); // v1.1 : if fistSolutionOnly and best result found : no search.
    
    // Initialization of global variables for searching process...
	numberOfConsideredCalculations = 0;
	searchDistance = 0x7FFFFFFF;

    var s = new buildSituation();

	
	if (!noSearch) { // v1.1 : if fistSolutionOnly and best result found : no search.
        topChrono = new Date(); // Top Chrono!
		for(var i = 0; i < numberMaxOfNumbers; i++)
			s.addOperand(numbers[numbersChosen[i]]);
		initializeSolutions();
		s.searchSolutions(1);        // 1=depth (for debugging only)
		sortSolutionsByComplexity(); // set solutionStats[].complexityRank even if first solution only
	}
    else
        searchDistance = 0; // no search but count found!

	if ((!firstSolutionOnly) && (Math.abs(propositionStat.finalResult - count) == searchDistance))
        propositionStat.calculateComplexityRank(); // set propositionStat.complexityRank if the solutions' result is equal to the proposition's result

    var n = (noSearch?1:solutionStats.length);
    
    statistics.addStatistics(true, 
                             !!propositionStat.numberOfLines, 
                             (Math.abs(propositionStat.finalResult - count) == searchDistance),
                             (Math.abs(propositionStat.finalResult == count)), 
                             (Math.abs(propositionStat.finalResult == count) && (!firstSolutionOnly)), 
                             ((Math.abs(propositionStat.finalResult == count) && (!firstSolutionOnly) && (n > 1))?
                              Math.floor((100 * (propositionStat.complexityRank - 1)) / (n - 1)):0
                             ),
                              // v1.1
                             !!rownum, // nothing proposed: no proposition statistics
                             !tmsProp, // 0 (true) = once. 1 (false) = more than once
                             tmsProp?0:Math.round(durProp/1000.0),
                             1 + tmsProp // number of times
                            );

    if (noSearch) return; // v1.1 : if fistSolutionOnly and best result found : no search : quit now.
    
    var plurial = ((n>1)?'s':'');
    var msg = (searchDistance?('Le compte est approché (±'+searchDistance+') :'):'Le compte est bon :') + '\n'+
              n + ' solution' + plurial + ' en ' + solutionStats[n-1].time + ' ms.\n';

    /* // List of solutions for debugging only
    for(var i = 0; i < n; i++)
        msg = msg + ' • ' + stSolutions[solutionIndexSortedByComplexity[i]] + '\n';
    */    
    
    if ((!firstSolutionOnly) && // for debugging only
        (Math.abs(propositionStat.finalResult - count) == searchDistance)) {
        msg = msg + 'Votre calcul est au '+propositionStat.complexityRank+((propositionStat.complexityRank>1)?'ème':'er')+' rang.\n';
        lastPropositionComplexityRank = propositionStat.complexityRank; // v2.3. display proposition rank in red in solution lists
    } else
        lastPropositionComplexityRank = 0; // v2.3. display proposition rank in red in solution lists

    if (firstSolutionOnly)
        msg = msg + numberOfConsideredCalculations + 
                    ' calculs envisagés.\n\nSeule la première solution trouvée est affichée :\n'+
                    ' • Touchez « OK » pour terminer.';                
    else 
        msg = msg + numberOfConsideredCalculations + 
					' calculs envisagés.\nLes solutions sont affichées de la plus simple à la plus complexe :\n'+
                    ' • Touchez « < » et « > »\npour passer de l\'une à l\'autre\n'+
                    ' • Touchez « X »\npour afficher la plus simple\n'+
                    ' • Touchez « xxx »\npour afficher la plus complexe\n'+
                    ' • Touchez « OK » pour terminer.';                

    alert(msg);
    
    displayCurrentSolution();
}


//-----------//
// Interface //
//-----------//	
	
function buildModeType()
{
    this.mTypingSolution = 0;
    this.mSearchingSolutions = 1;
    this.mViewingSolutions = 2;
}   

function buildOperatorKindType()
{
	this.okUndefined = 0;
	this.okAddOrSubstract = 1;
	this.okMultiplyOrDivide = 2;
}

function buildOperatorType()
{
	this.oUndefined = 0;
	this.oAdd = 1;
	this.oSubstract = 2;
	this.oMultiply = 3;
	this.oDivide = 4;
}

function buildOperatorIndexType()
{
	this.oiAdd = 11;
	this.oiSubstract = 12;
	this.oiMultiply = 13;
	this.oiDivide = 14;
	this.oiCalculate = 15;
}

function buildStepType()
{
	this.sUndefined = 0;
	this.sNumberExpected = 1;
	this.sOperatorExpected = 2;
}

function buildDeletionStepType()
{
	this.dsNoDeletion = 0;
	this.dsLineDeletion = 1;
	this.dsCalcDeletion = 2;
}

function buildValueType()
{
	this.vtUndefined = 0;
	this.vtNumber = 1;
	this.vtResult = 2;
}

function buildGameModeType()
{
    this.gmNew = 0; // new game
    this.gmLoad = 1; // load in progress
    this.gmReset = 2; // in case of deletion
    this.gmSearch = 3; // load and search solutions - used for showWelcome()
    this.gmView = 4;   // new game without welcome msg - used for showWelcome() 
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
	for( var x = 0; x < numberOfColumnsG; x++ ) {
		grid[x] = new Array(numberOfRowsG);
		for( var y = 0; y < numberOfRowsG; y++ ) {
			grid[x][y] = 0;
		}
	}
}

function addCountSeparator(row) // v1.1 : due to display of difficulty
{
    var col = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute(srcAttr, pngFolder+'c-.png');
    img.setAttribute(wdthAttr, 12);
    img.setAttribute(hghtAttr, 64);
    col.appendChild(img);
    row.appendChild(col);
}

function addDifficulty(row, rightSide) // v1.1 : due to display of difficulty
{
    var col = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute(srcAttr, pngFolder+'d-.png');
    if (rightSide) img.setAttribute(idAttr, 'd');
    img.setAttribute(wdthAttr, 100);
    img.setAttribute(hghtAttr, 12);
    col.appendChild(img);
    row.appendChild(col);
}

function showDifficulty() // v1.1 
{
    var newSrc;
    var pngSuffix;
    
    if (!firstSolutionOnly)
        if (searchDistance)
            pngSuffix = '9';
        else
            pngSuffix = '' + (solutionStats[solutionIndexSortedByComplexity[0]].numberOfNumbers +
                              solutionStats[solutionIndexSortedByComplexity[0]].numberOfLines - 3);
    else
        pngSuffix = '-';
                              
    newSrc = pngFolder + 'd' + pngSuffix + pngExt;
    document.images['d'].src = newSrc;
}

function showCount(gameMode)
{
	var countTable = document.getElementById('count');
	removeAllChildren(countTable);
 	// Now, let's choice the six numbers...
	if (gameMode == gameModeType.gmNew)
		count = countMin + Math.floor(Math.random() * (numberOfCountPossibilities));
		//count = 264; // Replace previous by this to force a count
        
	// Count to find
	var row = document.createElement('tr');
    
    addDifficulty(row, false); // v1.1: to balance with the difficulty mark
    addCountSeparator(row); // v1.1: separate count & difficulty
    
	for( var x = 0; x < numberOfColumnsC; x++ ) {
		var col = document.createElement('td');
		var img = document.createElement('img');
		if (x==2)  
			img.setAttribute(srcAttr, pngFolder+'c'+(count%10)+((count%10==1)?'f'+pngExt:pngExt)); // v2.1: 1 at the end is stuck
		else 
			if (x==1)
				img.setAttribute(srcAttr, pngFolder+'c'+(Math.floor(count/10) % 10)+pngExt);
			else
				img.setAttribute(srcAttr, pngFolder+'c'+Math.floor(count/100)+((count<200)?'d'+pngExt:pngExt));	// v2.1: 1 at the beginning is stuck		 
		img.setAttribute(wdthAttr, 32);
		img.setAttribute(hghtAttr, 64);
		col.appendChild(img);
		row.appendChild(col);
	}
    addCountSeparator(row); // v1.1: separate count & difficulty
    addDifficulty(row, true); // v1.1: difficulty mark 
	countTable.appendChild(row);
    if (mode == modeType.mViewingSolutions) 
        showDifficulty();
}

function showNumbers(gameMode)
{
	var numbersTable = document.getElementById('numbers');
	removeAllChildren(numbersTable);

	if (gameMode == gameModeType.gmNew) { // Now, let's choice the six numbers...
		var chosen = new Array (false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
		for(var x=0; x<numberMaxOfNumbers; x++) {
			var choice = Math.floor(Math.random() * (numberOfNumberPossibilities-x));
            /* var choice; // Replace previous line by this code to force numbers 
            switch(x) { 
                case 0: choice = 22; break;
                case 1: choice = 4; break;
                case 2: choice = 8; break;
                case 3: choice = 6; break;
                case 4: choice = 4; break;
                case 5: choice = 13; break;
            }
            */
			var delta = 0
			for(var y=0; y<=choice; y++)
				while (chosen[y+delta]) delta++;
			chosen[choice+delta]=true;
			numbersChosen[x]=choice+delta;
		}
	}
 		 	
	// Numbers to use
	var row = document.createElement('tr');
	for( var x = 0; x < numberOfColumnsN; x++ ) {
		var col = document.createElement('td');
		var img = document.createElement('img');
		img.setAttribute('onclick', 'clic(' + (firstChosenNumberIndex + Math.floor(x / 2)) + ')');
		if (x % 2) {
			img.setAttribute(srcAttr, pngFolder+'*.png');
			img.setAttribute(wdthAttr, 11); 
		}
		else {	
			img.setAttribute(srcAttr, pngFolder+'p'+numbers[numbersChosen[Math.floor(x / 2)]]+pngExt);
			img.setAttribute(wdthAttr, 44); 
		}
		img.setAttribute(hghtAttr, 30);
		col.appendChild(img);
		row.appendChild(col);
		numbersTable.appendChild(row);
	}
		
	// Check boxes
	var row = document.createElement('tr');
	for( var x = 0; x < numberOfColumnsN; x++ ) {
		var col = document.createElement('td');
		var img = document.createElement('img');
		img.setAttribute(srcAttr, pngFolder+'v.png');
		if (!(x % 2)) {
			img.setAttribute(idAttr, Math.floor(x / 2) + '*');
			img.setAttribute(wdthAttr, 44);
            if ((gameMode == gameModeType.gmLoad) &&
                (numbersTaken[Math.floor(x / 2)]))
                img.setAttribute(srcAttr, pngFolder+'x.png');
		}
		else {
			img.setAttribute(wdthAttr, 11);
		}
		img.setAttribute(hghtAttr, 30);
		col.appendChild(img);
		row.appendChild(col);
		numbersTable.appendChild(row);
	}
}

function showKeyboard()
{
	var keybTable = document.getElementById('keyboard');
	var row = document.createElement('tr');
	removeAllChildren(keybTable);
	for( var x = 0; x < numberOfColumnsK; x++ ) {
		var col = document.createElement('td');
		var img = document.createElement('img');
		img.setAttribute('onclick', 'clic('+x+')');
		img.setAttribute(srcAttr, pngFolder+keyboard[mode][x]+pngExt);
		if (keyboard[mode][x] == 'k') // v1.4.1
			img.setAttribute(idAttr, 'ok'); // v1.4.1
		img.setAttribute(wdthAttr, 32);
		img.setAttribute(hghtAttr, 40);
		col.appendChild(img);
		row.appendChild(col);
	}
	keybTable.appendChild(row);
}

function refreshGrid()
{
    for( var y = 0; y < numberOfRowsG; y++ )
        for( var x = 0; x < numberOfColumnsG; x++ ) {
            var suffix = '';
            if (results[y] && (x >= resultColFrom[y]) && (x <= resultColTo[y]))
                suffix = (resultsTaken[y]?'x':'v');
            var newSrc = pngFolder+alphabet[grid[x][y]]+suffix+pngExt;
            document.images[x+'*'+y].src = newSrc;
        }
}

function resetSettings()
{
 firstSolutionOnly = false; // v2.3: Option "firstSolutionOnly" is false by default now!
 /* // replaced by a localStorage.clear()
 localStorage.removeItem('firstSolutionOnly');
 */
}

function loadSettings()
{
    if (!localStorage.getItem('firstSolutionOnly'))
        firstSolutionOnly = false; // v2.3: Option "firstSolutionOnly" is false by default now!
    else
        firstSolutionOnly = (localStorage.firstSolutionOnly.toString() == 'true');
}


function saveGameInProgress()
{
    localStorage.gameInProgress = true;
    localStorage.rownum = rownum;
    localStorage.colnum = colnum;
    localStorage.equalAvailable = equalAvailable;

    localStorage.count = count;

    for( var x = 0; x < numberOfColumnsG; x++ )
        for( var y = 0; y < numberOfRowsG; y++ ) 
            localStorage.setItem('grid'+(100*(y+1)+x+1), grid[x][y]);

    // Numbers...
    for( var i = 0; i < numberMaxOfNumbers; i++) {
        localStorage.setItem('numbersChosen'+i, numbersChosen[i]);
        localStorage.setItem('numbersTaken'+i, numbersTaken[i]);
        localStorage.setItem('lineUsingNumber'+i, lineUsingNumber[i]);
    }

    // Results by line...
    for( var i = 0; i < numberOfRowsG; i++) {
        localStorage.setItem('results'+i, results[i]);
        localStorage.setItem('resultsTaken'+i, resultsTaken[i]);
        localStorage.setItem('resultColFrom'+i, resultColFrom[i]);
        localStorage.setItem('resultColTo'+i, resultColTo[i]);
        localStorage.setItem('lineUsingResult'+i, lineUsingResult[i]);
        localStorage.setItem('resultMainOperator'+i, resultMainOperator[i]);
    }
    
    // line buffers
    localStorage.currentLineBufferResult = currentLineBufferResult;
    localStorage.lastSelectedValue = lastSelectedValue;
    localStorage.lastSelectedValueType = lastSelectedValueType;
    localStorage.lastSelectedNumberCol = lastSelectedNumberCol;
    localStorage.lastSelectedResultRow = lastSelectedResultRow;

    // current operation (don't mix operator types [+,-] and [*,/] on a same line) 
    localStorage.operatorKind = operatorKind;
    localStorage.operator = operator;
    localStorage.step = step;
    localStorage.deletionStep = deletionStep;
    localStorage.currentSolutionIndex = currentSolutionIndex;

    localStorage.mode = mode;
    // v1.1
    localStorage.tmsProp = tmsProp; 
    localStorage.durProp = durProp;
}

function loadGameInProgress()
{
    if (!localStorage.getItem('gameInProgress')) {
        setup(gameModeType.gmNew); // no game in progress: newgame
        welcomeMode = gameModeType.gmNew;
    }
    else {
        
        mode = parseInt(localStorage.mode);

        // v1.1: number of times for typing proposition... one more!
        if (localStorage.getItem('tmsProp')) {
            tmsProp = parseInt(localStorage.tmsProp);
            durProp = parseInt(localStorage.durProp);
        }
        else {
            tmsProp = 0;
            durProp = 0;
        }
        if (mode == modeType.mTypingSolution) {
            tmsProp++;
            durProp = 0;
            localStorage.tmsProp = tmsProp; 
            localStorage.durProp = durProp; 
        }
        
        if (mode == modeType.mViewingSolutions) {
            mode = modeType.mTypingSolution;
            setup(gameModeType.gmNew); // no game in progress: newgame
            welcomeMode = gameModeType.gmView; // newgame without welcome msg
            return;
        }

        rownum = parseInt(localStorage.rownum);
        colnum = parseInt(localStorage.colnum);
        equalAvailable = (localStorage.equalAvailable.toString() == 'true');

        count = parseInt(localStorage.count);

        grid = new Array(numberOfColumnsG);
        for( var x = 0; x < numberOfColumnsG; x++ ) {
            grid[x] = new Array(numberOfRowsG);
            for( var y = 0; y < numberOfRowsG; y++ ) {
                grid[x][y] = parseInt(localStorage.getItem('grid'+(100*(y+1)+x+1)));
            }
        }

        // Numbers...
        for( var i = 0; i < numberMaxOfNumbers; i++) {
            numbersChosen[i] = parseInt(localStorage.getItem('numbersChosen'+i));
            numbersTaken[i] = (localStorage.getItem('numbersTaken'+i).toString() == 'true');
            lineUsingNumber[i] = parseInt(localStorage.getItem('lineUsingNumber'+i));
        }

        // Results by line...
        for( var i = 0; i < numberOfRowsG; i++) {
            results[i] = parseInt(localStorage.getItem('results'+i));
            resultsTaken[i] = (localStorage.getItem('resultsTaken'+i).toString() == 'true');
            resultColFrom[i] = parseInt(localStorage.getItem('resultColFrom'+i));
            resultColTo[i] = parseInt(localStorage.getItem('resultColTo'+i));
            lineUsingResult[i] = parseInt(localStorage.getItem('lineUsingResult'+i));
            resultMainOperator[i] = parseInt(localStorage.getItem('resultMainOperator'+i));
        }
        
        // line buffers
        currentLineBufferResult = parseInt(localStorage.currentLineBufferResult);
        lastSelectedValue = parseInt(localStorage.lastSelectedValue);
        lastSelectedValueType = parseInt(localStorage.lastSelectedValueType);
        lastSelectedNumberCol = parseInt(localStorage.lastSelectedNumberCol);
        lastSelectedResultRow = parseInt(localStorage.lastSelectedResultRow);

        // current operation (don't mix operator types [+,-] and [*,/] on a same line) 
        operatorKind = parseInt(localStorage.operatorKind);
        operator = parseInt(localStorage.operator);
        step = parseInt(localStorage.step);
        deletionStep = parseInt(localStorage.deletionStep);
        currentSolutionIndex = parseInt(localStorage.currentSolutionIndex);
        mode = parseInt(localStorage.mode);

        switch(mode) {
            case modeType.mTypingSolution:
                setup(gameModeType.gmLoad); // refresh game in progress
                welcomeMode = gameModeType.gmLoad;
                break;
            case modeType.mSearchingSolutions:
                mode = modeType.mTypingSolution;
                setup(gameModeType.gmLoad); // refresh game in progress
                propositionStat = new buildPropositionStat();
                mode = modeType.mSearchingSolutions; 
                allowClicks = false; // touch screen to search solutions
                welcomeMode = gameModeType.gmSearch;
                break;
        }
    }

}

//Set up the game on the page using DOM elements
function setup(gameMode) // if newgame is true, new numbers and count are chosen
{
	// grid
 	if (gameMode != gameModeType.gmLoad) 
        resetGrid();
	var gridTable = document.getElementById('grid');
	removeAllChildren(gridTable);
	for( var y = 0; y < numberOfRowsG; y++ ) {
		var row = document.createElement('tr');
		for( var x = 0; x < numberOfColumnsG; x++ ) {
			var col = document.createElement('td');
			var img = document.createElement('img');
			img.setAttribute('onclick', 'clic('+(100*(y+1)+x)+')');
			img.setAttribute(srcAttr, pngFolder+'*.png');
			img.setAttribute(idAttr, x+'*'+y);
			img.setAttribute(wdthAttr, 16);
			img.setAttribute(hghtAttr, 30);
			col.appendChild(img);			
			row.appendChild(col);
		}
		gridTable.appendChild(row);
	}
    
    if (gameMode == gameModeType.gmLoad)
        refreshGrid();
    
	showCount(gameMode);
	showNumbers(gameMode);
	showKeyboard();
    
    if (gameMode != gameModeType.gmReset) 
        showSolutionInfo(true); // reset: no line info, only commands

    if (gameMode == gameModeType.gmLoad) {
       	allowClicks = true;
       return;
    }

	rownum = 0;
	colnum = 0;	
	equalAvailable = false;
	allowClicks = true;
	operator = operatorType.oUndefined;
	step = stepType.sNumberExpected;
	deletionStep = deletionStepType.dsLineDeletion;
	currentLineBufferResult = 0;
	lastSelectedValue = 0;
	lastSelectedValueType = valueType.vtUndefined;
	lastSelectedNumberCol = 0;
	lastSelectedResultRow = 0;
	
	for( var i = 0; i < numberMaxOfNumbers; i++) {
		numbersTaken[i] = false;		
		lineUsingNumber[i] = 0;
	}
	for( var i = 0; i < numberOfRowsG; i++) {
		results[i] = 0;
		resultColFrom[i] = 0;
		resultColTo[i] = 0; 
		lineUsingResult[i] = 0;
		resultsTaken[i] = false;
        resultMainOperator[i] = mainOperatorType.moUndefined;
	}
    
    if (gameMode == gameModeType.gmNew) {
        tmsProp = 0;
        saveGameInProgress();
        topProp = new Date(); // top chrono!
    }
}

function showWelcome() // No parameter. The argument is the var welcomeMode because the call is in the index.html file
{
    var msg = 'Bienvenue dans Comptissibon !\n\n';
    switch(welcomeMode) {
        case gameModeType.gmNew: 
            msg = msg + 'Vous devez trouver le compte en jaune en utilisant les nombres et les opérateurs affichés.\nChaque nombre doit être utilisé une seule fois.\n« = » affiche automatiquement le résultat.\nVous pouvez avoir plus de 2 nombres par ligne (+ et - ne se mélangent pas avec × et ÷).\n« OK » termine le calcul.\n\nTouchez « i » pour plus d\'infos.';
            break;
        case gameModeType.gmLoad:
            msg = msg + 'Un calcul est toujours en cours...\n\n« OK » termine le calcul.\nTouchez « i » pour plus d\'infos.';
            break;
        case gameModeType.gmSearch:
            msg = msg + 'Lors du dernier compte, ';
            if (!rownum)
                msg = msg + 'vous n\'avez rien saisi.';
            else 	
                if (results[rownum - 1] == count)
                    msg = msg + 'vous aviez proposé un calcul et vous l\'aviez trouvé.';
                else 
                    msg = msg + 'vous aviez proposé un calcul mais vous ne l\'aviez pas trouvé.';
            if (firstSolutionOnly && (rownum > 0) && (results[rownum - 1] == count)) // v1.1 : first solution and count found : no search
                msg = msg + '\n\nTouchez l\'écran pour passer à un nouveau compte.';
            else 
                msg = msg + '\n\nTouchez l\'écran pour rechercher les solutions.';
            break;
        case gameModeType.gmView:
            msg = msg + 'Voici un nouveau compte à trouver...\n\n« OK » termine le calcul.\nTouchez « i » pour plus d\'infos.';
            break;
    }
    alert(msg);
}

//Update image at position represented by (x,y)
function updateCell(x, y)
{
    var newSrc;
	newSrc = pngFolder+alphabet[grid[x][y]]+pngExt;
    document.images[x+'*'+y].src = newSrc;
}

function erasePlace(x)
{
	grid[x][rownum] = 0;
 	updateCell(x, rownum);
}

function eraseCurrentLine()
{
	for( var x = 0; x < numberOfColumnsG; x++) {
		erasePlace(x);
	}
	colnum = 0;
	equalAvailable = false; 
}

function addToGrid(x, y)
{ // x=0 is void ; 1 <= x <= 10 is digit(0~9) ; 11 <= x <= 15 is operator(+ - * / =)
	grid[colnum][rownum] = x;
 	var newSrc;
	newSrc = pngFolder+alphabet[grid[colnum][rownum]]+y+pngExt;
    document.images[colnum+'*'+rownum].src = newSrc;
    if (y == 'v') { 
    	if (!resultColFrom[rownum])
    		resultColFrom[rownum]=colnum;
    	resultColTo[rownum]=colnum;
    }
    colnum++; 
}

function addValueToGrid(x, y)
{
	if (x >= 100000000) 
		addToGrid(Math.floor(x / 100000000) % 10 + 1, y);
	if (x >= 10000000) 
		addToGrid(Math.floor(x / 10000000) % 10 + 1, y);
	if (x >= 1000000) 
		addToGrid(Math.floor(x / 1000000) % 10 + 1, y);
	if (x >= 100000) 
		addToGrid(Math.floor(x / 100000) % 10 + 1, y);
	if (x >= 10000) 
		addToGrid(Math.floor(x / 10000) % 10 + 1, y);
	if (x >= 1000) 
		addToGrid(Math.floor(x / 1000) % 10 + 1, y);
	if (x >= 100) 
		addToGrid(Math.floor(x / 100) % 10 + 1, y);
	if (x >= 10)
		addToGrid(Math.floor(x / 10) % 10 + 1, y);
	addToGrid(Math.floor(x % 10) + 1, y);
}

function removeLastValueFromGrid()
{
	colnum--;
	while((colnum>=0) && (grid[colnum][rownum] >= 1) && (grid[colnum][rownum] <= 10)) {
		erasePlace(colnum);
		colnum--;
	}
	colnum++;
}

function showResultTaken(y)
{
	for(x = resultColFrom[y]; x <= resultColTo[y]; x++) {
		var newSrc=document.images[x+'*'+y].src;
		newSrc=newSrc.replace('v.png','x.png');
		document.images[x+'*'+y].src = newSrc;
	}
}

function showResultUntaken(y)
{
	for(x = resultColFrom[y]; x <= resultColTo[y]; x++) {
		var newSrc=document.images[x+'*'+y].src;
		newSrc=newSrc.replace('x.png','v.png');
		document.images[x+'*'+y].src = newSrc;
	}
}

function showNumberTaken(x)
{
	var newSrc;
	newSrc = pngFolder+'x.png';
	document.images[x+'*'].src = newSrc;	
}

function showNumberUntaken(x)
{
	var newSrc;
	newSrc = pngFolder+'v.png';
	document.images[x+'*'].src = newSrc;	
}


// operator chosen ?
function operate(y)
{
    if ((!colnum) && (rownum > 0)) // v1.1 : if operator choosen in headline then the last result is automatically choosen
        chooseResult(100 * rownum + resultColFrom[rownum - 1]);
                    
	if (colnum && (y >= firstOperatorIndex) && (y <= lastOperatorIndex)) {

		var newOperator = y - (operatorIndexType.oiAdd - operatorType.oAdd);
		
		if ((!operatorKind) || // No operator chosen yet
			(operatorKind && (currentLineBufferResult == lastSelectedValue)) || // operator chosen but it's the first and change is allowed!
			(operatorKind == kindOf[newOperator])) {
			if (!operatorKind) {
				currentLineBufferResult = lastSelectedValue;
				operatorKind = kindOf[newOperator];
			}
			else {
				if (step == stepType.sNumberExpected) { // operator change
					colnum--;
					if (currentLineBufferResult == lastSelectedValue) {
						operatorKind = kindOf[newOperator];
						operator = operatorType.oUndefined;
						equalAvailable = false;
					}
				}
				else { // result is calculated the first time an operator is entered 
					switch(operator) {
						case operatorType.oAdd:
							currentLineBufferResult += lastSelectedValue;
							break;
						case operatorType.oSubstract:
							currentLineBufferResult -= lastSelectedValue;
							break;
						case operatorType.oMultiply:
							currentLineBufferResult *= lastSelectedValue;
							break;
						case operatorType.oDivide:
							currentLineBufferResult /= lastSelectedValue;
							break;
						default: break;
					}
				}
			}
			operator = newOperator;
			step = stepType.sNumberExpected;
			addToGrid(y, ''); 
            
            saveGameInProgress();
            
            //v1.1 : information about future impossible operation in cas of substraction with result = 1
            if ((operator == operatorType.oSubstract) && (currentLineBufferResult == 1))
               alert('Vous ne pouvez pas effectuer de soustraction à ce stade du calcul.\n\nChangez d\'opérateur ou calculez le résultat.');
		}
		return true; // operator chosen
	}
	else
		return false; // operator not chosen
}

function gameOver()
{
    var endOfMsg = (firstSolutionOnly?
                    (((rownum > 0) && (results[rownum - 1] == count))?
                        '\n\nTouchez l\'écran pour passer à un nouveau compte.': // v1.1 : first solution and count found : no search
                        '\n\nTouchez l\'écran pour rechercher puis afficher la première solution.'):
                    '\n\nTouchez l\'écran pour rechercher puis afficher toutes les solutions distinctes.\n\nCela peut durer plus d\'une minute.');

    // v1.1 : Top chrono! Calculating duration...
    if (!tmsProp)
        durProp = (new Date()).getTime() - topProp.getTime();
    else
        durProp = 0;
    
    if (rownum) // No time if nothing proposed...        
        endOfMsg = '\nProposition saisie en ' + (tmsProp?((1+tmsProp)+' fois'):(Math.round(durProp/1000.0) + ' s.')) + endOfMsg;
        
    endOfPropRequest = false;
    propositionStat = new buildPropositionStat();
    
	if (!rownum)
		alert('Vous n\'avez rien saisi...'+endOfMsg);
	else 	
		if (results[rownum - 1] == count)
			alert('Bravo !\nLe compte est bon !'+endOfMsg);
		else
			alert('Dommage !\nVous n\'avez pas trouvé le compte...'+endOfMsg);
    mode = modeType.mSearchingSolutions; // next step : searching solutions after touching the screen 
    localStorage.mode = mode;
    
    allowClicks = false;
}

function valueIsAllowed(result, operator, number)
{
	var msg = '';
	var allowed = true;
	switch(operator) {
		case operatorType.oDivide: // result must divide number
			if (result % number) {
				allowed = false;
				msg = result+' ne divise pas '+number+'.';
			}
			else
				allowed = true;
			break;
		case operatorType.oSubstract: // result must be greater than number
			if (result <= number) {
				allowed = false;
				msg = 'Vous devez choisir un nombre inférieur à '+result+'.'; // v1.1 "must be greater than" replaced by "you must choose a number greater than" 
			}
			else
				allowed = true;
			break;
		default: break;
	}
	if (!allowed) 
		alert('Choix incorrect.\n\n'+msg);
	return allowed;
}

// '=' is chosen?
function calculate(y)
{
	if (y == operatorIndexType.oiCalculate) {
		if (equalAvailable && operatorKind) {
            var toWrite;
            var lackOfSpace = false;
			if (step == stepType.sNumberExpected) { // operator change...
                toWrite = currentLineBufferResult + ''; // nothing to do : result is already calculated
                if (colnum + toWrite.length - 1 >= numberOfColumnsG)
                    lackOfSpace = true;
                else
                    colnum--;
			}
            else {
                switch(operator) {
                    case operatorType.oAdd:
                        toWrite = (currentLineBufferResult + lastSelectedValue) + '';
                        if (colnum + toWrite.length >= numberOfColumnsG) 
                            lackOfSpace = true;
                        else
                            currentLineBufferResult += lastSelectedValue;
                        break;
                    case operatorType.oSubstract:
                        toWrite = (currentLineBufferResult - lastSelectedValue) + '';
                        if (colnum + toWrite.length >= numberOfColumnsG) 
                            lackOfSpace = true;
                        else
                            currentLineBufferResult -= lastSelectedValue;
                        break;
                    case operatorType.oMultiply:
                        toWrite = (currentLineBufferResult * lastSelectedValue) + '';
                        if (colnum + toWrite.length >= numberOfColumnsG) 
                            lackOfSpace = true;
                        else
                            currentLineBufferResult *= lastSelectedValue;
                        break;
                    case operatorType.oDivide:
                        toWrite = (currentLineBufferResult / lastSelectedValue) + '';
                        if (colnum + toWrite.length >= numberOfColumnsG) 
                            lackOfSpace = true;
                        else
                            currentLineBufferResult /= lastSelectedValue;
                        break;
                    default: 
                        break;    
                }
            }
			if (lackOfSpace) { // not enough space to write the result of the operation on the current line
				if (mode != modeType.mViewingSolutions)
                   alert('Impossible d\'afficher le résultat du calcul !\n\nEffectuez ce calcul sur plusieurs lignes.\n\nTouchez la flèche gauche puis entrez le calcul sur plusieurs lignes.');
                saveGameInProgress();
				return true;
			}
			addToGrid(y, '');
			addValueToGrid(currentLineBufferResult, 'v');
			results[rownum] = currentLineBufferResult; 
            resultMainOperator[rownum] = mainOf[operator];
			operator = operatorType.oUndefined;
			operatorKind = operatorKindType.okUndefined;
			step = stepType.sNumberExpected;
			lastSelectedValue = 0;
			lastSelectedValueType = valueType.vtUndefined;
			lastSelectedNumberCol = 0;
			lastSelectedResultRow = 0;
			currentLineBufferResult=0;
			rownum++; colnum=0;
            equalAvailable = false;
		
			// Count found?
			if (results[rownum - 1] == count) {
				if (mode != modeType.mViewingSolutions)
                    gameOver();
                saveGameInProgress();
				return true;
			}		
		
		
			// Last result?
			var allResultsTaken = true;
			var z = rownum - 2;
			while(allResultsTaken && (z > -1)) {
				allResultsTaken = resultsTaken[z];
				z--;
			}
			if (allResultsTaken && 
				numbersTaken[0] &&
				numbersTaken[1] &&
				numbersTaken[2] &&
				numbersTaken[3] && 
				numbersTaken[4] && 
				numbersTaken[5]) {
				if (mode != modeType.mViewingSolutions)
                    gameOver();
                saveGameInProgress();
				return true;
			}
			else {
                saveGameInProgress();
				return true;
            }
		}
		else
			return true; // not allowed but '=' chosen
	}
	else 
		return false; // '=' not chosen
}

function removeLastValue()
{
	switch(lastSelectedValueType) {
		case valueType.vtNumber:
			numbersTaken[lastSelectedNumberCol] = false;
			lineUsingNumber[lastSelectedNumberCol] = 0;
			showNumberUntaken(lastSelectedNumberCol);
			break;
		case valueType.vtResult:
			resultsTaken[lastSelectedResultRow] = false;
			lineUsingResult[lastSelectedResultRow] = 0;
			showResultUntaken(lastSelectedResultRow);
			break;
	}
	removeLastValueFromGrid();
}

// A number is chosen?
function chooseNumber(x)
{
	if ((x >= firstChosenNumberIndex) && (x <= lastChosenNumberIndex)) { 
		// If the number is already taken then abort!
		if (numbersTaken[x - firstChosenNumberIndex])  
			return true; // already taken but a result was chosen! 
		
		// allowed (integer division, null result) ? 
		if (!valueIsAllowed(currentLineBufferResult, 
							operator, 
							numbers[numbersChosen[x - firstChosenNumberIndex]]))
			return true; // not allowed but a result was chosen! 
		
		if (step == stepType.sOperatorExpected) // The last choice is changed, let's remove the last choice...
			removeLastValue();
		
		// else let's check the number...
		showNumberTaken(x - firstChosenNumberIndex);
		numbersTaken[x - firstChosenNumberIndex] = true;
		lineUsingNumber[x - firstChosenNumberIndex] = rownum + 1;
		
		lastSelectedValue = numbers[numbersChosen[x - firstChosenNumberIndex]];
		lastSelectedValueType = valueType.vtNumber;
		lastSelectedNumberCol = x - firstChosenNumberIndex;
			
		addValueToGrid(lastSelectedValue, '');
		step = stepType.sOperatorExpected;
		if (operator) equalAvailable = true;
        saveGameInProgress();
	}
	else
		return false;
}

// A result is chosen ? (the test is inside the function. If chosen then return true)
function chooseResult(x)
{
	var chosenResultRow = Math.floor(x / 100) - 1;
	var chosenResultCol = x % 100;
	if (results[chosenResultRow] &&
		(chosenResultRow >= 0) && (chosenResultRow <= 4) &&
	    (chosenResultCol >= resultColFrom[chosenResultRow]) &&
	    (chosenResultCol <= resultColTo[chosenResultRow])) { 
		// If the result is already taken then abort!
		if (resultsTaken[chosenResultRow])  
			return true; // already taken but a result was chosen! 
		// allowed (integer division, null result) ? 
		if (!valueIsAllowed(currentLineBufferResult, 
							operator, 
							results[chosenResultRow]))
			return true; // not allowed but a result was chosen! 
		
		if (step == stepType.sOperatorExpected) // The last choice is changed, let's remove the last choice...
			removeLastValue();
		
		resultsTaken[chosenResultRow] = true;
		lineUsingResult[chosenResultRow] = rownum + 1;
			
		lastSelectedValue = results[chosenResultRow];
		lastSelectedValueType = valueType.vtResult;
		lastSelectedResultRow = chosenResultRow;
			
		addValueToGrid(lastSelectedValue, '');
		showResultTaken(chosenResultRow);
		step = stepType.sOperatorExpected;
		if (operator) equalAvailable = true;
        saveGameInProgress();
		return true;
	}
	else 
		return false;
}

function displayWait(display) // v1.4.1
{
	document.images['ok'].src = pngFolder + (display?'sablier.png':'k.png'); 
}

function clic(x) // v1.3 instead of click
{ 	// Range of x :
    //   0 ~  9 : keyboard (first line) -----> switch(keyboard[mode][x]) for action except if exists y where alphabet[y] = keyboard[mode][x] then operate(y) or calculate(y)  
    //  10 ~ 15 : keybinfo (second line) ----> switch(keybinfo[x-infoIndex]) for action
    //  20 ~ 25 : numbers (1~6)         -----> chooseNumber(x)
    // 100 & +  : results (100*y+x)     -----> chooseResult(x)
         
    if (!allowClicks) {
        switch(mode) {
            case modeType.mSearchingSolutions:
                if (firstSolutionOnly & (rownum > 0) && (results[rownum - 1] == count)) { // v1.1 : if firstSolution and count found : no search & new game.
                    searchAndDisplaySolutions();
                    mode = modeType.mTypingSolution;
                    currentSolutionIndex = 0; // the simplest solution will be shown first the next time
                    setup(gameModeType.gmNew); // setup with new game
                }
                else {
                    mode = modeType.mViewingSolutions;
                    showKeyboard();
                    displayWait(true); // v1.4.1
                    setTimeout(function() { // v1.4
                        try { searchAndDisplaySolutions(); } catch(e) {}
                    	displayWait(false); // v1.4.1
                    }, 500); // v1.4
                }
                break;
            default: 
                setup(gameModeType.gmNew); // setup with new game
                break;
        }
        return;
    }

    if (x < keyboard[mode].length) { // allow to test keyboard[mode][x] (first line)

        resetStatsRequest = false;

        if (keyboard[mode][x] != 'k')
            endOfPropRequest = false;
        
        if (keyboard[mode][x] == '*') return;
	
        // Button Ok (calculation termination)
        if (keyboard[mode][x] == 'k') {
            switch(mode) {
                case modeType.mViewingSolutions:
                    mode = modeType.mTypingSolution;
                    currentSolutionIndex = 0; // the simplest solution will be shown first the next time
                    setup(gameModeType.gmNew); // setup with new game
                    break;
                default:
                    if (rownum || endOfPropRequest) {
						// v1.1 : precaution: erasing line not finished
                        step = deletionStepType.dsLineDeletion;
						clic(7);
                        gameOver();
                    }
                    else 
                        if (!rownum) {
                            alert('Êtes-vous sûr(e) de vouloir abandonner la saisie ?\n\nPour confirmer veuillez toucher à nouveau « OK ».');
                            endOfPropRequest = true;
                        }
                    break
            }
            return;
        }
        
        // Exclusive commands to mViewingSolutions mode
        
        switch(keyboard[mode][x]) {
            case 'i': // [<]
                if (currentSolutionIndex) {
                    currentSolutionIndex--;
                    displayCurrentSolution();
                }
                return;
            case 's': // [>]
                if (currentSolutionIndex + 1 < stSolutions.length) {
                    currentSolutionIndex++;
                    displayCurrentSolution();
                }
                return;
            case 'z': // [x] simplest solution
                currentSolutionIndex = 0;
                displayCurrentSolution();
                return;
            case 'c': // [xxx] most complex solution
                currentSolutionIndex = stSolutions.length - 1;
                displayCurrentSolution();
                return;
        }
        
        // Now, testing commands out of mViewingSolutions mode        
        if (mode == modeType.mViewingSolutions)
            return;

        // Button BackSpace (deletion)
        if (keyboard[mode][x] == '-') {
            switch(deletionStep) {
                case deletionStepType.dsLineDeletion:
                    // Unselecting numbers chosen on the current line...
                    for (var i = 0; i < numberMaxOfNumbers; i++) 
                        if (lineUsingNumber[i] == rownum + 1) {
                            numbersTaken[i] = false;
                            lineUsingNumber[i] = 0;
                            var newSrc;
                            newSrc = pngFolder+'v.png';
                            document.images[i+'*'].src = newSrc;				
                        }
                    // Unselecting results chosen on the current line...
                    for (var i = 0; i < numberOfRowsG; i++) 
                        if (lineUsingResult[i] == rownum + 1) {
                            resultsTaken[i] = false;
                            lineUsingResult[i] = 0;
                            showResultUntaken(i);
                        }
                    operator = operatorType.oUndefined;
                    operatorKind = operatorKindType.okUndefined;
                    step = stepType.sNumberExpected;
                    lastSelectedValue = 0;
                    currentLineBufferResult=0;
                    eraseCurrentLine();
                    deletionStep = deletionStepType.dsCalcDeletion;
                    break;
                case deletionStepType.dsCalcDeletion:
                    setup(gameModeType.gmReset);  // refresh without newgame
                    deletionStep = deletionStepType.dsLineDeletion;
                    break;
                default: break;	
            }
            saveGameInProgress()
            return;
        }
        else {
            deletionStep = deletionStepType.dsLineDeletion;
            localStorage.deletionStep = deletionStep;
        }

        // Operators (+ - * / =)
        var y = 0; 
        while (keyboard[mode][x] != alphabet[y]) y++; 

        // ... (+ - * /)
        if (operate(y)) return;
        
        // ... (=)
        if (calculate(y)) return;

    }
    else
        endOfPropRequest = false;
	
    if ((x >= infoIndex) && (x < keybinfo.length + infoIndex)) {// allow to test keyinfo[x] (second line)
        switch(keybinfo[x-infoIndex]) {
            case 'a': // About... 
                alert('À propos...\n\nComptissibon version '+stVersion+'\n\nDéveloppé par Patrice Fouquet\n\nhttp://patquoi.fr/Comptissibon.html\ncomptissibon@patquoi.fr\n\nLes commandes sont en blanc.\nLes options & paramètres en bleu.\n\nTouchez i pour plus d\'aide.');
                break;
            case 'o': // Option: about solution searching process (one or all solutions)
                var msg = '';
                if (mode == modeType.mViewingSolutions)
                    msg = 'Vous ne pouvez pas changer cette option pendant la visualisation des solutions.\nTouchez « OK » pour quitter la visualisation des solutions puis touchez à nouveau « 1/1 » ou « <OK> ».';
                else {
                    firstSolutionOnly = !firstSolutionOnly;
                    localStorage.firstSolutionOnly = firstSolutionOnly; 
                    msg = (firstSolutionOnly?'Seule la première solution sera recherchée et affichée.':'Toutes les solutions distinctes seront recherchées et affichées par ordre de la plus simple à la plus complexe.\n\nCette opération peut durer plus d\'une minute.');
                }
                alert('Option de recherche\ndes solutions\n\n'+msg);
                showSolutionInfo(mode != modeType.mViewingSolutions);
                break;  
            case 'n': // informations (i)
                alert('Commandes (en blanc)\n\n« + - × ÷ » sont les opérateurs.\n« = » calcule le résultat de la ligne.\n« ← » efface la ligne/tout le calcul.\n« OK » termine le calcul.\n« X » montre la solution la + simple.\n« xxx » la solution la + tordue.\n« < » et « > » liste les solutions.\n\nOptions (en bleu)\n\n« ? » affiche la version.\n« % » affiche les statistiques.\n« <OK> » = « toutes solutions ».\n« 1/1 » = « 1ère solution ».\n« RAZ » réinitialise tout.');
                break;
            case 't': // statistics (%)
                statistics.showStatistics();
                break;
            case 'r': // reset stats
                if (!resetStatsRequest) {
                    alert('Êtes-vous sûr(e) de vouloir remettre à zéro les statistiques et les options ?\n\nPour confirmer touchez à nouveau « RAZ ».');
                    resetStatsRequest = true;
                }
                else {
                    statistics.resetStatistics();
                    resetSettings();
                    localStorage.clear();
                    alert('Les statistiques et les options ont été remises à zéro.');
                    resetStatsRequest = false;
                    mode = modeType.mTypingSolution;
                    setup(gameModeType.gmNew);
                }
                break;
            default: 
                resetStatsRequest = false;
                break;
        }
        if (keybinfo[x-infoIndex] != 'r')
            resetStatsRequest = false;
    }
    else { 
        resetStatsRequest = false;
    }
    
    // there's no more command in mViewingSolutions mode here
    if (mode == modeType.mViewingSolutions)
        return;

	// One of the six chosen number?
	if (chooseNumber(x)) return;

	// One of the five (max) chosen result?
	if (chooseResult(x)) return;
	
}
