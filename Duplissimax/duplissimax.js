 /*
  
  Fichier : Duplissimax.js
  Sujet : JavaScript principal pour index.html
  
  Version : <1.0>
  
  Copyright (C) 2013 Patrice Fouquet. Tous droits réservés.
 
 */ 

// ==========
// CONSTANTES
// ==========


const stVersion = '1.0'; 

// Police graphique : NoteWorthy Bold uniquement

// Divers

const vide = '';
const indefini = -1;

// HTML

const typeCoulMsg = new creeTypeCoulMsg();

const pngExt		= '.png';
const pngChm		= 'png/'; 
const pngFnd		= 'c00';
const pngBtn		= 'b00';
const pngJtn		= 'joker';
const pngInv		= 'selection';

const pngBns		= ['b0','ld','lt','md','mt'];

const prfxTxtMsgId	= 'tm';
const prfxFndMsgId	= 'tmf';

const prfxBonusId	= 'b';

const minCharCode = 64;
const nbCarMax = 76; // Nombre maximal de caractères sur une ligne de la zone de message

const sfxCoulMsg = ['b','n'];


// --
// IA
// --

const nbCasesCote = 15;

const typeBonus = new creeTypeBonus();

const typeCfgBonus = new creeTypeCfgBonus();

// Configuration du 1/8 du plateau supérieur droit (entre 12h et 13h30)
const cfgBonusPredef = [[[0,0,0,0,0,0,0,0], // Aléatoire (à remplir)
						 [0,0,0,0,0,0,0],
						 [0,0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0],
						 [0,0,0],
						 [0,0],
						 [3]],
                        [[4,0,0,0,1,0,0,4], // Scrabble
						 [0,0,2,0,0,0,3],
						 [0,1,0,0,0,3],
						 [1,0,0,0,3],
						 [0,0,0,3],
						 [0,0,2],
						 [0,1],
						 [3]],
					    [[0,0,0,2,0,4,0,0], // Angry Words
					     [0,0,3,0,0,0,2],
					     [0,2,0,0,0,1],
					     [3,0,0,0,2],
					     [0,1,0,0],
					     [0,0,2],
					     [0,0],
					     [3]]];

// =========
// VARIABLES
// =========

var cfgBonus = typeCfgBonus.cbAleatoire; // Test affichage bonus prédéfinis

var nbBonusAleatoires = [0,24,12,16,8]; // Nombre de bonus à distribuer aléatoirement (par défaut)

var cfgBonusAleatoire = [[0,0,0,0,0,0,0,0], // Aléatoire (à remplir)
						 [0,0,0,0,0,0,0],
						 [0,0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0],
						 [0,0,0],
						 [0,0],
						 [3]];

