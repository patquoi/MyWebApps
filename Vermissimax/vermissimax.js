 /*
 
 Fichier: Vermissimax.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.4>
 
 Copyright (C) 2012 Patrice Fouquet.
 
 */ 

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.4';

/*
Version 1.0
 - Première version (copie du moteur d'Osmotissimax.js version 1.4)
Version 1.1
 - Plus de max dans les score, bonus et total
Version 1.2
 - ODS7 : (ajout de 6195 mots)
 - Calcul en temps réel du nombre total de mots dans l'À propos.
Version 1.3
 - Possibilité de connaître les "Tops Initiales" pour le dernier mot trouvé du Fil Rouge (bouton "Top")
Version 1.3.1
 - La recherche de "Tops Initiales" était lancée alors que le choix de la lettre du point de départ correspond à un point de départ de la 1ère manche (choix incorrect).
Version 1.4
 - ODS8
*/

const stVersionODS = '8'; // v1.2

//---------------------------------------------------------------------------
// IA
//---------------------------------------------------------------------------

const nbMaxDir = 7; // Vermissimax
const nbMotsRLG = 7; // Vermissimax : nombre de mots remplissant la grille
const nbMotsFR = 7; // Vermissimax : nombre de mots à chercher dans le Fil Rouge.
const tailleMotRLG = 12; // Vermissimax : taille des mots remplissant la grille

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

// Vermissimax : Points de départ des mots remplissant la grille. Les pts de départs et le centre sont réservés lors de la pose des mots
const xRLG = [0,5,10,10, 5,0,5]; // abscisse de la première lettre de chaque mot. 
const yRLG = [0,0, 5,10,10,5,5]; // ordonnée de la première lettre de chaque mot

// Vermissimax : initiales données au départ (difficulté). Score par mot = 10*(6-iniRLG). Bonus : 1 point par lettre min=56, max=105.
const gMaxRLG = 22; // À partir de grille = 22, on prend toujours iniRLG[22] et indRLG[22].
const iniRLG = [[0,0,0,0,0,0,0],  // Score. iniRLG[0] non utilisé. iniRLG = Qualité de l'indice de départ (nombre d'initiales affichées au départ de la manche)
				[4,4,4,4,4,4,4],  // 140
				[4,4,4,4,4,4,3],  // 150
				[4,4,4,4,4,3,3],  // 160
				[4,4,4,4,3,3,3],  // 170
				[4,4,4,3,3,3,3],  // 180
				[4,4,3,3,3,3,3],  // 190
				[4,3,3,3,3,3,3],  // 200
				[3,3,3,3,3,3,3],  // 210
				[3,3,3,3,3,3,2],  // 220
				[3,3,3,3,3,2,2],  // 230
				[3,3,3,3,2,2,2],  // 240
				[3,3,3,2,2,2,2],  // 250
				[3,3,2,2,2,2,2],  // 260
				[3,2,2,2,2,2,2],  // 270
				[2,2,2,2,2,2,2],  // 280
				[2,2,2,2,2,2,1],  // 290
				[2,2,2,2,2,1,1],  // 300
				[2,2,2,2,1,1,1],  // 310
				[2,2,2,1,1,1,1],  // 320
				[2,2,1,1,1,1,1],  // 330
				[2,1,1,1,1,1,1],  // 340
				[1,1,1,1,1,1,1]]; // 350
const indRLG = [0,4,4,4,4,4,4,4,3,3,3,3,3,3,3,2,2,2,2,2,2,2,1]; // Nombre d'indices à la demande par grille

const tailleLigne   = [6, 7, 8, 9,10,11,10, 9, 8, 7, 6];
const tailleMinMot	= 8;
const tailleMaxMot	= 15;

const nbMaxAbsentes	= 8;
const nbLignes		= 11;
const nbLettres		= 26;
const nbCases		= 91;

const charCodeMin   = 64;

const typeCoul		= new creeTypeCoul();

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// Couleurs
// 0=gris, 1=vert, 2=rouge
const stCoul          	 = 'gvr';

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
const idIndices			 = 'indices';
const idBtnGauche		 = 'btn1';
const idBtnDroite		 = 'btn2';
const idBtnTop			 = 'btn4'; // v1.3

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
const cptNoir			 = 'o';
const cptSep			 = '-';
const motVert			 = 'v';
const motGris			 = 'g';
const motRouge			 = 'r';
const cotesNS		 	 = 'cngsg';
const cotesSN		 	 = 'csgng';
const prmDico			 = 'dico';
const hrefDef			 = 'def';
const sablier			 = 'sablier'; 
const bonus				 = 'bonus';
const topRouge			 = 'tr'; // v1.3
const topBleu			 = 'tb'; // v1.3
const topGris			 = 'tg'; // v1.3

// Diverses chaînes
const stLettre           = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const espace             = ' ';
const joker				 = '?';
const mystere			 = '-';
const vide				 = '';
const pluriel			 = 's';
const stDebug			 = 'DEBUG'; // Permet d'avoir les solutions en touchant %

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
const stConfirmation	 = 'Confirmation';
const stChoixInterdit	 = 'Choix interdit';

// Divers
const indefini          = -1;
const oui               = true;
const non               = false;
const suivante			= oui;
const precedente		= non;

// pour getItem
const vrai				= 'true'; 
const faux              = 'false';

// localStorage
const lsVermissimax		= 'Vermissimax';
const lsRLG				= 'RLG';
const lsLC				= 'LC'
const lsFR				= 'FR';
const lsStatsEtTops		= 'S&T';
const lsTop				= 't';
const lsSET				= ['np','ng','s','b','bm','t','tm','p','gp','m','xf','xp'];
const lsCase			= 'h';
const lsGrille			= 'grille';
const lsScoreGrille     = 'scg';
const lsAttrCases       = 'lvr';
const lsAttrScores      = ['s','b','sm','bm','p','pm']; 

//---------------------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// IA
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

var toucheAutorisee = non; // active clic(x) si oui. Non sauvegardé

var imgSrcGrilleSvg = vide; // Image avant sablier pour restauration. Non sauvegardé

// Grille hexagonale
var h = []; // Sauvegardé (h[x][y].charge/sauve)

// Définition de la grille : 7 mots de 12 lettres remplissant la grille (RLG) : 
var iMotRLG = indefini; 
var stMotsRLG = [vide,vide,vide,vide,vide,vide,vide]; // Mots obligatoires remplissant la grille.
var dRLG = [ // direction de chaque lettre de chaque mot. dRLG[m][l] est la direction de la (l+2)ème lettre à partir de la (l+1)ème lettre du (m+1)ème mot.
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie],
			[typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie,typeDir.dIndefinie]];
// Indices de départ : quelques initiales selon difficulté (cf. iniRLG)
var stInitiales = ['','','','','','',''];

// Mode jeu en cours
var filRouge = non; // Vermissimax, correspond au fil orange d'OsmotissimoT
var initialesAffichees = non; // Indique si les 7 points de départ sont affichées en rouge ou non (6 coins + le centre)
var nbLettresChoisies = 0; // Nombre de Lettres Choisies. Coordonnées et directions {x|y|d}LC 
var xLC = [indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini];
var yLC = [indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini,indefini];

// Fil Rouge
var iMotFR = indefini; // Indique le mot Fil Rouge courant à chercher 0=Premier et 6=Dernier.
var initialeFR = indefini; // 0=A, 1=B, etc.
var initialeSR = indefini; // idem mais pour avoir les solutions en touchant "%"
var stTopInitialesFR = ''; // v1.3 : Liste des Tops Initiales 

var xFR = [indefini,indefini,indefini,indefini,indefini,indefini,indefini]; // abscisses des points de départ
var yFR = [indefini,indefini,indefini,indefini,indefini,indefini,indefini]; // ordonnées des points de départ
var nFR = [0,0,0,0,0,0,0]; // [n]ombre de mots trouvés par point de départ FR (7)
var tFR = [0,0,0,0,0,0,0]; // [t]aille max des mots trouvés par initiale possible A~Z (26) et par point de départ FR (7)
var rFR = [0,0,0,0,0,0,0]; // Tailles des mots [r]éponses du joueur pour chaque point de départ (7)
var sFR = [vide,vide,vide,vide,vide,vide,vide]; // [s]olutions possibles des tailles maximum par point de départ (7)

// Dictionnaire de définition
var dicoDef = 0; // Par défaut = cnrtl.
var stDrnMotForme = [espace, espace, espace, espace, espace, espace, espace, espace, espace, espace, espace, espace, espace, espace, espace]; // Permet d'afficher sa définition (à sauvegarder)
var stDernierMotTrouve = vide; // Dernier mot trouvé (pour dictionnaire)
var affichagesChgtDico = 0; // Nombre d'affichages de changement de dico (limité au nombre de dicos). 

// Eléments de partie
var nbMotsRestants = indefini; // Mots RLG ou FR restants à trouver (sert à détecter la fin de la première partie ou du Fil Rouge pour passer à l'étape suivante.
var grille = 0; // numéro. La première c'est 1. constants à la création de grille
var indices = 0; // 3 pour les 7 grilles, 2 pour les 7 suivantes, etc. 
var scoreGrille = new creeScoreGrille(); // scorePartie() renvoie le score de la partie (calculé). 

// Stats & Tops
var statsEtTops = new creeStatsEtTops();

