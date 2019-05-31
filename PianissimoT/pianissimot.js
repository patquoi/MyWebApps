 /*

  File:PianissimoT.js
  Abstract: main JavaScript for the index.html file
  
  Version: <1.0>
  
  Copyright (C) 2017 Patrice Fouquet. All Rights Reserved.
 
 */ 

  /**************/
 /* CONSTANTES */
/**************/

const stVersion		= '1.0'; 

/* Police 
Lettres = Optima Heavy 320
Chiffres = Impact Condensed 92
Clavier = Noteworthy Bold */

// Constantes d'environnement
const nbl			= 26; // Nombre de lignes de solutions comme nombre de lettres !
const nblMin		= 2;  // Nombre MIN de lettres
const nblMax		= 8; // Nombre MAX de lettres

// Constantes HTML
const extPng		= '.png';
const chmPng		= 'png/';
const vide			= '-';
const noir			= 'x'; // Bouton actif
const gris			= 'y'; // Bouton inactif
const prop			= 'n'; // Lettre saisie au clavier
const mystere		= 'mystere'; // ? à la place de la solution
const feu			= 'feu'; // Résultat de la proposition
const inactif		= 'x'; // Si mot incorrect (paramètre de initialiseFeu)
const actif			= '';  // Si mot correct (paramètre de initialiseFeu)
const idFeu			= 'f'; // Résultat de la proposition
const vert			= 'v'; // feu vert (bien placé)
const orange		= 'o'; // feu orange (mal placé 2 fois)
const rouge			= 'r'; // feu vert (mal placé)
// clavier
const clavier 		= '          AZERTYUIOPQSDFGHJKLMWXCVBNrdzi';
const retArr		= 36;
const debut			= 37;
const raz			= 38;
const info			= 39;

// places
const non 			= 0;
const mal			= 1;
const bien			= 2;


  /********************/
 /* VARIABLES DE JEU */
/********************/

// Index mot et lettre courants
var nblMotCrt = 2; // Le mot courant est représenté par son nombre de lettres :^)
var rglMotCrt = 0; // Lettre courante du mot courant (saisie clavier)

// Escalier à trouver
var e = [[],[' '],[' ',' '],[' ',' ',' '],[' ',' ',' ',' '],[' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ',' ',' ',' ']];
// Mot courant saisi
var m = [' ',' ',' ',' ',' ',' ',' ',' '];
// lettre donnée au départ
var don = [[],[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false]];

function afficheProposition()
{
	var id=''+nblMotCrt+String.fromCharCode(65+rglMotCrt);
	document.images[id].src=chmPng+m[rglMotCrt]+prop+extPng;
}

function afficheSolution()
{
	var id=''+nblMotCrt+String.fromCharCode(65+rglMotCrt);
	document.images[id].src=chmPng+e[nblMotCrt][rglMotCrt]+extPng;
}

function afficheMystere()
{
	var id=''+nblMotCrt+String.fromCharCode(65+rglMotCrt);
	document.images[id].src = chmPng + mystere + extPng;
}

function creeEscalier()
{
	var iEscalier = Math.floor(escaliers.length*Math.random());
	for(var i=nblMin; i<=nblMax; i++) {
		for(var j=0; j<i; j++) {
	    	var id = ''+i+String.fromCharCode(65+j);
	    	e[i][j] = escaliers[iEscalier][i-2][j];
	    	if (j == i-1) {
	    		don[i][j] = true;
		    	document.images[id].src = chmPng + e[i][j] + extPng;
		    }
		    else {
  	    		don[i][j]=false;
		    	document.images[id].src = chmPng + mystere + extPng;
		    }
	   }
	}
}

function initialiseFeu(etat)
{
	var id0 = idFeu + nblMotCrt;
	var id = id0.toUpperCase();
	var idBP = id + vert;
	var idMP2 = id + orange;
	var idMP1 = id + rouge;
	var feuVOR = chmPng + '000' + extPng;
	document.images[id0].src = chmPng + feu + etat + extPng
	document.images[idBP].src = feuVOR;
	document.images[idMP2].src = feuVOR;
	document.images[idMP1].src = feuVOR;
}

