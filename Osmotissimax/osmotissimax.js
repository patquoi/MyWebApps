 /*
 
 Fichier: Osmotissimax.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.8>
 
 Copyright (C) 2012 Patrice Fouquet.
 
 */ 

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.8';

/*
Version 1.1.1
 - ajout stats et tops coup Fil Orange
 - oubli stats et tops Fil Orange en cas d'abandon du Fil Orange
 - oubli de sauvegarder automatiquement les solutions trouvées
 - Message de changement de dictionnaire n'apparaît qu'une fois par dictionnaire.
 - Changement de dico et lien vers site de définition inactifs si livre et '?' invisibles
 - Aide contextuelle inhibée si pas de mot+score affiché sous les compteurs.
Version 1.2 
 - affichage info dernier coup (mots/score/top) 
Version 1.2.1
 - Inversion ordre affichage Tops puis Stats.
 - Retour à l'affichage des Tops après avoir joué.
Version 1.3.1
 - Sablier pour chargement grille
Version 1.3.2
 - Affichage d'une solution si proposition erronée dans le Fil Orange
Version 1.3.3
 - Si la grille est verdie et que la partie est reprise, un mot déjà trouvé affichait le message "Grille verdie" ou "Tous les mots trouvés".
 - Dernier coup/score Fil Orange enregistré et affiché à la reprise.
Version 1.4
 - On ne stocke plus l'historique des scores (ScoreGrille et ScoreOrange)
 - les boutons (i) et ? ont été inversés.
Version 1.4.1
 - accès 1mot.fr (minuscules)
Version 1.5
 - Optimisation de vitesse dans la création d'une grille
Version 1.6
 - Des pourcentages remplacent les max dans le score, le bonus et le total
 - Plus de max dans les tops
 - Code de triche pour afficher les solutions
Version 1.7
 - ODS7 : et on compte en temps réel le nombre de mots
Version 1.7.1
 - Optimisation pour iOS (splash + spinner)
Version 1.7.2
 - Constantes de tailles de dictionnaire par lettres ne sont plus en constantes mais recalculés à la volée : nbMots[x] = dico[x].length
Version 1.7.4 (alignement des versions)
 - Clic sur les compteurs de mots : on affiche les mots (trouvés/tous si manche terminée)
Version 1.8
 - ODS8
 */

const stVerDico = '8';

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------

const typeDir = new creeTypeDir();

const dx = [0,-1,-1,0,1,1,0];
const dy = [0,-1,0,1,1,0,-1];

const invDir = [typeDir.dIndefinie, typeDir.d6h, typeDir.d8h, typeDir.d10h, typeDir.d0h, typeDir.d2h, typeDir.d4h]; 

// Calcul de coordonnées
const xyMin = 	[0,0,0,0,0, 0, 1, 2, 3, 4, 5];
const xyMax = 	[5,6,7,8,9,10,10,10,10,10,10];
const xDir  =  [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // dIndefinie
				[10,10,10,10,10,10, 9, 8, 7, 6, 5], // d0h
				[ 5, 6, 7, 8, 9,10,10,10,10,10,10], // d2h
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10], // d4h
				[ 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0], // d6h
				[ 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5], // d8h
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10]];// d10h
const yDir  =  [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // dIndefinie
				[ 5, 6, 7, 8, 9,10,10,10,10,10,10], // d0h
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10], // d2h
				[ 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5], // d4h
				[ 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5], // d6h
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10], // d8h
				[ 5, 6, 7, 8, 9,10,10,10,10,10,10]];// d10h	

// clic(x) <=> h[x][y]
const clicXY = [[ 0, 1, 2, 3, 4, 5, 0, 0, 0, 0, 0],
				[ 6, 7, 8, 9,10,11,12, 0, 0, 0, 0],
				[13,14,15,16,17,18,19,20, 0, 0, 0],
				[21,22,23,24,25,26,27,28,29, 0, 0],
				[30,31,32,33,34,35,36,37,38,39, 0],
				[40,41,42,43,44,45,46,47,48,49,50],
				[ 0,51,52,53,54,55,56,57,58,59,60],
				[ 0, 0,61,62,63,64,65,66,67,68,69],
				[ 0, 0, 0,70,71,72,73,74,75,76,77],
				[ 0, 0, 0, 0,78,79,80,81,82,83,84],
				[ 0, 0, 0, 0, 0,85,86,87,88,89,90]];
const xClic  =	[0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,10,10,10,10,10,10];
const yClic  =	[0,1,2,3,4,5,0,1,2,3,4,5,6,0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7,8,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,2,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,4,5,6,7,8,9,10,5,6,7,8,9,10];

// Score: mot de  5, 6, 7, 8, 9,10,11 lettres  
//               x7 x6 x5 x4 x3 x2 x1 
const scoreMot=[[ 0, 0, 0, 0, 0, 0, 0], // dIndefinie
				[49,42,35,28,21,14, 7], // d0h  x7
				[35,30,25,20,15,10, 5], // d2h  x5
				[28,24,20,16,12, 8, 4], // d4h  x4
				[42,36,30,24,18,12, 6], // d6h  x6
				[56,48,40,32,24,16, 8], // d8h  x8
				[63,54,45,36,27,18, 9]];// d10h x9
// Score: mot de  5, 6, 7, 8, 9,10,11 lettres  (Fil Orange : score RETOURNE !)
//               x1 x2 x3 x4 x5 x6 x7 
const scoreMto=[[ 0, 0, 0, 0, 0, 0, 0], // dIndefinie
				[ 7,14,21,28,35,42,49], // d0h  x7
				[ 5,10,15,20,25,30,35], // d2h  x5
				[ 4, 8,12,16,20,24,30], // d4h  x4
				[ 6,12,18,24,30,36,42], // d6h  x6
				[ 8,16,24,32,40,48,56], // d8h  x8
				[ 9,18,27,36,45,54,63]];// d10h x9
			
const tailleLigne   = [6, 7, 8, 9,10,11,10, 9, 8, 7, 6];
const tailleMinMot	= 5;
const tailleMaxMot	= 11;

const chancesAuDebut= 10;

const nbMaxAbsentes	= 8;
const nbLignes		= 11;
const nbCases		= 91;

const charCodeMin   = 64;

// v1.7.2 nbMots[x] est changé en dico[x].length
// const nbMots		= new Array (7645, 17318, 31070, 46329, 57467, 60487, 55436); 

const typeCoul		= new creeTypeCoul();

const typeFin		= new creeTypeFin();

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// Couleurs
// 0=gris, 1=vert, 2=rouge
const stCoul          	 = 'gvor';

// Directions
const stDir        		 = ['NA','0H','2H','4H','6H','8H','10H'];
const stJokers			 = ['?????','??????','???????','????????','?????????','??????????','???????????'];

// ID (IMG)
const idLettre			 = 'l'; // id de lettre = "lXY" où X,Y = 'A'~'K'
const idCoteNS			 = 'n'; // id du côté Nord-Sud (montant) = "mXXY" où X,Y = 'A'~'K' (XX = transition croissante des X)
const idCoteSN			 = 's'; // id du côté Nord-Sud (descendant) = "mXYY" où X,Y = 'A'~'K' (YY = transition croissante des Y)
const idBordGN			 = 'gn'; // id du bord Gauche Nord = "gnX" où X = 'A'~'K'
const idBordGS			 = 'gs'; // id du bord Gauche Nord = "gsY" où Y = 'A'~'K'
const idBordDN			 = 'dn'; // id du bord Gauche Nord = "dnY" où Y = 'A'~'K'
const idBordDS			 = 'ds'; // id du bord Gauche Nord = "dsX" où X = 'A'~'K'
const idXY				 = 'ABCDEFGHIJK';
const idCptSep			 = 'cs';
const idGrille			 = 'grille';
const idChances			 = 'chances';
const idBtnGauche		 = 'btn1';
const idBtnDroite		 = 'btn2';

// Id de scores
const idScore			 = 'ss';
const idBonus			 = 'sb';
const idTotal			 = 'st';
const idPartie			 = 'sp';
const idNumerateur		 = 'n';
const idDenominateur     = 'd';
const idChiffreScore	 = 'udcm';
const idChiffrePartie	 = ['nu','nd','nc','nm','dm','cm'];
const idFinMot           = 'msf'; 
const idFinScore		 = 'mpu';
const exp10              = [1,10,100,1000,10000,100000,1000000]; // Merci Javascript : Math.exp10() n'existe pas... 

// Chaînes PNG 
const chmPng             = 'png/';
const extPng             = '.png';
const fond				 = '-';
const hexaVide			 = 'h0';
const demiVide           = 'hns0';
const coteVide           = 'cns0';
const nord               = 'n';
const sud                = 's';
const coteN				 = 'cn';
const coteS				 = 'cs';
const coteGN			 = 'cgn';
const coteGS			 = 'cgs';
const coteDN			 = 'cdn';
const coteDS			 = 'cds';
const cptVert			 = 'v';
const cptRouge			 = 'x';
const cptGris			 = 'i';
const cptBlanc			 = 'o';
const cptOrange          = 'f';
const cptSep			 = '-';
const motVert			 = 'v';
const motGris			 = 'g';
const cotesNS		 	 = 'cngsg';
const cotesSN		 	 = 'csgng';
const prmDico			 = 'dico';
const hrefDef			 = 'def';
const sfxCoupFO          = 'c'; // v1.2
const sablier			 = 'sablier'; // v1.3.1
// Diverses chaînes
const stLettre           = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const espace             = ' ';
const joker				 = '?';
const vide				 = '';
const pluriel			 = 's';

// dictionnaires en ligne
const nbDicosDef		 = 5;
const nomDico			 = ['Centre National de Ressources Textuelles et Lexicales', 'Wiktionnaire', 'Larousse', 'Reverso', '1mot.fr'];
const pngDico            = ['dico-cnrtl', 'dico-wikti', 'dico-lar', 'dico-reverso', 'dico-1mot'];
const lnkDico			 = ['http://www.cnrtl.fr/definition/', 'http://fr.wiktionary.org/w/index.php?search=', 'http://www.larousse.fr/dictionnaires/francais/', 'http://dictionnaire.reverso.net/francais-definition/', 'http://1mot.fr/'];
const idPrmDico			 = 'mdc';
const idLnkDico			 = 'mld';
const extHTM			 = '.htm';

// Titres
const stAide			 = 'Aide';
const stMotIncorrect	 = 'Mot incorrect';
const stConfirmation	 = 'Confirmation';
const stSolutions		 = 'Solutions';

// Divers
const indefini           = -1;
const oui                = true;
const non                = false;
const suivante			 = true;
const precedente		 = false;
// pour localStorage.getItem
const vrai				 = 'true'; 
const faux               = 'false';

// stats & tops
const typeStatutStatsEtTops = new creeTypeStatutStatsEtTops();

// localStorage

const lsTops 			= 'tops'; 
const lsTopsFO			= 'topsFO';
const lsTopsFOCoup		= 'topsFOCoup'; // v1.1
const lsStatsGrille 	= 'statsGrille';
const lsStatsFOGrille 	= 'statsFOGrille';
const lsStatsFOCoup     = 'statsFOCoup'; // v1.1
const lsStatsPartie 	= 'statsPartie';

const lsCase			= 'h';
const lsGrille			= 'grille';
const lsSolutions		= 'sol';
const lsSolFilOrange    = 'sfo';
const lsScoreGrille     = 'scg';
const lsScoreOrange     = 'sco';
const lsAttrSolutions   = 'xydmt'; // v1.1 : oubli du m !
const lsAttrCases       = 'lvor';
const lsAttrScores      = ['s','b','sm','bm','p','pm']; // v1.4 : ajout de 'p'+'pm'
const lsNbMotsGrille    = 'nbmg';
const lsNbMTrvGrille    = 'nmtg';
const lsNbMotsEnOrange  = 'nmeo';

const stTriche = 'SOLSOLUTIONS'; // v1.6 : code triche

//---------------------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// IA
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

var toucheAutorisee = false; // active clic(x) si true

var imgSrcGrilleSvg = ''; // v1.3.1. Sauvegarde de la png pendant affichage du sablier

// Choix : première lettre (non sauvegardé)
var xDepart = indefini;
var yDepart = indefini;
var dDepart = typeDir.dIndefinie;
// Choix : mot (non sauvegardé)
var tailleSelection = 0;
var tailleMotMarque = 0;
var numeroMotMarque = indefini;

// Stats génération grille (non sauvegardé)
var nbChoixOK = 0; 
var nbCasesOK = 0; 

// Remplissage de grille (non sauvegardé)
var grilleOK = false; 

// Comptages de mots
var nbMotsGrille = [0,0,0,0,0,0,0]; // constants à la création de grille : ls=OK
var nbMTrvGrille = [0,0,0,0,0,0,0]; // ls=fait

// Grille hexagonale
var h = []; // ls=fait

// Solutions
var s = [[],[],[],[],[],[],[]]; // constants à la création de grille : ls=OK

// Dictionnaire de définition
var dicoDef = 0; // Par défaut = cnrtl. ls=fait
var stDrnMotForme = vide; // Permet d'afficher sa définition (non sauvegardé)
var affichagesChgtDico = 0; // Nombre d'affichages de changement de dico (limité au nombre de dicos). v1.1

// Eléments de partie
var visualisationSolutions = false; // si true affichage en cours des solutions non trouvées. ls=fait
var confirmationGrilleDemandee = false; // Permet de toucher DEUX FOIS "Grille" pour passer à la suivante ou en mode Fil Orange : oblige à utiliser "Grille" pour passer à la suite (sauvegardé que pour la fin du Fil Orange)
var solutionVisualisee = indefini; // affichage de s[solutionVisualisee%10][Math.floor(solutionVisualisee/10)]. ls=fait
var affichageMessageGrilleVerdie = false; // Pour ne l'afficher qu'une fois (non sauvegardé)
var affichageAide = false; // Pour ne l'afficher qu'une fois. ls=fait
var fin = typeFin.fAucune; // ls=fait

var grille = 0; // numéro. La première c'est 1. constants à la création de grille : ls=OK
var chances = 0; // 10 pour la grille 1, 9 pour la suivante, etc. ls=fait
var lettresRestantes = nbCases; // Nombre de lettres grises. ls=fait 
var scoreGrille = new creeScoreGrille(); // scorePartie() renvoie le score de la partie (calculé). ls=fait. v1.4 : plus d'historique, tableau statique.

// stats & tops (sauvegardés séparément)
var statsEtTops        = new chargeStatsEtTops();
var statutStatsEtTops  = typeStatutStatsEtTops.ssetTops; // non sauvegardé. v1.2.1 ordre Tops & Stats inversé

// Fil Orange
var filOrange = false; // Mode "Fil Orange" : changement de lettre dans la grille pour former des mots. ls=fait
var nbLettresEnOrange = 0; // Compteur de lettres colorées pour détecter la grille toute orange. ls=fait
var stSolutionFilOrange = vide; // ls=fait
var lettreOrangeRemplacee = joker; // Lettre remplacée en xDepart, yDepart en mode "Fil Orange" (non sauvegardé)
var nbMotsEnOrange = [0,0,0,0,0,0,0]; // comme nbMotsGrille mais en mode "Fil Orange". ls=fait.
var scoreOrange = new creeScoreOrange(); // comme scoreGrille mais en mode "Fil Orange". ls=fait. v1.4 : plus d'historique, tableau statique.
var affichageAideFilOrange = false; // Pour ne l'afficher qu'une fois. ls=fait
var sfo = [[],[],[],[],[],[],[]]; // Solutions de la dernière proposition du Fil Orange. ls=fait

// stats dernier coup FO (sauvegardés pour affichage éventuel). v1.1
var drnCpFONbMots = 0; // Nb mots formés lors du dernier coup 
var drnCpFOScore  = 0; // Score du dernier coup

// Mode partie chargé
var partieChargee = false; // Indique si une partie a été chargée (non sauvegardé)
var stMsgPartieChargee = vide; // Msg à afficher après le chargement d'une partie


var triche = 0; // v1.6 : compteur code triche

//---------------------------------------------------------------------------
// FONCTIONS
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// constructeurs de types 
//---------------------------------------------------------------------------
function creeTypeDir()
{
    this.dIndefinie = 0;
    this.d0h        = 1;
    this.d2h        = 2;
    this.d4h        = 3;
    this.d6h        = 4;
    this.d8h        = 5;
    this.d10h       = 6;
}
//---------------------------------------------------------------------------
function creeTypeCoul()
{
    this.cGrise = 0;
    this.cVerte = 1;
    this.cOrange = 2;
    this.cRouge = 3;
}
//---------------------------------------------------------------------------
function creeTypeFin()
{
    this.fAucune = 0;
    this.fGrille = 1;
    this.fPartie = 2;
}
//---------------------------------------------------------------------------
function creeTypeStatutStatsEtTops()
{
    this.ssetTops  = 0; // v1.2.1 ordre Tops & Stats inversé
    this.ssetStats = 1; // v1.2.1 ordre Tops & Stats inversé
    this.ssetDmd   = 2;
    this.ssetRAZ   = 3;
}
//---------------------------------------------------------------------------
// fonctions d'IA
//---------------------------------------------------------------------------
// (x,y) dans (0~10,0~10) et d une direction (typeDir)
// d et k sont facultatifs (resp. typeDir.dIndefinie et 1 par défaut)
function estValide(x, y, d, k)
{
    if (d==undefined) d=typeDir.dIndefinie;
    if (k==undefined) k=1;
    var xx = x+k*dx[d];
    var yy = y+k*dy[d];
    if ((xx<0)||(yy<0)||(xx>10)||(yy>10)) 
        return false;
    if ((yy>xyMax[xx])||(xx>xyMax[yy]))
    	return false;
    else
        return true;
}
//---------------------------------------------------------------------------
function direction(x1, y1, x2, y2) // Si valide retourne une direction, sinon typeDir.dIndefinie
{
	// 0h/6h
	if (x1-x2==y1-y2) {
		if ((x1>x2) && (y1>y2)) 
			return typeDir.d0h;
		if ((x2>x1) && (y2>y1)) 
			return typeDir.d6h;
	}
	// 2h/8h
	if (y1==y2) {
		if (x1>x2)
			return typeDir.d2h;
		if (x2>x1)
			return typeDir.d8h;
	} 
	// 4h/10h
	if (x1==x2) {
		if (y1>y2)
			return typeDir.d10h;
		if (y2>y1)
			return typeDir.d4h;
	} 
	return typeDir.dIndefinie;
}
//---------------------------------------------------------------------------
function distance(x1, y1, x2, y2) // retourne le nombre de lettres entre les deux points, extrémités comprises. Suppose que direction(x1,y1,x2,y2) est non nul.
{
	// 0h/6h
	if (x1-x2==y1-y2) {
		if ((x1>x2) && (y1>y2)) 
			return 1+x1-x2;
		if ((x2>x1) && (y2>y1)) 
			return 1+x2-x1;
	}
	// 2h/8h
	if (y1==y2) {
		if (x1>x2)
			return 1+x1-x2;
		if (x2>x1)
			return 1+x2-x1;
	} 
	// 4h/10h
	if (x1==x2) {
		if (y1>y2)
			return 1+y1-y2;
		if (y2>y1)
			return 1+y2-y1;
	} 
	return 0;
}

//---------------------------------------------------------------------------
// Solutions
//---------------------------------------------------------------------------
function marqueSolution(x, y, d, t, stMot) // retourne true si le mot a déjà été marqué ou si le mot est introuvable (anomalie : on ne compte pas le mot)
{
	var i=t-tailleMinMot;
	var l=s[t-tailleMinMot].length;
	var solutionTrouvee = false;
	var dejaTrouvee = false;
	for(var j=0; j<l; j++)
		if ((s[i][j].x==x)&&
			(s[i][j].y==y)&&
			(s[i][j].d==d)&&
			(s[i][j].t==t)&&
			(s[i][j].stMot==stMot)) {
			dejaTrouvee=s[i][j].trouvee;
			s[i][j].trouvee = true;
			s[i][j].enregistre(i, j); // v1.1 (oubli)
			solutionTrouvee = true;
			if (dejaTrouvee) {
				s[i][j].majAffichage(true);
				tailleMotMarque = t;
				numeroMotMarque = j;
				alert('Attention, vous avez déjà trouvé le mot "'+stMot+'" dans cette position.');
			}
			break;
		}
	
	if (!solutionTrouvee) {
		alert('La sélection n\'a pas été trouvée parmi les solutions attendues !!!'); 
		dejaTrouvee=true;
	}
	return dejaTrouvee;
}
//---------------------------------------------------------------------------
function enregistreSolutions()
{
	for(var t=0; t<=tailleMaxMot-tailleMinMot; t++) {
		var l=s[t].length;
		localStorage.setItem(lsSolutions + t, l); // On enregistre le nombre de solutions par taille de mot
		for(var i=0; i<l; i++)
			s[t][i].enregistre(t, i);			
	}
}
//---------------------------------------------------------------------------
function chargeSolutions()
{
	for(var t=0; t<=tailleMaxMot-tailleMinMot; t++) {
		var l=parseInt(localStorage.getItem(lsSolutions + t));
		for(var i=0; i<l; i++)
			s[t][i] = new solutionCharge(t, i);			
	}
}

