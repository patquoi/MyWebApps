 /*
 
 Fichier: MotissimoDuo.js
 
 Sujet: JavaScript principal de jeu
  
 Version: <2.1>
 
 Copyright (C) 2012 Patrice Fouquet.
 
 */ 

// id
// M<1-2><A-F><00-31>			= Messagerie   <1-2>=joueur <A-F>=ligne <00-31>=colonne
// G<1-2><0-9><0-9>				= Grille       <1-2>=joueur <0-9>=ligne   <0-9>=colonne
// L<1-2><0-9><0-9>				= Liens sites  <1-2>=joueur <0-9>=ligne   <0-9>=colonne
// N<1-2><0-9>					= Barre Niveau <1-2>=joueur               <0-9>=colonne
// R<1-2><0-9>					= Réponse mot  <1-2>=joueur               <0-9>=colonne
// S<1-2><CD-UB><1-2><0-9-R>	= Score        <1-2>=joueur <0-9>=ligne <CD-UB>=chiffre <R>=ligne Total (Ligne Résultat mot) 
// J<1-2><MOI-TOI>				= Joueur	   <1-2>=joueur <MOI-TOI>=indicateurs de colonne de score et de tour de joueur.
// O<1-2><F-T>                  = Options      <1-2>=joueur <F-T>=Options Force et mode Tour

/*
v1.2.1
 - Ajout liens vers les sites en ligne de définitions de mots comme dans MotissimoT/max (un site par lettre du mot à découvrir)
 - Compatibilité Chrome
v1.2.2
 - Impossibilité de changer les options même après une nouvelle partie (deux fois RAZ)
v1.2.3
 - Après une nouvelle partie, les deux joueurs peuvent changer les options.
v1.2.4
 - Correction du lien vers 1mot.fr
v2.0
 - Lifting complet !
v2.1
 - ODS7 (+4043 mots)
*/

//-----------
// CONSTANTES
//-----------

const stVersion 		= '2.1'; // v1.2 (stVersion)
const stVerDico			= '7'; // v2.1

// diverses dimensions
const joueurs			=  2;
const lettres			= 26;
const tailleMaxMsg		= 22;
const lignesMsg			=  6;
const tailleMinMot		=  5;
const tailleMaxMot		= 10;
const tailleMinNiv		=  3; // nombre de cases pour écrire le niveau sur la barre orange
const tailleMaxNiv		=  4; // nombre de cases pour écrire le niveau sur la barre orange
const niveauMax			= 12; // Deux tours identiques à chaque fois pour rendre équitable
const forceMax			=  3; // 0: Hasard ! - 1: 2 lettres données - 2: 1 lettre donnée - 3: aucune lettre donnée.
const lettresDonneesMax	=  2;
const modeTourMax       =  3; 
const modeNiveauMax		=  3;
const hauteurGrille		=  8;
const charCodeMin		= 65;

const indexMinJoueur 	= [ 0, 0,50];
const indexMaxJoueur 	= [ 0,49,99];

const motsDico	 		= [7645, 17318, 31070, 46329, 57467, 60487]; // ODS6

//	30/0-9 (50-59)	31/10-19 (60-69)	32/20-29 (70-79)
//	nAZERTYUIOP		fQSDFGHJKLM			tiWXCVBNckr
const clavier			= 'AZERTYUIOPQSDFGHJKLMiWXCVBNckrfnt                 AZERTYUIOPQSDFGHJKLMiWXCVBNckrfnt';
const messageForce		= ['AUCUNE (GRIS)','FACILE (VERT)','MOYENNE (ORANGE)','DIFFICILE (ROUGE)'];
const messageForceInfos = ['UNE FORCE ALEATOIRE !', '2 LETTRES DONNEES.', '1 LETTRE DONNEE.', 'AUCUNE LETTRE DONNEE.'];
const messageModeTour	= ['A CHAQUE PROPOSITION.','SANS LETTRE TROUVEE.','SI MOT INVALIDE.','AU NIVEAU SUIVANT.'];
const messageModeNiveau = ['A CHAQUE NIVEAU SANS', 'A CHAQUE NIVEAU AVEC', 'SI MOT NON TROUVE SANS', 'SI MOT NON TROUVE AVEC']; 

