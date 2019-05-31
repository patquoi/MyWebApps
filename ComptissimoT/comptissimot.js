 /*
 
 Fichier: Osmotik.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.3.1>
 
 Copyright (C) 2011 Patrice Fouquet.
 
 */ 

// NOTE : La police utilisée est Utopia Bold, taille 72 pour les lettres et 48 pour les chiffres. 

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.0';
const stVersionODS = '6';

/*
Version 1.0 : première version
*/

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------

const val = [0,5,2,2,2,5,2,2,2,4,1,1,3,2,3,4,2,1,3,4,4,4,2,1,1,1,1];
const frq = [54406368,6168032,1141008,1938968,1330144,7933452,850968,1174240,753564,4346680,202564,204772,2408328,1456068,2878136,3119900,1464668,210388,4123156,4666160,3444716,2569700,736900,45676,247884,326184,664112];
const rep = [0,6168032,7309040,9248008,10578152,18511604,19362572,20536812,21290376,25637056,25839620,26044392,28452720,29908788,32786924,35906824,37371492,37581880,41705036,46371196,49815912,52385612,53122512,53168188,53416072,53742256,54406368];
const lettresMinMotDico = 4;
const lettresMaxMotDico = 8;
const valMaxLettre = 5;
const lettres = 26;


const tailleGrille = 8;

const dx = [0,0,1,1,1,0,-1,-1,-1];
const dy = [0,-1,-1,0,1,1,1,0,-1];

const stDir = ['-','N','NE','E','SE','S','SO','O','NO'];

const typeDir = new creeTypeDir();

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// Couleurs par score de lettre
// 0=jaune 1=rouge 2=orange 3=vert 4=cyan 5=bleu
const stCoul             = 'jrovcb';
const blanc              = 'l';
const noir               = 'n';
// Diverses chaînes
const espace             = ' ';
const vide				 = '';

// Divers
const indefini           = -1;
const oui                = true;
const non                = false;

// Codes ASCII
const charCodeMin        = 64;


// Chaînes PNG 
const chmPng             = 'png/';
const extPng			 = '.png';
const transparent		 = '-';

//---------------------------------------------------------------------------
// CONSTRUCTEURS
//---------------------------------------------------------------------------

function creeTypeDir()
{
 this.dIndefinie = 0;
 this.dN = 1;
 this.dNE = 2;
 this.dE = 3;
 this.dSE = 4;
 this.dS = 5;
 this.dSO = 6;
 this.dO = 7;
 this.dNO = 8;
}
//---------------------------------------------------------------------------
function creeTypeCase(x, y)
{
  this.x = x; // Colonne 0..7
  this.y = y; // Ligne 0..7
  this.l = espace; // Lettre espace, 'A'..'Z'
  this.s = indefini; // Score initialisé à val[l]
  this.u = false; // Utilisée. true dès que la lettre permute avec une autre et revient à true dès qu'elle atteint 0 et qu'on la touche.
  // Méthodes
  this.affiche = caseAffiche;
  this.changeLettre = caseChangeLettre;
  this.tireLettre = caseTireLettre;
  this.allume = caseAllume;
  this.allumeTop = caseAllumeTop;
  this.chercheAutreLettre = caseChercheAutreLettre;
}		 
//---------------------------------------------------------------------------
function creeTypeRechMot(x1, y1, x2, y2)
{
  if ((x2==undefined)&&(y2==undefined)) {
    this.n = 1;
    this.x = [x1];
    this.y = [y1];
  }
  else {
    this.n = 2;
    this.x = [x1, x2];
    this.y = [y1, y2];
  }
  this.l = indefini;
  this.d = typeDir.dIndefinie;
  this.kMin = indefini;
  this.kMax = indefini;
  this.kd = indefini;
  this.kf = indefini;
  // Infos dernier mot trouvé 
  this.stMot = vide;
  this.dMot = typeDir.dIndefinie;
  this.lMot = indefini;
  this.kdMot = indefini;
  this.kfMot = indefini;
  // Méthodes
  this.chercheMotSuivant = rechMotChercheMotSuivant;
  this.determineBornes = rechMotDetermineBornes;
  this.estValide = rechMotEstValide;
  this.allumeMot = rechMotAllumeMot;
  this.eteintMot = rechMotEteintMot;
  this.fixeMot = rechMotFixeMot;
}