//---------------------------------------------------------------------------
// Fil Orange
//---------------------------------------------------------------------------
function enregistreSolutionsFilOrange()
{
	for(var t=0; t<=tailleMaxMot-tailleMinMot; t++) {
		var l=sfo[t].length;
		localStorage.setItem(lsSolFilOrange + t, l); // On enregistre le nombre de solutions par taille de mot
		for(var i=0; i<l; i++)
			sfo[t][i].enregistre(t, i);			
	}
}
//---------------------------------------------------------------------------
function chargeSolutionsFilOrange()
{
	for(var t=0; t<=tailleMaxMot-tailleMinMot; t++) {
		var l=parseInt(localStorage.getItem(lsSolFilOrange + t));
		for(var i=0; i<l; i++)
			sfo[t][i] = new solutionFilOrangeCharge(t, i);			
	}
}
//---------------------------------------------------------------------------
function afficheLettresInutilisees(liste)
{
	for(var i=0; i<nbMaxAbsentes; i++) {
		//if (i<liste.length) console.log(liste[i]+'('+i+')'); else console.log('?('+i+')');
		// Hexagone
		var id = idLettre + (i+1);
		var nvSrc = chmPng + ((i<liste.length)?(liste[i]+motGris):hexaVide) + extPng;
		//console.log('>'+id+'.src='+nvSrc);
		document.images[id].src = nvSrc;

		// Côté GN
		id = (((i==1)||(i==6))?(sud+((i%2)?'6':'3')+(i+1)):(idBordGN+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==1)||(i==6))&&(((i%2)?5:2)<liste.length))?cotesSN:(coteGN+motGris)):((((i==1)||(i==6))&&(((i%2)?5:2)<liste.length))?(coteDS+motGris):coteVide)) + extPng; 
		//console.log('>'+id+'.src='+nvSrc);
		document.images[id].src = nvSrc;
		
		// Côté DN
		id = (((i==0)||(i==7))?(nord+(i+1)+((i%2)?'4':'5')):(idBordDN+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==0)||(i==7))&&(((i%2)?3:4)<liste.length))?cotesNS:(coteDN+motGris)):((((i==0)||(i==7))&&(((i%2)?3:4)<liste.length))?(coteGS+motGris):coteVide)) + extPng; 
		//console.log('>'+id+'.src='+nvSrc);
		document.images[id].src = nvSrc;
		
		// Côté GS
		id = (((i==3)||(i==4))?(nord+((i%2)?'8':'1')+(i+1)):(idBordGS+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==3)||(i==4))&&(((i%2)?7:0)<liste.length))?cotesNS:(coteGS+motGris)):((((i==3)||(i==4))&&(((i%2)?7:0)<liste.length))?(coteDN+motGris):coteVide)) + extPng; 
		//console.log('>'+id+'.src='+nvSrc);
		document.images[id].src = nvSrc;
		
		// Côté DS
		id = (((i==2)||(i==5))?(sud+(i+1)+((i%2)?'2':'7')):(idBordDS+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==2)||(i==5))&&(((i%2)?1:6)<liste.length))?cotesSN:(coteDS+motGris)):((((i==2)||(i==5))&&(((i%2)?1:6)<liste.length))?(coteGN+motGris):coteVide)) + extPng; 
		//console.log('>'+id+'.src='+nvSrc);
		document.images[id].src = nvSrc;
	}
}
//---------------------------------------------------------------------------
function montreLettresInutilisees()
{
	var li = vide;
	var nl = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++) {
			nl[h[x][y].l.charCodeAt(0)-charCodeMin]++;
			nl[0]++;
		}
	for(var l='A'.charCodeAt(0); l<='Z'.charCodeAt(0); l++)
		if (!nl[l-charCodeMin])
				li = li + String.fromCharCode(l);
	//console.log('Lettres inutilisées (on n\'affiche que les 8 premières) : '+li);
	afficheLettresInutilisees(li);
}
//---------------------------------------------------------------------------
function cacheLettresInutilisees()
{
	afficheLettresInutilisees(vide);
}
//---------------------------------------------------------------------------
function filOrangePossible()
{
	stSolutionFilOrange = vide;
	if (nbLettresEnOrange==nbCases)  {
		//console.log('La grille est toute orange !');
		return false;
	}
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++) 
			if (!h[x][y].orange) {
				origine = h[x][y].l;
				for(var l='A'.charCodeAt(0); l<='Z'.charCodeAt(0); l++) {
					var score = 0;
					if (origine!=String.fromCharCode(l)) {
						h[x][y].l = String.fromCharCode(l);
						stSolutionFilOrange = 'En ('+String.fromCharCode(charCodeMin+x+1)+','+String.fromCharCode(charCodeMin+y+1)+') remplacer '+origine+' par '+h[x][y].l+' permettait, par exemple, de former ';
						for(var d=typeDir.d0h; d<=typeDir.d10h; d++) {
							var kMin=0;
							var kMax=0;
							for(; estValide(x, y, d, kMin); kMin--);
							kMin++;
							for(; estValide(x, y, d, kMax); kMax++);
							kMax--;
							var tailleMax=kMax-kMin+1;
							for(var t=tailleMax; t>=tailleMinMot; t--)
								for(var k0=Math.max(kMin, 1-t); k0<=Math.min(0, kMax-t+1); k0++) {
									var stMot = vide;
									for(var k=k0; k<k0+t; k++)
										stMot = stMot + h[x+k*dx[d]][y+k*dy[d]].l;
									if (dico[t-tailleMinMot].indexOf(stMot) > -1) {
										stSolutionFilOrange = stSolutionFilOrange + ' ' + stMot + ' (' + scoreMto[d][t-tailleMinMot] + ')'; 
										//console.log('>'+stMot+' en ('+(x+k0*dx[d])+','+(y+k*dy[d])+';'+stDir[d]+') avec '+scoreMto[d][t-tailleMinMot]+' points');
										score += scoreMto[d][t-tailleMinMot];
									}
								} 
						}
					} 
					if (score) {
						h[x][y].l = origine;
						stSolutionFilOrange = stSolutionFilOrange + ' rapportant '+score+' points.';
						localStorage.sfo = stSolutionFilOrange; // enregistrement auto
						//console.log(stSolutionFilOrange);
						//console.log('Fil Orange POSSIBLE: Score='+score+' avec '+String.fromCharCode(l)+' en ('+x+','+y+').');
						return true;
					}
				}
				h[x][y].l = origine;
			}
	//console.log('Fil Orange IMPOSSIBLE !');
	return false;
}
//---------------------------------------------------------------------------
function filOrangeCommence()
{
	filOrange = true; 
	montreLettresInutilisees(); 
	nbLettresEnOrange = 0;
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	for(var i=tailleMinMot; i<=tailleMaxMot; i++)
		afficheCompteur(i);
	// On rafraîchit les scores pour changer les couleurs
	afficheScore();
	changeEtatGrille(cptOrange);
	changeEtatChances();
	enregistrePartie();
	if ((grille == 1) && (!affichageAideFilOrange)) // On explique la première fois
		alert('Bienvenue dans le Fil Orange !\n\nVous devez changer une lettre dans la grille de telle sorte qu\'au moins un mot d\'au moins 5 lettres soit formé.\nLes mots formés deviennent orange.\nOcrer toute la grille double le score.\nSi vous ne formez pas de mots, le Fil Orange s\'arrête.\nTouchez une lettre à changer ou "Grille" pour abandonner le Fil Orange.');
	else
		alert('Bienvenue dans le Fil Orange !\n\nTouchez "Grille" pour abandonner le Fil Orange et passer à la grille suivante.');
}
//---------------------------------------------------------------------------
function filOrangeTermine()
{
	// On efface les lettres en orange
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			if (h[x][y].orange) {
				h[x][y].orange = non;
				h[x][y].affiche();
			}
	filOrange = false;
	cacheLettresInutilisees();
	visualisationSolutions = false;
	solutionVisualisee = indefini;
	rafraichitBoutons();
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	confirmationGrilleDemandee = true;
	grilleSuivante();
}
//---------------------------------------------------------------------------
function filOrangeEvalue() // retourne true si au moins un mot d'au moins 5 lettres est formé
{
	var choixOK = false;
	
	// Initialisation des compteurs
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		sfo[i].length = 0;

	// v1.1 : initialisation des données du dernier coup
	drnCpFONbMots = 0; 
	drnCpFOScore  = 0; 
	
	for(var d=typeDir.d0h; d<=typeDir.d10h; d++) {
		var kMin=0;
		var kMax=0;
		for(; estValide(xDepart, yDepart, d, kMin); kMin--);
		kMin++;
		for(; estValide(xDepart, yDepart, d, kMax); kMax++);
		kMax--;
		var tailleMax=kMax-kMin+1;
		//console.log('>Direction '+stDir[d]+' : tailleMax = '+tailleMax+', k de '+kMin+' à '+kMax+'.'); 
		for(var t=tailleMax; t>=tailleMinMot; t--) {
			//console.log('>>Taille '+t+' : k0 de '+Math.max(kMin, 1-t)+' à '+Math.min(0, kMax-t+1));
			for(var k0=Math.max(kMin, 1-t); k0<=Math.min(0, kMax-t+1); k0++) {
				var stMot = vide;
				for(var k=k0; k<k0+t; k++)
					stMot = stMot + h[xDepart+k*dx[d]][yDepart+k*dy[d]].l;
				//console.log('>>>'+stMot+'...');
				if (dico[t-tailleMinMot].indexOf(stMot) > -1) {
					drnCpFONbMots++; // v1.1 : infos dernier coup
					drnCpFOScore+=scoreMto[d][t-tailleMinMot]; // v1.1 : infos dernier coup
					localStorage.dcfonm = drnCpFONbMots; // v1.3.3
					localStorage.dcfos = drnCpFOScore; // v1.3.3
					sfo[t-tailleMinMot][sfo[t-tailleMinMot].length] = new creeSolutionFilOrange(xDepart+k0*dx[d], yDepart+k0*dy[d], d, t, stMot);
					//console.log('>>>'+stMot+' en ('+(xDepart+k0*dx[d])+','+(yDepart+k*dy[d])+';'+stDir[d]+') = +'+scoreMto[d][t-tailleMinMot]+' points ('+scoreMto[d][t-tailleMinMot]+')');
					if (!choixOK) choixOK = true;
				}
			}
		}
	}
	if (!choixOK) {
		h[xDepart][yDepart].l = lettreOrangeRemplacee;
		h[xDepart][yDepart].rouge = non;
		h[xDepart][yDepart].affiche();
		// On enregistre stats & tops Fil Orange
		statsEtTops.enregistreStatsFOGrille();
    	statsEtTops.enregistreTopsFO();
		confirmationGrilleDemandee = true;
		localStorage.cgd = vrai; // enregistrement de fin de Fil Orange
	}
	else {
		statsEtTops.enregistreCoupFO(); // v1.1. /!\ enregistre également les variables drnCp*
		if (!affichageAideFilOrange) {
			affichageAideFilOrange = true;
			localStorage.aafo = vrai;
		}
	}
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	xArrivee = indefini;
	yArrivee = indefini;

	enregistrePartie(); // Un peu violent mais efficace

	if (!choixOK) // v1.3.2 : affichage solution stSolutionFilOrange
		alert('Votre choix ne permet pas de former un mot.\nLe Fil Orange est terminé.\n\n'+stSolutionFilOrange+'\n\nTouchez "Grille" pour passer à la suivante.\nPatientez que la grille se crée.');
	else
		if (!affichageAideFilOrange)
			alert('Les mots formés sont affichés en rouge.\nTouchez ">" pour passer au mot suivant ou pour continuer.');
	return choixOK;
}

//---------------------------------------------------------------------------
// INTERFACE
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// constructeurs & initialisateurs
//---------------------------------------------------------------------------
function creeCase(x, y)
{
	this.x = x; this.y = y; // affectée une seule fois pour toutes
	this.l = joker; // lettre (' ', 'A'~'Z') 
	this.vert = non; // marquage en vert
	this.orange = non; // marquage en orange
	this.rouge = non; // visualisation d'un mot en rouge (prioritaire sur vert)
	// Méthodes
	this.initialise = caseInitialise; // Remet tout à zéro
	this.couleur = caseCouleur; // donne la couleur
	this.affiche = caseAffiche; // affiche l'hexagone avec couleur et lettre  
	// localStorage
	this.enregistre = caseEnregistre; 
	this.charge = caseCharge;
}
//---------------------------------------------------------------------------
function creeGrille()
{
	h = new Array(nbLignes);
	for(var x=0; x<nbLignes; x++) {
		h[x] = new Array(nbLignes)
		for(var y=xyMin[x]; y<=xyMax[x]; y++) {
			h[x][y] = new creeCase(x, y);
		}
	}
}
//---------------------------------------------------------------------------
function creeSolution(x, y, d, t, stMot)
{
	this.x = x;
	this.y = y;
	this.d = d;
	this.t = t;
	this.stMot = stMot;
	this.trouvee = false;
	// méthodes
	this.majAffichage = solutionMajAffichage;
	// localStorage
	this.enregistre = solutionEnregistre; 
	//this.charge = solutionCharge; // constructeur
}
//---------------------------------------------------------------------------
function creeSolutionFilOrange(x, y, d, t, stMot)
{
	this.x = x;
	this.y = y;
	this.d = d;
	this.t = t;
	this.stMot = stMot;
	// méthodes
	this.majAffichage = solutionFilOrangeMajAffichage;
	// localStorage
	this.enregistre = solutionFilOrangeEnregistre;
	//this.charge = solutionFilOrangeCharge; // constructeur
}
//---------------------------------------------------------------------------
function caseInitialise()
{
	this.l = joker; 
	this.vert = non;
	this.orange = non;
	this.rouge = non;
}
//---------------------------------------------------------------------------
function initialiseGrille()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].initialise();
}
//---------------------------------------------------------------------------
function creeScoreGrille() // v1.4 : plus de paramètre grille car plus d'historique
{
	this.score = 0; this.scoreMax = 0;
	this.bonus = 0; this.bonusMax = 0;
	this.partie = 0; this.partieMax = 0; // v1.4 : cumul des scores précédents (score+bonus), score de la grille courante non inclus
	
	// Méthodes
	this.total = scoreGrilleTotal;
	this.totalMax = scoreGrilleTotalMax; 
	this.enregistre = scoreGrilleEnregistre;
	this.initialise = scoreGrilleInitialise; // v1.4
	// this.charge = scoreGrilleCharge; // constructeur
}
//---------------------------------------------------------------------------
function scoreGrilleInitialise() // v1.4
{
	if (grille>1) {
		this.partie += this.total();
		this.partieMax += this.totalMax();
	}
	else {
		this.partie = 0;
		this.partieMax = 0;
	}
	this.score = 0; this.scoreMax = 0;
	this.bonus = 0; this.bonusMax = 0;
}
//---------------------------------------------------------------------------
function creeScoreOrange() // v1.4 : plus de paramètre grille car plus d'historique
{
	this.score = 0; 
	this.bonus = 0; 
	this.partie = 0; // v1.4 : cumul des scores précédents (score+bonus), score de la grille courante non inclus
	
	// Méthodes
	this.total = scoreOrangeTotal;
	this.enregistre = scoreOrangeEnregistre;
	this.initialise = scoreOrangeInitialise; // v1.4
	// this.charge = scoreOrangeCharge; // constructeur
}
//---------------------------------------------------------------------------
function scoreOrangeInitialise() // v1.4
{
	if (grille>1)
		this.partie += this.total();
	else
		this.partie = 0;
	this.score = 0; 
	this.bonus = 0; 
}
//---------------------------------------------------------------------------
function chargeStatsEtTops()
{
    // méthodes
    this.enregistreTops = statsEtTopsEnregistreTops;
    this.enregistreTopsFO = statsEtTopsEnregistreTopsFO;

    this.enregistreStatsGrille = statsEtTopsEnregistreStatsGrille;
    this.enregistreStatsFOGrille = statsEtTopsEnregistreStatsFOGrille;
    this.enregistreStatsPartie = statsEtTopsEnregistreStatsPartie;
    
    this.enregistreCoupFO = statsEtTopsEnregistreCoupFO; // stats & tops. v1.1

    this.affiche = statsEtTopsAffiche;
    this.afficheFO = statsEtTopsAfficheFO;
    this.reinitialise = statsEtTopsReinitialise;

    // propriétés
    if (localStorage.getItem(lsTops)) {
        this.topGrilleScore       = parseInt(localStorage.topGrilleScore);
        this.topGrilleBonus       = parseInt(localStorage.topGrilleBonus);
        this.topGrilleTotal       = parseInt(localStorage.topGrilleTotal);
        this.topGrilleMaxScore    = parseInt(localStorage.topGrilleMaxScore);
        this.topGrilleMaxBonus    = parseInt(localStorage.topGrilleMaxBonus);
        this.topGrilleMaxTotal    = parseInt(localStorage.topGrilleMaxTotal);
        this.topGrilleMots5LTrv   = parseInt(localStorage.topGrilleMots5LTrv);
        this.topGrilleMots6LTrv   = parseInt(localStorage.topGrilleMots6LTrv);
        this.topGrilleMots7LTrv   = parseInt(localStorage.topGrilleMots7LTrv);
        this.topGrilleMots8LTrv   = parseInt(localStorage.topGrilleMots8LTrv);
        this.topGrilleMots9LTrv   = parseInt(localStorage.topGrilleMots9LTrv); 
        this.topGrilleMots10LTrv  = parseInt(localStorage.topGrilleMots10LTrv); 
        this.topGrilleMots11LTrv  = parseInt(localStorage.topGrilleMots11LTrv); 
        this.topGrilleMots5LATrv  = parseInt(localStorage.topGrilleMots5LATrv);
        this.topGrilleMots6LATrv  = parseInt(localStorage.topGrilleMots6LATrv);
        this.topGrilleMots7LATrv  = parseInt(localStorage.topGrilleMots7LATrv);
        this.topGrilleMots8LATrv  = parseInt(localStorage.topGrilleMots8LATrv);
        this.topGrilleMots9LATrv  = parseInt(localStorage.topGrilleMots9LATrv); 
        this.topGrilleMots10LATrv = parseInt(localStorage.topGrilleMots10LATrv); 
        this.topGrilleMots11LATrv = parseInt(localStorage.topGrilleMots11LATrv); 
        
        this.topPartieScore       = parseInt(localStorage.topPartieScore);
        this.topGrille      	  = parseInt(localStorage.topGrille);
        this.topChances           = parseInt(localStorage.topChances);
    }
    else {
        this.topGrilleScore       = 0;
        this.topGrilleBonus       = 0;
        this.topGrilleTotal       = 0;
        this.topGrilleMaxScore    = 0;
        this.topGrilleMaxBonus    = 0;
        this.topGrilleMaxTotal    = 0;
        this.topGrilleMots5LTrv   = 0;
        this.topGrilleMots6LTrv   = 0;
        this.topGrilleMots7LTrv   = 0;
        this.topGrilleMots8LTrv   = 0;
        this.topGrilleMots9LTrv   = 0; 
        this.topGrilleMots10LTrv  = 0;        
        this.topGrilleMots11LTrv  = 0;        
        this.topGrilleMots5LATrv  = 0;
        this.topGrilleMots6LATrv  = 0;
        this.topGrilleMots7LATrv  = 0;
        this.topGrilleMots8LATrv  = 0;
        this.topGrilleMots9LATrv  = 0; 
        this.topGrilleMots10LATrv = 0; 
        this.topGrilleMots11LATrv = 0; 

        this.topPartieScore       = 0;
        this.topGrille      	  = 0;
        this.topChances           = chancesAuDebut;
    }

    if (localStorage.getItem(lsTopsFO)) {
        this.topGrilleScoreFO     = parseInt(localStorage.topGrilleScoreFO);
        this.topGrilleBonusFO     = parseInt(localStorage.topGrilleBonusFO);
        this.topGrilleTotalFO     = parseInt(localStorage.topGrilleTotalFO);
        this.topGrilleMots5LFO    = parseInt(localStorage.topGrilleMots5LFO);
        this.topGrilleMots6LFO    = parseInt(localStorage.topGrilleMots6LFO);
        this.topGrilleMots7LFO    = parseInt(localStorage.topGrilleMots7LFO);
        this.topGrilleMots8LFO    = parseInt(localStorage.topGrilleMots8LFO);
        this.topGrilleMots9LFO    = parseInt(localStorage.topGrilleMots9LFO); 
        this.topGrilleMots10LFO   = parseInt(localStorage.topGrilleMots10LFO); 
        this.topGrilleMots11LFO   = parseInt(localStorage.topGrilleMots11LFO); 
    }
    else {
        this.topGrilleScoreFO     = 0;
        this.topGrilleBonusFO     = 0;
        this.topGrilleTotalFO     = 0;
        this.topGrilleMots5LFO    = 0;
        this.topGrilleMots6LFO    = 0;
        this.topGrilleMots7LFO    = 0;
        this.topGrilleMots8LFO    = 0;
        this.topGrilleMots9LFO    = 0;
        this.topGrilleMots10LFO   = 0;
        this.topGrilleMots11LFO   = 0;
    }

    if (localStorage.getItem(lsTopsFOCoup)) { // v1.1
        this.topCoupFOScore = parseInt(localStorage.topCoupFOScore);
        this.topCoupFONbMots = parseInt(localStorage.topCoupFONbMots);
    }
    else {
        this.topCoupFOScore = 0;
        this.topCoupFONbMots = 0;
    }

    if (localStorage.getItem(lsStatsGrille)) {
        this.statGrilles           = parseInt(localStorage.statGrilles);
        this.statGrilleScore       = parseInt(localStorage.statGrilleScore);
        this.statGrilleBonus       = parseInt(localStorage.statGrilleBonus);
        this.statGrilleTotal       = parseInt(localStorage.statGrilleTotal);
        this.statGrilleMaxScore    = parseInt(localStorage.statGrilleMaxScore);
        this.statGrilleMaxBonus    = parseInt(localStorage.statGrilleMaxBonus);
        this.statGrilleMaxTotal    = parseInt(localStorage.statGrilleMaxTotal);
        this.statGrilleMots5LTrv   = parseInt(localStorage.statGrilleMots5LTrv);
        this.statGrilleMots6LTrv   = parseInt(localStorage.statGrilleMots6LTrv);
        this.statGrilleMots7LTrv   = parseInt(localStorage.statGrilleMots7LTrv);
        this.statGrilleMots8LTrv   = parseInt(localStorage.statGrilleMots8LTrv);
        this.statGrilleMots9LTrv   = parseInt(localStorage.statGrilleMots9LTrv); 
        this.statGrilleMots10LTrv  = parseInt(localStorage.statGrilleMots10LTrv); 
        this.statGrilleMots11LTrv  = parseInt(localStorage.statGrilleMots11LTrv); 
        this.statGrilleMots5LATrv  = parseInt(localStorage.statGrilleMots5LATrv);
        this.statGrilleMots6LATrv  = parseInt(localStorage.statGrilleMots6LATrv);
        this.statGrilleMots7LATrv  = parseInt(localStorage.statGrilleMots7LATrv);
        this.statGrilleMots8LATrv  = parseInt(localStorage.statGrilleMots8LATrv);
        this.statGrilleMots9LATrv  = parseInt(localStorage.statGrilleMots9LATrv); 
        this.statGrilleMots10LATrv = parseInt(localStorage.statGrilleMots10LATrv); 
        this.statGrilleMots11LATrv = parseInt(localStorage.statGrilleMots11LATrv); 
   }
    else {
        this.statGrilles           = 0;
        this.statGrilleScore       = 0;
        this.statGrilleBonus       = 0;
        this.statGrilleTotal       = 0;
        this.statGrilleMaxScore    = 0;
        this.statGrilleMaxBonus    = 0;
        this.statGrilleMaxTotal    = 0;
        this.statGrilleMots5LTrv   = 0;
        this.statGrilleMots6LTrv   = 0;
        this.statGrilleMots7LTrv   = 0;
        this.statGrilleMots8LTrv   = 0;
        this.statGrilleMots9LTrv   = 0; 
        this.statGrilleMots10LTrv  = 0; 
        this.statGrilleMots11LTrv  = 0; 
        this.statGrilleMots5LATrv  = 0;
        this.statGrilleMots6LATrv  = 0;
        this.statGrilleMots7LATrv  = 0;
        this.statGrilleMots8LATrv  = 0;
        this.statGrilleMots9LATrv  = 0; 
        this.statGrilleMots10LATrv = 0; 
        this.statGrilleMots11LATrv = 0; 
    }

    if (localStorage.getItem(lsStatsFOGrille) && localStorage.getItem('statGrillesFO')) { // v1.1 pour réparer la version 1.0
    	this.statGrillesFO         = parseInt(localStorage.statGrillesFO);
        this.statGrilleScoreFO     = parseInt(localStorage.statGrilleScoreFO);
        this.statGrilleBonusFO     = parseInt(localStorage.statGrilleBonusFO);
        this.statGrilleTotalFO     = parseInt(localStorage.statGrilleTotalFO);
        this.statGrilleMots5LFO    = parseInt(localStorage.statGrilleMots5LFO);
        this.statGrilleMots6LFO    = parseInt(localStorage.statGrilleMots6LFO);
        this.statGrilleMots7LFO    = parseInt(localStorage.statGrilleMots7LFO);
        this.statGrilleMots8LFO    = parseInt(localStorage.statGrilleMots8LFO);
        this.statGrilleMots9LFO    = parseInt(localStorage.statGrilleMots9LFO); 
        this.statGrilleMots10LFO   = parseInt(localStorage.statGrilleMots10LFO); 
        this.statGrilleMots11LFO   = parseInt(localStorage.statGrilleMots11LFO); 
    }
    else {
    	this.statGrillesFO         = 0;
        this.statGrilleScoreFO     = 0;
        this.statGrilleBonusFO     = 0;
        this.statGrilleTotalFO     = 0;
        this.statGrilleMots5LFO    = 0;
        this.statGrilleMots6LFO    = 0;
        this.statGrilleMots7LFO    = 0;
        this.statGrilleMots8LFO    = 0;
        this.statGrilleMots9LFO    = 0;
        this.statGrilleMots10LFO   = 0;
        this.statGrilleMots11LFO   = 0;
    }

    if (localStorage.getItem(lsStatsFOCoup)) { // v1.1
    	this.statCoupsFO = parseInt(localStorage.statCoupsFO);
        this.statCoupFOScore = parseInt(localStorage.statCoupFOScore);
        this.statCoupFONbMots = parseInt(localStorage.statCoupFONbMots);
    }
    else {
    	this.statCoupsFO      = 0;
        this.statCoupFOScore  = 0;
        this.statCoupFONbMots = 0;
    }

    if (localStorage.getItem(lsStatsPartie)) {
        this.statParties           = parseInt(localStorage.statParties);
        this.statPartieScore       = parseInt(localStorage.statPartieScore);
    }
    else {
        this.statParties           = 0;
        this.statPartieScore       = 0;
    }
}

