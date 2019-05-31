/*
+----------+
| Aspic.js |
+----------+
*/

const stVersion		= '1.2';

// Version 1.1
//  - ajout du test de tir
//  - ajout paramètre temps/tour/joueur 
//  - temps écoulé devient temps restant
//  - ajout caractère 'seconde' ($) : Par exemple afficheMessage('18$') affiche 18"  
//  - la pose des joueurs est à présent intégrée dans le temps écoulé
//  /!\ index.html modifié
//  /!\ 9 nouvelles png te?.png
//  /!\ 3 nouvelles png bln??.png
//  /!\ 6 nouvelles png seconde??.png

// Version 1.2
//  - On initialise xDepl/yDepl pour une pose de joueurs

/*********************/
/* constantes de jeu */
/*********************/

const clcBlanc		= 0;
const clcBleu		= 1;
const clcPourpre	= 2;
const clcMauve		= 3;
const clcRouge		= 4;
const clcOrange		= 5;
const clcJaune		= 6;
const clcVert		= 7;
const clcCiel		= 8;
					// Neutre
const stCouleurCamp	= ['',		'BLEU', 	'POURPRE',  'MAUVE', 	'ROUGE', 	'ORANGE',	'JAUNE',	'VERT',		'CIEL'];
const stClCamp		= ['a',		'b',		'p',		'm',		'r',		'o',		'j',		'v',		'c'];		
const stClTerrain   = ['',		'b',		'b',		'b',		'r',		'r',		'v',		'v',		'b'];

const ctcIndefini	= 0;
const ctcGauche		= 1;
const ctcDroite		= 2;
const stCoteCamp	= ['',			'GAUCHE', 	'DROITE'];
const stCtCamp		= ['',			'g', 		'd'];

const ctjIndefini	= 0;
const ctjHaut		= 1;
const ctjBas		= 2;
const stCoteJeu		= ['',	'HAUT', 'BAS'];
const stCtJeu		= ['',	'h', 'b'];

const clmNoir		= 0;
const clmBlanc		= 1;
const clCouleurMsg  = ['NOIR', 'BLANC']; // Inversé pour suggérer le fond correspondant
const stClMsg		= ['b', 	'n'];

// Phases
const phAttente			= 0;
const phPoseJoueurs 	= 1;
const phDeplacement1 	= 2;
const phDeplacement2 	= 3;
const phTir				= 4;
const phTestTir			= 5; // v1.1 : Fause phase, c'est pour le choix des actions dans les boutons (passePhase, annulePhase).

// déplacements possibles
const dpPossible		= 0;
const dpDirIncorrecte	= 1;
const dpHorsPortee		= 2;
const dpTrajetOccupe	= 3;
const dpZoneInterdite	= 4;

// Tirs possibles
const tpPossible		= 0;
const tpTrajetTBOccupe	= 1;
const tpTrajetBNOccupe	= 2;
const tpCaseOccupee		= 3;
const tpMemeCaseTB		= 4;

// v1.1 : enuméré pour resultatTestTir
const rttIndefini		= -1;
const rttOK				= 0;
const rttKO				= 1;
const rttBut			= 2;

// directions
const dIndefinie		= 0;
const dNord				= 1;
const dNordEst			= 2;
const dEst				= 3;
const dSudEst			= 4;
const dSud				= 5;
const dSudOuest			= 6;
const dOuest			= 7;
const dNordOuest		= 8; 
const dx				= [0, 0, 1, 1, 1, 0, -1, -1, -1];
const dy				= [0, -1, -1, 0, 1, 1, 1, 0, -1];

// Pions 
const pnCaseVide		= 0;
const pnBallon			= 1;
const pnJrGauche		= 2;
const pnJrDroite		= 3;

// constantes de définition de jeu
const hauteurPlateau	= 9;

/* coordonnées */

const xyIndefini		= -1;
const xCentre			= 5;
const yCentre			= 4;
const xMin				= 0;
const xMax				= 10;
const yMin				= 0;
const yMax				= 8;
// limites Tireur+Ballon pour les rebonds
const xTBMin			= 1;
const xTBMax			= 9;
const yTBMin			= 0;
const yTBMax			= 8;
// coordonnées des poteaux de but
const xBut				= [0.0, 9.5, 0.5];
const yButMin			= 2.5;
const yButMax			= 5.5;
const yFiletMin			= 3;
const yFiletMax			= 5;
 
/* constantes Id HTML */
const idPlateau = 'plateau' // objet Table

/* Dimensions du plateau de référence en zoom x1 */
const largeurHTML 		= 1290;
const hauteurHTML		= 858;

/* Constantes pour les messages */
const tailleMsg			= 25;
const lignesMsg			= 5;
const stVide			= '';
const stPrfxMsg			= 'm';
const stMsgEspace		= 'espacegd';
const dureeMsgErr		= 2000;
const dureeMsgButMiTps	= 5000;
const stOnClick			= 'onClick';
const stToucheCouleur	= 'toucheCouleur(';

/* ID scores, temps écoulé, phases */
const stPrfxTemps		= 'tr'; // v1.1 : au lieu de 'te' (temps écoulé)
const stPrfxHeures		= 'th';		
const stPrfxMinutes		= 'tm';
const stPrfxSecondes	= 'ts';
const stPrfxScore		= 'sc';
const stPrfxPhase		= 'ph';
const stPrfxDistance	= 'dp';
const stPrfxOccupation	= 'oc';
const stPrfxTour		= 'tj'; // v1.1 : au lieu de 'tr' pris par le temps restant ci-dessus
const stPrfxUnites		= 'u';
const stPrfxDizaines	= 'd';
const stPrfxCentaines	= 'c';
const stPrfxMilliers	= 'm';
const stPrfxSeparateur	= 's';
const stPrfxDeuxPoints	= 'd';
const stPrfxVirgule		= 'v';
const stPrfxPourcents	= 'p';
const stPrfxJoueur		= 'j';
const stPrfxJrDeplace	= 'd';
const stPrfxBallon		= 'b';
const stPrfxChiffre		= 's';

/* ID terrain */
const stPrfxButs		= 'b';
const stPrfxFond		= 'f';
const stPrfxTerrain		= 't';

/* constantes de chemin des ressources */
const stChmPng 	= 'png/';
const stChmMsg 	= 'png/msg/';
const stExtPng 	= '.png';

// Ressources PNG */
const stPngVide		= 'vide';
const stPngBallon	= 'bln';

// v1.1 : Suffixes pour stPngBallon (phase de test de tir et résultat : tir impossible et but) 
const stSfxTestTir  = ['', 't']; 
const stSfxBlnTest  = ['', 'ti', 'b']; 

/*********************/
/* paramètres de jeu */
/*********************/

var prmJoueursMax	= 6;
var prmTourMiTemps	= 50;
var prmTourFinPartie= 100;
var prmTpsParTour	= 36; // v1.1

/********************/
/* variables de jeu */
/********************/

// Paramètres de la partie en cours
var joueursMax		= 6;
var tourMiTemps		= 50;
var tourFinPartie	= 100;
var tpsParTour		= 36; // v1.1

var couleurCamp = [clcBlanc, undefined, undefined]; // gauche=1, droite=2

var campCrt		= ctcIndefini;
var tourCrt		= 0;
var score		= [0, 0, 0];
var joueurs		= [0, 0, 0];
var phase		= [phAttente, phAttente, phAttente];

var c			= [[pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide],
				   [pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide, pnCaseVide]];
	
var xDepl		= xyIndefini;
var yDepl		= xyIndefini;
var xBallon		= xyIndefini;
var yBallon		= xyIndefini;
var but			= false;
var phasePassee	= false;  

var occupation	= 0;
var drnTop		= 0; // Permet la reprise d'une partie en décalant les temps à la reprise
var temps		= [0, 0, 0]; // now()-temps[campCrt] donne le temps qui est en train de s'écouler
var topChrono	= [0, 0, 0]; // topChrono[3-campCrt]-temps[3-campCrt] donne le temps écoulé
var distPjr		= [0.0, 0.0, 0.0]; // distance parcourue par les joueurs (déplacement+tir)
var distBln		= [0.0, 0.0, 0.0]; // distance parcourue par le ballon (tirs)

var	tempsSuspendu 	= true; 

// v1.1 : ajout d'un mode test de tir. Ne pas sauvegarder dans localstorage
var modeTestTir		=          0; 
var resultatTestTir	= rttIndefini;
var xTestTireur		= xyIndefini; 
var yTestTireur		= xyIndefini; 
var xTestBallon		= xyIndefini; 
var yTestBallon		= xyIndefini; 

/********************/
/* fonctions de jeu */
/********************/

function videMessage(camp)
{
	if (camp == undefined) {
		videMessage(ctcGauche);
		videMessage(ctcDroite);
	} else { // On force à vider les événements onClick
		afficheMessage(1, ' ', camp);
		afficheMessage(2, ' ', camp);
		afficheMessage(3, ' ', camp);
		afficheMessage(4, ' ', camp);
		afficheMessage(5, ' ', camp);
	}
}

