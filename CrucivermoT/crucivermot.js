 /*
 
 Fichier: CrucivermoT.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.1>
 
 Copyright (C) 2013 Patrice Fouquet.
 
 */ 

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.1';
const stVerDico = '7';

/*
Version 1.0 
 - première version.
*/

// Diverses chaînes
const stLettre           = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const espace             = ' ';
const joker				 = '?';
const plus				 = '+';
const transparent		 = '-';
const caseNoire			 = '*';
const vide				 = '';
const pluriel			 = 'S';
const extPng			 = '.png';
const chmPng			 = 'png/';
const chmMsg			 = 'png/msg/';
const onClick			 = 'onClick';
const idDigit       	 = 'tmcdu';
const idSablier			 = 'sablier';
const idTour			 = 'sablier';
const idFondTour		 = 'fondtour';
const idJoueur			 = 'xbdpm';
const couleurSolitaire	 = 'm';
const couleurJoueur		 = ['','VERT','ORANGE'];
const fondBouton		 = '-p';

// constantes fréquentes
const indefini           = -1;
const oui                = true;
const non                = false;
const vrai 				 = 'true';

// ia
const dx = [0,0,1,0,-1];
const dy = [0,-1,0,1,0];

// tailles diverses
const tailleMinMot	= 2;
const tailleMaxMot	= 8;
const tailleMaxMsg	= 32;
const charCodeMinA  = 65;
const charCodeMin0  = 48;

// orientation pour afficheCompte, effaceCompte & filtreHV
const horizontal	= 'h';
const vertical 		= 'v';
const totalhv		= 't';

// arguments pour auteur[x][y]
const personne		= 0;
const vert			= 1;
const orange		= 2;
const poseTop		= 3;

// arguments pour compte[meilleur|joueur][totallc|ligne|colonne]
const meilleur		= 0; 
const totallc		= 0;
const ligne			= 1;
const colonne		= 2;

// valeurs de numClic pour clic()
const accueil			= 78;
const aPropos			= 79;
const stats				= 80;
const regleDuJeu		= 81;
const okRDJ				= 82;
const choixCaseOuLettre = 83;
const reprisePartie		= 84;
const nvPartieSolitaire = 85;
const nvPartieADeux		= 86;


// prefixes localStorage
const lsGrille			= 'g';
const lsAuteur			= 'a';
const lsCompte			= 'c';
const lsScore			= 's';
const lsChoix			= 'lChoix';
const lsPartieSauvee = 'partieEnregistree';
const lsNbSolitaires	= 'nbSolitaires';

const nbMots		= new Array (80, 610, 2509, 7645, 17318, 31070, 46329); 

// cptLtr[p][l] = Compte les mots ayant l en position p (p = 0 à 7, l = 0 à 25)
const cptLtr		= [	[3650,2788,4829,3866,4531,1969,1738,838,1154,511,154,1388,2478,715,908,3627,119,4165,3013,2276,176,1118,41,10,64,203],
						[7999,617,1123,254,8899,324,350,1003,3688,75,41,1851,1202,2242,6268,832,76,3908,599,785,2886,317,49,499,375,67],
						[3326,1548,2920,1110,2331,1220,1628,478,3218,258,61,2897,1881,3281,2535,2138,369,4597,2625,2768,3278,1184,17,183,289,189],
						[4623,677,1869,1227,5306,851,1168,731,5161,95,105,2642,1281,2305,4192,1397,460,3026,2266,2857,2962,752,25,67,202,82],
						[4785,556,1414,804,5335,647,955,652,6045,22,70,2874,814,3078,2312,737,410,5116,2529,3118,2973,507,21,111,362,82],
						[5805,306,709,1107,6193,244,892,604,5044,5,47,2300,1450,2777,3554,338,356,4581,3127,4013,2123,301,1,63,351,38],
						[6454,47,207,593,15590,95,552,216,4688,6,67,1161,336,7092,554,95,0,3015,1804,1955,1573,115,3,12,82,17],
						[2781,3,20,104,8880,102,50,22,2353,0,28,267,91,802,67,7,1,2316,17249,6781,135,0,3,378,12,3877]];


//---------------------------------------------------------------------------
// VARIABLES GLOBALES
//---------------------------------------------------------------------------

var tour = indefini; // ls = OK
var xChoix = indefini; // ls = OK
var yChoix = indefini; // ls = OK

var score = [0,0,0]; // usage : score[joueur]. ls=OK  

var grille = [	[joker, joker, joker, joker, joker, joker, joker, joker], // ls=OK
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker],
				[joker, joker, joker, joker, joker, joker, joker, joker]];
var auteur = [	[personne, personne, personne, personne, personne, personne, personne, personne], // ls=OK
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne],
				[personne, personne, personne, personne, personne, personne, personne, personne]];

var compte = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // usage : compte[meilleur|joueur][totallc|ligne|colonne]. ls=OK
var lChoix = [espace,espace,espace]; // ls=OK
var lettresTop = vide; // ls=OK

// Solitaire
var solitaire = false; // ls=OK
var topSolitaire = 0; // ls=OK;
var nbSolitaires = 0; // ls=OK;
var solitairesFinis = 0; // ls=OK;

