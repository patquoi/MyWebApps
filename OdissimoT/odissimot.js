 /*
  
  File:OdissimoT.js
  Abstract: main JavaScript for the index.html file
  
  Version: <2.2>
  
  Copyright (C) 2012 Patrice Fouquet. All Rights Reserved.
 
 */ 

/*
Version 2.2
 - Nouveau Dictionnaire ODS8
Version 2.1
 - Nouveau Dictionnaire ODS7
Version 2.0
 - Nouvel affichage
Version 1.2.1
 - Affichage d'un sablier à la place du bouton "page suivante" durant une recherche.
Version 1.2.3
 - Correction du lien vers 1mot.fr
Version 2.0
 - Lifting complet
Version 2.1
 - ODS7 
Version 2.1.1
 - Corrections dans le dictionnaire
*/

  /**************/
 /* CONSTANTES */
/**************/

const stVersion = '2.2'; 

// Police Noteworthy Bold

// Constantes d'environnement
const nbl 				 = 26; // Nombre de lignes de solutions comme nombre de lettres !
const nbc 				 = 32; // Nombre de colonnes de lettres de solutions
const nblMin 			 = 2;  // Nombre MIN de lettres
const nblMax 			 = 15; // Nombre MAX de lettres
const possibilites 		 = [1, 26, 351, 3276, 23751, 142506, 736281, 3365856, 13884156, 52451256, 183579396, 600805296, 1852482996, 5414950296, 15084504396, 40225345056]; // Nombre de possibilités de n-uples de jokers (de 0 à 15 jokers)
const charCodeMin   	 = 64;
                         		  // 2 lettres,                   3 lettres,             4 lettres,         5 lettres,    6 lettres,    7 lettres,   8 lettres, 9 lettres, 10 lettres, 11 l., 12 l.,
const colNblRang 		 = [[0],[0],[2,5,8,11,14,17,20,23,26,29],[1,5,9,13,17,21,25,29],[2,7,12,17,22,27], [4,11,18,25], [3,10,17,24], [2,10,18,26], [3,13,23], [2,12,22], [1,12,23], [4,18], [3,18], [3,18], [2,18], [1,17]];  

// chaînes diverses
const clavier 			 = ' atf>d    AZERTYUIOPQSDFGHJKLMiWXCVBN!ck'; // v1.2 : ajout du changement de dico (d=5)
const joker 			 = '?';

// Constantes HTML
const extPng 			 = '.png';
const chmPng 			 = 'png/';
const vide 				 = '--';
const demiVide 			 = '-'; 
const jkrPng 			 = '!';
const pfxIdSol 			 = 's'; 
const noir 				 = 'x'; // v2.1
const bleu				 = 'w'; // v2.1

// dictionnaires en ligne (v1.2)
const nbDicosDef		 = 5;
const nomDico			 = ['Centre National de Ressources Textuelles et Lexicales', 'Wiktionnaire', 'Larousse', 'Reverso', '1mot.fr'];
const pngDico            = ['dico-cnrtl', 'dico-wikti', 'dico-lar', 'dico-reverso', 'dico-1mot'];
const lnkDico			 = ['http://www.cnrtl.fr/definition/', 'http://fr.wiktionary.org/w/index.php?search=', 'http://www.larousse.fr/dictionnaires/francais/', 'http://dictionnaire.reverso.net/francais-definition/', 'http://1mot.fr/'];
const idPrmDico			 = 'rdc';
const pfxIdLnkDico		 = 'l'; // + n° de case <Lettre><Chiffre><Chiffre>
const extHTM			 = '.htm';

  /*************/
 /* VARIABLES */
/*************/

var idxDmd = 0;
var nbj = 0;
var nbs = 0;
var stDmd = ''; // Demande !
var stSol = ''; // Solutions !
var afficheTirages = true; // Affichage ou non des tirages dans les solutions de tirages avec jokers
var posCrtSol = 0; // prochaine position dans stSol pour l'affichage de la prochaine page
var page = 0;
var pages = 0;
var jk = ['A','A','A','A','A','A','A','A','A','A','A','A','A','A','A']; // Utilisé par chercheSolutionTirage()