function afficheMsgCaractere(camp, X, Y, caractere, stFond, onClick) // stFond et onClick facultatifs
{
	// 1. Définition de l'image;
	var src = stVide;
	switch(caractere) {
		case '*':
		case ' ':	src = 'espace'; break;
		case '°':	src = 'numero'; break;
		case '.':	src = 'point'; break;
		case ',':	src = 'virgule'; break;
		case '!':	src = 'exclamation'; break;
		case '?':	src = 'interrogation'; break;
		case ':':	src = 'deuxpoints'; break;
		case '"':	src = 'apostrophe'; break;
		case '-':	src = 'moins'; break;
		case '+':	src = 'plus'; break;
		case '/':	src = 'slash'; break;
		case '(':	src = 'parentheseg'; break;
		case ')':	src = 'parenthesed'; break;
		case '%':	src = 'pourcents'; break;
		case '@':	src = 'bln'; break;
		case '$':	src = 'seconde'; break; // v1.1
		default:	src = caractere; break;
	}	

	// 2. Fond
	var clMsg=clmBlanc; // Couleur du caractère par défaut
	var bgColor = 'transparent'; // Par défaut
	switch(stFond) {
		case 'a':	bgColor = '#ffffff'; clMsg = clmNoir; break;
		case 'b':	bgColor = '#0701ff'; break;
		case 'c':	bgColor = '#01fcff'; clMsg = clmNoir; break;
		case 'j':	bgColor = '#ffff00'; clMsg = clmNoir; break;
		case 'm':	bgColor = '#ff01fc'; break;	
		case 'o':	bgColor = '#ff8401'; clMsg = clmNoir; break;
		case 'p':	bgColor = '#8401ff'; break;
		case 'r':	bgColor = '#ff0701'; break;
		case 'v':	bgColor = '#01ff01'; clMsg = clmNoir; break;
	}	
	if (caractere=='@')
		src = stChmMsg + src + stCtCamp[camp] + stExtPng;
	else
		src = stChmMsg + src + stClMsg[clMsg] + stCtCamp[camp] + stExtPng;
	var ligne = (camp==ctcGauche)?(2+X):(26-X);
	var colonne = (camp==ctcGauche)?(5-Y):((((X-1)%3==0)?17:4)+Y);
	
	// 1. Fond
	document.getElementById(idPlateau).rows[ligne].cells[colonne].style.backgroundColor=bgColor;
	// 2. Image
	var idImg = stPrfxMsg+stCtCamp[camp]+Y+String.fromCharCode(65+X);
	
	document.images[idImg].src=src;
	if (onClick==undefined)
		document.images[idImg].removeAttribute(stOnClick);
	else
		document.images[idImg].setAttribute(stOnClick, onClick);		
}

function afficheMessage(ligne, stMsg, camp, stPrfxOnClick)
{
	if (camp == undefined) {
		afficheMessage(ligne, stMsg, ctcGauche);
		afficheMessage(ligne, stMsg, ctcDroite);
	}
	else {
		const stEspace=' ';
		var stFond = undefined;
		var onClick = undefined;
		var numClick = 0;
		var l=0; // Vraie largeur en écartant les indicateurs de couleur
		stMsg = stMsg.substring(0, tailleMsg+(stMsg.length-l));
		for(var i=0; i<stMsg.length; i++)
			if ((stMsg[i]<'a')||(stMsg[i]>'z'))
				l++;
		stMsg=stEspace.repeat(Math.floor((tailleMsg-l)/2))+stMsg+stEspace.repeat(tailleMsg-l-Math.floor((tailleMsg-l)/2));
		var d=0; // delta en tenant compte des indicateur de couleur
		for(var i=0; i<stMsg.length; i++)
			switch(stMsg[i]) {
				case 'a':	
				case 'b':
				case 'c':
				case 'j':
				case 'm':
				case 'o':
				case 'p':
				case 'r':
				case 'v':	if (stFond==undefined)
								stFond=stMsg[i]; 
							else
								stFond=undefined;
							d++;
							break;
				default:	if (stMsg[i] == '*') {
								if (onClick == undefined) { // début bouton
									onClick=stPrfxOnClick+numClick+')';
									numClick++;
									afficheMsgCaractere(camp, i-d, ligne, stMsg[i], stFond, onClick);
								} else { // fin bouton
									afficheMsgCaractere(camp, i-d, ligne, stMsg[i], stFond, onClick);
									onClick=undefined;
								}
							} else 
								afficheMsgCaractere(camp, i-d, ligne, stMsg[i], stFond, onClick);
							break;
			}
	}	
}

function afficheCase(x, y)
{
	// v1.1 : Précondition
	if ((x<xMin)||(x>xMax)||(y<yMin)||(y>yMax)) return;
	
	var colonne = String.fromCharCode(65+x);
	var ligne =	1+y;
	// v1.1 : mode test tir
	if (modeTestTir == 1) {
		if ((x==xTestTireur)&&(y==yTestTireur)) {
			document.images[colonne+ligne].src = stChmPng + stPrfxJrDeplace + stClCamp[couleurCamp[campCrt]] + stCtCamp[campCrt] + stCtJeu[((y<5)?ctjHaut:ctjBas)] + stExtPng;
			return;
		}
		if ((c[x][y]==pnBallon)&&(resultatTestTir>rttOK)) { // On teste avant dans le cas d'un but on a c[xTestBallon][yTestBallon]==pnBallon !
			document.images[colonne+ligne].src = stChmPng + stPngBallon + stSfxBlnTest[resultatTestTir] + stExtPng;
			return;
		}
		if ((x==xTestBallon)&&(y==yTestBallon)) {
			document.images[colonne+ligne].src = stChmPng + stPngBallon + stSfxTestTir[modeTestTir] + stExtPng;
			return;
		}
	}
	switch(c[x][y]) {
		case pnCaseVide:	document.images[colonne+ligne].src = stChmPng + stPngVide + stExtPng; break;
		case pnBallon:		document.images[colonne+ligne].src = stChmPng + stPngBallon + stExtPng; break;
		case pnJrGauche:
		case pnJrDroite:	document.images[colonne+ligne].src = stChmPng + ((x==xDepl)&&(y==yDepl)?stPrfxJrDeplace:stPrfxJoueur) + stClCamp[couleurCamp[c[x][y]-1]] + stCtCamp[c[x][y]-1] + stCtJeu[((y<5)?ctjHaut:ctjBas)] + stExtPng; break;
	}
}

function affichePlateau()
{
	for(var x=xMin; x<=xMax; x++)
		for(var y=yMin; y<=yMax; y++)
			afficheCase(x, y);
}

function initialisePlateau()
{
	for(var i=xMin; i<=xMax; i++)
		for(var j=xMin; j<=yMax; j++) {
			c[i][j]=pnCaseVide; localStorage.setItem('c'+i+j, pnCaseVide);
			afficheCase(i, j);
	}
	for(var i=0; i<=2; i++) {
		joueurs[i]=0; localStorage.setItem('joueurs'+i, 0);
	}
}
							
function changePhase(nvPhase)
{
	phase[campCrt]=nvPhase; localStorage.setItem('phase'+campCrt, nvPhase);
	affichePhase();
	switch(phase[campCrt]) {
		case phPoseJoueurs:	if (tempsSuspendu) // v1.1 : la pose des joueurs est maintenant intégrée au temps écoulé.
								reprendChrono(new Date().getTime());
							// deb v1.2 : on initialise xDepl/yDepl pour une pose de joueurs
							xDepl=xyIndefini; localStorage.xDepl = xyIndefini; 
							yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
							// fin v1.2 : on initialise xDepl/yDepl pour une pose de joueurs
							videMessage();
							afficheMessage(1, 'VOUS DEVEZ POSITIONNER');
							afficheMessage(2, 'VOS PIONS SUR LE TERRAIN');
							afficheMessage(4, 'C"EST A VOUS !', campCrt);
							afficheMessage(4, 'ATTENDEZ SVP !', 3-campCrt);
							phasePassee=false; localStorage.phasePassee = false;
							break;
		case phDeplacement1:/*if (tempsSuspendu) // v1.1 : la pose des joueurs est maintenant intégrée au temps écoulé.  
								reprendChrono(new Date().getTime());*/
							videMessage();
							afficheMessage(1, 'C"EST A VOUS DE JOUER !', campCrt);
							afficheMessage(3, 'CHOISISSEZ UN PION', campCrt);
							// deb v1.1 : action du bouton à l'infinitif
							afficheMessage(4, 'A DEPLACER...', campCrt); 
							if (peutTirer())
								afficheMessage(5, 'a*PASSER*a', campCrt, 'passePhase(phDeplacement1+');
							// fin v1.1 : action du bouton à l'infinitif
							afficheMessage(2, 'CE N"EST PAS VOTRE TOUR', 3-campCrt);
							afficheMessage(4, 'MERCI DE PATIENTER...', 3-campCrt);
							phasePassee=false; localStorage.phasePassee = false;
							break;
		case phDeplacement2:videMessage();
							afficheMessage(1, 'C"EST A VOUS DE JOUER !', campCrt);
							afficheMessage(3, 'CHOISISSEZ LA CASE CIBLE', campCrt);
							afficheMessage(4, 'a*ANNULER*a', campCrt, 'passePhase(phDeplacement2+'); // v1.1 : action du bouton à l'infinitif
							afficheMessage(2, 'CE N"EST PAS VOTRE TOUR', 3-campCrt);
							afficheMessage(4, 'MERCI DE PATIENTER...', 3-campCrt);
							phasePassee=false; localStorage.phasePassee = false;
							break;
		case phTir:			videMessage();
							if (peutTirer()) {
								afficheMessage(1, 'C"EST A VOUS DE JOUER !', campCrt);
								afficheMessage(3, 'CHOISISSEZ LE PION-TIREUR', campCrt);
								if (phasePassee) {
									afficheMessage(4, 'a*ANNULER*a a*TESTER*a', campCrt, 'annulePhase(phTir+'); // Si tir obligatoire, on peut annuler l'action de passer le déplacement. v1.1 : ajout Test + actions à l'infinitif
								} else
									afficheMessage(4, 'a*PASSER*a a*TESTER*a', campCrt, 'passePhase(phTir+'); // Sinon on peut passer le tir... v1.1 : ajout Test + actions à l'infinitif
							} else {
								passePhase(phTir);
								phasePassee=false; localStorage.phasePassee = false;
							}
							afficheMessage(2, 'CE N"EST PAS VOTRE TOUR', 3-campCrt);
							afficheMessage(4, 'MERCI DE PATIENTER...', 3-campCrt);
							break;
	}
}

/*******************************/
/* v1.1 : phase de test de tir */
/*******************************/

function termineTestTir(zero) // v1.1 : termine le mode test.
{
	modeTestTir = 0;
	changePhase(phTir); // On remet le message de phase de tir
}