//---------------------------------------------------------------------------
// METHODES
//---------------------------------------------------------------------------

function caseAffiche()
{
  var stCouleur = (((this.x==xGrille)&&(this.y==yGrille))||(this.u&&(this.s>0)))?noir:stCoul[this.s];
  document.images['L'+this.x+this.y].src = chmPng + this.l + stCouleur + extPng;
  document.images['S'+this.x+this.y].src = chmPng + this.s + stCouleur + extPng;
}
//---------------------------------------------------------------------------
function caseChangeLettre(l)
{
  this.l = l;
  this.s = val[l.charCodeAt(0)-charCodeMin];
  this.affiche();
}
//---------------------------------------------------------------------------
function caseTireLettre()
{
  var a=100*Math.random();
  var b=0;
  var c=0;
  var l=espace;
  for(var i=0; i<a; i++) c=Math.floor(frq[0]*Math.random());
  for(; c>=rep[b]; b++);
  l=String.fromCharCode(b+charCodeMin); 
  this.changeLettre(l);
}
//---------------------------------------------------------------------------
function caseAllume()
{
  if (this.s) this.s--;
  incrementeScore();
  document.images['L'+this.x+this.y].src = chmPng + this.l + blanc + extPng;
  document.images['S'+this.x+this.y].src = chmPng + this.s + blanc + extPng;
}
//---------------------------------------------------------------------------
function caseAllumeTop()
{
  if (this.s<valMaxLettre) this.s++; // Inversion pour la résurrection d'une lettre 
  incrementeScore();
  document.images['L'+this.x+this.y].src = chmPng + this.l + blanc + extPng;
  document.images['S'+this.x+this.y].src = chmPng + this.s + blanc + extPng;
}
//---------------------------------------------------------------------------
function caseChercheAutreLettre()
{
  var l0 = this.l; // On sauvegarde la lettre avant de changer
  var score = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var mots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var elues = '';
  for(var l=0;l<lettres; l++) 
    if (String.fromCharCode(charCodeMin+l+1)!=l0) {
      this.l=String.fromCharCode(charCodeMin+l+1);
      for(var d=typeDir.dN; d<=typeDir.dNO; d++) {
        var xd, yd, xf, yf;
        var kMin=0, kMax=0;
        // 2a. On détermine les bornes min et max
        for(; coordonneesValides(this.x+kMin*dx[d], this.y+kMin*dy[d]); kMin--);
        kMin++;
        for(; coordonneesValides(this.x+kMax*dx[d], this.y+kMax*dy[d]); kMax++);
        kMax--;
        for(var kd=kMin; ((kMax-kd+1>=lettresMinMotDico)&&(kd<=0)); kd++) {
          for(var kf=kMax; ((kf-kd+1>=lettresMinMotDico)&&(kf>=0)); kf--) {
            var stMot = vide;
            var doublon=false;
            for(var k=kd; k<=kf; k++)
              stMot=stMot+c[this.x+k*dx[d]][this.y+k*dy[d]].l;
            if (estDansLeDico(stMot)) {
              score[l]+=stMot.length;
              mots[l]++;
            }
          }
        }
      }
    }
  for(var l=0; l<lettres; l++)
    if (score[l])
      elues=elues+String.fromCharCode(charCodeMin+l+1);
  if (elues.length>0) {
    this.l=elues[Math.floor(elues.length*Math.random())];
    this.s=val[this.l.charCodeAt(0)-charCodeMin];
    this.u=false;
    rm=new creeTypeRechMot(this.x, this.y);
    afficheMotsFormes(); 
  }
  else
    touchable = true;
}
//---------------------------------------------------------------------------
function rechMotDetermineBornes()
{
  this.kMin=0;
  this.kMax=0;
  for(; coordonneesValides(this.x[this.l]+this.kMin*dx[this.d], this.y[this.l]+this.kMin*dy[this.d]); this.kMin--);
  this.kMin++;
  for(; coordonneesValides(this.x[this.l]+this.kMax*dx[this.d], this.y[this.l]+this.kMax*dy[this.d]); this.kMax++);
  this.kMax--;
  this.kd=this.kMin;
  this.kf=this.kMax;
}
//---------------------------------------------------------------------------
function rechMotEstValide()
{
  this.stMot = vide;
  var doublon=false;
  for(var k=this.kd; k<=this.kf; k++) {
    this.stMot=this.stMot+c[this.x[this.l]+k*dx[this.d]][this.y[this.l]+k*dy[this.d]].l;
    if ((this.l>0)&&(this.x[0]==this.x[this.l]+k*dx[this.d])&&(this.y[0]==this.y[this.l]+k*dy[this.d]))
      doublon=true;
  }
  if ((!doublon)&&estDansLeDico(this.stMot)) {
    this.fixeMot(); 
    return true;
  }
  else 
    return false;
}
//---------------------------------------------------------------------------
function rechMotFixeMot()
{
  this.dMot = this.d;
  this.lMot = this.l;
  this.kdMot = this.kd;
  this.kfMot = this.kf;
}
//---------------------------------------------------------------------------
function rechMotAllumeMot()
{
  for(var k=this.kdMot; k<=this.kfMot; k++) {
    var xx=this.x[this.lMot]+k*dx[this.dMot];
    var yy=this.y[this.lMot]+k*dy[this.dMot];
    if ((this.n==1)&&(xx==this.x[0])&&(yy==this.y[0]))
      c[xx][yy].allumeTop();
    else
      c[xx][yy].allume();
  }
  for(var k=0; k<lettresMaxMotDico; k++)  
    document.images['m'+k].src = chmPng + (k<this.stMot.length?this.stMot[k]+'m':transparent) + extPng;
  incrementeMots();  
}
//---------------------------------------------------------------------------
function rechMotEteintMot()
{
 for(var k=this.kdMot; k<=this.kfMot; k++)
   c[this.x[this.lMot]+k*dx[this.dMot]][this.y[this.lMot]+k*dy[this.dMot]].affiche();
}
//---------------------------------------------------------------------------
function rechMotChercheMotSuivant()
{
  if ((this.kf-this.kd+1>lettresMinMotDico)&&(this.kf>0)) {
    this.kf--;
    if (this.estValide())
      return true;
    else
      return this.chercheMotSuivant();
  }  
  else 
    if ((this.kMax-this.kd+1>lettresMinMotDico)&&(this.kd<0)) {
      this.kd++;
      this.kf=this.kMax;  
      if (this.estValide()) 
        return true;
      else
        return this.chercheMotSuivant();
    }
    else 
      if ((this.d>typeDir.dIndefinie)&&(this.d<typeDir.dNO)) {
        this.d++;
        this.determineBornes();
        if (this.estValide()) 
          return true;
        else
          return this.chercheMotSuivant();
      }
      else
        if (this.l<this.n-1) {
          this.l++;
          this.d=typeDir.dN; 
          this.determineBornes();
          if (this.estValide()) 
            return true;
          else
            return this.chercheMotSuivant();
        }
        else 
          return false;
}