var c = [[new creeTypeCase(0,0), new creeTypeCase(0,1), new creeTypeCase(0,2), new creeTypeCase(0,3), new creeTypeCase(0,4), new creeTypeCase(0,5), new creeTypeCase(0,6), new creeTypeCase(0,7), new creeTypeCase(0,8), new creeTypeCase(0,9), new creeTypeCase(0,10), new creeTypeCase(0,11), new creeTypeCase(0,12), new creeTypeCase(0,13), new creeTypeCase(0,14)],
 		 [new creeTypeCase(1,0), new creeTypeCase(1,1), new creeTypeCase(1,2), new creeTypeCase(1,3), new creeTypeCase(1,4), new creeTypeCase(1,5), new creeTypeCase(1,6), new creeTypeCase(1,7), new creeTypeCase(1,8), new creeTypeCase(1,9), new creeTypeCase(1,10), new creeTypeCase(1,11), new creeTypeCase(1,12), new creeTypeCase(1,13), new creeTypeCase(1,14)],
 		 [new creeTypeCase(2,0), new creeTypeCase(2,1), new creeTypeCase(2,2), new creeTypeCase(2,3), new creeTypeCase(2,4), new creeTypeCase(2,5), new creeTypeCase(2,6), new creeTypeCase(2,7), new creeTypeCase(2,8), new creeTypeCase(2,9), new creeTypeCase(2,10), new creeTypeCase(2,11), new creeTypeCase(2,12), new creeTypeCase(2,13), new creeTypeCase(2,14)],
 		 [new creeTypeCase(3,0), new creeTypeCase(3,1), new creeTypeCase(3,2), new creeTypeCase(3,3), new creeTypeCase(3,4), new creeTypeCase(3,5), new creeTypeCase(3,6), new creeTypeCase(3,7), new creeTypeCase(3,8), new creeTypeCase(3,9), new creeTypeCase(3,10), new creeTypeCase(3,11), new creeTypeCase(3,12), new creeTypeCase(3,13), new creeTypeCase(3,14)],
 		 [new creeTypeCase(4,0), new creeTypeCase(4,1), new creeTypeCase(4,2), new creeTypeCase(4,3), new creeTypeCase(4,4), new creeTypeCase(4,5), new creeTypeCase(4,6), new creeTypeCase(4,7), new creeTypeCase(4,8), new creeTypeCase(4,9), new creeTypeCase(4,10), new creeTypeCase(4,11), new creeTypeCase(4,12), new creeTypeCase(4,13), new creeTypeCase(4,14)],
 		 [new creeTypeCase(5,0), new creeTypeCase(5,1), new creeTypeCase(5,2), new creeTypeCase(5,3), new creeTypeCase(5,4), new creeTypeCase(5,5), new creeTypeCase(5,6), new creeTypeCase(5,7), new creeTypeCase(5,8), new creeTypeCase(5,9), new creeTypeCase(5,10), new creeTypeCase(5,11), new creeTypeCase(5,12), new creeTypeCase(5,13), new creeTypeCase(5,14)],
 		 [new creeTypeCase(6,0), new creeTypeCase(6,1), new creeTypeCase(6,2), new creeTypeCase(6,3), new creeTypeCase(6,4), new creeTypeCase(6,5), new creeTypeCase(6,6), new creeTypeCase(6,7), new creeTypeCase(6,8), new creeTypeCase(6,9), new creeTypeCase(6,10), new creeTypeCase(6,11), new creeTypeCase(6,12), new creeTypeCase(6,13), new creeTypeCase(6,14)],
 		 [new creeTypeCase(7,0), new creeTypeCase(7,1), new creeTypeCase(7,2), new creeTypeCase(7,3), new creeTypeCase(7,4), new creeTypeCase(7,5), new creeTypeCase(7,6), new creeTypeCase(7,7), new creeTypeCase(7,8), new creeTypeCase(7,9), new creeTypeCase(7,10), new creeTypeCase(7,11), new creeTypeCase(7,12), new creeTypeCase(7,13), new creeTypeCase(7,14)],
 		 [new creeTypeCase(8,0), new creeTypeCase(8,1), new creeTypeCase(8,2), new creeTypeCase(8,3), new creeTypeCase(8,4), new creeTypeCase(8,5), new creeTypeCase(8,6), new creeTypeCase(8,7), new creeTypeCase(8,8), new creeTypeCase(8,9), new creeTypeCase(8,10), new creeTypeCase(8,11), new creeTypeCase(8,12), new creeTypeCase(8,13), new creeTypeCase(8,14)],
 		 [new creeTypeCase(9,0), new creeTypeCase(9,1), new creeTypeCase(9,2), new creeTypeCase(9,3), new creeTypeCase(9,4), new creeTypeCase(9,5), new creeTypeCase(9,6), new creeTypeCase(9,7), new creeTypeCase(9,8), new creeTypeCase(9,9), new creeTypeCase(9,10), new creeTypeCase(9,11), new creeTypeCase(9,12), new creeTypeCase(9,13), new creeTypeCase(9,14)],
 		 [new creeTypeCase(10,0), new creeTypeCase(10,1), new creeTypeCase(10,2), new creeTypeCase(10,3), new creeTypeCase(10,4), new creeTypeCase(10,5), new creeTypeCase(10,6), new creeTypeCase(10,7), new creeTypeCase(10,8), new creeTypeCase(10,9), new creeTypeCase(10,10), new creeTypeCase(10,11), new creeTypeCase(10,12), new creeTypeCase(10,13), new creeTypeCase(10,14)],
 		 [new creeTypeCase(11,0), new creeTypeCase(11,1), new creeTypeCase(11,2), new creeTypeCase(11,3), new creeTypeCase(11,4), new creeTypeCase(11,5), new creeTypeCase(11,6), new creeTypeCase(11,7), new creeTypeCase(11,8), new creeTypeCase(11,9), new creeTypeCase(11,10), new creeTypeCase(11,11), new creeTypeCase(11,12), new creeTypeCase(11,13), new creeTypeCase(11,14)],
 		 [new creeTypeCase(12,0), new creeTypeCase(12,1), new creeTypeCase(12,2), new creeTypeCase(12,3), new creeTypeCase(12,4), new creeTypeCase(12,5), new creeTypeCase(12,6), new creeTypeCase(12,7), new creeTypeCase(12,8), new creeTypeCase(12,9), new creeTypeCase(12,10), new creeTypeCase(12,11), new creeTypeCase(12,12), new creeTypeCase(12,13), new creeTypeCase(12,14)],
 		 [new creeTypeCase(13,0), new creeTypeCase(13,1), new creeTypeCase(13,2), new creeTypeCase(13,3), new creeTypeCase(13,4), new creeTypeCase(13,5), new creeTypeCase(13,6), new creeTypeCase(13,7), new creeTypeCase(13,8), new creeTypeCase(13,9), new creeTypeCase(13,10), new creeTypeCase(13,11), new creeTypeCase(13,12), new creeTypeCase(13,13), new creeTypeCase(13,14)],
 		 [new creeTypeCase(14,0), new creeTypeCase(14,1), new creeTypeCase(14,2), new creeTypeCase(14,3), new creeTypeCase(14,4), new creeTypeCase(14,5), new creeTypeCase(14,6), new creeTypeCase(14,7), new creeTypeCase(14,8), new creeTypeCase(14,9), new creeTypeCase(14,10), new creeTypeCase(14,11), new creeTypeCase(14,12), new creeTypeCase(14,13), new creeTypeCase(14,14)],
		];  