function prepareTestTir() // v1.1 : active et affiche le mode test
{
	modeTestTir = 1;
	afficheMessage(4,'a*ANNULER*a LE MODE TEST', campCrt, 'termineTestTir(0+');
	affichePhase(); 
}

function defaitTestTir() // v1.1 : retirer le tireur et le ballon déplacés d'un test de tir.
{
	var x=xTestTireur;
	var y=yTestTireur;
	xTestTireur=xyIndefini;
	yTestTireur=xyIndefini;
	afficheCase(x, y);
	x=xTestBallon;
	y=yTestBallon;
	xTestBallon=xyIndefini;
	yTestBallon=xyIndefini;
	afficheCase(x, y);
	resultatTestTir=rttIndefini;
	afficheCase(xBallon, yBallon); // Dans le cas où le tir n'est pas possible, on affichait un ballon barré.
}

function annulePhase(phase)
{
	switch(phase) {
		case phTir:		phasePassee=false; localStorage.phasePassee = false;
						xDepl=xyIndefini; localStorage.xDepl = xyIndefini;
						yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
						changePhase(phDeplacement1);
						break;
		case phTestTir: prepareTestTir(); // v1.1 : ajout test de tir		
						break;	
		default:		break;
	}
}

function passePhase(phase)
{
	if (phase!=phTestTir) { // v1.1 : la phase de test n'est pas un passage d'action mais se trouve dans la même situation que l'action de paser le tir (comme pour annuler le tir)
		phasePassee=true; localStorage.phasePassee = true;
	}
	switch(phase) {
		case phDeplacement1:	xDepl=xyIndefini; localStorage.xDepl = xyIndefini;
								yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
								changePhase(phTir);
								break;
		case phDeplacement2:	var x=xDepl; 
								var y=yDepl;
								xDepl=xyIndefini; localStorage.xDepl = xyIndefini;
								yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
								afficheCase(x, y);
								changePhase(phDeplacement1);
								break;
		case phTir:				occupation+=xBallon; localStorage.occupation=occupation;
								afficheOccupation();
								changeCamp(phDeplacement1);
								break;
		case phTestTir: 		prepareTestTir(); // v1.1 : ajout test de tir		
								break;
		default:				break;
	}
}

// v1.1 : fin phase de test de tir

function changeChrono(topNow)
{
	if (temps[campCrt]>0) {
		topChrono[campCrt]=topNow; localStorage.setItem('topChrono'+campCrt, topNow);
	}
	if (topChrono[3-campCrt]>0) {
		temps[3-campCrt]+=(topNow-topChrono[3-campCrt]); localStorage.setItem('temps'+(3-campCrt), temps[3-campCrt]);
		topChrono[3-campCrt]=0; localStorage.setItem('topChrono'+(3-campCrt), 0);
	}
}

function suspendChrono(topNow)
{
	tempsSuspendu=true; localStorage.tempsSuspendu = true;
	if (temps[campCrt]>0) {
		topChrono[campCrt]=topNow; localStorage.setItem('topChrono'+campCrt, topNow);
	}
}

function reprendChrono(topNow)
{
	if (topChrono[campCrt]>0) {
		temps[campCrt]+=(topNow-topChrono[campCrt]); localStorage.setItem('temps'+campCrt, temps[campCrt]);
		topChrono[campCrt]=0; localStorage.setItem('topChrono'+campCrt, 0);
	}
	tempsSuspendu=false; localStorage.tempsSuspendu = false;
	defileChrono();
}

function defileChrono()
{
	if (!tempsSuspendu) {
		afficheTemps(campCrt);
		setTimeout( function() {
						defileChrono();
					}, 250);
	}
}

function finPartie(stMessage, camp) // v1.1
{
	var stMsgDef = 'FIN DE PARTIE !'
	if (!tempsSuspendu) suspendChrono(new Date().getTime());
	localStorage.removeItem('partieEnCours'); // Indique qu'il n'y a plus de partie sauvegardée.
	if (stMessage==undefined)
		stMessage=stMsgDef;
	if (camp==undefined)
		afficheMessage(1, stMessage);
	else {
		afficheMessage(1, stMessage, camp);
		afficheMessage(1, stMsgDef, 3-camp);
	}
	for(var c=ctcGauche; c<=ctcDroite; c++) {
		afficheMessage(2, ' ', c);
		afficheMessage(3, 'a*NOUVELLE PARTIE*a', c, 'choixMenu('+c+', 1+');
		afficheMessage(4, ' ', c);
		afficheMessage(5, 'a*PARAMETRES DE JEU*a', c, 'choixMenu('+c+', 2+');
	}
}

function changeCamp(nvPhase, nvCamp)
{
	if ((nvPhase == phDeplacement1)&&
	    (((tourCrt+1 == tourMiTemps) && (campCrt == ctcDroite))||   // MI-TEMPS ou 
	     (tourCrt+1 == tourFinPartie) && (campCrt == ctcGauche))) { // FIN DE PARTIE
		if (!tempsSuspendu) suspendChrono(new Date().getTime());
		if (tourCrt+1 == tourMiTemps) {
			tourCrt++; localStorage.tourCrt = tourCrt;
			videMessage();
			afficheMessage(2, 'C"EST LA MI-TEMPS !');
			afficheMessage(4, stClCamp[couleurCamp[ctcDroite]]+' '+stCouleurCamp[couleurCamp[ctcDroite]]+' '+stClCamp[couleurCamp[ctcDroite]]+' ENGAGE.');
			setTimeout( function() {
							initialisePlateau();
							changeCamp(phPoseJoueurs); // L'adversaire de celui qui engage pose le premier pour que celui qui engage pose en dernier
						}, dureeMsgButMiTps);		
			 return;
			}
		if (tourCrt+1 == tourFinPartie) {
			tourCrt++; localStorage.tourCrt = tourCrt;
			campCrt=ctcIndefini; localStorage.campCrt = campCrt; 
			afficheTour();
			finPartie(); // v1.1 : mise en fonction de la fin de partie
			return;
		}							
	}  
	if (nvCamp == undefined)
		nvCamp = 3-campCrt
	if (nvPhase==phDeplacement1) { // Avant changement de joueur...
		// 1. On efface le dernier pion déplacé 
		var x=xDepl;
		var y=yDepl;
		xDepl=xyIndefini; localStorage.xDepl = xyIndefini;
		yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
		if ((x!=xyIndefini)&&(x!=xyIndefini))
			afficheCase(x, y);
		// 2. On incrémente le tour le cas échéant
		if (tourCrt<tourMiTemps) {
			if ((nvCamp==ctcGauche)&&(phase[campCrt]!=phPoseJoueurs)) {
					tourCrt++; localStorage.tourCrt = tourCrt;
			}
		} else {
			if ((nvCamp==ctcDroite)&&(phase[campCrt]!=phPoseJoueurs)) {
					tourCrt++; localStorage.tourCrt = tourCrt;
			}
		}
		// 3. On change le chrono
		changeChrono(new Date().getTime());
	}
	if (nvPhase == undefined) { // Cas de la pose de joueurs, on reprend la phase
		nvPhase=phase[3-nvCamp];
	}
	// deb v1.2 : on initialise xDepl/yDepl pour une pose de joueurs
	if (nvPhase == phPoseJoueurs) { // v1.1 : le temps depose est pris en compte dans le temps écoulé
		changeChrono(new Date().getTime());
		xDepl=xyIndefini; localStorage.xDepl = xyIndefini; 
		yDepl=xyIndefini; localStorage.yDepl = xyIndefini;
	}
	// fin v1.2 : on initialise xDepl/yDepl
	campCrt = nvCamp; localStorage.campCrt = campCrt;
	phase[3-nvCamp]=phAttente; localStorage.setItem('phase'+(3-nvCamp), phAttente);
	if (tempsSuspendu /* &&(nvPhase!=phPoseJoueurs)*/) // v1.1 : il n'y a plus de temps mort comme lors de la pose des joueurs 
		reprendChrono(new Date().getTime());
	afficheTour();
	changePhase(nvPhase);
}

function signe(dxy)
{
	if (dxy)
		return dxy/Math.abs(dxy);
	else 
		return 0;
}

function afficheBut()
{
	var c=stClCamp[couleurCamp[campCrt]];
	afficheMessage(1, c+'    '+c+'  '+c+' '+c+'   '+c+' '+c+' '+c+'     '+c+'   '+c+' '+c+' '+c+' '+c+' '+c+' '+c, campCrt);
	afficheMessage(2, c+' '+c+'   '+c+' '+c+' '+c+' '+c+'   '+c+' '+c+'   '+c+' '+c+'     '+c+' '+c+' '+c+' '+c+' '+c+' '+c, campCrt);
	afficheMessage(3, c+'    '+c+'  '+c+' '+c+'   '+c+' '+c+'   '+c+' '+c+'     '+c+' '+c+' '+c+' '+c+' '+c+' '+c, campCrt);
	afficheMessage(4, c+' '+c+'   '+c+' '+c+' '+c+' '+c+'   '+c+' '+c+'   '+c+' '+c+'          ', campCrt);
	afficheMessage(5, c+'    '+c+'   '+c+'   '+c+'    '+c+' '+c+'     '+c+' '+c+' '+c+' '+c+' '+c+' '+c, campCrt);
	score[campCrt]++; localStorage.setItem('score'+campCrt, score[campCrt]);
	afficheScore(campCrt);
}