// Dictionnaire de définition (v1.2)
var dicoDef = 0; // Par défaut = cnrtl. 
var affichagesChgtDico = 0; // Nombre d'affichages de changement de dico (limité au nombre de dicos). 
var imgSrcSvgSablier = '-'; // v1.2.1 : Sauvegarde ce qu'il y avait avant le sablier

  /*************/
 /* FONCTIONS */
/*************/

function incrementeJoker(i)
{
	if (jk[i]=='Z') {
		if (i)
			incrementeJoker(i-1);
	}
	else {
		jk[i]=String.fromCharCode(jk[i].charCodeAt(0)+1);
		for(var j=i+1; j<nbj; j++)
			jk[j]=jk[i];
	}
}

function chercheSolutionTirage()
{
	nbs = 0;
	stSol = '';
	var l = stDmd.length;
	// On initialise les jokers
	for(var i=0; i<nbj; i++) 
		jk[i]='A';
	for(var pj=0; pj<possibilites[nbj]; pj++) {
		// On définit les jokers
		if (pj) // on incrémente pas la première fois
			incrementeJoker(nbj-1);
		// On affecte les jokers
		var ij = 0;
		var stTirage = stDmd; // On recharge à chaque fois le tirage original
		for(var nj=0; nj<nbj; nj++) {
			for(;stTirage[ij]!=joker; ij++);
			stTirage=stTirage.substring(0,ij)+jk[nj]+stTirage.substring(ij+1,l);
		}
		// On trie le tirage
		var tirageTrie = [];
		for(var i=0; i<l; i++)
			tirageTrie[i]=stTirage[i];
		tirageTrie.sort();
		stTirage='';
		for(var i=0; i<l; i++)
			stTirage=stTirage+tirageTrie[i];
		var it = tirages[l-2].indexOf(stTirage);
		if (it>-1) {
			var na = anagrammes[l-2][it].length;
			nbs += na; 
			for(var a=0; a<na; a++) {
				if (stSol.length)
					stSol = stSol + ' ';
				var mj = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; 
				for(var i=0; i<l; i++) {
					var sfxCouleur=noir; // v2.1 (noir)
					if (delta[l-2].indexOf(dico[l-2][anagrammes[l-2][it][a]])>-1) sfxCouleur=bleu; // v2.1 : en bleu les nouveautés de l'ODS7
					for(var j=0; j<nbj; j++)
						if ((!mj[j])&&(dico[l-2][anagrammes[l-2][it][a]][i]==jk[j])) {
							sfxCouleur = ((a || (!afficheTirages))? 'y' : 'z');
							mj[j]=true;
							break;
						}
					stSol = stSol + dico[l-2][anagrammes[l-2][it][a]][i] + sfxCouleur;
				}
			}
		}  
	}
	page = 0;
	pages = Math.ceil(nbs/(colNblRang[stDmd.length].length*nbl));
	posCrtSol = 0;
}

function afficheNombre()
{
	var chiffre = nbs%10; 
	var reste = (nbs - chiffre)/10;
	document.images['ru'].src = chmPng + chiffre + extPng;
	chiffre = reste%10; reste = (reste - chiffre)/10;
	document.images['rd'].src = chmPng + chiffre + extPng;
	chiffre = reste%10; reste = (reste - chiffre)/10;
	document.images['rc'].src = chmPng + chiffre + extPng;
	chiffre = reste%10; reste = (reste - chiffre)/10;
	document.images['rm'].src = chmPng + chiffre + extPng;
	chiffre = reste%10; reste = (reste - chiffre)/10;
	document.images['rdm'].src = chmPng + chiffre + extPng;
}