//---------------------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------------------

// Grille
var c = [[new creeTypeCase(0, 0), new creeTypeCase(0, 1), new creeTypeCase(0, 2), new creeTypeCase(0, 3), new creeTypeCase(0, 4), new creeTypeCase(0, 5), new creeTypeCase(0, 6), new creeTypeCase(0, 7)], 
         [new creeTypeCase(1, 0), new creeTypeCase(1, 1), new creeTypeCase(1, 2), new creeTypeCase(1, 3), new creeTypeCase(1, 4), new creeTypeCase(1, 5), new creeTypeCase(1, 6), new creeTypeCase(1, 7)], 
         [new creeTypeCase(2, 0), new creeTypeCase(2, 1), new creeTypeCase(2, 2), new creeTypeCase(2, 3), new creeTypeCase(2, 4), new creeTypeCase(2, 5), new creeTypeCase(2, 6), new creeTypeCase(2, 7)], 	 
         [new creeTypeCase(3, 0), new creeTypeCase(3, 1), new creeTypeCase(3, 2), new creeTypeCase(3, 3), new creeTypeCase(3, 4), new creeTypeCase(3, 5), new creeTypeCase(3, 6), new creeTypeCase(3, 7)], 
         [new creeTypeCase(4, 0), new creeTypeCase(4, 1), new creeTypeCase(4, 2), new creeTypeCase(4, 3), new creeTypeCase(4, 4), new creeTypeCase(4, 5), new creeTypeCase(4, 6), new creeTypeCase(4, 7)], 
         [new creeTypeCase(5, 0), new creeTypeCase(5, 1), new creeTypeCase(5, 2), new creeTypeCase(5, 3), new creeTypeCase(5, 4), new creeTypeCase(5, 5), new creeTypeCase(5, 6), new creeTypeCase(5, 7)], 
         [new creeTypeCase(6, 0), new creeTypeCase(6, 1), new creeTypeCase(6, 2), new creeTypeCase(6, 3), new creeTypeCase(6, 4), new creeTypeCase(6, 5), new creeTypeCase(6, 6), new creeTypeCase(6, 7)], 
         [new creeTypeCase(7, 0), new creeTypeCase(7, 1), new creeTypeCase(7, 2), new creeTypeCase(7, 3), new creeTypeCase(7, 4), new creeTypeCase(7, 5), new creeTypeCase(7, 6), new creeTypeCase(7, 7)]]; 