// ========
// METHODES
// ========

// -------------
// Constructeurs
// -------------

function creeTypeBonus()
{
	this.bAucun			= 0;
	this.bLettreDouble	= 1;
	this.bLettreTriple	= 2;
	this.bMotDouble		= 3;
	this.bMotTriple		= 4;
}

function creeTypeCfgBonus()
{
	this.cbAleatoire	= indefini;
	this.cbSansBonus	= 0;
	this.cbScrabble		= 1;
	this.cbAngryWords	= 2;
}

function creeTypeCoulMsg()
{
	this.cmBlanc = 0;
	this.cmNoir  = 1;
}

function creeTypeCase(x, y)
{
	this.x = x;
	this.y = y;
	this.bonus = typeBonus.bAucun;
	this.l = vide;
}

// ----------------
// Autres fonctions
// ----------------

// Changement des bonus

function majBonusPlateau()
{
	var cbp = ((cfgBonus==typeCfgBonus.cbAleatoire)?cfgBonusAleatoire:cfgBonusPredef[cfgBonus]);
	for(var l=0; l<8; l++)
		for(var c=0; c<8-l; c++) {
			document.images[prfxBonusId + String.fromCharCode(minCharCode + l + 1) + String.fromCharCode(minCharCode + c + 8)].src = pngChm + pngBns[cbp[l][c]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode + l + 1) + String.fromCharCode(minCharCode - c + 8)].src = pngChm + pngBns[cbp[l][c]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode - l + 15) + String.fromCharCode(minCharCode + c + 8)].src = pngChm + pngBns[cbp[l][c]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode - l + 15) + String.fromCharCode(minCharCode - c + 8)].src = pngChm + pngBns[cbp[l][c]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode + l + 8) + String.fromCharCode(minCharCode - c + 15)].src = pngChm + pngBns[cbp[c][l]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode - l + 8) + String.fromCharCode(minCharCode - c + 15)].src = pngChm + pngBns[cbp[c][l]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode + l + 8) + String.fromCharCode(minCharCode + c + 1)].src = pngChm + pngBns[cbp[c][l]] + pngExt;
			document.images[prfxBonusId + String.fromCharCode(minCharCode - l + 8) + String.fromCharCode(minCharCode + c + 1)].src = pngChm + pngBns[cbp[c][l]] + pngExt;
		}
}

