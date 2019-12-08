 /*
 
 Fichier: OsmotissimoDuo.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.4>
 
 Copyright (C) 2012 Patrice Fouquet.
 
 */ 

/******************************************
Origine du code : Osmotissimax
Code propre à OsmotissimoDuo, voir rq "vDuo"
*******************************************/

/*
Version 1.1
 - Boutons (i) et ? inversés.
Version 1.1.1
 - Correction du lien vers 1mot.fr
Version 1.2
 - Optimisation de vitesse dans la création d'une grille
Version 1.3
 - ODS7: ajout de 5068 mots. On compte le nombre de mots en temps réel.
Version 1.4
 - ODS8
*/

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.4';

const stVerDico = '8';

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------
const joueurs = 2; // vDuo !

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
// Score: mot de  5, 6, 7, 8, 9,10,11 lettres  (fil orange : score RETOURNE !)
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

const chancesAuDebut=  2; // vDuo : chances = 2 x joueurs = 4 consécutives

const nbMaxAbsentes	= 8;
const nbLignes		= 11;
const nbCases		= 91;

const charCodeMin   = 64;

const nbMots		= new Array (7645, 17318, 31070, 46329, 57467, 60487, 55436); 

const typeCouleur	= new creeTypeCouleur();
const typeJoueur	= new creeTypeJoueur();
const typeFin		= new creeTypeFin();
const typeScore		= new creeTypeScore();

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// Couleurs
// 0=gris, 1=vert, 2=orange, 3=rouge
const stCoul          	 = 'gvor';

// Directions
const stDir        		 = ['NA','0H','2H','4H','6H','8H','10H'];
const stJokers			 = ['?????','??????','???????','????????','?????????','??????????','???????????'];
const stCoulJoueur		 = ['', 'Vert', 'Orange'];

// ID (IMG)
const idLettre			 = 'l';  // id de lettre = "lXY" où X,Y = 'A'~'K'
const idCoteNS			 = 'n';  // id du côté Nord-Sud (montant) = "mXXY" où X,Y = 'A'~'K' (XX = transition croissante des X)
const idCoteSN			 = 's';  // id du côté Nord-Sud (descendant) = "mXYY" où X,Y = 'A'~'K' (YY = transition croissante des Y)
const idBordGN			 = 'gn'; // id du bord Gauche Nord = "gnX" où X = 'A'~'K'
const idBordGS			 = 'gs'; // id du bord Gauche Nord = "gsY" où Y = 'A'~'K'
const idBordDN			 = 'dn'; // id du bord Gauche Nord = "dnY" où Y = 'A'~'K'
const idBordDS			 = 'ds'; // id du bord Gauche Nord = "dsX" où X = 'A'~'K'
const idXY				 = 'ABCDEFGHIJK';
const idCptSep			 = 'cs';
const idChance			 = 'chance';
const idBtnGauche		 = 'btn1';
const idBtnDroite		 = 'btn2';
const idJoueurCrt		 = ['','vert','orge'];
// Id de scores
const idScore			 = 'gslm'; // vDuo : remplace idScore+idBonus+idTotal+idPartie
const idFinMot           = 'msf'; 
const idFinScore		 = 'mpu';
const idBtnGrille		 = 'gb';
const idGrille			 = 'gn';
const idManche			 = 'gm';

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
const chiffreScore		 = 'udcmp'; // p = indicateur de vainqueur (pouce levé/baissé)
const coulJoueur		 = 'gvo'; // vDuo
const cptRouge			 = 'r'; // vDuo
const cptGris			 = 'g'; // vDuo
const cptBlanc			 = 'b'; // vDuo
const cptSep			 = '-';
const motGris			 = 'g';
const motJoueur			 = 'gvo'; // vDuo : remplace motVert et motGris (si non .vert)
const cotesNS		 	 = 'cngsg';
const cotesSN		 	 = 'csgng';
const prmDico			 = 'dico';
const hrefDef			 = 'def';
const sfxCoupFO          = 'c'; 

// Diverses chaînes
const stLettre           = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const espace             = ' ';
const joker				 = '?';
const vide				 = '';
const pluriel			 = 's';
const unite            	 = 'u';
const dizaine     	 	 = 'd';

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


// ID clic
const clicGrille		= 100;
const clicPourcent		= 112;

// localStorage
const lsTops 			= 'tops'; 
const lsTopsFO			= 'topsFO';
const lsTopsFOCoup		= 'topsFOCoup'; 
const lsStatsGrille 	= 'statsGrille';
const lsStatsFOGrille 	= 'statsFOGrille';
const lsStatsFOCoup     = 'statsFOCoup';
const lsCase			= 'h';
const lsGrille			= 'grille';
const lsGrilles			= 'grilles';
const lsChances			= 'chances'
const lsSolutions		= 'sol';
const lsSolFilOrange    = 'sfo';
const lsScoreGrille     = 'scg';
const lsScoreOrange     = 'sco';
const lsAttrSolutions   = 'xydmt'; 
const lsAttrCases       = 'ljr'; // vDuo : .joueur (j) remplace .orange et .vert (vo)
const lsAttrScores      = ['sm','mm','s','l','m'];
const lsNbMotsGrille    = 'nbmg';
const lsNbMTrvGrille    = 'nmtg';
const lsNbMotsEnOrange  = 'nmeo';

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

// joueurs
var joueur = 0; // 0 = personne; 1 = vert; 2 = orange

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

var nbMotsGrille = [0,0,0,0,0,0,0];  // Constants à la création de la grille. ls=fait 
var nbMTrvGrille = [[0,0,0,0,0,0,0], // nbMTrvGrille[vert+orange]. 
					[0,0,0,0,0,0,0], // NbMTrvGrille[vert]
					[0,0,0,0,0,0,0]];// NbMTrvGrille[orange]

// Grille hexagonale
var h = []; // ls=fait

// Solutions
var s = [[],[],[],[],[],[],[]]; // constants à la création de grille : ls=OK

// Dictionnaire de définition
var dicoDef = 0; // Par défaut = cnrtl. ls=fait
var stDrnMotForme = vide; // Permet d'afficher sa définition (non sauvegardé)
var affichagesChgtDico = 0; // Nombre d'affichages de changement de dico (limité au nombre de dicos). 

// Eléments de partie
var visualisationSolutions = false; // si true affichage en cours des solutions non trouvées. ls=fait
var confirmationGrilleDemandee = false; // Permet de toucher DEUX FOIS "Grille" 
var demandeToucheGrille = false; // vDuo. Demande de toucher "Grille" pour passer à la suite (nouvelle manche/grille). Permet de différencier de l'abandon de partie (DEUX fois "Grille")
var solutionVisualisee = indefini; // affichage de s[solutionVisualisee%10][Math.floor(solutionVisualisee/10)]. ls=fait
var affichageMsgGrilleColoree = false; // Pour ne l'afficher qu'une fois par session (non sauvegardé). vDuo : coloree au lieu de Verdie
var affichageMsgSolutionsFilOrange = true; // Pour n'afficher qu'une fois comment on affiche les solutions du fil orange (vDuo). ls=fait
var affichageMsgRejouerFilOrange = false; // vDuo. Pour afficher "Rejouer" quand on a choisi une lettre autour de la grille en mode Fil Orange. ls=fait.
var affichageAide = false; // Pour ne l'afficher qu'une fois. ls=fait

var meneur = 0; // Joueur qui mène la grille courante (0 = personne) : ls=OK
var grille = 0; // numéro. La première c'est 1. constants à la création de grille : ls=OK
var grilles = [0,0,0]; // Nombre de grilles gagnées (grilles[0] = grilles remportées par personne)
var chances = [4,2,2]; // joueur vert et orange. Usage : chances[joueur]. chances[0] et la somme des chances
var lettresRestantes = nbCases; // Nombre de lettres grises. ls=fait 
// Usage = scoreGrille.{score|mots|lettres}[joueur]
//         scoreGrille.{scoreMax|motsMax}
// ls=fait
var scoreGrille = []; // score des grilles successives hors fil orange

// stats & tops (sauvegardés séparément)
var statsEtTops        = new chargeStatsEtTops();
var statutStatsEtTops  = typeStatutStatsEtTops.ssetTops; // non sauvegardé. 

// Fil Orange
var filOrange = false; // Mode "fil orange" (= deuxième manche d'une grille) : changement de lettre dans la grille pour former des mots. ls=fait
var continuerFilOrange = true; // Indique si le fil orange peut continuer (détection de fin de fil orange)
var nbLettresEnOrange = 0; // Compteur de lettres colorées pour détecter la grille toute orange. ls=fait
var stSolutionFilOrange = vide; // ls=fait
var lettreOrangeRemplacee = joker; // Lettre remplacée en xDepart, yDepart en mode "fil orange" (non sauvegardé)
var nbMTrvGrilleFO =[[0,0,0,0,0,0,0], // nbMTrvGrilleFO[vert+orange]. ls=fait.
					 [0,0,0,0,0,0,0], // nbMTrvGrilleFO[vert]
					 [0,0,0,0,0,0,0]];// nbMTrvGrilleFO[orange]
var scoreGrilleFO = []; // comme scoreGrille mais en mode "fil orange". ls=fait
var affichageAideFilOrange = false; // Pour ne l'afficher qu'une fois. ls=fait
var sfo = [[],[],[],[],[],[],[]]; // Solutions de la dernière proposition du Fil Orange. ls=fait

// stats dernier coup FO (sauvegardés pour affichage éventuel).
var drnCpFONbMots = 0; // Nb mots formés lors du dernier coup. ls=fait
var drnCpFOScore  = 0; // Score du dernier coup. ls=fait