var coup=0;
var scorePartie = 0;
var scoreCoup = 0;
var motsPartie = 0;
var motsCoup = 0;
var topScoreCoup = 0;
var topMotsCoup = 0;
var topScorePartie = 0;
var topMotsPartie = 0;

var xGrille = indefini;
var yGrille = indefini;

var rm=null;

var touchable = true;

//---------------------------------------------------------------------------
// FONCTIONS
//---------------------------------------------------------------------------

function initialiseCoup()
{
 scoreCoup=0;
 motsCoup=0;
 coup++;
 afficheScore();
 afficheMots();
 afficheCoup();
}
//---------------------------------------------------------------------------
function initialisePartie()
{
 scoreCoup=0;
 motsCoup=0;
 affichePartie();
}
//---------------------------------------------------------------------------
function afficheCoup()
{
	document.images['ncc'].src = chmPng + (Math.floor(coup/100)%10) + 'm' + extPng;
	document.images['ncd'].src = chmPng + Math.floor(coup/10) + 'm' + extPng;
	document.images['ncu'].src = chmPng + (coup%10) + 'm' + extPng;
}
//---------------------------------------------------------------------------
function incrementeCoup()
{
	coup++;
	afficheCoup();
}
//---------------------------------------------------------------------------
function afficheScore()
{
	document.images['spu'].src = chmPng + (scorePartie%10) + 's' + extPng;
	document.images['spd'].src = chmPng + (Math.floor(scorePartie/10)%10) + 's' + extPng;
	document.images['spc'].src = chmPng + (Math.floor(scorePartie/100)%10) + 's' + extPng;
	document.images['spm'].src = chmPng + (Math.floor(scorePartie/1000)%10) + 's' + extPng;
	document.images['spy'].src = chmPng + (Math.floor(scorePartie/10000)%10) + 's' + extPng;
	document.images['scu'].src = chmPng + (scoreCoup%10) + 's' + extPng;
	document.images['scd'].src = chmPng + (Math.floor(scoreCoup/10)%10) + 's' + extPng;
	document.images['scc'].src = chmPng + (Math.floor(scoreCoup/100)%10) + 's' + extPng;
	document.images['scm'].src = chmPng + (Math.floor(scoreCoup/1000)%10) + 's' + extPng;
	document.images['scy'].src = chmPng + (Math.floor(scoreCoup/10000)%10) + 's' + extPng;
	document.images['tspu'].src = chmPng + (topScorePartie%10) + 's' + extPng;
	document.images['tspd'].src = chmPng + (Math.floor(topScorePartie/10)%10) + 's' + extPng;
	document.images['tspc'].src = chmPng + (Math.floor(topScorePartie/100)%10) + 's' + extPng;
	document.images['tspm'].src = chmPng + (Math.floor(topScorePartie/1000)%10) + 's' + extPng;
	document.images['tspy'].src = chmPng + (Math.floor(topScorePartie/10000)%10) + 's' + extPng;
	document.images['tscu'].src = chmPng + (topScoreCoup%10) + 's' + extPng;
	document.images['tscd'].src = chmPng + (Math.floor(topScoreCoup/10)%10) + 's' + extPng;
	document.images['tscc'].src = chmPng + (Math.floor(topScoreCoup/100)%10) + 's' + extPng;
	document.images['tscm'].src = chmPng + (Math.floor(topScoreCoup/1000)%10) + 's' + extPng;
	document.images['tscy'].src = chmPng + (Math.floor(topScoreCoup/10000)%10) + 's' + extPng;
}
//---------------------------------------------------------------------------
function afficheMots()
{
	document.images['mpu'].src = chmPng + (motsPartie%10) + 'm' + extPng;
	document.images['mpd'].src = chmPng + (Math.floor(motsPartie/10)%10) + 'm' + extPng;
	document.images['mpc'].src = chmPng + (Math.floor(motsPartie/100)%10) + 'm' + extPng;
	document.images['mpm'].src = chmPng + (Math.floor(motsPartie/1000)%10) + 'm' + extPng;
	document.images['mcu'].src = chmPng + (motsCoup%10) + 'm' + extPng;
	document.images['mcd'].src = chmPng + (Math.floor(motsCoup/10)%10) + 'm' + extPng;
	document.images['mcc'].src = chmPng + (Math.floor(motsCoup/100)%10) + 'm' + extPng;
	document.images['mcm'].src = chmPng + (Math.floor(motsCoup/1000)%10) + 'm' + extPng;
	document.images['tmpu'].src = chmPng + (topMotsPartie%10) + 'm' + extPng;
	document.images['tmpd'].src = chmPng + (Math.floor(topMotsPartie/10)%10) + 'm' + extPng;
	document.images['tmpc'].src = chmPng + (Math.floor(topMotsPartie/100)%10) + 'm' + extPng;
	document.images['tmpm'].src = chmPng + (Math.floor(topMotsPartie/1000)%10) + 'm' + extPng;
	document.images['tmcu'].src = chmPng + (topMotsCoup%10) + 'm' + extPng;
	document.images['tmcd'].src = chmPng + (Math.floor(topMotsCoup/10)%10) + 'm' + extPng;
	document.images['tmcc'].src = chmPng + (Math.floor(topMotsCoup/100)%10) + 'm' + extPng;
	document.images['tmcm'].src = chmPng + (Math.floor(topMotsCoup/1000)%10) + 'm' + extPng;
}
//---------------------------------------------------------------------------
function litTops() 
{
  if (localStorage.getItem('tsc')) topScoreCoup = localStorage.tsc;
  if (localStorage.getItem('tsp')) topScorePartie = localStorage.tsp;
  if (localStorage.getItem('tmc')) topMotsCoup = localStorage.tmc;
  if (localStorage.getItem('tmp')) topMotsPartie = localStorage.tmp;
}
//---------------------------------------------------------------------------
function incrementeScore()
{
	scorePartie++;
	scoreCoup++;
	if (scoreCoup>topScoreCoup) {
	  topScoreCoup = scoreCoup;
	  localStorage.tsc = topScoreCoup;
	}
	if (scorePartie>topScorePartie) {
	  topScorePartie = scorePartie;
	  localStorage.tsp = topScorePartie;
	}
	afficheScore();
}
//---------------------------------------------------------------------------
function incrementeMots()
{
	motsPartie++;
	motsCoup++;
	if (motsCoup>topMotsCoup) {
	  topMotsCoup = motsCoup;
	  localStorage.tmc = topMotsCoup;
	}
	if (motsPartie>topMotsPartie) {
	  topMotsPartie = motsPartie;
	  localStorage.tmp = topMotsPartie;
	}
	afficheMots();
}
//---------------------------------------------------------------------------
function coordonneesValides(x, y)
{
 return ((x>=0)&&(x<tailleGrille)&&(y>=0)&&(y<tailleGrille));
}
//---------------------------------------------------------------------------
function afficheMotsFormes()
{
 if (rm.stMot.length>0) 
   rm.eteintMot();
 if (rm.chercheMotSuivant()) 
  { 
    rm.allumeMot();
    setTimeout(
    	function() {
    		afficheMotsFormes();
    	},
    	1000);
  }
  else {
    for(var k=0; k<lettresMaxMotDico; k++)  
      document.images['m'+k].src = chmPng + transparent + extPng;
    delete rm; 
    touchable = true;
  }
}
//---------------------------------------------------------------------------
function permuteLettres(x1, y1, x2, y2) 
{
 // 0. On initialise scores & mots du dernier coup
 initialiseCoup();
 // 1. On permute les lettres
 c[x1][y1].l=c[x2][y2].l+c[x1][y1].l;
 c[x1][y1].s=c[x2][y2].s+c[x1][y1].s;
 c[x2][y2].l=c[x1][y1].l[1];
 c[x2][y2].s=c[x1][y1].s-c[x2][y2].s;
 c[x1][y1].l=c[x1][y1].l[0];
 c[x1][y1].s=c[x1][y1].s-c[x2][y2].s;
 c[x1][y1].u = true;
 c[x1][y1].affiche();
 c[x2][y2].u = true;
 c[x2][y2].affiche();
 // 2. On affiche les mots formés
 rm=new creeTypeRechMot(x1, y1, x2, y2);
 afficheMotsFormes(); 
}
//---------------------------------------------------------------------------
function casesContigues(x1, y1, x2, y2)
{
 return (Math.abs(x1-x2)+Math.abs(y1-y2)==1);
}