function afficheDistance(camp)
{
	if (camp == undefined) {
		afficheDistance(ctcGauche);
		afficheDistance(ctcDroite);
	} else {
		db = Math.round(10*distBln[camp]); 
		dj = Math.round(10*distPjr[camp]); 
		document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxMilliers].src = stChmPng + (dj>999?(stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(dj/1000)%10)):stPngVide) + stExtPng;
		document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxCentaines].src = stChmPng + (dj>99?(stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(dj/100)%10)):stPngVide) + stExtPng;
		document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxDizaines].src = stChmPng + stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(dj/10)%10) + stExtPng;
		document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxUnites].src = stChmPng + stPrfxChiffre+stClCamp[couleurCamp[camp]]+(dj%10) + stExtPng;
		document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxMilliers].src = stChmPng + (db>999?(stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(db/1000)%10)):stPngVide) + stExtPng;
		document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxCentaines].src = stChmPng + (db>99?(stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(db/100)%10)):stPngVide) + stExtPng;
		document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxDizaines].src = stChmPng + stPrfxChiffre+stClCamp[couleurCamp[camp]]+(Math.floor(db/10)%10) + stExtPng;
		document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxUnites].src = stChmPng + stPrfxChiffre+stClCamp[couleurCamp[camp]]+(db%10) + stExtPng;
	}
}

function afficheOccupation(delta)
{
	// À ce moment de l'affichage, on a pas encore changé de camp...
	tours=1+2*tourCrt;
	if (tourCrt<tourMiTemps) {
		if (campCrt==ctcDroite)
			tours++;
	} else
		if (campCrt==ctcGauche)
			tours++;
	
	if (delta!=undefined) tours+=delta; // Pour le chargement de partie car l'affichage de l'occupation est avant changement de camp
	
	// document.getElementById('occupation').rows[0].cells[2].innerHTML=occupation+'/'+tours; // pour debug
	
	var o=Math.round(100*occupation/tours);
	var stCouleur='a';
	if (o>0) {
		if (o<500) {
			stCouleur=stClCamp[couleurCamp[ctcDroite]];
			o=1000-o; // On affiche l'avantage dans la couleur !
		} 
		else
			if (o>500) 
				stCouleur=stClCamp[couleurCamp[ctcGauche]];
	} else
		o=500;
	document.images[stPrfxOccupation+stPrfxCentaines].src = stChmPng + stPrfxChiffre + stCouleur + (Math.floor(o/100)%10) + stExtPng; 
	document.images[stPrfxOccupation+stPrfxDizaines].src = stChmPng + stPrfxChiffre + stCouleur + (Math.floor(o/10)%10) + stExtPng; 
	document.images[stPrfxOccupation+stPrfxVirgule].src = stChmPng + stPrfxChiffre + stCouleur + stPrfxVirgule + stExtPng; 
	document.images[stPrfxOccupation+stPrfxUnites].src = stChmPng + stPrfxChiffre + stCouleur + (o%10) + stExtPng; 
	document.images[stPrfxOccupation+stPrfxPourcents].src = stChmPng + stPrfxChiffre + stCouleur + stPrfxPourcents + stExtPng; 
}

function tire(xTireur, yTireur, xNvBallon, yNvBallon)
{
	// Distance parcourue. Même en cas de but, on prend la distance tireur-ballon pour le ballon (prend ça dans la gueule).
	distance=Math.sqrt((xBallon-xTireur)*(xBallon-xTireur)+(yBallon-yTireur)*(yBallon-yTireur));
	distPjr[campCrt]+=distance; localStorage.setItem('distPjr'+campCrt, distPjr[campCrt]);
	distBln[campCrt]+=distance;	localStorage.setItem('distBln'+campCrt, distBln[campCrt]);
	afficheDistance(campCrt);	
	
	// On bouge les éléments
	c[xTireur][yTireur]=pnCaseVide; localStorage.setItem('c'+xTireur+yTireur, pnCaseVide);
	afficheCase(xTireur, yTireur);
	if (!but) {
		c[xNvBallon][yNvBallon]=pnBallon; localStorage.setItem('c'+xNvBallon+yNvBallon, pnBallon); 
		afficheCase(xNvBallon, yNvBallon);
	}
	c[xBallon][yBallon]=1+campCrt; localStorage.setItem('c'+xBallon+yBallon, 1+campCrt); 
	afficheCase(xBallon, yBallon);
	if (!but) {
		xBallon=xNvBallon; localStorage.xBallon=xNvBallon; 
		yBallon=yNvBallon; localStorage.yBallon=yNvBallon;
	} else {
		xBallon=xyIndefini; localStorage.xBallon=xyIndefini;
		yBallon=xyIndefini; localStorage.yBallon=xyIndefini;
	}
	if (but) {
		if (!tempsSuspendu) suspendChrono(new Date().getTime());
		if (campCrt==ctcGauche) { // Si gauche marque : +10. Si droite marque : +0.
			occupation+=xMax; localStorage.occupation=occupation;
		}
		afficheBut();
	} else {
		occupation+=xBallon; localStorage.occupation=occupation;
	}
	afficheOccupation();	
}
	
function tirPossible(x, y, testSeul) // retourne 0=possible, 1=trajet Tireur-Ballon occupé, 2=trajet Ballon-NvCase occupé.
{ // /!\ Pré-requis : (x,y) est un pion tireur valide (non déplacé) et à portée (<3 cases) et le tir potentiel n'est pas en arrière

    // v1.1 : mode test tir pessimiste
    if (modeTestTir == 1) resultatTestTir = rttKO;

	var dxTB=xBallon-x;
	var dyTB=yBallon-y;
	var pasBon=false;
	var butPossible=true;
	if ((dxTB==0)||(dyTB==0)||(Math.abs(dxTB)==Math.abs(dyTB))) {
		// Tir Cardinal : on regarde s'il n'y a pas de pion sur le trajet tireur>Ballon et Ballon>NvCase...
		d=0;
		dir=dIndefinie;
		if (x==xBallon) { // Vertical
			if (yBallon>y)
				dir=dSud;
			else
				dir=dNord;
			d=Math.abs(yBallon-y);
		} else if (y==yBallon) { // Horizontal
			if (xBallon>x)
				dir=dEst;
			else
				dir=dOuest;
			d=Math.abs(xBallon-x);
		} else { // Diagonale
			var sens=(1+(xBallon-x)/Math.abs(xBallon-x))/2+1+(yBallon-y)/Math.abs(yBallon-y);
			switch(sens) {
				case 0:	dir=dNordOuest; break;
				case 1:	dir=dNordEst; break;
				case 2:	dir=dSudOuest; break;
				case 3: dir=dSudEst; break;
			}
			d=Math.abs(xBallon-x);
		}
	
		// Vérification du trajet Tireur-Ballon
		for(var k=1; k<d; k++) 
			if (c[x+k*dx[dir]][y+k*dy[dir]]!=pnCaseVide)
				return tpTrajetTBOccupe;
				
		// Vérification du trajet Ballon-NvCase
		var tp=tpPossible; // Optimiste
		var dxx=dxTB;
		var dyy=dyTB;
		var xx=xBallon;
		var yy=yBallon;
		var rebond=false;
		var j=dxTB?Math.abs(dxTB):Math.abs(dyTB);
		for(var i=1; (!pasBon)&&(i<j); i++) {
			// Rebond avant éventuel but... alors ne plus contrôler
			if (rebond=(xx+signe(dxx)>xTBMax)||(xx+signe(dxx)<xTBMin))
				dxx=-dxx;
			if ((yy+signe(dyy)>yTBMax)||(yy+signe(dyy)<yTBMin)) 
				dyy=-dyy;
			xx+=signe(dxx);
			yy+=signe(dyy);
			if ((c[xx][yy]>pnCaseVide)&& // Case occupée et
			    ((xx!=x)||(yy!=y))) { // la case finale n'est pas la case tireur (permutation autorisée)
				tp=tpTrajetBNOccupe;
				pasBon=true; // Sous réserve qu'il n'y ait pas but
			}
			if (!rebond) butPossible=(!pasBon);
		}
		if (pasBon&&(!butPossible))
			return tp; // Pas de rebond avant case occupée => pas bon !
	}
	// Tir non Cardinal : uniquement case finale du ballon doit être vide
	var butMarque=false; 
	var xNB=2*xBallon-x;
	var yNB=2*yBallon-y;
	if (xNB<xTBMin) xNB=2-xNB;
	if (xNB>xTBMax) xNB=2*xTBMax-xNB;
	if (yNB<yTBMin) yNB=-yNB;
	if (yNB>yTBMax) yNB=2*yTBMax-yNB;
	if (x!=xBallon) { // But impossible si ballon et tireur sur même colonne
		// On cherche yBut pour savoir si ça passe strictement entre les poteaux
	
		// xBallon-x   yBallon-y
		// --------- = ---------
		//   xBut-x      yBut-y
		
		var yBut=y+((xBut[campCrt]-x)*(yBallon-y))/(xBallon-x);
		if (((yBut>yButMin)&&(yBut<yButMax))&& // Entre les lignes de poteaux ET…
			((campCrt==ctcGauche)&&(2*xBallon-x>xBut[campCrt])|| // Le ballon aurait passé la colonne de but (droite)
			 (campCrt==ctcDroite)&&(2*xBallon-x<xBut[campCrt]))) // Le ballon aurait passé la colonne de but (gauche)
			butMarque=true;
	}
	if (!butMarque) {
		if (pasBon)
			return tp; // Finalement, pas de but possible => pas bon !
		if ((xNB==xBallon)&&(yNB==yBallon))
			return tpMemeCaseTB; // Ballon et tireur arrivent sur la même case
		if ((c[xNB][yNB]>pnCaseVide)&&
		    ((xNB!=x)||(yNB!=y)))
			return tpCaseOccupee;
	}
	if (testSeul==undefined) { // Si l'on ne teste pas le tir pour savoir si l'on peut tirer ALORS
	    if (modeTestTir != 1) { // on effectue l'action et on notifie s'il y a but (variable globale). v1.1 : SAUF si le joueur courant n'est pas en mode test tir 
			but=butMarque; localStorage.but = butMarque;
			tire(x, y, xNB, yNB); // Tir possible
	    } else { // v1.1 : Sinon on affiche le tir (tireur et ballon déplacés)
	 		if (butMarque) {
	 			resultatTestTir = rttBut;
	 			xTestTireur = x;
	 			yTestTireur = y;
	 			xTestBallon = xBallon;
	 			yTestBallon = yBallon;
	 			afficheCase(xBallon, yBallon);
	 		} else {
	 			resultatTestTir = rttOK;
	 			xTestTireur = xBallon;
	 			yTestTireur = yBallon;
	 			xTestBallon = xNB;
	 			yTestBallon = yNB;
	 			afficheCase(xBallon, yBallon);
	 			afficheCase(xNB, yNB);
	 		}
			setTimeout( function () {
							defaitTestTir();
						}, dureeMsgErr);
	    }
	}
	return tpPossible;
}