//---------------------------------------------------------------------------
// méthodes de classes
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// classe statsEtTops
//---------------------------------------------------------------------------
function statsEtTopsReinitialise()
{
	this.topGrilleScore       = 0;
	this.topGrilleBonus       = 0;
	this.topGrilleTotal       = 0;
	this.topGrilleScoreFO     = 0;
	this.topGrilleBonusFO     = 0;
	this.topGrilleTotalFO     = 0;
	this.topGrilleMaxScore    = 0;
	this.topGrilleMaxBonus    = 0;
	this.topGrilleMaxTotal    = 0;
	this.topGrilleMots5LTrv   = 0;
	this.topGrilleMots6LTrv   = 0;
	this.topGrilleMots7LTrv   = 0;
	this.topGrilleMots8LTrv   = 0;
	this.topGrilleMots9LTrv   = 0; 
	this.topGrilleMots10LTrv  = 0;        
	this.topGrilleMots11LTrv  = 0;        
	this.topGrilleMots5LATrv  = 0;
	this.topGrilleMots6LATrv  = 0;
	this.topGrilleMots7LATrv  = 0;
	this.topGrilleMots8LATrv  = 0;
	this.topGrilleMots9LATrv  = 0; 
	this.topGrilleMots10LATrv = 0; 
	this.topGrilleMots11LATrv = 0; 
	this.topGrilleMots5LFO    = 0;
	this.topGrilleMots6LFO    = 0;
	this.topGrilleMots7LFO    = 0;
	this.topGrilleMots8LFO    = 0;
	this.topGrilleMots9LFO    = 0;
	this.topGrilleMots10LFO   = 0;
	this.topGrilleMots11LFO   = 0;
	this.topPartieScore       = 0;
	this.topGrille      	  = 0;
	this.topChances           = chancesAuDebut;

    this.topCoupFOScore       = 0; // v1.1
    this.topCoupFONbMots      = 0; // v1.1 

	this.statGrilles          = 0;
	this.statGrillesFO		  = 0;
	this.statGrilleScore      = 0;
	this.statGrilleBonus      = 0;
	this.statGrilleTotal      = 0;
	this.statGrilleScoreFO    = 0;
	this.statGrilleBonusFO    = 0;
	this.statGrilleTotalFO    = 0;
	this.statGrilleMaxScore   = 0;
	this.statGrilleMaxBonus   = 0;
	this.statGrilleMaxTotal   = 0;
	this.statGrilleMots5LTrv  = 0;
	this.statGrilleMots6LTrv  = 0;
	this.statGrilleMots7LTrv  = 0;
	this.statGrilleMots8LTrv  = 0;
	this.statGrilleMots9LTrv  = 0; 
	this.statGrilleMots10LTrv = 0; 
	this.statGrilleMots11LTrv = 0; 
	this.statGrilleMots5LATrv = 0;
	this.statGrilleMots6LATrv = 0;
	this.statGrilleMots7LATrv = 0;
	this.statGrilleMots8LATrv = 0;
	this.statGrilleMots9LATrv = 0; 
	this.statGrilleMots10LATrv= 0; 
	this.statGrilleMots11LATrv= 0; 
	this.statGrilleMots5LFO   = 0;
	this.statGrilleMots6LFO   = 0;
	this.statGrilleMots7LFO   = 0;
	this.statGrilleMots8LFO   = 0;
	this.statGrilleMots9LFO   = 0;
	this.statGrilleMots10LFO  = 0;
	this.statGrilleMots11LFO  = 0;

	this.statCoupsFO          = 0; // v1.1
    this.statCoupFOScore      = 0; // v1.1
    this.statCoupFONbMots     = 0; // v1.1 

	this.statParties          = 0;
	this.statPartieScore      = 0;
        
    localStorage.removeItem(lsTops);
    localStorage.removeItem(lsTopsFO); // v1.1 (oubli)
    localStorage.removeItem(lsTopsFOCoup); // v1.1
    localStorage.removeItem(lsStatsGrille);
    localStorage.removeItem(lsStatsFOGrille); // v1.1 (oubli)
    localStorage.removeItem(lsStatsFOCoup); // v1.1
    localStorage.removeItem(lsStatsPartie);

    alert('Remise à zéro\n\nLes statistiques et les tops ont été remis à zéro.');
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreTops()
{
	var scoreGrilleTotal = scoreGrille.total();
	var scoreGrilleTotalMax = scoreGrille.totalMax();
	var scorePartieTotal = scorePartie();
    if (scoreGrille.score > this.topGrilleScore)    { this.topGrilleScore = scoreGrille.score;	localStorage.topGrilleScore = scoreGrille.score; }
    if (scoreGrille.bonus > this.topGrilleBonus)    { this.topGrilleBonus = scoreGrille.bonus;	localStorage.topGrilleBonus = scoreGrille.bonus; }
    if (scoreGrilleTotal          > this.topGrilleTotal)    { this.topGrilleTotal = scoreGrilleTotal; 			localStorage.topGrilleTotal = scoreGrilleTotal }
    if (scoreGrille.scoreMax > this.topGrilleMaxScore) { this.topGrilleMaxScore = scoreGrille.scoreMax;	localStorage.topGrilleMaxScore = scoreGrille.scoreMax; }
    if (scoreGrille.bonusMax > this.topGrilleMaxBonus) { this.topGrilleMaxBonus = scoreGrille.bonusMax;	localStorage.topGrilleMaxBonus = scoreGrille.bonusMax; }
    if (scoreGrilleTotalMax   		 > this.topGrilleMaxTotal) { this.topGrilleMaxTotal = scoreGrilleTotalMax; 			localStorage.topGrilleMaxTotal = scoreGrilleTotalMax; }
    if (nbMTrvGrille[0] > this.topGrilleMots5LTrv) { this.topGrilleMots5LTrv = nbMTrvGrille[0];     localStorage.topGrilleMots5LTrv   = nbMTrvGrille[0]; }
    if (nbMTrvGrille[1] > this.topGrilleMots6LTrv) { this.topGrilleMots6LTrv = nbMTrvGrille[1];     localStorage.topGrilleMots6LTrv   = nbMTrvGrille[1]; }
    if (nbMTrvGrille[2] > this.topGrilleMots7LTrv) { this.topGrilleMots7LTrv = nbMTrvGrille[2];     localStorage.topGrilleMots7LTrv   = nbMTrvGrille[2]; }
    if (nbMTrvGrille[3] > this.topGrilleMots8LTrv) { this.topGrilleMots8LTrv = nbMTrvGrille[3];     localStorage.topGrilleMots8LTrv   = nbMTrvGrille[3]; }
    if (nbMTrvGrille[4] > this.topGrilleMots9LTrv) { this.topGrilleMots9LTrv = nbMTrvGrille[4];     localStorage.topGrilleMots9LTrv   = nbMTrvGrille[4]; } 
    if (nbMTrvGrille[5] > this.topGrilleMots10LTrv){ this.topGrilleMots10LTrv = nbMTrvGrille[5];    localStorage.topGrilleMots10LTrv  = nbMTrvGrille[5]; }
    if (nbMTrvGrille[6] > this.topGrilleMots11LTrv){ this.topGrilleMots11LTrv = nbMTrvGrille[6];    localStorage.topGrilleMots11LTrv  = nbMTrvGrille[6]; }
    if (nbMotsGrille[0] > this.topGrilleMots5LATrv) { this.topGrilleMots5LATrv = nbMotsGrille[0];   localStorage.topGrilleMots5LATrv  = nbMotsGrille[0]; }
    if (nbMotsGrille[1] > this.topGrilleMots6LATrv) { this.topGrilleMots6LATrv = nbMotsGrille[1];   localStorage.topGrilleMots6LATrv  = nbMotsGrille[1]; }
    if (nbMotsGrille[2] > this.topGrilleMots7LATrv) { this.topGrilleMots7LATrv = nbMotsGrille[2];   localStorage.topGrilleMots7LATrv  = nbMotsGrille[2]; }
    if (nbMotsGrille[3] > this.topGrilleMots8LATrv) { this.topGrilleMots8LATrv = nbMotsGrille[3];   localStorage.topGrilleMots8LATrv  = nbMotsGrille[3]; }
    if (nbMotsGrille[4] > this.topGrilleMots9LATrv) { this.topGrilleMots9LATrv = nbMotsGrille[4];   localStorage.topGrilleMots9LATrv  = nbMotsGrille[4]; } 
    if (nbMotsGrille[5] > this.topGrilleMots10LATrv){ this.topGrilleMots10LATrv = nbMotsGrille[5];  localStorage.topGrilleMots10LATrv = nbMotsGrille[5]; }
    if (nbMotsGrille[6] > this.topGrilleMots11LATrv){ this.topGrilleMots11LATrv = nbMotsGrille[6];  localStorage.topGrilleMots11LATrv = nbMotsGrille[6]; }
    if (scorePartieTotal > this.topPartieScore) { this.topPartieScore = scorePartieTotal; localStorage.topGrilleScore = scorePartieTotal; }
    if (grille > this.topGrille) { this.topGrille = grille; localStorage.topGrille = grille; }
    if (chances > this.topChances) { this.topChances = chances; localStorage.topChances = chances; }
    
    localStorage.topGrilleScore    = this.topGrilleScore;
    localStorage.topGrilleBonus    = this.topGrilleBonus;
    localStorage.topGrilleTotal    = this.topGrilleTotal;
    localStorage.topGrilleMaxScore = this.topGrilleMaxScore;
    localStorage.topGrilleMaxBonus = this.topGrilleMaxBonus;
    localStorage.topGrilleMaxTotal = this.topGrilleMaxTotal;
    localStorage.topGrilleMots5LTrv = this.topGrilleMots5LTrv;
    localStorage.topGrilleMots6LTrv = this.topGrilleMots6LTrv;
    localStorage.topGrilleMots7LTrv = this.topGrilleMots7LTrv;
    localStorage.topGrilleMots8LTrv = this.topGrilleMots8LTrv;
    localStorage.topGrilleMots9LTrv = this.topGrilleMots9LTrv; 
    localStorage.topGrilleMots10LTrv = this.topGrilleMots10LTrv;
    localStorage.topGrilleMots11LTrv = this.topGrilleMots11LTrv;
    localStorage.topGrilleMots5LATrv = this.topGrilleMots5LATrv;
    localStorage.topGrilleMots6LATrv = this.topGrilleMots6LATrv;
    localStorage.topGrilleMots7LATrv = this.topGrilleMots7LATrv;
    localStorage.topGrilleMots8LATrv = this.topGrilleMots8LATrv;
    localStorage.topGrilleMots9LATrv = this.topGrilleMots9LATrv;
    localStorage.topGrilleMots10LATrv = this.topGrilleMots10LATrv;
    localStorage.topGrilleMots11LATrv = this.topGrilleMots11LATrv;
    localStorage.topPartieScore = this.topPartieScore;
    localStorage.topGrille = this.topGrille;
    localStorage.topChances = this.topChances;

    localStorage.tops = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreTopsFO()
{
	var scoreOrangeTotal = scoreOrange.total();
    if (scoreOrange.score > this.topGrilleScoreFO)  { this.topGrilleScoreFO = scoreOrange.score;	localStorage.topGrilleScore = scoreOrange.score; }
    if (scoreOrange.bonus > this.topGrilleBonusFO)  { this.topGrilleBonusFO = scoreOrange.bonus; 	localStorage.topGrilleBonus = scoreOrange.bonus; }
    if (scoreOrangeTotal          > this.topGrilleTotalFO)  { this.topGrilleTotalFO = scoreOrangeTotal;      		localStorage.topGrilleTotal = scoreOrangeTotal; }
    if (nbMotsEnOrange[0] > this.topGrilleMots5LFO) { this.topGrilleMots5LFO = nbMotsEnOrange[0];   localStorage.topGrilleMots5LFO    = nbMotsEnOrange[0]; }
    if (nbMotsEnOrange[1] > this.topGrilleMots6LFO) { this.topGrilleMots6LFO = nbMotsEnOrange[1];   localStorage.topGrilleMots6LFO    = nbMotsEnOrange[1]; }
    if (nbMotsEnOrange[2] > this.topGrilleMots7LFO) { this.topGrilleMots7LFO = nbMotsEnOrange[2];   localStorage.topGrilleMots7LFO    = nbMotsEnOrange[2]; }
    if (nbMotsEnOrange[3] > this.topGrilleMots8LFO) { this.topGrilleMots8LFO = nbMotsEnOrange[3];   localStorage.topGrilleMots8LFO    = nbMotsEnOrange[3]; }
    if (nbMotsEnOrange[4] > this.topGrilleMots9LFO) { this.topGrilleMots9LFO = nbMotsEnOrange[4];   localStorage.topGrilleMots9LFO    = nbMotsEnOrange[4]; } 
    if (nbMotsEnOrange[5] > this.topGrilleMots10LFO) { this.topGrilleMots10LFO = nbMotsEnOrange[5]; localStorage.topGrilleMots10LFO   = nbMotsEnOrange[5]; }
    if (nbMotsEnOrange[6] > this.topGrilleMots11LFO) { this.topGrilleMots11LFO = nbMotsEnOrange[6]; localStorage.topGrilleMots11LFO   = nbMotsEnOrange[6]; }
    
    localStorage.topGrilleScoreFO  = this.topGrilleScoreFO;
    localStorage.topGrilleBonusFO  = this.topGrilleBonusFO;
    localStorage.topGrilleTotalFO  = this.topGrilleTotalFO;
    localStorage.topGrilleMots5LFO = this.topGrilleMots5LFO;
    localStorage.topGrilleMots6LFO = this.topGrilleMots6LFO;
    localStorage.topGrilleMots7LFO = this.topGrilleMots7LFO;
    localStorage.topGrilleMots8LFO = this.topGrilleMots8LFO;
    localStorage.topGrilleMots9LFO = this.topGrilleMots9LFO;
    localStorage.topGrilleMots10LFO = this.topGrilleMots10LFO;
    localStorage.topGrilleMots11LFO = this.topGrilleMots11LFO;

    localStorage.topsFO = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreStatsGrille()
{
    this.statGrilles++;
    this.statGrilleScore      += scoreGrille.score;
    this.statGrilleBonus      += scoreGrille.bonus;
    this.statGrilleTotal      += scoreGrille.total();
    this.statGrilleMaxScore   += scoreGrille.scoreMax;
    this.statGrilleMaxBonus   += scoreGrille.bonusMax;
    this.statGrilleMaxTotal   += scoreGrille.totalMax();
    this.statGrilleMots5LTrv   += nbMTrvGrille[0];
    this.statGrilleMots6LTrv   += nbMTrvGrille[1];
    this.statGrilleMots7LTrv   += nbMTrvGrille[2];
    this.statGrilleMots8LTrv   += nbMTrvGrille[3];
    this.statGrilleMots9LTrv   += nbMTrvGrille[4]; 
    this.statGrilleMots10LTrv   += nbMTrvGrille[5]; 
    this.statGrilleMots11LTrv   += nbMTrvGrille[6]; 
    this.statGrilleMots5LATrv   += nbMotsGrille[0];
    this.statGrilleMots6LATrv   += nbMotsGrille[1];
    this.statGrilleMots7LATrv   += nbMotsGrille[2];
    this.statGrilleMots8LATrv   += nbMotsGrille[3];
    this.statGrilleMots9LATrv   += nbMotsGrille[4]; 
    this.statGrilleMots10LATrv   += nbMotsGrille[5]; 
    this.statGrilleMots11LATrv   += nbMotsGrille[6]; 

    localStorage.statGrilles          = this.statGrilles;
    localStorage.statGrilleScore      = this.statGrilleScore;
    localStorage.statGrilleBonus      = this.statGrilleBonus;
    localStorage.statGrilleTotal      = this.statGrilleTotal;
    localStorage.statGrilleMaxScore   = this.statGrilleMaxScore;
    localStorage.statGrilleMaxBonus   = this.statGrilleMaxBonus;
    localStorage.statGrilleMaxTotal   = this.statGrilleMaxTotal;
    localStorage.statGrilleMots5LTrv   = this.statGrilleMots5LTrv;
    localStorage.statGrilleMots6LTrv   = this.statGrilleMots6LTrv;
    localStorage.statGrilleMots7LTrv   = this.statGrilleMots7LTrv;
    localStorage.statGrilleMots8LTrv   = this.statGrilleMots8LTrv;
    localStorage.statGrilleMots9LTrv   = this.statGrilleMots9LTrv; 
    localStorage.statGrilleMots10LTrv  = this.statGrilleMots10LTrv; 
    localStorage.statGrilleMots11LTrv  = this.statGrilleMots11LTrv; 
    localStorage.statGrilleMots5LATrv   = this.statGrilleMots5LATrv;
    localStorage.statGrilleMots6LATrv   = this.statGrilleMots6LATrv;
    localStorage.statGrilleMots7LATrv   = this.statGrilleMots7LATrv;
    localStorage.statGrilleMots8LATrv   = this.statGrilleMots8LATrv;
    localStorage.statGrilleMots9LATrv   = this.statGrilleMots9LATrv; 
    localStorage.statGrilleMots10LATrv   = this.statGrilleMots10LATrv;
    localStorage.statGrilleMots11LATrv   = this.statGrilleMots11LATrv;
    
    localStorage.statsGrille          = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreStatsFOGrille()
{
    this.statGrillesFO++;
    this.statGrilleScoreFO += scoreOrange.score;
    this.statGrilleBonusFO += scoreOrange.bonus;
    this.statGrilleTotalFO += scoreOrange.total();
    this.statGrilleMots5LFO += nbMotsEnOrange[0];
    this.statGrilleMots6LFO += nbMotsEnOrange[1];
    this.statGrilleMots7LFO += nbMotsEnOrange[2];
    this.statGrilleMots8LFO += nbMotsEnOrange[3];
    this.statGrilleMots9LFO += nbMotsEnOrange[4]; 
    this.statGrilleMots10LFO += nbMotsEnOrange[5]; 
    this.statGrilleMots11LFO += nbMotsEnOrange[6]; 
    
    localStorage.statGrillesFO = this.statGrillesFO; // v1.1 : oubli !
    localStorage.statGrilleScoreFO =  this.statGrilleScoreFO;
    localStorage.statGrilleBonusFO = this.statGrilleBonusFO;
    localStorage.statGrilleTotalFO = this.statGrilleTotalFO;
    localStorage.statGrilleMots5LFO = this.statGrilleMots5LFO;
    localStorage.statGrilleMots6LFO = this.statGrilleMots6LFO;
    localStorage.statGrilleMots7LFO = this.statGrilleMots7LFO;
    localStorage.statGrilleMots8LFO = this.statGrilleMots8LFO;
    localStorage.statGrilleMots9LFO = this.statGrilleMots9LFO;
    localStorage.statGrilleMots10LFO = this.statGrilleMots10LFO;
    localStorage.statGrilleMots11LFO = this.statGrilleMots11LFO;
    
    localStorage.statsFOGrille = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreCoupFO() // v1.1
{
	// sauvegarde automatique var drnCp*
	localStorage.dcfonm = drnCpFONbMots;
	localStorage.dcfos = drnCpFOScore;

	// stats Coup FO
	if (drnCpFONbMots > this.topCoupFONbMots) {
		this.topCoupFONbMots = drnCpFONbMots;
		localStorage.topCoupFONbMots = this.topCoupFONbMots;
	}
	if (drnCpFOScore > this.topCoupFOScore) {
		this.topCoupFOScore = drnCpFOScore;
		localStorage.topCoupFOScore = this.topCoupFOScore;
	}

    localStorage.topsFOCoup = true;

	// tops Coup FO
	
    this.statCoupsFO++;
    this.statCoupFONbMots += drnCpFONbMots; 
    this.statCoupFOScore += drnCpFOScore;

    localStorage.statCoupsFO = this.statCoupsFO;
    localStorage.statCoupFONbMots = this.statCoupFONbMots; 
    localStorage.statCoupFOScore = this.statCoupFOScore;
	
    localStorage.statsFOCoup = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreStatsPartie()
{
    this.statParties++;
    this.statPartieScore += scorePartie();
    
    localStorage.statsPartie          = true;
    
    localStorage.statParties          = this.statParties;
    localStorage.statPartieScore      = this.statPartieScore;
}
//---------------------------------------------------------------------------
function statsEtTopsAffiche()
{
	const statsTitre = 'Statistiques';
    switch(statutStatsEtTops) { // v1.2.1 ordre inversé stats et tops
		case typeStatutStatsEtTops.ssetTops: // tops
            const msgNextStatut2 = '\n\nToucher « % » pour voir les stats.'; // v1.2.1 ordre inversé stats et tops
			var msgTopGames = 'score '+this.topPartieScore+', '+this.topGrille+' grille'+(this.topGrille>1?pluriel:vide)+', '+this.topChances+' chances.';
			var msgTopGrilles = 'score '+this.topGrilleScore+', '+ // v1.6 : plus de max dans les tops
							  'bonus '+this.topGrilleBonus+', '+ // v1.6 : plus de max dans les tops
							  'total '+this.topGrilleTotal+'\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots5LTrv+ ' mot'+(this.topGrilleMots5LTrv>1?pluriel:vide)+ ' de 5 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots6LTrv+ ' mot'+(this.topGrilleMots6LTrv>1?pluriel:vide)+ ' de 6 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots7LTrv+ ' mot'+(this.topGrilleMots7LTrv>1?pluriel:vide)+ ' de 7 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots8LTrv+ ' mot'+(this.topGrilleMots8LTrv>1?pluriel:vide)+ ' de 8 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots9LTrv+ ' mot'+(this.topGrilleMots9LTrv>1?pluriel:vide)+ ' de 9 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots10LTrv+ ' mot'+(this.topGrilleMots10LTrv>1?pluriel:vide)+ ' de 10 lettres\n'+ // v1.6 : plus de max dans les tops
							  this.topGrilleMots11LTrv+' mot'+(this.topGrilleMots11LTrv>1?pluriel:vide)+' de 11 lettres.'; // v1.6 : plus de max dans les tops
			alert('RECORDS\n\nTops de parties :\n'+msgTopGames+'\n\nTops de grilles :\n'+msgTopGrilles+msgNextStatut2);                  
            break;
        case typeStatutStatsEtTops.ssetStats: // stats
            const msgNextStatut1 = '\n\nToucher « % » = RAZ stats+tops.'; // v1.2.1 ordre inversé stats et tops
			var msgStatParties = (this.statParties?
								'En moyenne, sur '+this.statParties+' partie'+(this.statParties>1?pluriel:vide)+
								' le score est de '+Math.round(this.statPartieScore/this.statParties)+'.\n\n':vide);
			var msgStatGrilles = (this.statGrilles?
								'En moyenne, sur '+this.statGrilles+' grille'+(this.statGrilles>1?pluriel:vide)+
								' :\nscore '+Math.round(this.statGrilleScore/this.statGrilles)+
								' ('+Math.round((100*this.statGrilleScore)/this.statGrilleMaxScore)+
								'%), bonus '+Math.round(this.statGrilleBonus/this.statGrilles)+
								' ('+Math.round((100*this.statGrilleBonus)/this.statGrilleMaxBonus)+
								'%), total '+Math.round(this.statGrilleTotal/this.statGrilles)+
								' ('+Math.round((100*this.statGrilleTotal)/this.statGrilleMaxTotal)+
								'%),\n'+Math.round(this.statGrilleMots11LTrv/this.statGrilles)+' mot'+(Math.round(this.statGrilleMots11LTrv/this.statGrilles)>1?pluriel:vide)+' de 11 lettres'+(this.statGrilleMots11LATrv?(' ('+Math.round((100*this.statGrilleMots11LTrv/this.statGrilleMots11LATrv))+'%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots10LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots10LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 10 lettres'+ (this.statGrilleMots10LATrv? (' ('+Math.round((100*this.statGrilleMots10LTrv/ this.statGrilleMots10LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots9LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots9LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 9 lettres'+ (this.statGrilleMots9LATrv? (' ('+Math.round((100*this.statGrilleMots9LTrv/ this.statGrilleMots9LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots8LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots8LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 8 lettres'+ (this.statGrilleMots8LATrv? (' ('+Math.round((100*this.statGrilleMots8LTrv/ this.statGrilleMots8LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots7LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots7LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 7 lettres'+ (this.statGrilleMots7LATrv? (' ('+Math.round((100*this.statGrilleMots7LTrv/ this.statGrilleMots7LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots6LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots6LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 6 lettres'+ (this.statGrilleMots6LATrv? (' ('+Math.round((100*this.statGrilleMots6LTrv/ this.statGrilleMots6LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots5LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots5LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 5 lettres'+ (this.statGrilleMots5LATrv? (' ('+Math.round((100*this.statGrilleMots5LTrv/ this.statGrilleMots5LATrv))+ '%)'):vide)+
								'.':vide);
			if (msgStatParties+msgStatGrilles == vide) 
				alert(statsTitre+'\n\nIl n\'y a aucune statistique.'+msgNextStatut1);
			else
				alert(statsTitre+'\n\n'+msgStatParties+msgStatGrilles+msgNextStatut1);
			break;
        case typeStatutStatsEtTops.ssetDmd: // reset
            alert('Confirmation\n\nÊtes-vous sûr(e) de vouloir réinitialiser stats et tops ?\n\nPour confirmer,\ntouchez à nouveau « % ».'); 
            break;
        case typeStatutStatsEtTops.ssetRAZ: // reset
            this.reinitialise();
            break;
        default:
            break;
    }
    statutStatsEtTops = (statutStatsEtTops + 1) % 4;
}
//---------------------------------------------------------------------------
function statsEtTopsAfficheFO()
{
	const statsTitre = 'Stats Fil Orange';
    switch(statutStatsEtTops) { // v1.2.1 ordre inversé stats et tops
		case typeStatutStatsEtTops.ssetTops: // tops
            const msgNextStatut2 = '\n\nToucher « % » = stats Fil Orange.'; // v1.2.1 ordre inversé stats et tops
			var msgTopGrilles = 'score '+this.topGrilleScoreFO+', '+
							  'bonus '+this.topGrilleBonusFO+', '+
							  'total '+this.topGrilleTotalFO+'.\n'+
							  this.topGrilleMots5LFO+ ' mot'+(this.topGrilleMots5LFO>1?pluriel:vide)+ ' de 5 lettres\n'+
							  this.topGrilleMots6LFO+ ' mot'+(this.topGrilleMots6LFO>1?pluriel:vide)+ ' de 6 lettres\n'+
							  this.topGrilleMots7LFO+ ' mot'+(this.topGrilleMots7LFO>1?pluriel:vide)+ ' de 7 lettres\n'+
							  this.topGrilleMots8LFO+ ' mot'+(this.topGrilleMots8LFO>1?pluriel:vide)+ ' de 8 lettres\n'+
							  this.topGrilleMots9LFO+ ' mot'+(this.topGrilleMots9LFO>1?pluriel:vide)+ ' de 9 lettres\n'+
							  this.topGrilleMots10LFO+ ' mot'+(this.topGrilleMots10LFO>1?pluriel:vide)+ ' de 10 lettres\n'+
							  this.topGrilleMots11LFO+' mot'+(this.topGrilleMots11LFO>1?pluriel:vide)+' de 11 lettres.\n\n'+
							  'meilleur coup : '+this.topCoupFONbMots+' mot'+(this.topCoupFONbMots>1?pluriel:vide)+', score '+this.topCoupFOScore+'.'; // v1.1
			alert('Tops Fil Orange\n\n'+msgTopGrilles+msgNextStatut2);                  
            break;
        case typeStatutStatsEtTops.ssetStats: // stats
            const msgNextStatut1 = '\n\nToucher « % » = RAZ stats+tops.'; // v1.2.1 ordre inversé stats et tops
			var msgStatGrilles = (this.statGrillesFO?
								'En moyenne, sur '+this.statGrillesFO+' grille'+(this.statGrillesFO>1?pluriel:vide)+
								' :\nscore '+Math.round(this.statGrilleScoreFO/this.statGrillesFO)+
								', bonus '+Math.round(this.statGrilleBonusFO/this.statGrillesFO)+
								', total '+Math.round(this.statGrilleTotalFO/this.statGrillesFO)+ // v1.1.1 : statGrillesFO au lieu de statGrilles 
								',\n'+Math.round(this.statGrilleMots11LFO/this.statGrillesFO)+' mot'+(Math.round(this.statGrilleMots11LFO/this.statGrillesFO)>1?pluriel:vide)+' de 11 lettres'+
								'\n'+   Math.round(this.statGrilleMots10LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots10LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 10 lettres'+
								'\n'+   Math.round(this.statGrilleMots9LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots9LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 9 lettres'+
								'\n'+   Math.round(this.statGrilleMots8LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots8LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 8 lettres'+
								'\n'+   Math.round(this.statGrilleMots7LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots7LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 7 lettres'+
								'\n'+   Math.round(this.statGrilleMots6LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots6LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 6 lettres'+
								'\n'+   Math.round(this.statGrilleMots5LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots5LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 5 lettres'+
								'.':vide);
			// v1.1
			var nbMots = (this.statCoupsFO?Math.round((10*this.statCoupFONbMots)/this.statCoupsFO)/10:0);
			var msgStatCoups = (this.statCoupsFO? 
								'En moyenne sur '+this.statCoupsFO+' coup'+(this.statCoupsFO>1?pluriel:vide)+
								', '+nbMots+' mot'+(nbMots<2?vide:pluriel)+' formé'+(nbMots<2?vide:pluriel)+' et score de '+Math.round(this.statCoupFOScore/this.statCoupsFO)+
								'.':vide);
								
			if (msgStatGrilles + msgStatCoups == vide) 
				alert(statsTitre+'\n\nPas de statistique Fil Orange disponible.'+msgNextStatut1);
			else
				alert(statsTitre+'\n\n'+(msgStatGrilles?(msgStatGrilles+'\n\n'):vide)+msgStatCoups+msgNextStatut1); // v1.1
			break;
		case typeStatutStatsEtTops.ssetDmd: // reset
            alert('Confirmation\n\nÊtes-vous sûr(e) de vouloir réinitialiser TOUTES LES stats et TOUS LES tops ?\n\nPour confirmer,\ntouchez à nouveau « % ».'); 
            break;
        case typeStatutStatsEtTops.ssetRAZ: // reset
            this.reinitialise();
            break;
        default:
            break;
    }
    statutStatsEtTops = (statutStatsEtTops + 1) % 4;
}

//---------------------------------------------------------------------------
// classe case
//---------------------------------------------------------------------------
function caseCouleur()
{
	return (this.rouge?typeCoul.cRouge:(this.orange?typeCoul.cOrange:(this.vert?typeCoul.cVerte:typeCoul.cGrise)));
}
//---------------------------------------------------------------------------
function caseAffiche()
{
	var x=this.x; var y=this.y; var c=this.couleur();

	// 1. On rafraîchit d'abord la lettre
	var id = idLettre + idXY[x] + idXY[y];
	var nvSrc = chmPng + this.l + stCoul[c] + extPng;
	document.images[id].src = nvSrc;
	
	// 2. Ensuite, les côtés ou bords...

	// 2a. NO
	if (estValide(x, y-1)) { // c'est un côté d'hexagone partagé avec un autre hexagone...
		id = idCoteSN + idXY[x] + idXY[y-1] + idXY[y];
		nvSrc = chmPng + coteS + stCoul[h[x][y-1].couleur()] + nord + stCoul[c] + extPng;
		document.images[id].src = nvSrc;
	}
	else { // c'est un bord...
		id = idBordGN + idXY[x];
		nvSrc = chmPng + coteGN + stCoul[c] + extPng; 
		document.images[id].src = nvSrc;
	}
	 
	// 2b. SO
	if (estValide(x+1, y)) { // c'est un côté d'hexagone partagé avec un autre hexagone...
		id = idCoteNS + idXY[x] + idXY[x+1] + idXY[y];
		nvSrc = chmPng + coteN + stCoul[h[x+1][y].couleur()] + sud + stCoul[c] + extPng;
		document.images[id].src = nvSrc;
	}
	else { // c'est un bord...
		id = idBordGS + idXY[y];
		nvSrc = chmPng + coteGS + stCoul[c] + extPng; 
		document.images[id].src = nvSrc;
	}
	 
	// 2c. NE
	if (estValide(x-1, y)) { // c'est un côté d'hexagone partagé avec un autre hexagone...
		id = idCoteNS + idXY[x-1] + idXY[x] + idXY[y];
		nvSrc = chmPng + coteN + stCoul[c] + sud + stCoul[h[x-1][y].couleur()] + extPng;
		document.images[id].src = nvSrc;
	}
	else { // c'est un bord...
		id = idBordDN + idXY[y];
		nvSrc = chmPng + coteDN + stCoul[c] + extPng; 
		document.images[id].src = nvSrc;
	}
	 
	// 2d. SE
	if (estValide(x, y+1)) { // c'est un côté d'hexagone partagé avec un autre hexagone...
		id = idCoteSN + idXY[x] + idXY[y] + idXY[y+1];
		nvSrc = chmPng + coteS + stCoul[c] + nord + stCoul[h[x][y+1].couleur()] + extPng;
		document.images[id].src = nvSrc;
	}
	else { // c'est un bord...
		id = idBordDS + idXY[x];
		nvSrc = chmPng + coteDS + stCoul[c] + extPng; 
		document.images[id].src = nvSrc;
	}
}
//---------------------------------------------------------------------------
function caseEnregistre()
{
	var prefixe = lsCase + String.fromCharCode(1 + charCodeMin + this.x) + String.fromCharCode(1 + charCodeMin + this.y);
	localStorage.setItem(prefixe + lsAttrCases[0], this.l);
	localStorage.setItem(prefixe + lsAttrCases[1], this.vert);
	localStorage.setItem(prefixe + lsAttrCases[2], this.orange);
	localStorage.setItem(prefixe + lsAttrCases[3], this.rouge);
}
//---------------------------------------------------------------------------
function caseCharge(x, y)
{
	var prefixe = lsCase + String.fromCharCode(1 + charCodeMin + x) + String.fromCharCode(1 + charCodeMin + y);
	this.l = localStorage.getItem(prefixe + lsAttrCases[0]);
	this.vert = (localStorage.getItem(prefixe + lsAttrCases[1]) == vrai);
	this.orange = (localStorage.getItem(prefixe + lsAttrCases[2]) == vrai);
	this.rouge = (localStorage.getItem(prefixe + lsAttrCases[3]) == vrai);
}

//---------------------------------------------------------------------------
// Classe solution
//---------------------------------------------------------------------------
function solutionMajAffichage(affiche)
{
	// Affichage en rouge dans la grille
	for(var k=0; k<this.t; k++) {
		var x=this.x+k*dx[this.d];
		var y=this.y+k*dy[this.d];
		h[x][y].rouge = affiche;
		h[x][y].affiche();
	}
	// Affichage sous les compteurs
	if (affiche) {
		xDepart = this.x;
		yDepart = this.y;
		dDepart = this.d;
		tailleSelection = this.t;
		afficheMotChoisi();
	}
	else
		retireMotChoisi();
}
//---------------------------------------------------------------------------
function solutionEnregistre(t, i)
{
	var prefixe = lsSolutions + t + i;
	localStorage.setItem(prefixe + lsAttrSolutions[0], this.x);
	localStorage.setItem(prefixe + lsAttrSolutions[1], this.y);
	localStorage.setItem(prefixe + lsAttrSolutions[2], this.d);
	localStorage.setItem(prefixe + lsAttrSolutions[3], this.stMot);
	localStorage.setItem(prefixe + lsAttrSolutions[4], this.trouvee); // 't' = trouvée et non taille (this.t)
}
//---------------------------------------------------------------------------
function solutionCharge(t, i)
{
	var prefixe = lsSolutions + t + i;
	this.t = t + tailleMinMot; 
	this.x = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[0]));
	this.y = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[1]));
	this.d = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[2]));
    
    if (localStorage.getItem(prefixe + lsAttrSolutions[3])) { // v1.1 : réparation v1.0 de l'oubli du m. Si entrée m existe on charge normalement...
        this.stMot = localStorage.getItem(prefixe + lsAttrSolutions[3]);
        this.trouvee = (localStorage.getItem(prefixe + lsAttrSolutions[4]) == vrai); // 't' = trouvée et non taille (this.t)
    }
    else { // sinon on charge avec l'oubli du m...
        this.stMot = localStorage.getItem(prefixe + lsAttrSolutions[4]);
        this.trouvee = (localStorage.getItem(prefixe + 'undefined') == vrai); // 't' = trouvée et non taille (this.t)
    }
    
	// Finalement, solutionCharge est un constructeur (appel avec new)... Déclaration des méthodes 

	// méthodes
	this.majAffichage = solutionMajAffichage;
	// localStorage
	this.enregistre = solutionEnregistre; 
	// this.charge = solutionCharge; // constructeur
}

//---------------------------------------------------------------------------
// Classe solutionFilOrange
//---------------------------------------------------------------------------
function solutionFilOrangeMajAffichage(affiche)
{
	// Affichage en rouge dans la grille
	for(var k=0; k<this.t; k++) {
		var x=this.x+k*dx[this.d];
		var y=this.y+k*dy[this.d];
		h[x][y].rouge = affiche;
		if (affiche) {
			if (!h[x][y].orange) {
				nbLettresEnOrange++;
				h[x][y].orange = true;
				localStorage.nleo = nbLettresEnOrange; // enregistrement auto
			}
		}
		h[x][y].enregistre(); // enregistrement auto
		h[x][y].affiche();
	}
	// Affichage sous les compteurs
	if (affiche) {
		xDepart = this.x;
		yDepart = this.y;
		dDepart = this.d;
		tailleSelection = this.t;
		afficheMotChoisi();
	}
	else
		retireMotChoisi();
}
//---------------------------------------------------------------------------
function solutionFilOrangeEnregistre(t, i)
{
	var prefixe = lsSolFilOrange + t + i;
	localStorage.setItem(prefixe + lsAttrSolutions[0], this.x);
	localStorage.setItem(prefixe + lsAttrSolutions[1], this.y);
	localStorage.setItem(prefixe + lsAttrSolutions[2], this.d);
	localStorage.setItem(prefixe + lsAttrSolutions[3], this.stMot);
}
//---------------------------------------------------------------------------
function solutionFilOrangeCharge(t, i)
{
	var prefixe = lsSolFilOrange + t + i;
	this.t = t + tailleMinMot; 
	this.x = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[0]));
	this.y = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[1]));
	this.d = parseInt(localStorage.getItem(prefixe + lsAttrSolutions[2]));
    if (localStorage.getItem(prefixe + lsAttrSolutions[3])) // v1.1 : réparation v1.0 de l'oubli du m. Si entrée m existe on charge normalement...
        this.stMot = localStorage.getItem(prefixe + lsAttrSolutions[3]);
    else
        this.stMot = localStorage.getItem(prefixe + lsAttrSolutions[4]);

	// Finalement, solutionFilOrangeCharge est un constructeur (appel avec new)... Déclaration des méthodes 

	// méthodes
	this.majAffichage = solutionFilOrangeMajAffichage;
	// localStorage
	this.enregistre = solutionFilOrangeEnregistre; 
	// this.charge = solutionFilOrangeCharge; // constructeur
}

//---------------------------------------------------------------------------
// classe scoreGrille
//---------------------------------------------------------------------------
function scoreGrilleTotal()
{
	return this.score + this.bonus;
}
//---------------------------------------------------------------------------
function scoreGrilleTotalMax()
{
	return this.scoreMax + this.bonusMax;
} 
//---------------------------------------------------------------------------
function scoreGrilleEnregistre() // v1.4 : plus de paramètre
{
	var prefixe = lsScoreGrille; // v1.4 : plus de paramètre
	localStorage.setItem(prefixe + lsAttrScores[0], this.score);
	localStorage.setItem(prefixe + lsAttrScores[1], this.bonus);
	localStorage.setItem(prefixe + lsAttrScores[2], this.scoreMax);
	localStorage.setItem(prefixe + lsAttrScores[3], this.bonusMax);
	localStorage.setItem(prefixe + lsAttrScores[4], this.partie); // v1.4
	localStorage.setItem(prefixe + lsAttrScores[5], this.partieMax); // v1.4
}
//---------------------------------------------------------------------------
function scoreGrilleCharge() // v1.4 : plus de paramètre
{
	// Méthodes
	this.total = scoreGrilleTotal;
	this.totalMax = scoreGrilleTotalMax; 
	this.enregistre = scoreGrilleEnregistre;
	this.initialise = scoreGrilleInitialise; // v1.4
	// this.charge = scoreGrilleCharge; // constructeur

	var prefixe = lsScoreGrille; // v1.4 : plus de paramètre
	this.score = parseInt(localStorage.getItem(prefixe + lsAttrScores[0]));
	this.bonus = parseInt(localStorage.getItem(prefixe + lsAttrScores[1]));
	this.scoreMax = parseInt(localStorage.getItem(prefixe + lsAttrScores[2]));
	this.bonusMax = parseInt(localStorage.getItem(prefixe + lsAttrScores[3]));
	this.partie = parseInt(localStorage.getItem(prefixe + lsAttrScores[4])); // v1.4
	this.partieMax = parseInt(localStorage.getItem(prefixe + lsAttrScores[5])); // v1.4
	
}
//---------------------------------------------------------------------------
// classe scoreOrange
//---------------------------------------------------------------------------
function scoreOrangeTotal()
{
	return this.score + this.bonus;
}
//---------------------------------------------------------------------------
function scoreOrangeEnregistre() // v1.4 : plus de paramètre
{
	var prefixe = lsScoreOrange; // v1.4 : plus de paramètre
	localStorage.setItem(prefixe + lsAttrScores[0], this.score);
	localStorage.setItem(prefixe + lsAttrScores[1], this.bonus);
	localStorage.setItem(prefixe + lsAttrScores[4], this.partie); // v1.4
}
//---------------------------------------------------------------------------
function scoreOrangeCharge()  // v1.4 : plus de paramètre
{
	// Méthodes
	this.total = scoreOrangeTotal;
	this.enregistre = scoreOrangeEnregistre;
	this.initialise = scoreOrangeInitialise; // v1.4
	// this.charge = scoreOrangeCharge; // constructeur

	var prefixe = lsScoreOrange;
	this.score = parseInt(localStorage.getItem(prefixe + lsAttrScores[0]));
	this.bonus = parseInt(localStorage.getItem(prefixe + lsAttrScores[1]));
	this.partie = parseInt(localStorage.getItem(prefixe + lsAttrScores[4])); // v1.4
}

//---------------------------------------------------------------------------
// AUTRES FONCTIONS
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// Affichage des compteurs
//---------------------------------------------------------------------------
function afficheNumerateurCompteur(nbl) // nbl de 5 à 11
{
	var n = nbl - tailleMinMot;
	var couleur = (filOrange?cptOrange:((!nbMotsGrille[n])?cptGris:((nbMotsGrille[n]==nbMTrvGrille[n])?cptVert:cptRouge)));
	var d = Math.floor((filOrange?nbMotsEnOrange[n]:nbMTrvGrille[n]) / 10);
	var u = (filOrange?nbMotsEnOrange[n]:nbMTrvGrille[n]) % 10;
	var id; var nvSrc;
	var idSep = idCptSep + n;
	var coulPrc;
	var coulSep = document.images[idSep].src[5];
	
	// Dizaines
	id = 'cnd' + n;
	coulPrc = document.images[id].src[5];
	nvSrc = chmPng + d + couleur + extPng;
	document.images[id].src = nvSrc;	

	// Unités
	id = 'cnu' + n;
	nvSrc = chmPng + u + couleur + extPng;
	document.images[id].src = nvSrc;	
	
	if ((couleur != coulPrc) && 
		(couleur != coulSep)) {
		afficheSeparateurCompteur(nbl);
		afficheDenominateurCompteur(nbl);
	}
}
//---------------------------------------------------------------------------
function afficheSeparateurCompteur(nbl) // nbl de 5 à 11
{
	var n = nbl - tailleMinMot;
	var couleur = ((filOrange||(!nbMotsGrille[n]))?cptGris:((nbMotsGrille[n]==nbMTrvGrille[n])?cptVert:cptRouge));
	var id = idCptSep + n; 
	var nvSrc = chmPng + cptSep + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheDenominateurCompteur(nbl) // nbl de 5 à 11
{
	var n = nbl - tailleMinMot;
	var couleur = ((filOrange||(!nbMotsGrille[n]))?cptGris:((nbMotsGrille[n]==nbMTrvGrille[n])?cptVert:cptRouge));
	var d = Math.floor(nbMotsGrille[n] / 10);
	var u = nbMotsGrille[n] % 10;
	var id; var nvSrc;

	// Dizaines
	id = 'cdd' + n;
	nvSrc = chmPng + d + couleur + extPng;
	document.images[id].src = nvSrc;	

	// Unités
	id = 'cdu' + n;
	nvSrc = chmPng + u + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheCompteur(nbl) // nbl de 5 à 11
{
	afficheDenominateurCompteur(nbl);
	afficheSeparateurCompteur(nbl);
	afficheNumerateurCompteur(nbl);
}
//------------------------
// Génération de la Grille
//------------------------
function afficheGrille()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].affiche();
}
//---------------------------------------------------------------------------
function enregistreGrille()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].enregistre();
}
//---------------------------------------------------------------------------
function chargeGrille()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].charge(x, y);
}
//---------------------------------------------------------------------------
function indiceDico(filtre, debut) // v1.5
{
	var t = filtre.length-tailleMinMot;
	var iMin = 0;
	var iMax = dico[t].length-1; // v1.7.2 nbMots[x] est changé en dico[x].length
	var i = Math.floor((iMin+iMax)/2);
	var OK = non;
	while((!OK)&&(iMax-iMin>1)) {
		if (dico[t][i]==filtre)
			OK = oui;
		else {
			if (dico[t][i]<filtre)
				iMin = i;
			else
				iMax = i;
			i = Math.floor((iMin+iMax)/2);
		}
	}
	return (OK?i:(debut?iMin:iMax)); 
}
//---------------------------------------------------------------------------
function compteMots(filtre, iMin, iMax) // v1.5 : nouvelle implémentation
{
	var n = 0;
	var t = filtre.length-tailleMinMot;
	var filtreMin = vide;
	var filtreMax = vide;
	if (filtre[0] != joker) {
		for(var i=0; i<filtre.length; i++) {
				filtreMin = filtreMin + ((filtre[i] == joker)?'A':filtre[i]);
				filtreMax = filtreMax + ((filtre[i] == joker)?'Z':filtre[i]);
		}
		iMin = indiceDico(filtreMin, oui);
		iMax = indiceDico(filtreMax, non);
		//console.log(filtre+'('+filtreMin+'>'+filtreMax+'):dico['+iMin+']='+dico[t][iMin]+'>dico['+iMax+']='+dico[t][iMax]+' ('+((100.0*(iMax-iMin+1))/dico[t].length)+'%) ');
	}
	for(var i=iMin; i<=iMax; i++)
		if (((filtre[0]==joker)||(dico[t][i][0]==filtre[0]))&&
			((filtre[1]==joker)||(dico[t][i][1]==filtre[1]))&&
			((filtre[2]==joker)||(dico[t][i][2]==filtre[2]))&&
			((filtre[3]==joker)||(dico[t][i][3]==filtre[3]))&&
			((filtre[4]==joker)||(dico[t][i][4]==filtre[4]))&&
			((t<1)||(filtre[5]==joker)||(dico[t][i][5]==filtre[5]))&&
			((t<2)||(filtre[6]==joker)||(dico[t][i][6]==filtre[6]))&&
			((t<3)||(filtre[7]==joker)||(dico[t][i][7]==filtre[7]))&&
			((t<4)||(filtre[8]==joker)||(dico[t][i][8]==filtre[8]))&&
			((t<5)||(filtre[9]==joker)||(dico[t][i][9]==filtre[9]))&&
			((t<6)||(filtre[10]==joker)||(dico[t][i][10]==filtre[10]))) {
			n++;
		}
	return n;
}
//---------------------------------------------------------------------------
function choisitMotAvecFiltre(filtre) // v1.5 : nouvelle implémentation
{
	var t = filtre.length-tailleMinMot;
	var iMin = 0;
 	var iMax = dico[t].length-1; // v1.7.2 nbMots[x] est changé en dico[x].length
	var n = compteMots(filtre, iMin, iMax);
	if (!n) return vide;
	var index = Math.floor(n * Math.random());
	var k = 0;
	var filtreMin = filtre;
	var filtreMax = filtre;
	for(var i=0; i<filtre.length; i++) {
		if (filtreMin[i] == joker)
			filtreMin[i] = 'A';
		if (filtreMax[i] == joker)
			filtreMax[i] = 'Z';
	}
	for(var i=iMin; i<=iMax; i++) {
		if (((filtre[0]==joker)||(dico[t][i][0]==filtre[0]))&&
			((filtre[1]==joker)||(dico[t][i][1]==filtre[1]))&&
			((filtre[2]==joker)||(dico[t][i][2]==filtre[2]))&&
			((filtre[3]==joker)||(dico[t][i][3]==filtre[3]))&&
			((filtre[4]==joker)||(dico[t][i][4]==filtre[4]))&&
			((t<1)||(filtre[5]==joker)||(dico[t][i][5]==filtre[5]))&&
			((t<2)||(filtre[6]==joker)||(dico[t][i][6]==filtre[6]))&&
			((t<3)||(filtre[7]==joker)||(dico[t][i][7]==filtre[7]))&&
			((t<4)||(filtre[8]==joker)||(dico[t][i][8]==filtre[8]))&&
			((t<5)||(filtre[9]==joker)||(dico[t][i][9]==filtre[9]))&&
			((t<6)||(filtre[10]==joker)||(dico[t][i][10]==filtre[10]))) {
			k++;
		}
		if (k-1 == index)
			return dico[t][i];
	}
	return vide;
}
//---------------------------------------------------------------------------
function unMotDeTaille(taille)
{
	var t = taille-tailleMinMot;
 	return dico[t][Math.floor(dico[t].length*Math.random())]; // v1.7.2 nbMots[x] est changé en dico[x].length 
}
//---------------------------------------------------------------------------
function remplitGrilleAvecMot()
{
	// On choisit une case départ
	var	x = Math.floor(nbLignes*Math.random());
	var	y = xyMin[x] + Math.floor((1+xyMax[x]-xyMin[x])*Math.random());
	var nbl = [0, 0, 0, 0, 0, 0, 0];
	var nbj = [0, 0, 0, 0, 0, 0, 0];

	// On calcule les directions possibles
	for(var d=typeDir.d0h; d<=typeDir.d10h; d++) {
		for(var k=0; k<=tailleMaxMot; k++)
			if (estValide(x, y, d, k)) {
				if (h[x+k*dx[d]][y+k*dy[d]].l == joker) 
					nbj[d]++;
				nbl[d]=k;
			}
			else
				break;
	}
	
	// On choisit la direction ayant le plus de jokers (nbj[d]) et on prend sa taille max (nbl[d])
	var d = typeDir.dIndefinie;
	var n = 0; // nb lettres
	var j = 0; // nb jokers
	for(var dd=typeDir.d0h; dd<=typeDir.d10h; dd++)
		if ((nbj[dd] > j) && (nbl[dd] >= tailleMinMot)) {
			j = nbj[dd];
			n = nbl[dd];
			d = dd;
		}
		
	var filtre = vide;
	var nbJokers = 0;
	for(var k=0; k<n; k++) {
		var l = h[x+k*dx[d]][y+k*dy[d]].l;
		if (l==joker) nbJokers++;
		filtre = filtre + l;
	}

	// On choisit un mot...
	if (nbJokers>0) {
		if (nbJokers<n)
			filtre=choisitMotAvecFiltre(filtre);
		else
			filtre=unMotDeTaille(n);
		if (filtre.length) {
	 		// ...et si c'est possible, on affecte les lettres dans la grille.
			for(var k=0; k<n; k++) 
				if (h[x+k*dx[d]][y+k*dy[d]].l == joker) {
					h[x+k*dx[d]][y+k*dy[d]].l = filtre[k];
					nbCasesOK++;
				}
			//console.log('>'+filtre);
			nbChoixOK++;
			return true;
		}
		else {
			return false;
		}
	}
	else { // ...et si c'est pas possible, on ne fait rien.
		return false;
	}
}
//---------------------------------------------------------------------------
function completeGrille()
{
	var nbJokersMax = 0;
	var nbLettresMax = 0;
	var xMax = indefini;
	var yMax = indefini;
	var dMax = typeDir.dIndefinie;
	var kMinJokerMax = indefini;
	var kMaxJokerMax = indefini;

	//console.log('2a. Recherche de la ligne ayant le plus de jokers "collés" puis de lettres...');
	for(var d=typeDir.d0h; d<=typeDir.d10h; d++)
		for(var l=0; l<nbLignes; l++) {
			var x = xDir[d][l];
			var y = yDir[d][l];
			var nbJokers = 0;
			var kMinJoker = nbLignes;
			var kMaxJoker = indefini;
			for(var k=0; k<tailleLigne[l]; k++)
				if (h[x+k*dx[d]][y+k*dy[d]].l == joker) {
					nbJokers++;
					if (k < kMinJoker) kMinJoker = k;
					if (k > kMaxJoker) kMaxJoker = k;
					if ((nbJokers > nbJokersMax) || 
						((nbJokers == nbJokersMax) && (tailleLigne[l] > nbLettresMax))) {
						nbJokersMax = nbJokers;
						nbLettresMax = tailleLigne[l];
						xMax = x; yMax = y; dMax = d;
						kMinJokerMax = kMinJoker; 
						kMaxJokerMax = kMaxJoker;
					}
				}
				else { // On ne compte que les jokers côte-à-côte...
					kMinJoker = nbLignes;
					kMaxJoker = indefini;
					nbJokers = 0;
				}
			//console.log(' ('+x+','+y+','+stDir[d]+')='+nbJokers+'j+'+tailleLigne[l]+'l');
		}	
	//console.log('>('+xMax+','+yMax+','+stDir[dMax]+') = '+nbJokersMax+'j+'+nbLettresMax+'l, k('+kMinJokerMax+'>'+kMaxJokerMax+')');
	if (!nbJokersMax) {
		//console.log('SUCCES : plus de jokers...'); 
		grilleOK = true; // Pour ne plus rechercher
		return false; // Pour arrêter de chercher
	}
	//console.log('2b. Recherche de mot pour compléter les jokers...');
	for(var l=nbLettresMax; l>=Math.max(1+kMaxJokerMax-kMinJokerMax, tailleMinMot); l--)
		for(var k0=Math.max(0, 1+kMaxJokerMax-l); k0<Math.min(1+nbLettresMax-l, 1+kMinJokerMax); k0++) {
			//console.log('(l,k0,kMinJ,kMaxJ)=('+l+','+k0+','+kMinJokerMax+','+kMaxJokerMax+')');
			// On essaie dans un sens...
			var filtre=vide;
			for(var k=k0; k<k0+l; k++)
				filtre = filtre + h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l;
			//console.log('>'+filtre);
			if (filtre == stJokers[l-k0-tailleMinMot])
				filtre=unMotDeTaille(l);
			else
				filtre=choisitMotAvecFiltre(filtre);
			if (filtre.length) {
				//console.log('='+filtre);
				for(var k=k0; k<k0+l; k++)
					if (h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l == joker) {
						h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l = filtre[k-k0];
					}
				//console.log('On continue à remplir...');
				return true;
			}
			// On essaie dans l'autre sens...
			filtre=vide;
			for(var k=k0+l-1; k>=k0; k--)
				filtre = filtre + h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l;
			//console.log('>'+filtre);
			if (filtre == stJokers[l-k0-tailleMinMot])
				filtre=unMotDeTaille(l);
			else
				filtre=choisitMotAvecFiltre(filtre);
			if (filtre.length) {
				//console.log('='+filtre);
				for(var k=k0+l-1; k>=k0; k--)
					if (h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l == joker) {
						h[xMax+k*dx[dMax]][yMax+k*dy[dMax]].l = filtre[k0+l-1-k];
					}
				//console.log('On continue à remplir...');
				return true;
			}
		}
	//console.log('ECHEC : on a pas pu trouver de mot pour cette ligne...');
	return false;
}
//---------------------------------------------------------------------------
function remplitGrille()
{
	//console.log('1. Remplissage au hasard...');
	nbCasesOK=0; nbChoixOK=0;
	for(var i=0; i<nbCases; i++)
		remplitGrilleAvecMot();
	//console.log('Remplissage : '+nbCasesOK+'/'+nbCases+' en '+nbChoixOK+' coups.\n-------------------------------\n2. Remplissage forcé...');
	grilleOK = false;
	nbCasPasses=0;
	while(completeGrille());
	if (grilleOK) 
		grilleOK = filOrangePossible();
}
//---------------------------------------------------------------------------
function releveMotsGrille()
{
	// Initialisation des compteurs
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++) {
		nbMTrvGrille[i] = 0;
		nbMotsGrille[i] = 0;
		nbMotsEnOrange[i] = 0; 
		s[i].length = 0;
	}
	
	scoreGrille.score = 0;
	scoreGrille.scoreMax = 0;
	scoreGrille.bonus = 0;
	scoreGrille.bonusMax = 0;

	scoreOrange.score = 0;
	scoreOrange.bonus = 0;

	lettresRestantes = nbCases;
	
	// Comptage
	for(var d=typeDir.d0h; d<=typeDir.d10h; d++)
		for(var l=0; l<nbLignes; l++) {
			var x = xDir[d][l];
			var y = yDir[d][l];
			for(var t=tailleLigne[l]; t>=tailleMinMot; t--) {
				for(var k0=0; k0<=tailleLigne[l]-t; k0++) {
					var stMot = vide;
					for(var k=k0; k<k0+t; k++)
						stMot = stMot + h[x+k*dx[d]][y+k*dy[d]].l
					if (dico[t-tailleMinMot].indexOf(stMot) > -1) {
						nbMotsGrille[t-tailleMinMot]++;
						//console.log('('+(x+k0*dx[d])+','+(y+k0*dy[d])+','+stDir[d]+','+t+') : mot n°'+nbMotsGrille[t-tailleMinMot]+' de '+t+' lettres ('+stMot+')');	
						s[t-tailleMinMot][s[t-tailleMinMot].length] = new creeSolution(x+k0*dx[d], y+k0*dy[d], d, t, stMot);
						scoreGrille.scoreMax += scoreMot[d][t-tailleMinMot];
					}
				} 
			}
		}
	scoreGrille.bonusMax = 2 * bonusPartie();
		
	// Affichage nombres de mots
	for(var i=tailleMinMot; i<=tailleMaxMot; i++) {
		//console.log('Mots de '+i+' lettres: '+nbMotsGrille[i-tailleMinMot]); 
		afficheCompteur(i);
	}
	
	// Affichage des scores
	afficheScore();
}
//---------------------------------------------------------------------------
function generePuisAfficheGrille()
{
	var n = 0;
	grilleOK = false;
	while(!grilleOK) {
		initialiseGrille();
		remplitGrille();
		if (!grilleOK)
			n++;
	}
	//console.log('C\'est bon au coup n°'+(n+1)+' !');
	releveMotsGrille();
	cacheLettresInutilisees();
	afficheGrille();
}
//---------------------------------------------------------------------------
// Affiche mot sélectionné
//---------------------------------------------------------------------------
function afficheDernierCoupFO() // v1.2
{
	// Mots

	var id = 'mlA';
	var nvSrc = chmPng + 'mots' + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlB';
	nvSrc = chmPng + (Math.floor(drnCpFONbMots/10)%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlC';
	nvSrc = chmPng + (drnCpFONbMots%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;

	// Coup (score)

	id = 'mlD';
	nvSrc = chmPng + 'coup' + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlE';
	var nvSrc = chmPng + (Math.floor(drnCpFOScore/100)%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;

	id = 'mlF';
	var nvSrc = chmPng + (Math.floor(drnCpFOScore/10)%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlG';
	var nvSrc = chmPng + (drnCpFOScore%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;

	// Top (score)

	id = 'mlH';
	nvSrc = chmPng + 'top' + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlI';
	var nvSrc = chmPng + (Math.floor(statsEtTops.topCoupFOScore/100)%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;

	id = 'mlJ';
	var nvSrc = chmPng + (Math.floor(statsEtTops.topCoupFOScore/10)%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;
	
	id = 'mlK';
	var nvSrc = chmPng + (statsEtTops.topCoupFOScore%10) + sfxCoupFO + extPng;
	document.images[id].src = nvSrc;
}
//---------------------------------------------------------------------------
function majAffichageMotChoisi(affiche) // Mot + Score
{
	var taille = (affiche?tailleSelection:tailleMaxMot);
	var score = (affiche?(filOrange?scoreMto[dDepart][taille-tailleMinMot]:scoreMot[dDepart][taille-tailleMinMot]):0);
	var dizaines = Math.floor(score/10);
	var unites = score%10;
	var coulFin = (affiche?(h[xDepart+(taille-1)*dx[dDepart]][yDepart+(taille-1)*dy[dDepart]].vert?motVert:motGris):vide);
	var id = ((taille==tailleMaxMot)?'msd':('ms'+ String.fromCharCode(charCodeMin+tailleMaxMot-taille) + String.fromCharCode(1+charCodeMin+tailleMaxMot-taille))); 
	var nvSrc = chmPng + (affiche?('sd'+(h[xDepart][yDepart].vert?motVert:motGris)):fond) + extPng;
	stDrnMotForme = vide;
	document.images[id].src = nvSrc;	
	for(var k=0; k<taille-1; k++) {
		var lettre = (affiche?h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].l:vide);
		stDrnMotForme = stDrnMotForme + lettre;
		sepPng = (affiche?('sg'+(h[xDepart+    k*dx[dDepart]][yDepart+    k*dy[dDepart]].vert?motVert:motGris)+
				  			'd'+(h[xDepart+(k+1)*dx[dDepart]][yDepart+(k+1)*dy[dDepart]].vert?motVert:motGris)):vide);
		id = 'ml'+ String.fromCharCode(1+charCodeMin+k+tailleMaxMot-taille);
		nvSrc = chmPng + (affiche?(lettre+sepPng[2]):fond) + extPng;
		document.images[id].src = nvSrc;
		id = 'ms'+ String.fromCharCode(1+charCodeMin+k+tailleMaxMot-taille) + String.fromCharCode(2+charCodeMin+k+tailleMaxMot-taille);
		nvSrc = chmPng + (affiche?sepPng:fond) + extPng;
		document.images[id].src = nvSrc;
	}
	// Fin du mot
	id = 'mlK';	
	if (affiche) {
		lettre = h[xDepart+(taille-1)*dx[dDepart]][yDepart+(taille-1)*dy[dDepart]].l;
		stDrnMotForme = stDrnMotForme + lettre;
	}
	nvSrc = chmPng + (affiche?(lettre+coulFin):fond) + extPng;
	document.images[id].src = nvSrc;	
	id = idFinMot;	
	nvSrc = chmPng + (affiche?('sf'+coulFin):fond) + extPng;
	document.images[id].src = nvSrc;	

	// Score
	id = 'mpd';	
	nvSrc = chmPng + (affiche?(dizaines+cptBlanc):fond) + extPng;
	document.images[id].src = nvSrc;	
	id = idFinScore;	
	nvSrc = chmPng + (affiche?(unites+cptBlanc):fond) + extPng;
	document.images[id].src = nvSrc;		

	// paramètre dico
	nvSrc = chmPng + (affiche?pngDico[dicoDef]:fond) + extPng; 
	document.images[idPrmDico].src = nvSrc;	
	
	if (affiche) { // v1.1
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDrnMotForme;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM; // v1.4.1 - .toLowerCase
		// v1.1 : On s'assure de bien renvoyer à l'extérieur
		document.links[idLnkDico].target = '_blank';
	}
	else { // v1.1 : on empêche de cliquer en "aveugle" sur '?'
		document.links[idLnkDico].href = '#';
		document.links[idLnkDico].target = '_self';
	}
	
	// recherche définition
	id = 'mdf';	
	nvSrc = chmPng + (affiche?hrefDef:fond) + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheMotChoisi()
{
	majAffichageMotChoisi(false);
	majAffichageMotChoisi(true);
}
//---------------------------------------------------------------------------
function retireMotChoisi()
{
	majAffichageMotChoisi(false);
	if (filOrange) // v1.2
		afficheDernierCoupFO();
}
//---------------------------------------------------------------------------
// Affichage données partie
//---------------------------------------------------------------------------
function changeEtatGrille(etat) // etat = {cptRouge, cptVert, cptOrange}
{
	document.images[idGrille].src = chmPng + idGrille + etat + extPng;
}
//---------------------------------------------------------------------------
function afficheNumeroGrille()
{
	// Affichage état de la grille en rouge 
	changeEtatGrille((filOrange?cptOrange:(lettresRestantes?cptRouge:cptVert)));
	// Affichage du numéro
	var u = grille % 10;
	var d = Math.floor(grille / 10);
	document.images['sgnd'].src = chmPng + d + cptBlanc + extPng;
	document.images['sgnu'].src = chmPng + u + cptBlanc + extPng;
}
//---------------------------------------------------------------------------
function changeEtatChances() // etat {cptRouge, cptVert, cptOrange}
{
	document.images[idChances].src = chmPng + idChances + (filOrange?cptOrange:(chances?cptVert:cptRouge)) + extPng;
}
//---------------------------------------------------------------------------
function afficheNombreChances()
{
	// Affichage état de la grille en rouge 
	changeEtatChances();
	// Affichage du numéro
	var u = chances % 10;
	var d = Math.floor(chances / 10) % 100; // On ne sait jamais si on fait le tour du compteur !
	document.images['scnd'].src = chmPng + d + cptBlanc + extPng;
	document.images['scnu'].src = chmPng + u + cptBlanc + extPng;
}
//---------------------------------------------------------------------------
function scoreMaxPartie()
{
	return scoreGrille.partieMax + scoreGrille.totalMax(); // v1.4
}
//---------------------------------------------------------------------------
function scorePartie() 
{
	return	scoreGrille.partie + scoreGrille.total() + // v1.4 
			scoreOrange.partie + scoreOrange.total();  // v1.4
}
//---------------------------------------------------------------------------
function bonusPartie() // Calcul du bonus maximal pour attribuer si celui-ci est atteint, le bonus partie = bonus max !
{
	var bonus = 0;
	for(var t=tailleMinMot; t<=tailleMaxMot; t++)
		bonus += (12 - t)*nbMotsGrille[t-tailleMinMot];
	return bonus;
}
//---------------------------------------------------------------------------
// [typeScore {idScore, idBonus, idTotal, idPartie} [, typeInfo {idNumerateur, idDenominateur}
function afficheScore(typeScore, typeInfo) // Retourne true si le dénominateur a été rafraîchi sinon false.
{
	if (typeInfo == undefined) {
		afficheNumeroGrille();
		afficheNombreChances();
		if (!afficheScore(idScore, idNumerateur)) afficheScore(idScore, idDenominateur);
		if (!afficheScore(idBonus, idNumerateur)) afficheScore(idBonus, idDenominateur);
		if (!afficheScore(idTotal, idNumerateur)) afficheScore(idTotal, idDenominateur);
		afficheScore(idPartie, idNumerateur);
		return;
	}		

	var score = 0;
	var scoreDual = indefini;
	var chiffre = [0,0,0,0,0,0];

	if (typeInfo == undefined) // Si non précisé, on affiche le numérateur.
		typeInfo = idNumerateur; 

	// Récupération de la valeur
	switch(typeScore+typeInfo) {
		case 'ssn' :	score = (filOrange?scoreOrange.score:scoreGrille.score); scoreDual = scoreGrille.scoreMax; break;
		case 'ssd' :	score = scoreGrille.scoreMax; scoreDual = (filOrange?scoreOrange.score:scoreGrille.score); break; // v1.6 : on affiche le % entre le score Fil Orange et le max de la grille de la première manche
		case 'sbn' :	score = (filOrange?scoreOrange.bonus:scoreGrille.bonus); scoreDual = scoreGrille.bonusMax; break;
		case 'sbd' :	score = scoreGrille.bonusMax; scoreDual = (filOrange?scoreOrange.bonus:scoreGrille.bonus); break; // v1.6 : on affiche le % entre le score Fil Orange et le max de la grille de la première manche
		case 'stn' :	score = (filOrange?scoreOrange.total():scoreGrille.total()); scoreDual = scoreGrille.totalMax(); break;
		case 'std' :	score = scoreGrille.totalMax(); scoreDual = (filOrange?scoreOrange.total():scoreGrille.total()); break; // v1.6 : on affiche le % entre le score Fil Orange et le max de la grille de la première manche
		case 'spn' :	score = scorePartie(); break;
	}
	
	// Décomposition & Affichage des chiffres
	var couleur = (filOrange ? ((typeScore == idPartie) ?
	                            cptBlanc : 
	                            ((typeInfo == idDenominateur) ? 
	                             cptGris : cptOrange)
	                           ) : 
	                ((score == scoreDual) ?
	                 cptVert : 
	                 ((typeScore == idPartie) ? cptBlanc : cptRouge)
	                )
	              );
	
	var zeroNonSignificatif = false; // v1.6 : Indique si le zéro est à remplacer par un espace (true) ou non (false)
	if (typeInfo == idDenominateur) { // v1.6 : on met finalement le pourcentage dans score si typeInfo = idDenominateur avec 10*Pourcentage 
		score = (score ? 10 * Math.round((100.0*scoreDual)/score) : 0);
		zeroNonSignificatif = true;
	}
	for(var i=(typeScore != idPartie ? 3 : 5); i>indefini; i--) { // v1.6 : on affiche les chiffres dans l'ordre inverse (de gauche à droite) pour pouvoir ne pas afficher les 0 non significatifs des %
		chiffre[i] = Math.floor(score / exp10[i]) % 10;
		zeroNonSignificatif = zeroNonSignificatif && (!chiffre[i]) && (i>1); // Zéros non significatifs ?
		var id = ((typeScore == idPartie) ? (typeScore + idChiffrePartie[i]) : (typeScore + typeInfo + idChiffreScore[i]));
		var nvSrc = chmPng + ((typeInfo == idDenominateur)&&(!i)?'!':(zeroNonSignificatif?'-':chiffre[i])) + (zeroNonSignificatif?vide:couleur) + extPng; // v1.6 : affichage du % pur le dénominateur et l'unité au lieu de chiffre[i] et uniquement les zéros significatifs
		document.images[id].src = nvSrc;
		/* if ((i == 3) && (typeScore != idPartie)) break; */ // v1.6 : reporté dans l'initialisation de la boucle for
	}

	// On rafraîchit le dénominateur si la couleur a changé
	if (/*(!filOrange) && */ // v1.6 : on rafraîchit aussi pour le Fil Orange (% qui évolue au lieu de max fixe)
	    (typeScore != idPartie) && 
		(typeInfo != idDenominateur) /* &&
		(couleur != document.images[typeScore + idDenominateur + idChiffreScore[0]].src[5])*/)  { // v1.6 : on rafraîchit même si la couleur n'a pas changé
		afficheScore(typeScore, idDenominateur);
		return true;
	}
	else 
		return false;
} 
//---------------------------------------------------------------------------
function rafraichitBoutons()
{
	if (visualisationSolutions) {
		if (!filOrange) 
			document.images[idBtnGauche].src = chmPng + 'm' + extPng;
		document.images[idBtnDroite].src = chmPng + 'p' + extPng;
	}
	else {
		document.images[idBtnGauche].src = chmPng + 'a' + extPng;
		document.images[idBtnDroite].src = chmPng + 'i' + extPng;
	}
}
//---------------------------------------------------------------------------
function incrementeNumeroSolutionVisualisee()
{
	var taille = solutionVisualisee % 10;
	var numero = Math.floor(solutionVisualisee / 10);
	if (nbMotsGrille[taille] == numero + 1) {
		// On recherche la prochaine taille de mot ayant une présence dans la grille (évite le plantage)
		solutionVisualisee = solutionVisualisee % 10; // numero à zéro
		for(solutionVisualisee = (solutionVisualisee + tailleMaxMot - tailleMinMot) % (1 + tailleMaxMot - tailleMinMot); 
			(!s[solutionVisualisee].length); 
			solutionVisualisee = (solutionVisualisee + tailleMaxMot - tailleMinMot) % (1 + tailleMaxMot - tailleMinMot)); 
	}
	else
		solutionVisualisee += 10;
}
//---------------------------------------------------------------------------
function decrementeNumeroSolutionVisualisee()
{
	var taille = solutionVisualisee % 10;
	var numero = Math.floor(solutionVisualisee / 10);
	if (!numero) { 
		// On recherche la prochaine taille de mot ayant une présence dans la grille (évite le plantage)
		for(solutionVisualisee = (solutionVisualisee + 1) % (1 + tailleMaxMot - tailleMinMot); 
			(!s[solutionVisualisee].length); 
			solutionVisualisee = (solutionVisualisee + 1) % (1 + tailleMaxMot - tailleMinMot)); 
		solutionVisualisee += 10 * (nbMotsGrille[solutionVisualisee] - 1);  
	}
	else
		solutionVisualisee -= 10;
}
//---------------------------------------------------------------------------
function montreSolution(prochaine)
{
	var taille = solutionVisualisee % 10;
	var numero = Math.floor(solutionVisualisee / 10);
	if (solutionVisualisee>indefini)
		s[taille][numero].majAffichage(non);
	
	// On change le numéro de solution
	if (solutionVisualisee == indefini) { // Premier affichage (paramètre ignoré)
		for(solutionVisualisee=tailleMaxMot-tailleMinMot; (!s[solutionVisualisee].length); solutionVisualisee--); 
		taille = solutionVisualisee;
		numero = 0;
		while(s[taille][numero].trouvee) {
			incrementeNumeroSolutionVisualisee();
			taille = solutionVisualisee % 10;
			numero = Math.floor(solutionVisualisee / 10);
		}
	}
	else // On utilise les flèches "<" et ">"
		do {
			if (prochaine) 
				incrementeNumeroSolutionVisualisee();
			else
				decrementeNumeroSolutionVisualisee();
			taille = solutionVisualisee % 10;
			numero = Math.floor(solutionVisualisee / 10);
		}
		while(s[taille][numero].trouvee);
		
	// On affiche
	s[taille][numero].majAffichage(oui);
}
//---------------------------------------------------------------------------
// FIL ORANGE
//---------------------------------------------------------------------------
function filOrangeIncrementeNumeroSolutionVisualisee()
{
	var taille = solutionVisualisee % 10;
	var numero = Math.floor(solutionVisualisee / 10);
	if (sfo[taille].length == numero + 1) {
		// On recherche la prochaine taille de mot ayant une présence dans la grille (évite le plantage)
		solutionVisualisee = solutionVisualisee % 10; // numero à zéro
		for(solutionVisualisee++; (solutionVisualisee <= tailleMaxMot - tailleMinMot) && (!sfo[solutionVisualisee].length); solutionVisualisee++); 
		localStorage.sv = solutionVisualisee; // enregistrement auto
		if (solutionVisualisee>tailleMaxMot-tailleMinMot) {
			visualisationSolutions = false;
			solutionVisualisee = indefini;
			localStorage.vs = faux; localStorage.sv = indefini; // enregistrement auto
			rafraichitBoutons();
			xDepart = indefini;
			yDepart = indefini;
			dDepart = typeDir.dIndefinie;
			// Il faut voir s'il y a toujours des mots
			if (!filOrangePossible()) {
				confirmationGrilleDemandee = true;
				localStorage.cgd = vrai; // enregistrement de fin de Fil Orange
				if (nbLettresEnOrange == nbCases) {
					scoreOrange.bonus = scoreOrange.score;
					localStorage.setItem(lsScoreOrange + lsAttrScores[1], scoreOrange.bonus); // enregistrement auto
					afficheScore(idBonus); // v1.6 : on affiche les % également
					afficheScore(idTotal); // v1.6 : on affiche les % également
					afficheScore(idPartie);// v1.6 : on affiche les % également 
				}
				// On enregistre stats & tops Fil Orange
				statsEtTops.enregistreStatsFOGrille();
    			statsEtTops.enregistreTopsFO();
				if (nbLettresEnOrange == nbCases)
					alert('Bravo !\nToute la grille est orange !\nVous doublez votre score !\n\nTouchez "Grille" pour passer à la suivante...');
				else
					alert('Il n\'y a plus de changements possibles.\nLe Fil Orange est terminé.\n\nTouchez "Grille" pour passer à la suivante...');
			}
			return false; // On n'affiche pas de solution au retour
		}
		else
			return true; // On affiche la solution au retour
	}
	else {
		solutionVisualisee += 10;
		localStorage.sv = solutionVisualisee; // enregistrement auto
		return true; // On affiche la solution au retour
	}
}
//---------------------------------------------------------------------------
function filOrangeAfficheMotEtCompteurs(taille, numero)
{
	sfo[taille][numero].majAffichage(oui);
	nbMotsEnOrange[taille]++;  
	afficheCompteur(taille+tailleMinMot);
	scoreOrange.score += scoreMto[sfo[taille][numero].d][taille];

	// enregistrement auto
	localStorage.setItem(lsNbMotsEnOrange + taille, nbMotsEnOrange[taille]);
	localStorage.setItem(lsScoreOrange + lsAttrScores[0], scoreOrange.score);
	
	afficheScore(idScore); // v1.6 : on affiche les % également
	afficheScore(idTotal); // v1.6 : on affiche les % également
	afficheScore(idPartie);// v1.6 : on affiche les % également
}
//---------------------------------------------------------------------------
function filOrangeMontreSolution()
{
	var taille = solutionVisualisee % 10;
	var numero = Math.floor(solutionVisualisee / 10);
	if (solutionVisualisee>indefini)
		sfo[taille][numero].majAffichage(non);
	
	// On change le numéro de solution
	if (solutionVisualisee == indefini) {
		for(solutionVisualisee=0; (!sfo[solutionVisualisee].length); solutionVisualisee++); 
		localStorage.sv = solutionVisualisee; // enregistrement auto
		taille = solutionVisualisee;
		numero = 0;
		// On affiche le mot et les compteurs
		filOrangeAfficheMotEtCompteurs(taille, numero);
	}
	else { // v1.3.1. La recherche de la possibilité d'un prochain coup dans le Fil Orange peut être long donc usage du sablier
		// On utilise la flèche ">"
		afficheSablier(true); // v1.3.1
    	setTimeout(function() { // v1.3.1
			if (filOrangeIncrementeNumeroSolutionVisualisee()) {
				taille = solutionVisualisee % 10;
				numero = Math.floor(solutionVisualisee / 10);
				// On affiche le mot et les compteurs
				filOrangeAfficheMotEtCompteurs(taille, numero);
			}
 	      	afficheSablier(false); // v1.3.1
    	}, 500); // v1.3.1
	} // v1.3.1
}
//---------------------------------------------------------------------------
function finGrille(stMsg) // Met en mode d'affichage des solutions
{
	var stDebutMsg = vide;
	if (stMsg != undefined)
		stDebutMsg = stMsg;
	retireMotChoisi();
	affichageMessageGrilleVerdie = false;
	if (!fin) { // /!\ Peut être déjà en fin de partie
		fin = typeFin.fGrille;
		localStorage.fin = fin; // enregistrement auto
	}
	if (scoreGrille.bonus < scoreGrille.bonusMax) { // Si solutions non trouvées, on les montre...
		visualisationSolutions = true;
		rafraichitBoutons();
		solutionVisualisee = indefini;
		localStorage.vs = vrai; localStorage.sv = indefini; // enregistrement auto
		montreSolution(suivante);
		if (lettresRestantes) // v1.7.4 ajout de "ou les compteurs de mots" (2 fois)
			alert(stDebutMsg + 'Vous pouvez visualiser les mots non trouvés en utilisant "<" et ">" ou les compteurs de mots.\n\nTouchez "Grille" pour en commencer une nouvelle.');
		else
			alert('Vous pouvez visualiser les mots non trouvés en utilisant "<" et ">" ou les compteurs de mots.\n\nTouchez "Grille" pour passer au Fil Orange.');
	}
	else
		if (fin == typeFin.fGrille)
			alert('Touchez "Grille" pour passer au Fil Orange.');
}
//---------------------------------------------------------------------------
function finPartie(stMsg) 
{
	statsEtTops.enregistreStatsGrille();
	statsEtTops.enregistreStatsPartie();
    statsEtTops.enregistreTops();

	fin = typeFin.fPartie;
	localStorage.fin = fin; // enregistrement auto
	finGrille(stMsg);
}
//---------------------------------------------------------------------------
function afficheAidePrincipale()
{
	const stAide = ['Vous devez trouver les mots de 5 à 11 lettres cachés dans la grille. Vous connaissez seulement le nombre de mots à trouver (noms communs et verbes conjugués). Après chaque mot trouvé, ses lettres sont verdies. Vous devez verdir toute la grille pour passer à la suivante. Trouver tous les mots donne droit à un bonus : un bonus par taille de mot et un super bonus pour tous les mots trouvés.',
					'Vous devez changer une lettre afin que la nouvelle lettre forme de nouveaux mots d\'au moins 5 lettres. Les nouveaux mots deviennent orange. Si vous ocrez toute la grille vous doublez le score ! Si vous ne formez pas de mot, le Fil Orange prend fin et vous passez à la grille suivante.\nTouchez la lettre à changer puis la nouvelle lettre qui peut se trouver autour de la grille.'];
	const stTitre = ['Bienvenue à Osmotissimax','Bienvenue dans le Fil Orange'];
	alert(stTitre[filOrange?1:0]+'\n\n'+stAide[filOrange?1:0]);
}
//---------------------------------------------------------------------------
// Enregistrement de la partie
//---------------------------------------------------------------------------
function enregistreScoreGrille()
{
	scoreGrille.enregistre(); // v1.4
}
//---------------------------------------------------------------------------
function enregistreScoreOrange()
{
	scoreOrange.enregistre(); // v1.4
}
//---------------------------------------------------------------------------
function enregistreNbMotsGrille()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++) {
		localStorage.setItem(lsNbMotsGrille + i, nbMotsGrille[i]);
		localStorage.setItem(lsNbMTrvGrille + i, nbMTrvGrille[i]);
	}
}
//---------------------------------------------------------------------------
function enregistreNbMotsEnOrange()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		localStorage.setItem(lsNbMotsEnOrange + i, nbMotsEnOrange[i]);
}
//---------------------------------------------------------------------------
function enregistrePartie()
{
	// Comptages de mots
	enregistreNbMotsGrille();

	// Grille hexagonale
	enregistreGrille();

	// Solutions
	enregistreSolutions();

	// Dictionnaire de définition
	localStorage.ddd = dicoDef; 
	localStorage.acd = affichagesChgtDico;

	// Eléments de partie
	localStorage.vs = visualisationSolutions;
	localStorage.sv = solutionVisualisee;
	localStorage.aa = affichageAide;
	localStorage.fin = fin;

	localStorage.grille = grille;
	localStorage.chances = chances;
	localStorage.lr = lettresRestantes;

	enregistreScoreGrille();

	// Fil Orange
	localStorage.filOrange = filOrange;
	localStorage.nleo = nbLettresEnOrange;
	localStorage.sfo = stSolutionFilOrange;
	localStorage.aafo = affichageAideFilOrange;
	
	// v1.1
	localStorage.dcfonm = drnCpFONbMots;
	localStorage.dcfos = drnCpFOScore;

	enregistreNbMotsEnOrange();
	enregistreScoreOrange();
	enregistreSolutionsFilOrange();
}

//---------------------------------------------------------------------------
// Chargement de la partie
//---------------------------------------------------------------------------
function chargeScoreGrille()
{
	scoreGrille = new scoreGrilleCharge(); // v1.4
}
//---------------------------------------------------------------------------
function chargeScoreOrange()
{
	scoreOrange = new scoreOrangeCharge(); // v1.4
}
//---------------------------------------------------------------------------
function chargeNbMotsGrille()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++) {
		nbMotsGrille[i] = parseInt(localStorage.getItem(lsNbMotsGrille + i));
		nbMTrvGrille[i] = parseInt(localStorage.getItem(lsNbMTrvGrille + i));
	}
}
//---------------------------------------------------------------------------
function chargeNbMotsEnOrange()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		nbMotsEnOrange[i] = parseInt(localStorage.getItem(lsNbMotsEnOrange + i));
}
//---------------------------------------------------------------------------
function chargePartie()
{
	var stDebutMsgPartieChargee = 'Une partie est en cours...';
	stMsgPartieChargee = stDebutMsgPartieChargee;
	
	toucheAutorisee = false;

	// sélection : non sauvegardée pour éviter les erreurs de sélection commencée
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	tailleSelection = 0;
	tailleMotMarque = 0;
	numeroMotMarque = indefini;

	// Comptages de mots
	chargeNbMotsGrille();

	// Grille hexagonale
	chargeGrille();

	// Solutions
	chargeSolutions();

	// Dictionnaire de définition
	dicoDef = parseInt(localStorage.ddd); 
	if (localStorage.getItem('acd')) // v1.1
		affichagesChgtDico = parseInt(localStorage.acd);
	else
		affichagesChgtDico = 0;

	// Eléments de partie
	visualisationSolutions = (localStorage.vs == vrai);
	solutionVisualisee = parseInt(localStorage.sv);
	affichageAide = (localStorage.aa == vrai);
	fin = parseInt(localStorage.fin);

	grille = parseInt(localStorage.grille);
	chances = parseInt(localStorage.chances);
	lettresRestantes = parseInt(localStorage.lr);
	
	chargeScoreGrille();

	// Fil Orange
	filOrange = (localStorage.filOrange == vrai);
	nbLettresEnOrange = parseInt(localStorage.nleo);
	stSolutionFilOrange = localStorage.sfo;
	affichageAideFilOrange = (localStorage.aafo == vrai);

	// v1.1
	if (localStorage.getItem('dcfonm')) { // Nouvelles variables donc on test l'existence...
		drnCpFONbMots = parseInt(localStorage.dcfonm);
		drnCpFOScore = parseInt(localStorage.dcfos);
	}
	else {
		drnCpFONbMots = 0;
		drnCpFOScore = 0;
	}

	chargeNbMotsEnOrange();
	chargeScoreOrange();
	chargeSolutionsFilOrange();
	
	// Affichage du jeu
	cacheLettresInutilisees();
	afficheGrille();
	for(var i=tailleMinMot; i<=tailleMaxMot; i++)
		afficheCompteur(i);
	afficheScore();
	if (filOrange) {
		stMsgPartieChargee = stDebutMsgPartieChargee + '\n\nVous êtes dans le Fil Orange de la grille n°'+grille+'.\n\nTouchez "Grille" pour passer le Fil Orange et accéder à la grille suivante.';
		confirmationGrilleDemandee = (localStorage.cgd == vrai); // pour détecter la fin de Fil Orange et créer une nouvelle grille
		montreLettresInutilisees(); 
		if (visualisationSolutions) {
			rafraichitBoutons();
			filOrangeMontreSolution();
			if (solutionVisualisee > indefini)
				stMsgPartieChargee = stDebutMsgPartieChargee + '\n\nVous êtes dans le Fil Orange de la grille n°'+grille+' et vous visualisiez les mots formés.\n\nTouchez ">" pour voir ou terminer de voir les mots formés.';
		}
		else {
			afficheDernierCoupFO(); // v1.3.3
			if (confirmationGrilleDemandee) {
				confirmationGrilleDemandee = false;
				stMsgPartieChargee = stDebutMsgPartieChargee;
				filOrangeTermine();
			}
		}
	}
	else {
		if (visualisationSolutions) {
			rafraichitBoutons();
			montreSolution(suivante);
			stMsgPartieChargee = stDebutMsgPartieChargee + '\n\nVous visualisiez les mots non trouvés de la grille n°'+grille+'.\n\nTouchez "<" et ">" pour continuer la visualisation ou touchez "Grille" pour passer à la suivante...';
		}
	}
	
	partieChargee = true;
	
	toucheAutorisee = true;
}

//---------------------------------------------------------------------------
// Actions Grille
//---------------------------------------------------------------------------
function prepareGrille(nouvelle)
{
	toucheAutorisee = false;

	// Initialisation des données de la grille
	retireMotChoisi();
	affichageMessageGrilleVerdie = false;
	visualisationSolutions = false; 
	confirmationGrilleDemandee = false;
	solutionVisualisee = indefini;
	fin = typeFin.fAucune;
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	if (nouvelle) {
		grille = 1;
		chances = chancesAuDebut;
		scoreGrille.initialise(); // v1.4
		scoreOrange.initialise(); // v1.4
	}
	else {
	    statsEtTops.enregistreStatsGrille();
    	statsEtTops.enregistreTops();
		grille++;
		chances = Math.min(99, chances + Math.max(1, chancesAuDebut - grille + 1)); // Max dû à l'affichage ! 
		scoreGrille.initialise(); // v1.4
		scoreOrange.initialise(); // v1.4
	}

	generePuisAfficheGrille();

	enregistrePartie();
	
	toucheAutorisee = true;
}
//---------------------------------------------------------------------------
function grilleSuivante()
{
	prepareGrille(false);
}
//---------------------------------------------------------------------------
function partieNouvelle()
{
	prepareGrille(true);
}
//---------------------------------------------------------------------------
function stPourcents(index) // retour une chaîne du modèle ' (nn%)' ou vide
{
	const stPrefixe = ' (';
	const stSuffixe = ' %)';
	
	var st = vide;
	
	switch(index) {
		case 113:
		case 114:	if (scoreGrille.scoreMax)
						st = stPrefixe + Math.round((100*scoreGrille.score)/scoreGrille.scoreMax) + stSuffixe;
					break;
		case 119:
		case 120:	if (scoreGrille.bonusMax)
						st = stPrefixe + Math.round((100*scoreGrille.bonus)/scoreGrille.bonusMax) + stSuffixe;
					break;
		case 122:
		case 123:	if (scoreGrille.totalMax())
						st = stPrefixe + Math.round((100*scoreGrille.total())/scoreGrille.totalMax()) + stSuffixe;
					break;
		default:	if (nbMotsGrille[index-101]) {
						var pc = Math.round((100*nbMTrvGrille[index-101])/nbMotsGrille[index-101]);
						st = stPrefixe + pc + ' % trouvé'+((pc>1)?'s)':')');
					}
					break;
	}
	return st;
}
//---------------------------------------------------------------------------
function afficheSablier(affiche) // v1.3.1
{
	if (affiche) {
		imgSrcGrilleSvg = document.images[idGrille].src;
		document.images[idGrille].src = chmPng + sablier + extPng;
	}
	else
		document.images[idGrille].src = imgSrcGrilleSvg;
}
//---------------------------------------------------------------------------
function afficheSolutions() // v1.6 : affichage des solutions avec code triche
{
	var stListeMots = '';
	for(var i=0; i<7; i++) {
		stListeMots = stListeMots + ' (' + (i+5) + ')';
		for(var j=0; j<s[i].length; j++)
			stListeMots = stListeMots + ' ' + s[i][j].stMot;
	}
	alert(stListeMots);
}
//---------------------------------------------------------------------------
function afficheMots(n)// v1.7.4 : affiche la liste des mots trouvés (ou non si fin de grille) en touchant un compteur de mots. Les mots non trouvés sont en minuscules
{
    var listeMots = '';
    var iMax = s[n].length;
    for(var i = 0; i < iMax; i++) {
        if (s[n][i].trouvee) 
			listeMots = listeMots + s[n][i].stMot + ' ';
        else
            if (fin) // Les mots non trouvés sont en minuscules
				listeMots = listeMots + s[n][i].stMot.toLowerCase() + ' ';
    }
    if (listeMots == '')
		listeMots = 'Aucun mot trouvé ';
    return listeMots.substring(0, listeMots.length-1)+'.';
}
//---------------------------------------------------------------------------
// onClick
//---------------------------------------------------------------------------
// index 
// de 0 à 90 	= grille
// de 91 à 98   = lettres inutilisées
// de 99 à 99   = choix du dictionnaire de définition
// de 101 à 107	= compteurs (infos) 
// de 108 à 109	= dernier mot trouvé (infos mot + score)
// de 110 à 112	= boutons (?=Aide %=stats @=Infos)
// de 113 à 114	= score mots (Infos numérateur/dénominateur)
// de 115 à 116	= bouton + N° Grille
// de 117 à 118	= bouton + Nb Chances
// de 119 à 120	= bonus (Infos numérateur/dénominateur)
// de 121 à 123 = total (score partie + score total grille)
//---------------------------------------------------------------------------
function clic(i)
{
	if (!toucheAutorisee) return;
	
	var index = parseInt(i);

	// Si un mot est marqué en rouge, on le cache...
	if (tailleMotMarque&&(numeroMotMarque>indefini)) {
		s[tailleMotMarque-tailleMinMot][numeroMotMarque].majAffichage(false);
			tailleMotMarque = 0;
			numeroMotMarque = indefini;
	}

	if ((!visualisationSolutions) && 
	    (filOrange || (scoreGrille.bonus < scoreGrille.bonusMax)) &&
		(index < nbCases)) {
		if ((xDepart==indefini) && (yDepart==indefini)) {
			if (filOrange && (confirmationGrilleDemandee || h[xClic[index]][yClic[index]].orange))
				return; // On interdit de choisir une lettre orange en mode "Fil Orange" et on empêche de toucher les lettres en fin de Fil Orange (on attend que "Grille" soit touché)
			xDepart = xClic[index];
			yDepart = yClic[index];
			dDepart = typeDir.dIndefinie;
			if ((!filOrange)&&(h[xDepart][yDepart].l==stTriche[triche])) { // v1.6 code triche pour afficher toutes les solutions (hors mode fil orange)
				triche++;
				if (triche==stTriche.length)
					afficheSolutions();
			}
			else
				triche = 0;
			h[xClic[index]][yClic[index]].rouge = true;
			h[xClic[index]][yClic[index]].affiche();
			if (filOrange) {
				if (!affichageAideFilOrange)
					alert('Pour choisir la nouvelle lettre, touchez-en une différente dans la grille ou parmi les lettres autour de la grille.\n\nPour annuler votre choix, touchez à nouveau la lettre (affichée en rouge).'); 
			}
			else
				if (!affichageAide) {
					affichageAide = true;
					localStorage.aa = vrai;
					alert('Pour sélectionner un mot de la grille, touchez sa première lettre (qui apparaît en rouge) puis la dernière.\n\nSi le mot est correct, ses lettres seront verdies et le mot apparaîtra sous les compteurs de mots.\n\nPour annuler votre choix, touchez à nouveau la lettre (affichée en rouge).'); 
				}
		}
		else {
			var xArrivee = xClic[index];
			var yArrivee = yClic[index];
			if ((!filOrange)&&(h[xArrivee][yArrivee].l==stTriche[triche])) { // v1.6 code triche pour afficher toutes les solutions (hors mode fil orange)
				triche++;
				if (triche==stTriche.length)
					afficheSolutions();
			}
			else
				triche = 0;
			if (filOrange && 
				((xArrivee != xDepart) || (yArrivee != yDepart)) && 
				(h[xDepart][yDepart].l == h[xArrivee][yArrivee].l)) {
				// Même lettre ! On fait comme si l'on avait rien vu...
				xArrivee = indefini;
				yArrivee = indefini;
				return;
			}
			// On commence par éteindre la lumière rouge...
			h[xDepart][yDepart].rouge = non;
			h[xDepart][yDepart].affiche();
			// 1. Départ = Arrivée ?
			if ((xArrivee == xDepart) && (yArrivee == yDepart)) {
				// ...alors on annule le choix
				xDepart = indefini;
				yDepart = indefini;
				dDepart = typeDir.dIndefinie;
				return;
			}
			
			if (filOrange&&(!confirmationGrilleDemandee)) {
				lettreOrangeRemplacee = h[xDepart][yDepart].l;
				h[xDepart][yDepart].l = h[xArrivee][yArrivee].l; 
				if (filOrangeEvalue()) {
					montreLettresInutilisees(); // Il se peut que les lettres inutilisées aient changé !
					visualisationSolutions = true;
					rafraichitBoutons();
					solutionVisualisee = indefini;
					localStorage.vs = vrai; localStorage.sv = indefini; // enregistrement auto
					filOrangeMontreSolution();
				}
			}
			else {
				// 2. Direction valide ?
				if ((dDepart = direction(xDepart,yDepart,xArrivee,yArrivee)) &&
					((tailleSelection = distance(xDepart,yDepart,xArrivee,yArrivee)) >= tailleMinMot)) {
					var stMot = vide;
					for(var k=0; k<tailleSelection; k++)
						stMot = stMot + h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].l;
					h[xDepart+dx[dDepart]][yDepart+dy[dDepart]].rouge = non;
					h[xDepart+dx[dDepart]][yDepart+dy[dDepart]].affiche();
					if (dico[tailleSelection-tailleMinMot].indexOf(stMot) > -1) {
						if (!marqueSolution(xDepart, yDepart, dDepart, tailleSelection, stMot)) {
							afficheMotChoisi();
							nbMTrvGrille[tailleSelection-tailleMinMot]++;
							afficheNumerateurCompteur(tailleSelection);
							for(var k=0; k<tailleSelection; k++) 
								if (!h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].vert) {
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].vert = true;
									lettresRestantes--; 
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].enregistre(); // enregistrement auto
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].affiche();
								}
							scoreGrille.score += scoreMot[dDepart][tailleSelection-tailleMinMot];
							afficheScore(idScore);
							if (nbMTrvGrille[tailleSelection-tailleMinMot] == nbMotsGrille[tailleSelection-tailleMinMot]) {
								// Bonus de mots de la même taille TOUS trouvés
								scoreGrille.bonus += (12 - tailleSelection)*nbMotsGrille[tailleSelection-tailleMinMot];
								// Si mots de la grille tous trouvés bonus doublé
								if (scoreGrille.bonus == scoreGrille.bonusMax / 2) 
									scoreGrille.bonus *= 2;
								afficheScore(idBonus);
							}
							afficheScore(idTotal);
							afficheScore(idPartie);	
							
							// enregistrement auto
							localStorage.setItem(lsNbMTrvGrille+(tailleSelection-tailleMinMot), nbMTrvGrille[tailleSelection-tailleMinMot]);
							localStorage.lr = lettresRestantes;	
							scoreGrille.enregistre(grille);
							// v1.3.3 : code ci-dessous déplacé ici pour éviter d'afficher les messages si partie reprise alors que la grille est déjà verdie et qu'un mot a déjà été trouvé
							if (scoreGrille.bonus == scoreGrille.bonusMax) {
								changeEtatGrille(cptVert);
								alert('Fantastique !\n\nVous avez trouvé tous les mots de la grille !\nVous doublez votre bonus !\n\nTouchez "Grille" pour passer au Fil Orange.');
							}
							else if ((!lettresRestantes) && (!affichageMessageGrilleVerdie)) {
								affichageMessageGrilleVerdie = true;
								changeEtatGrille(cptVert);
								alert('Bravo !\n\nVous avez verdi toute la grille !\n\nVous pouvez néanmoins continuer à trouver les autres mots de la grille pour empocher les bonus.\n\nTouchez "Grille" pour passer au Fil Orange.');
							}
						}
					}
					else { // /!\ Déduction d'une chance ici
						if (chances) {
							chances--;
							localStorage.chances = chances; // enregistrement auto
							afficheNombreChances();
							if (chances) 
								alert('Le mot "'+stMot+'" n\'existe pas.\n\nIl vous reste encore '+chances+' chance'+((chances>1)?'s ':' ')+'de vous tromper...');
							else
								alert('Le mot "'+stMot+'" n\'existe pas.\n\nATTENTION, vous n\'avez désormais plus droit à l\'erreur !');
						}
						else
							finPartie('Le mot "'+stMot+'" n\'existe pas.\n\nVous avez utilisé toutes vos chances !\nLa partie est terminée.\n\n');
					}
					xDepart = indefini;
					yDepart = indefini;
					dDepart = typeDir.dIndefinie;
				}
				else { // Arrivée = Départ
					xDepart = xArrivee;
					yDepart = yArrivee;
					dDepart = typeDir.dIndefinie;
					h[xClic[index]][yClic[index]].rouge = true;
					h[xClic[index]][yClic[index]].affiche();
				}
			}
		}
	}
	else if ((index > 90) && (index < 99) && 
			 filOrange &&
			 (!confirmationGrilleDemandee) &&
			 (xDepart > indefini) &&
			 (yDepart > indefini) &&
			 (!visualisationSolutions)) { // On choisit une lettre inutilisée
		lettreOrangeRemplacee = h[xDepart][yDepart].l;
		var id = 'l'+(index%10);
		var nvLettre = document.images[id].src.substr(document.images[id].src.length-6,1);
		if (lettreOrangeRemplacee != nvLettre) { // Il faut quand même vérifier que ce n'est pas la même lettre !
			h[xDepart][yDepart].l = nvLettre; 
			if (filOrangeEvalue()) {
				montreLettresInutilisees(); // Il se peut que les lettres inutilisées aient changé !
				visualisationSolutions = true;
				rafraichitBoutons();
				solutionVisualisee = indefini;
				localStorage.vs = vrai; localStorage.sv = indefini; // enregistrement auto
				filOrangeMontreSolution();
			}
		}
	}
	else if ((index == 99) && 
			 (document.images[idPrmDico].src[document.images[idPrmDico].src.length-5][0] != fond[0])) { // v1.1 : caractère '-' raté... C'était le '.' !
		dicoDef = (dicoDef + 1) % nbDicosDef; // Changement du dictionnaire de définitions
		localStorage.ddd = dicoDef;
		document.images[idPrmDico].src = chmPng + pngDico[dicoDef] + extPng; 
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDrnMotForme;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM; // v1.4.1 - .toLowerCase()
		if (affichagesChgtDico < nbDicosDef) { // v1.1
			alert('Vous changez de dictionnaire de définitions pour...\n\n' + nomDico[dicoDef] + '\n\nQuand un mot est affiché à gauche du livre ouvert, touchez "?" pour accéder à la définition sur le site choisi ci-dessus.'); 
			affichagesChgtDico++;
			localStorage.acd = affichagesChgtDico;
		}
	}
	else if ((index > 100) && (index < 108) /* && // v1.7.4 : On permet d'afficher la liste des mots même quand on a fini ou que l'on a trouvé tous les mots  
			 (!visualisationSolutions) && 
	    	 (scoreGrille.bonus < scoreGrille.bonusMax) */ ) // Infos compteurs
	    if (filOrange)
	    	alert('En orange, il s\'agit du nombre de mots de '+(index-96)+' lettres formés durant le Fil Orange.\n\nEn gris foncé, il s\'agit du nombre de mots de '+(index-96)+' lettres qu\'il fallait trouver avant le Fil Orange.');
		else
			// v1.7.4 : on affiche les mots trouvés (et non trouvé en fin de grille/partie) + suppression du texte explicatif sur la couleur
			alert('Il s\'agit du nombre de mots de '+(index-96)+' lettres trouvés par rapport au nombre total de mots de '+(index-96)+' lettres à trouver'+stPourcents(index)+'.\n\nVoici la liste des mots : '+afficheMots(index-96-tailleMinMot)); 
	else if (index < 124) { // Autres...
		switch(index) {
			case 108: 	if (filOrange) { // v1.2 : aide sur les infos du dernier coup du Fil Orange
							if (document.images['mlA'].src[document.images['mlA'].src.length-8][0]=='m')
								alert('Ces informations concernent le dernier coup du Fil Orange : le nombre de mots formés, le score obtenu et le meilleur score.'); 
						}
						else
							if (document.images[idFinMot].src[document.images[idFinMot].src.length-5][0] != fond[0]) // v1.1 : on affiche l'aide que si un mot est affiché
								alert('Il s\'agit du dernier mot trouvé dans la grille. Les couleurs reflètent l\'état des lettres AVANT la découverte du mot.'); 
						break;
			case 109: 	if (document.images[idFinScore].src[document.images[idFinScore].src.length-5][0] != fond[0]) // v1.1 : on affiche l'aide que si un mot est affiché (et donc son score)
							alert('Il s\'agit du score obtenu pour avoir trouvé le mot affiché à gauche. Le score dépend de l\'orientation et du nombre de lettres.'); 
						break;
			case 110:	if (visualisationSolutions&&(!filOrange)) // Pas de bouton "précédent" en mode Fil Orange car on comptabilise en temps réel
							montreSolution(precedente);
						else { // v1.4 inversé entre 110 et 112
							var n=0; // v1.7 : on compte vraiment les mots
							for(var i=0; i<dico.length; i++)
								n+=dico[i].length;
							alert('À propos d\'Osmotissimax\n\nWebApp version '+stVersion+'\nCréé par Patrice Fouquet\nDico : '+n+' mots (ODS'+stVerDico+')\n\nUn duel avec OsmotissimoDuo ?\n\nosmotissimax@patquoi.fr\npatquoi.fr/Osmotissimax.html');
						}
						break;
			case 111:	if (visualisationSolutions)
							if (filOrange&&(!confirmationGrilleDemandee))
								filOrangeMontreSolution();
							else
								montreSolution(suivante);
						else // v1.4 inversé entre 110 et 112
							afficheAidePrincipale(); 
						break;
			case 112:	if (filOrange)
							statsEtTops.afficheFO();
						else
							statsEtTops.affiche();							
						break;
			case 113:	if (filOrange)
							alert('Il s\'agit du score des points cumulés des mots formés dans la grille durant le "Fil Orange".');
						else 
							alert('Il s\'agit du score des points cumulés des mots découverts dans la grille courante.'); // v1.6 : on n'affiche plus les (%)
						break;
			case 114:	if (filOrange)
							alert('Il s\'agit de la proportion du score Fil Orange par rapport au score maximal possible si tous les mots de la grille avaient été découverts avant le Fil Orange  ('+scoreGrille.scoreMax+').'); // v1.6 : % à la place de max
						else
							alert('Il s\'agit de la proportion du score par rapport au score maximal possible si tous les mots de la grille sont découverts ('+scoreGrille.scoreMax+').'); // v1.6 : % à la place de max
						break;
			case 115:	// Bouton "Grille"
						if (visualisationSolutions)
							if (!filOrange) { // "Grille" n'est pas fonctionnel en mode visualisation du Fil Orange car décompte des points à l'affichage des solutions 
								if (solutionVisualisee>indefini) {
									var taille = solutionVisualisee % 10;
									var numero = Math.floor(solutionVisualisee / 10);
									s[taille][numero].majAffichage(non);
								}
								visualisationSolutions = false;
								solutionVisualisee = indefini;
								confirmationGrilleDemandee = false;
								localStorage.vs = faux; localStorage.sv = indefini; localStorage.cgd = faux; // enregistrement auto
								rafraichitBoutons();
								afficheSablier(true); // v1.3.1
        						setTimeout(function() { // v1.3.1
									if (fin == typeFin.fGrille)
										filOrangeCommence();
									else
										partieNouvelle();
                   					afficheSablier(false); // v1.3.1
                   				}, 500); // v1.3.1

							}
							else
								alert('Pendant le Fil Orange, le bouton "Grille" permet de passer à la grille suivante mais pas pendant la visualisation des mots formés.');
						else {
							if (filOrange) {
								if (confirmationGrilleDemandee) {
									confirmationGrilleDemandee = false;
									afficheSablier(true); // v1.3.1
    	    						setTimeout(function() { // v1.3.1
										filOrangeTermine();
           	        					afficheSablier(false); // v1.3.1
             	      				}, 500); // v1.3.1
								}
								else {
									confirmationGrilleDemandee = true;
									localStorage.cgd = vrai; // enregistrement de fin de Fil Orange
									// On enregistre stats & tops Fil Orange. v1.1 (oubli)
									statsEtTops.enregistreStatsFOGrille(); 
							    	statsEtTops.enregistreTopsFO(); 
							    	
									alert('Vous avez choisi d\'abandonner le Fil Orange.\n\n'+stSolutionFilOrange+'\n\nPour passer à la suite, touchez à nouveau "Grille"...');
								}
							}
							else {
								if (!lettresRestantes) // Grille verdie ("Grille" en vert) : on peut passer à la grille suivante.
									if (scoreGrille.bonus == scoreGrille.bonusMax) { // Plus de mots restants, on passe directement à la grille suivante...
										confirmationGrilleDemandee = false;
										localStorage.cgd = faux;
										afficheSablier(true); // v1.3.1
    	    							setTimeout(function() { // v1.3.1
											filOrangeCommence();
 	          	        					afficheSablier(false); // v1.3.1
    	         	      				}, 500); // v1.3.1
									}
									else 
										if (confirmationGrilleDemandee) {
											confirmationGrilleDemandee = false;
											afficheSablier(true); // v1.3.1
    	    								setTimeout(function() { // v1.3.1
												finGrille();
 	      	    	        					afficheSablier(false); // v1.3.1
    	    	     	      				}, 500); // v1.3.1
										}
										else {
											confirmationGrilleDemandee = true;
											alert('Vous avez verdi toute la grille et vous pouvez passer au Fil Orange.\n\nVeuillez confirmer votre choix en touchant à nouveau "Grille".');
										}
								else // Grille non verdie ("Grille" en rouge) : on souhaite abandonner la partie et jouer une nouvelle partie.
									if (confirmationGrilleDemandee) {
										confirmationGrilleDemandee = false;
										afficheSablier(true); // v1.3.1
    	    							setTimeout(function() { // v1.3.1
											finPartie();
 	      	  		    	  				afficheSablier(false); // v1.3.1
    	    	  	      				}, 500); // v1.3.1
									}
									else {
										confirmationGrilleDemandee = true;
										alert('Vous avez demandé à abandonner la partie et en recommencer une nouvelle.\n\nVeuillez confirmer que vous souhaitez vraiment abandonner la partie en cours en touchant à nouveau "Grille".');
									}
							}
						}
						break;
			case 116:	alert('Il s\'agit du numéro de la grille courante.\n\nLa première grille porte le numéro 01.');
						break;
			case 117:	if (filOrange)
							alert('La couleur orange de l\'indicateur de "Chances" indique que vous êtes en mode "Fil Orange" dans lequel vous ne pouvez pas perdre de chance !');
						else
							alert('La couleur verte de l\'indicateur de "Chances" indique qu\'il vous reste au moins une chance de vous tromper.\n\nLe rouge indique que vous n\'avez plus droit à l\'erreur.');
						break;
			case 118:	if (filOrange)
							alert('Il s\'agit du nombre de chances qu\'il vous reste de vous tromper.\n\nEn mode "Fil Orange", vous ne pouvez pas perdre de chance.');
						else
							alert('Il s\'agit du nombre de chances qu\'il vous reste de vous tromper.\n\nSi le compteur est à zéro, vous n\'avez plus droit à l\'erreur.');
						break;
			case 119:	if (filOrange)
							alert('Il s\'agit du bonus accordé (score doublé) pour avoir ocré toute la grille en mode "Fil Orange".');
						else 
							alert('Il s\'agit du bonus accordé pour avoir trouvé tous les mots de la grille : un bonus par taille + un bonus pour toute la grille.'); // v1.6 : on n'affiche plus les (%)
						break;
			case 120:	if (filOrange)
							alert('Il s\'agit de la proportion du bonus du Fil Orange par rapport au bonus maximal possible avant le Fil Orange ('+scoreGrille.bonusMax+').'); // v1.6 : % à la place de max
						else
							alert('Il s\'agit de la proportion du bonus par rapport au bonus maximal possible ('+scoreGrille.bonusMax+').'); // v1.6 : % à la place de max
						break;
			case 121:	alert('Il s\'agit du score de la partie : cumul des scores et bonus de la grille courante et des grilles précédentes.');
						break;
			case 122:	if (filOrange)
							alert('Il s\'agit du score total du Fil Orange : score + bonus.');
						else
							alert('Il s\'agit du score de la grille courante : scores des mots + bonus.'); // v1.6 : on n'affiche plus les (%)
						break;
			case 123:	if (filOrange)
							alert('Il s\'agit de la proportion du score par rapport au score maximal possible avant le Fil Orange : score des mots + bonus ('+scoreGrille.totalMax()+').'); // v1.6 : % à la place de max
						else
							alert('Il s\'agit de la proportion du score par rapport au score maximal possible de la grille courante : score des mots + bonus ('+scoreGrille.totalMax()+').'); // v1.6 : % à la place de max
						break;
			default:	break;
		}
	}
	if (index!=112) // v1.2.1 : Sortie de la boucle
		statutStatsEtTops = typeStatutStatsEtTops.ssetTops; // v1.2.1 ordre inversé stats et tops
	if (confirmationGrilleDemandee &&
	    (!filOrange) && // Utilisation spéciale de confirmationGrilleDemandee en mode Fil Orange (oblige à toucher "Grille" pour passer à la suivante).
		(index != 115) && // Si "Grille" pas touché et...
		(scoreGrille.bonus < scoreGrille.bonusMax)) // Pas trouvé tous les mots (car touche "Grille" demandé)
		confirmationGrilleDemandee = false; // ALORS Demande "Grille" annulée
}
//---------------------------------------------------------------------------
// Bienvenue !
//---------------------------------------------------------------------------
function chargeJeu()
{
	creeGrille(); // Une seule fois
	retireMotChoisi();
	if (localStorage.getItem('scg0s')) { // v1.4 : on sacrifie la partie en cours en cas de mise à jour de la v1.4 :(
		localStorage.removeItem('scg0s');
		partieNouvelle();
	}
	else 
		if (localStorage.getItem(lsGrille)) 
			chargePartie();
		else
			partieNouvelle();
}
//---------------------------------------------------------------------------
function bienvenue()
{
	if (partieChargee)
		alert(stMsgPartieChargee);
	else
		afficheAidePrincipale();
}
//---------------------------------------------------------------------------