function cacheNombre()
{
	// Nombre de solutions
	var nvSrc = chmPng + vide + extPng;
	document.images['ru'].src = nvSrc;
	document.images['rd'].src = nvSrc;
	document.images['rc'].src = nvSrc;
	document.images['rm'].src = nvSrc;
	document.images['rdm'].src = nvSrc;
	// Pages
	imgSrcSvgSablier = demiVide; // v1.2.1
	nvSrc = chmPng + imgSrcSvgSablier + extPng; // v1.2.1 (imgSrcSvgSablier)
	document.images['rpu'].src = nvSrc;
	document.images['rpd'].src = nvSrc;
	document.images['rpc'].src = nvSrc;
	document.images['rtu'].src = nvSrc;
	document.images['rtd'].src = nvSrc;
	document.images['rtc'].src = nvSrc;
	document.images['rs'].src = nvSrc;
}

function affichePagination()
{
	var unites = page%10; 
	var dizaines = Math.floor(page/10)%10;
	var centaines = Math.floor(page/100);
	document.images['rpu'].src = chmPng + unites + extPng;
	document.images['rpd'].src = chmPng + dizaines + extPng;
	document.images['rpc'].src = chmPng + centaines + extPng;
	unites = pages%10; 
	dizaines = Math.floor(pages/10)%10;
	centaines = Math.floor(pages/100);
	document.images['rtu'].src = chmPng + unites + extPng;
	document.images['rtd'].src = chmPng + dizaines + extPng;
	document.images['rtc'].src = chmPng + centaines + extPng;
	imgSrcSvgSablier = ((page==pages)?'d!':'d'); // v1.2.1
	document.images['rs'].src = chmPng + imgSrcSvgSablier + extPng; // v1.2.1 (imgSrcSvgSablier)
}

function afficheSolutions()
{
 // On efface la page
	for(var y=0; y<nbl; y++) 
		for(var x=1; x<=nbc; x++) {
			var sfxId = String.fromCharCode(charCodeMin+y+1) + (x<10?'0':'') + x;
			var id = pfxIdSol + sfxId;
			var nvSrc = chmPng + vide + extPng; 
			document.images[id].src = nvSrc;
			id = pfxIdLnkDico + sfxId;
			document.links[id].href = '#';
			document.links[id].target = '_self';
		}
		// On affiche la page
		if (pages)
			page++;
		affichePagination();
		var nbY = ((page<pages)?nbl:(Math.ceil(nbs%(colNblRang[stDmd.length].length*nbl))/colNblRang[stDmd.length].length));
		if (pages&&(!nbY)) // Page complète !
			nbY = nbl;
		for(var y=0; y<nbY; y++) {
			// On affiche les solutions sur la ligne
			for(var x0=0; x0<colNblRang[stDmd.length].length; x0++) {
				// On stocke le mot pour la définition (v1.2)
				var stMot = ''; 
				for(var l=0; l<stDmd.length; l++)
					stMot = stMot + stSol[posCrtSol+2*l].toUpperCase();
				// Affichage lettres + définitions liens 
				for(var l=0; l<stDmd.length; l++) {
					var x = colNblRang[stDmd.length][x0] + l;
					var sfxId = String.fromCharCode(charCodeMin+y+1) + (x<10?'0':'') + x;
					var id = pfxIdSol + sfxId;
					var nvSrc = chmPng + stSol[posCrtSol] + stSol[posCrtSol+1] + extPng; 
					document.images[id].src = nvSrc;
					// Lien vers le site de définition (v1.2)
					id = pfxIdLnkDico + sfxId;
					document.links[id].href = lnkDico[dicoDef] + stMot;
					document.links[id].target = '_blank';
					if (dicoDef==nbDicosDef-1)
						document.links[id].href = document.links[id].href.toLowerCase() + extHTM; // v1.2.3 - .toLowerCase()
					posCrtSol += 2;
	  			}
			if (posCrtSol>=stSol.length) 
				break;
			posCrtSol++; // séparateur de solution
		}
	}
}