function peutTirer()
{
	for(var x=xMin; x<=xMax; x++)
		for(var y=yMin; y<=yMax; y++)
			if ((c[x][y]==1+campCrt)&& // Pion tireur  
				((x!=xDepl)||(y!=yDepl))&& // Pion non déplacé
				((Math.abs(xBallon-x)<=3)&&(Math.abs(yBallon-y)<=3))&& // À portée du ballon
				(((campCrt!=ctcGauche)||(xBallon>=x))&&  // Tir latéral ou devant (gauche)
				 ((campCrt!=ctcDroite)||(xBallon<=x)))&& // Tir latéral ou devant (droit)
				(tirPossible(x, y, true)==tpPossible)) // Tir possible
				return true;
	return false;					
}

function deplacementPossible(x, y) // retourne 0=possible, 1=direction incorrecte, 2=hors de portée, 3=trajet occupé.
{ // /!\ Pré-requis : (c[x][y] == pnCaseVide)
	// Hors de portée (>3 cases)
	if ((Math.abs(x-xDepl)>3)||
	    (Math.abs(y-yDepl)>3))
		return dpHorsPortee;
	// Direction non autorisée (hor./vert./diag.)
	if ((x!=xDepl)&&(y!=yDepl)&&
	    (Math.abs(x-xDepl)/Math.abs(y-yDepl))!=1)
		return dpDirIncorrecte;
	// Zone interdite
	if (((x==xMin)||(x==xMax))&& // Zone de défense ET
	    (y>=yFiletMin)&&(y<=yFiletMax)) // filets --> interdit
		return dpZoneInterdite;
	if ((((x==xMin)&&(campCrt==ctcDroite))|| // (défense joueur gauche ou
		 ((x==xMax)&&(campCrt==ctcGauche)))&& // défense joueur droite) ET 
	    ((y<=yFiletMin)||(y>=yFiletMax))) // hors filets --> interdit
		return dpZoneInterdite;
	d=0;
	dir=dIndefinie;
	if (x==xDepl) { // Vertical
		if (y>yDepl)
			dir=dSud;
		else
			dir=dNord;
		d=Math.abs(y-yDepl);
	} else if (y==yDepl) { // Horizontal
		if (x>xDepl)
			dir=dEst;
		else
			dir=dOuest;
		d=Math.abs(x-xDepl);
	} else { // Diagonale
		var sens=(1+(x-xDepl)/Math.abs(x-xDepl))/2+1+(y-yDepl)/Math.abs(y-yDepl);
		switch(sens) {
			case 0:	dir=dNordOuest; break;
			case 1:	dir=dNordEst; break;
			case 2:	dir=dSudOuest; break;
			case 3: dir=dSudEst; break;
		}
		d=Math.abs(x-xDepl);
	}
	
	// Vérification du trajet
	for(var k=1; k<d; k++) {
		if (c[xDepl+k*dx[dir]][yDepl+k*dy[dir]]!=pnCaseVide)
			return dpTrajetOccupe;
	}
	
	// Déplacement possible
	return dpPossible;
}

function deplaceVers(x, y)
{ // Pré-requis : déplacement autorisé de (xDepl,yDepl)->(x,y)
	if ((xDepl>xyIndefini)&&(yDepl>xyIndefini)) {
		c[xDepl][yDepl]=pnCaseVide; localStorage.setItem('c'+xDepl+yDepl, pnCaseVide); 
		afficheCase(xDepl, yDepl);
	}
	distPjr[campCrt]+=Math.sqrt((xDepl-x)*(xDepl-x)+(yDepl-y)*(yDepl-y)); localStorage.setItem('distPjr'+campCrt, distPjr[campCrt]);
	afficheDistance(campCrt);
	c[x][y]=1+campCrt; localStorage.setItem('c'+x+y, 1+campCrt); 
	xDepl=x; localStorage.xDepl = x;
	yDepl=y; localStorage.yDepl = y;
	afficheCase(x, y);
	changePhase(phTir);
}

function placeBallon(x, y)
{
	c[x][y]=pnBallon; localStorage.setItem('c'+x+y, pnBallon); 
	xBallon=x; localStorage.xBallon=x;
	yBallon=y; localStorage.yBallon=y;
	afficheCase(x, y);
}