// Drapeaux
var attenteGrilleDemandee = non; // Permet de savoir si l'on attend de toucher "Grille" pour continuer (transition entre manches et entre grilles)
var confirmationGrilleDemandee = non; // Permet de toucher DEUX FOIS "Grille" pour abandonner ou passer à la grille suivante dans le Fil Rouge. NE PAS SAUVEGARDER
var aideSelectionMot = oui; // Indique s'il faut afficher une aide pour indiquer comment sélectionner un mot (affiché une fois).
var aideChoixInitialeFR = oui; // Indique s'il faut afficher une aide concernant le choix de l'initiale dans le Fil Rouge (affiché une fois).
var aideSelectionMotFR = oui; // Indique s'il faut afficher une aide pour indiquer comment sélectionner un mot dans le Fil Rouge (affiché une fois).
var affichageMsgFilRouge = oui; // Indique s'il faut afficher le message de bienvenue dans le Fil Rouge
var affichageMsgMotTrvRLG = oui; // Indique s'il faut afficher un message quand un mot de 12 est trouvé (manche verte)
var affichageMsgPtDepart = oui; // Indique s'il faut afficher un message indiquant que l'on ne peut pas choisir un point de départ à l'intérieur d'un mot (affiché une fois).
var affichageSolutions = non; // Indique si les solutions de la manche verte sont en cours d'affichage (après abandon)
var touchesStatsEtTop = 0; // Indique combien de fois on a touché % pour Tops, Stats et Réinitialisation. Non sauvegardé
var partieNouvelle = oui; // Indique si au lancement on a commencé une nouvelle partie (oui) ou chargé une partie en cours (non). Non sauvegardé.
var rechercheTopsInitialesFR = oui; // v1.3 : Indique si la recherche des Tops Initiales est lancée après le choix d'une lettre dans le Fil Rouge 
// Débogage (non sauvegardés)
var essais = 0;
var debug = 0; // toucher DEBUG permet d'accéder aux solutions en touchant % mais debug doit valoir 5

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
    this.cRouge = 2;
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
    if ((xx<0)||(yy<0)||(xx>nbLignes-1)||(yy>nbLignes-1)) 
        return non;
    if ((yy>xyMax[xx])||(xx>xyMax[yy]))
    	return non;
    else
        return oui;
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
function distance(x1, y1, x2, y2) // retourne le nombre de lettres entre les deux points ALIGNES, extrémités comprises. Suppose que direction(x1,y1,x2,y2) est non nul.
{
	// 0h/6h
	if (x1-x2==y1-y2) {
		if ((x1>x2) && (y1>y2)) 
			return x1-x2;
		if ((x2>x1) && (y2>y1)) 
			return x2-x1;
	}
	// 2h/8h
	if (y1==y2) {
		if (x1>x2)
			return x1-x2;
		if (x2>x1)
			return x2-x1;
	} 
	// 4h/10h
	if (x1==x2) {
		if (y1>y2)
			return y1-y2;
		if (y2>y1)
			return y2-y1;
	} 
	return 0;
}
//---------------------------------------------------------------------------
function cases(x1, y1, x2, y2) // retourne le nombre de cases entre deux points
{
	// Axe Oh/6h
	var d0=Math.abs((x1-y1)-(x2-y2));
	var d1=Math.abs(x1-x2);
	var d2=Math.abs(y1-y2);
	return Math.min(d0+d1,d0+d2,d1+d2);
}
//---------------------------------------------------------------------------
function estLettrePDDLPP(l0, x, y) // retourne oui si l est égale à la lettre du ou des points de départ de la 1ère manche le(s) plus proche(s) 
{
	var d;
	var d0 = tailleMaxMot;
	var l = vide;
	for(var i=0; i<nbMotsRLG;i++) {
		d = cases(xRLG[i], yRLG[i], x, y);
		if (d == d0)
			l = l + h[xRLG[i]][yRLG[i]].l;
		if (d < d0) {
			l = h[xRLG[i]][yRLG[i]].l;
			d0 = d;
		}
	}
	if (l.indexOf(l0)>indefini) {
		if ((l.length==1)||(l[0]==l[1])) 
			alert('Vous ne pouvez pas choisir la lettre "'+l[0]+'" qui est la lettre du point de départ de la 1ère manche le plus proche (coins ou centre).\n\nChoisissez une autre lettre.');
		else
			alert('Vous ne pouvez pas choisir les lettres "'+l[0]+'" et "'+l[1]+'" qui sont les lettres des deux points de départ de la 1ère manche les plus proches (coins ou centre).\n\nChoisissez une autre lettre.');
		return oui;
	}
	else
		return non;
}
//---------------------------------------------------------------------------
function afficheLettresInexistantes(liste)
{
	for(var i=0; i<nbMaxAbsentes; i++) {
		// Hexagone
		var id = idLettre + (i+1);
		var nvSrc = chmPng + ((i<liste.length)?(liste[i]+motGris+'0'):hexaVide) + extPng;
		document.images[id].src = nvSrc;

		// Côté GN
		id = (((i==1)||(i==6))?(sud+((i%2)?'6':'3')+(i+1)):(idBordGN+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==1)||(i==6))&&(((i%2)?5:2)<liste.length))?cotesSN:(coteGN+motGris)):((((i==1)||(i==6))&&(((i%2)?5:2)<liste.length))?(coteDS+motGris):coteVide)) + extPng; 
		document.images[id].src = nvSrc;
		
		// Côté DN
		id = (((i==0)||(i==7))?(nord+(i+1)+((i%2)?'4':'5')):(idBordDN+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==0)||(i==7))&&(((i%2)?3:4)<liste.length))?cotesNS:(coteDN+motGris)):((((i==0)||(i==7))&&(((i%2)?3:4)<liste.length))?(coteGS+motGris):coteVide)) + extPng; 
		document.images[id].src = nvSrc;
		
		// Côté GS
		id = (((i==3)||(i==4))?(nord+((i%2)?'8':'1')+(i+1)):(idBordGS+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==3)||(i==4))&&(((i%2)?7:0)<liste.length))?cotesNS:(coteGS+motGris)):((((i==3)||(i==4))&&(((i%2)?7:0)<liste.length))?(coteDN+motGris):coteVide)) + extPng; 
		document.images[id].src = nvSrc;
		
		// Côté DS
		id = (((i==2)||(i==5))?(sud+(i+1)+((i%2)?'2':'7')):(idBordDS+(i+1)));
		nvSrc = chmPng + ((i<liste.length)?((((i==2)||(i==5))&&(((i%2)?1:6)<liste.length))?cotesSN:(coteDS+motGris)):((((i==2)||(i==5))&&(((i%2)?1:6)<liste.length))?(coteGN+motGris):coteVide)) + extPng; 
		document.images[id].src = nvSrc;
	}
}
//---------------------------------------------------------------------------
function montreLettresInexistantes()
{
	var li = vide;
	var nl = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++) {
			nl[h[x][y].l.charCodeAt(0)-charCodeMin]++;
			nl[0]++;
		}
	if (nbMotsRestants%2) {
		for(var l='A'.charCodeAt(0); l<='Z'.charCodeAt(0); l++)
			if (!nl[l-charCodeMin])
				li = li + String.fromCharCode(l);
	}
	else {
		for(var l='Z'.charCodeAt(0); l>='A'.charCodeAt(0); l--)
			if (!nl[l-charCodeMin])
				li = li + String.fromCharCode(l);
	}
	afficheLettresInexistantes(li);
}
//---------------------------------------------------------------------------
function cacheLettresInexistantes()
{
	afficheLettresInexistantes(vide);
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
function caseInitialise()
{
	this.l = joker; 
	this.vert = non;
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
	this.score = 0; this.scoreMax = 0;
	this.bonus = 0; this.bonusMax = 0;
	this.partie = 0; this.partieMax = 0; 
	
	// Méthodes
	this.total = scoreGrilleTotal;
	this.totalMax = scoreGrilleTotalMax; 
	this.enregistre = scoreGrilleEnregistre;
	this.initialise = scoreGrilleInitialise; 
	// this.charge = scoreGrilleCharge; // constructeur
}
//---------------------------------------------------------------------------
function scoreGrilleInitialise()
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
// méthodes de classes
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// classe case
//---------------------------------------------------------------------------
function caseCouleur()
{
	return (this.rouge?typeCoul.cRouge:(this.vert?typeCoul.cVerte:typeCoul.cGrise));
}
//---------------------------------------------------------------------------
function caseAffiche()
{
	var x=this.x; var y=this.y; var c=this.couleur();

	// 1. On rafraîchit d'abord la lettre
	var id = idLettre + idXY[x] + idXY[y];
	var nvSrc = chmPng + this.l + stCoul[c] + 
				((estValide(x, y, typeDir.d0h)?1:0) + // liaison Nord ?
				 (estValide(x, y, typeDir.d6h)?2:0)) + // liaison Sud ?
				extPng;
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
	localStorage.setItem(prefixe + lsAttrCases[2], this.rouge);
}
//---------------------------------------------------------------------------
function caseCharge(x, y)
{
	var prefixe = lsCase + String.fromCharCode(1 + charCodeMin + x) + String.fromCharCode(1 + charCodeMin + y);
	this.l = localStorage.getItem(prefixe + lsAttrCases[0]);
	this.vert = (localStorage.getItem(prefixe + lsAttrCases[1]) == vrai);
	this.rouge = (localStorage.getItem(prefixe + lsAttrCases[2]) == vrai);
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
function scoreGrilleEnregistre() 
{
	localStorage.setItem(lsScoreGrille + lsAttrScores[0], this.score);
	localStorage.setItem(lsScoreGrille + lsAttrScores[1], this.bonus);
	localStorage.setItem(lsScoreGrille + lsAttrScores[2], this.scoreMax);
	localStorage.setItem(lsScoreGrille + lsAttrScores[3], this.bonusMax);
	localStorage.setItem(lsScoreGrille + lsAttrScores[4], this.partie); 
	localStorage.setItem(lsScoreGrille + lsAttrScores[5], this.partieMax); 
}
//---------------------------------------------------------------------------
function scoreGrilleCharge() 
{
	// Méthodes
	this.total = scoreGrilleTotal;
	this.totalMax = scoreGrilleTotalMax; 
	this.enregistre = scoreGrilleEnregistre;
	this.initialise = scoreGrilleInitialise; 
	// this.charge = scoreGrilleCharge; // constructeur

	this.score = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[0]));
	this.bonus = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[1]));
	this.scoreMax = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[2]));
	this.bonusMax = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[3]));
	this.partie = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[4])); 
	this.partieMax = parseInt(localStorage.getItem(lsScoreGrille + lsAttrScores[5])); 
}