function chercheSolutionFiltre()
{
	nbs = 0;
	stSol = '';
	var l = stDmd.length;
	var m = dico[l-2].length;
	for(var i=0; i<m; i++) {
		var j;
		for(j=0; (j<l)&&((stDmd[j]==joker)||(stDmd[j]==dico[l-2][i][j])); j++);
		if (j==l) {
			nbs++;
			var stMot ='';
			sfxCouleur=noir; // v2.1
			if (delta[l-2].indexOf(dico[l-2][i])>-1) sfxCouleur=bleu; // v2.1 : en bleu les nouveautés de l'ODS7
			for(var k=0; k<l; k++)
				stMot = stMot + dico[l-2][i][k] + ((stDmd[k]==joker)?'y':sfxCouleur); // v2.1 : sfxCouleur au lieu de 'x'
			if (stSol.length)
				stSol = stSol + ' ' + stMot;
			else
				stSol = stMot;
		}
	}
	page = 0;
	pages = Math.ceil(nbs/(colNblRang[stDmd.length].length*nbl));
	posCrtSol = 0;
}

function effaceSaisie(marque)
{
	if (marque) {
		for(var i=1; i<=nblMax; i++) {
			var nvSrc = chmPng + '!' + String.fromCharCode(charCodeMin+i) + extPng;
			var id = 'd' + String.fromCharCode(charCodeMin+i);
			document.images[id].src = nvSrc;
		}
	}
	else {
		var nvSrc = chmPng + vide + extPng;
		for(var i=1; i<=nblMax; i++) {
			var id = 'd' + String.fromCharCode(charCodeMin+i);
			document.images[id].src = nvSrc;
		}
	}
	document.images['t'].src = chmPng + 'Tp' + extPng;
	document.images['f'].src = chmPng + 'Fp' + extPng;
	idxDmd = 0;
	stDmd = '';
	nbj = 0;
}

function sablier(affiche) // v1.2.1
{
	var nvSrc = chmPng + (affiche?'sablier':imgSrcSvgSablier) + extPng;
	document.images['rs'].src = nvSrc;
}