function toucheXY(x, y)
{
	switch(phase[campCrt]) {
		case phPoseJoueurs:	if (c[x][y]!=pnCaseVide) {
								afficheMessage(4, 'CASE OCCUPEE !', campCrt);
								afficheMessage(5, 'CHOISISSEZ UNE AUTRE CASE', campCrt);
								setTimeout( function () {
												afficheMessage(4, ' ', campCrt);
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							xDeb=1+(campCrt==ctcDroite?5:0);
							xFin=3+xDeb;
							if ((x<xDeb)||(x>xFin))
								{
								afficheMessage(4, 'CASE INCORRECTE :', campCrt);
								afficheMessage(5, 'COLONNE ENTRE '+String.fromCharCode(65+xDeb)+' ET '+String.fromCharCode(65+xFin)+'.', campCrt);
								setTimeout( function () {
												afficheMessage(4, ' ', campCrt);
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							c[x][y]=1+campCrt; localStorage.setItem('c'+x+y, 1+campCrt); 
							joueurs[campCrt]++; localStorage.setItem('joueurs'+campCrt, joueurs[campCrt]);
							joueurs[0]++; localStorage.setItem('joueurs'+0, joueurs[0]);
							afficheCase(x, y);
							if ((joueurs[ctcGauche] == joueursMax) && (joueurs[ctcDroite] == joueursMax)) {
								placeBallon(xCentre, yCentre);
								changePhase(phDeplacement1); // Le dernier qui pose engage
							}
							else
								changeCamp();
							break;
		case phDeplacement1:if (c[x][y]!=1+campCrt) {
								if ((x==xBallon)&&(y==yBallon)) {
									// Toucher le ballon permet de passer le déplacement de pion si campCrt peut tirer
									if (peutTirer()) {
										passePhase(phDeplacement1);
										return;
									} else {
										afficheMessage(5, 'TIR IMPOSSIBLE !', campCrt);
										setTimeout( function () {
														afficheMessage(5, ' ', campCrt);
													}, dureeMsgErr);
										return;
									}
								}
								else {
									afficheMessage(5, 'CHOIX INCORRECT !', campCrt);
									setTimeout( function () {
													afficheMessage(5, ' ', campCrt);
												}, dureeMsgErr);
									return;
								}
							}
							xDepl=x; localStorage.xDepl=x;
							yDepl=y; localStorage.yDepl=y;
							afficheCase(x, y);
							changePhase(phDeplacement2);
							break;
		case phDeplacement2:if (c[x][y]!=pnCaseVide) {
								if ((x==xDepl)&&(y==yDepl)) {
									// Toucher deux fois un pion annule le déplacement
									passePhase(phDeplacement2);
									return;
								} else {
									afficheMessage(5, 'CASE CIBLE OCCUPEE !', campCrt);
									setTimeout( function () {
													afficheMessage(5, ' ', campCrt);
												}, dureeMsgErr);
									return;
								}
							} else {
								var dp=deplacementPossible(x, y);
								if (dp>dpPossible) {
									switch(dp) {
										case dpDirIncorrecte:	afficheMessage(5, 'DIRECTION INCORRECTE !', campCrt);
																break;
										case dpHorsPortee:		afficheMessage(5, 'CASE HORS DE PORTEE !', campCrt);
																break;
										case dpTrajetOccupe:	afficheMessage(5, 'TRAJET OCCUPE !', campCrt);
																break;
										case dpZoneInterdite:	afficheMessage(5, 'ZONE INTERDITE !', campCrt);
																break;
									}
									setTimeout( function () {
													afficheMessage(5, ' ', campCrt);
												}, dureeMsgErr);
									return;
								} else
									deplaceVers(x, y); // déplace (xDepl,yDepl)->(x,y)
							}
							break;	
		case phTir:			if (c[x][y]!=1+campCrt) {
								if ((x==xBallon)&&(y==yBallon)) {
									// Toucher le ballon passe le tir ou l'annule s'il est obligatoire en revenant au déplacement
									if (modeTestTir == 1) { // v1.1 : ajout du mode test de tir. Toucher le ballon termine ce mode
										termineTestTir();
										return;
									} else {
										if (phasePassee) {
											annulePhase(phTir);
											return;
										} else {
											passePhase(phTir);
											return;
										}
									}
								}
								afficheMessage(5, 'CHOIX INCORRECT !', campCrt);
								setTimeout( function () {
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							if ((x==xDepl)&&(y==yDepl)) {
								afficheMessage(5, 'PION DEPLACE NON TIREUR !', campCrt);
								setTimeout( function () {
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							if ((Math.abs(xBallon-x)>3)||(Math.abs(yBallon-y)>3)) {
								afficheMessage(5, 'PION HORS DE PORTEE !', campCrt);
								setTimeout( function () {
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							if (((campCrt==ctcGauche)&&(xBallon<x))||
								((campCrt==ctcDroite)&&(xBallon>x))) {
								afficheMessage(5, 'TIR EN ARRIERE INTERDIT !', campCrt);
								setTimeout( function () {
												afficheMessage(5, ' ', campCrt);
											}, dureeMsgErr);
								return;
							}
							if ((modeTestTir==1)&&(resultatTestTir>rttIndefini)) return; // v1.1 : On ne teste pas un tir si un affichage de résultat de test est en cours !
							var tp=tirPossible(x, y);
							if (tp>tpPossible) {
									switch(tp) {
										case tpTrajetTBOccupe:
										case tpTrajetBNOccupe:	afficheMessage(5, 'TRAJET OCCUPE !', campCrt);
																break;
										case tpCaseOccupee:		afficheMessage(5, 'CASE FINALE OCCUPEE !', campCrt);
																break;
										case tpMemeCaseTB:		afficheMessage(5, 'MEME CASE TIREUR + BALLON', campCrt);
																break;					
									}
									afficheCase(xBallon, yBallon); // v1.1 : affichage ballon selon résultat du tir (ballon barré, but en mode test tir)
									setTimeout( function () {
													afficheMessage(5, ' ', campCrt);
													defaitTestTir(); // v1.1 : on remet les pions après test tir
												}, dureeMsgErr);
									return;
							}
							if (but) {
								but=false; localStorage.but = false;
								if (((tourCrt+1 != tourMiTemps) || (campCrt == ctcGauche)) && // Ce n'est ni la mi-temps
								 	((tourCrt+1 != tourFinPartie) || (campCrt == ctcDroite))) { // Ni la fin de partie
								 	if (((tourCrt < tourMiTemps) && (campCrt == ctcDroite)) || 
								 	    ((tourCrt >= tourMiTemps) && (campCrt == ctcGauche))) {
								 	    tourCrt++; localStorage.tourCrt = tourCrt; // On change de tour mais pas de camp !
								 	    afficheTour();
								 	}
									setTimeout( function() {
													initialisePlateau();
													changePhase(phPoseJoueurs); // Celui qui marque pose le premier pour que celui qui engage pose en dernier
												}, dureeMsgButMiTps);
								}
								else {// La mi-temps ou la fin de partie se joue dans changeCamp(phDeplacement1)
									setTimeout( function() {
													changeCamp(phDeplacement1);
												}, dureeMsgButMiTps);
								}
							} else // On continue normalement
								if (modeTestTir != 1) // v1.1 : sauf mode test de tir
									changeCamp(phDeplacement1);
							break;						
	}
}

function afficheTour()
{	
	var pcTours = Math.round((100*tourCrt)/(2*tourMiTemps));
	stCouleur = stClCamp[couleurCamp[campCrt]];
	document.images[stPrfxTour+stPrfxDizaines].src=stChmPng+stPrfxChiffre+stCouleur+(Math.floor(pcTours/10)%10)+stExtPng;
	document.images[stPrfxTour+stPrfxUnites].src=stChmPng+stPrfxChiffre+stCouleur+(pcTours%10)+stExtPng;
	document.images[stPrfxTour+stPrfxPourcents].src=stChmPng+stPrfxChiffre+stCouleur+stPrfxPourcents+stExtPng;
}

function affichePhase(camp)
{
	if (camp == undefined) {
		afficheTour();
		affichePhase(ctcGauche);
		affichePhase(ctcDroite);
	} else {
		var src = stChmPng;
		switch(phase[camp]) {
			case phAttente:		src = src + stPngVide +stExtPng; break;
			case phDeplacement1:
			case phDeplacement2:src = src + stPrfxJrDeplace + stClCamp[couleurCamp[camp]] + stCtJeu[ctjHaut] + stCtCamp[camp] + stExtPng; break;
			case phPoseJoueurs: src = src + stPrfxJoueur + stClCamp[couleurCamp[camp]] + stCtJeu[ctjHaut] + stCtCamp[camp] + stExtPng; break;
			case phTir:			src = src + stPngBallon + stSfxTestTir[modeTestTir] + stExtPng; break; // v1.1 : ajout mode test tir
		}
		document.images[stPrfxPhase+stPrfxJoueur+stCtCamp[camp]].src = src; 
	}
}

function commencePartie()
{
	initialisePlateau();
	sauvePartie();
	changeCamp(phPoseJoueurs, ctcDroite); // Droite pose en premier car gauche pose le dernier pour comencer à jouer
}

function initialiseTerrain(camp, clCamp)
{
	for(var i=0; i<xCentre; i++) {
		var colonne=String.fromCharCode(97+(camp==ctcGauche?i:10-i)); // 1ère ascisse = 'a' minuscule (ASCII 97)
		for(var j=0; j<hauteurPlateau; j++) {
			var ligne=j+1;
			var src=stClTerrain[clCamp]+(((camp==ctcGauche?i:10-i)+j)%4)+stExtPng;
			if (i==0) 
				if ((j>=3) && (j<=5)) 
					src=stChmPng+stPrfxButs+src;
				else
					src=stChmPng+stPrfxFond+src;
			else
					src=stChmPng+stPrfxTerrain+src;
			document.images[colonne + ligne].src = src;
		}		
	}		
}

function afficheTemps(camp)
{
	if (camp==undefined) {
		afficheTemps(ctcGauche);
		afficheTemps(ctcDroite);
	} else {
		var tps=0;
		drnTop = new Date().getTime(); localStorage.drnTop = drnTop; // Permet de reprendre le jeu à tout moment
		if (camp==campCrt) {
			if (temps[campCrt]==0) {
				if (!tempsSuspendu) { // Affichage pendant le jeu : on initialise temps[camCrt]
					temps[campCrt]=drnTop; localStorage.setItem('temps'+campCrt, drnTop); 
				}
				tps=0;
			} else
				tps=drnTop-temps[campCrt];
		} else {
			if (temps[3-campCrt]>0)
				tps=topChrono[3-campCrt]-temps[3-campCrt];
		}
		tps = 2000*tpsParTour*tourMiTemps - tps; // v1.1 : il s'agit maintenant d'un compte à rebours
		if (tps<0) { // v1.1 : temps écoulé à zéro = fin de partie et match perdu !
			tps=0;
			finPartie('TEMPS ECOULE: MATCH PERDU', camp);
		}
		var secondes=Math.floor(tps/1000)%60;
		var minutes=Math.floor(tps/60000)%60;
		var heures=Math.floor(tps/3600000);
		document.images[stPrfxHeures+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + (heures%10) + stExtPng;
		document.images[stPrfxMinutes+stPrfxDizaines+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + Math.floor(minutes/10) + stExtPng;
		document.images[stPrfxMinutes+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + (minutes%10) + stExtPng;
		document.images[stPrfxSecondes+stPrfxDizaines+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + Math.floor(secondes/10) + stExtPng;
		document.images[stPrfxSecondes+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + (secondes%10) + stExtPng;
	}
}

function afficheScore(camp)
{
	if (camp == undefined) {
		afficheScore(ctcGauche);
		afficheScore(ctcDroite);
	} else {
		var stDizaine = stChmPng + stPngVide + stExtPng;
		var stUnite = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + (score[camp]%10) + stExtPng;	
		if (score[camp] > 9) {
			stDizaine = stChmPng + stPrfxChiffre + stClCamp[couleurCamp[camp]] + Math.floor(score[camp]/10) + stExtPng;
			document.images[stPrfxScore+stCtCamp[camp]+stPrfxDizaines].src = stDizaine;
			document.images[stPrfxScore+stCtCamp[camp]+stPrfxUnites].src = stUnite;
		} else {
			document.images[stPrfxScore+stCtCamp[camp]+((camp==ctcGauche)?stPrfxDizaines:stPrfxUnites)].src = stDizaine;
    		document.images[stPrfxScore+stCtCamp[camp]+((camp==ctcGauche)?stPrfxUnites:stPrfxDizaines)].src = stUnite;
		}
	}
}

function affecteCouleur(camp, clCamp)
{
	couleurCamp[camp] = clCamp; localStorage.setItem('couleurCamp'+camp, clCamp);
	
	// v1.1 : on affiche le temps imparti total
	var tps = 2000*tpsParTour*tourMiTemps;
	var secondes=Math.floor(tps/1000)%60;
	var minutes=Math.floor(tps/60000)%60;
	var heures=Math.floor(tps/3600000);
	// Temps imparti (on n'appelle pas afficheTemps car le chrono ne tourne pas
	document.images[stPrfxTemps+stCtCamp[camp]].src = stChmPng + stPrfxTemps + stClCamp[clCamp] + stExtPng;
	document.images[stPrfxHeures+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + (heures%10) + stExtPng; // v1.1 (heures)
	document.images[stPrfxHeures+stPrfxSeparateur+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + stPrfxDeuxPoints + stExtPng;
	document.images[stPrfxMinutes+stPrfxDizaines+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + Math.floor(minutes/10) + stExtPng; // v1.1 (minutes)
	document.images[stPrfxMinutes+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + (minutes%10) + stExtPng; // v1.1 (minutes)
	document.images[stPrfxMinutes+stPrfxSeparateur+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + stPrfxDeuxPoints + stExtPng;
	document.images[stPrfxSecondes+stPrfxDizaines+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + Math.floor(secondes/10) + stExtPng; // v1.1 (secondes)
	document.images[stPrfxSecondes+stPrfxUnites+stCtCamp[camp]].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + (secondes%10) + stExtPng; // v1.1 (secondes)
	
	// Score
	afficheScore(camp);
	
	// Distance parcourue
	document.images[stPrfxDistance+stCtCamp[camp]].src = stChmPng + stPrfxDistance + stClCamp[clCamp] + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]].src = stChmPng + stPngBallon + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]].src = stChmPng + stPrfxJoueur + stClCamp[clCamp] + stCtJeu[ctjHaut] + stCtCamp[camp] + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxMilliers].src = stChmPng + stPngVide + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxCentaines].src = stChmPng + stPngVide + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxDizaines].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + '0' + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxSeparateur].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + stPrfxVirgule + stExtPng;
	document.images[stPrfxDistance+stPrfxJoueur+stCtCamp[camp]+stPrfxUnites].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + '0' + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxMilliers].src = stChmPng + stPngVide + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxCentaines].src = stChmPng + stPngVide + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxDizaines].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + '0' + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxSeparateur].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + stPrfxVirgule + stExtPng;
	document.images[stPrfxDistance+stPrfxBallon+stCtCamp[camp]+stPrfxUnites].src = stChmPng + stPrfxChiffre + stClCamp[clCamp] + '0' + stExtPng;
	
	initialiseTerrain(camp, clCamp);
}

function choisitCouleur(camp, clCamp)
{
	if ((couleurCamp[3-camp] == clCamp) ||
	    ((couleurCamp[3-camp] == clcRouge) && (clCamp == clcOrange)) ||
	    ((couleurCamp[3-camp] == clcOrange) && (clCamp == clcRouge)) ||
	    ((couleurCamp[3-camp] == clcRouge) && (clCamp == clcMauve)) ||
	    ((couleurCamp[3-camp] == clcMauve) && (clCamp == clcRouge)) ||
	    ((couleurCamp[3-camp] == clcPourpre) && (clCamp == clcMauve)) ||
	    ((couleurCamp[3-camp] == clcMauve) && (clCamp == clcPourpre)) ||
	    ((couleurCamp[3-camp] == clcPourpre) && (clCamp == clcBleu)) ||
	    ((couleurCamp[3-camp] == clcBleu) && (clCamp == clcPourpre)) ||
	    ((couleurCamp[3-camp] == clcVert) && (clCamp == clcCiel)) ||
	    ((couleurCamp[3-camp] == clcCiel) && (clCamp == clcVert))) {
	    afficheMessage(2, ' ', camp);
	    afficheMessage(3, 'CHANGEZ VOTRE CHOIX !', camp);
	    afficheMessage(4, 'MEME COULEUR OU PROCHE DE', camp);
	    afficheMessage(5, 'CELLE DE VOTRE ADVERSAIRE', camp); 
	    setTimeout(	function() {
	    				proposeCouleurs(camp);
	    			}, dureeMsgErr);
	} else {
		affecteCouleur(camp, clCamp);
		if (couleurCamp[3-camp] == undefined) {
			afficheMessage(2, ' ', camp);
			afficheMessage(3, 'EN ATTENTE DU CHOIX', camp);
			afficheMessage(4, 'DE VOTRE ADVERSAIRE', camp);
			afficheMessage(5, ' ', camp);
		} else 
			commencePartie();
	}
		
}

function toucheCouleur(camp, couleur)
{	switch(couleur) {
		case 0: choisitCouleur(camp, clcBleu); break;
		case 1:	choisitCouleur(camp, clcPourpre); break;
		case 2:	choisitCouleur(camp, clcMauve); break;
		case 3:	choisitCouleur(camp, clcRouge); break;
		case 4:	choisitCouleur(camp, clcOrange); break;
		case 5:	choisitCouleur(camp, clcCiel); break;
		case 6:	choisitCouleur(camp, clcJaune); break;
		case 7:	choisitCouleur(camp, clcVert); break;
	}
}

function proposeCouleurs(camp)
{
	if (camp == undefined) {
		proposeCouleurs(ctcGauche);
		proposeCouleurs(ctcDroite);	
	} else {
		afficheMessage(2, 'CHOISISSEZ UNE COULEUR:', camp);
		afficheMessage(3, 'b*BLEU*b p*POUPRE*p m*MAUVE*m', camp, stToucheCouleur+camp+',');
		afficheMessage(4, 'r*ROUGE*r o*ORANGE*o c*CIEL*c', camp, stToucheCouleur+camp+',3+');
		afficheMessage(5, 'j*JAUNE*j v*VERT*v', camp, stToucheCouleur+camp+',6+');
	}
}

function sauvePartie()
{
	localStorage.partieEnCours = true; // Indique qu'une partie a été sauvegardée.

	// Paramètres de jeu
	localStorage.joueursMax=joueursMax;
	localStorage.tourMiTemps=tourMiTemps;
	localStorage.tourFinPartie=tourFinPartie;
	localStorage.tpsParTour=tpsParTour; // v1.1 : paramètre supplémentaire
	
	// Variables de jeu
	localStorage.campCrt = campCrt;
	localStorage.tourCrt = tourCrt;
	for(var j=0; j<=2; j++) {
		localStorage.setItem('couleurCamp'+j 	, couleurCamp[j]);
		localStorage.setItem('score'+j 			, score[j]);
		localStorage.setItem('joueurs'+j 		, joueurs[j]);
		localStorage.setItem('phase'+j 			, phase[j]);
		localStorage.setItem('temps'+j 			, temps[j]); 
		localStorage.setItem('topChrono'+j 		, topChrono[j]); 
		localStorage.setItem('distPjr'+j 		, distPjr[j]); 
		localStorage.setItem('distBln'+j 		, distBln[j]); 
	}

	for(var i=xMin; i<=xMax; i++)
		for(var j=xMin; j<=yMax; j++)
			localStorage.setItem('c'+i+j, c[i][j]);

	localStorage.xDepl 			= xDepl;
	localStorage.yDepl 			= yDepl;
	localStorage.xBallon		= xBallon;
	localStorage.yBallon		= yBallon;
	localStorage.but			= but;
	localStorage.phasePassee	= phasePassee;  
	localStorage.occupation		= occupation;
	localStorage.tempsSuspendu 	= tempsSuspendu; 
}

function chargePartie()
{ // suppose que localStorage.getItem('partieEnCours') est défini

	// Paramètres de jeu
	joueursMax 			= parseInt(localStorage.joueursMax);
	tourMiTemps 		= parseInt(localStorage.tourMiTemps);
	tourFinPartie		= parseInt(localStorage.tourFinPartie);
	tpsParTour			= parseInt(localStorage.tpsParTour); // v1.1
	if (localStorage.getItem('tpsParTour')!=undefined) // v1.1 : nouveau paramètre
		tpsParTour = parseInt(localStorage.tpsParTour); 
	else
		tpsParTour=36;
	
	// Variables de jeu
	campCrt				= parseInt(localStorage.campCrt);
	tourCrt				= parseInt(localStorage.tourCrt);
	if (localStorage.getItem('drnTop'))
		drnTop 			= parseInt(localStorage.drnTop);
	else
		drnTop 			= 0;
	now					= new Date().getTime();
	for(var j=0; j<=2; j++) {
		couleurCamp[j] 	= parseInt(localStorage.getItem('couleurCamp'+j));
		score[j]		= parseInt(localStorage.getItem('score'+j));
		joueurs[j]		= parseInt(localStorage.getItem('joueurs'+j));
		phase[j]		= parseInt(localStorage.getItem('phase'+j));
		temps[j]		= parseInt(localStorage.getItem('temps'+j)); 
		topChrono[j]	= parseInt(localStorage.getItem('topChrono'+j)); 
		distPjr[j]		= parseFloat(localStorage.getItem('distPjr'+j));  
		distBln[j]		= parseFloat(localStorage.getItem('distBln'+j)); 
		if ((temps[j]>0)&&(drnTop>0)) {
			temps[j]+=(now-drnTop); localStorage.setItem('temps'+j, temps[j]); 
			if (topChrono[j]>0) { // Il faut respecter l'intervalle 
				topChrono[j]+=(now-drnTop); localStorage.setItem('topChrono'+j, topChrono[j]); 
			}
		} 
	}
	
	for(var i=xMin; i<=xMax; i++)
		for(var j=xMin; j<=yMax; j++) 
			c[i][j] 	= parseInt(localStorage.getItem('c'+i+j));
			
	xDepl				= parseInt(localStorage.xDepl);
	yDepl				= parseInt(localStorage.yDepl);
	xBallon				= parseInt(localStorage.xBallon);
	yBallon				= parseInt(localStorage.yBallon);
	but					= (localStorage.but=='true');
	phasePassee 		= (localStorage.phasePassee=='true');  
	occupation			= parseInt(localStorage.occupation);
	tempsSuspendu 		= (localStorage.tempsSuspendu=='true');  

	// On rafraîchit l'affichage
	affecteCouleur(ctcGauche, couleurCamp[ctcGauche]);
	affecteCouleur(ctcDroite, couleurCamp[ctcDroite]);
	affichePlateau(); // On affiche toutes les cases du jeu
	afficheTemps();
	if ((tourCrt>0)||(campCrt!=ctcGauche)) 
		afficheOccupation(-1); // On affiche l'occupation avant le changement de joueur
	afficheDistance();
	// if (phase[campCrt]>phPoseJoueurs) // v1.1 : On lance le chrono dans tous les cas de figure
	reprendChrono(new Date().getTime());
	changePhase(phase[campCrt]);
}

function initialisePartie()
{ // /!\ NE PAS UTILISER localStorage ici, c'est dans sauvePartie()

	// On prend les paramètres en cours
	joueursMax=prmJoueursMax;
	tourMiTemps=prmTourMiTemps;
	tourFinPartie=prmTourFinPartie;
	tpsParTour=prmTpsParTour; // v1.1

	campCrt			= ctcIndefini;
	tourCrt			= 0;
	for(var j=0; j<=2; j++) {
		if (j==0) 
			couleurCamp[j] = clcBlanc
		else 
			couleurCamp[j] = undefined;
		score[j]	= 0;
		joueurs[j]	= 0;
		phase[j]	= phAttente;
		temps[j]	= 0; 
		topChrono[j]= 0; 
		distPjr[j]	= 0.0; 
		distBln[j]	= 0.0; 
	}
	xDepl			= xyIndefini;
	yDepl			= xyIndefini;
	xBallon			= xyIndefini;
	yBallon			= xyIndefini;
	but				= false;
	phasePassee 	= false;  
	occupation		= 0;
	tempsSuspendu 	= true; 
	afficheOccupation();
}
					
function nouvellePartie(n) // paramètre inutile juste pour le clic du bouton "Nouvelle partie".
{
	initialisePartie();
	videMessage();
	afficheMessage(1, 'NOUVELLE PARTIE');
	proposeCouleurs();
}

function choixMenu(c, m) 
{
	switch(m) {
		case 0:	/* Menu principal */
				afficheMessage(1, 'BIENVENUE A ASPIC', c);
				afficheMessage(2, 'a*A PROPOS*a', c, 'choixMenu('+c+', 13+');
				afficheMessage(3, 'b*NOUVELLE PARTIE*b', c, 'choixMenu('+c+', 1+');
				if (localStorage.getItem('partieEnCours')!=undefined)
					afficheMessage(4, 'r*CONTINUER LA PARTIE*r', c, 'choixMenu('+c+', 12+');
				else
					afficheMessage(4, ' ', c);
				afficheMessage(5, 'v*PARAMETRES DE JEU*v', c, 'choixMenu('+c+', 2+');
				break;
		case 1:	/* Nouvelle partie */
				nouvellePartie();
				break;
		case 2:	/* Menu : Paramètres */
				// v1.1 : On charge les paramètre de jeu en cours
				if (localStorage.getItem('partieEnCours')!=undefined) { // partie en cours
					joueursMax 			= parseInt(localStorage.joueursMax);
					tourMiTemps 		= parseInt(localStorage.tourMiTemps);
					tourFinPartie		= parseInt(localStorage.tourFinPartie);
					if (localStorage.getItem('tpsParTour')!=undefined) // v1.1
						tpsParTour = parseInt(localStorage.tpsParTour); 
					else
						tpsParTour=36;

				} else { // future partie
					joueursMax=prmJoueursMax;
					tourMiTemps=prmTourMiTemps;
					tourFinPartie=prmTourFinPartie;
					tpsParTour=prmTpsParTour; // v1.1
				}
				afficheMessage(1, 'PARAMETRES ('+(prmTpsParTour*tourMiTemps/15)+'")', c); // v1.1 : on affiche la durée max de la partie
				afficheMessage(2, 'v*TOURS PAR PARTIE (2X'+prmTourMiTemps+')*v', c, 'choixMenu('+c+', 3+');
				afficheMessage(3, 'b*PIONS PAR JOUEUR ('+prmJoueursMax+')*b', c, 'choixMenu('+c+', 4+');
				afficheMessage(4, 'j*TEMPS/TOUR/JOUEUR ('+prmTpsParTour+'$)*j', c, 'choixMenu('+c+', 14+'); // v1.1 : nouveau paramètre
				afficheMessage(5, 'a*RETOUR*a', c, 'choixMenu('+c+', 0+');
				break;
		case 3:	/* Paramètre : Nombre de tours */
				afficheMessage(1, 'PARAMETRE : TOURS DE JEU', c);
				afficheMessage(2, 'ACTUELLEMENT : 2X'+tourMiTemps, c);
				afficheMessage(3, 'j*2X5*j  v*2X10*v', c, 'choixMenu('+c+', 5+');
				afficheMessage(4, 'b*2X25*b r*2X50*r', c, 'choixMenu('+c+', 7+');
				afficheMessage(5, 'a*RETOUR*a', c, 'choixMenu('+c+', 2+');
				break;
		case 4:	/* Paramètre : Nombre de pions/joueur */
				afficheMessage(1, 'PARAMETRE : PIONS DE JEU', c);
				afficheMessage(2, 'ACTUELLEMENT : '+joueursMax, c);
				afficheMessage(3, ' ', c);
				afficheMessage(4, 'v*5*v b*6*b r*7*r', c, 'choixMenu('+c+', 9+');
				afficheMessage(5, 'a*RETOUR*a', c, 'choixMenu('+c+', 2+');
				break;
		case 5:	/* Paramètre : Nombre de tours = 2x5 */
				prmTourMiTemps=5; localStorage.prmTourMiTemps=prmTourMiTemps; 
				prmTourFinPartie=2*prmTourMiTemps; localStorage.prmTourFinPartie=prmTourFinPartie;
				choixMenu(c, 2);
				break;
		case 6:	/* Paramètre : Nombre de tours = 2x10*/
				prmTourMiTemps=10; localStorage.prmTourMiTemps=prmTourMiTemps;
				prmTourFinPartie=2*prmTourMiTemps; localStorage.prmTourFinPartie=prmTourFinPartie;
				choixMenu(c, 2);
				break;
		case 7:	/* Paramètre : Nombre de tours = 2x25 */
				prmTourMiTemps=25; localStorage.prmTourMiTemps=prmTourMiTemps;
				prmTourFinPartie=2*prmTourMiTemps; localStorage.prmTourFinPartie=prmTourFinPartie;
				choixMenu(c, 2);
				break;
		case 8:	/* Paramètre : Nombre de tours = 2x50 */
				prmTourMiTemps=50; localStorage.prmTourMiTemps=prmTourMiTemps;
				prmTourFinPartie=2*prmTourMiTemps; localStorage.prmTourFinPartie=prmTourFinPartie;
				choixMenu(c, 2);
				break;
		case 9:	/* Paramètre : Nombre de pions = 5 */
				prmJoueursMax=5; localStorage.prmJoueursMax=prmJoueursMax;
				choixMenu(c, 2);
				break;
		case 10:/* Paramètre : Nombre de pions = 6 */
				prmJoueursMax=6; localStorage.prmJoueursMax=prmJoueursMax;
				choixMenu(c, 2);
				break;
		case 11:/* Paramètre : Nombre de pions = 7 */
				prmJoueursMax=7; localStorage.prmJoueursMax=prmJoueursMax;
				choixMenu(c, 2);
				break;
		case 12:/* Reprendre partie */
				chargePartie();
				break;
		case 13:/* A PROPOS */
				var stCoulMsg = [stClCamp[1+Math.floor(8*Math.random())], stClCamp[1+Math.floor(8*Math.random())], stClCamp[1+Math.floor(8*Math.random())], stClCamp[1+Math.floor(8*Math.random())], stClCamp[1+Math.floor(8*Math.random())], stClCamp[1+Math.floor(8*Math.random())]];
				afficheMessage(1, stCoulMsg[1]+'*ASPIC VERSION '+stVersion+'*'+stCoulMsg[1], c, 'choixMenu('+c+', 13+');
				afficheMessage(2, stCoulMsg[2]+'*CREE ET DEVELOPPE PAR*'+stCoulMsg[1], c, 'choixMenu('+c+', 13+');
				afficheMessage(3, stCoulMsg[3]+'*PATRICE FOUQUET*'+stCoulMsg[1], c, 'choixMenu('+c+', 13+');
				afficheMessage(4, ' ', c);
				afficheMessage(5, 'a*RETOUR*a', c, 'choixMenu('+c+', 0+');
				break;
		// deb v1.1 : nouveau paramètre : temps par tour par joueur
		case 14:/* Paramètre : Temps/Tour/Joueur */
				afficheMessage(1, 'PARAMETRE : TEMPS/TOUR', c);
				afficheMessage(2, 'ACTUELLEMENT : '+tpsParTour+'$', c);
				afficheMessage(3, 'j*18$*j  v*27$*v b*36$*b', c, 'choixMenu('+c+', 15+');
				afficheMessage(4, 'c*45$*c r*54$*r', c, 'choixMenu('+c+', 18+');
				afficheMessage(5, 'a*RETOUR*a', c, 'choixMenu('+c+', 2+');
				break;
		case 15:/* Paramètre : Temps/tour/joueur = 18s */
				prmTpsParTour=18; localStorage.prmTpsParTour=prmTpsParTour; 
				choixMenu(c, 2);
				break;
		case 16:/* Paramètre : Temps/tour/joueur = 27s */
				prmTpsParTour=27; localStorage.prmTpsParTour=prmTpsParTour; 
				choixMenu(c, 2);
				break;
		case 17:/* Paramètre : Temps/tour/joueur = 36s */
				prmTpsParTour=36; localStorage.prmTpsParTour=prmTpsParTour; 
				choixMenu(c, 2);
				break;
		case 18:/* Paramètre : Temps/tour/joueur = 45s */
				prmTpsParTour=45; localStorage.prmTpsParTour=prmTpsParTour; 
				choixMenu(c, 2);
				break;
		case 19:/* Paramètre : Temps/tour/joueur = 54s */
				prmTpsParTour=54; localStorage.prmTpsParTour=prmTpsParTour; 
				choixMenu(c, 2);
				break;
		// fin v1.1 : nouveau paramètre : temps par tour par joueur
		
	}
}

function chargeParametres()
{
	if (localStorage.getItem('prmTourMiTemps')!=undefined)
		prmTourMiTemps=parseInt(localStorage.prmTourMiTemps);	
	else
		prmTourMiTemps=50; // Valeur par défaut
	if (localStorage.getItem('prmTourFinPartie')!=undefined)
		prmTourFinPartie=parseInt(localStorage.prmTourFinPartie);
	else
		prmTourFinPartie=100; // Valeur par défaut
	if (localStorage.getItem('prmJoueursMax')!=undefined)
		prmJoueursMax=parseInt(localStorage.prmJoueursMax);
	else
		prmJoueursMax=6; // Valeur par défaut
	// v1.1 : nouveau paramètre
	if (localStorage.getItem('prmTpsParTour')!=undefined)
		prmTpsParTour=parseInt(localStorage.prmTpsParTour);
	else
		prmTpsParTour=36; // Valeur par défaut
}

function bienvenue()
{
	chargeParametres();
	videMessage();
	for(var c=ctcGauche; c<=ctcDroite; c++)
		choixMenu(c, 0);
}

function adapteDimensions()
{
	var largeurEcran = document.getElementById('container').offsetWidth; 
	var hauteurEcran = document.getElementById('container').offsetHeight; 
	var n=document.images.length;
	var coefX=largeurEcran/largeurHTML;
	var coefY=hauteurEcran/hauteurHTML;
	var coef=Math.min(coefX, coefY); /// On garde les proportions
	var hauteur=0;
	var largeur=0;
	for(var i=0; i<n; i++) {
		hauteur=parseInt(document.images[i].height);
		largeur=parseInt(document.images[i].width);
		document.images[i].height=Math.round(coef*hauteur);
		document.images[i].width=Math.round(coef*largeur);
	}
}