// Distribution aléatoire des bonus

function existeBonusVoisins(l, c)
{
	if (l&&cfgBonusAleatoire[l-1][c]) return true;
	if (c&&cfgBonusAleatoire[l][c-1]) return true;
	if ((l<7)&&cfgBonusAleatoire[l+1][c]) return true;
	if ((c<7-l)&&cfgBonusAleatoire[l][c+1]) return true;
	return false;	 
}

function nombreBonusADecrementer(l, c)
{
	return (((!l)||(c == 7-l))?4:8);
}

function defBonusAleatoire()
{
	var nb = [nbBonusAleatoires[0], nbBonusAleatoires[1], nbBonusAleatoires[2], nbBonusAleatoires[3], nbBonusAleatoires[4]]; 
	var b = indefini;
	for(var l=0; l<7; l++)
		for(var c=0; c<8-l; c++)
			cfgBonusAleatoire[l][c] = 0;
	var compteur = 0;
	do {
		// 1. On choisit un bonus
		do {
			b = 1 + Math.floor(4*Math.random());		
		} while(!nb[b]);
		// 2. On choisit des coordonnées
		var c = indefini;
		var l = indefini;
		var ko = true;
		compteur = 0;
		do {
			l = Math.floor(7*Math.random());
			c = Math.floor((8-l)*Math.random());
			// Conditions : bonus non encore défini en (l,c) + pas de voisins définis (sauf en diagonale) + nombre de bonus à définir suffisant + pas de bonus de mot sur la première colonne sauf première ligne
			ko = (cfgBonusAleatoire[l][c]>0) || existeBonusVoisins(l, c) || (nb[b]<nombreBonusADecrementer(l, c)) || ((b>2) && (!c) && l);
			if (!ko) {
				cfgBonusAleatoire[l][c] = b;
				nb[b] -= nombreBonusADecrementer(l, c);
			}
			compteur++;
		} while((compteur<100)&&ko); // Si blocage (compteur>99) alors on réessaie depuis le début
	} while((compteur<100)&&(nb[1]||nb[2]||nb[3]||nb[4])); // Si blocage (compteur>99) alors on réessaie depuis le début
	return compteur<100;
}

// Affichage des messages

function afficheCaractere(x, y, c, cm, f) // x et y commencent à 1. cm = typeCoulMsg.cmBlanc/Noir (blanc par défaut). f = image de fond sans le png (pngFnd par défaut). 
{
	var img = c;
	var fnd = pngFnd;
	if ((f != undefined) && (f != vide))
		fnd = f;
	if (cm == undefined)
		cm = 0;
	switch(c) {
		case '[': // début de fond gris pour les boutons
		case ']': // début de fond gris pour les boutons
		case 's': // fond de bonus (sable = MD)
		case 'c': // fond de bonus (ciel = LD)
		case 'm': // fond de bonus (mauve = MT)
		case 'v': // fond de bonus (violet = LT)
		case 'g': // fond de bonus (gris = sans bonus)
		case 'j': // fond de tirage (jaune = tirage lettre)
		case 'i': // fond de tirage (inverse = tirage sélectionné)
		case vide:
		case undefined:
		case ' ':	img = 'espace'; break;
		case '\'':  img = 'apostrophe'; break;
		case '*':	img = 'asterisque'; break;
		case ':':	img = 'deuxpoints'; break;
		case '!':	img = 'exclamation'; break;
		case '?':	img = 'interrogation'; break;
		case '°':	img = 'numero'; break;
		case '(':	img = 'parentheseg'; break;
		case ')':	img = 'parenthesed'; break;
		case '+':	img = 'plus'; break;
		case '%':	img = 'pourcent'; break;
		case '/': 	img = 'slash'; break;
		case '-':	img = 'tiret'; break;
		case ',': 	img = 'virgule'; break;
		case '.': 	img = 'point'; break;
		case '>':	img = 'horizontalement'; break;
		case '^':	img = 'verticalement'; break;
		case 'o':	img = 'carreau'; break;
	}
	img = pngChm + img + sfxCoulMsg[cm] + pngExt;
	fnd = pngChm + fnd + pngExt;
	var sfxId = String.fromCharCode(minCharCode+y) + (x<10?'0':vide) + x;
	document.images[prfxFndMsgId + sfxId].src = fnd;
	document.images[prfxTxtMsgId + sfxId].src = img;
}