// Mode partie chargée
var partieChargee = false; // Indique si une partie a été chargée (non sauvegardé)
var stMsgPartieChargee = vide; // Msg à afficher après le chargement d'une partie (non sauvegardé)
var affichageMsgJoueurSuivant = false; // Msg affiché une seule fois. ls=fait

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
function creeTypeCouleur()
{
    this.cGrise = 0;
    this.cVerte = 1;
    this.cOrange = 2;
    this.cRouge = 3;
}
//---------------------------------------------------------------------------
function creeTypeJoueur() // vDuo : .joueur remplace .orange et .vert qui sont maintenant au même niveau
{
	this.jIndefini	= 0;
	this.jVert		= 1;
	this.jOrange	= 2;
}
//---------------------------------------------------------------------------
function creeTypeFin()
{
    this.fAucune = 0;
    this.fGrille = 1;
    this.fPartie = 2;
}
//---------------------------------------------------------------------------
function creeTypeScore() // vDuo
{
	this.sGrilles = 0;
	this.sScore	  = 1;
	this.sLettres = 2;
	this.sMots	  = 3;
}
//---------------------------------------------------------------------------
function creeTypeStatutStatsEtTops()
{
    this.ssetTops  = 0; 
    this.ssetStats = 1; 
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
			s[i][j].enregistre(i, j); 
			solutionTrouvee = true;
			if (dejaTrouvee) {
				s[i][j].majAffichage(true);
				tailleMotMarque = t;
				numeroMotMarque = j;
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
			if (!h[x][y].joueur) { // vDuo : .joueur remplace .orange
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
						//console.log('Fil orange POSSIBLE: Score='+score+' avec '+String.fromCharCode(l)+' en ('+x+','+y+').');
						return true;
					}
				}
				h[x][y].l = origine;
			}
	//console.log('Fil orange IMPOSSIBLE !');
	return false;
}
//---------------------------------------------------------------------------
function decoloreGrille()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].decolore();
}
//---------------------------------------------------------------------------
function filOrangeCommence()
{
	filOrange = true;
	continuerFilOrange = true;
	afficheNumeroGrilleEtManche(); // vDuo
	chances = [2,1,1]; // On réinitialise les chances à la moitié de celles de la première manche
	for(var j=0; j<=joueurs; j++) // vDuo
		localStorage.setItem(lsChances+j, chances[j]);
	afficheChances(); // vDuo
	decoloreGrille(); 
	montreLettresInutilisees(); 
	nbLettresEnOrange = 0;
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	for(var i=tailleMinMot; i<=tailleMaxMot; i++)
		afficheCompteur(i);
	enregistrePartie();
	if ((grille == 1) && (!affichageAideFilOrange)) // On explique la première fois
		afficheAidePrincipale();
	else
		alert('Bienvenue dans la deuxième manche !\n\nElle se termine et vous passez automatiquement à la grille suivante si toute la grille est colorée, si plus aucun coup n\'est possible ou si vous faites à la suite chacun une erreur.');
}
//---------------------------------------------------------------------------
function filOrangeTermine()
{
	// On efface les lettres des mots trouvés dans le fil orange
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			if (h[x][y].joueur) {
				h[x][y].joueur = typeJoueur.jIndefini;
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
	grilleSuivante();
}
//---------------------------------------------------------------------------
function filOrangeEvalue() // retourne true si au moins un mot d'au moins 5 lettres est formé
{
	var choixOK = false;
	
	// Initialisation des compteurs
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		sfo[i].length = 0;

	// initialisation des données du dernier coup
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
					drnCpFONbMots++; // infos dernier coup
					drnCpFOScore+=scoreMto[d][t-tailleMinMot]; // infos dernier coup
					localStorage.dcfonm = drnCpFONbMots;
					localStorage.dcfos = drnCpFOScore;
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
	}
	else {
		statsEtTops.enregistreCoupFO(); // /!\ enregistre également les variables drnCp*
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

	if (choixOK && affichageMsgSolutionsFilOrange) { // Si ChoixKO, le message est affiché en fonction du reste de chances
		alert('Les mots formés sont affichés en rouge.\n\nTouchez ">" pour passer au mot suivant ou pour passer au joueur suivant.');
		// on met affichageMsgSolutionsFilOrange à false que quand on aura affiché le joueur suivant
	}
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
	this.joueur = typeJoueur.jIndefini; // vDuo. Remplace this.orange et this.vert
	this.rouge = non; // visualisation d'un mot en rouge (prioritaire sur couleur joueur)
	// Méthodes
	this.initialise = caseInitialise; // Remet tout à zéro
	this.couleur = caseCouleur; // donne la couleur
	this.affiche = caseAffiche; // affiche l'hexagone avec couleur et lettre  
	this.decolore = caseDecolore; // vDuo : décolore la grille avant le début du fil orange
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
	this.joueur = typeJoueur.jIndefini; // vDuo : .joueur remplace .orange et .vert
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
function creeScoreGrille()
{
	this.scoreMax 	= 0;
	this.motsMax 	= 0;
	this.score 		= [0,0,0];
	this.lettres	= [0,0,0];
	this.mots		= [0,0,0]; 

	// Méthodes
	this.enregistre = scoreGrilleEnregistre;
	this.raz		= scoreGrilleRAZ; // vDuo
	// this.charge = scoreGrilleCharge; // constructeur
}
//---------------------------------------------------------------------------
function creeScoreGrilleFO()
{
	this.score	= [0,0,0]; 
	this.lettres= [0,0,0];
	this.mots	= [0,0,0];

	// Méthodes
	this.enregistre = scoreGrilleFOEnregistre;
	this.raz		= scoreGrilleFORAZ; // vDuo
	// this.charge = scoreGrilleFOCharge; // constructeur
}
//---------------------------------------------------------------------------
function chargeStatsEtTops()
{
    // méthodes
    this.enregistreTops = statsEtTopsEnregistreTops;
    this.enregistreTopsFO = statsEtTopsEnregistreTopsFO;

    this.enregistreStatsGrille = statsEtTopsEnregistreStatsGrille;
    this.enregistreStatsFOGrille = statsEtTopsEnregistreStatsFOGrille;
    
    this.enregistreCoupFO = statsEtTopsEnregistreCoupFO; // stats & tops

    this.affiche = statsEtTopsAffiche;
    this.afficheFO = statsEtTopsAfficheFO;
    this.reinitialise = statsEtTopsReinitialise;

    // propriétés
    if (localStorage.getItem(lsTops)) {
        this.topGrilleScore       = parseInt(localStorage.topGrilleScore);
        this.topGrilleMaxScore    = parseInt(localStorage.topGrilleMaxScore);
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
        
        this.topGrille      	  = parseInt(localStorage.topGrille);
    }
    else {
        this.topGrilleScore       = 0;
        this.topGrilleMaxScore    = 0;
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

        this.topGrille      	  = 0;
    }

    if (localStorage.getItem(lsTopsFO)) {
        this.topGrilleScoreFO     = parseInt(localStorage.topGrilleScoreFO);
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
        this.topGrilleMots5LFO    = 0;
        this.topGrilleMots6LFO    = 0;
        this.topGrilleMots7LFO    = 0;
        this.topGrilleMots8LFO    = 0;
        this.topGrilleMots9LFO    = 0;
        this.topGrilleMots10LFO   = 0;
        this.topGrilleMots11LFO   = 0;
    }

    if (localStorage.getItem(lsTopsFOCoup)) { 
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
        this.statGrilleMaxScore    = parseInt(localStorage.statGrilleMaxScore);
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
        this.statGrilleMaxScore    = 0;
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

    if (localStorage.getItem(lsStatsFOGrille) && localStorage.getItem('statGrillesFO')) { 
    	this.statGrillesFO         = parseInt(localStorage.statGrillesFO);
        this.statGrilleScoreFO     = parseInt(localStorage.statGrilleScoreFO);
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
        this.statGrilleMots5LFO    = 0;
        this.statGrilleMots6LFO    = 0;
        this.statGrilleMots7LFO    = 0;
        this.statGrilleMots8LFO    = 0;
        this.statGrilleMots9LFO    = 0;
        this.statGrilleMots10LFO   = 0;
        this.statGrilleMots11LFO   = 0;
    }

    if (localStorage.getItem(lsStatsFOCoup)) { 
    	this.statCoupsFO = parseInt(localStorage.statCoupsFO);
        this.statCoupFOScore = parseInt(localStorage.statCoupFOScore);
        this.statCoupFONbMots = parseInt(localStorage.statCoupFONbMots);
    }
    else {
    	this.statCoupsFO      = 0;
        this.statCoupFOScore  = 0;
        this.statCoupFONbMots = 0;
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
	this.topGrilleScoreFO     = 0;
	this.topGrilleMaxScore    = 0;
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
	this.topGrille      	  = 0;

    this.topCoupFOScore       = 0; 
    this.topCoupFONbMots      = 0; 

	this.statGrilles          = 0;
	this.statGrillesFO		  = 0;
	this.statGrilleScore      = 0;
	this.statGrilleScoreFO    = 0;
	this.statGrilleMaxScore   = 0;
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

	this.statCoupsFO          = 0; 
    this.statCoupFOScore      = 0; 
    this.statCoupFONbMots     = 0; 

    localStorage.removeItem(lsTops);
    localStorage.removeItem(lsTopsFO); 
    localStorage.removeItem(lsTopsFOCoup); 
    localStorage.removeItem(lsStatsGrille);
    localStorage.removeItem(lsStatsFOGrille); 
    localStorage.removeItem(lsStatsFOCoup); 

    alert('Remise à zéro\n\nLes statistiques et les tops ont été remis à zéro.');
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreTops()
{
    if (scoreGrille.scoreMax > this.topGrilleMaxScore) 	{ this.topGrilleMaxScore = scoreGrille.scoreMax;	localStorage.topGrilleMaxScore = scoreGrille.scoreMax; }
    if (scoreGrille.motsMax > this.topGrilleMaxMots) 	{ this.topGrilleMaxMots = scoreGrille.motsMax;		localStorage.topGrilleMaxMots = scoreGrille.motsMax; } // vDuo

    if (scoreGrille.score[0] > this.topGrilleScore)    	{ this.topGrilleScore = scoreGrille.score;	localStorage.topGrilleScore = scoreGrille.score; }
    if (scoreGrille.mots[0] > this.topGrilleMots)    	{ this.topGrilleMots = scoreGrille.mots;	localStorage.topGrilleMots = scoreGrille.mots; } // vDuo
	
    	// vDuo : on enregistre les mots trouvés des deux joueurs
	if (nbMTrvGrille[0][0] > this.topGrilleMots5LTrv) { this.topGrilleMots5LTrv = nbMTrvGrille[0][0];     localStorage.topGrilleMots5LTrv   = nbMTrvGrille[0][0]; }
    if (nbMTrvGrille[0][1] > this.topGrilleMots6LTrv) { this.topGrilleMots6LTrv = nbMTrvGrille[0][1];     localStorage.topGrilleMots6LTrv   = nbMTrvGrille[0][1]; }
    if (nbMTrvGrille[0][2] > this.topGrilleMots7LTrv) { this.topGrilleMots7LTrv = nbMTrvGrille[0][2];     localStorage.topGrilleMots7LTrv   = nbMTrvGrille[0][2]; }
    if (nbMTrvGrille[0][3] > this.topGrilleMots8LTrv) { this.topGrilleMots8LTrv = nbMTrvGrille[0][3];     localStorage.topGrilleMots8LTrv   = nbMTrvGrille[0][3]; }
    if (nbMTrvGrille[0][4] > this.topGrilleMots9LTrv) { this.topGrilleMots9LTrv = nbMTrvGrille[0][4];     localStorage.topGrilleMots9LTrv   = nbMTrvGrille[0][4]; } 
    if (nbMTrvGrille[0][5] > this.topGrilleMots10LTrv){ this.topGrilleMots10LTrv = nbMTrvGrille[0][5];    localStorage.topGrilleMots10LTrv  = nbMTrvGrille[0][5]; }
    if (nbMTrvGrille[0][6] > this.topGrilleMots11LTrv){ this.topGrilleMots11LTrv = nbMTrvGrille[0][6];    localStorage.topGrilleMots11LTrv  = nbMTrvGrille[0][6]; }
    
    if (nbMotsGrille[0] > this.topGrilleMots5LATrv) { this.topGrilleMots5LATrv = nbMotsGrille[0];   localStorage.topGrilleMots5LATrv  = nbMotsGrille[0]; }
    if (nbMotsGrille[1] > this.topGrilleMots6LATrv) { this.topGrilleMots6LATrv = nbMotsGrille[1];   localStorage.topGrilleMots6LATrv  = nbMotsGrille[1]; }
    if (nbMotsGrille[2] > this.topGrilleMots7LATrv) { this.topGrilleMots7LATrv = nbMotsGrille[2];   localStorage.topGrilleMots7LATrv  = nbMotsGrille[2]; }
    if (nbMotsGrille[3] > this.topGrilleMots8LATrv) { this.topGrilleMots8LATrv = nbMotsGrille[3];   localStorage.topGrilleMots8LATrv  = nbMotsGrille[3]; }
    if (nbMotsGrille[4] > this.topGrilleMots9LATrv) { this.topGrilleMots9LATrv = nbMotsGrille[4];   localStorage.topGrilleMots9LATrv  = nbMotsGrille[4]; } 
    if (nbMotsGrille[5] > this.topGrilleMots10LATrv){ this.topGrilleMots10LATrv = nbMotsGrille[5];  localStorage.topGrilleMots10LATrv = nbMotsGrille[5]; }
    if (nbMotsGrille[6] > this.topGrilleMots11LATrv){ this.topGrilleMots11LATrv = nbMotsGrille[6];  localStorage.topGrilleMots11LATrv = nbMotsGrille[6]; }
    if (grille > this.topGrille) { this.topGrille = grille; localStorage.topGrille = grille; }
    
    localStorage.topGrilleScore    = this.topGrilleScore;
    localStorage.topGrilleMaxScore = this.topGrilleMaxScore;
    localStorage.topGrilleMots    = this.topGrilleMots; // vDuo
    localStorage.topGrilleMaxMots = this.topGrilleMaxMots; // vDuo
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
    localStorage.topGrille = this.topGrille;

    localStorage.tops = true;
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreTopsFO()
{
    if (scoreGrilleFO.score[0] > this.topGrilleScoreFO){ this.topGrilleScoreFO = scoreGrilleFO.score;	localStorage.topGrilleScore = scoreGrilleFO.score; }
    if (scoreGrilleFO.mots[0] > this.topGrilleMotsFO)	{ this.topGrilleMotsFO = scoreGrilleFO.mots;	localStorage.topGrilleMots = scoreGrilleFO.mots; } 	// vDuo

	// vDuo : on enregistre les mots trouvés des deux joueurs
    if (nbMTrvGrilleFO[0][0] > this.topGrilleMots5LFO) { this.topGrilleMots5LFO = nbMTrvGrilleFO[0][0];   localStorage.topGrilleMots5LFO    = nbMTrvGrilleFO[0][0]; }
    if (nbMTrvGrilleFO[0][1] > this.topGrilleMots6LFO) { this.topGrilleMots6LFO = nbMTrvGrilleFO[0][1];   localStorage.topGrilleMots6LFO    = nbMTrvGrilleFO[0][1]; }
    if (nbMTrvGrilleFO[0][2] > this.topGrilleMots7LFO) { this.topGrilleMots7LFO = nbMTrvGrilleFO[0][2];   localStorage.topGrilleMots7LFO    = nbMTrvGrilleFO[0][2]; }
    if (nbMTrvGrilleFO[0][3] > this.topGrilleMots8LFO) { this.topGrilleMots8LFO = nbMTrvGrilleFO[0][3];   localStorage.topGrilleMots8LFO    = nbMTrvGrilleFO[0][3]; }
    if (nbMTrvGrilleFO[0][4] > this.topGrilleMots9LFO) { this.topGrilleMots9LFO = nbMTrvGrilleFO[0][4];   localStorage.topGrilleMots9LFO    = nbMTrvGrilleFO[0][4]; } 
    if (nbMTrvGrilleFO[0][5] > this.topGrilleMots10LFO) { this.topGrilleMots10LFO = nbMTrvGrilleFO[0][5]; localStorage.topGrilleMots10LFO   = nbMTrvGrilleFO[0][5]; }
    if (nbMTrvGrilleFO[0][6] > this.topGrilleMots11LFO) { this.topGrilleMots11LFO = nbMTrvGrilleFO[0][6]; localStorage.topGrilleMots11LFO   = nbMTrvGrilleFO[0][6]; }
    
    localStorage.topGrilleScoreFO  = this.topGrilleScoreFO;
    localStorage.topGrilleMotsFO  = this.topGrilleMotsFO; // vDuo
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
    this.statGrilleScore      += scoreGrille.score[0];
    this.statGrilleMaxScore   += scoreGrille.scoreMax;
    this.statGrilleMots      += scoreGrille.mots[0]; // vDuo
    this.statGrilleMaxMots   += scoreGrille.motsMax; // vDuo
    this.statGrilleMots5LTrv   += nbMotsGrille[0];
    this.statGrilleMots6LTrv   += nbMTrvGrille[0][1];
    this.statGrilleMots7LTrv   += nbMTrvGrille[0][2];
    this.statGrilleMots8LTrv   += nbMTrvGrille[0][3];
    this.statGrilleMots9LTrv   += nbMTrvGrille[0][4]; 
    this.statGrilleMots10LTrv   += nbMTrvGrille[0][5]; 
    this.statGrilleMots11LTrv   += nbMTrvGrille[0][6]; 
    this.statGrilleMots5LATrv   += nbMotsGrille[0];
    this.statGrilleMots6LATrv   += nbMotsGrille[1];
    this.statGrilleMots7LATrv   += nbMotsGrille[2];
    this.statGrilleMots8LATrv   += nbMotsGrille[3];
    this.statGrilleMots9LATrv   += nbMotsGrille[4]; 
    this.statGrilleMots10LATrv   += nbMotsGrille[5]; 
    this.statGrilleMots11LATrv   += nbMotsGrille[6]; 

    localStorage.statGrilles          = this.statGrilles;
    localStorage.statGrilleScore      = this.statGrilleScore;
    localStorage.statGrilleMaxScore   = this.statGrilleMaxScore;
    localStorage.statGrilleMots      = this.statGrilleMots;
    localStorage.statGrilleMaxMots   = this.statGrilleMaxScore;
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
    this.statGrilleScoreFO += scoreGrilleFO.score[0];
    this.statGrilleMotsFO += scoreGrilleFO.mots[0]; // vDuo
    // vDuo : on enregistre les mots trouvés des deux joueurs
    this.statGrilleMots5LFO += nbMTrvGrilleFO[0][0];
    this.statGrilleMots6LFO += nbMTrvGrilleFO[0][1];
    this.statGrilleMots7LFO += nbMTrvGrilleFO[0][2];
    this.statGrilleMots8LFO += nbMTrvGrilleFO[0][3];
    this.statGrilleMots9LFO += nbMTrvGrilleFO[0][4]; 
    this.statGrilleMots10LFO += nbMTrvGrilleFO[0][5]; 
    this.statGrilleMots11LFO += nbMTrvGrilleFO[0][6]; 
    
    localStorage.statGrillesFO = this.statGrillesFO; 
    localStorage.statGrilleScoreFO =  this.statGrilleScoreFO;
    localStorage.statGrilleMotsFO =  this.statGrilleMotsFO; // vDuo
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
function statsEtTopsEnregistreCoupFO() 
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
function statsEtTopsAffiche()
{
	const statsTitre = 'Statistiques';
    switch(statutStatsEtTops) { 
		case typeStatutStatsEtTops.ssetTops: // tops
            const msgNextStatut2 = '\n\nToucher "%" pour voir les stats.'; 
			var msgTopGames = this.topGrille+' grille'+(this.topGrille>1?pluriel:vide)+'.';
			var msgTopGrilles = 'score '+this.topGrilleScore+', max '+this.topGrilleMaxScore+'\n'+
							  this.topGrilleMots5LTrv+ ' mot'+(this.topGrilleMots5LTrv>1?pluriel:vide)+ ' de 5 lettres, max '+ this.topGrilleMots5LATrv+'\n'+
							  this.topGrilleMots6LTrv+ ' mot'+(this.topGrilleMots6LTrv>1?pluriel:vide)+ ' de 6 lettres, max '+ this.topGrilleMots6LATrv+'\n'+
							  this.topGrilleMots7LTrv+ ' mot'+(this.topGrilleMots7LTrv>1?pluriel:vide)+ ' de 7 lettres, max '+ this.topGrilleMots7LATrv+'\n'+
							  this.topGrilleMots8LTrv+ ' mot'+(this.topGrilleMots8LTrv>1?pluriel:vide)+ ' de 8 lettres, max '+ this.topGrilleMots8LATrv+'\n'+
							  this.topGrilleMots9LTrv+ ' mot'+(this.topGrilleMots9LTrv>1?pluriel:vide)+ ' de 9 lettres, max '+ this.topGrilleMots9LATrv+'\n'+
							  this.topGrilleMots10LTrv+ ' mot'+(this.topGrilleMots10LTrv>1?pluriel:vide)+ ' de 10 lettres, max '+ this.topGrilleMots10LATrv+'\n'+
							  this.topGrilleMots11LTrv+' mot'+(this.topGrilleMots11LTrv>1?pluriel:vide)+' de 11 lettres, max '+this.topGrilleMots11LATrv+'.';
			alert('TOPS\n\nTops de parties :\n'+msgTopGames+'\n\nTops de grilles :\n'+msgTopGrilles+msgNextStatut2);                  
            break;
        case typeStatutStatsEtTops.ssetStats: // stats
            const msgNextStatut1 = '\n\nToucher "%" = RAZ stats+tops.'; 
			var msgStatGrilles = (this.statGrilles?
								'En moyenne, sur '+this.statGrilles+' grille'+(this.statGrilles>1?pluriel:vide)+
								' :\nscore '+Math.round(this.statGrilleScore/this.statGrilles)+
								' ('+Math.round((100*this.statGrilleScore)/this.statGrilleMaxScore)+
								'%),\n'+Math.round(this.statGrilleMots11LTrv/this.statGrilles)+' mot'+(Math.round(this.statGrilleMots11LTrv/this.statGrilles)>1?pluriel:vide)+' de 11 lettres'+(this.statGrilleMots11LATrv?(' ('+Math.round((100*this.statGrilleMots11LTrv/this.statGrilleMots11LATrv))+'%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots10LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots10LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 10 lettres'+ (this.statGrilleMots10LATrv? (' ('+Math.round((100*this.statGrilleMots10LTrv/ this.statGrilleMots10LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots9LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots9LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 9 lettres'+ (this.statGrilleMots9LATrv? (' ('+Math.round((100*this.statGrilleMots9LTrv/ this.statGrilleMots9LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots8LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots8LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 8 lettres'+ (this.statGrilleMots8LATrv? (' ('+Math.round((100*this.statGrilleMots8LTrv/ this.statGrilleMots8LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots7LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots7LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 7 lettres'+ (this.statGrilleMots7LATrv? (' ('+Math.round((100*this.statGrilleMots7LTrv/ this.statGrilleMots7LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots6LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots6LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 6 lettres'+ (this.statGrilleMots6LATrv? (' ('+Math.round((100*this.statGrilleMots6LTrv/ this.statGrilleMots6LATrv))+ '%)'):vide)+
								'\n'+   Math.round(this.statGrilleMots5LTrv/this.statGrilles)+ ' mot'+(Math.round(this.statGrilleMots5LTrv/this.statGrilles)>1?pluriel:vide)+ ' de 5 lettres'+ (this.statGrilleMots5LATrv? (' ('+Math.round((100*this.statGrilleMots5LTrv/ this.statGrilleMots5LATrv))+ '%)'):vide)+
								'.':vide);
			if (msgStatGrilles == vide) 
				alert(statsTitre+'\n\nIl n\'y a aucune statistique.'+msgNextStatut1);
			else
				alert(statsTitre+'\n\n'+msgStatGrilles+msgNextStatut1);
			break;
        case typeStatutStatsEtTops.ssetDmd: // reset
            alert('Confirmation\n\nÊtes-vous sûr(e) de vouloir réinitialiser stats et tops ?\n\nPour confirmer,\ntouchez à nouveau "%".'); 
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
	const statsTitre = 'Stats 2ème manche';
    switch(statutStatsEtTops) { 
		case typeStatutStatsEtTops.ssetTops: // tops
            const msgNextStatut2 = '\n\nToucher "%" = stats 2ème manche.'; 
			var msgTopGrilles = 'score '+this.topGrilleScoreFO+', '+
							  this.topGrilleMots5LFO+ ' mot'+(this.topGrilleMots5LFO>1?pluriel:vide)+ ' de 5 lettres\n'+
							  this.topGrilleMots6LFO+ ' mot'+(this.topGrilleMots6LFO>1?pluriel:vide)+ ' de 6 lettres\n'+
							  this.topGrilleMots7LFO+ ' mot'+(this.topGrilleMots7LFO>1?pluriel:vide)+ ' de 7 lettres\n'+
							  this.topGrilleMots8LFO+ ' mot'+(this.topGrilleMots8LFO>1?pluriel:vide)+ ' de 8 lettres\n'+
							  this.topGrilleMots9LFO+ ' mot'+(this.topGrilleMots9LFO>1?pluriel:vide)+ ' de 9 lettres\n'+
							  this.topGrilleMots10LFO+ ' mot'+(this.topGrilleMots10LFO>1?pluriel:vide)+ ' de 10 lettres\n'+
							  this.topGrilleMots11LFO+' mot'+(this.topGrilleMots11LFO>1?pluriel:vide)+' de 11 lettres.\n\n'+
							  'meilleur coup : '+this.topCoupFONbMots+' mot'+(this.topCoupFONbMots>1?pluriel:vide)+', score '+this.topCoupFOScore+'.'; 
			alert('Tops 2ème manche\n\n'+msgTopGrilles+msgNextStatut2);                  
            break;
        case typeStatutStatsEtTops.ssetStats: // stats
            const msgNextStatut1 = '\n\nToucher "%" = RAZ stats+tops.'; 
			var msgStatGrilles = (this.statGrillesFO?
								'En moyenne, sur '+this.statGrillesFO+' grille'+(this.statGrillesFO>1?pluriel:vide)+
								' :\nscore '+Math.round(this.statGrilleScoreFO/this.statGrillesFO)+
								',\n'+Math.round(this.statGrilleMots11LFO/this.statGrillesFO)+' mot'+(Math.round(this.statGrilleMots11LFO/this.statGrillesFO)>1?pluriel:vide)+' de 11 lettres'+
								'\n'+   Math.round(this.statGrilleMots10LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots10LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 10 lettres'+
								'\n'+   Math.round(this.statGrilleMots9LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots9LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 9 lettres'+
								'\n'+   Math.round(this.statGrilleMots8LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots8LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 8 lettres'+
								'\n'+   Math.round(this.statGrilleMots7LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots7LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 7 lettres'+
								'\n'+   Math.round(this.statGrilleMots6LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots6LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 6 lettres'+
								'\n'+   Math.round(this.statGrilleMots5LFO/this.statGrillesFO)+ ' mot'+(Math.round(this.statGrilleMots5LFO/this.statGrillesFO)>1?pluriel:vide)+ ' de 5 lettres'+
								'.':vide);
			var nbMots = (this.statCoupsFO?Math.round((10*this.statCoupFONbMots)/this.statCoupsFO)/10:0);
			var msgStatCoups = (this.statCoupsFO? 
								'En moyenne sur '+this.statCoupsFO+' coup'+(this.statCoupsFO>1?pluriel:vide)+
								', '+nbMots+' mot'+(nbMots<2?vide:pluriel)+' formé'+(nbMots<2?vide:pluriel)+' et score de '+Math.round(this.statCoupFOScore/this.statCoupsFO)+
								'.':vide);
								
			if (msgStatGrilles + msgStatCoups == vide) 
				alert(statsTitre+'\n\nPas de statistique 2ème manche disponible.'+msgNextStatut1);
			else
				alert(statsTitre+'\n\n'+(msgStatGrilles?(msgStatGrilles+'\n\n'):vide)+msgStatCoups+msgNextStatut1); 
			break;
		case typeStatutStatsEtTops.ssetDmd: // reset
            alert('Confirmation\n\nÊtes-vous sûr(e) de vouloir réinitialiser TOUTES LES stats et TOUS LES tops ?\n\nPour confirmer,\ntouchez à nouveau "%".'); 
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
	return (this.rouge?typeCouleur.cRouge:this.joueur); // vDuo : .joueur remplace .vert et .orange
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
function caseDecolore()
{
	this.rouge = false;
	this.joueur = 0;
	this.affiche();
}
//---------------------------------------------------------------------------
function caseEnregistre()
{
	var prefixe = lsCase + String.fromCharCode(1 + charCodeMin + this.x) + String.fromCharCode(1 + charCodeMin + this.y);
	localStorage.setItem(prefixe + lsAttrCases[0], this.l);
	localStorage.setItem(prefixe + lsAttrCases[1], this.joueur); // vDuo
	localStorage.setItem(prefixe + lsAttrCases[2], this.rouge);
}
//---------------------------------------------------------------------------
function caseCharge(x, y)
{
	var prefixe = lsCase + String.fromCharCode(1 + charCodeMin + x) + String.fromCharCode(1 + charCodeMin + y);
	this.l = localStorage.getItem(prefixe + lsAttrCases[0]);
	this.joueur = parseInt(localStorage.getItem(prefixe + lsAttrCases[1])); // vDuo
	this.rouge = (localStorage.getItem(prefixe + lsAttrCases[2]) == vrai);
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
    
    if (localStorage.getItem(prefixe + lsAttrSolutions[3])) { 
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
			if (!h[x][y].joueur) { // On colore la lettre...
				nbLettresEnOrange++;
				h[x][y].joueur = joueur; // vDuo
				scoreGrilleFO.lettres[joueur]++;
				localStorage.nleo = nbLettresEnOrange; // enregistrement auto
			}
			else if (h[x][y].joueur!=joueur) { // Sinon, on recouvre la couleur de l'adversaire...
				scoreGrilleFO.lettres[h[x][y].joueur]--; // On retire à l'adversaire une lettre
				h[x][y].joueur = joueur; // vDuo
				scoreGrilleFO.lettres[joueur]++;
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
    if (localStorage.getItem(prefixe + lsAttrSolutions[3])) 
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
function scoreGrilleRAZ()
{
	this.scoreMax = 0;
	this.motsMax = 0;
	for(var j=0; j<=joueurs; j++) { // vDuo
		this.score[j] = 0;
		this.lettres[j] = 0;
		this.mots[j] = 0;
	}
}
//---------------------------------------------------------------------------
function scoreGrilleEnregistre()
{
	var prefixe = lsScoreGrille;
	localStorage.setItem(prefixe + lsAttrScores[0], this.scoreMax);
	localStorage.setItem(prefixe + lsAttrScores[1], this.motsMax); // vDuo
	for(var j=0; j<=joueurs; j++) { // vDuo
		localStorage.setItem(prefixe + lsAttrScores[2] + j, this.score[j]);
		localStorage.setItem(prefixe + lsAttrScores[3] + j, this.lettres[j]);
		localStorage.setItem(prefixe + lsAttrScores[4] + j, this.mots[j]);
	}
}
//---------------------------------------------------------------------------
function scoreGrilleCharge()
{
	var prefixe = lsScoreGrille;
	this.scoreMax = parseInt(localStorage.getItem(prefixe + lsAttrScores[0]));
	this.motsMax = parseInt(localStorage.getItem(prefixe + lsAttrScores[1])); // vDuo
	this.score	= [0,0,0]; // vDuo 
	this.lettres= [0,0,0]; // vDuo
	this.mots	= [0,0,0]; // vDuo
	for(var j=0; j<=joueurs; j++) { // vDuo
		this.score[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[2] + j));
		this.lettres[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[3] + j));
		this.mots[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[4] + j));
	}
	// Finalement, c'est un constructeur (appel par un new)
	// Méthodes
	this.enregistre = scoreGrilleEnregistre;
	this.raz		= scoreGrilleRAZ; // vDuo
	// this.charge = scoreGrilleCharge; // constructeur

}
//---------------------------------------------------------------------------
// classe scoreGrilleFO
//---------------------------------------------------------------------------
function scoreGrilleFORAZ()
{
	for(var j=0; j<=joueurs; j++) { // vDuo
		this.score[j] = 0;
		this.lettres[j] = 0;
		this.mots[j] = 0;
	}
}
//---------------------------------------------------------------------------
function scoreGrilleFOEnregistre()
{
	var prefixe = lsScoreOrange;
	for(var j=0; j<=joueurs; j++) { // vDuo
		localStorage.setItem(prefixe + lsAttrScores[2] + j, this.score[j]);
		localStorage.setItem(prefixe + lsAttrScores[3] + j, this.lettres[j]);
		localStorage.setItem(prefixe + lsAttrScores[4] + j, this.mots[j]);
	}
}
//---------------------------------------------------------------------------
function scoreGrilleFOCharge()
{
	var prefixe = lsScoreOrange;
	this.score	= [0,0,0]; // vDuo 
	this.lettres= [0,0,0]; // vDuo
	this.mots	= [0,0,0]; // vDuo
	for(var j=0; j<=joueurs; j++) { // vDuo
		this.score[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[2] + j));
		this.lettres[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[3] + j));
		this.mots[j] = parseInt(localStorage.getItem(prefixe + lsAttrScores[4] + j));
	}

	// Finalement, c'est un constructeur (appel par un new)
	// Méthodes
	this.enregistre = scoreGrilleFOEnregistre;
	this.raz		= scoreGrilleFORAZ; // vDuo
	// this.charge = scoreGrilleFOCharge; // constructeur
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
	for(var j=1; j<=joueurs; j++) { // vDuo
		var couleur = (nbMotsGrille[n]?coulJoueur[j]:cptGris); // vDuo coulJoueur remplace cptVert et cptOrange
		var d = Math.floor((filOrange?nbMTrvGrilleFO[j][n]:nbMTrvGrille[j][n]) / 10);
		var u = (filOrange?nbMTrvGrilleFO[j][n]:nbMTrvGrille[j][n]) % 10;
		var id; var nvSrc;
	
		// Dizaines
		id = 'c' + coulJoueur[j] + dizaine + n;
		nvSrc = chmPng + d + couleur + extPng;
		document.images[id].src = nvSrc;	

		// Unités
		id = 'c' + coulJoueur[j] + unite + n;
		nvSrc = chmPng + u + couleur + extPng;
		document.images[id].src = nvSrc;		
	}
}
//---------------------------------------------------------------------------
function afficheDenominateurCompteur(nbl) // nbl de 5 à 11
{
	var n = nbl - tailleMinMot;
	var couleur = ((filOrange||(!nbMotsGrille[n]))?cptGris:((nbMotsGrille[n]==nbMTrvGrille[0][n])?cptBlanc:cptRouge)); // vDuo : le blanc remplace le vert si tous les mots trouvés
	var d = Math.floor(nbMotsGrille[n] / 10);
	var u = nbMotsGrille[n] % 10;
	var id; var nvSrc;

	// Dizaines
	id = 'cd' + dizaine + n;
	nvSrc = chmPng + d + couleur + extPng;
	document.images[id].src = nvSrc;	

	// Unités
	id = 'cd' + unite + n;
	nvSrc = chmPng + u + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheCompteur(nbl) // nbl de 5 à 11
{
	afficheDenominateurCompteur(nbl);
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
function indiceDico(filtre, debut) // v1.2
{
	var t = filtre.length-tailleMinMot;
	var iMin = 0;
	var iMax = nbMots[t]-1;
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
function compteMots(filtre, iMin, iMax) // v1.2 : nouvelle implémentation
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
		//console.log(filtre+'('+filtreMin+'>'+filtreMax+'):dico['+iMin+']='+dico[t][iMin]+'>dico['+iMax+']='+dico[t][iMax]+' ('+((100.0*(iMax-iMin+1))/nbMots[t])+'%) ');
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
function choisitMotAvecFiltre(filtre) // v1.2 : nouvelle implémentation
{
	var t = filtre.length-tailleMinMot;
	var iMin = 0;
	var iMax = nbMots[t]-1;
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
	return dico[t][Math.floor(nbMots[t]*Math.random())];
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
		nbMotsGrille[i] = 0;
		for(var j=0; j<=joueurs; j++) {
			nbMTrvGrille[j][i] = 0;
			nbMTrvGrilleFO[j][i] = 0;
		}
		s[i].length = 0;
	}
	
	scoreGrille.raz();
	scoreGrilleFO.raz();
	scoreGrilleFO.enregistre();

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
						scoreGrille.motsMax++; // vDuo
					}
				} 
			}
		}
	// Affichage nombres de mots
	for(var i=tailleMinMot; i<=tailleMaxMot; i++) {
		//console.log('Mots de '+i+' lettres: '+nbMotsGrille[i-tailleMinMot]); 
		afficheCompteur(i);
	}
	scoreGrille.enregistre();
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
	afficheNumeroGrilleEtManche(); // vDuo
}
//---------------------------------------------------------------------------
// Affiche mot sélectionné
//---------------------------------------------------------------------------
function afficheDernierCoupFO() 
{
    if (!drnCpFONbMots) return;

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
	var coulFin = (affiche?(motJoueur[h[xDepart+(taille-1)*dx[dDepart]][yDepart+(taille-1)*dy[dDepart]].joueur]):vide); // vDuo (motJoueur)
	var id = ((taille==tailleMaxMot)?'msd':('ms' + String.fromCharCode(  charCodeMin+tailleMaxMot-taille) 
	                                             + String.fromCharCode(1+charCodeMin+tailleMaxMot-taille))); 
	var nvSrc = chmPng + (affiche?('sd'+motJoueur[h[xDepart][yDepart].joueur]):fond) + extPng; // vDuo (motJoueur)
	stDrnMotForme = vide;
	document.images[id].src = nvSrc;	
	for(var k=0; k<taille-1; k++) {
		lettre = (affiche?h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].l:vide);
		stDrnMotForme = stDrnMotForme + lettre;
		sepPng = (affiche?('sg'+motJoueur[h[xDepart+    k*dx[dDepart]][yDepart+    k*dy[dDepart]].joueur]+ // vDuo (motJoueur)
				  			'd'+motJoueur[h[xDepart+(k+1)*dx[dDepart]][yDepart+(k+1)*dy[dDepart]].joueur]) // vDuo (motJoueur)
				  		 :vide);
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
	
	if (affiche) { 
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDrnMotForme;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM; // v1.1.1 - .toLowerCase()
		// On s'assure de bien renvoyer à l'extérieur
		document.links[idLnkDico].target = '_blank';
	}
	else { // on empêche de cliquer en "aveugle" sur '?'
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
	if (filOrange) 
		afficheDernierCoupFO();
}
//---------------------------------------------------------------------------
// Affichage données partie
//---------------------------------------------------------------------------
function afficheNombreChances()
{
	for(var j=1; j<=joueurs; j++) {
		// Affichage des étoiles
		document.images['c'+coulJoueur[j]+'1'].src = chmPng + idChance + (chances[j]>0?coulJoueur[j]:'x') + extPng;
		document.images['c'+coulJoueur[j]+'2'].src = chmPng + idChance + (chances[j]>1?coulJoueur[j]:'x') + extPng;
	}
}
//---------------------------------------------------------------------------
function afficheNumeroGrilleEtManche() // vDuo
{
	document.images[idGrille].src = chmPng + (grille%100) + coulJoueur[meneur] + extPng;
	document.images[idManche].src = chmPng + 'grillef' + (filOrange?2:1) + extPng;
}
//---------------------------------------------------------------------------
function afficheChances() // vDuo
{
	for(var j=1; j<=joueurs; j++)
		for(var c=1; c<=chancesAuDebut; c++)
			document.images['c'+coulJoueur[j]+((j-1)?(3-c):c)].src = chmPng + idChance + ((chances[j]>=c)?coulJoueur[j]:'x') + extPng;
}
//---------------------------------------------------------------------------
function afficheJoueurs() // vDuo
{
	for(var j=1; j<=joueurs; j++) 
		document.images[idJoueurCrt[j]].src = chmPng + idJoueurCrt[j] + ((joueur==j)?coulJoueur[j]:'x') + extPng;
}
//---------------------------------------------------------------------------
function joueurSuivant(afficheMsg) // vDuo
{
	if (affichageMsgRejouerFilOrange) { // On a choisi une lettre inutilisée : on rejoue (msg obligatoire) 
		affichageMsgRejouerFilOrange = false;
		localStorage.amrfo = affichageMsgRejouerFilOrange;
		alert('C\'est toujours à '+stCoulJoueur[joueur]+' de jouer.\n\nLe choix d\'une lettre autour de la grille vous donne droit à rejouer si le coup permet de former au moins un mot !');
		return;
	}
	if (joueur)
		joueur=3-joueur;
	else
		joueur=1;
	afficheJoueurs();
	localStorage.joueur = joueur;
	if ((!filOrange) && affichageMsgJoueurSuivant && afficheMsg && (grille==1)) {
		affichageMsgJoueurSuivant = false;
		localStorage.amjs = affichageMsgJoueurSuivant;
		alert('C\'est à '+stCoulJoueur[joueur]+' de jouer.\n\nPour savoir à qui est le tour, il suffit de regarder l\'indicateur en forme de main, de part et d\'autre des boutons bleus.\n\nCelui qui doit jouer a son indicateur de sa couleur.');
	}
	if (filOrange && affichageMsgSolutionsFilOrange && afficheMsg && (grille==1)) {
		affichageMsgSolutionsFilOrange = false;
		localStorage.amsfo = affichageMsgSolutionsFilOrange;
		alert('C\'est à '+stCoulJoueur[joueur]+' de jouer.\n\nÀ la fin de la visualisation des mots formés, c\'est toujours à l\'adversaire de jouer.');
	}
	
}
//---------------------------------------------------------------------------
function afficheScore() 
{
	for(var j=1; j<=joueurs; j++) {

		// grilles
		document.images[idScore[typeScore.sGrilles] + coulJoueur[j]].src = chmPng + (grilles[j]%100) + coulJoueur[j] + extPng;

		// score
		var score 		= scoreGrille.score[j] + scoreGrilleFO.score[j];
		var chiffres 	= [	score%10,
							Math.floor(score/10)%10,
							Math.floor(score/100)%10,
							Math.floor(score/1000)%10];
		for(i=0; i<=3; i++)
			document.images[idScore[typeScore.sScore] + coulJoueur[j] + chiffreScore[i]].src = chmPng + chiffres[i] + coulJoueur[j] + extPng;

		// lettres
		score = scoreGrille.lettres[j] + scoreGrilleFO.lettres[j];
		chiffres =[	score%10,
					Math.floor(score/10)%10,
					Math.floor(score/100)];
		for(i=0; i<=1; i++)
			document.images[idScore[typeScore.sLettres] + coulJoueur[j] + chiffreScore[i]].src = chmPng + chiffres[i] + coulJoueur[j] + extPng;
		// Affichage des centaines du nombre de lettres si > 0
		document.images[idScore[typeScore.sLettres] + coulJoueur[j] + chiffreScore[2]].src = chmPng + ((chiffres[2]>0)?(chiffres[2]+coulJoueur[j]):'-') + extPng;

		// mots
		score = scoreGrille.mots[j] + scoreGrilleFO.mots[j];
		chiffres =[	score%10,
					Math.floor(score/10)%10];
		for(i=0; i<=1; i++)
			document.images[idScore[typeScore.sMots] + coulJoueur[j] + chiffreScore[i]].src = chmPng + chiffres[i] + coulJoueur[j] + extPng;
	}

	// Indicateur de joueur courant
	afficheJoueurs();
	// Indicateur de chances
	afficheChances();
	
	// Indicateurs de vainqueurs. vDuo
	var pouces = [0.0,0.0,0.0]; // vDuo : On somme les pouces
	for(var j=1; j<=joueurs; j++) {
		var idVq = vide;
		// score
		if (scoreGrille.score[j] + scoreGrilleFO.score[j] > 
			scoreGrille.score[3-j] + scoreGrilleFO.score[3-j]) {
			idVq = 'ok'+coulJoueur[j];
			pouces[j]+=1.5; // En cas d'égalité, le score prime devant le nombre de lettres et de mots, d'où le .5
		}
		else
			idVq = 'ko'+coulJoueur[j];
		document.images[idScore[typeScore.sScore] + coulJoueur[j] + chiffreScore[4]].src = chmPng + idVq + extPng;
	
		// lettres
		if (scoreGrille.lettres[j] + scoreGrilleFO.lettres[j] > 
			scoreGrille.lettres[3-j] + scoreGrilleFO.lettres[3-j]) {
			idVq = 'ok'+coulJoueur[j];
			pouces[j]+=1.2; // En cas d'égalité, le nombre de lettres prime devant le nombre de mots, d'où le .2
		}
		else
			idVq = 'ko'+coulJoueur[j];
		document.images[idScore[typeScore.sLettres] + coulJoueur[j] + chiffreScore[4]].src = chmPng + idVq + extPng;
	
		// mots
		if (scoreGrille.mots[j] + scoreGrilleFO.mots[j] > 
			scoreGrille.mots[3-j] + scoreGrilleFO.mots[3-j]) {
			idVq = 'ok'+coulJoueur[j];
			pouces[j]+=1.0;
		}
		else
			idVq = 'ko'+coulJoueur[j];
		document.images[idScore[typeScore.sMots] + coulJoueur[j] + chiffreScore[4]].src = chmPng + idVq + extPng;
	}
	// Numéro de grille et de manche (+meneur) 
	meneur = (pouces[1]==pouces[2])?0:((pouces[1]>pouces[2])?1:2);
	localStorage.meneur = meneur;
	afficheNumeroGrilleEtManche();
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
function continueFilOrange() // vDuo
{
	joueurSuivant(true); // vDuo
	continuerFilOrange = true;
	localStorage.cfo = continuerFilOrange;
}
//---------------------------------------------------------------------------
function prepareFinFilOrange() // vDuo
{
	continuerFilOrange = false;
	localStorage.cfo = continuerFilOrange; // Force à changer de grille en cas de rafraîchissement
	demandeToucheGrille = true;
	confirmationGrilleDemandee = false;
}
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
				var bonus = 0;
				if (nbLettresEnOrange == nbCases) {
					bonus = scoreGrilleFO.score[joueur];
					scoreGrilleFO.score[joueur] += bonus;
					scoreGrilleFO.score[0] += bonus;
					scoreGrilleFO.enregistre();
					afficheScore();
				}
				// On enregistre stats & tops Fil Orange
				statsEtTops.enregistreStatsFOGrille();
    			statsEtTops.enregistreTopsFO();
				if (nbLettresEnOrange == nbCases)
					alert('Bravo !\nToute la grille est colorée !\n'+stCoulJoueur[joueur]+' double son score de deuxième manche (soit un bonus de '+bonus+').\n\nLa grille n°'+grille+' est remportée par '+stCoulJoueur[meneur]+'.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nTouchez "Grille" pour passer à la suivante...');
				else
					alert('Il n\'y a plus de changements possibles.\nLa deuxième manche est terminée.\n\nLa grille n°'+grille+' est remportée par '+stCoulJoueur[meneur]+'.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nTouchez "Grille" pour passer à la suivante...');
				prepareFinFilOrange(); // vDuo : change joueur, force l'usage "Grille" pour passer à la suite, assure la fin du fil orange en cas de reprise de jeu
			}
			else
				continueFilOrange(); // vDuo : joueur suivant, assure la suite du fil orange en cas de reprise de jeu
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
	nbMTrvGrilleFO[joueur][taille]++; // vDuo
	nbMTrvGrilleFO[0][taille]++; // vDuo
	afficheCompteur(taille+tailleMinMot);
	var score = scoreMto[sfo[taille][numero].d][taille];
	scoreGrilleFO.score[joueur] += score;
	scoreGrilleFO.score[0] += score;
	scoreGrilleFO.mots[joueur]++;
	scoreGrilleFO.mots[0]++;

	// enregistrement auto
	localStorage.setItem(lsNbMotsEnOrange + taille + '0', nbMTrvGrilleFO[0][taille]);
	localStorage.setItem(lsNbMotsEnOrange + taille + joueur, nbMTrvGrilleFO[joueur][taille]);
	scoreGrilleFO.enregistre();
	
	afficheScore();
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
	else // On utilise la flèche ">"
		if (filOrangeIncrementeNumeroSolutionVisualisee()) {
			taille = solutionVisualisee % 10;
			numero = Math.floor(solutionVisualisee / 10);
			// On affiche le mot et les compteurs
			filOrangeAfficheMotEtCompteurs(taille, numero);
		}
}
//---------------------------------------------------------------------------
function motsTousTrouves() // vDuo
{
	var tousTrouves = true;
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		if (nbMTrvGrille[0][i]<nbMotsGrille[i]) {
			tousTrouves = false;
			break;
		}
	return tousTrouves;
}
//---------------------------------------------------------------------------
function finGrille(stMsg) // Met en mode d'affichage des solutions
{
	var stDebutMsg = vide;
	if (stMsg != undefined)
		stDebutMsg = stMsg;
	retireMotChoisi();
	affichageMsgGrilleColoree = false;
	demandeToucheGrille = true;
	if (!motsTousTrouves()) { // Si solutions non trouvées, on les montre...
		visualisationSolutions = true;
		// vDuo : Si un mot est marqué en rouge, on le cache...
		if (tailleMotMarque&&(numeroMotMarque>indefini)) {
			s[tailleMotMarque-tailleMinMot][numeroMotMarque].majAffichage(false);
				tailleMotMarque = 0;
				numeroMotMarque = indefini;
		}
		rafraichitBoutons();
		solutionVisualisee = indefini;
		localStorage.vs = vrai; localStorage.sv = indefini; // enregistrement auto
		montreSolution(suivante);
		if (lettresRestantes) { // vDuo : il faut déterminer le vainqueur
			for(var j=1; j<=joueurs; j++) // On rafraîchit les grilles gagnées
				document.images[idScore[typeScore.sGrilles] + coulJoueur[j]].src = chmPng + grilles[j] + coulJoueur[j] + extPng;
			// On indique le vainqueur : celui qui a gagné le plus de grilles. En cas d'égalité, c'est celui qui menait dans la grille courante.
			var stVainqueur = (((grilles[1]==grilles[2])&&(!meneur))?'Personne':(((grilles[1]>grilles[2])||((grilles[1]==grilles[2])&&(meneur==1)))?'Vert':'Orange')) + ' gagne la partie ('+Math.max(grilles[1],grilles[2])+'-'+Math.min(grilles[1],grilles[2])+').';
			alert(stDebutMsg + 'La partie est terminée.\n'+stVainqueur+'\n\nVous pouvez visualiser les mots non trouvés en utilisant "<" et ">".\n\nTouchez "Grille" pour commencer une nouvelle partie.');
		}
		else {
			alert(stDebutMsg + 'Vous pouvez visualiser les mots non trouvés en utilisant "<" et ">".\n\nTouchez "Grille" pour passer à la deuxième manche.');
		}
	}
}
//---------------------------------------------------------------------------
function finPartie(stMsg)
{
	statsEtTops.enregistreStatsGrille();
    statsEtTops.enregistreTops();

	finGrille(stMsg);
}
//---------------------------------------------------------------------------
function afficheAidePrincipale()
{
	const stAide = ['OsmotissimoDuo se joue en duel : Vert (à gauche) contre Orange (à droite). À tour de rôle, vous devez trouver les mots de 5 à 11 lettres cachés dans la grille. Vous n\'avez que le nombre de mots à trouver (noms communs et verbes conjugués). Après chaque mot trouvé, ses lettres sont peintes dans la couleur du découvreur. Vous devez colorer toute la grille pour passer à la manche suivante. Vert commence toujours la partie.',
					'Vous devez changer une lettre afin que la nouvelle lettre forme de nouveaux mots d\'au moins 5 lettres. Les nouveaux mots sont colorés. La deuxième manche se termine quand toute la grille est colorée ou après deux erreurs consécutives (une par joueur) puis vous passez à la grille suivante.\nTouchez la lettre à changer dans la grille puis une autre lettre qui peut se trouver autour de la grille.'];
	const stTitre = ['Bienvenue à OsmotissimoDuo','Bienvenue dans la deuxième manche'];
	alert(stTitre[filOrange?1:0]+'\n\n'+stAide[filOrange?1:0]);
}
//---------------------------------------------------------------------------
// Enregistrement de la partie
//---------------------------------------------------------------------------
function enregistreNbMotsGrille()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++) {
		localStorage.setItem(lsNbMotsGrille + i, nbMotsGrille[i]);
		for(var j=0; j<=joueurs; j++)
			localStorage.setItem(lsNbMTrvGrille + i + j, nbMTrvGrille[j][i]);
	}
}
//---------------------------------------------------------------------------
function enregistreNbMotsEnOrange()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		for(var j=0; j<=joueurs; j++)
			localStorage.setItem(lsNbMotsEnOrange + i + j, nbMTrvGrilleFO[j][i]);
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

	localStorage.joueur = joueur;
	localStorage.grille = grille;
	localStorage.meneur = meneur; // vDuo

	for(var j=0; j<=joueurs; j++) { // vDuo
		localStorage.setItem(lsChances+j, chances[j]);
		localStorage.setItem(lsGrilles+j, grilles[j]);
	}

	localStorage.lr = lettresRestantes;

	scoreGrille.enregistre();
	
	// fil orange
	localStorage.filOrange = filOrange;
	localStorage.cfo = continuerFilOrange; // vDuo
	localStorage.nleo = nbLettresEnOrange;
	localStorage.sfo = stSolutionFilOrange;
	localStorage.aafo = affichageAideFilOrange;
	localStorage.amjs = affichageMsgJoueurSuivant;
	localStorage.amsfo = affichageMsgSolutionsFilOrange;
	localStorage.amrfo = affichageMsgRejouerFilOrange;
	
	localStorage.dcfonm = drnCpFONbMots;
	localStorage.dcfos = drnCpFOScore;

	enregistreNbMotsEnOrange();
	scoreGrilleFO.enregistre();
	enregistreSolutionsFilOrange();
}

//---------------------------------------------------------------------------
// Chargement de la partie
//---------------------------------------------------------------------------
function chargeNbMotsGrille()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++) {
		nbMotsGrille[i] = parseInt(localStorage.getItem(lsNbMotsGrille + i));
		for(var j=0; j<=joueurs; j++)
			nbMTrvGrille[j][i] = parseInt(localStorage.getItem(lsNbMTrvGrille + i + j));
	}
}
//---------------------------------------------------------------------------
function chargeNbMotsEnOrange()
{
	for(var i=0; i<=tailleMaxMot-tailleMinMot; i++)
		for(var j=0; j<=joueurs; j++)
			nbMTrvGrilleFO[j][i] = parseInt(localStorage.getItem(lsNbMotsEnOrange + i + j));
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
	if (localStorage.getItem('acd')) 
		affichagesChgtDico = parseInt(localStorage.acd);
	else
		affichagesChgtDico = 0;

	// Eléments de partie
	visualisationSolutions = (localStorage.vs == vrai);
	solutionVisualisee = parseInt(localStorage.sv);
	affichageAide = (localStorage.aa == vrai);

	joueur = parseInt(localStorage.joueur);
	var stFinMsgPartieChargee = '\n\nC\'est à '+stCoulJoueur[joueur]+' de jouer.';
	
	grille = parseInt(localStorage.grille);
	meneur = parseInt(localStorage.meneur); // vDuo

	for(var j=0; j<=joueurs; j++) { // vDuo
		chances[j] = parseInt(localStorage.getItem(lsChances+j));
		grilles[j] = parseInt(localStorage.getItem(lsGrilles+j));
	}
		
	lettresRestantes = parseInt(localStorage.lr);
	
	scoreGrille = new scoreGrilleCharge();

	// fil orange
	filOrange = (localStorage.filOrange == vrai);
	continuerFilOrange = (localStorage.cfo == vrai); // vDuo
	nbLettresEnOrange = parseInt(localStorage.nleo);
	stSolutionFilOrange = localStorage.sfo;
	affichageAideFilOrange = (localStorage.aafo == vrai);
	affichageMsgJoueurSuivant = (localStorage.amjs == vrai);
	affichageMsgSolutionsFilOrange = (localStorage.amsfo == vrai);
	affichageMsgRejouerFilOrange = (localStorage.amrfo == vrai);

	drnCpFONbMots = parseInt(localStorage.dcfonm);
	drnCpFOScore = parseInt(localStorage.dcfos);

	chargeNbMotsEnOrange();
	scoreGrilleFO = new scoreGrilleFOCharge();
	chargeSolutionsFilOrange();
	
	// Affichage du jeu
	cacheLettresInutilisees();
	afficheGrille();
	for(var i=tailleMinMot; i<=tailleMaxMot; i++)
		afficheCompteur(i);
	afficheScore();
	if (filOrange) {
        var stMsgDebutDeuxiemePartie = '\nVous êtes dans la deuxième manche de la grille n°'+grille;
		stMsgPartieChargee = stDebutMsgPartieChargee + stMsgDebutDeuxiemePartie + '.\n\nSi vous vous trompez chacun une fois consécutivement, vous passez automatiquement à la grille suivante.';
		montreLettresInutilisees(); 
		if (visualisationSolutions) {
			rafraichitBoutons();
			filOrangeMontreSolution();
			if (solutionVisualisee > indefini)
				stMsgPartieChargee = stDebutMsgPartieChargee + stMsgDebutDeuxiemePartie + ' et vous visualisiez les mots formés.\n\nTouchez ">" pour voir ou terminer de voir les mots formés.';
		}
		else {
			afficheDernierCoupFO();
			affichageMsgJoueurSuivant = false; // On empêche de dire quel est le joueur courant puisqu'on l'a déjà dit
			localStorage.amjs = affichageMsgJoueurSuivant;
			if (continuerFilOrange)
				stMsgPartieChargee = stDebutMsgPartieChargee + stMsgDebutDeuxiemePartie + '.\n\nC\'est à '+stCoulJoueur[joueur]+' de jouer.'; // joueur a changé
			else { // On est en fin de deuxième manche
				stMsgPartieChargee = stDebutMsgPartieChargee;
				filOrangeTermine();
			}
		}
	}
	else {
		if (visualisationSolutions) {
			rafraichitBoutons();
			montreSolution(suivante);
			stMsgPartieChargee = stDebutMsgPartieChargee + '\n\nVous visualisiez les mots non trouvés de la grille n°'+grille+'.\n\nTouchez "<" et ">" pour continuer la visualisation ou touchez "Grille" pour '+((chances[0]||(!lettresRestantes))?'passer à la suivante':'commencer une nouvelle partie')+'...';
		}
		else {
			stMsgPartieChargee = stMsgPartieChargee + stFinMsgPartieChargee;
			affichageMsgJoueurSuivant = false; // On empêche de dire quel est le joueur courant puisqu'on l'a déjà dit
			localStorage.amjs = affichageMsgJoueurSuivant;
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
	affichageMsgGrilleColoree = false;
	visualisationSolutions = false; 
	confirmationGrilleDemandee = false;
	demandeToucheGrille = false;
	solutionVisualisee = indefini;
	xDepart = indefini;
	yDepart = indefini;
	dDepart = typeDir.dIndefinie;
	chances[1] = chances[2] = chancesAuDebut; // vDuo
	chances[0] = 2 * chancesAuDebut; // vDuo
	joueurSuivant(true); // nDuo;
	if (nouvelle) {
		meneur = 0;
		grille = 1;
		grilles = [0,0,0];
	}
	else {
	    statsEtTops.enregistreStatsGrille();
    	statsEtTops.enregistreTops();
		grille++;
		grilles[meneur]++; // vDuo : Le meneur emporte la grille précédente
	}
	scoreGrille = new creeScoreGrille();
	scoreGrilleFO = new creeScoreGrilleFO();

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
	
	if (nbMotsGrille[index-101]) {
		var pc = Math.round((100*nbMTrvGrille[0][index-101])/nbMotsGrille[index-101]);
		st = stPrefixe + pc + ' % trouvé'+((pc>1)?'s)':')');
	}
	return st;
}
//---------------------------------------------------------------------------
function afficheSablier(affiche)
{
	if (affiche)
		document.images[idBtnGrille].src = chmPng + 'sablier' + extPng;
	else
		document.images[idBtnGrille].src = chmPng + 'grilled' + extPng;
}
//---------------------------------------------------------------------------
function afficheSablierFO()
{
	document.images[idBtnDroite].src = chmPng + 'sablier' + extPng;
}
//---------------------------------------------------------------------------
function joueCoupFilOrange()
{
	if (filOrangeEvalue()) { 
			chances = [2,1,1]; // On réinitialise les chances à la moitié de celles de la première manche
			for(var j=0; j<=joueurs; j++) // vDuo
				localStorage.setItem(lsChances+j, chances[j]);
			afficheChances(); // vDuo
			montreLettresInutilisees(); // Il se peut que les lettres inutilisées aient changé !
			visualisationSolutions = true;
			rafraichitBoutons();
			solutionVisualisee = indefini;
			localStorage.vs = vrai; localStorage.sv = indefini; // enregistrement auto
			filOrangeMontreSolution();
		}
		else {
			if (affichageMsgRejouerFilOrange) {
				affichageMsgRejouerFilOrange = false; // vDuo. Dans le cas où l'on avait choisi une lettre inutilisée (hors grille), on annule le msg de rejouer !
				localStorage.amrfo = affichageMsgRejouerFilOrange;
			}
			chances[joueur]--;
			chances[0]--;
			localStorage.setItem(lsChances+joueur, chances[joueur]); // vDuo
			localStorage.setItem(lsChances+'0', chances[0]); // vDuo
			afficheChances(); // vDuo
			if (chances[0]) {
				alert('Votre choix ne permet pas de former de mot.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nATTENTION, vous n\'avez désormais plus droit à l\'erreur !');
				joueurSuivant(false); // vDuo
			}
			else {
				alert('Votre choix ne permet pas de former de mot. Vous avez épuisé toutes vos chances.\n\n'+stSolutionFilOrange+'\n\nLa deuxième manche est terminée\n\nLa grille n°'+grille+' est remportée par '+stCoulJoueur[meneur]+'.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nTouchez "Grille" pour passer à la suite.');
				prepareFinFilOrange(); // vDuo
			}
		}
}
//---------------------------------------------------------------------------
// onClick
//---------------------------------------------------------------------------
// index 
// de 0 à 90 	= grille
// de 91 à 98   = lettres inutilisées
// de 99 à 99   = choix du dictionnaire de définition
// de 100 à 100 = bouton "grille"
// de 101 à 107	= compteurs de mots trouvés (vert|orange|grille) par taille de mot (5 à 11) 
// de 108 à 109	= dernier mot trouvé (infos mot + score)
// de 110 à 112	= boutons (?=Aide @=Infos %=stats) ? et @ deviennent respectivement < et > à l'affichage des solutions
// de 113 à 114 = indicateur de tour de joueurs (respectivement "vert joue" et "orange joue")
// de 115 à 115 = grilles gagnées par les joueurs (chiffres uniquement)
// de 116 à 116 = scores des joueurs ("Scores" + chiffres)
// de 117 à 117 = nombre de lettres de la couleur de chaque joueur ("Lettres" + chiffres)
// de 118 à 118 = nombre de mots trouvés par chaque joueur ("Mots" + chiffres)
// de 119 à 119 = nombre de chances restantes de chaque joueur ("Chances" + étoiles)
// de 120 à 120 = pouces baissés/levés par joueur et type de points
// de 121 à 122 = respectivement numéro de grille et manche
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
	    (!demandeToucheGrille) &&
		(index < nbCases)) {
		if ((xDepart==indefini) && (yDepart==indefini)) {
			if (filOrange && h[xClic[index]][yClic[index]].joueur) // vDuo : .joueur remplace .orange
				return; // On interdit de choisir une lettre orange en mode "fil orange" et on empêche de toucher les lettres en fin de fil orange (on attend que "Grille" soit touché)
			xDepart = xClic[index];
			yDepart = yClic[index];
			dDepart = typeDir.dIndefinie;
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
					alert('Pour sélectionner un mot de la grille, touchez sa première lettre (qui apparaît en rouge) puis la dernière.\n\nSi le mot est correct, ses lettres seront colorées et le mot apparaîtra sous les compteurs de mots.\n\nPour annuler votre choix, touchez à nouveau la lettre (affichée en rouge).'); 
				}
		}
		else {
			var xArrivee = xClic[index];
			var yArrivee = yClic[index];
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
			
			if (filOrange) {
				lettreOrangeRemplacee = h[xDepart][yDepart].l;
				h[xDepart][yDepart].l = h[xArrivee][yArrivee].l; 
				joueCoupFilOrange();
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
							nbMTrvGrille[joueur][tailleSelection-tailleMinMot]++; // vDuo
							nbMTrvGrille[0][tailleSelection-tailleMinMot]++; // vDuo
							afficheCompteur(tailleSelection);
							for(var k=0; k<tailleSelection; k++) 
								if (h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].joueur != joueur) { // vDuo
									var joueurPrc = h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].joueur; // vDuo
									if (!joueurPrc) // vDuo
										lettresRestantes--; 
									else
										scoreGrille.lettres[joueurPrc]--;
									scoreGrille.lettres[joueur]++;
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].joueur = joueur; // vDuo
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].enregistre(); // enregistrement auto
									h[xDepart+k*dx[dDepart]][yDepart+k*dy[dDepart]].affiche();
								}
							var score = scoreMot[dDepart][tailleSelection-tailleMinMot];
							scoreGrille.score[joueur] += score;
							scoreGrille.score[0] += score;
							scoreGrille.mots[joueur]++;
							scoreGrille.mots[0]++;
							
							// enregistrement auto
							scoreGrille.enregistre();
							localStorage.setItem(lsNbMTrvGrille+(tailleSelection-tailleMinMot)+'0', nbMTrvGrille[0][tailleSelection-tailleMinMot]); // vDuo
							localStorage.setItem(lsNbMTrvGrille+(tailleSelection-tailleMinMot)+joueur, nbMTrvGrille[joueur][tailleSelection-tailleMinMot]); // vDuo
							localStorage.lr = lettresRestantes;	
							chances = [4,2,2]; // On réinitialise les chances si mot valide trouvé
							for(var j=0; j<=joueurs; j++) // vDuo
								localStorage.setItem(lsChances+j, chances[j]);
							afficheChances(); // vDuo
							joueurSuivant(true); // vDuo
							afficheScore();
							if (motsTousTrouves()) { // vMax à voir. vDuo : Déplacement du code ici car inutile de signaler si reprise du jeu et que le mot a déjà été trouvé
								demandeToucheGrille = true;
								alert('Fantastique !\n\nVous avez trouvé tous les mots de la grille !\n\nTouchez "Grille" pour passer à la deuxième manche.');
							}
							else if ((!lettresRestantes) && (!affichageMsgGrilleColoree)) {
								affichageMsgGrilleColoree = true;
								alert('Bravo !\n\nVous avez coloré toute la grille !\n\nVous continuer néanmoins jusqu\'à épuisement des chances avant de passer à la deuxième manche.');
							}
						}
						else { // Mot déjà trouvé ! /!\ Déduction d'une chance ici (vDuo)
							chances[joueur]--;
							chances[0]--;
							localStorage.setItem(lsChances+joueur, chances[joueur]); // vDuo
							localStorage.setItem(lsChances+'0', chances[0]); // vDuo
							afficheChances(); // vDuo
							if (chances[0]) {
								if (chances[joueur]) 
									alert('Le mot "'+stMot+'" a déjà été trouvé !\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nIl vous reste encore '+chances[joueur]+' chance'+((chances[joueur]>1)?'s ':' ')+'de vous tromper...');
								else
									alert('Le mot "'+stMot+'" a déjà été trouvé !\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nATTENTION, vous n\'avez désormais plus droit à l\'erreur !');
								joueurSuivant(false); // vDuo
							}
							else {
								var stDebutMsg = 'Le mot "'+stMot+'" a déjà été trouvé !\n\nVous avez utilisé toutes vos chances !\n\n';
								if (lettresRestantes)
									finPartie(stDebutMsg); // vDuo : "la partie est terminée" est ajouté dans finPartie
								else { // Plus de chances et grille colorée donc on continue sur la deuxième manche
									joueurSuivant(false); // vDuo
									finGrille(stDebutMsg);
								}
							}
						}
					}
					else { // /!\ Déduction d'une chance ici
						chances[joueur]--;
						chances[0]--;
						localStorage.setItem(lsChances+joueur, chances[joueur]); // vDuo
						localStorage.setItem(lsChances+'0', chances[0]); // vDuo
						afficheChances(); // vDuo
						if (chances[0]) {
							if (chances[joueur]) 
								alert('Le mot "'+stMot+'" n\'existe pas.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nIl vous reste encore '+chances[joueur]+' chance'+((chances[joueur]>1)?'s ':' ')+'de vous tromper...');
							else
								alert('Le mot "'+stMot+'" n\'existe pas.\n\nC\'est à '+stCoulJoueur[3-joueur]+' de jouer.\n\nATTENTION, vous n\'avez désormais plus droit à l\'erreur !');
							joueurSuivant(false); // vDuo
						}
						else 
							finPartie('Le mot "'+stMot+'" n\'existe pas.\n\nVous avez utilisé toutes vos chances !\n\n');
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
			 (!demandeToucheGrille) &&
			 (xDepart > indefini) &&
			 (yDepart > indefini) &&
			 (!confirmationGrilleDemandee) &&
			 (!visualisationSolutions)) { // On choisit une lettre inutilisée
		lettreOrangeRemplacee = h[xDepart][yDepart].l;
		var id = 'l'+(index%10);
		var nvLettre = document.images[id].src.substr(document.images[id].src.length-6,1);
		if (lettreOrangeRemplacee != nvLettre) { // Il faut quand même vérifier que ce n'est pas la même lettre !
			h[xDepart][yDepart].l = nvLettre; 
			affichageMsgRejouerFilOrange = true; // vDuo. Pour permettre de rejouer (bonus) sous réserve qu'un mot soit formé...
			localStorage.amrfo = affichageMsgRejouerFilOrange;
			joueCoupFilOrange();
		}
	}
	else if ((index == 99) && 
			 (document.images[idPrmDico].src[document.images[idPrmDico].src.length-5][0] != fond[0])) { 
		dicoDef = (dicoDef + 1) % nbDicosDef; // Changement du dictionnaire de définitions
		localStorage.ddd = dicoDef;
		document.images[idPrmDico].src = chmPng + pngDico[dicoDef] + extPng; 
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDrnMotForme;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM; // v1.1.1 - .toLowerCase()
		if (affichagesChgtDico < nbDicosDef) { 
			alert('Vous changez de dictionnaire de définitions pour...\n\n' + nomDico[dicoDef] + '\n\nQuand un mot est affiché à gauche du livre ouvert, touchez "?" pour accéder à la définition sur le site choisi ci-dessus.'); 
			affichagesChgtDico++;
			localStorage.acd = affichagesChgtDico;
		}
	}
	else if ((index > 100) && (index < 108)) {
		if (filOrange)
			alert('Il s\'agit du nombre de mots de '+(index-96)+' lettres trouvés par chaque joueur (en vert et en orange) par rapport au nombre total de mots de '+(index-96)+' lettres trouvés dans la première manche (en gris foncé).');
		else
			alert('Il s\'agit du nombre de mots de '+(index-96)+' lettres trouvés par chaque joueur (en vert et en orange) par rapport au nombre total de mots de '+(index-96)+' lettres à trouver'+stPourcents(index)+'.\n\nLa couleur blanche indique que tous les mots ont été trouvés. La couleur rouge indique qu\'il reste des mots à trouver.');
	}
	else // Autres...
		switch(index) {
			case 100:	// Bouton "Grille"
						if (visualisationSolutions) {
							demandeToucheGrille = false;
							if (!filOrange) { // Dans la première manche, la visualisation des mots non trouvés n'a pas de fin comme dans le fil orange alors le bouton "Grille" est requis et a automatiquement la fonction de passer à la manche suivante (pas d'abandon possible)
								if (solutionVisualisee>indefini) {
									var taille = solutionVisualisee % 10;
									var numero = Math.floor(solutionVisualisee / 10);
									s[taille][numero].majAffichage(non);
								}
								visualisationSolutions = false;
								solutionVisualisee = indefini;
								confirmationGrilleDemandee = false;
								localStorage.vs = faux; localStorage.sv = indefini; // enregistrement auto
								rafraichitBoutons();
								afficheSablier(true); 
        						setTimeout(function() { 
									if (lettresRestantes)
										partieNouvelle();
									else
										filOrangeCommence();
                   					afficheSablier(false);
                   				}, 500);
							}
							else // "Grille" n'est pas fonctionnel en mode visualisation du fil orange car décompte des points à l'affichage des solutions 
								alert('Le bouton "Grille" n\'est pas fonctionnel lors de la visualisation des mots formés dans une deuxième manche.\n\nPour abandonner la partie, touchez ">" jusqu\'à la fin de la visualisation des mots formés puis touchez à nouveau "Grille"');
						}
						else
							if (demandeToucheGrille) { // 1. Demande de passage à la manche suivante
								demandeToucheGrille = false;
								confirmationGrilleDemandee = false;
								if (filOrange) { // 1a. Fil orange : on termine et on passe à la grille suivante
										afficheSablier(true); 
	    	    						setTimeout(function() { 
											filOrangeTermine();
	           	        					afficheSablier(false); 
	             	      				}, 500); 
									}
								else { // 1b. Première manche : on passe au fil orange
									if (!lettresRestantes) { // 1b1. Grille verdie ("Grille" en vert) : on peut passer à la grille suivante.
										afficheSablier(true); 
	    	    						setTimeout(function() { 
											filOrangeCommence();
	 	          	        				afficheSablier(false); 
	    	         	      			}, 500); 
									}
									else { // 1b2. Grille non verdie ("Grille" en rouge) : c'est une fin de partie = nouvelle partie !
										afficheSablier(true); 
	    	    							setTimeout(function() { 
												PartieNouvelle();
	 	      	  		    	  				afficheSablier(false); 
	    	    	  	      				}, 500); 
									}
								}
							}
							else // Si pas demandeToucheGrille alors il ne reste que le cas de l'abandon de la partie (deux fois "Grille")
								if (confirmationGrilleDemandee) { // 2a. Abandon de la partie (quelle que soit la manche)
									confirmationGrilleDemandee = false;
									afficheSablier(true); 
        							setTimeout(function() { 
										partieNouvelle();
    		               				afficheSablier(false);
            		       			}, 500);
								}
								else { // 2b. Demande de confirmation d'abandon de la partie
									confirmationGrilleDemandee = true;
									alert('Êtes-vous sûr(e) de vouloir abandonner la partie ?\n\nPour confirmer, touchez à nouveau "Grille"...');
								}
						break;
			case 108: 	if (document.images['mlA'].src[document.images['mlA'].src.length-8][0]=='m')
							alert('Ces informations concernent le dernier coup de la deuxième manche : le nombre de mots formés, le score obtenu et le meilleur score.'); 
						else
							if (document.images[idFinMot].src[document.images[idFinMot].src.length-5][0] != fond[0]) // on affiche l'aide que si un mot est affiché
								if (filOrange)
									alert('Il s\'agit du dernier mot trouvé dans la grille. Ses couleurs sont toujours celles du joueur courant (deuxième manche).'); 
								else
									alert('Il s\'agit du dernier mot trouvé dans la grille. Ses couleurs reflètent l\'état des lettres AVANT la découverte du mot.'); 
						break;
			case 109: 	if (document.images[idFinScore].src[document.images[idFinScore].src.length-5][0] != fond[0]) // on affiche l'aide que si un mot est affiché (et donc son score)
							alert('Il s\'agit du score obtenu pour avoir trouvé le mot affiché à gauche. Le score dépend de l\'orientation et du nombre de lettres.'); 
						break;
			case 110:	if (visualisationSolutions&&(!filOrange)) // Pas de bouton "précédent" en mode fil orange car on comptabilise en temps réel
							montreSolution(precedente);
						else { // v1.1 : Boutons (i) et ? inversés.
							// v1.7 : on compte vraiment les mots !
							var n=0; 
							for(var i=0; i<dico.length; i++)
								n+=dico[i].length;	
							alert('À propos d\'OsmotissimoDuo\n\nWebApp version '+stVersion+'\nCréé par Patrice Fouquet\nDico : '+n+' mots (ODS'+stVerDico+')\n\nEn solitaire, jouez à Osmotissimax !\n\nosmotissimoduo@patquoi.fr\npatquoi.fr/OsmotissimoDuo.html');
						}
						break;
			case 111:	if (visualisationSolutions)
							if (filOrange) {
								afficheSablierFO(); 
        						setTimeout(function() { 
									filOrangeMontreSolution();
									rafraichitBoutons();
            		       		}, 500);
							}
							else
								montreSolution(suivante);
						else // v1.1 : Boutons (i) et ? inversés.
							afficheAidePrincipale();
						break;
			case 112:	if (filOrange)
							statsEtTops.afficheFO();
						else
							statsEtTops.affiche();
						break;
			case 113:	alert('Quand c\'est au tour du joueur vert de jouer, la main s\'allume en vert sinon elle reste grise.');
						break;
			case 114:	alert('Quand c\'est au tour du joueur orange de jouer, la main s\'allume en orange sinon elle reste grise.');
						break;
			case 115:	alert('Il s\'agit du nombre de grilles remportées par chaque joueur.');
						break;
			case 116:	alert('Il s\'agit du score de la grille courante pour chaque joueur. Le score varie en fonction de la taille et de la difficulté de lecture.');
						break;
			case 117:	alert('Il s\'agit du nombre de lettres de la couleur de chaque joueur, actuellement dans la grille.');
						break;
			case 118:	alert('Il s\'agit du nombre de mots trouvés par chaque joueur dans la grille courante, première et deuxième manches cumulées.');
						break;
			case 119:	if (filOrange)
							alert('Il s\'agit du nombre de chances consécutives restantes pour chaque joueur dans la deuxième manche. La deuxième manche s\'arrête après deux erreurs consécutives (une par joueur) mais la partie continue sur une nouvelle grille.');
						else
							alert('Il s\'agit du nombre de chances consécutives restantes pour chaque joueur dans la première manche. La partie s\'arrête après quatre erreurs consécutives (deux par joueur).');
						break;
			case 120:	alert('Le joueur qui mène la partie est celui qui a le plus de pouces levés.\n\nUn pouce levé indique que son joueur a plus de points que son adversaire.\n\nEn cas d\'égalité, c\'est le meilleur score puis le meilleur nombre de lettres qui départagent. Le meneur de la grille courante est indiqué par la couleur du numéro de la grille');
						break;
			case 121:	alert('Le chiffre est le numéro de la grille courante.\n\nSa couleur est celle du joueur qui mène le jeu dans la grille courante (vert ou orange). Le gris indique une égalité parfaite.');
						break;
			case 122:	alert('Entre parenthèses est indiqué la manche courante sur le nombre de manches de la grille (toujours égal à deux).\n\nDans la première manche, il faut trouver les mots cachés.\n\nDans la deuxième manche, il faut changer une lettre de la grille afin de former d\'autres mots.');
						break;
			default:	break;
		}
	if (index!=clicPourcent) 
		statutStatsEtTops = typeStatutStatsEtTops.ssetTops; 
	if (confirmationGrilleDemandee &&
	    (!filOrange) && // Utilisation spéciale de confirmationGrilleDemandee en mode fil orange (oblige à toucher "Grille" pour passer à la suivante).
		(index != 100) && // Si "Grille" pas touché et...
		(!motsTousTrouves())) // Pas trouvé tous les mots (car touche "Grille" demandé)
		confirmationGrilleDemandee = false; // ALORS Demande "Grille" annulée
}
//---------------------------------------------------------------------------
// Bienvenue !
//---------------------------------------------------------------------------
function chargeJeu()
{
	creeGrille(); // Une seule fois
	retireMotChoisi();
	if (localStorage.getItem(lsGrille)) 
		chargePartie();
	else
		partieNouvelle();
}
//---------------------------------------------------------------------------
function bienvenue()
{
	if (partieChargee) {
		if (chances[0]||(!lettresRestantes))
        	stMsgPartieChargee = stMsgPartieChargee + '\n\nPour abandonner une partie, touchez "Grille" deux fois.';
		alert(stMsgPartieChargee);
	}
	else {
		afficheAidePrincipale();
		affichageMsgJoueurSuivant = true; // On affiche le message après changement de joueur
		localStorage.amjs = affichageMsgJoueurSuivant;
	}
}
//---------------------------------------------------------------------------