//---------------------------------------------------------------------------
function touche(xy)
{
  if (!touchable) return;
  var xx=Math.floor(xy/10);
  var yy=xy%10;
  if ((xy<=77)&&((!c[xx][yy].u)||(!c[xx][yy].s))) {
    if ((xGrille==indefini)&&(yGrille==indefini)) { 
      if (!c[xx][yy].s) {
        touchable = false;
        c[xx][yy].chercheAutreLettre();
      } 
      else {
        xGrille=xx;
        yGrille=yy;
        c[xGrille][yGrille].affiche(); // On ne marque pas encore la lettre car on peut annuler en retouchant la même lettre... On attend la permutation
      }    
    }
    else {
     if (((xGrille==xx)&&(yGrille==yy))||
         (!casesContigues(xGrille, yGrille, xx, yy))) { 
       xx=xGrille;   
       yy=yGrille;
       xGrille=indefini;
       yGrille=indefini;
       c[xx][yy].affiche();
     }
     else 
       if (c[xx][yy].s) /* On permute ! */ {
         var x = [xGrille, Math.floor(xy/10)];
         var y = [yGrille, xy%10];
         xGrille=indefini;
         yGrille=indefini;
         touchable = false;
         permuteLettres(x[0], y[0], x[1], y[1]);
	   }
	   else {
         xx=xGrille;   
         yy=yGrille;
         xGrille=indefini;
         yGrille=indefini;
         c[xx][yy].affiche();
	   } 
     }
   }
}
//---------------------------------------------------------------------------
function bienvenue() 
{
 for(var x=0; x<tailleGrille; x++)
  for(var y=0; y<tailleGrille; y++)
   c[x][y].tireLettre();
 litTops();
 afficheScore();
 afficheMots();
}
//---------------------------------------------------------------------------