function clic(x) 
{
	var touche = clavier[x];
	switch(touche) {
		case ' ':   break; 
		case 'i': 	alert('À propos d\'OdissimoT...\n\nWebApp OdissimoT version '+stVersion+'\n\nCréé par Patrice Fouquet\nodissimot@patquoi.fr\npatquoi.fr/OdissimoT.html\n\nBase de 402 325 mots (ODS8)\n\nA=Affiche/Cache les Anagrammes\nT=Cherche avec Tirage\nF=Cherche avec Filtre\nLivre=Change site définitions\n\nEn bas de l\'écran, accès à l\'aide en ligne et à des jeux de lettres.'); // v2.2 (ODS8) // v2.1 (ODS7)
					break;
		case 'a':	if (afficheTirages) {
						document.images['a'].src = chmPng + 'Am' + extPng;
						afficheTirages = false;
					}
					else {
						document.images['a'].src = chmPng + 'Ab' + extPng;
						afficheTirages = true;
					}
					break;
		case 't':   if (idxDmd>1) {
						sablier(true); // v1.2.1
        				setTimeout(function() { // v1.2.1
							if (nbj==stDmd.length)
								chercheSolutionFiltre(); // Que des jokers ? Alors c'est comme un filtre et donc plus rapide !
							else
								chercheSolutionTirage();
							afficheNombre();
							afficheSolutions();
							//alert(nbs+' solution(s) trouvée(s) :\n'+stSol); 
							//sablier(false); // v1.2.1
                   		}, 500); // v1.2.1
					}
					break;
		case 'f':	if (idxDmd>1) {
						sablier(true); // v1.2.1
        				setTimeout(function() { // v1.2.1
							chercheSolutionFiltre();
							afficheNombre();
							afficheSolutions();
							//alert(nbs+' solution(s) trouvée(s) :\n'+stSol); 
							//sablier(false); // v1.2.1
                   		}, 500); // v1.2.1
					}
					break;
		case '>':	if (page<pages) {
						sablier(true); // v1.2.1
        				setTimeout(function() { // v1.2.1
							afficheSolutions();
							//sablier(false); // v1.2.1
                   		}, 500); // v1.2.1
					}
					break; 
		case 'd':   // v1.2
					dicoDef = (dicoDef + 1) % nbDicosDef; // Changement du dictionnaire de définitions
					localStorage.ddd = dicoDef;
					document.images[idPrmDico].src = chmPng + pngDico[dicoDef] + extPng; 
					if (affichagesChgtDico < nbDicosDef) { 
						alert('Vous changez de dictionnaire de définitions pour...\n\n' + nomDico[dicoDef] + '\n\nAprès la prochaine recherche, touchez un mot pour voir sa définition sur le site choisi.'); 
						affichagesChgtDico++;
						localStorage.acd = affichagesChgtDico;
					}
					break;
		case 'k':	cacheNombre();
					effaceSaisie(true);
					break;
		case 'c':	if (idxDmd) {
						cacheNombre();
						if (stDmd[stDmd.length-1]==joker)
							nbj--;
						stDmd = stDmd.substring(0, stDmd.length-1);
						var nvSrc = chmPng + vide + extPng;
						var id = 'd' + String.fromCharCode(charCodeMin+idxDmd);
						document.images[id].src = nvSrc;
						idxDmd--;
						if (idxDmd==1) {
							document.images['t'].src = chmPng + 'Tp' + extPng;
							document.images['f'].src = chmPng + 'Fp' + extPng;
						}
						if (!idxDmd)
							effaceSaisie(true);
					}
					break;
		default:	if (!idxDmd) // On efface l'indication de saisie
						effaceSaisie(false);
					if (idxDmd<nblMax) {
						cacheNombre();
						stDmd = stDmd + (touche==jkrPng?joker:touche);
						var nvSrc = chmPng + touche + 'x' + extPng;
						idxDmd++;
						var id = 'd' + String.fromCharCode(charCodeMin+idxDmd);
						document.images[id].src = nvSrc;
						if (touche==jkrPng)
							nbj++;
						if (idxDmd==2) {
							document.images['t'].src = chmPng + 'Tb' + extPng;
							document.images['f'].src = chmPng + 'Fb' + extPng;
						}
						
					}
	}
}

function adapteDimensions()
{ 
	var largeur = document.getElementById('container').offsetWidth; 
    if (largeur != 320) { 
 		var n=document.images.length;
 		var coef=largeur/320;
 		var hauteur=0;
 		var largeur=0;
 		for(var i=0; i<n; i++) {
 			hauteur=parseInt(document.images[i].height);
 			largeur=parseInt(document.images[i].width);
 			document.images[i].height=Math.round(coef*hauteur);
 			document.images[i].width=Math.round(coef*largeur);
 		}
 	}
    delete adapteDimensions; 
}

function bienvenue() // v1.1
{
	// lecture des paramètres (v1.2)
	if (localStorage.getItem('ddd')) 
		dicoDef = parseInt(localStorage.ddd); 
	if (localStorage.getItem('acd')) 
		affichagesChgtDico = parseInt(localStorage.acd);

	var nvSrc = chmPng + pngDico[dicoDef] + extPng; 
	document.images[idPrmDico].src = nvSrc;	
    alert('Bienvenue à OdissimoT\n\nL\'application s\'adapte automatiquement en largeur. Si vous ne voyez pas le clavier, réduisez la largeur de la fenêtre de votre navigateur puis rafraîchissez.\n\nEntrez un filtre ou un tirage\navec ou sans joker (?)\npuis touchez en haut à droite...\n - T pour un Tirage\n - F pour un Filtre\n - A pour cacher/voir les Anagrammes.\n\n• Touchez le livre pour changer de site de définitions.\n• Touchez un mot pour voir sa définition en ligne.\n• Touchez (i) pour plus d\'infos.');
    delete bienvenue;
}