//---------------------------------------------------------------------------
// AUTRES FONCTIONS
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// Affichage des compteurs
//---------------------------------------------------------------------------
function afficheNumerateurCompteur(etat) // affiche la taille du mot trouvé pour le point de départ courant (iMotFR). etat = {cptRouge, cptVert, cptGris, cptNoir}
{
	var couleur = etat; 
	var t=rFR[iMotFR]; // Nombre de lettres du mot choisi par le joueur
	var u = t%10; // A FAIRE
	var d = Math.floor(t/10); // A FAIRE
	var id; var nvSrc;
	var idSep = idCptSep + iMotFR;
	var coulPrc;
	var coulSep = document.images[idSep].src[5];
	
	// Dizaines
	id = 'cnd' + iMotFR;
	coulPrc = document.images[id].src[5];
	nvSrc = chmPng + d + couleur + extPng;
	document.images[id].src = nvSrc;	

	// Unités
	id = 'cnu' + iMotFR;
	nvSrc = chmPng + u + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheSeparateurCompteur(etat) // affiche le séparateur pour le point de départ courant (iMotFR). etat = {cptRouge, cptVert, cptGris, cptNoir}
{
	var couleur = etat;
	var id = idCptSep + iMotFR; 
	var nvSrc = chmPng + cptSep + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheDenominateurCompteur(etat) // affiche la taille max possible pour le point de départ courant (iMotFR). etat = {cptRouge, cptVert, cptGris, cptNoir}
{
	var couleur = etat; 
	var u = tFR[iMotFR]%10; 
	var d = Math.floor(tFR[iMotFR]/10); 
	var id; var nvSrc;

	// Dizaines
	id = 'cdd' + iMotFR;
	nvSrc = chmPng + d + couleur + extPng;
	document.images[id].src = nvSrc;	

	// Unités
	id = 'cdu' + iMotFR;
	nvSrc = chmPng + u + couleur + extPng;
	document.images[id].src = nvSrc;	
}
//---------------------------------------------------------------------------
function afficheCompteur(etat) // affiche la taille des mots pour le point de départ courant (iMotFR). etat = {cptRouge, cptVert, cptGris, cptNoir}
{
	afficheDenominateurCompteur(etat);
	afficheSeparateurCompteur(etat);
	afficheNumerateurCompteur(etat);
}
//---------------------------------------------------------------------------
function afficheCompteurs() // Au chargement de la partie
{
	var iFR = iMotFR;
	for(iMotFR=0; iMotFR<nbMotsFR; iMotFR++)
		afficheCompteur(filRouge?(nFR[iMotFR]?((rFR[iMotFR]<tFR[iMotFR])?cptRouge:cptVert):(tFR[iMotFR]?cptNoir:cptGris)):cptGris);
	iMotFR = iFR;		
}
//---------------------------------------------------------------------------

//------------------------
// Génération de la Grille
//------------------------

//---------------------------------------------------------------------------
function majAffichageInitialeFR(montre)
{
	h[xFR[iMotFR]][yFR[iMotFR]].vert=(h[xFR[iMotFR]][yFR[iMotFR]].l==mystere)&&(!montre);
	h[xFR[iMotFR]][yFR[iMotFR]].rouge=montre;
	h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
	h[xFR[iMotFR]][yFR[iMotFR]].affiche();
	initialesAffichees = montre;
	localStorage.ia = initialesAffichees;
}
//---------------------------------------------------------------------------
function majAffichageInitiales(montre)
{
	for(var i=0; i<nbMotsRLG; i++)
		if (!h[xRLG[i]][yRLG[i]].vert) {
			var x=xRLG[i];
			var y=yRLG[i];
			h[x][y].rouge=montre;
			h[x][y].enregistre();
			h[x][y].affiche();
			if (nbMotsRestants==1) { // S'il reste un point de départ, on le sélectionne automatiquement
				iMotRLG = i;
				localStorage.RLGi = iMotRLG;
				h[x][y].rouge = oui;
				h[x][y].enregistre();
				h[x][y].affiche();
				xLC[nbLettresChoisies]=x;
				yLC[nbLettresChoisies]=y;
				stDrnMotForme[nbLettresChoisies] = h[x][y].l;
				enregistreLC(nbLettresChoisies);
				nbLettresChoisies++;
				localStorage.LCn = nbLettresChoisies;
			}
		}
	initialesAffichees = montre;
	localStorage.ia = initialesAffichees;
	return (nbMotsRestants!=1);
}
//---------------------------------------------------------------------------
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
function existeMotsDico(filtre, l)
{
	var iMin = 0;
	var iMax = dico[l].length-1;
	var OK = non;
	while((!OK)&&(iMax-iMin>1)) {
		var i= Math.floor((iMin+iMax)/2);
		if (dico[l][i].indexOf(filtre)>indefini)
			OK = oui;
		else
			if (dico[l][i]<filtre)
				iMin = i;
			else
				iMax = i;
	}
	// On a trouvé un début de filtre ou alors l'une des bornes est un début de filtre (si elles sont proches)
	return OK||(dico[l][iMin].indexOf(filtre)>indefini)||(dico[l][iMax].indexOf(filtre)>indefini); 
}
//---------------------------------------------------------------------------
function existeMots(filtre)
{
	var OK=non;
	var f=filtre.length;
	for(var l=Math.max(0,filtre.length-tailleMinMot); (!OK)&&(l<tailleMaxMot-tailleMinMot); l++)
		if (existeMotsDico(filtre, l)) 
			OK=oui;
	return OK;
}
//---------------------------------------------------------------------------
function unMotDeTaille(taille)
{
	var t = taille-tailleMinMot;
	return dico[t][Math.floor(dico[t].length*Math.random())];
}
//---------------------------------------------------------------------------
// REMPLISSAGE DE LA GRILLE
//---------------------------------------------------------------------------
function remplitGrilleAvecMot(iMot, stMotAPlacer, posLettre, x, y) // retourne oui si remplissage possible et effectué. Fonction récursive utilisée par Remplit Grille 
{
	// 1. On cherche une direction pour la lettre du mot en cours
	var nd = 0;
	var dp = [0, 0, 0, 0, 0, 0, 0];
	var d = typeDir.dIndefinie;
	// 2. On calcule les directions possibles
	for(var d=typeDir.d0h; d<=typeDir.d10h; d++) {
		if (estValide(x, y, d))
			if (h[x+dx[d]][y+dy[d]].l == joker) {
				var choixOK = oui;
				// On ne doit pas être sur la case centrale ou les coins
				for(var i=0; choixOK&&(i<nbMotsRLG); i++)
					choixOK=((x+dx[d]!=xRLG[i])||(y+dy[d]!=yRLG[i]));
				if (choixOK) {
					dp[nd]=d;
					nd++;
				}
			}
	}
	// 3. On continue...
	if (!nd) // Pas possible...
		return non; // On indique que ce n'est pas possible
	else { // Toujours possible...
		h[x][y].l = stMotAPlacer[posLettre]; // on pose la lettre du mot.
		if (posLettre+1 == stMotAPlacer.length) // A-t-on placé tout le mot ?
			return oui; // Oui : c'est fini, on a tout placé.
		else { // On choisit la direction au hasard parmi celles possibles
			do {
				var id = 0;
				
				do { id = Math.floor(nd*Math.random()); } while(!dp[id]);
				d = dp[id]; 
				// On retire la dirposs de la liste pas la reprendre ensuite en cas d'échec
				for(var i=id; i<nbMaxDir-1; i++) dp[i]=dp[i+1]; 
				nd--;
				
				dRLG[iMot][posLettre] = d; // On sauvegarde la direction; 
				if (!remplitGrilleAvecMot(iMot, stMotAPlacer, posLettre+1, x+dx[d], y+dy[d])) // Le reste a-t-il pu être placé ?
					continue; // Si on a encore d'autres dirposs, on continue sinon on efface la lettre...
				else
					return oui; // Le mot a été placé avec succès
			} while(nd>0);
			h[x][y].l = joker; // Pas de dirposs : on remet le joker
			dRLG[iMot][posLettre] = typeDir.dIndefinie; // On efface la sauvegarde de la direction; 
			return non;
		}
	}
}
//---------------------------------------------------------------------------
function remplitGrille()
{
	// 0. On initialise la grille et la liste des mots remplissant la grille  
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			h[x][y].initialise();
	for(var i=0; i<nbMotsRLG; i++) {
		stMotsRLG[i]=vide;
		for(var j=0; j<tailleMaxMot; j++)
			dRLG[i][j]=typeDir.dIndefinie;
	}
	// 1. On choisit au hasard 7 mots de 12 lettres
	var choixOK=oui;
	for(var i=0; i<nbMotsRLG; i++) {
		do {
			stMotsRLG[i]=unMotDeTaille(tailleMotRLG);
			choixOK=oui;
			for(var j=0; choixOK&&(j<i); j++)
				choixOK=(stMotsRLG[i]!=stMotsRLG[j]);
		} while(!choixOK);
	} 
	// 2. On essaie de les placer
	var poseOK=oui;
	for(var i=0; poseOK&&(i<nbMotsRLG); i++) 
		poseOK=remplitGrilleAvecMot(i, stMotsRLG[i], 0, xRLG[i], yRLG[i]); 
	return poseOK;
}
//---------------------------------------------------------------------------
function chercheMotsGrille(x, y, d, f, i, k)
{
	// Sauvegarde localStorage en sortie
	for(d[k]=typeDir.d0h; d[k]<=typeDir.d10h; d[k]++) 
		if (estValide(x[k], y[k], d[k])) {
			x[k+1]=x[k]+dx[d[k]];
			y[k+1]=y[k]+dy[d[k]];
			if ((!h[x[k+1]][y[k+1]].rouge)&&(!h[x[k+1]][y[k+1]].vert)&&(h[x[k+1]][y[k+1]].l!=mystere)&&(h[x[k+1]][y[k+1]].l!=joker)) { // La case doit être une lettre grise
				f=f+h[x[k+1]][y[k+1]].l; // On ajoute la lettre au filtre
				var t=k+2; // taille courante
				h[x[k+1]][y[k+1]].rouge=oui; // On marque la case comme utilisée
				if ((t>=tailleMinMot)&&
					(dico[f.length-tailleMinMot].indexOf(f)>indefini)) { 
					if (tFR[i]<t) { // 1. On a trouvé un mot plus long
						tFR[i]=t;
						nFR[i]=1;
						sFR[i]=f+espace; // On refait la liste des mots trouvés
					}
					else if (tFR[i]==t) // 2. C'est la taille en cours, on incrémente le comptage de mot (sans doublons).
						if (sFR[i].indexOf(f)==indefini) {
							nFR[i]++; // On incrémente le comptage de mot...
							sFR[i]=sFR[i]+f+' '; // Et la liste des solutions
						}
				}
				if ((t<15)&&(existeMots(f)))
					chercheMotsGrille(x, y, d, f, i, k+1); 
				h[x[k+1]][y[k+1]].rouge=non; // On démarque la case comme plus utilisée
				f=f.substr(0,t-1); // On retire la lettre du filtre
			}
	}
}
//---------------------------------------------------------------------------
function reinitialiseFR() // Réinitialise les points de départs FR et les compteurs FR (nFR,tFR,sFR)
{
	// /!\ Sauvegarde localStorage faite en sortie
	for(iMotFR=0; iMotFR<nbMotsFR; iMotFR++) { // On réinitialise les compteurs que l'on affiche en gris.
		rFR[iMotFR]=0;
		nFR[iMotFR]=0;
		tFR[iMotFR]=0;
		sFR[iMotFR]=vide;
		afficheCompteur(cptGris);
	}
	iMotFR = indefini;
	initialeFR = indefini;
}
//---------------------------------------------------------------------------
function initialiseCompteursFR() // Définit les points de départs FR et réinitialise les compteurs FR (nFR,tFR,sFR)
{
	// /!\ Sauvegarde localStorage faite en sortie
	var i=0;
	// Définition des points de départ
	for(var x=0; x<nbLignes; x++)
		for(y=xyMin[x]; y<=xyMax[x]; y++)
			if (h[x][y].l==mystere) {
				xFR[i]=x;
				yFR[i]=y;
				i++;
			}
	// Initialisation des stats et choix
	reinitialiseFR();
}
//---------------------------------------------------------------------------
function enregistreFR(iFR)
{
	var iMin = ((iFR==undefined)?0:iFR);
	var iMax = ((iFR==undefined)?nbMotsFR:iFR+1);
	localStorage.FR = filRouge;
	localStorage.FRrti = rechercheTopsInitialesFR; // v1.3
	localStorage.FRti = stTopInitialesFR; // v1.3
	localStorage.FRim = iMotFR;
	localStorage.FRin = initialeFR;
	localStorage.FRis = initialeSR;
	for(var i=iMin; i<iMax; i++) {
		localStorage.setItem(lsFR+'x'+i, xFR[i]);
		localStorage.setItem(lsFR+'y'+i, yFR[i]);
		localStorage.setItem(lsFR+'n'+i, nFR[i]);
		localStorage.setItem(lsFR+'t'+i, tFR[i]);
		localStorage.setItem(lsFR+'r'+i, rFR[i]);
		localStorage.setItem(lsFR+'s'+i, sFR[i]);
	}
}
//---------------------------------------------------------------------------
function releveMotsFR() // Cherche les plus longs mots possibles du point de départ courant du Fil Rouge (point de départ n°iMotFR) avec la lettre choisie initialeFR
{ // Pré-requis : iMotFR et h[x[0]][y[0]].l définis (initialeFR est défini ici).
	// Comptage
	var x = [indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini];
	var y = [indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini];
	var d = [typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie, typeDir.dIndefinie];
	var lettre = espace;
	var f = ''; // Mot formé récursivement (filtre)
	x[0] = xFR[iMotFR];
	y[0] = yFR[iMotFR];
	h[x[0]][y[0]].rouge = oui; // On marque le point de départ
	h[x[0]][y[0]].enregistre();
	lettre = h[x[0]][y[0]].l;
	initialeFR = lettre.charCodeAt(0)-charCodeMin-1;
	localStorage.FRin = initialeFR;
	f = lettre;
	chercheMotsGrille(x, y, d, f, iMotFR, 0);
	enregistreFR(iMotFR);
	return (nFR[iMotFR]>0);
}
//---------------------------------------------------------------------------
function afficheTopInitialesFR(affiche) // v1.3
{
	if (affiche) 
		document.images[idBtnTop].src = chmPng + topRouge + extPng;
	else {
		if (rechercheTopsInitialesFR == oui)
			document.images[idBtnTop].src = chmPng + topBleu + extPng;
		else
			document.images[idBtnTop].src = chmPng + topGris + extPng;
		stTopInitialesFR = '';
		localStorage.FRti = stTopInitialesFR;
	}
}
//---------------------------------------------------------------------------
function chercheTopsInitialesFR(lettreChoisie, tFRmax) // v1.3 : "Top Initiales" : Cherche les initiales donnant les plus longs mots possibles du dernier point de départ (iMotDrnFR)
{
	var stSolutionTop;
	// Lecture de la situation
	initialeSR = parseInt(localStorage.FRis);
	stTopInitialesFR = localStorage.FRti;	
	if (initialeSR < nbLettres - 1) {
		initialeSR += 1;
		var lettreCrt = String.fromCharCode(1+charCodeMin+initialeSR);
		if (lettreCrt != lettreChoisie) {
			var imgSrcProgression = lettreCrt + 't';
			h[xFR[iMotFR]][yFR[iMotFR]].l=String.fromCharCode(1+charCodeMin+initialeSR); 
			h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
			rFR[iMotFR]=0;
			nFR[iMotFR]=0;
			tFR[iMotFR]=0;
			sFR[iMotFR]=vide;
			if (releveMotsFR()) {
				stSolutionTop = 'Avec '+String.fromCharCode(1+charCodeMin+initialeSR)+', '+nFR[iMotFR]+' mot'+((nFR[iMotFR]>1)?'s':'')+' de '+tFR[iMotFR]+' lettres ('+sFR[iMotFR].trim()+')';
				if (tFR[iMotFR] == tFRmax) { // On a trouvé une lettre ayant le même nombre de plus longs mots 
					stTopInitialesFR = stTopInitialesFR + '\n' + stSolutionTop;
					imgSrcProgression = imgSrcProgression + '2'; // Orange
				}
				else {
					if (tFR[iMotFR] > tFRmax) { // On a trouvé une lettre ayant des mots plus longs !
						tFRmax = tFR[iMotFR];
						stTopInitialesFR = stSolutionTop;
						imgSrcProgression = imgSrcProgression + '3'; // Rouge
					}
					else
						imgSrcProgression = imgSrcProgression + '1'; // Vert
				}
			}
			else 
				imgSrcProgression = imgSrcProgression + '0'; // Noir
			initialeFR = indefini;
			localStorage.FRin = initialeFR;
			h[xFR[iMotFR]][yFR[iMotFR]].l=mystere;
			h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
			document.images[idBtnTop].src = chmPng + imgSrcProgression + extPng; // On affiche la progression à la place de "Top"
		}
		localStorage.FRis = initialeSR
		localStorage.FRti = stTopInitialesFR;	
		setTimeout(function() { // On poursuit la recherche à la lettre suivante
			chercheTopsInitialesFR(lettreChoisie, tFRmax);
		}, 500);
	}
	else { // On a fini !
		initialeSR = indefini;
		localStorage.FRis = initialeSR
		affecteLettreFR(lettreChoisie); // on affecte le choix de l'initiale du joueur
		afficheSablier(non); // on enlève le sablier
		afficheTopInitialesFR(oui); // on remet Top (mais en rouge)
		toucheAutorisee = oui; // On lève l'interdiction de toucher
	}
}
//---------------------------------------------------------------------------
function enregistreLC(i) 
{
	localStorage.setItem(lsLC+'x'+String.fromCharCode(1+charCodeMin+i), xLC[i]);
	localStorage.setItem(lsLC+'y'+String.fromCharCode(1+charCodeMin+i), yLC[i]);
	localStorage.setItem('dmf'+String.fromCharCode(1+charCodeMin+i), stDrnMotForme[i]);
}
//---------------------------------------------------------------------------
function enregistrePartie()
{
	enregistreGrille();
	// Eléments de partie
	localStorage.nmr= nbMotsRestants;
	localStorage.grille = grille;
	localStorage.indices = indices;
	enregistreScoreGrille();
	// RLG (1ère manche)
	localStorage.RLGi = iMotRLG;
	for(var i=0; i<nbMotsRLG; i++) {
		localStorage.setItem(lsRLG+'m'+i, stMotsRLG[i]);
		for(var j=0; j<tailleMotRLG-1; j++)
			localStorage.setItem(lsRLG+'d'+i+String.fromCharCode(1+charCodeMin+j), dRLG[i][j]);
		localStorage.setItem(lsRLG+'i'+i, stInitiales[i]);
	}

	// Mode de jeu & LC (sélection en cours)
	localStorage.ia = initialesAffichees;
	localStorage.LCn = nbLettresChoisies;
	for(var i=0; i<nbLettresChoisies; i++) 
		enregistreLC(i);

	// Fil Rouge
	enregistreFR();	

	// Dicos de définition
	localStorage.dd = dicoDef;
	localStorage.dmt = stDernierMotTrouve;
	localStorage.acd = affichagesChgtDico;
	
	// Drapeaux
	localStorage.agd = attenteGrilleDemandee;
	localStorage.asm = aideSelectionMot;
	localStorage.aci = aideChoixInitialeFR;
	localStorage.asm = aideSelectionMotFR;
	localStorage.mfr = affichageMsgFilRouge;
	localStorage.mmt = affichageMsgMotTrvRLG;
	localStorage.mpd = affichageMsgPtDepart;
	localStorage.as  = affichageSolutions;
	localStorage.Vermissimax = oui; // Assure de l'intégrité de la sauvegarde de la partie (testée en tête de chargePartie)
}
//---------------------------------------------------------------------------
function chargePartie() // Retourne oui si un chargement a été effectué
{
	if (!localStorage.getItem(lsVermissimax))
		return non;
	chargeGrille();
	// Eléments de partie
	nbMotsRestants = parseInt(localStorage.nmr);
	grille = parseInt(localStorage.grille);
	indices = parseInt(localStorage.indices);
	chargeScoreGrille();
	// RLG (1ère manche)
	iMotRLG = parseInt(localStorage.RLGi);
	for(var i=0; i<nbMotsRLG; i++) {
		stMotsRLG[i] = localStorage.getItem(lsRLG+'m'+i);
		for(var j=0; j<tailleMotRLG-1; j++)
			dRLG[i][j] = parseInt(localStorage.getItem(lsRLG+'d'+i+String.fromCharCode(1+charCodeMin+j)));
		stInitiales[i] = localStorage.getItem(lsRLG+'i'+i);
	}
	// Mode de jeu & LC (sélection en cours)
	filRouge = (localStorage.FR == vrai);
	initialesAffichees = (localStorage.ia == vrai);
	nbLettresChoisies = parseInt(localStorage.LCn);
	for(var i=0; i<nbLettresChoisies; i++) {
		stDrnMotForme[i] = localStorage.getItem('dmf'+String.fromCharCode(1+charCodeMin+i));
		xLC[i] = parseInt(localStorage.getItem(lsLC+'x'+String.fromCharCode(1+charCodeMin+i)));
		yLC[i] = parseInt(localStorage.getItem(lsLC+'y'+String.fromCharCode(1+charCodeMin+i)));
	}
	// FR (Fil Rouge)
	iMotFR = parseInt(localStorage.FRim);
	if (localStorage.FRrti == undefined) // v1.3
		rechercheTopsInitialesFR = oui; // Activé par défaut 
	else
		rechercheTopsInitialesFR = (localStorage.FRrti == vrai); // v1.3 : option de recherche (oui/non)
	stTopInitialesFR = localStorage.FRti; // v1.3 : liste des tops Initiales
	afficheTopInitialesFR((stTopInitialesFR != undefined) && (stTopInitialesFR.length > 0)); // v1.3
	initialeFR = parseInt(localStorage.FRin);
	initialeSR = parseInt(localStorage.FRis);
	for(var i=0; i<nbMotsFR; i++) {
		xFR[i]=parseInt(localStorage.getItem(lsFR+'x'+i));
		yFR[i]=parseInt(localStorage.getItem(lsFR+'y'+i));
		nFR[i]=parseInt(localStorage.getItem(lsFR+'n'+i));
		tFR[i]=parseInt(localStorage.getItem(lsFR+'t'+i));
		rFR[i]=parseInt(localStorage.getItem(lsFR+'r'+i));
		sFR[i]=localStorage.getItem(lsFR+'s'+i);
	}
	
	// dicos de définition
	dicoDef = parseInt(localStorage.dd);
	stDernierMotTrouve = localStorage.dmt;
	affichagesChgtDico = parseInt(localStorage.acd);
	
	// Stats & Tops
	statsEtTops.charge();
	
	// Drapeaux
	attenteGrilleDemandee = (localStorage.agd == vrai);
	confirmationGrilleDemandee = non;
	aideSelectionMot = (localStorage.asm == vrai);
	aideChoixInitialeFR = (localStorage.aci == vrai);
	aideSelectionMotFR = (localStorage.asm == vrai);
	affichageMsgFilRouge = (localStorage.mfr == vrai);
	affichageMsgMotTrvRLG = (localStorage.mmt == vrai);
	affichageMsgPtDepart = (localStorage.mpd == vrai);
	affichageSolutions = (localStorage.as == vrai);
	if (affichageSolutions)
		confirmationGrilleDemandee = oui;
	return oui;
}
//---------------------------------------------------------------------------
function generePuisAfficheGrille(afficheMessage)
{
	// /!\ Sauvegarde localStorage à la fin
	essais = 0;
	// 1. On remplit la grille
	while(!remplitGrille()) essais++;
	// 2. On affiche les "?" verts (pour la deuxième manche)	
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			if (h[x][y].l == joker) {
				h[x][y].l = mystere;
				h[x][y].vert = oui;
			}
	// 3. On définit les indices de départ...
	for(var i=0; i<nbMotsRLG; i++) {
		stInitiales[i]=stMotsRLG[i].substr(0, iniRLG[Math.min(gMaxRLG,grille)][i]);
	}
	// 4. On affiche les 7 points de départ en rouge
	cacheLettresInexistantes();
	afficheGrille();
	if (majAffichageInitiales(oui))
		iMotRLG = indefini; // Si affichage de plusieurs initiales, on réinitialise le choix
	// 5. Scores Max
	scoreGrille.initialise();
	for(var i=0; i<nbMotsRLG; i++)
		scoreGrille.scoreMax += 10*(6-iniRLG[Math.min(gMaxRLG,grille)][i]);
	// Màj affichage des scores max
	afficheScore(); // v1.1 : on rafraîchit tout

	// 6. On efface les compteurs du Fil Rouge
	reinitialiseFR();
	
	// 7. On enregistre la partie
	enregistrePartie();
	
	if (afficheMessage)
   		setTimeout(function() { 
			alert('Voici la grille n°'+grille+'.\n\nLes indices de départ sont...\n'+stInitiales[0]+espace+stInitiales[1]+espace+stInitiales[2]+espace+stInitiales[3]+espace+stInitiales[4]+espace+stInitiales[5]+espace+stInitiales[6]+'\n\nPour revoir ces indices, touchez "Indices" sans sélectionner de lettres.\n\nTouchez "Grille" pour abandonner la partie.');
   		}, 500);
}
//---------------------------------------------------------------------------
function majAffichageMotChoisi(affiche) // Mot + Score
{
	var taille = tailleMaxMot;
	var score = ((grille&&nbLettresChoisies&&h[xLC[0]][yLC[0]].vert)?(filRouge?nbLettresChoisies:10*(6-iniRLG[Math.min(gMaxRLG,grille)][iMotRLG])):0);
	var dizaines = Math.floor(score/10);
	var unites = score%10;
	var coulFin = (nbLettresChoisies<tailleMaxMot)?vide:(h[xLC[tailleMaxMot-1]][yLC[tailleMaxMot-1]].rouge?motGris:motVert);
	var id = 'msd';
	var lettre = espace;
	var nvSrc = chmPng + ((affiche&&nbLettresChoisies)?'sd'+(h[xLC[0]][yLC[0]].rouge?motGris:motVert):fond) + extPng;
	document.images[id].src = nvSrc;	
	for(var k=0; k<tailleMaxMot-1; k++) {
		lettre = stDrnMotForme[k];
		if (nbLettresChoisies>k+1)
			sepPng = 'sg'+(h[xLC[k]][yLC[k]].rouge?motGris:motVert)+
				  	  'd' +(h[xLC[k+1]][yLC[k+1]].rouge?motGris:motVert);
		else if (nbLettresChoisies==k+1)
			sepPng = 'sf'+(h[xLC[k]][yLC[k]].rouge?motGris:motVert);
		else
			sepPng = fond;
		id = 'ml'+ String.fromCharCode(1+charCodeMin+k+tailleMaxMot-taille);
		nvSrc = chmPng + ((affiche&&(k<nbLettresChoisies))?(lettre+sepPng[2]+'0'):fond) + extPng;
		document.images[id].src = nvSrc;
		id = 'ms'+ String.fromCharCode(1+charCodeMin+k+tailleMaxMot-taille) + String.fromCharCode(2+charCodeMin+k+tailleMaxMot-taille);
		nvSrc = chmPng + (affiche?sepPng:fond) + extPng;
		document.images[id].src = nvSrc;
	}
	// Butoir 1ère manche
	if (!filRouge) {
		var img = 'd'+(nbMotsRLG-nbMotsRestants);
		document.images['mlM'].src = chmPng + img + extPng;
		document.images['msMN'].src = chmPng + 'cd' + extPng;
		document.images['mlN'].src = chmPng + 'cm' + extPng;
		document.images['msNO'].src = chmPng + 'cf' + extPng;
		document.images['mlO'].src = chmPng + 'f' + extPng;
		document.images[idFinMot].src = chmPng + fond + extPng;
	}
	else {
		// Fin du mot
		id = 'mlO';	
		nvSrc = chmPng + (affiche&&(nbLettresChoisies==tailleMaxMot)?(h[xLC[tailleMaxMot-1]][yLC[tailleMaxMot-1]].l+coulFin+'0'):fond) + extPng;
		document.images[id].src = nvSrc;	
		id = idFinMot;	
		nvSrc = chmPng + (affiche&&(nbLettresChoisies==tailleMaxMot)?('sf'+coulFin):fond) + extPng;
		document.images[id].src = nvSrc;	
	}

	// Score
	id = 'mpd';	
	nvSrc = chmPng + (affiche&&score?(dizaines+cptNoir):fond) + extPng;
	document.images[id].src = nvSrc;	
	id = idFinScore;	
	nvSrc = chmPng + (affiche&&score?(unites+cptNoir):fond) + extPng;
	document.images[id].src = nvSrc;		

	// paramètre dico
	nvSrc = chmPng + (affiche?pngDico[dicoDef]:fond) + extPng; 
	document.images[idPrmDico].src = nvSrc;	
	
	if (affiche) { 
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDernierMotTrouve;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM;
		document.links[idLnkDico].target = '_blank';
	}
	else { 
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
	majAffichageMotChoisi(oui);
}
//---------------------------------------------------------------------------
function retireMotChoisi()
{
	majAffichageMotChoisi(non);
}
//---------------------------------------------------------------------------
function reinitialiseSelectionEtRetireMot(retireMot)
{
	for(var i=0; i<nbLettresChoisies; i++) {
		stDrnMotForme[i]=espace;
		h[xLC[i]][yLC[i]].rouge = non;
		h[xLC[i]][yLC[i]].affiche();
		h[xLC[i]][yLC[i]].enregistre();
		xLC[i]=indefini;
		yLC[i]=indefini;
		enregistreLC(i);
	}
	nbLettresChoisies = 0;	
	localStorage.LCn = nbLettresChoisies;
	if (retireMot)
		retireMotChoisi(); 
}
//---------------------------------------------------------------------------
// Affichage données partie
//---------------------------------------------------------------------------
function changeEtatGrille(etat) // etat = {cptRouge, cptVert}
{
	document.images[idGrille].src = chmPng + idGrille + etat + extPng;
}
//---------------------------------------------------------------------------
function afficheNumeroGrille()
{
	// Affichage état de la grille en rouge 
	changeEtatGrille(filRouge?cptVert:cptRouge); // Vert indique la possibilité de se tromper dans le Fil Rouge
	// Affichage du numéro
	var u = grille % 10;
	var d = Math.floor(grille / 10);
	document.images['sgnd'].src = chmPng + d + cptNoir + extPng;
	document.images['sgnu'].src = chmPng + u + cptNoir + extPng;
}
//---------------------------------------------------------------------------
function changeEtatIndices() // etat {cptRouge, cptVert}
{
	document.images[idIndices].src = chmPng + idIndices + (indices?cptVert:cptRouge) + extPng;
}
//---------------------------------------------------------------------------
function afficheNbIndices()
{
	// Affichage état de la grille en rouge 
	changeEtatIndices();
	// Affichage du numéro
	var u = indices % 10;
	var d = Math.floor(indices / 10) % 100; // On ne sait jamais si on fait le tour du compteur !
	document.images['scnd'].src = chmPng + d + cptNoir + extPng;
	document.images['scnu'].src = chmPng + u + cptNoir + extPng;
}
//---------------------------------------------------------------------------
function scoreMaxPartie()
{
	return scoreGrille.partieMax + scoreGrille.totalMax(); 
}
//---------------------------------------------------------------------------
function scorePartie() 
{
	return	scoreGrille.partie + scoreGrille.total();
}
//---------------------------------------------------------------------------
// [typeScore {idScore, idBonus, idTotal, idPartie} [, typeInfo {idNumerateur, idDenominateur}
function afficheScore(typeScore, typeInfo)
{
	if (typeInfo == undefined) {
		afficheNumeroGrille();
		afficheNbIndices();
		afficheScore(idScore, idNumerateur);
		afficheScore(idBonus, idNumerateur);
		afficheScore(idTotal, idNumerateur);
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
		case 'ssn' :	score = scoreGrille.score; scoreDual = scoreGrille.scoreMax; break;
		case 'ssd' :	score = scoreGrille.scoreMax; scoreDual = scoreGrille.score; break;
		case 'sbn' :	score = scoreGrille.bonus; scoreDual = scoreGrille.bonusMax; break;
		case 'sbd' :	score = scoreGrille.bonusMax; scoreDual = scoreGrille.bonus; break;
		case 'stn' :	score = scoreGrille.total(); scoreDual = scoreGrille.totalMax(); break;
		case 'std' :	score = scoreGrille.totalMax(); scoreDual = scoreGrille.total(); break;
		case 'spn' :	score = scorePartie(); break;
	}
	
	// Décomposition & Affichage des chiffres
	var couleur = ((typeScore==idBonus)&&(!score)&&(!scoreDual))?cptGris:(score==scoreDual)&&score&&scoreDual?cptVert:(typeScore==idPartie?cptNoir:cptRouge);
	var zeroNonSignificatif = false; // v1.1 : Indique si le zéro est à remplacer par un espace (true) ou non (false)
	if (typeInfo == idDenominateur) { // v1.1 : on met finalement le pourcentage dans score si typeInfo = idDenominateur
		score = (score ? Math.round((100.0*scoreDual)/score) : 0);
		zeroNonSignificatif = true;
	}
	for(var i=(typeScore != idPartie ? 2 : 5); i>indefini; i--) { // v1.1 : on affiche les chiffres dans l'ordre inverse (de gauche à droite) pour pouvoir ne pas afficher les 0 non significatifs des %
		chiffre[i] = Math.floor(score / exp10[i]) % 10;
		zeroNonSignificatif = zeroNonSignificatif && (!chiffre[i]) && (i>0); // v1.1 : Zéros non significatifs ?
		var id = ((typeScore == idPartie) ? (typeScore + idChiffrePartie[i]) : (typeScore + typeInfo + idChiffreScore[i]));
		var nvSrc = chmPng + (zeroNonSignificatif?'-':chiffre[i]) + (zeroNonSignificatif?vide:couleur) + extPng; // v1.1 : affichage du % pur le dénominateur et l'unité au lieu de chiffre[i] et uniquement les zéros significatifs
		document.images[id].src = nvSrc;
		// if ((i == 2) && (typeScore != idPartie)) break; // v1.1 : reporté dans l'initialisation de la boucle for
	}
	// v1.1 affichage du % dans la bonne couleur
	if (typeInfo == idDenominateur) {
		var id = typeScore + typeInfo + 'p';
		var nvSrc = chmPng + '!' + couleur + extPng; 
		document.images[id].src = nvSrc;
	}
	
	if ((typeInfo!=idDenominateur)&&(typeScore!=idPartie)) // v1.1 : on rafraîchit toujours le dénominateur (sauf pour le score de partie)
		afficheScore(typeScore, idDenominateur);
} 
//---------------------------------------------------------------------------
function rafraichitBoutons()
{
	document.images[idBtnGauche].src = chmPng + 'a' + extPng;
	document.images[idBtnDroite].src = chmPng + 'i' + extPng;
}
//---------------------------------------------------------------------------
function afficheAidePrincipale()
{
	if (!filRouge)
		alert('Bienvenue dans Vermissimax\n\nVous devez trouver '+nbMotsRLG+' mots de '+tailleMotRLG+' lettres cachés dans la grille, commençant dans les coins ou au centre. Les lettres doivent être reliées entre elles et chaque lettre ne doit être utilisée que dans un seul mot et une seule fois. Pour sélectionner un mot, touchez un point de départ en rouge.\n\nTouchez "Indices" pour un coup de pouce ou "Grille" pour abandonner.');
	else
		alert('Bienvenue dans le Fil Rouge.\n\nDans cette manche bonus, vous devez trouver '+nbMotsFR+' mots d\'au moins '+tailleMinMot+' lettres partant de '+nbMotsFR+' points (les "?" verts).\n\n1. Touchez d\'abord un "?" vert\n2. Choisissez une lettre comme initiale (dans ou hors de la grille).\n3. Formez un mot d\'au moins '+tailleMinMot+' lettres comme dans la première manche.\n4. Pour valider le mot, touchez son point de départ.');
}
//---------------------------------------------------------------------------
// Enregistrement de la partie
//---------------------------------------------------------------------------
function enregistreScoreGrille()
{
	scoreGrille.enregistre(); 
}
//---------------------------------------------------------------------------
// Chargement de la partie
//---------------------------------------------------------------------------
function chargeScoreGrille()
{
	scoreGrille = new scoreGrilleCharge(); 
}
//---------------------------------------------------------------------------
// Actions Grille
//---------------------------------------------------------------------------
function stPourcents(index) // retour une chaîne du modèle ' (nn%)' ou vide
{
	const stPrefixe = ' (';
	const stSuffixe = '%)';
	
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
		default:	break;
	}
	return st;
}
//---------------------------------------------------------------------------
function motTrouve()
{
	var OK=oui;
	var x=xLC[0];
	var y=yLC[0];
	var stMotForme = vide;
	for(var i=0; (i<stDrnMotForme.length)&&(stDrnMotForme[i]>='A')&&(stDrnMotForme[i]<='Z'); i++)
		stMotForme = stMotForme + stDrnMotForme[i];
	for(var j=1; OK&&(j<tailleMotRLG); j++) {
		x=x+dx[dRLG[iMotRLG][j-1]];
		y=y+dy[dRLG[iMotRLG][j-1]];
		OK=((xLC[j]==x)&&(yLC[j]==y)&&(stDrnMotForme[j]==stMotsRLG[iMotRLG][j]));
	}
	if ((!OK)&&(stMotForme==stMotsRLG[iMotRLG]))
		alert('Vous avez trouvé le bon mot ('+stMotForme+') mais pas le bon cheminement.\n\nRetrouvez le bon ordre et les bonnes lettres...');
	return OK;
}
//---------------------------------------------------------------------------
function afficheSablier(affiche) 
{
	if (affiche) {
		if (document.images[idGrille].src.indexOf(sablier) == indefini)
			imgSrcGrilleSvg = document.images[idGrille].src;
		document.images[idGrille].src = chmPng + sablier + extPng;
	}
	else
		document.images[idGrille].src = imgSrcGrilleSvg;
}
//---------------------------------------------------------------------------
function estInitiale(x, y) // Vermissimax : retourne vrai s'il s'agit d'un des 7 points de départ (6 coins ou centre ou "?" en mode Fil Rouge)
{
	var OK = non;
	if (filRouge) // Point de départ du Fil Rouge
		if ((initialeFR>indefini)&&(iMotFR>indefini)) // Si iMotFR+initialeFR définis alors est-ce le point de départ ?
			OK=((x==xFR[iMotFR])&&(y==yFR[iMotFR]));
		else // Si initialeFR est indéfini, on cherche n'importe quel "?" (rouge ou vert).
			for(var i=0; (!OK)&&(i<nbMotsFR); i++)
				OK=((x==xFR[i])&&(y==yFR[i])&&(h[x][y].l==mystere));
	else
		for(var i=0; (!OK)&&(i<nbMotsRLG); i++)
			OK=((x==xRLG[i])&&(y==yRLG[i]));
	return OK;
}
//---------------------------------------------------------------------------
function choixLettreValide(x, y)
{
	var choixOK = non;
	if (filRouge &&
		((iMotFR==indefini)||(initialeFR==indefini)))
		if (iMotFR>indefini) // Si l'on a déjà choisit un point de départ (un "?" est rouge)
			return (((h[x][y].l!=mystere)&&(h[x][y].l!=joker))|| // Ça peut être une lettre OU
			        estInitiale(x, y)); // un autre point de départ
		else 
			return estInitiale(x, y); // Sinon, il faut que ce soit un point de départ
	if (h[x][y].vert&&(!filRouge))
		return non;
	if (!nbLettresChoisies) // Pas encore de lettres choisies : On choisit un point de départ
		choixOK = estInitiale(x, y);
	else { // Soit c'est une lettre rouge, soit c'est une lettre grise reliée à la dernière lettre rouge choisie
		for(var i=0; (!choixOK)&&(i<nbLettresChoisies); i++)
			choixOK = ((x==xLC[i])&&(y==yLC[i]));
		choixOK = choixOK || (distance(xLC[nbLettresChoisies-1], yLC[nbLettresChoisies-1], x, y)==1)
		var pasUnPtDepart = ((!nbLettresChoisies)||(!estInitiale(x, y))||((x==xLC[0])&&(y==yLC[0])));
		choixOK = choixOK && pasUnPtDepart; // pas de coins ou centre en cours de saisie autre que le point de départ du mot courant
		if ((!pasUnPtDepart)&&affichageMsgPtDepart) {
			affichageMsgPtDepart = non;
			localStorage.mpd = affichageMsgPtDepart;
			alert('Vous ne pouvez pas choisir la lettre d\'un point de départ (coin ou centre) à l\'intérieur d\'un mot.\n\nPour changer de point de départ, touchez le point de départ courant avant d\'en choisir un autre.');
		}
	}				
	return choixOK;
}
//---------------------------------------------------------------------------
function debutFilRouge()
{
	// /!\ Sauvegarde localStorage dans enregistreFR
	filRouge = oui;
	afficheTopInitialesFR(non); // v1.3
	// On réinitialise la grille
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			if (h[x][y].l != mystere) {
				h[x][y].vert = non;
				h[x][y].enregistre();
				h[x][y].affiche();
			}
	afficheNumeroGrille(); // "Grille" en vert
	nbMotsRestants = nbMotsFR; // indicateur de fin de manche (plus de mots à trouver : nbMotsRestants == 0).
	localStorage.nmr = nbMotsRestants;
	majAffichageInitiales(non); // On masque les départs de la première manche le cas échéant
	reinitialiseSelectionEtRetireMot(oui);
	montreLettresInexistantes(); // On affiche les lettres inexistantes de la grille
	initialiseCompteursFR(); // Définit les points de départs FR et réinitialise les compteurs FR (nFR,tFR,sFR)
	enregistreFR();
	setTimeout(function() { 
		if (affichageMsgFilRouge) {
			affichageMsgFilRouge = non;
			localStorage.mfr = affichageMsgFilRouge;
			afficheAidePrincipale();
		}
	}, 500);
}
//---------------------------------------------------------------------------
function finFilRouge()
{
	filRouge=non;
	afficheTopInitialesFR(non); // v1.3
	cacheLettresInexistantes(); // On cache les lettres inexistantes de la grille
	document.images[bonus].src = chmPng + bonus + extPng; // On réaffiche "Bonus" en cas d'extras (x2, +100)
	nbMotsRestants = nbMotsRLG; // indicateur de fin de manche (plus de mots à trouver : nbMotsRestants == 0.
	reinitialiseSelectionEtRetireMot(oui);
	grille++;
	localStorage.grille = grille;
	afficheNumeroGrille();
	indices += indRLG[Math.min(gMaxRLG,grille)];
	if (indices > 99)
		indices = 99;
	localStorage.indices = indices;
	afficheNbIndices();
	localStorage.nmr = nbMotsRestants;
 	afficheSablier(oui);
   	setTimeout(function() { 
		generePuisAfficheGrille(oui);
 	    afficheSablier(non);
   	}, 500);
}
//---------------------------------------------------------------------------
function affecteLettreFR(lettre)
{
	if (!estLettrePDDLPP(lettre, xFR[iMotFR], yFR[iMotFR])) { // Lettre correcte
		h[xFR[iMotFR]][yFR[iMotFR]].l=lettre; // On affecte la lettre
		h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
		h[xFR[iMotFR]][yFR[iMotFR]].affiche();
		if (!releveMotsFR()) { // On cherche les mots de taille maximales possibles
			statsEtTops.enregistreGrille();
			attenteGrilleDemandee = oui;
			localStorage.agd = attenteGrilleDemandee;
			alert('Le choix de cette lettre ('+lettre+') ne permet pas de trouver un mot d\'au moins '+tailleMinMot+' lettres.\n\nLe Fil Rouge est terminé.\n\nTouchez "Grille" pour continuer.');
		}
		else {
			scoreGrille.bonusMax = scoreGrille.bonusMax + tFR[iMotFR];
			localStorage.setItem(lsScoreGrille + lsAttrScores[3], scoreGrille.bonusMax);
			// Affichage nombres de lettres et tailles de mots trouvés par point de départ
			afficheCompteur(cptNoir); // Affiche le compteur en fonction de iMotFR
			// Màj affichage des scores max
			afficheScore(); // v1.1 : on rafraîchit tout
			nbLettresChoisies=1;
			localStorage.LCn = nbLettresChoisies;
			xLC[0]=xFR[iMotFR];
			yLC[0]=yFR[iMotFR];
			stDrnMotForme[0] = lettre;
			enregistreLC(0);
			afficheMotChoisi();
			if (aideSelectionMotFR) {
				aideSelectionMotFR = non; // Affichage une seule fois
				localStorage.asm = aideSelectionMotFR;
				setTimeout(function() {
					alert('Vous avez choisi l\'initiale. Vous devez à présent sélectionner les autres lettres du mot exactement comme dans la première manche.\nLe compteur affiché en noir sous la grille (00/'+(tFR[iMotFR]<10?'0':'')+tFR[iMotFR]+') indique la taille maximale possible.\n\nPour valider votre mot, touchez son point de départ.');
				}, 500);
			}
		}
	}
}
//---------------------------------------------------------------------------
function effaceLettresVertesFR()
{
	for(var x=0; x<nbLignes; x++)
		for(var y=xyMin[x]; y<=xyMax[x]; y++)
			if ((h[x][y].vert)&&(h[x][y].l!=mystere)) {
				h[x][y].vert=non;
				h[x][y].enregistre();
				h[x][y].affiche();
			}
}
//---------------------------------------------------------------------------
function utiliseIndice()
{
	if (!indices) return;
	// On cherche jusqu'où on a bon...
	var OK=oui;
	var iMax=1;
	var x=xLC[0];
	var y=yLC[0];
	for(; OK&&(iMax<nbLettresChoisies); iMax++) {
		x=x+dx[dRLG[iMotRLG][iMax-1]];
		y=y+dy[dRLG[iMotRLG][iMax-1]];
		OK=((xLC[iMax]==x)&&(yLC[iMax]==y)&&(stDrnMotForme[iMax]==stMotsRLG[iMotRLG][iMax]));
	}
	if (!OK) { // S'il y a une différence, on les efface...
		var i=nbLettresChoisies;
		do {
			i--;
			h[xLC[i]][yLC[i]].rouge = non;
			h[xLC[i]][yLC[i]].enregistre();
			h[xLC[i]][yLC[i]].affiche();
			xLC[i]=indefini;
			yLC[i]=indefini;
			stDrnMotForme[i] = espace;
			enregistreLC(i);
			nbLettresChoisies--;
			localStorage.LCn = nbLettresChoisies;
		} while(i>=iMax);
	}
	afficheMotChoisi();
	indices--;
	localStorage.indices = indices; 
	afficheNbIndices();
}
//---------------------------------------------------------------------------
function afficheSolution(affiche, solution)
{
	var x = xRLG[solution];
	var y = yRLG[solution];
	xLC[0] = (affiche?x:indefini);  
	yLC[0] = (affiche?y:indefini);  
	stDrnMotForme[0] = h[x][y].l;
	enregistreLC(0);
	h[x][y].rouge = affiche;
	h[x][y].enregistre();
	h[x][y].affiche();
	for(var i=0; i<stMotsRLG[solution].length-1; i++) {
		x = x + dx[dRLG[solution][i]];
		y = y + dy[dRLG[solution][i]];
		// Pour afficher/cacher le mot sous la grille
		xLC[i+1] = (affiche?x:indefini); 
		yLC[i+1] = (affiche?y:indefini); 
		stDrnMotForme[i+1] = h[x][y].l;
		enregistreLC(i+1);
		h[x][y].rouge = affiche;
		h[x][y].enregistre();
		h[x][y].affiche();
	}
	nbLettresChoisies = affiche?stMotsRLG[solution].length:0;
	localStorage.LCn = nbLettresChoisies;
	afficheMotChoisi();
}
//---------------------------------------------------------------------------
function montreSolution()
{
	if (iMotRLG == indefini) { // On vient d'abandonner alors...
		document.images[idBtnDroite].src = chmPng + 'p' + extPng; // affichage du bouton ">"
		majAffichageInitiales(non); // On cache les initiales rouges
	}
	var iMotPrcRLG = iMotRLG;
	do {
		iMotRLG = (iMotRLG + 1) % nbMotsRLG;
	} while(h[xRLG[iMotRLG]][yRLG[iMotRLG]].vert);
	localStorage.RLGi = iMotRLG;
	if (iMotPrcRLG>indefini) // On masque la solution précédente
		afficheSolution(non, iMotPrcRLG);
	afficheSolution(oui, iMotRLG);	
}
//---------------------------------------------------------------------------
function cacheSolution()
{
	document.images[idBtnDroite].src = chmPng + 'i' + extPng; // affichage du bouton "(i)"
	afficheSolution(non, iMotRLG);
}
//---------------------------------------------------------------------------
// STATS & TOPS
//---------------------------------------------------------------------------
function statsEtTopsInitialise()
{
	// stats
	this.parties = 0; 
	this.grilles = 0; 
	this.score = 0;
	this.bonus = 0;
	this.bonusMax = 0;
	this.total = 0;
	this.totalMax = 0;
	this.partie = 0;
	this.grille = 0; 
	this.motsFR = 0;
	this.extraf2 = 0; 
	this.extrap100 = 0; 
	// tops
	this.scoreTop = 0;
	this.bonusTop = 0;
	this.bonusMaxTop = 0;
	this.totalTop = 0;
	this.totalMaxTop = 0;
	this.partieTop = 0;
	this.grilleTop = 0;
	this.motsFRTop = 0;
}
//---------------------------------------------------------------------------
function creeStatsEtTops()
{
	// Méthodes
	this.initialise = statsEtTopsInitialise;
	this.enregistre = statsEtTopsEnregistre;
	this.enregistreGrille = statsEtTopsEnregistreGrille;
	this.enregistrePartie = statsEtTopsEnregistrePartie;
	this.charge = statsEtTopsCharge; 
	this.afficheTops = statsEtTopsAfficheTops;
	this.afficheStats = statsEtTopsAfficheStats;
	// Code
	this.initialise();
}
//---------------------------------------------------------------------------
function statsEtTopsCharge()
{
	if (localStorage.getItem(lsStatsEtTops)) {
		// stats
		this.parties = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[0])); // Nombre de parties jouées (abandon de phase verte en 1ère grille non compris)
		this.grilles = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[1])); // Nombre de grilles jouées (abandon de phase verte non compris)
		this.score = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[2]));
		this.bonus = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[3]));
		this.bonusMax = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[4]));
		this.total = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[5]));
		this.totalMax = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[6]));
		this.partie = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[7])); // score de la partie
		this.grille = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[8])); // score de la partie
		this.motsFR = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[9]));// Nombre de mots trouvés lors d'un Fil Rouge
		this.extraf2 = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[10])); // Nombre de Fils Rouges dans lequel tous les mots ont été trouvés. Extra = bonus doublé
		this.extrap100 = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[11])); // Nombre de Fils Rouges dans lequel tous les mots ont été trouvés avec la taille max pour tous les mots. Extra = +100
		// tops
		this.scoreTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[2] + lsTop));
		this.bonusTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[3] + lsTop));
		this.bonusMaxTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[4] + lsTop));
		this.totalTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[5] + lsTop));
		this.totalMaxTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[6] + lsTop));
		this.partieTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[7] + lsTop));
		this.grilleTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[8] + lsTop));
		this.motsFRTop = parseInt(localStorage.getItem(lsStatsEtTops + lsSET[9] + lsTop));
	}
	else
		this.initialise();		
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistre()
{
	// stats
	localStorage.setItem(lsStatsEtTops + lsSET[0], this.parties);
	localStorage.setItem(lsStatsEtTops + lsSET[1], this.grilles);
	localStorage.setItem(lsStatsEtTops + lsSET[2], this.score);
	localStorage.setItem(lsStatsEtTops + lsSET[3], this.bonus);
	localStorage.setItem(lsStatsEtTops + lsSET[4], this.bonusMax);
	localStorage.setItem(lsStatsEtTops + lsSET[5], this.total);
	localStorage.setItem(lsStatsEtTops + lsSET[6], this.totalMax);
	localStorage.setItem(lsStatsEtTops + lsSET[7], this.partie);
	localStorage.setItem(lsStatsEtTops + lsSET[8], this.grille);
	localStorage.setItem(lsStatsEtTops + lsSET[9], this.motsFR);
	localStorage.setItem(lsStatsEtTops + lsSET[10], this.extraf2);
	localStorage.setItem(lsStatsEtTops + lsSET[11], this.extrap100);
	// tops
	localStorage.setItem(lsStatsEtTops + lsSET[2] + lsTop, this.scoreTop);
	localStorage.setItem(lsStatsEtTops + lsSET[3] + lsTop, this.bonusTop);
	localStorage.setItem(lsStatsEtTops + lsSET[4] + lsTop, this.bonusMaxTop);
	localStorage.setItem(lsStatsEtTops + lsSET[5] + lsTop, this.totalTop);
	localStorage.setItem(lsStatsEtTops + lsSET[6] + lsTop, this.totalMaxTop);
	localStorage.setItem(lsStatsEtTops + lsSET[7] + lsTop, this.partieTop);
	localStorage.setItem(lsStatsEtTops + lsSET[8] + lsTop, this.grilleTop);
	localStorage.setItem(lsStatsEtTops + lsSET[9] + lsTop, this.motsFRTop);
	// Drapeau d'enregistrement
	localStorage.setItem(lsStatsEtTops, oui); // Drapeau pour le chargement des stats et tops
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistreGrille()
{
	this.grilles++;
	this.score += scoreGrille.score;
	if (scoreGrille.score > this.scoreTop) 
		this.scoreTop = scoreGrille.score;
	this.bonus += scoreGrille.bonus;
	if (scoreGrille.bonus > this.bonusTop) 
		this.bonusTop = scoreGrille.bonus;
	this.bonusMax += scoreGrille.bonusMax;
	if (scoreGrille.bonusMax > this.bonusMaxTop) 
		this.bonusMaxTop = scoreGrille.bonusMax;
	this.total += scoreGrille.total();
	if (scoreGrille.total() > this.totalTop) 
		this.totalTop = scoreGrille.total();
	this.totalMax += scoreGrille.totalMax();
	if (scoreGrille.totalMax() > this.totalMaxTop) 
		this.totalMaxTop = scoreGrille.totalMax();
	this.motsFR += (nbMotsFR-nbMotsRestants);
	if (nbMotsFR-nbMotsRestants > this.motsFRTop)
		this.motsFRTop = nbMotsFR-nbMotsRestants;
	var tailleFR = 0;
	for(var i=0; i<nbMotsFR; i++) {
		tailleFR += rFR[i];
		if (rFR[i] > this.tailleFRTop)
			this.tailleFRTop = rFR[i];
	}
	if (!nbMotsRestants) {
		this.extraf2++;
		if (scoreGrille.bonus == scoreGrille.bonusMax)
			this.extrap100++;
	}
	
	// Sauvegarde (on sauvegarde tout pour éviter les problèmes d'intégrité sur les stats & tops de partie)...
	this.enregistre();
}
//---------------------------------------------------------------------------
function statsEtTopsEnregistrePartie()
{
	this.parties++;
	var score = scorePartie();
	this.partie += score;
	if (score > this.partieTop)
		this.partieTop = score;
	var nombre = grille-1;
	this.grille += nombre; // On ne compte pas la dernière car abandonnée et donc non complètes
	if (nombre > this.grilleTop)
		this.grilleTop = nombre;
	// Sauvegarde...
	localStorage.setItem(lsStatsEtTops + lsSET[0], this.parties);
	localStorage.setItem(lsStatsEtTops + lsSET[7], this.partie);
	localStorage.setItem(lsStatsEtTops + lsSET[8], this.grille);
	localStorage.setItem(lsStatsEtTops + lsSET[7] + lsTop, this.partieTop);
	localStorage.setItem(lsStatsEtTops + lsSET[8] + lsTop, this.grilleTop);
}
//---------------------------------------------------------------------------
function statsEtTopsAfficheTops()
{
	var stMsg =	(this.parties?
				 'Tops sur '+this.parties+' partie'+(this.parties>1?'s':vide)+'...\n' +
				 'Score de '+this.partieTop+
				 ' • '+this.grilleTop+' grille'+(this.grilleTop>1?'s':vide)+'.\n\n':vide) +
				(this.grilles?
				 'Tops sur '+this.grilles+' grille'+(this.grilles>1?'s':vide)+'...\n' +
				 '• Score de '+this.scoreTop+' (100%)\n' +
				 '• Bonus de '+this.bonusTop+(this.bonusMaxTop?' ('+Math.round(100*this.bonusTop/this.bonusMaxTop)+'%)':vide)+'\n' +
				 '• Total de '+this.totalTop+(this.totalMaxTop?' ('+Math.round(100*this.totalTop/this.totalMaxTop)+'%)':vide)+'\n' +
				 '• '+this.motsFRTop+' mot'+(this.motsFRTop>1?'s':vide)+' Fil Rouge trouvé'+(this.motsFRTop>1?'s':vide)+' ('+Math.round(100*this.motsFRTop/nbMotsFR)+'%).':vide);
	if (stMsg == vide)
		stMsg = 'Aucun top disponible.';
	stMsg = stMsg + '\n\nTouchez "%" pour voir les stats.';
	alert(stMsg);
}
//---------------------------------------------------------------------------
function statsEtTopsAfficheStats()
{
	var stMsg =	(this.parties?
				 'Moyennes sur '+this.parties+' partie'+(this.parties>1?'s':vide)+'...\n' +
				 'Score de '+Math.round(this.partie/this.parties)+
				 ' • '+(Math.round(10*this.grille/this.parties)/10)+' grille'+((Math.round(10*this.grille/this.parties)/10)>=2?'s':vide)+'.\n\n':vide) +
				(this.grilles?
				 'Moyennes sur '+this.grilles+' grille'+(this.grilles>1?'s':vide)+'...\n' +
				 '• Score de '+Math.round(this.score/this.grilles)+'\n' +
				 '• Bonus de '+Math.round(this.bonus/this.grilles)+(this.bonusMax?' ('+Math.round(100*this.bonus/this.bonusMax)+'%)':vide)+'\n' +
				 '• Total de '+Math.round(this.total/this.grilles)+' ('+Math.round(100*this.total/this.totalMax)+'%)\n' +
				 '• '+(Math.round(10*this.motsFR/this.grilles)/10)+' mot'+((Math.round(10*this.motsFR/this.grilles)/10)>=2?'s':vide)+' Fil Rouge trouvé'+((Math.round(10*this.motsFR/this.grilles)/10)>=2?'s':vide)+' ('+Math.round(100*this.motsFR/this.grilles/nbMotsFR)+'%).\n' +
				 '• '+Math.round(100*this.extraf2/this.grilles)+'% des Fils Rouges finis et\n• '+Math.round(100*this.extrap100/this.grilles)+'% au top.':vide);
	if (stMsg == vide)
		stMsg = 'Aucune statistique disponible.';
	stMsg = stMsg + '\n\nToucher "%" = RAZ stats & tops.';
	alert(stMsg);
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
// de 117 à 118	= bouton + Nb indices
// de 119 à 120	= bonus (Infos numérateur/dénominateur)
// de 121 à 123 = total (score partie + score total grille)
// de 124 à 124 = compteur de la première manche
// de 125 à 125 = top initiales (FR)
//---------------------------------------------------------------------------
function clic(i)
{
	if (!toucheAutorisee) return;
	
	var index = parseInt(i);

	// Débogage pour afficher les solutions (Toucher D,E,B,U,G)
	if ((debug<5) && (index < 91))
		if (h[xClic[index]][yClic[index]].l==stDebug[debug])
			debug++;
		else
			debug=0;
	if ((debug<5) && (index > 90) && (index < 99))
		if (document.images['l'+(index%10)].src.substr(document.images['l'+(index%10)].src.length-7,1)==stDebug[debug])
			debug++;
		else
			debug=0;
	if (debug==5)
		document.images['btn3'].src = chmPng + 'ss' + extPng;

	if ((index < 91) && (!attenteGrilleDemandee) && (!affichageSolutions) &&
		choixLettreValide(xClic[index], yClic[index])) { // Lettres de la grille
		var x=xClic[index];
		var y=yClic[index];
		// ===> Fil Rouge : choix de la lettre pour le point de départ (choix validé par choixLettreValide ci-dessus)
		if (filRouge && (iMotFR>indefini) && (initialeFR==indefini) && (h[x][y].l!=mystere)) { 
			if (!estLettrePDDLPP(h[x][y].l, xFR[iMotFR], yFR[iMotFR])) { // v1.3.1 : test point de départ avant affecteLettreFR
				afficheSablier(oui);
				setTimeout(function() { 
					if (rechercheTopsInitialesFR) { // v1.3
						// On initialise la liste des tops;
						stTopInitialesFR = ''; 
						initialeSR = indefini;
						localStorage.FRti = stTopInitialesFR;
						localStorage.FRis = initialeSR;
						toucheAutorisee = non; // On interdit de toucher pendant la recherche
						chercheTopsInitialesFR(h[x][y].l, 0); // on recherche les tops Initiales maintenant en excluant la lettre choisie bien sûr !
						// affecteLettreFR(h[x][y].l); // v1.3 : exécuté dans chercheTopsInitialesFR !
					}
					else {
						affecteLettreFR(h[x][y].l);
						afficheSablier(non);
					}
   				}, 500);
   			}
		}
		// ===> Fil Rouge : choix d'un point de départ...
		else if (filRouge&&estInitiale(x,y)) { 
			// A. On définit le point de départ
			if ((iMotFR==indefini)||(initialeFR==indefini)) { 
				if (iMotFR>indefini) // On efface l'ancien choix de point de départ le cas échéant
					majAffichageInitialeFR(non);
				else
					effaceLettresVertesFR(); // On efface le mot du point de départ précédent le cas échéant
				for(iMotFR=0; (iMotFR<nbMotsFR)&&((x!=xFR[iMotFR])||(y!=yFR[iMotFR])); iMotFR++);
				localStorage.FRim = iMotFR;
				majAffichageInitialeFR(oui); // On met en évidence le point de départ choisi ("?" rouge)
				if (aideChoixInitialeFR) {
					aideChoixInitialeFR = non; // Affichage une seule fois
					localStorage.aci = aideChoixInitialeFR;
					alert('Vous avez choisi un point de départ. Sélectionnez à présent la première lettre du mot parmi celles de la grille ou autour de la grille.\nTant que vous n\'avez pas choisi une lettre, vous pouvez changer de point de départ en en touchant un autre.');
				}
			}
			// B. À partir d'ici, il s'agit de la validation du mot sélectionné
			else if (nbLettresChoisies<tailleMinMot) // B1. taille insuffisante
				alert('Le mot doit avoir entre '+tailleMinMot+' lettres et '+tailleMaxMot+' lettres pour être validé.');
			else { //B2. On teste Le mot
				// 0. On reconstitue le mot
				stDernierMotTrouve = vide;
				for(var i=0; i<nbLettresChoisies; i++)
					stDernierMotTrouve = stDernierMotTrouve+stDrnMotForme[i];
				stDernierMotTrouve = stDernierMotTrouve.trim();
				localStorage.dmt = stDernierMotTrouve;
				var stSolutions = 'Le(s) mot(s) de '+tFR[iMotFR]+' lettres à trouver étai(en)t...\n'+sFR[iMotFR];
				if ((dico[stDernierMotTrouve.length-tailleMinMot].indexOf(stDernierMotTrouve)>indefini)) { // le mot est valable
					// B2a1. On peint en vert
					for(var i=0; i<nbLettresChoisies; i++) {
						h[xLC[i]][yLC[i]].vert=oui;
						h[xLC[i]][yLC[i]].rouge=non;
						h[xLC[i]][yLC[i]].enregistre();
						h[xLC[i]][yLC[i]].affiche();
					}
					// B2a2. On réaffiche le mot entier en vert avec le score en dessous des compteurs
					scoreGrille.bonus += nbLettresChoisies;
					// B2a3. Extras bonus !
					if (nbMotsRestants == 1) {
						scoreGrille.bonus *= 2;
						scoreGrille.bonusMax *= 2;
						afficheScore(idBonus); // v1.1 : on rafraîchit toute la ligne
						afficheScore(idTotal); // v1.1 : on rafraîchit toute la ligne
						document.images[bonus].src = chmPng + bonus + '1' + extPng;
						if (scoreGrille.bonus == scoreGrille.bonusMax){
							scoreGrille.bonus += 100;
							scoreGrille.bonusMax += 100;
							afficheScore(idBonus); // v1.1 : on rafraîchit toute la ligne 
							afficheScore(idTotal); // v1.1 : on rafraîchit toute la ligne
							document.images[bonus].src = chmPng + bonus + '2' + extPng;
						}
					}
					// B2a4. On enregistre la sélection 
					localStorage.setItem(lsScoreGrille + lsAttrScores[1], scoreGrille.bonus);
					afficheMotChoisi();
					rFR[iMotFR] = nbLettresChoisies;
					localStorage.setItem(lsFR+'r'+iMotFR, rFR[iMotFR]);
					afficheCompteur((rFR[iMotFR]<tFR[iMotFR])?cptRouge:cptVert);
					// B2a5. On n'a affiche les solutions que s'il y a autre chose que le mot trouvé
					if ((nFR[iMotFR]==1)&&(rFR[iMotFR]==tFR[iMotFR])&&(sFR[iMotFR].indexOf(stDernierMotTrouve)>indefini))
						stSolutions = 'Vous avez trouvé l\'unique solution top !';
					// B2a6. On réinitialise la sélection
					reinitialiseSelectionEtRetireMot(oui);
					nbMotsRestants--;
					localStorage.nmr = nbMotsRestants;
					montreLettresInexistantes();
					// B2a7. On permet de choisir un nouveau point de départ...
					iMotFR = indefini;
					initialeFR = indefini;
					localStorage.FRim = iMotFR;
					localStorage.FRin = initialeFR;
					// B2a8. On rafraîchit les scores !
					afficheScore();
					if (!nbMotsRestants) {
						statsEtTops.enregistreGrille();
						setTimeout(function() {
							alert('Le mot "'+stDernierMotTrouve+'" est valable.\nBravo, vous avez terminé le Fil Rouge !\nBonus doublé !'+((scoreGrille.bonus == scoreGrille.bonusMax)?'\nBonus max atteint : Extra +100 !':vide)+'\nTouchez "Grille" pour continuer.\n\n'+stSolutions);
						}, 500);
						attenteGrilleDemandee = oui;
						localStorage.agd = attenteGrilleDemandee;
					}
					else
						setTimeout(function() {
							alert('Le mot "'+stDernierMotTrouve+'" est valable.\nTouchez un point de départ parmi les "?" verts.\n\n'+stSolutions);
						}, 500);
				}
				else { // B2b. Le mot n'est pas valable
					statsEtTops.enregistreGrille();
					setTimeout(function() {
						alert('Le mot '+stDernierMotTrouve+' n\'est pas valable.\nLe Fil Rouge est terminé.\nTouchez "Grille" pour continuer.\n\n'+stSolutions);
					}, 500);
					attenteGrilleDemandee = oui;
					localStorage.agd = attenteGrilleDemandee;
				}
			}
		}
		// ===> Construction lettre par lettre du mot (1ère manche+Fil Rouge) y compris l'initiale (1ère manche seulement)
		else if ((((!h[x][y].rouge)&&(!h[x][y].vert))|| // Une lettre grise ou
			      ((!filRouge)&&(!nbLettresChoisies)&&estInitiale(x,y)))&& // c'est un point de départ + première lettre choisie SAUF Fil Rouge MAIS EN TOUS LES CAS...
			     (!affichageSolutions)&& // Pas d'affichage de solutions en cours ET
			     (nbLettresChoisies<(filRouge?tailleMaxMot:tailleMotRLG))) { // on n'a pas dépassé la taille max !
			if (estInitiale(x,y)&&h[x][y].rouge) { // On masque les points de départs le cas échéant (1ère manche)
				majAffichageInitiales(non);
				// On définit le point de départ iMotRLG ici et seulement ici !
				for(iMotRLG=0;((x!=xRLG[iMotRLG])||(y!=yRLG[iMotRLG]))&&(iMotRLG<nbMotsRLG); iMotRLG++);
				localStorage.RLGi = iMotRLG;
				if (aideSelectionMot) {
					aideSelectionMot = non; // Affichage une seule fois
					localStorage.asm = aideSelectionMot;
					alert('Vous avez choisi un point de départ. Sélectionnez à présent les autres lettres du mot dans l\'ordre de lecture.\nLe mot en cours de sélection apparaît au fur et à mesure sous la grille.\nPour effacer des lettres, touchez simplement la première lettre de la partie à effacer. Toucher la première lettre du mot courant permet ensuite de choisir un autre point de départ.');
				}
			}
			h[x][y].rouge = oui;
			h[x][y].enregistre();
			h[x][y].affiche();
			xLC[nbLettresChoisies]=x;
			yLC[nbLettresChoisies]=y;
			stDrnMotForme[nbLettresChoisies] = h[x][y].l;
			enregistreLC(nbLettresChoisies);
			nbLettresChoisies++;
			localStorage.LCn = nbLettresChoisies;
			if ((!filRouge)&&(nbLettresChoisies==tailleMotRLG)&&motTrouve()) { // MOT TROUVE ?
				// 1. On peint en vert
				for(var i=0; i<nbLettresChoisies; i++) {
					h[xLC[i]][yLC[i]].vert=oui;
					h[xLC[i]][yLC[i]].rouge=non;
					h[xLC[i]][yLC[i]].enregistre();
					h[xLC[i]][yLC[i]].affiche();
				}

				// 2. On réaffiche le mot entier en vert avec le score en dessous des compteurs
				scoreGrille.score += 10*(6-iniRLG[Math.min(gMaxRLG,grille)][iMotRLG]);
				localStorage.setItem(lsScoreGrille + lsAttrScores[0], scoreGrille.score);

				// 3. On affiche le mot trouvé, son score et màj de l'accès aux définitions
				stDernierMotTrouve = vide;
				for(var i=0; i<nbLettresChoisies; i++)
					stDernierMotTrouve = stDernierMotTrouve + stDrnMotForme[i];
				stDernierMotTrouve = stDernierMotTrouve.trim();
				localStorage.dmt = stDernierMotTrouve;

				// 4. On rafraichit le compteur de mots de la phase verte à droite du dernier mot trouvé

				nbMotsRestants--;
				localStorage.nmr = nbMotsRestants;
				afficheMotChoisi();

				// 5. On réinitialise la sélection
				reinitialiseSelectionEtRetireMot(non); // Non : On ne retire pas le mot !

				// 6. On retire l'indice de départ
				stInitiales[iMotRLG]=mystere;
				for(var i=1; i<iniRLG[Math.min(gMaxRLG,grille)][iMotRLG]; i++)
					stInitiales[iMotRLG]=stInitiales[iMotRLG]+mystere;
				localStorage.setItem(lsRLG+'i'+iMotRLG, stInitiales[iMotRLG]);
				afficheScore();
				if (majAffichageInitiales(oui)) { // Si affichage de plusieurs initiales, on réinitialise le choix
					iMotRLG = indefini;
					localStorage.RLGi = iMotRLG;
				}
				if (!nbMotsRestants) {
					changeEtatGrille(cptVert);
					attenteGrilleDemandee = oui;
					localStorage.agd = attenteGrilleDemandee;
				   	setTimeout(function() { 
						alert('Bravo, vous avez trouvé tous les mots !\n\nTouchez "Grille" pour passer au Fil Rouge.');
					}, 500);
				}
				else
					if (affichageMsgMotTrvRLG) {
						affichageMsgMotTrvRLG = non;
						localStorage.mmt = affichageMsgMotTrvRLG;
					   	setTimeout(function() { 
							alert('C\'est votre premier mot !\n\nChoisissez un des points de départ rouges restants.\nTouchez "Grille" pour abandonner.');
						}, 500);
					}
			}
			else
				afficheMotChoisi();
			}
		// ===> Effacement de lettres de la sélection courante (1ère manche+Fil Rouge)
		else if ((h[x][y].rouge)&&(nbLettresChoisies)&&(!affichageSolutions)) { // c'est une lettre déjà choisie, on efface de la fin de la sélection jusqu'à cette lettre
			var i=nbLettresChoisies;
			var fin=non;
			do {
				i--;
				h[xLC[i]][yLC[i]].rouge = non;
				h[xLC[i]][yLC[i]].enregistre();
				h[xLC[i]][yLC[i]].affiche();
				fin=((x==xLC[i])&&(y==yLC[i]));
				xLC[i]=indefini;
				yLC[i]=indefini;
				stDrnMotForme[i] = espace;
				enregistreLC(i);
				nbLettresChoisies--;
				localStorage.LCn = nbLettresChoisies;
			} while(!fin);
			if (!nbLettresChoisies) {// Si plus de lettres choisies, on réaffiche les points de départ
				if (majAffichageInitiales(oui)) {
					iMotRLG = indefini;
					localStorage.RLGi = iMotRLG;
				}
			}
			afficheMotChoisi();
		}
	}
	else if ((index > 90) && (index < 99) && // Lettres hors grille
			 (!attenteGrilleDemandee) && filRouge && (iMotFR>indefini) && (initialeFR == indefini)) { // dans le choix d'une lettre au point de départ en mode Fil Rouge.
 	    afficheSablier(oui);
	   	setTimeout(function() { 
			var id = 'l'+(index%10);
			var nvLettre = document.images[id].src.substr(document.images[id].src.length-7,1);
			affecteLettreFR(nvLettre);
	 	    afficheSablier(non);
		}, 500);
	}
	else if ((index == 99) && 
			 (document.images[idPrmDico].src[document.images[idPrmDico].src.length-5][0] != fond[0])) { 
		dicoDef = (dicoDef + 1) % nbDicosDef; // Changement du dictionnaire de définitions
		localStorage.dd = dicoDef;
		document.images[idPrmDico].src = chmPng + pngDico[dicoDef] + extPng; 
		document.links[idLnkDico].href = lnkDico[dicoDef] + stDernierMotTrouve;
		if (dicoDef==nbDicosDef-1)
			document.links[idLnkDico].href = document.links[idLnkDico].href.toLowerCase() + extHTM;
		if (affichagesChgtDico < nbDicosDef) { // v1.1
			alert('Vous changez de dictionnaire de définitions pour...\n\n' + nomDico[dicoDef] + '\n\nQuand un mot est affiché à gauche du livre ouvert, touchez "?" pour accéder à la définition sur le site choisi ci-dessus.'); 
			affichagesChgtDico++;
			localStorage.acd = affichagesChgtDico;
		}
	}
	else if ((index > 100) && (index < 108))
		alert('Il s\'agit de la taille du mot trouvé dans le Fil Rouge et commençant '+((xFR[index-101]>indefini)&&(yFR[index-101]>indefini)?'en '+String.fromCharCode(1+charCodeMin+xFR[index-101])+String.fromCharCode(1+charCodeMin+yFR[index-101]):' au point de départ n°'+(index-100))+', suivie de la taille maximale possible pour le choix de la lettre initiale  (affichée une fois la lettre choisie).');
	else if (index <= 125) { // Autres... v1.3 pour 125 à la place de 124 
		switch(index) {
			case 124:
			case 108: 	if (document.images[idFinMot].src[document.images[idFinMot].src.length-5][0] != fond[0]) // v1.1 : on affiche l'aide que si un mot est affiché
							alert('Il s\'agit du mot en cours de sélection. Si le mot apparaît en vert, cela signifie que le mot à trouver a été découvert.'); 
						else
							if ((index==124)&&(!filRouge))
								alert('Il s\'agit du nombre de mots trouvés sur le nombre de mots à trouver pour verdir la grille dans cette première manche.');
						break;
			case 109: 	if (document.images[idFinScore].src[document.images[idFinScore].src.length-5][0] != fond[0]) // v1.1 : on affiche l'aide que si un mot est affiché (et donc son score)
							alert('Il s\'agit du score obtenu pour avoir trouvé le mot affiché à gauche. Dans la 1ère manche, le score dépend des indices fournis (nombre d\'initiales). Dans le Fil Rouge, il s\'agit simplement de la taille du mot trouvé alimentant le bonus.'); 
						break;
			case 110:	var n=0; // v1.2 : on compte réellement le nombre de mots
						for(var i=0; i<dico.length; i++)
							n+=dico[i].length;
						alert('À propos de Vermissimax\n\nWebApp version '+stVersion+'\nCréée par Patrice Fouquet\nDico : '+n+' mots (ODS'+stVersionODS+')\n\nvermissimax@patquoi.fr\npatquoi.fr/Vermissimax.html\n\nTouchez (i) pour plus d\'infos.');
						break;
			case 111:	if (affichageSolutions) {
							afficheSablier(oui);
							setTimeout(function() {
								montreSolution();
								afficheSablier(non);
							}, 500);
						}
						else
							afficheAidePrincipale();
						break;
			case 112:	// Bouton "%"
						if (debug!=5) { // Stats et Tops
							switch(touchesStatsEtTop) {
								case 0: statsEtTops.afficheTops();
										break;
								case 1: statsEtTops.afficheStats();
										break;
								case 2: alert('Êtes-vous sûr(e) de vouloir REMETTRE À ZÉRO tops et statistiques ?\n\nPour confirmer, touchez à nouveau "%".');
										break;
								case 3:	statsEtTops.initialise();
										statsEtTops.enregistre();
										alert('Statistiques et tops REMIS À ZÉRO.');
										break;
							}
							touchesStatsEtTop = (touchesStatsEtTop + 1) % 4;
						}
						else { // MODE DEBUG : On affiche les solutions !
							if (filRouge) {
								if ((iMotFR>indefini)&&(initialeFR==indefini)&&(!nbLettresChoisies)) {
									initialeSR = (initialeSR + 1) % nbLettres;
									localStorage.FRis = initialeSR;
									h[xFR[iMotFR]][yFR[iMotFR]].l=String.fromCharCode(1+charCodeMin+initialeSR); 
									h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
									rFR[iMotFR]=0;
									nFR[iMotFR]=0;
									tFR[iMotFR]=0;
									sFR[iMotFR]=vide;
									afficheSablier(oui);
									setTimeout(function() {
										if (releveMotsFR())
											alert('Lettre '+String.fromCharCode(1+charCodeMin+initialeSR)+'\n'+nFR[iMotFR]+' mot(s) de '+tFR[iMotFR]+' lettres...\n'+sFR[iMotFR]);
										else
											alert('Lettre '+String.fromCharCode(1+charCodeMin+initialeSR)+'\nPas de mot trouvé.');
										initialeFR = indefini;
										localStorage.FRin = initialeFR;
										h[xFR[iMotFR]][yFR[iMotFR]].l=mystere;
										h[xFR[iMotFR]][yFR[iMotFR]].enregistre();
										afficheSablier(non);
									}, 500);
								}
							}
							else {
								var stListeMotsRLG = stMotsRLG[0];
								for(var i=1; i<nbMotsRLG; i++)
									stListeMotsRLG = stListeMotsRLG + espace + stMotsRLG[i];
								alert(stListeMotsRLG);
							}
						}
						break;
			case 113:	alert('Il s\'agit du score des points cumulés des mots découverts dans la grille courante.\n\nLe vert indique que tous les mots ont été trouvés.'); // v1.1 : pas de pourcentages
						break;
			case 114:	alert('Il s\'agit de la proportion du score par rapport au score à réaliser quand tous les mots de la grille sont découverts.\n\nLe vert indique que tous les mots ont été trouvés.'); // v1.1 : pas de pourcentages + changement de texte
						break;
			case 115:	// Bouton "Grille"
						if (attenteGrilleDemandee) {
							attenteGrilleDemandee = non;
							localStorage.agd = attenteGrilleDemandee;
							if (filRouge)
								finFilRouge();
							else
								debutFilRouge();
						}
						else if (!confirmationGrilleDemandee) {
							alert('Êtes-vous sûr(e) de vouloir '+(filRouge?'passer le Fil Rouge et accéder à la grille suivante':'abandonner la partie en cours')+' ?\n\nTouchez à nouveau "Grille" pour confirmer l\'abandon '+(filRouge?'du Fil Rouge':'de la partie')+'.');
							confirmationGrilleDemandee = oui;
						}
						else {
							if (filRouge)
								if (!affichageSolutions) {
									if ((iMotFR>indefini)&&(initialeFR>indefini)) {
										affichageSolutions = oui;
										localStorage.as  = affichageSolutions;
										alert('Vous avez choisi de passer le Fil Rouge.\n\nLe(s) mot(s) de '+tFR[iMotFR]+' lettres à trouver étai(en)t...\n'+sFR[iMotFR]+'\n\nTouchez "Grille" pour continuer.');
									}
									else {
										statsEtTops.enregistreGrille();
										confirmationGrilleDemandee = non;
										affichageSolutions = non;
										localStorage.as  = affichageSolutions;
										finFilRouge();
									}
								}
								else {
									confirmationGrilleDemandee = non;
									affichageSolutions = non;
									localStorage.as  = affichageSolutions;
									finFilRouge();
								}
							else
								if (!affichageSolutions) {
									affichageSolutions = oui;
									iMotRLG = indefini;
									localStorage.as  = affichageSolutions;
									localStorage.RLGi = iMotRLG;
									reinitialiseSelectionEtRetireMot(oui);
									afficheSablier(oui);
									setTimeout(function() {
										montreSolution();
										alert('Les mots qu\'il restait à trouver sont affichés en rouge.\n\nTouchez ">" pour voir la solution suivante.\nTouchez "Grille" pour commencer une nouvelle partie.');
										afficheSablier(non);
									}, 500);
								}
								else {
									if (grille>1) // On n'enregistre pas la partie si abandon à la première grille
										statsEtTops.enregistrePartie();
									confirmationGrilleDemandee = non;
									affichageSolutions = non;
									localStorage.as  = affichageSolutions;
									cacheSolution();
									nouvellePartie();
								}
						}
						break;
			case 116:	alert('Il s\'agit du numéro de la grille courante.\n\nLa première grille porte le numéro 01.');
						break;
			case 117:	// Bouton "Indices"
						if (!affichageSolutions)
							if (filRouge)
								alert('Il n\'y a pas d\'indices dans le Fil Rouge.');
							else
								if ((!indices)||(nbLettresChoisies<2))
									alert('Voici les indices de départ, à savoir les premières lettres des '+nbMotsRLG+' mots de '+tailleMotRLG+' lettres à trouver...\n\n'+stInitiales[0]+espace+stInitiales[1]+espace+stInitiales[2]+espace+stInitiales[3]+espace+stInitiales[4]+espace+stInitiales[5]+espace+stInitiales[6]+(indices?'\n\nPour utiliser un indice, sélectionnez d\'abord au moins 2 lettres puis touchez "Indices". Les lettres communes avec le mot à trouver resteront sélectionnées.':vide));
								else
									utiliseIndice();
						break;
			case 118:	alert('Il s\'agit du nombre d\'indices qu\'il vous reste. Vous avez droit à '+indRLG[1]+' indices pour les '+nbMotsRLG+' premières grilles puis '+(indRLG[1]-1)+' pour les '+nbMotsRLG+' suivantes et ainsi de suite puis 1 à partir de la grille '+gMaxRLG+'.\nPour utiliser un indice, touchez "Indice" après avoir sélectionné au moins deux lettres. Les lettres communes avec le mot à trouver resteront sélectionnées.');
						break;
			case 119:	alert('Il s\'agit du bonus accordé pour avoir trouvé des mots dans le Fil Rouge équivalant simplement à la taille des mots trouvés.'); // v1.1 : pas de pourcentages
						break;
			case 120:	alert('Il s\'agit de la proportion du bonus par rapport au bonus maximal possible dans le Fil Rouge. La couleur verte indique que vous avez trouvé à chaque fois le mot le plus long possible.'); // v1.1 : pas de pourcentages + changement de texte
						break;
			case 121:	alert('Il s\'agit du score de la partie : cumul des scores et bonus de la grille courante et des grilles précédentes.');
						break;
			case 122:	alert('Il s\'agit du score de la grille courante : scores + bonus.'); // v1.1 : pas de pourcentages
						break;
			case 123:	alert('Il s\'agit de la proportion du score de la grille courante par rapport au score maximal possible.'); // v1.1 : pas de pourcentages + changement de texte
						break;
			case 125:	// Affichage du Top Initiales (v1.3)
						if ((filRouge) && (stTopInitialesFR != undefined) && (stTopInitialesFR.length > 0))
							alert(stTopInitialesFR); // On affiche la dernière recherche (Top rouge)
						else { // Interrupteur rechercheTopsInitialesFR (Bleu>Gris) et (Gris>Bleu) 
							rechercheTopsInitialesFR = !rechercheTopsInitialesFR;
							localStorage.FRrti = rechercheTopsInitialesFR;
							afficheTopInitialesFR(non); // On rafraîchit l'affichage Top (Bleu/Gris)
							if (!rechercheTopsInitialesFR)
								alert('Vous avez DÉSACTIVÉ la recherche des "Tops Initiales" dans le Fil Rouge. Touchez à nouveau "Top" pour la réactiver.');
							else 
								alert('Vous avez RÉACTIVÉ la recherche des "Tops Initiales" dans le Fil Rouge. Touchez à nouveau "Top" pour la désactiver.');
						}
						break;
			default:	break;
		}
	}
	// Réinitialisation de drapeaux de mêmes clic/touches successifs/ives
	if (confirmationGrilleDemandee && // Si confirmation Grille demandée et...
		(!affichageSolutions) && // Pas d'affichage de solutions en cours et...
	    (index != 115)) // "Grille" pas touché et...
		confirmationGrilleDemandee = non; // ALORS Demande "Grille" annulée
	if (touchesStatsEtTop &&
		(index != 112))
		touchesStatsEtTop = 0;
}
//---------------------------------------------------------------------------
// Bienvenue !
//---------------------------------------------------------------------------
function chargeJeu()
{
	creeGrille(); // Une seule fois
	// Nouvelle grille (première manche)
	if (chargePartie() != oui) // En cas de problème, on crée une nouvelle partie
		nouvellePartie();
	else {
		partieNouvelle = non;
		afficheGrille();
		if (filRouge)
			montreLettresInexistantes();
		else
			cacheLettresInexistantes(); 
		afficheCompteurs();
		if (nbLettresChoisies)
			afficheMotChoisi();
		else
			retireMotChoisi(); 
		afficheScore(); // v1.1 : on rafraîchit tout
		if (affichageSolutions&&(!filRouge))
			document.images[idBtnDroite].src = chmPng + 'p' + extPng; // affichage du bouton ">"
	}
}
//---------------------------------------------------------------------------
function nouvellePartie()
{
	// /!\ Sauvegarde localStorage dans generePuisAfficheGrille
	filRouge = non;
	cacheLettresInexistantes(); // On cache les lettres inexistantes de la grille
	nbMotsRestants = nbMotsRLG; // indicateur de fin de manche (plus de mots à trouver : nbMotsRestants == 0).
	reinitialiseSelectionEtRetireMot(oui);
	grille = 1;
	indices = indRLG[grille];
	scoreGrille.initialise();
	afficheScore();
	afficheSablier(oui);
	setTimeout(function() {
		generePuisAfficheGrille(non);
   		attenteGrilleDemandee = non;
   		confirmationGrilleDemandee = non;
   		localStorage.agd = attenteGrilleDemandee;
		afficheSablier(non);
   	}, 500);
}
//---------------------------------------------------------------------------
function afficheBienvenueApresChargement()
{
	alert(	'Chargement automatique...\n\nUne partie est en cours...'+
			(attenteGrilleDemandee?(filRouge?	'\nVous avez terminé le Fil Rouge de la grille n°'+grille+'.\n\nTouchez "Grille" pour accéder à la grille suivante.':
												'\nVous avez terminé la première manche de la grille n°'+grille+'.\n\nTouchez "Grille" pour passer au Fil Rouge.'):
			 (filRouge?'\nVous êtes dans le Fil Rouge de la grille n°'+grille+'.':'\nVous êtes dans la première manche de la grille n°'+grille+'.')+
			 (affichageSolutions?' Vous avez abandonné et visualisez les solutions.\nTouchez ">" pour voir la solution suivante.':(nbLettresChoisies?' Vous avez commencé la sélection d\'un mot.':vide))+  
			 (filRouge&&(initialeFR==indefini)?(iMotFR==indefini?((nbMotsRestants<nbMotsFR)?' Vous venez de trouver un mot, c':' C')+'hoisissez un point de départ parmi les "?" verts.':' Vous avez choisi un point de départ, choisissez une lettre ou un autre point de départ.'):vide)+
			 ((!filRouge)&&(!affichageSolutions)?'\n\nLes indices de départ sont...\n'+stInitiales[0]+espace+stInitiales[1]+espace+stInitiales[2]+espace+stInitiales[3]+espace+stInitiales[4]+espace+stInitiales[5]+espace+stInitiales[6]+'.':vide)+
			 '\n\nTouchez "Grille" pour '+(filRouge?'passer le Fil Rouge.':(affichageSolutions?'commencer une nouvelle partie.':'abandonner et en commencer une nouvelle partie.'))));
}
//---------------------------------------------------------------------------
function bienvenue()
{
	toucheAutorisee = oui; // On autorise le clic (ou le touché)
	if (partieNouvelle)
		afficheAidePrincipale();
	else 
		afficheBienvenueApresChargement();
}
//---------------------------------------------------------------------------