function afficheResultat(stMot)
{
	var plcprp = [non,non,non,non,non,non,non,non];
	var plcsol = [non,non,non,non,non,non,non,non];
	var bp = 0; // bien placés
	var mp1 = 0; // mal placés 1 fois
	var mp2 = 0; // mal placés 2 fois
	// 1. On marque d'abord les bp
	for(var i=0; i<nblMotCrt; i++) 
		if (stMot[i]==e[nblMotCrt][i]) {
			bp++;
			plcprp[i]=bien;
			plcsol[i]=bien;
		}
	// 2. Pour chaque lettre de la proposition, on regarde si elle est mal placée juste une fois pour l'instant
	for(var i=0; i<nblMotCrt; i++) 
		if (!plcprp[i]) {
			for(var j=0; j<nblMotCrt; j++) {
				if ((i!=j)&&(stMot[i]==e[nblMotCrt][j])&&(!plcsol[j])) {
					mp1++;
					plcprp[i]=mal;
					plcsol[j]=mal;
					continue; // On passe à la lettre suivante !
				}
			}
		}
	// 3. Pour chaque lettre de la proposition, on regarde si elle est mal placée ailleurs
	for(var i=0; i<nblMotCrt; i++) 
		if (plcprp[i]==mal) {
			for(var j=0; j<nblMotCrt; j++) {
				if ((i!=j)&&(stMot[i]==e[nblMotCrt][j])&&(!plcsol[j])) {
					mp2++;
					mp1--; // Il faut retirer mal placé 1 fois !
					plcsol[j]=mal;
					continue; // On passe à la lettre suivante !
				}
			}
		}
	var id = idFeu.toUpperCase() + nblMotCrt;
	var idBP = id + vert;
	var idMP2 = id + orange;
	var idMP1 = id + rouge;
	document.images[idBP].src = chmPng + '00' + bp + extPng;
	document.images[idMP2].src = chmPng + "0" + mp2 + '0' + extPng;
	document.images[idMP1].src = chmPng + mp1 + '00' + extPng;
	return (bp == nblMotCrt);
}

function clic(x)
{
	// de 10 à 19 : 1ère ligne du clavier
	// de 20 à 29 : 2ème ligne du clavier
	// de 30 à 39 : 3ème ligne du clavier
	var index=parseInt(x);
	var touche=clavier[index];
	var id = idFeu + nblMotCrt;
	if ((index>=10)&&(index<=35)) { // A..Z
		if (rglMotCrt==nblMotCrt) // On a proposé un mot et obtenu le résultat, on réinitialise 
			clic(debut);
		if ((nblMotCrt>1)&&(rglMotCrt<nblMotCrt)) { // On attend bien une lettre
			m[rglMotCrt]=touche;
			afficheProposition();
			rglMotCrt++;
			if (rglMotCrt == nblMotCrt) { // On a le mot complet !
				var stMot = '';
				for(var i=0; i<nblMotCrt; i++)
					stMot = stMot + m[i];
				if (estDansLeDico(stMot)) {
					if (afficheResultat(stMot)) { // true = mot trouvé, on passe au suivant
						for(rglMotCrt=0; rglMotCrt<nblMotCrt; rglMotCrt++)
							afficheSolution();
						nblMotCrt++;
						rglMotCrt=0;
					}
				}
				else
					initialiseFeu(inactif);
			}
			else // Mot incomplet : on affiche le feu sans rien
				initialiseFeu(actif);
		}
 	}
	switch(touche) {
		case 'r': 	// RetArr
					if (rglMotCrt>0) {
						rglMotCrt--;
						if (don[nblMotCrt][rglMotCrt]) 
							afficheSolution();
						else
							afficheMystere();
					}
					initialiseFeu(actif);
					break;
		case 'd':	// Début
					while(rglMotCrt>0) {
						rglMotCrt--;
						if (don[nblMotCrt][rglMotCrt]) 
							afficheSolution();
						else
							afficheMystere();
 					}
					initialiseFeu(actif);
 					break;
 	}
}