function afficheMessage(msg, ligne) // ligne commence à 1 (par défaut).
{
	var d = 0; // Décalage dû au fond de bonus
	var f = pngFnd;
	var cm = typeCoulMsg.cmBlanc;
	if (ligne == undefined)
		ligne = 1;
	for(var i=0; i<msg.length; i++) {
		// Préparation début fond
		switch(msg[i+d]) {
			case '[':	f = pngBtn;
						cm = typeCoulMsg.cmNoir;
						break;
			case 'c':	if (f == pngFnd) { // c comme ciel
							f = pngBns[typeBonus.bLettreDouble];
							cm = typeCoulMsg.cmNoir;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 's':	if (f == pngFnd) { // s comme sable
							f = pngBns[typeBonus.bMotDouble];
							cm = typeCoulMsg.cmNoir;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 'v':	if (f == pngFnd) { // v comme violet
							f = pngBns[typeBonus.bLettreTriple];
							cm = typeCoulMsg.cmNoir;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 'm':	if (f == pngFnd) { // m comme mauve
							f = pngBns[typeBonus.bMotTriple];
							cm = typeCoulMsg.cmNoir;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 'g':	if (f == pngFnd) { // g comme gris
							f = pngBns[typeBonus.bAucun];
							cm = typeCoulMsg.cmBlanc;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 'j':	if (f == pngFnd) { // j comme jaune/jeton/joker
							f = pngJtn;
							cm = typeCoulMsg.cmNoir;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			case 'i':	if (f == pngFnd) { // i comme inverse jaune
							f = pngInv;
							cm = typeCoulMsg.cmBlanc;
						}
						else {
							f = pngFnd;
							cm = typeCoulMsg.cmBlanc;
						}
						d++;
						break;
			default:	break;
		}
		
		afficheCaractere(i%nbCarMax + 1, Math.floor(i/nbCarMax) + ligne, msg[i+d], cm, f);
		
		// Préparation fin fond
		switch(msg[i+d]) {
			case ']':	f = pngFnd;
						cm = typeCoulMsg.cmBlanc;
						break;
			default:	break;
		}
	}
}

function bienvenue()
{
	if (cfgBonus == typeCfgBonus.cbAleatoire)
		while(!defBonusAleatoire());
	majBonusPlateau();	
	afficheMessage('BIENVENUE A DUPLISSIMAX ! IL Y A ASSEZ DE PLACE POUR AFFICHER TOUT UN ROMAN.', 1);
	afficheMessage('JE PEUX METTRE DES CHIFFRES 0 1 2 3 4 5 6 7 8 9 ET MEME DES RANGS : 1° 2°...', 2);
	afficheMessage('IL Y A LA PONCTUATION, LES PARENTHESES (OUVRANTES ET FERMANTES) MAIS AUSSI :', 3);
	afficheMessage('ON PEUT METTRE DES BOUTONS [OK] [ANNULER] [>] [^] [o] AU MILIEU DU MESSAGE !', 4);
	afficheMessage('ON PEUT EGALEMENT METTRE UN FOND : cLDc vLTv sMDs mMTm gSBg jTIRAGEj iSELECTIONi.', 5);

	afficheMessage('BIENVENUE A DUPLISSIMAX ! IL Y A ASSEZ DE PLACE POUR AFFICHER TOUT UN ROMAN.', 7);
	afficheMessage('JE PEUX METTRE DES CHIFFRES 0 1 2 3 4 5 6 7 8 9 ET MEME DES RANGS : 1° 2°...', 8);
	afficheMessage('IL Y A LA PONCTUATION, LES PARENTHESES (OUVRANTES ET FERMANTES) MAIS AUSSI :', 9);
	afficheMessage('ON PEUT METTRE DES BOUTONS [OK] [ANNULER] [>] [^] [o] AU MILIEU DU MESSAGE !', 10);
	afficheMessage('ON PEUT EGALEMENT METTRE UN FOND : cLDc vLTv sMDs mMTm gSBg jTIRAGEj iSELECTIONi.', 11);



}