// paramètres de jeu
const tailleMotNiveau 	= [0, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
// diverses chaînes
const zero 				= '0';
const espace			= ' ';

const typeMarque 		= new creeTypeMarque();
const caseVide			= new creeLettre();
const typeModeTour      = new creeTypeModeTour();
const typeModeNiveau    = new creeTypeModeNiveau();

// éléments d'images png
const extPng 			= '.png';
const chmPng 			= ['','png/','6ud/'];
const chmMsg			= ['','msg/','6sw/']; 

// Préfixes/suffixes d'ID des tags <img>
const prefixeMessage	= 'M';
const prefixeGrille		= 'G';
const prefixeLien		= 'L'; // v1.2.1
const prefixeNiveau		= 'N';
const prefixeReponse	= 'R';
const suffixeReponse	= 'R';
const prefixeScore		= 'S';
const prefixeJoueur		= 'J';
const prefixeOption     = 'O';
const suffixeForce      = 'F';
const suffixeTour       = 'T';
const suffixeNiveau		= 'N';

// préfixes & suffixes divers 
const suffixeMarque		= ['','x','p','m','d','b'];
const suffixeMoiToi		= ['','MOI','TOI'];
const prefixeMoiToi		= ['','!m','!t'];
const centaineDizaine	= 'CD'; // début du score : CDx_
const uniteBlanc		= 'UB'; // fin   du score : xxUB
const prefixeSpecial	= '!';
const suffixeFinScore	= 'x';
const prefixeDebutScore	= 'x';
const prefixeOptionF	= '!F'; // png : '!F' suivi de la force (0-3)
const prefixeOptionT    = '!T'; // png : '!T' suivi du mode tour (0-3)
const prefixeOptionN		= '!N'; // png : '!N' suivi du mode niveau (0-4)
const debDuo			= '!duoD';
const finDuo			= '!duoF';
const debNiveau			= '!d';
const milNiveau			= '!m';
const milNiveauNiv		= '!Niveau12';
const milNiveauEau		= '!Niveau22';
const milNiveauNi		= '!Niveau13';
const milNiveauVe		= '!Niveau23';
const milNiveauAu		= '!Niveau33';
const milNiveauFin		= '!x';
const finNiveau			= '!f';

// nom de fichiers d'image png
const apostrophe 		= '!apostrophe';
const tiret  			= '!tiret';
const plus  			= '!plus';
const slash				= '!slash';
const egal				= '!egal';
const virgule  			= '!virgule';
const point  			= '!point';
const deuxpoints  		= '!deuxpoints';
const suspension        = '!suspension';
const exclamation		= '!exclamation';
const interrogation		= '!pix';
const mystere           = '!pi';
const guillemetG  		= '!guillemetG';
const guillemetD  		= '!guillemetD';
const parentheseG       = '!parentheseG';
const parentheseD       = '!parentheseD';
const information		= '!i';
const raz				= '!RAZ';
const effaceLettre		= '!C';
const effaceLigne		= '!K';
const rien	     		= '-';

// touches spéciales 
const toucheRAZ			= 'r';
const toucheEffaceLtr	= 'c';
const toucheEffaceLgn	= 'k';
const toucheOptionForce	= 'f';
const toucheOptionTour	= 't';
const toucheOptionNiveau= 'n';
const toucheNvPartie	= 'N';
const toucheInfo		= 'i';

// localStorage
const lsForce = 'force';
const lsJoueur = 'joueur';
const lsTypeFin = 'typeFin';
const lsSucces = 'succes';
const lsLettre = 'lettre';
const lsMarque = 'marque';
const lsMotValide = 'motValide';
const lsBienPlaces = 'bienPlaces';
const lsMalPlaces = 'malPlaces';
const lsScore = 'score';
const lsScore0 = 'score0';
const lsScore1 = 'score1';
const lsScore2 = 'score2';
const lsDonnees = 'donnees';
const lsTrouvees = 'trouvees';
const lsEstDonnee = 'estDonnee';
const lsLettreDonnee = 'lettreDonnee'; 

// v1.2.1: sites web en ligne 
const nbDicosDef		 = 5;
const nomDico			 = ['Centre National de Ressources Textuelles et Lexicales', 'Wiktionnaire', 'Larousse', 'Reverso', '1mot.fr'];
const lnkDico			 = ['http://www.cnrtl.fr/definition/', 'http://fr.wiktionary.org/w/index.php?search=', 'http://www.larousse.fr/dictionnaires/francais/', 'http://dictionnaire.reverso.net/francais-definition/', 'http://1mot.fr/'];

//----------
// VARIABLES
//----------

// Les sauvegardes sont signalées par (S) et les routines de lectures par (L)

// Options affichées (L/S)
var force 		= 1; 									// 0 = pas de force (aléatoire); 1..3 (resp. 2, 1 et 0 lettres données). Facile par défaut (2 lettres données)
var modeNiveau	= typeModeNiveau.mnChSonTourSansFin;	// 0 = chacun son tour sans fin (gris).   1 = chacun son tour avec fin (bleu)
                                                    	// 2 = si mot trouvé   sans fin (orange).   3 = si mot trouvé avec fin (rouge). Par défaut : 0 (chacun son tour sans fin de jeu)
var modeTour 	= typeModeTour.mtPasNvLettre; 		    // 0 = chacun son tour (gris). 3 = tout le niveau (vert). 2 = mot invalide (orange). 1 = Pas de nv lettre (rouge). Par défaut : 3 (pas de nv lettre).

// Variables de partie (S)
var joueur = 0; // 0 = pas de joueur courant; 1=gauche 2=droite
var niveau = 0; // 0 = pas de niveau; 1..12

// Mot à trouver (S)
var tailleMot = tailleMinMot;
var stReponse = '';

// Lettres données (S)
var lettresDonnees = 0;
var lettreDonnee = [-1, -1];
var estDonnee = [false, false, false, false, false, false, false, false, false, false];

// coordonnées courantes (S)
var colonne = -1;
var ligne = -1;

// Drapeaux sauvegardés
var typeFin = 0; // Requiert l'appui d'une lettre après affichage d'un message de fin : 0 = Pas de fin en cours; 1 = Fin de niveau ; 2 = Fin de Partie 
// Autres drapeaux (NON SAUVEGARDES)
var messageIntouchable = false; 
var solutionMontree = false; // pour débogage (false en livraison !) 
var pageInfo = [0, 0, 0]; // Page info (usage pageInfo[joueur]). Si 0, pas d'info en cours. 1 = sommaire
var demandeRAZ = 0; // indique le joueur qui demande la RAZ de la partie : demandeRAZ = joueur qui demande (0:personne et 1 ou 2 = joueur)
var afficheOption = [false, false, false]; // afficheOption[joueur] indique si joueur a demandé l'affichage d'une option.
var svgMsg = [[espace,espace,espace,espace,espace,espace],[espace,espace,espace,espace,espace,espace],[espace,espace,espace,espace,espace,espace]];
var svgSfx = [['x','x','x','x','x','x'],['x','x','x','x','x','x'],['x','x','x','x','x','x']]; 

// Elements de jeux en tableaux /!\ .S à utiliser
var grille = [];      // données au niveau lettre
var propositions = []; // données au niveau ligne
var score = [0, 0, 0]; // usage : score[joueur]
var alphabet = new creeAlphabet();

//--------------
// CONSTRUCTEURS
//--------------

function creeTypeMarque()
{
	this.mInvisible		= 0;	// vide
	this.mNormal 		= 1;	// 'A'..'Z' noir
	this.mFondGris 		= 2;	// 'A'..'Z' fond gris
	this.mFondRouge  	= 3;	// 'A'..'Z' fond rouge
	this.mFondOrange	= 4;	// 'A'..'Z' fond orange
	this.mFondVert 		= 5;	// 'A'..'Z' fond vert 
}

function creeLettre(x, y)
{
	this.x = x; this.y = y;					// coordonnées dans la grille, initialisée une seule fois
	this.lettre = espace; 					// lettre ::= ' '|'A'..'Z'
	this.marque = typeMarque.mInvisible; 	// marque ::= typeMarque
	this.affiche = lettreAffiche;
	this.efface = lettreEfface;
	this.initialise = lettreInitialise;
	this.ecrit = lettreEcrit;
	this.lit = lettreLit;
}

function creeProposition(ligne)
{
	this.ligne = ligne; // initialisée une fois pour toute
	this.motValide = false;
	this.bienPlaces = 0;
	this.malPlaces = 0;
	this.score = [0, 0, 0]; // usage : score[joueur]
	this.alphabet = new creeAlphabet(ligne);
	this.initialise = propositionInitialise;
	this.ecrit = propositionEcrit;
	this.lit = propositionLit;
}

function creeAlphabet(ligne)
{
	if (ligne!=undefined)
		this.ligne = ligne;
	this.donnees = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.trouvees = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.initialise = alphabetInitialise;
	this.ajouteDonnee = alphabetAjouteDonnee;
	this.ajouteTrouvee = alphabetAjouteTrouvee;
	this.ecrit = alphabetEcrit;
	this.lit = alphabetLit;
}

function creeTypeModeTour()
{
    this.mtChacunSonTour    = 0;    // Gris
    this.mtPasNvLettre      = 1;    // Rouge
    this.mtMotInvalide      = 2;    // Orange
    this.mtNiveauSuivant	= 3;	// Vert
}

function creeTypeModeNiveau()
{
    this.mnChSonTourSansFin = 0;    // Gris
    this.mnChSonTourAvecFin = 1;    // Bleu
    this.mnMotTrouveSansFin	= 2;	// Orange
    this.mnMotTrouveAvecFin	= 3;	// Rouge
}

function creeGrille() 
{ 
	grille = new Array(tailleMaxMot);
	for( var x = 0; x < tailleMaxMot; x++) {
		grille[x] = new Array(hauteurGrille);
		for( var y = 0; y < hauteurGrille; y++)
			grille[x][y] = new creeLettre(x, y);
	}
}

function creePropositions()
{
	propositions = new Array(hauteurGrille);
	for( var y = 0; y < hauteurGrille; y++)
		propositions[y] = new creeProposition(y);
}


//----------------
// INITIALISATEURS
//----------------

function initialiseGrille() 
{ 
	for( var x = 0; x < tailleMaxMot; x++ ) 
		for( var y = 0; y < hauteurGrille; y++ )
			grille[x][y].initialise();
}

function initialisePropositions()
{
	for( var y = 0; y < hauteurGrille; y++ )
		propositions[y].initialise();
}

//----------------
// ENTREES/SORTIES
//----------------

function litGrille()
{ 
	for( var x = 0; x < tailleMaxMot; x++) 
		for( var y = 0; y < hauteurGrille; y++)
			grille[x][y].lit();
}

function ecritGrille()
{ 
	for( var x = 0; x < tailleMaxMot; x++) 
		for( var y = 0; y < hauteurGrille; y++)
			grille[x][y].ecrit();
}

function litPropositions()
{
	for( var y = 0; y < hauteurGrille; y++ )
		propositions[y].lit();
}

function ecritPropositions()
{
	for( var y = 0; y < hauteurGrille; y++ )
		propositions[y].ecrit();
}

//---------
// METHODES
//---------

// Méthodes de grille[][]

function lettreInitialise()
{
	this.lettre = espace; 					// lettre ::= ' '|'A'..'Z'
	this.marque = typeMarque.mInvisible; 	// marque ::= typeMarque
}

function lettreLit()
{
	this.lettre = localStorage.getItem(lsLettre+this.x+this.y);
	this.marque = parseInt(localStorage.getItem(lsMarque+this.x+this.y), 10);
}

function lettreEcrit()
{
	localStorage.setItem(lsLettre+this.x+this.y, this.lettre);
	localStorage.setItem(lsMarque+this.x+this.y, this.marque);
}

// méthode de caseVide
function lettreEfface(x, y)
{
	for(var j=1; j<=joueurs; j++) {
		var nvSrc = chmPng[j] + rien + extPng;
		var id = prefixeGrille + j + x + y;
    	document.images[id].src = nvSrc;
	}
}

function lettreAffiche()
{
	var i0=Math.floor((tailleMaxMot-tailleMot)/2);
	var lettre = this.lettre;
	var marque = this.marque;

	if ((this.y==ligne) && (this.lettre == espace)) 
		if (estDonnee[this.x]) { // Est-ce une lettre donnée au départ (rappel des lettres données) ?
			lettre = stReponse[this.x];
			marque = typeMarque.mFondVert;
		}		
		else { // Sinon, a-t-elle été trouvée dans les lignes précédentes (rappel des lettres trouvées) ?
			var trouvee=false;
			for(var y=0; (!trouvee) && (y<ligne); y++)
				trouvee = (grille[this.x][y].marque == typeMarque.mFondVert);
			if (trouvee) {
				lettre = stReponse[this.x];
				marque = typeMarque.mFondVert;
			}		
		}
	
	for(var j=1; j<=joueurs; j++) {
		var nvSrc = chmPng[j];
		if (marque == typeMarque.mInvisible)
			nvSrc = nvSrc + rien; 
		else
			nvSrc = nvSrc + (lettre==espace?mystere:lettre) + suffixeMarque[marque];
		nvSrc = nvSrc + extPng;
		var id = prefixeGrille + j + (this.x+i0) + this.y;
    	document.images[id].src = nvSrc;
	}
}

// Méthodes de propositions[]
function propositionInitialise()
{
	this.motValide = false;
	this.bienPlaces = 0;
	this.malPlaces = 0;
	this.score[0] = 0;
	this.score[1] = 0;
	this.score[2] = 0;
	this.alphabet.initialise();
}

function propositionLit()
{
	if (localStorage.getItem(lsMotValide+this.ligne)) // v1.2.1 - Compatibilité Chrome
		this.motValide = (localStorage.getItem(lsMotValide+this.ligne).toString() == 'true');
	else
		this.motValide = false;
	this.bienPlaces = parseInt(localStorage.getItem(lsBienPlaces+this.ligne), 10);
	this.malPlaces = parseInt(localStorage.getItem(lsMalPlaces+this.ligne), 10);
	this.score[0] = parseInt(localStorage.getItem(lsScore0+this.ligne), 10);
	this.score[1] = parseInt(localStorage.getItem(lsScore1+this.ligne), 10);
	this.score[2] = parseInt(localStorage.getItem(lsScore2+this.ligne), 10);
	this.alphabet.lit();
}

function propositionEcrit()
{
	localStorage.setItem(lsMotValide+this.ligne, this.motValide);
	localStorage.setItem(lsBienPlaces+this.ligne, this.bienPlaces);
	localStorage.setItem(lsMalPlaces+this.ligne, this.malPlaces);
	localStorage.setItem(lsScore0+this.ligne, this.score[0]);
	localStorage.setItem(lsScore1+this.ligne, this.score[1]);
	localStorage.setItem(lsScore2+this.ligne, this.score[2]);
	this.alphabet.ecrit();
}
  
// Méthodes de alphabet

function alphabetInitialise()
{
	for(var i=0; i<lettres; i++) {
		this.donnees[i] = 0;
		this.trouvees[i] = 0;
	}
}

function alphabetLit()
{
	var stligne = '';
	if (this.ligne != undefined)
		stligne = stligne + this.ligne;
	for(var i=0; i<lettres; i++) {
		this.donnees[i] = parseInt(localStorage.getItem(lsDonnees+stligne+String.fromCharCode(charCodeMin+i)), 10);
		this.trouvees[i] = parseInt(localStorage.getItem(lsTrouvees+stligne+String.fromCharCode(charCodeMin+i)), 10);
	}
}

function alphabetEcrit(lettre)
{
	var stligne = '';
	if (this.ligne != undefined)
		stligne = stligne + this.ligne;
	if (lettre == undefined)
		for(var i=0; i<lettres; i++) {
			localStorage.setItem(lsDonnees+stligne+String.fromCharCode(charCodeMin+i), this.donnees[i]);
			localStorage.setItem(lsTrouvees+stligne+String.fromCharCode(charCodeMin+i), this.trouvees[i]);
		}
	else {
		localStorage.setItem(lsDonnees+stligne+lettre, this.donnees[lettre.charCodeAt(0) - 'A'.charCodeAt(0)]);
		localStorage.setItem(lsTrouvees+stligne+lettre, this.trouvees[lettre.charCodeAt(0) - 'A'.charCodeAt(0)]);
	}
}

function alphabetAjouteDonnee(lettre)
{
	this.donnees[lettre.charCodeAt(0) - 'A'.charCodeAt(0)]++;
	this.ecrit(lettre);
}

function alphabetAjouteTrouvee(grilleXY)
{
	switch(grilleXY.marque) {
		case typeMarque.mFondRouge:
		case typeMarque.mFondVert:		this.trouvees[grilleXY.lettre.charCodeAt(0) - 'A'.charCodeAt(0)]++;
										break;
		case typeMarque.mFondOrange:	this.trouvees[grilleXY.lettre.charCodeAt(0) - 'A'.charCodeAt(0)]+=2;
										break;
		default:						break;
	}
	this.ecrit(grilleXY.lettre);
}

//------------
// UTILITAIRES
//------------

function stNombre(nombre, taille, remplissage) // remplissage ='0' par défaut.
{
    if (remplissage == undefined)
        remplissage = zero;
    if (nombre < 0)
        remplissage = espace;
    var stNombre = '';
    if ((nombre < 100) && (taille > 2)) stNombre = stNombre + remplissage;
    if ((nombre < 10) && (taille > 1)) stNombre = stNombre + remplissage;
    stNombre = stNombre + Math.floor(nombre);
    return stNombre;
}

//-------------------
// AFFICHAGE MESSAGES
//-------------------

function afficheMessageCaractere(joueur, ligne, colonne, caractere, suffixe) // suffixe est facultatif ('x' par défaut)
{
    if (suffixe==undefined)
        suffixe = suffixeMarque[typeMarque.mNormal];
	for(var j=1; j<=joueurs; j++)
		if ((!joueur)||(joueur==j)) {
			var nvSrc = chmPng[j] + chmMsg[j];
        	switch(caractere) {
        		case ' ':	nvSrc = nvSrc + rien + extPng; break;
            	case '\'':  nvSrc = nvSrc + apostrophe + suffixe + extPng; break;
            	case '-':   nvSrc = nvSrc + tiret + suffixe + extPng; break;
            	case '+':   nvSrc = nvSrc + plus + extPng; break;
            	case '/':	nvSrc = nvSrc + slash + extPng; break;
            	case '=':	nvSrc = nvSrc + egal + extPng; break;
            	case ',':   nvSrc = nvSrc + virgule + extPng; break;
            	case '.':   nvSrc = nvSrc + point + suffixe + extPng; break;
            	case ':':   nvSrc = nvSrc + deuxpoints + extPng; break;
                case ';':   nvSrc = nvSrc + suspension + extPng; break;
            	case '!':	nvSrc = nvSrc + exclamation + extPng; break;
            	case '<':   nvSrc = nvSrc + guillemetG + extPng; break;
            	case '>':   nvSrc = nvSrc + guillemetD + extPng; break;
            	case '(':   nvSrc = nvSrc + parentheseG + extPng; break;
            	case ')':   nvSrc = nvSrc + parentheseD + extPng; break;
            	case '?':	nvSrc = nvSrc + interrogation + extPng; break;
                case 'a':   nvSrc = nvSrc + prefixeMoiToi[2] + suffixeMarque[typeMarque.mFondGris] + extPng; break;
            	case 'c':	nvSrc = nvSrc + effaceLettre + extPng; break;
            	case 'd':	nvSrc = nvSrc + debDuo + extPng; break;
                case 'f':   nvSrc = nvSrc + prefixeOptionF + zero + extPng; break;
            	case 'i':	nvSrc = nvSrc + information + extPng; break;
                case 'j':   nvSrc = nvSrc + prefixeMoiToi[1] + suffixeMarque[typeMarque.mFondGris] + extPng; break;
            	case 'k':	nvSrc = nvSrc + effaceLigne + extPng; break;
				case 'l':	nvSrc = nvSrc + '!M2' + extPng; break;
                case 'm':	nvSrc = nvSrc + '!M1' + extPng; break;
                case 'n':	nvSrc = nvSrc + prefixeOptionN + zero + extPng; break;
            	case 'o':	nvSrc = nvSrc + finDuo + extPng; break;
                case 'p':	nvSrc = nvSrc + '!N1' + extPng; break;
                case 'q':	nvSrc = nvSrc + '!N2' + extPng; break;  
				case 'r':	nvSrc = nvSrc + raz + extPng; break;
                case 's':	nvSrc = nvSrc + '!N3' + extPng; break;  
                case 't':   nvSrc = nvSrc + prefixeOptionT + zero + extPng; break;
                case 'u':	nvSrc = nvSrc + '!T1' + extPng; break;
                case 'v':	nvSrc = nvSrc + '!T2' + extPng; break;  
                case 'w':	nvSrc = nvSrc + '!T3' + extPng; break;  
            	case 'x':	nvSrc = nvSrc + '!F1' + extPng; break;
            	case 'y':	nvSrc = nvSrc + '!F2' + extPng; break;
            	case 'z':	nvSrc = nvSrc + '!F3' + extPng; break;
            	default:	if ((caractere>='0') && (caractere<='9'))   
            					nvSrc = nvSrc + caractere + extPng;
            				else
            			 		nvSrc = nvSrc + caractere + suffixe + extPng; 
            			 	break;
        	}
        	var id = prefixeMessage + j + String.fromCharCode(charCodeMin + ligne) + stNombre(colonne, 2);
    		document.images[id].src = nvSrc;
		}
}

function afficheMessage(joueur, ligne, stMsg, suffixe) // suffixe est facultatif ('x' par défaut)
{
    if (suffixe==undefined)
        suffixe = suffixeMarque[typeMarque.mNormal];

	// Sauvegarde du message le cas échéant (page info, affichage option ou demandeRAZ en cours)
	if (((!joueur)||(joueur==1)) && 
		(!pageInfo[1]) && (!afficheOption[1]) && (!demandeRAZ)) {
			svgMsg[1][ligne]=stMsg;
			svgSfx[1][ligne]=suffixe;
		}
	if (((!joueur)||(joueur==2)) && 
		(!pageInfo[2]) && (!afficheOption[2]) && (!demandeRAZ)) {
			svgMsg[2][ligne]=stMsg;
			svgSfx[2][ligne]=suffixe;
		}			
		
	var l=stMsg.length;
	var i0=Math.floor((tailleMaxMsg-l)/2);
	for(var i=0; i<i0; i++)
		afficheMessageCaractere(joueur, ligne, i, espace);
	for(var i=0; i<l; i++)
		afficheMessageCaractere(joueur, ligne, i0+i, stMsg[i], suffixe);	
	for(var i=i0+l; i<tailleMaxMsg; i++)
		afficheMessageCaractere(joueur, ligne, i, espace);
}

//----------
// AFFICHAGE
//----------

// OPTIONS

function ecritOptions()
{
	localStorage.force = force;
	localStorage.modeNiveau = modeNiveau;
	localStorage.modeTour = modeTour;
}

function definitOptionsParDefaut()
{
	force 		= 1;
	modeNiveau	= typeModeNiveau.mnChSonTourSansFin;
	modeTour 	= typeModeTour.mtPasNvLettre;
	ecritOptions();	
}

function litOptions()
{
	force = parseInt(localStorage.force, 10);
	modeNiveau = parseInt(localStorage.modeNiveau, 10);
	modeTour = parseInt(localStorage.modeTour, 10);
}

function afficheOptions()
{
	ecritOptions();
    for(var j=1; j<=joueurs; j++) {
        document.images[prefixeOption + j + suffixeForce].src = chmPng[j] + prefixeOptionF + force + extPng;
        document.images[prefixeOption + j + suffixeTour].src = chmPng[j] + prefixeOptionT + modeTour + extPng;
        document.images[prefixeOption + j + suffixeNiveau].src = chmPng[j] + prefixeOptionN + modeNiveau + extPng;
    }
}

// TOUR

function afficheMoiToi()
{
	localStorage.joueur = joueur;
	for(var j=1; j<=joueurs; j++) // joueur
		for(var i=1; i<=joueurs; i++) { // indicateur TOI MOI
			var id = prefixeJoueur + j + suffixeMoiToi[i];
			var nvSrc = chmPng[j] + prefixeMoiToi[i];
			if (joueur) 
				nvSrc = nvSrc + suffixeMarque[(i==((j==1)?joueur:(3-joueur)))?typeMarque.mFondVert:typeMarque.mFondRouge];
			else
				nvSrc = nvSrc + suffixeMarque[typeMarque.mFondGris];
			document.images[id].src = nvSrc + extPng;
		}
	afficheMessageTonTour(joueur);
	afficheMessagePasTonTour(3-joueur);
}

function afficheNiveau()
{
	var i0=Math.floor((tailleMaxMot-tailleMot)/2);
	var tailleNiveau = (niveau > 9 ? tailleMaxNiv : tailleMinNiv);
	for(var j=1; j<=joueurs; j++) {
		var debSrc = chmPng[j];
		for(var i=0; i<i0; i++)
    		document.images[prefixeNiveau + j + i].src = debSrc + rien + extPng;
		for(var i=0; i<tailleMot; i++) {
			var id = prefixeNiveau + j + (i0+i);
			switch(i) {
    			case 0: 			document.images[id].src = debSrc + debNiveau + extPng; break;
    			case tailleMot-1: 	document.images[id].src = debSrc + finNiveau + extPng; break;
    			default:			var di = ((tailleNiveau % 2) != (tailleMot % 2)); 
    								switch(i - Math.floor((tailleMot - tailleNiveau) / 2)) {
    									case 0:		if (di)
    													document.images[id].src = debSrc + milNiveauNi + extPng;
    												else
    													document.images[id].src = debSrc + milNiveauNiv + extPng;
    												break;
    									case 1:		if (di)
    													document.images[id].src = debSrc + milNiveauVe + extPng;
    												else
    													document.images[id].src = debSrc + milNiveauEau + extPng;
    												break;
    									case 2:		if (di)
    													document.images[id].src = debSrc + milNiveauAu + extPng;
    												else
    													document.images[id].src = debSrc + prefixeSpecial + (niveau > 9 ? Math.floor(niveau / 10) : niveau)   + extPng;
    												break;
    									case 3:		if (di) 
    													document.images[id].src = debSrc + (niveau > 9 ? prefixeSpecial + Math.floor(niveau / 10) : (milNiveauFin + niveau))   + extPng;
    												else
    													document.images[id].src = debSrc +                  (niveau > 9 ? (milNiveauFin + Math.floor(niveau % 10)) : milNiveau) + extPng; 
    												break;
    									case 4: 	if (di)
    													document.images[id].src = debSrc +                  (niveau > 9 ? (milNiveauFin + Math.floor(niveau % 10)) : milNiveau) + extPng; 
    												else
    													document.images[id].src = debSrc + milNiveau + extPng;
    												break;
    									default:	document.images[id].src = debSrc + milNiveau + extPng; break; 
    								}
    								break;		
			}
		}
		for(var i=i0+tailleMot; i<tailleMaxMot; i++)
    		document.images[prefixeNiveau + j + i].src = debSrc + rien + extPng;
	}
}

function afficheReponse(montre)
{
	if (solutionMontree) montre=true;
	var i0=Math.floor((tailleMaxMot-tailleMot)/2);
	for(var j=1; j<=joueurs; j++) {
		for(var x=0; x<i0; x++)
			document.images[prefixeReponse + j + x].src = chmPng[j] + rien + extPng;
		for(var x=0; x<tailleMot; x++) { // v1.2.1
			document.images[prefixeReponse + j + (i0+x)].src = chmPng[j] + (montre?stReponse[x]:mystere) + suffixeMarque[typeMarque.mFondVert] + extPng;

			// v1.2.1: on active ou non les liens vers les sites  de définition en ligne...
			var id = prefixeLien + j + (i0+x);
			if (montre) {
				document.links[id].href = lnkDico[x%nbDicosDef] + stReponse;
				if (x%nbDicosDef==nbDicosDef-1)
					document.links[id].href = document.links[id].href.toLowerCase() + '.htm'; // v1.2.4 - .toLowerCase()
				document.links[id].target = '_blank';
			}
			else {
				document.links[id].href = '#';
				document.links[id].target = '_self';
			}
			
		}
		for(var x=0; x<tailleMaxMot-tailleMot-i0; x++)
			document.images[prefixeReponse + j + (i0+tailleMot+x)].src = chmPng[j] + rien + extPng;
	}
}

function effaceScores()
{
	for(var l=0; l<hauteurGrille; l++) 
		for(var i=1; i<=joueurs; i++)
			for(var j=1; j<=joueurs; j++) {
				var nvSrc = chmPng[i] + rien + extPng;
				// début du score
				var id = prefixeScore + i + centaineDizaine + j + l;
				document.images[id].src = nvSrc;
				// fin du score
				var id = prefixeScore + i + uniteBlanc + j + l;
				document.images[id].src = nvSrc;
			}
}

function afficheScore(joueur, ligne) // si ligne = undefined, on affiche le score de la partie. Si joueur = undefined, on affiche les deux scores.
{
	if (joueur==undefined) {
		afficheScore(1, ligne);
		afficheScore(2, ligne);
	}
	else {
		if (ligne==undefined)
			localStorage.setItem(lsScore+joueur, score[joueur]);
		else
			localStorage.setItem(lsScore+joueur+ligne, propositions[ligne].score[joueur]); 
		var stLigne	=	(ligne==undefined?suffixeReponse:ligne);
		var s		=	(ligne==undefined?score[joueur]:propositions[ligne].score[joueur]); 
		for(var j=1; j<=joueurs; j++) {
			// début du score
			var id = prefixeScore + j + centaineDizaine + (j==1?joueur:3-joueur) + stLigne;
			var scoreCD = Math.floor(s / 10);
			if (!scoreCD)
				document.images[id].src = chmPng[j] + rien + extPng;
			else
				if (scoreCD<10)
					document.images[id].src = chmPng[j] + prefixeDebutScore + scoreCD + extPng;
				else 
					document.images[id].src = chmPng[j] + scoreCD + extPng;
			// fin du score
			var id = prefixeScore + j + uniteBlanc + (j==1?joueur:3-joueur) + stLigne;
			var scoreU = Math.floor(s % 10);
			document.images[id].src = chmPng[j] + scoreU + suffixeFinScore + extPng;
		}
	}
}

function afficheGrille()
{
	var i0=Math.floor((tailleMaxMot-tailleMot)/2);
	for(var x=0; x<i0; x++) 
		for(var y=0; y<hauteurGrille; y++)
			caseVide.efface(x, y);
	for(var x=0; x<tailleMot; x++) 
		for(var y=0; y<hauteurGrille; y++)
			grille[x][y].affiche();
	for(var x=0; x<tailleMaxMot-tailleMot-i0; x++) 
		for(var y=0; y<hauteurGrille; y++)
			caseVide.efface(x + i0 + tailleMot, y);
	afficheNiveau();
	afficheReponse(false);
}

function changeTourJoueurSelonModeTour()
{
	if (!ligne) {
		joueur = 2 - niveau % 2;
		messageIntouchable = false;
		afficheMoiToi();
	}
	else
		switch(modeTour) {
			case typeModeTour.mtChacunSonTour:	joueur = 2 - (niveau + ligne) % 2;
												messageIntouchable = false;
												afficheMoiToi();
												break;
			case typeModeTour.mtMotInvalide:	if (!propositions[ligne-1].motValide) {
													joueur = 3 - joueur;
													messageIntouchable = false;
													afficheMoiToi();
												}
												break;
			case typeModeTour.mtPasNvLettre:	if (!propositions[ligne-1].score[joueur]) {
													joueur = 3 - joueur;
													messageIntouchable = false;
													afficheMoiToi();													
												}
			default:							break;
		}
}

function ecritCoordonnees()
{
	localStorage.ligne = ligne;
	localStorage.colonne = colonne;
}

function litCoordonnees()
{
	ligne = parseInt(localStorage.ligne, 10);
	colonne = parseInt(localStorage.colonne, 10);
}

function initialiseLigne()
{
	changeTourJoueurSelonModeTour();
	
	colonne = 0; localStorage.colonne = 0;
	
	for(var x=0; x<tailleMot; x++) {
		grille[x][ligne].marque = typeMarque.mNormal; 
		grille[x][ligne].lettre = espace; 
		grille[x][ligne].ecrit();
	}
}

function afficheLigne()
{
	for(var x=0; x<tailleMot; x++) 
		grille[x][ligne].affiche();
}

function ecritLettresDonnees()
{
	localStorage.lettresDonnees = lettresDonnees;
	for(var i=0; i<tailleMaxMot; i++)
		localStorage.setItem(lsEstDonnee+i, estDonnee[i]);
	for(var i=0; i<lettresDonneesMax; i++)
		localStorage.setItem(lsLettreDonnee+i, lettreDonnee[i]); 
}

function litLettresDonnees()
{
	lettresDonnees = parseInt(localStorage.lettresDonnees, 10);
	for(var i=0; i<tailleMaxMot; i++)
		if (localStorage.getItem(lsEstDonnee+i)) // v1.2.1 - Compatibilité Chrome
			estDonnee[i] = (localStorage.getItem(lsEstDonnee+i).toString() == 'true');
		else
			estDonnee[i] = false;
	for(var i=0; i<lettresDonneesMax; i++)
		lettreDonnee[i] = localStorage.getItem(lsLettreDonnee+i); 
}

function initialiseNiveau()
{
	localStorage.typeFin = typeFin;
	localStorage.niveau = niveau;
	
	// On choisit un mot à deviner…
	tailleMot = tailleMotNiveau[niveau];
	localStorage.tailleMot = tailleMot;
	
	stReponse = dico[tailleMot - tailleMinMot][Math.floor(motsDico[tailleMot - tailleMinMot] * Math.random())];
	localStorage.stReponse = stReponse;
	
	initialiseGrille(); ecritGrille();
	initialisePropositions(); ecritPropositions();
	alphabet.initialise();	alphabet.ecrit();

	effaceScores();

	ligne = 0; localStorage.ligne = 0;
	initialiseLigne();
		
	// Lettres données
	for(var i=0; i<tailleMaxMot; i++)
		estDonnee[i] = false;
	for(var i=0; i<lettresDonneesMax; i++)
		lettreDonnee[i]=0;
	if (!force) {
		if (joueur == 1) // force aléatoire tous les deux niveaux ! 
			lettresDonnees = Math.floor((lettresDonneesMax + 1) * Math.random());
	}
	else 
		lettresDonnees = 3 - force;
	if (lettresDonnees>0) {
		lettreDonnee[0] = Math.floor(tailleMot * Math.random());
		estDonnee[lettreDonnee[0]]=true;
		alphabet.ajouteDonnee(stReponse[lettreDonnee[0]]);
	}
	if (lettresDonnees>1) {
		do
			lettreDonnee[1] = Math.floor(tailleMot * Math.random());
		while(lettreDonnee[1] == lettreDonnee[0]);
		estDonnee[lettreDonnee[1]] = true;
		alphabet.ajouteDonnee(stReponse[lettreDonnee[1]]);
	}
	ecritLettresDonnees();
	
	afficheGrille();		
}

function initialisePartie()
{
	localStorage.typeFin = typeFin;
	joueur = 0; localStorage.joueur = 0;
	
	score[1] = 0; score[2] = 0;
	afficheScore();
	
	colonne = -1; ligne = -1;
	ecritCoordonnees();

	niveau = 1;	localStorage.niveau = niveau;
	
	afficheOptions();
	
	initialiseNiveau();	
}

function calculeEtAfficheScore() 
{
	score[0] = 0;
	for(var y=ligne-1; y<hauteurGrille; y++) {
		propositions[y].score[joueur] += tailleMot-lettresDonnees;
		afficheScore(joueur, y);
		score[joueur] += tailleMot-lettresDonnees;
		score[0] += tailleMot-lettresDonnees; // Score intermédiaire pour affichage
		localStorage.score0 = score[0];
	}
	afficheScore(joueur);
}

function afficheFinNiveau(succes)
{
	afficheReponse(true);
	typeFin = 1; localStorage.typeFin = typeFin; // Fin de niveau
	localStorage.succes = succes;
	if (succes) {
		afficheMessage(joueur, 0, 'BRAVO, TU AS TROUVE !');
		afficheMessage(joueur, 1, 'TU OBTIENS '+score[0]+' POINTS.');
		afficheMessage(3-joueur, 0, 'DOMMAGE, IL A TROUVE !');
		afficheMessage(3-joueur, 1, 'IL OBTIENT '+score[0]+' POINTS.');
		afficheMessage(0, 2, 'TOUCHE UNE LETTRE.');
		afficheMessage(0, 3, espace);
		afficheMessage(0, 4, 'TOUCHE LA REPONSE POUR'); // v1.2.1
		afficheMessage(0, 5, 'LA DEFINITION EN LIGNE'); // v1.2.1
	} 
	else {
		afficheMessage(0, 0, 'PERSONNE N\'A TROUVE !');
		afficheMessage(0, 1, 'NIVEAU SUIVANT.');
		afficheMessage(0, 2, 'TOUCHE UNE LETTRE;');
		afficheMessage(0, 3, espace);
		afficheMessage(0, 4, 'TOUCHE LA REPONSE POUR'); // v1.2.1
		afficheMessage(0, 5, 'LA DEFINITION EN LIGNE'); // v1.2.1
		if (Math.floor(modeNiveau / 2) >= 1) { // Si mot non trouvé, changement de joueur (modeNiveau > 1) 
			joueur = 3 - joueur;
			localStorage.joueur = joueur;
		}
	}
}

function afficheFinPartie(succes) 
{
	afficheReponse(true);
	typeFin = 2; localStorage.typeFin = typeFin; // Fin de partie
	localStorage.succes = succes;
	if (succes) {
		afficheMessage(joueur, 0, 'BRAVO, TU AS TROUVE !');
		afficheMessage(joueur, 1, 'TU OBTIENS '+score[0]+' POINTS.');
		afficheMessage(3-joueur, 0, 'DOMMAGE, IL A TROUVE !');
		afficheMessage(3-joueur, 1, 'IL OBTIENT '+score[0]+' POINTS.');
		afficheMessage(0, 2, 'DERNIER NIVEAU :');
		afficheMessage(0, 3, 'FIN DE JEU !');
		afficheMessage(0, 4, 'TOUCHE UNE LETTRE;');
		afficheMessage(0, 5, espace);
	}
	else {
		afficheMessage(0, 0, 'PERSONNE N\'A TROUVE !');
		afficheMessage(0, 1, 'LA PARTIE EST TERMINEE;');
		afficheMessage(0, 2, 'TOUCHE UNE LETTRE.');
		afficheMessage(0, 3, espace);
		afficheMessage(0, 4, 'TOUCHE LA REPONSE POUR'); // v1.2.1
		afficheMessage(0, 5, 'LA DEFINITION EN LIGNE'); // v1.2.1
	}
}

function marqueProposition()
{	
	var trouves = 0;
	var stProposition = '';
	for(var x=0; x<tailleMot; x++)
		stProposition = stProposition + grille[x][ligne].lettre;

	if (estDansLeDico(stProposition)) {
		
		var motFait = new Array (false, false, false, false, false, false, false, false, false, false); 
		var grilleFaite = new Array (false, false, false, false, false, false, false, false, false, false); 
		propositions[ligne].malPlaces = 0;
		propositions[ligne].bienPlaces = 0;
		propositions[ligne].motValide = true;

		for( var x = 0; x < tailleMot; x++) {
			if (grille[x][ligne].lettre == stReponse[x]) {
				grille[x][ligne].marque = typeMarque.mFondVert; // good place
				grille[x][ligne].ecrit();
				grille[x][ligne].affiche();
				motFait[x] = true;
				grilleFaite[x] = true;
				trouves++;
			}
			else {
				grille[x][ligne].marque = typeMarque.mFondGris; // pas placé par défaut
				grille[x][ligne].ecrit();
				grille[x][ligne].affiche();
			}
		}

		for( var x = 0; x < tailleMot; x++) {
			for( var y = 0; y < tailleMot; y++) { 
				if ((!grilleFaite[x]) && 
					(!motFait[y]) && 
					(grille[x][ligne].lettre == stReponse[y]) && 
					(x != y)) {
						grille[x][ligne].marque = typeMarque.mFondRouge; // mal placé
						grille[x][ligne].ecrit();
						grille[x][ligne].affiche();
						grilleFaite[x] = true;
						motFait[y] = true;
				}
			}
		}
        
		for( var y = 0; y < tailleMot; y++) {
			for( var x = 0; x < tailleMot; x++) { 
        		if (!motFait[y]) {
					// lettre non marquée: double mal placée potentielle
					if ((grille[x][ligne].lettre == stReponse[y]) && 
						(x != y) &&
						(grille[x][ligne].marque == typeMarque.mFondRouge)) {
							grille[x][ligne].marque = typeMarque.mFondOrange; // mal placé 2 fois
							grille[x][ligne].ecrit();
							grille[x][ligne].affiche();
							motFait[y] = true;
					}
				}
			}
		}

	}
    
    // On regarde si l'on a trouvé de nouvelles lettres : ça peut rapporter 1 point par lettre nouvelle trouvée (bien ou mal placée).
    for(var x=0; x<tailleMot; x++) 
   		propositions[ligne].alphabet.ajouteTrouvee(grille[x][ligne]);
    
    for(var l=0; l<lettres; l++) {
    	var trouvees = propositions[ligne].alphabet.trouvees[l] - alphabet.trouvees[l] - alphabet.donnees[l];
    	if (trouvees > 0) {
    		propositions[ligne].score[joueur] += trouvees;
    		score[joueur] += trouvees;
    		alphabet.trouvees[l] = propositions[ligne].alphabet.trouvees[l] - alphabet.donnees[l];
    		alphabet.ecrit(String.fromCharCode(charCodeMin+l));
    	}
    }

    // Affiche le score de l'adversaire (0)
	afficheScore(joueur, ligne);
	afficheScore(joueur);
	afficheScore(3-joueur, ligne);
	afficheScore(3-joueur);
    
 	colonne = 0; ligne++;
	ecritCoordonnees();

	// v1.4.2
	if ((ligne == hauteurGrille) || (trouves == tailleMot)) { // dernière ligne ou solution trouvée
		if (trouves == tailleMot) { // Solution trouvée !
 			calculeEtAfficheScore();
 			if (niveau < niveauMax) { 
 				afficheFinNiveau(true); // fin de niveau avec succès
				return;
 			}
 			else {
				afficheFinPartie(true); // Fin de jeu avec succès
				return;
 			}
 		}
 		else { 
            if (niveau < niveauMax) { 
                if (modeNiveau % 2) 
                    afficheFinPartie(false);
                else
                    afficheFinNiveau(false);
                return;
            }
            else {
                afficheFinPartie(false);
                return
            }
        }
 	}  	 
 	else {
 		initialiseLigne();
 		afficheLigne();
 		return;
 	}   			    
}

function reafficheMessages(toucheur)
{
	for(var i=0; i<lignesMsg; i++)
		afficheMessage(toucheur, i, svgMsg[toucheur][i], svgSfx[toucheur][i]);
}

function testeSuiteInfo(toucheur, caractere)
{
	if (caractere==toucheInfo) {
		reafficheMessages(toucheur);
		pageInfo[toucheur]=0;
	}
	else {
		switch(pageInfo[toucheur]) {
			case 2:	afficheMessage(toucheur, 0, '  DANS mOuISSIlOdo,   ');
					afficheMessage(toucheur, 1, '  TU DOIS DECOUVRIR   ');
					afficheMessage(toucheur, 2, 'UN MOT CACHE DE 5 A 10');
					afficheMessage(toucheur, 3, 'LETTRES EN ENTRANT DES');
					afficheMessage(toucheur, 4, ' MOTS DU DICO ODS 6 A ');
					afficheMessage(toucheur, 5, '     TOUR DE ROLE;;   ');
					break;			
			case 3:	afficheMessage(toucheur, 0, 'SI LE MOT EST VALIDE, ');
					afficheMessage(toucheur, 1, 'LES LETTRES DU MOT SE ');
					afficheMessage(toucheur, 2, ' COLORENT. LA COULEUR ');
					afficheMessage(toucheur, 3, 'DE LA LETTRE RENSEIGNE');
					afficheMessage(toucheur, 4, ' SUR SA POSITION DANS ');
					afficheMessage(toucheur, 5, '  LE MOT A TROUVER;;  ');
					break;			
			case 4:	afficheMessage(toucheur, 0, 'PAR EXEMPLE, AVEC <F>:');
					afficheMessage(toucheur, 1, 'F;;;;;;;;;MOT INVALIDE');
					afficheMessage(toucheur, 2, 'f;;;;;;PAS DANS LE MOT');
					afficheMessage(toucheur, 3, 'z;;;;;;;;;;;MAL PLACEE');
					afficheMessage(toucheur, 4, 'y;;;;MAL PLACEE 2 FOIS');
					afficheMessage(toucheur, 5, 'x;;;;;;;;;;BIEN PLACEE');
					break;			
			case 5:	afficheMessage(toucheur, 0, '  LES LETTRES VERTES  ');
					afficheMessage(toucheur, 1, '  SONT RAPPELEES SUR  ');
					afficheMessage(toucheur, 2, ' LES LIGNES SUIVANTES.');
					afficheMessage(toucheur, 3, '   TU AS 8 COUPS AU   ');
					afficheMessage(toucheur, 4, 'MAXIMUM POUR DECOUVRIR');
					afficheMessage(toucheur, 5, '    LE MOT CACHE;;;   ');
					break;
			case 6:	afficheMessage(toucheur, 0, 'SELON L\'OPTION f, DES');
					afficheMessage(toucheur, 1, ' LETTRES PEUVENT ETRE ');
					afficheMessage(toucheur, 2, '  DONNEES AU DEPART : ');
					afficheMessage(toucheur, 3, 'f=ALEATOIRE z=0 LETTRE');
					afficheMessage(toucheur, 4, 'x=2 LETTRES y=1 LETTRE');
					afficheMessage(toucheur, 5, 'DEUX NIVEAUX DE SUITE.');
					break;
			case 7:	afficheMessage(toucheur, 0, 'SELON LES OPTIONS n+t,');
					afficheMessage(toucheur, 1, 'LE TOUR DU JOUEUR PEUT');
					afficheMessage(toucheur, 2, 'VARIER A CHAQUE LIGNE ');
					afficheMessage(toucheur, 3, '  ET A CHAQUE NIVEAU. ');
					afficheMessage(toucheur, 4, '  LA FIN DE JEU VARIE ');
					afficheMessage(toucheur, 5, '  SELON L\'OPTION n;; ');
					break;
			case 8:	afficheMessage(toucheur, 0, ' LE NOMBRE DE LETTRES ');
					afficheMessage(toucheur, 1, 'DU MOT A TROUVER VARIE');
					afficheMessage(toucheur, 2, ' AVEC LE NIVEAU ET IL ');
					afficheMessage(toucheur, 3, 'AUGMENTE DE 1 TOUS LES');
					afficheMessage(toucheur, 4, '2 NIVEAUX.  UNE PARTIE');
					afficheMessage(toucheur, 5, ' A MAXIMUM 12 NIVEAUX.');
					break;
			case 9:	afficheMessage(toucheur, 0, 'LA DEFINITION DU MOT A'); // v1.2.1
					afficheMessage(toucheur, 1, 'TROUVER EST ACCESSIBLE'); // v1.2.1
					afficheMessage(toucheur, 2, 'EN LIGNE EN TOUCHANT 1'); // v1.2.1
					afficheMessage(toucheur, 3, 'DE SES LETTRES. IL Y A'); // v1.2.1 + v2.0
					afficheMessage(toucheur, 4, '1 SITE PAR LETTRE JUS-'); // v1.2.1
					afficheMessage(toucheur, 5, 'QU\'A 5 SITES AU CHOIX.');// v1.2.1
					break;
			case 10:afficheMessage(toucheur, 0, 'UNE AIDE COMPLETE EST');
					afficheMessage(toucheur, 1, 'DISPONIBLE EN LIGNE :');
					afficheMessage(toucheur, 2, espace);
					afficheMessage(toucheur, 3, 'PATQUOI.FR/');
					afficheMessage(toucheur, 4, 'mOuISSIlOdo.HTML');
					afficheMessage(toucheur, 5, espace);
					break;
			default:reafficheMessages(toucheur);
					pageInfo[toucheur]=-1;
					break;			
		}
		pageInfo[toucheur]++;
	}
}

function afficheInfo(toucheur, caractere)
{ 
	switch(pageInfo[toucheur]) {
		case 0:	// Menu infos
				pageInfo[toucheur]=1; // On change maintenant car ça empêche de sauvegarder les messages...
				afficheMessage(toucheur, 0, 'MENU iNFORMATIONS');
				afficheMessage(toucheur, 1, espace);
				afficheMessage(toucheur, 2, 'REGLE DU JEU;;;;R');
				afficheMessage(toucheur, 3, 'COMMANDES;;;;;;;C'); 
				afficheMessage(toucheur, 4, 'A PROPOS;;;;;;;;P');
				afficheMessage(toucheur, 5, 'RETOUR;;;;;;;;;;i');
				break;
		case 1:	// choix dans le menu infos...
				switch(caractere) {
					case 'C':	afficheMessage(toucheur, 0, 'INFORMATIONS;;;;;;;;;i');
								afficheMessage(toucheur, 1, 'CHANGE/VOIT OPTION;fnt');
								afficheMessage(toucheur, 2, 'EFFACE LA LETTRE;;;;;c');
								afficheMessage(toucheur, 3, 'EFFACE LA LIGNE;;;;;;k');
								afficheMessage(toucheur, 4, 'RECOMMENCE LA PARTIE;r');
								afficheMessage(toucheur, 5, '  TOUCHE UNE LETTRE.  ');
								pageInfo[toucheur]=99;
								break;
					case 'P':	afficheMessage(toucheur, 0, 'mOuISSIlOdo');
								afficheMessage(toucheur, 1, 'POUR TABLETTE '+stVersion); // v1.2
								afficheMessage(toucheur, 2, '2012, PATRICE FOUQUET');

								// Debut v2.1 : comptage des mots en temps réel
								var n=0;
								for(var i=0;i<dico.length; i++)
									n+=dico[i].length;
								afficheMessage(toucheur, 3, 'DICO ODS'+stVerDico+' '+n+' MOTS'); 
								// Fin v2.1 : comptage des mots en temps réel

								afficheMessage(toucheur, 4, espace);
								afficheMessage(toucheur, 5, 'TOUCHE UNE LETTRE;;');
								pageInfo[toucheur]=99;
								break;
					case 'R':	afficheMessage(toucheur, 0, 'REGLE DU JEU');
								afficheMessage(toucheur, 1, espace);
								afficheMessage(toucheur, 2, 'DANS CE QUI SUIT,');
								afficheMessage(toucheur, 3, 'TOUCHE UNE LETTRE POUR');
								afficheMessage(toucheur, 4, 'CONTINUER OU TOUCHE i');
								afficheMessage(toucheur, 5, 'POUR REVENIR AU JEU.');
								pageInfo[toucheur]=2;
								break;
					case 'i':	reafficheMessages(toucheur);
								pageInfo[toucheur]=0;
								break;
					default:	// Choix incorrect : on attend.
								break;
				}
				break;
		case 99:reafficheMessages(toucheur);
				pageInfo[toucheur]=0;
				break;
		default:testeSuiteInfo(toucheur, caractere);
				break;
	}
}

//-----------------------
// AFFICHAGES DE MESSAGES
//-----------------------

function afficheMessageConfirmationRAZ(joueur)
{
	// Le demandeur
	afficheMessage(joueur, 0, '   TU AS DEMANDE A   ', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(joueur, 1, 'RECOMMENCER LA PARTIE', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(joueur, 2, espace);
	afficheMessage(joueur, 3, ' L\'AUTRE JOUEUR DOIT ');
	afficheMessage(joueur, 4, 'CONFIRMER ET TOUCHER r');
	afficheMessage(joueur, 5, ' SINON, C\'EST ANNULE.');
	// L'autre joueur
	afficheMessage(3-joueur, 0, '   L\'AUTRE JOUEUR A   ', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(3-joueur, 1, 'DEMANDE A RECOMMENCER ', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(3-joueur, 2, '     LA PARTIE.       ', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(3-joueur, 3, espace);
	afficheMessage(3-joueur, 4, 'CONFIRME EN TOUCHANT r');
	afficheMessage(3-joueur, 5, ' SINON, C\'EST ANNULE.');
}

function afficheMessageOptionForce(joueur)
{
	if (!joueur) {
		afficheOption[1] = true;
		afficheOption[2] = true;
	}
	else
		afficheOption[joueur] = true;
	afficheMessage(joueur, 0, 'LA FORCE ACTUELLE EST');
	afficheMessage(joueur, 1, messageForce[force]);
	afficheMessage(joueur, 2, 'AVEC');
	afficheMessage(joueur, 3, messageForceInfos[force]);
	afficheMessage(joueur, 4, espace);
	if (!niveau)
		afficheMessage(joueur, 5, 'TOUCHE N POUR JOUER.');
	else
		afficheMessage(joueur, 5, espace);
}

function afficheMessageOptionModeTour(joueur)
{
	if (!joueur) {
		afficheOption[1] = true;
		afficheOption[2] = true;
	}
	else
		afficheOption[joueur] = true;
	afficheMessage(joueur, 0, 'LE MODE DE TOUR EST :');
	afficheMessage(joueur, 1, 'CHANGEMENT DE JOUEUR');
	afficheMessage(joueur, 2, messageModeTour[modeTour]);
	afficheMessage(joueur, 3, espace);
	afficheMessage(joueur, 4, espace);
	if (!niveau)
		afficheMessage(joueur, 5, 'TOUCHE N POUR JOUER.');
	else
		afficheMessage(joueur, 5, espace);
}

function afficheMessageOptionModeNiveau(joueur)
{
	if (!joueur) {
		afficheOption[1] = true;
		afficheOption[2] = true;
	}
	else
		afficheOption[joueur] = true;
	afficheMessage(joueur, 0, 'LE MODE NIVEAU EST :');
	afficheMessage(joueur, 1, 'CHANGEMENT DE JOUEUR');
	afficheMessage(joueur, 2, messageModeNiveau[modeNiveau]);
	afficheMessage(joueur, 3, 'FIN DE JEU SI');
	afficheMessage(joueur, 4, 'MOT NON TROUVE.');
	if (!niveau)
		afficheMessage(joueur, 5, 'TOUCHE N POUR JOUER.');
	else
		afficheMessage(joueur, 5, espace);
}

function afficheMessageTonTour(joueur)
{
	afficheMessage(joueur, 0, 'C\'EST A TOI DE JOUER.', suffixeMarque[typeMarque.mFondVert]);
	afficheMessage(joueur, 1, 'UTILISE LE CLAVIER.');
	afficheMessage(joueur, 2, '<c> EFFACE UNE LETTRE.');
	afficheMessage(joueur, 3, '<k> EFFACE LA LIGNE.');
	afficheMessage(joueur, 4, 'TU PEUX TOUCHER LES')
	afficheMessage(joueur, 5, 'OPTIONS POUR INFO.');
}
function afficheMessagePasTonTour(joueur)
{
	afficheMessage(joueur, 0, 'CE N\'EST PAS TON TOUR.', suffixeMarque[typeMarque.mFondRouge]);
	afficheMessage(joueur, 1, 'ATTENDS QUE j PASSE AU'); // v1.1 (au lieu de IL FAUT QUE T'ATTENDES)
	afficheMessage(joueur, 2, 'VERT AVANT DE JOUER.'); // v1.1
	afficheMessage(joueur, 3, 'TU PEUX TOUCHER LES') // v1.1
	afficheMessage(joueur, 4, 'OPTIONS fnt POUR'); // v1.1 
	afficheMessage(joueur, 5, 'PLUS D\'INFORMATIONS.'); // v1.1
}

function afficheMessageBienvenue()
{
	afficheMessage(0, 0, 'BIENVENUE A');
	afficheMessage(0, 1, 'mOuISSIlOdo');
	afficheMessage(0, 2, espace);
	afficheMessage(0, 3, 'CHOISIS TON COTE PUIS');
	afficheMessage(0, 4, 'LES OPTIONS AVEC fnt.');
	afficheMessage(0, 5, 'N POUR JOUER. AIDE=i.');
}

//--------
// CLAVIER
//--------

function touche(index)
{
	var caractere = clavier[index];

// index :
//   0-32 	= clavier joueur gauche
//  (50-82)	= clavier joueur droite

//	30/0-9 (50-59)	31/10-19 (81/60-69)	32/20-29 (82/70-79)
//	nAZERTYUIOP		fQSDFGHJKLM			tiWXCVBNckr

	if (demandeRAZ && (caractere != toucheRAZ)) {
		demandeRAZ = 0;
		reafficheMessages(1);
		reafficheMessages(2);
	}
		
	if ((!joueur)||typeFin||((index>=indexMinJoueur[joueur])&&(index<=indexMaxJoueur[joueur]))) {
		if (joueur&&niveau) { // Joueur courant
			if (typeFin) {
				if (typeFin==1) { // fin de niveau
					typeFin=0;
 					niveau++;
					initialiseNiveau(); 
					return;
				}
				else { // fin de partie... Nouvelle partie !
					typeFin=0;
					initialisePartie();
					return;
				}
			}
			if ((caractere >= 'A') && (caractere <= 'Z')) { // Une lettre
				if (afficheOption[joueur]) {
					afficheOption[joueur] = false;
					reafficheMessages(joueur);
				}
				if (pageInfo[joueur])
					afficheInfo(joueur, caractere);
				else {
					grille[colonne][ligne].lettre = caractere;
					grille[colonne][ligne].ecrit();
					grille[colonne][ligne].affiche();
					colonne++;
					localStorage.colonne = colonne;
					if (colonne == tailleMot) 
						marqueProposition();
				}
			}
			else {
				if (afficheOption[joueur]) {
					afficheOption[joueur] = false;
					reafficheMessages(joueur);
				}
				if (pageInfo[joueur])
					afficheInfo(joueur, caractere);
				else
					switch(caractere) {
						case toucheRAZ:			if (demandeRAZ == 3-joueur) { // L'autre a confirmé
													demandeRAZ = 0;
													initialisePartie();
													niveau = 0; localStorage.niveau = 0; // v1.2.2 
													joueur = 0; localStorage.joueur = 0; // v1.2.3 
													afficheMoiToi(); // v1.2.3
													afficheMessageBienvenue(); // v1.2.2
												}
												else {
													demandeRAZ = joueur;
													afficheMessageConfirmationRAZ(joueur);
												}
												break;
						case toucheEffaceLtr:	if (colonne) {
													colonne--;
													localStorage.colonne = colonne;

													grille[colonne][ligne].lettre = espace;
													grille[colonne][ligne].ecrit();
													grille[colonne][ligne].affiche();
												}
												break;
						case toucheEffaceLgn:	if (colonne) {
												for(var x=0; x<=colonne; x++) {
													grille[x][ligne].lettre = espace;
													grille[x][ligne].ecrit();
													grille[x][ligne].affiche();
												}
												colonne = 0;
												localStorage.colonne = colonne;
											}
												break;
						case toucheOptionForce:	afficheMessageOptionForce(joueur);
												break;
						case toucheOptionTour:	afficheMessageOptionModeTour(joueur);
												break;
						case toucheOptionNiveau:afficheMessageOptionModeNiveau(joueur);
												break;
						case toucheInfo:		afficheInfo(joueur, caractere);
												break;
					}
			}
		}
		else { // joueur attendant son tour : accès restreint (infos et options en lecture seule)
			var toucheur = 1 + Math.floor(index / indexMinJoueur[2]);
			if (afficheOption[toucheur]) {
					afficheOption[toucheur] = false;
					reafficheMessages(toucheur);
				}
			if (pageInfo[toucheur])
				afficheInfo(toucheur, caractere);
			else
				switch(caractere) {
				case toucheRAZ:			if (demandeRAZ == 3 - toucheur) { // L'autre a confirmé
											demandeRAZ = 0;
											initialisePartie();
											niveau = 0; localStorage.niveau = 0; // v1.2.2 
											joueur = 0; localStorage.joueur = 0; // v1.2.3 
											afficheMoiToi(); // v1.2.3
											afficheMessageBienvenue(); // v1.2.2
										}
										else {
											demandeRAZ = toucheur;
											afficheMessageConfirmationRAZ(toucheur);
										}
										break;
				case toucheNvPartie:	initialisePartie();
										break;
				case toucheOptionForce:	force = (force + 1) % (forceMax + 1);
										afficheOptions();
										afficheMessageOptionForce(0);
										break;
				case toucheOptionTour:	modeTour = (modeTour + 1) % (modeTourMax + 1);
										afficheOptions();
										afficheMessageOptionModeTour(0);
										break;
				case toucheOptionNiveau:modeNiveau = (modeNiveau + 1) % (modeNiveauMax + 1);
										afficheOptions();
										afficheMessageOptionModeNiveau(0);
										break;
				case toucheInfo:		afficheInfo(toucheur, caractere);
										break;
				default: break;
			}			
		}		
	}
	else {
		if (typeFin) {
			if (typeFin==1) { // fin de niveau... Niveau suivant !
				typeFin=0;
				niveau++;
				initialiseNiveau(); 
				return;
			}
			else { // fin de partie... Nouvelle partie !
				typeFin=0;
				initialisePartie();
				return;
			}
		}
		if (afficheOption[3-joueur]) {
			afficheOption[3-joueur] = false;
			reafficheMessages(3-joueur);
		}
		if (pageInfo[3-joueur])
			afficheInfo(3-joueur, caractere);
		else
			switch(caractere) {
			case toucheRAZ:			if (demandeRAZ == joueur) { // L'autre a confirmé
										demandeRAZ = 0;
										initialisePartie();
										niveau = 0; localStorage.niveau = 0; // v1.2.2 
										joueur = 0; localStorage.joueur = 0; // v1.2.3 
										afficheMoiToi(); // v1.2.3
										afficheMessageBienvenue(); // v1.2.2

									}
									else {
										demandeRAZ = 3 - joueur;
										afficheMessageConfirmationRAZ(3 - joueur);
									}
									break;
			case toucheOptionForce:	afficheMessageOptionForce(3-joueur);
									messageIntouchable = false;
									break;
			case toucheOptionTour:	afficheMessageOptionModeTour(3-joueur);
									messageIntouchable = false;
									break;
			case toucheOptionNiveau:afficheMessageOptionModeNiveau(3-joueur);
									break;
			case toucheInfo:		afficheInfo(3-joueur, caractere);
									break;
			default:				if (!messageIntouchable) {
										afficheMessagePasTonTour(3-joueur);
										messageIntouchable = true;
									}
									break;
		}
	}
}

//----------
// DEMARRAGE
//----------

function lit()
{
	
	if (!parseInt(localStorage.niveau, 10)) { // v1.2.2
		afficheMessageBienvenue(); // v1.2.2
		return; // v1.2.2
	}
	// Options (indépendant du jeu)
	if (!localStorage.getItem(lsForce))
		definitOptionsParDefaut();
	else {
		litOptions();
		afficheOptions();
	}

	// Sauvegarde de l'état du jeu
	if (!localStorage.getItem(lsJoueur)) {
		afficheMessageBienvenue();
		return;
	}

	// Drapeaux Fin de Niveau/Partie
	var succes = false; // variable non globale mais sauvegardée dépendant de typeFin pour affichage selon succès niveau/Partie
	if (!localStorage.getItem(lsTypeFin))
		typeFin = 0;
	else
		typeFin = parseInt(localStorage.typeFin, 10);
	
	if (localStorage.getItem(lsSucces))
		succes = (localStorage.succes.toString() == 'true');
	
	// Variables de partie
	joueur = parseInt(localStorage.joueur, 10);
	niveau = parseInt(localStorage.niveau, 10);

	// Mot à trouver
	tailleMot = parseInt(localStorage.tailleMot, 10);
	stReponse = localStorage.stReponse;

	// Lettres données
	litLettresDonnees();
	
	// coordonnées courantes
	litCoordonnees();

	// Elements de jeux en tableaux 
	litGrille();
	litPropositions();
	score[0] = parseInt(localStorage.score0, 10);
	score[1] = parseInt(localStorage.score1, 10);
	score[2] = parseInt(localStorage.score2, 10);
	alphabet.lit();
	
	afficheGrille();
	afficheScore();
	for(var i=0; i<(typeFin?hauteurGrille:ligne); i++)
		for(var j=1; j<=joueurs; j++)
			afficheScore(j, i);	
			
	afficheMoiToi();
	switch(typeFin) {
		case 1: afficheFinNiveau(succes);
				break;
		case 2: afficheFinPartie(succes);
				break;
		default:break;
	}
}

function bienvenue()
{
	// Une seule fois pour toute
	creeGrille(); 
	creePropositions(); 
	lit();
}