var indexRDJ = 0; // NON SAUVEGARDE.
var attenteReponse = false; // Si true, oblige à toucher un bouton et rien d'autre. NON SAUVEGARDE.
//---------------------------------------------------------------------------
// FONCTIONS
//---------------------------------------------------------------------------
function afficheCase(x, y)
{
	if (x == undefined) x = xChoix;
	if (y == undefined) y = yChoix;
	var c = grille[x][y];
	switch(c) {
		case joker: 	if (auteur[x][y]>personne) // Sélection de la case choisie par le joueur qui sert.
							c = '-'+(solitaire?couleurSolitaire:idJoueur[auteur[x][y]]);
						else
							c = '-p'; 
						break;
		case caseNoire:	c = '-0'; break;
		default:		c = c + ((solitaire && (auteur[x][y]%3)) ? couleurSolitaire : idJoueur[auteur[x][y]]); break;
	}
	document.images[x+'*'+y].src = chmPng + c + extPng;
}
//---------------------------------------------------------------------------
function afficheGrille()
{
	for(var y=0; y<tailleMaxMot; y++)
		for(var x=0; x<tailleMaxMot; x++)
			afficheCase(x, y);
}
//---------------------------------------------------------------------------
function initialiseGrille()
{
	for(var y=0; y<tailleMaxMot; y++)
		for(var x=0; x<tailleMaxMot; x++) {
			grille[x][y]=joker;
			auteur[x][y]=personne;
		}
}
//---------------------------------------------------------------------------
function chargeGrille()
{
	for(var y=0; y<tailleMaxMot; y++)
		for(var x=0; x<tailleMaxMot; x++) {
			grille[x][y]=localStorage.getItem(lsGrille+x+vide+y);
			auteur[x][y]=parseInt(localStorage.getItem(lsAuteur+x+vide+y));
		}
}
//---------------------------------------------------------------------------
function enregistreGrille()
{
	for(var y=0; y<tailleMaxMot; y++)
		for(var x=0; x<tailleMaxMot; x++) {
			localStorage.setItem(lsGrille+x+vide+y, grille[x][y]);
			localStorage.setItem(lsAuteur+x+vide+y, auteur[x][y]);
		}
}
//---------------------------------------------------------------------------
function filtreHV(orientation, position, repere) // repere permet de rechercher de part et d'autre les limites, il est supposé être un repère n'importe où dans le mot. Par défaut xChoix ou yChoix.
{
	var filtre = '';
	var xd, xf, yd, yf;
	switch(orientation) {
		case 'h':	if (repere == undefined)
						repere = xChoix;
					if (repere>indefini) {
						for(xd=repere; (xd>=0)&&(grille[xd][position]!=caseNoire); xd--);
						xd++;	
						for(xf=repere; (xf<tailleMaxMot)&&(grille[xf][position]!=caseNoire); xf++);
						xf--;	
					}
					else {
						xd=0;
						xf=tailleMaxMot-1;
					}
					for(var x=xd; x<=xf; x++)
						filtre = filtre + grille[x][position];
					break;
		case 'v': 	if (repere == undefined)
						repere = yChoix;
					if (repere>indefini) {
						for(yd=repere; (yd>=0)&&(grille[position][yd]!=caseNoire); yd--);
						yd++;	
						for(yf=repere; (yf<tailleMaxMot)&&(grille[position][yf]!=caseNoire); yf++);
						yf--;	
					}
					else {
						yd=0;
						yf=tailleMaxMot-1;
					}
					for(var y=yd; y<=yf; y++)
						filtre = filtre + grille[position][y];
					break;
		default:	break;
	}
	return filtre;
}
//---------------------------------------------------------------------------
function creeGrille()
{	
	initialiseGrille();
	var xLettre = [indefini, indefini, indefini, indefini, indefini, indefini, indefini, indefini];
	var pris = [false,false,false,false,false,false,false,false];
	var x;
	var lettres;
	var h, v;
	xChoix = indefini;
	yChoix = indefini;
	for(var y=0; y<tailleMaxMot; y++) {
		do { 
			x = Math.floor(tailleMaxMot * Math.random());	
		} while(pris[x]||(x==y));
		pris[x] = true;
		xLettre[y] = x; 
		grille[x][y] = caseNoire;
	}
	// Détermination de chaque lettre
	for(var y=0; y<tailleMaxMot; y++) {
		x = xLettre[y];
		lettres = '';
		for(var l=65;l<91;l++) {
			h = cptLtr[x][l-65];
			v = cptLtr[y][l-65];
			if ((h>Math.floor(nbMots[tailleMaxMot-tailleMinMot]/52)) &&
				(v>Math.floor(nbMots[tailleMaxMot-tailleMinMot]/52)))
				lettres = lettres + String.fromCharCode(l);
		}
		grille[x][y] = lettres[Math.floor(lettres.length * Math.random())];
	}
	enregistrePartie();
}
//---------------------------------------------------------------------------
function afficheCompte(nombre, orientation, joueur, position) // si orientation = totalhv, alors position ignorée
{
	if (orientation == totalhv) position = 't';
	var radical = (solitaire?1:joueur)+orientation+position;
	var compteur = Math.floor(nombre).toString();
	var taille = compteur.length;
	for(var i=0; i<5-taille; i++)
		compteur = '0' + compteur;
	switch(Math.floor(nombre)) {
		case 0:		fond = '-m'+orientation; break;
		default: 	if (nombre == compte[meilleur][totallc]) 
						fond = '-p'+orientation;
					else
						fond = transparent;
					break;
	}
	for(var i=0; i<idDigit.length; i++) {
		document.images['f' + radical + idDigit[i]].src = chmPng + fond + extPng;
		document.images['s' + radical + idDigit[i]].src = chmPng + (compteur[i]+(solitaire?couleurSolitaire:idJoueur[joueur])) + extPng;
	}
}
//---------------------------------------------------------------------------
function effaceCompte(orientation, joueur, position) 
{
	if (orientation == undefined) {
		for(var j=1; j<=2; j++) {
			for(var p=0; p<tailleMaxMot; p++) {
				effaceCompte(horizontal, j, p);
				effaceCompte(vertical, j, p);
			}
			effaceCompte(totalhv, j);
		}
	}
	else {
		if (orientation == totalhv) position = 't';
		var radical = joueur+orientation+position;
		for(var i=0; i<idDigit.length; i++) {
			document.images['f'+ radical + idDigit[i]].src = chmPng + transparent + extPng;
			document.images['s'+ radical + idDigit[i]].src = chmPng + transparent + extPng;
		}
	}
}
//---------------------------------------------------------------------------
function indiceDico(filtre, debut) // v1.5
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
function compteMots(filtre) 
{
	if (filtre.length<tailleMinMot) 
		if (filtre.length==1)
			return ((filtre==joker)?26:1);
		else
			return 0;
	var t = filtre.length-tailleMinMot;
	var iMin = 0;
	var iMax = nbMots[t]-1;
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
			((t<4)||(filtre[8]==joker)||(dico[t][i][8]==filtre[8]))) {
			if (!n) crucivermot = dico[t][i];
			n++;
		}
	return n;
}
//---------------------------------------------------------------------------
function afficheScore(joueur)
{
	if (solitaire) {
		scorePartie = score[1] + score[2];
		document.images['sc1d'].src = chmPng + transparent + extPng;
		document.images['sc1u'].src = chmPng + (Math.floor(scorePartie/100)%10) + couleurSolitaire + extPng;
		document.images['sc0d'].src = chmPng + (Math.floor(scorePartie/10)%10) + couleurSolitaire + extPng;
		document.images['sc2d'].src = chmPng + (scorePartie%10) + couleurSolitaire + extPng;
		document.images['sc2u'].src = chmPng + transparent + extPng;
	}
	else
		if (joueur == undefined) {
			afficheScore(1);
			afficheScore(2);
		}
		else {
			document.images['sc'+joueur+'d'].src = chmPng + (Math.floor(score[joueur] / 10)) + idJoueur[joueur] + extPng;
			document.images['sc0d'].src = chmPng + transparent + extPng;
			document.images['sc'+joueur+'u'].src = chmPng + (score[joueur] % 10) + idJoueur[joueur] + extPng;
		}
}
//---------------------------------------------------------------------------
function afficheCaractere(x, y, c, f, n)
{
	var prfxPng = c;
	switch(c) {
		case espace:prfxPng = transparent; break;
		case '\'':	prfxPng = '!apostrophe'; break;
		case ':':	prfxPng = '!deuxpoints'; break;
		case '=':	prfxPng = '!egal'; break;
		case '!':	prfxPng = '!exclamation'; break;
		case '«':	prfxPng = '!guillemetG'; break;
		case '»':	prfxPng = '!guillemetD'; break;
		case 'i':	prfxPng = '!i'; break;
		case '?':	prfxPng = '!interrogation'; break;
		case '(':	prfxPng = '!parentheseG'; break;
		case ')':	prfxPng = '!parentheseD'; break;
		case '+':	prfxPng = '!plus'; break;
		case '.':	prfxPng = '!point'; break;
		case 'r':	prfxPng = '!RAZ'; break;
		case 's':	prfxPng = '!sablier'; break;
		case '/':	prfxPng = '!slash'; break;
		case '…':	prfxPng = '!suspension'; break;
		case '-':	prfxPng = '!tiret'; break;
		case ',':	prfxPng = '!virgule'; break;
	} 
	var suffixe = (x<10?String.fromCharCode(charCodeMin0+x):String.fromCharCode(charCodeMinA+x-10))+(y-1);
	var digit = 'm' + suffixe;
	var fond = 'f' + suffixe;
	document.images[digit].src = chmMsg + prfxPng + extPng;
	document.images[fond].src = chmMsg + f + extPng;
	if (f == fondBouton)
		document.images[digit].setAttribute(onClick, 'clic('+n+')');
	else
		if (document.images[digit].getAttribute(onClick))
			document.images[digit].removeAttribute(onClick);
}
//---------------------------------------------------------------------------
function afficheMessage(numligne, message, numClic)
{
	var d=0;
	var fond=transparent;
	if (message==undefined)
		message='                                ';
	if (numClic==undefined) numClic=0;
	for(var i=0; i<message.length; i++) {
		// fond de couleur de joueur (vert)
		if (idJoueur.indexOf(message[i+d])>0) {
			if (fond=='-'+message[i+d])
				fond=transparent;
			else
				fond='-'+message[i+d];
			d++;
		}
		// debut de bouton
		if (message[i+d]=='[') {
			fond=fondBouton;
			d++;
		}
		// fin de bouton
		if (message[i+d]==']') {
			fond=transparent;
			numClic++;
			d++;
		}
		if (i<tailleMaxMsg)
			afficheCaractere(i, numligne, message[i+d], fond, numClic);
	}
}
//---------------------------------------------------------------------------
// 00-77	choix case
// 78-99	boutons divers
// 100-125	choix lettres
//---------------------------------------------------------------------------
function choixCase() {
	return (!attenteReponse)&&(tour%3==0);
}
//---------------------------------------------------------------------------
function choixLettre() {
	return (tour%3>0);
}
//---------------------------------------------------------------------------
function joueurCourant() // 0 si pas de jeu en cours. 1=vert ; 2=orange.
{
	if (tour>indefini)
		return 1+(Math.floor((tour+1)/3)%2);
	else
		return 0;
}
//---------------------------------------------------------------------------
function joueurServeur() // 0 si pas de jeu en cours. 1=vert ; 2=orange.
{
	if (tour>indefini)
		return 1+(Math.floor(tour/3)%2);
	else
		return 0;
}
//---------------------------------------------------------------------------
function afficheNumeroTour() // On affiche Tour/3 car il faut trois tours pour poser une lettre (ou une case noire)
{
	if (tour==indefini) {
		document.images[idFondTour].src = chmPng + transparent + extPng;
		document.images[idTour].src = chmPng + transparent + extPng;
	}
	else {
		document.images[idFondTour].src = chmPng + 'x'+Math.floor(tour/30)+vide+(Math.floor(tour/3)%10) + extPng;
		document.images[idTour].src = chmPng + '0'+Math.floor(tour/30)+vide+(Math.floor(tour/3)%10) + extPng;
	}
}
//---------------------------------------------------------------------------
function afficheTour()
{
	var jc = joueurCourant();
	var cc = choixCase();
	var cl = choixLettre();
	const prfxImg = 'main';
	document.images['icc1'].src = chmPng + prfxImg + 'SG' + idJoueur[((!solitaire) && cc && (jc == 1))?1:0] + extPng; 
	document.images['icc2'].src = chmPng + prfxImg + 'SD' + idJoueur[((!solitaire) && cc && (jc == 2))?2:0] + extPng; 
	document.images['icl1'].src = chmPng + prfxImg + 'IG' + idJoueur[((!solitaire) && cl && (jc == 1))?1:0] + extPng; 
	document.images['icl2'].src = chmPng + prfxImg + 'ID' + idJoueur[((!solitaire) && cl && (jc == 2))?2:0] + extPng; 
	afficheNumeroTour();
}
//---------------------------------------------------------------------------
function tourSuivant()
{
	if (tour==indefini) {
		creeGrille();
		afficheGrille();
		afficheScore();
	}
	tour++;
	localStorage.tour = tour;
	afficheTour();
}
//---------------------------------------------------------------------------
function majSablier(activer)
{
	if (activer) {
		document.images[idFondTour].src = chmPng + transparent + extPng;
		document.images[idSablier].src = chmPng + idSablier + extPng;
	}
	else
		afficheNumeroTour();
}
//---------------------------------------------------------------------------
function choisitCaseOuLettre()
{
	var j = joueurCourant();
	if (solitaire)
		afficheMessage(1);
	else
		afficheMessage(1, ((j==1)?' ':'')+'     C\'EST A '+idJoueur[j]+couleurJoueur[j]+idJoueur[j]+' DE JOUER…     '+((j==1)?' ':''));
	if (choixCase()) {
		effaceCompte();
		if (!existeCasesLibres()) {
			attenteReponse = true;
			solitaire = false; // par défaut
			afficheMessage(1, 'IL N\'Y A PLUS DE CASES LIBRES… ');
			if (solitaire) {
				afficheMessage(2, 'BRAVO VOUS AVEZ FINI LA GRILLE !');
				afficheMessage(3, '   VOUS DOUBLEZ VOTRE SCORE !   ');
				score[1]*=2; score[2]*=2;
				afficheScore();
				enregistreStatsSolitaire(1);
			}
			else {
				afficheMessage(2, '     LA PARTIE EST TERMINEE.    ');
				afficheMessage(3);
			}
			afficheMessage(4, '   [ A PROPOS ] [ STATS ] [ REGLE ]   ', aPropos);
			afficheMessage(5, '[ SOLITAIRE ] [ PARTIE A 2 JOUEURS ]', nvPartieSolitaire);
			localStorage.removeItem(lsPartieSauvee); // La sauvegarde ne peut plus être rechargée

		}
		else {
			afficheMessage(2, '   CHOISISSEZ UNE CASE LIBRE    ');
			afficheMessage(3, '        DANS LA GRILLE…         ');
			afficheMessage(4);
			afficheMessage(5);
		}
	}
	else {
		// On affiche la case choisie par le serveur avec la couleur du joueur courant...
		grille[xChoix][yChoix] = joker;
		localStorage.setItem(lsGrille+xChoix+vide+yChoix, joker);
		auteur[xChoix][yChoix] = joueurCourant();
		localStorage.setItem(lsAuteur+xChoix+vide+yChoix, joueurCourant());
		afficheCase();
		afficheMessage(2, 'CHOISISSEZ UNE LETTRE…  [ A ] [ B ] ', 100);
		afficheMessage(3, '[ C ] [ D ] [ E ] [ F ] [ G ] [ H ] [ I ] [ J ] ', 102);
		afficheMessage(4, '[ K ] [ L ] [ M ] [ N ] [ O ] [ P ] [ Q ] [ R ] ', 110);
		afficheMessage(5, '[ S ] [ T ] [ U ] [ V ] [ W ] [ X ] [ Y ] [ Z ] ', 118);
		attenteReponse = true;
	}
}
//---------------------------------------------------------------------------
function enregistreScore(numjo)
{
	localStorage.setItem(lsScore+numjo, score[numjo]);
}
//---------------------------------------------------------------------------
function chargeStatsSolitaire()
{
	if (localStorage.getItem(lsNbSolitaires)) {
		topSolitaire = localStorage.topSolitaire;
		nbSolitaires = localStorage.nbSolitaires;
		solitairesFinis = localStorage.solitairesFinis;
	}
	else {
		topSolitaire = 0;
		nbSolitaires = 0;
		solitairesFinis = 0;
	}
}
//---------------------------------------------------------------------------
function enregistreStatsSolitaire(fini)
{
	nbSolitaires++;
	localStorage.nbSolitaires = nbSolitaires;
	solitairesFinis += fini;
	localStorage.solitairesFinis = solitairesFinis;
	if (score[1]+score[2]>topSolitaire) {
		topSolitaire = score[1]+score[2];
		localStorage.topSolitaire = topSolitaire;
	}
}
//---------------------------------------------------------------------------
function choixCaseImpossiblePoseCaseNoire(s, fin)
{
	attenteReponse = true;
	afficheMessage(1, ' LE CHOIX DE LA CASE NE PERMET  ');
	afficheMessage(2, 'DE TROUVER DE MOT ENTRAINANT LA ');
	if (solitaire && fin) {
			afficheMessage(3, 'POSE D\'UNE CASE NOIRE AVEC ZONE ');
			afficheMessage(4, 'QUI NE PERMET PAS LA POSE DE MOT');
			afficheMessage(5, 'PARTIE TERMINEE [ RETOUR AU MENU ]', accueil);
			enregistreStatsSolitaire(0);
			localStorage.removeItem(lsPartieSauvee); // La sauvegarde ne peut plus être rechargée
	}
	else {
		var j = joueurCourant(); 
		afficheMessage(3, 'POSE D\'UNE CASE NOIRE ('+(s>0?plus:vide)+s+' PT'+(s>1?pluriel:vide)+').  ');
		afficheMessage(4);
		afficheMessage(5, '      [ POURSUIVRE LA PARTIE ]    ', choixCaseOuLettre);
		score[j] = Math.max(score[j] + s, 0);
		enregistreScore(joueurCourant());
		afficheScore();
		tour+=3;
		localStorage.tour = tour;
		afficheTour();
	}
}
//---------------------------------------------------------------------------
function enregistreChoix(numjo)
{
	if (numjo == undefined) {
		localStorage.lChoix1 = lChoix[1];
		localStorage.lChoix2 = lChoix[2];
	}
	else
		localStorage.setItem(lsChoix+numjo, lChoix[numjo]);
}
//---------------------------------------------------------------------------
function enregistreCompte(qui, ou) // paramètres tous facultatifs.
{
	if (qui == undefined) 
		for(var j=0; j<3; j++)
			enregistreCompte(j);
	else
		if (ou == undefined) {
			localStorage.setItem(lsCompte+qui+vide+ligne, compte[qui][ligne]);
			localStorage.setItem(lsCompte+qui+vide+colonne, compte[qui][colonne]);
			localStorage.setItem(lsCompte+qui+vide+totallc, compte[qui][totallc]);
		}
		else
			localStorage.setItem(lsCompte+qui+vide+ou, compte[qui][ou]);
}
//---------------------------------------------------------------------------
function evalueChoixCase(numClic) 
{
	if (choixCase()) {
		xChoix = Math.floor(numClic/10);
		yChoix = numClic%10;
		localStorage.xChoix = xChoix;
		localStorage.yChoix = yChoix;
		lChoix[1] = espace; lChoix[2] = espace;
		enregistreChoix();
		if (grille[xChoix][yChoix]!=joker) {
			afficheMessage(2, ' VOUS NE POUVEZ PAS CHOISIR UNE ');
			afficheMessage(3, ' mCASE OCCUPEEm PAR UNE mLETTREm OU ');
			afficheMessage(4, ' UNE mCASE NOIREm. mRECOMMENCEZ…m   ');
		}
		else {
			// On évalue la case...
			compte[meilleur][ligne] = 0;
			compte[meilleur][colonne] = 0;
			compte[meilleur][totallc] = 0;
			enregistreCompte(meilleur);
			lettresTop = vide;
			localStorage.lettresTop = vide;
			var compteH, compteV;
			var caseOK=false;
			for(var l=0; (l<26)&&(!caseOK); l++) {
				grille[xChoix][yChoix]=String.fromCharCode(charCodeMinA+l);
				compteH = compteMots(filtreHV(horizontal, yChoix));
				compteV = compteMots(filtreHV(vertical, xChoix));
				caseOK = ((compteH > 0) && (compteV > 0));
			}
			grille[xChoix][yChoix]=joker;
			if (!caseOK) { // On doit poser une case noire...
				grille[xChoix][yChoix] = caseNoire;
				localStorage.setItem(lsGrille+xChoix+vide+yChoix, caseNoire);
				auteur[xChoix][yChoix] = personne;
				localStorage.setItem(lsAuteur+xChoix+vide+yChoix, personne);
				afficheCase();
				var scoreCN = 0; 
				var filtreCN = '';
				var compteCN = 0;
				var finPartieSolitaire = false;
				// Calcul du Score de la case noire : condition nécessaire : toute nouvelle portion d'au moins 2 lettres doit pouvoir accueillir au moins un mot pour obtenir un score > 0
				// Nord
				if (yChoix > 0) {
					filtreCN = filtreHV(vertical, xChoix, yChoix-1);
					if (filtreCN.length >= tailleMinMot) {
						compteCN = compteMots(filtreCN);
						if (compteCN > 0)
							scoreCN++;
						else {
							scoreCN-=3;
							finPartieSolitaire = true;
						}
					}
				}
				// Est
				if (xChoix < tailleMaxMot-1) {
					filtreCN = filtreHV(horizontal, yChoix, xChoix+1);
					if (filtreCN.length >= tailleMinMot) {
						compteCN = compteMots(filtreCN);
						if (compteCN > 0)
							scoreCN++;
						else {
							scoreCN-=3;
							finPartieSolitaire = true;
						}
					}
				}
				// Sud
				if (yChoix < tailleMaxMot-1) {
					filtreCN = filtreHV(vertical, xChoix, yChoix+1);
					if (filtreCN.length >= tailleMinMot) {
						compteCN = compteMots(filtreCN);
						if (compteCN > 0)
							scoreCN++;
						else {
							scoreCN-=3;
							finPartieSolitaire = true;
						}
					}
				}
				// Ouest
				if (xChoix > 0) {
					filtreCN = filtreHV(horizontal, yChoix, xChoix-1);
					if (filtreCN.length >= tailleMinMot) {
						compteCN = compteMots(filtreCN);
						if (compteCN > 0)
							scoreCN++;
						else {
							scoreCN-=3;
							finPartieSolitaire = true;
						}
					}
				}
				choixCaseImpossiblePoseCaseNoire(scoreCN, finPartieSolitaire);
			}
			else {
				// On a trouvé des mots horizontalement et verticalement, on peut chercher les lettres top...
				var compteCrt=[0,0,0];
				for(var l=0; l<26; l++) {
					grille[xChoix][yChoix] = String.fromCharCode(charCodeMinA + l);
					compteCrt[ligne] = compteMots(filtreHV(horizontal, yChoix));
					compteCrt[colonne] = compteMots(filtreHV(vertical, xChoix));
					compteCrt[totallc] = Math.min(compteCrt[ligne], compteCrt[colonne]);
					if (compteCrt[totallc] > 0)
						compteCrt[totallc] += Math.max(compteCrt[ligne], compteCrt[colonne]) / 100000;
					if (compteCrt[totallc] > compte[meilleur][totallc]) {
						compte[meilleur][ligne] = compteCrt[ligne];
						compte[meilleur][colonne] = compteCrt[colonne];
						compte[meilleur][totallc] = compteCrt[totallc];
						enregistreCompte(meilleur);
						lettresTop = grille[xChoix][yChoix];
					}
					else if (compteCrt[totallc] == compte[meilleur][totallc]) 
						lettresTop = lettresTop + grille[xChoix][yChoix];
					localStorage.lettresTop = lettresTop;
				} 
				grille[xChoix][yChoix] = joker;
				joueTourSuivant(); // Case permettant de jouer...
			}
		}
	}
}
//---------------------------------------------------------------------------
function evalueChoixLettre(numClic)
{
	var j = joueurCourant();
	if (lChoix[3-j] == String.fromCharCode(numClic-35)) {
			afficheMessage(2, '    VOUS NE POUVEZ PAS CHOISIR  ');
			afficheMessage(3, '          mLA MEME LETTREm         ');
			afficheMessage(4);
			afficheMessage(5, '          [ RECOMMENCER… ]         ', choixCaseOuLettre);
	}
	else {
		lChoix[j] = String.fromCharCode(numClic-35);
		enregistreChoix(j);
		grille[xChoix][yChoix] = lChoix[j];
		localStorage.setItem(lsGrille+xChoix+vide+yChoix, lChoix[j]);
		auteur[xChoix][yChoix] = j;
		localStorage.setItem(lsAuteur+xChoix+vide+yChoix, j);
		afficheCase();
		compte[j][ligne] = compteMots(filtreHV(horizontal, yChoix));
		compte[j][colonne] = compteMots(filtreHV(vertical, xChoix));
		compte[j][totallc] = Math.min(compte[j][ligne], compte[j][colonne]);
		if (compte[j][totallc] > 0)
			compte[j][totallc] += Math.max(compte[j][ligne], compte[j][colonne]) / 100000;
		enregistreCompte(j);
		afficheCompte(compte[j][ligne], horizontal, j, yChoix);
		afficheCompte(compte[j][colonne], vertical, j, xChoix);
		afficheCompte(compte[j][totallc], totalhv, j);
		if ((j==joueurServeur())&&(solitaire || (compte[j][totallc]==compte[meilleur][totallc]))) { // Si le serveur trouve un top ou on est en mode solitaire...
			lChoix[3-j] = espace;
			enregistreChoix(3-j);
			compte[3-j][ligne] = 0;
			compte[3-j][colonne] = 0;
			compte[3-j][totallc] = 0;
			enregistreCompte(3-j);
			tour++; // on passe le tour de l'autre joueur qui ne peut rien faire
			localStorage.tour = tour;
			afficheTour();
		}
		if (!((tour+1)%3)) { // Verdict du choix des joueurs
			attenteReponse = true;
			var js = joueurServeur();
			var vq = personne;
			if (compte[3-js][totallc]>compte[js][totallc]) {
				// 1. Le serveur a été battu
				vq = 3-js;
				if (compte[meilleur][totallc]>compte[3-js][totallc]) {
					grille[xChoix][yChoix] = lettresTop[Math.floor(lettresTop.length * Math.random())];
					localStorage.setItem(lsGrille+xChoix+vide+yChoix, grille[xChoix][yChoix]);
					auteur[xChoix][yChoix] = poseTop;
					localStorage.setItem(lsAuteur+xChoix+vide+yChoix, poseTop);
				}
				else {
					grille[xChoix][yChoix] = lChoix[3-js];
					localStorage.setItem(lsGrille+xChoix+vide+yChoix, lChoix[3-js]);
					auteur[xChoix][yChoix] = 3-js;
					localStorage.setItem(lsAuteur+xChoix+vide+yChoix, 3-js);
				}
				afficheCase();
				score[3-js]++;
				enregistreScore(3-js);
			}
			else {
				if (compte[js][totallc]) {
					// 2. Le serveur l'emporte (total >= et total non nul)
					vq = js;
					if (compte[meilleur][totallc]>compte[js][totallc]) {
						grille[xChoix][yChoix] = lettresTop[Math.floor(lettresTop.length * Math.random())];
						localStorage.setItem(lsGrille+xChoix+vide+yChoix, grille[xChoix][yChoix]);
						auteur[xChoix][yChoix] = poseTop;
						localStorage.setItem(lsAuteur+xChoix+vide+yChoix, poseTop);
					}
					else {
						grille[xChoix][yChoix] = lChoix[js];
						localStorage.setItem(lsGrille+xChoix+vide+yChoix, lChoix[js]);
						auteur[xChoix][yChoix] = js;
						localStorage.setItem(lsAuteur+xChoix+vide+yChoix, js);
					}
					score[js]++;
					enregistreScore(js);
				}
				else {
					vq = personne;
					grille[xChoix][yChoix] = lettresTop[Math.floor(lettresTop.length * Math.random())];
					localStorage.setItem(lsGrille+xChoix+vide+yChoix, grille[xChoix][yChoix]);
					auteur[xChoix][yChoix] = poseTop;
					localStorage.setItem(lsAuteur+xChoix+vide+yChoix, poseTop);
				}
				afficheCase();
			}
			if (compte[meilleur][totallc]==compte[vq][totallc]) {
				score[vq]++;
				enregistreScore(vq);
			}
			afficheScore();
			if (solitaire)
				if (vq == personne)
					afficheMessage(1, 'VOUS NE REMPORTEZ AUCUN POINT !');
				else 
					afficheMessage(1, '   VOUS REMPORTEZ LE POINT !   ');
			else
				if (vq == personne) 
					afficheMessage(1, 'PERSONNE NE REMPORTE LE POINT !');
				else 
					afficheMessage(1, ((vq==1)?' ':'')+'   '+idJoueur[vq]+couleurJoueur[vq]+idJoueur[vq]+' REMPORTE LE POINT !   '+((vq==1)?' ':''));
			var plusieurs = (lettresTop.length>1);
			if ((vq>personne) && (compte[meilleur][totallc]==compte[vq][totallc])) 
				afficheMessage(2, 'UN TOP A ETE TROUVE (BONUS +1)…');
			else
				if (lettresTop.length>1)
					afficheMessage(2, '   \''+lettresTop+'\' AVAIENT UN TOTAL DE…   ');
				else
					afficheMessage(2, '     \''+lettresTop+'\' AVAIT UN TOTAL DE…    ');
			var msgScore = Math.floor(compte[meilleur][totallc])+' (LIGNE='+compte[meilleur][ligne]+' COLONNE='+compte[meilleur][colonne]+').';
			var l = tailleMaxMsg-msgScore.length;
			for(var i=0; i<l; i++)
				if (i % 2>0)
					msgScore = espace + msgScore
				else
					msgScore = msgScore + espace;
			afficheMessage(3, msgScore);
			afficheMessage(4);
			afficheMessage(5, '      [ POURSUIVRE LA PARTIE ]     ', choixCaseOuLettre);
			tourSuivant();
		}
		else 
			joueTourSuivant();
	}
}
//---------------------------------------------------------------------------
function existeCasesLibres()
{
	var OK=false;
	for(var i=0; (!OK)&&(i<tailleMaxMot); i++)
		for(var j=0; (!OK)&&(j<tailleMaxMot); j++)
			OK = (grille[i][j] == joker);
	return OK;
}
//---------------------------------------------------------------------------
function joueTourSuivant()
{
	majSablier(true);
	setTimeout(function() {
		attenteReponse = false;
		tourSuivant();
		choisitCaseOuLettre();
		majSablier(false);
	}, 500);
}
//---------------------------------------------------------------------------
function afficheAttente()
{
	afficheMessage(1);
	afficheMessage(2, '   EVALUATION DE VOTRE CHOIX…   ');
	afficheMessage(3, '      MERCI DE PATIENTER…       ');
	afficheMessage(4);
	afficheMessage(5);
}
//---------------------------------------------------------------------------
function clic(numClic)
{
	// Choix case
	if ((!attenteReponse)&&(numClic >= 0)&&(numClic <= 77)) {
		majSablier(true);
		afficheAttente();
		setTimeout(function() {
			evalueChoixCase(numClic);
			majSablier(false);
			}, 500);
	}
	// Choix lettre
	else if ((numClic >= 100)&&(numClic <= 125)) {
		majSablier(true);
		afficheAttente();
		setTimeout(function() {
			evalueChoixLettre(numClic);
			majSablier(false);
			}, 500);
	}
	else switch(numClic) {
		case accueil: 
					attenteReponse = true;
					solitaire = false; // par défaut
					afficheMessage(1, '    BIENVENUE A CRUCIVERMOT.    ');
					afficheMessage(2, '      FAITES VOTRE CHOIX :      ');
					if (partieEnregistree()) {
						afficheMessage(3, '   [ A PROPOS ] [ STATS ] [ REGLE ]   ', aPropos);
						afficheMessage(4, ' [ CONTINUER LA PARTIE EN COURS ]   ', reprisePartie);
					}
					else {
						afficheMessage(3);
						afficheMessage(4, '   [ A PROPOS ] [ STATS ] [ REGLE ]   ', aPropos);
					}
					afficheMessage(5, '[ SOLITAIRE ] [ PARTIE A 2 JOUEURS ]', nvPartieSolitaire);
					break;
		case aPropos:
					attenteReponse = true;
					// v1.1 : on compte les mots du dico !
					var n=0;
					for(var i=0; i<dico.length; i++)
						n+=dico[i].length;
					afficheMessage(1, '    CRUCIVERMOT VERSION '+stVersion+'     ');
					afficheMessage(2, '             WEBAPP             ');
					afficheMessage(3, ' DEVELOPPEE PAR PATRICE FOUQUET ');
					afficheMessage(4, 'DICTIONNAIRE: '+n+' MOTS (ODS'+stVerDico+')'); // v1.1 : on affiche le nombre de mots qu'on a comptés
					afficheMessage(5, '        [ RETOUR AU MENU ]        ', accueil);
					break;
		case regleDuJeu:
				    switch(indexRDJ) {
						case 0: afficheMessage(1, 'CRUCIVERMOT SE JOUE SEUL OU A 2.');
								afficheMessage(2, 'LE BUT EST DE POSER DES LETTRES ');
								afficheMessage(3, 'CHACUN SON TOUR AFIN DE POUVOIR ');
								afficheMessage(4, 'PLACER LE PLUS DE MOTS POSSIBLE.');
								afficheMessage(5, '        [ SUITE » ] [ OK ]          ', regleDuJeu);
								break;
						case 1:	afficheMessage(1, 'APRES AVOIR POSE UNE LETTRE, ON ');
								afficheMessage(2, ' COMPTE LES MOTS QUE L\'ON PEUT  ');
								afficheMessage(3, '   PLACER DE PART ET D\'AUTRE,   ');
								afficheMessage(4, 'HORIZONTALEMENT, VERTICALEMENT. ');
								afficheMessage(5, '        [ SUITE » ] [ OK ]          ', regleDuJeu);
								break;
						case 2:	afficheMessage(1, 'LE JOUEUR EMPORTE UN POINT S\'IL ');
								afficheMessage(2, 'A LE MEILLEUR MINIMUM DES DEUX  ');
								afficheMessage(3, 'NOMBRES, EN CAS D\'EGALITE C\'EST  ');
								afficheMessage(4, 'C\'EST LE MAXIMUM QUI DEPARTAGE… ');
								afficheMessage(5, '         [ SUITE » ] [ OK ]          ', regleDuJeu);
								break;
						case 3:	afficheMessage(1, 'SI LE VAINQUEUR TROUVE LE TOP IL');
								afficheMessage(2, 'REMPORTE 1 POINT SUPPLEMENTAIRE.');
								afficheMessage(3, 'EXEMPLE: ORANGE=21(H)+20(V)MOTS ');
								afficheMessage(4, 'VERT=15(H)+27(V)MOTS, TOP=20/21.');
								afficheMessage(5, 'ORANGE A DONC 2 POINTS.[ » ] [ OK ] ', regleDuJeu);
								break;
						case 4:	afficheMessage(1, 'A TOUR DE ROLE, CHAQUE JOUEUR   ');
								afficheMessage(2, 'CHOISIT UNE CASE PUIS PLACE UNE ');
								afficheMessage(3, 'LETTRE AU CHOIX. SI LE CHOIX   ');
								afficheMessage(4, 'NE PERMET PAS DE PLACER DE MOT, ');
								afficheMessage(5, 'ON POSE UNE CASE NOIRE. [ » ] [ OK ] ', regleDuJeu);
								break;
						case 5: afficheMessage(1, 'LA POSE D\'UNE CASE NOIRE PEUT  ');
								afficheMessage(2, 'FAIRE PERDRE/GAGNER DE -12 A 4  ');
								afficheMessage(3, 'POINTS SELON LA POSSIBILITE DE  ');
								afficheMessage(4, 'FORMER OU NON DES MOTS DE PART  ');
								afficheMessage(5, 'ET D\'AUTRE DE LA CASE. [ » ] [ OK ] ', regleDuJeu);
								break;
						case 6: afficheMessage(1, 'CHAQUE TOUR ON REMPLIT UNE CASE ');
								afficheMessage(2, 'AVEC LA LETTRE TOP OU UNE CASE  ')
								afficheMessage(3, '  NOIRE JUSQU\'A TOUT REMPLIR…   ');
								afficheMessage(4, ' IL Y A DONC 56 TOURS. [ » ] [ OK ] ', regleDuJeu);
								afficheMessage(5);
								break;
						case 7: afficheMessage(1, ' EN MODE SOLITAIRE, VOUS JOUEZ  ');
								afficheMessage(2, 'TANT QU\'ON PEUT POSER AU MOINS ')
								afficheMessage(3, ' UN MOT PARTOUT DANS LA GRILLE. ');
								afficheMessage(4, 'FINIR LA GRILLE DOUBLE LE SCORE.');
								afficheMessage(5, '        [ RETOUR AU MENU ]        ', accueil);
								break;
						default:indexRDJ = indefini;
								clic(accueil);
								break;						
					}
					indexRDJ++;
					break;
		case okRDJ:	indexRDJ = 0;
					clic(accueil);
					break;
		case stats:	if (!nbSolitaires) {
						afficheMessage(1);
						afficheMessage(2, '      PAS DE STATISTIQUES       ');
						afficheMessage(3, '        POUR L\'INSTANT.         ');
						afficheMessage(4);
					}
					else {
						afficheMessage(1, '    STATISTIQUES SOLITAIRE :    ');
						var msgStats = 'SUR '+nbSolitaires+' SOLITAIRE'+(nbSolitaires>1?pluriel:vide)+' JOUE'+(nbSolitaires>1?pluriel:vide)+'…';
						var l = tailleMaxMsg-msgStats.length;
						for(var i=0; i<l; i++)
							if (i % 2>0)
								msgStats = espace + msgStats
							else
								msgStats = msgStats + espace;
						afficheMessage(2, msgStats);
						msgStats = solitairesFinis+' FINI'+(solitairesFinis>1?pluriel:vide)+' ET TOP DE '+topSolitaire+'.';
						l = tailleMaxMsg-msgStats.length;
						for(var i=0; i<l; i++)
							if (i % 2>0)
								msgStats = espace + msgStats
							else
								msgStats = msgStats + espace;
						afficheMessage(3, msgStats);
						afficheMessage(4);
					}
					afficheMessage(5, '        [ RETOUR AU MENU ]        ', accueil);
					break;
		case choixCaseOuLettre:
					majSablier(true);
					setTimeout(function() {
						attenteReponse = false;
						afficheTour();
						choisitCaseOuLettre();
						majSablier(false);
					}, 500);
					break;
		case reprisePartie:
					majSablier(true);
					setTimeout(function() {
						attenteReponse = false;
						chargePartie();
						choisitCaseOuLettre();
						majSablier(false);
					}, 500);
					break;
		case nvPartieSolitaire:
					solitaire = true;
		case nvPartieADeux:
					afficheMessage(1, '   MERCI DE PATIENTER PENDANT   ');
					afficheMessage(2, '   LA CREATION DE LA GRILLE…    ')
					afficheMessage(3, ' LE SYMBOLE s APPARAIT A DROITE ');
					afficheMessage(4, ' QUAND IL FAUT PATIENTER… MERCI ');
					afficheMessage(5, '   DE NE PAS TOUCHER L\'ECRAN.   ');
					majSablier(true);
					setTimeout(function() {
						attenteReponse = false;
						initialisePartie();
						tourSuivant();
						choisitCaseOuLettre();
						majSablier(false);
					}, 500);
					break;
		default:	break;
	}
}
//---------------------------------------------------------------------------
function adapteDimensions()
{/*
	var largeurEcran = document.getElementById('container').offsetWidth; 
	var n=document.images.length;
	var coef=largeurEcran/640;
	var hauteur=0;
	var largeur=0;
	for(var i=0; i<n; i++) {
		hauteur=parseInt(document.images[i].height);
		largeur=parseInt(document.images[i].width);
		document.images[i].height=Math.round(coef*hauteur);
		document.images[i].width=Math.round(coef*largeur);
	}
    delete adapteDimensions;
*/}
//---------------------------------------------------------------------------
function partieEnregistree()
{
	// On en profite pour charger les stats de solitaires
	chargeStatsSolitaire();
	return !!localStorage.getItem(lsPartieSauvee);
}
//---------------------------------------------------------------------------
function initialisePartie()
{
	tour = indefini;
	xChoix = indefini;
	yChoix = indefini;
	
	for(var j=0; j<3; j++)
		score[j] = 0;
	
	initialiseGrille();

	for(var i=0; i<3; i++)
		for(var j=0; j<3; j++)
			compte[i][j] = 0;

	lChoix[0] = espace;
	lChoix[1] = espace;
	lChoix[2] = espace;
	
	lettresTop = vide;

	effaceCompte();
}
//---------------------------------------------------------------------------
function chargePartie()
{
	// On suppose ici que localStorage.getItem(lsPartieSauvee) est vrai
	tour = parseInt(localStorage.tour);
	xChoix = parseInt(localStorage.xChoix);
	yChoix = parseInt(localStorage.yChoix);

	score[0] = parseInt(localStorage.s0);
	score[1] = parseInt(localStorage.s1);
	score[2] = parseInt(localStorage.s2);

	chargeGrille();
	
	for(var i=0; i<3; i++) {
		compte[i][totallc] = parseFloat(localStorage.getItem(lsCompte+i+vide+totallc)); // Il y a une partie décimale
		for(var j=1; j<3; j++)
			compte[i][j] = parseInt(localStorage.getItem(lsCompte+i+vide+j));
	}

	lChoix[1] = localStorage.lChoix1;
	lChoix[2] = localStorage.lChoix2;
	
	lettresTop = localStorage.lettresTop;
	solitaire = (localStorage.solitaire == vrai);

	afficheGrille();
	effaceCompte();
	if (joueurCourant()!=joueurServeur()) { // On affiche les comptes du premier joueur si le joueur courant n'est pas le serveur (celui qui a choisi la case)
		j = 3 - joueurCourant();
		afficheCompte(compte[j][ligne], horizontal, j, yChoix);
		afficheCompte(compte[j][colonne], vertical, j, xChoix);
		afficheCompte(compte[j][totallc], totalhv, j);
	}
	afficheScore();
	afficheTour();
}
//---------------------------------------------------------------------------
function enregistrePartie()
{
	localStorage.setItem(lsPartieSauvee, true); // Active la sauvegarde au démarrage de l'app.

	localStorage.tour = tour;
	localStorage.xChoix = xChoix;
	localStorage.yChoix = yChoix;

	localStorage.s0 = score[0];
	localStorage.s1 = score[1];
	localStorage.s2 = score[2];

	enregistreGrille();
	
	enregistreCompte();

	localStorage.lChoix1 = lChoix[1];
	localStorage.lChoix2 = lChoix[2];
	
	localStorage.lettresTop = lettresTop;
	localStorage.solitaire = solitaire;
}
//---------------------------------------------------------------------------
function bienvenue()
{
	clic(accueil);
}
//---------------------------------------------------------------------------
