 /*
 
 Fichier: Osmotik.js
 
 Sujet: JavaScript for the index.html file
  
 Version: <1.4>
 
 Copyright (C) 2011 Patrice Fouquet.
 
 */ 

// NOTE : La police utilisée est Utopia Bold, taille 72 pour les lettres et 48 pour les chiffres. 
//        La police de message, c'est Monaco taille 48
//        La police de marquage est Futura Medium Condensed 40

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.4';
const stVerDico = '7'; // v1.4

/*
Version 1.3.1
 - Décalages dans les affichages en négatif des scores.
 - Affichage d'un sablier sous les deux chevalets
Version 1.4
 - Nouvelle version du dictionnaire : ODS7 (2016) avec +7406 mots.
 - Comptage des mots du dico.
*/

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------

// couleur par joueur : colj[joueurs][joueur]
const colj = [[0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,2,0,0,0,0],
              [0,1,2,3,0,0,0],
              [0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,2,3,4,5,6]];

// cases départ par joueur : (xcdj[joueurs][joueur], ycdj[joueurs][joueur])
const xcdj = [[0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,15,0,0,0,0],
              [0,1,8,15,0,0,0],
              [0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,1,8,15,15,8]]; 
const ycdj = [[0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,15,0,0,0,0],
              [0,1,15,8,0,0,0],
              [0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0],
              [0,1,8,15,15,8,1]]; 

const typeDir = new creeTypeDirection();

const dx = [0,-1,-1,0,1,1,0];
const dy = [0,-1,0,1,1,0,-1];

const invDir = [typeDir.dIndefinie, typeDir.d6h, typeDir.d8h, typeDir.d10h, typeDir.d0h, typeDir.d2h, typeDir.d4h]; 

// val = nb exemplaires au départ et valeur permettant d'avoir un exemplaire supplémentaire
// si lettre = String.fromCharCode(charCodeMin+i) alors sa valeur est val[i]
//           -,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
const val = [0,5,2,2,2,5,2,2,2,4,1,1,3,2,3,4,2,1,3,4,4,4,2,1,1,1,1];

// Maximum de lettres à placer (le minimum est 1 mais on peut passer le placement de lettres)
const lettresMaxAPlacer = 6;
const lettresMinMotDico = 2;
const lettresMaxMotDico = 15;


//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// Couleurs
// 0=noir, 1=bleu, 2=rouge, 3=jaune, 4=ciel, 5=orange, 6=vert)
const coul               = 'nbrjcovg';
const noir               = 'n';
const blanc              = 'l';
const gris               = 'g';
const nomj               = ['NOIR', 'BLEU', 'ROUGE', 'JAUNE', 'CIEL', 'ORANGE', 'VERT', 'GRIS']

// Directions
const stDir              = ['NA','12H','2H','4H','6H','8H','10H'];
 
// Partie d'hexagone : nord et sud
const nord               = 'n';
const sud                = 's';

// Diverses chaînes
const zero               = '0';
const un                 = '1';
const deux               = '2';
const trois              = '3';
const a                  = 'A';
const b                  = 'B';
const espace             = ' ';
const pourCent           = '%';
const rien               = '  - ';
const stTrue             = 'true';
const stJoue             = ' JOUE';
const boutonsTutoriel    = ' [< ][X][ >]';
const evolutionPartie    = 'EVOLUTION DE LA PARTIE';
const enteteDetailMot    = 'MOT             S P+L+';
const fleches            = '^  ^  ^  ^  ^  ^  ^  ^';

const caractereStandard  = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';     

// Divers
const indefini           = -1;
const oui                = true;
const non                = false;

// Tutoriel
const joueurTutoriel     = 1;
const jouAdvTutoriel     = 2;
const joueursTutoriel    = 3;
const lettres0Tutoriel   = 'JKQWXYZ';
const casesXPltTutoriel  = 'ABCDEFGHIJKLMNHHHHHHHH';
const casesYPltTutoriel  = 'ABCDEFGHIJKLMNONMLKJIG';
const coultrPltTutoriel  =['bbbbnnnrrrrnnnrrrrrrrr',
                           'bbbb   rrrr   rrrrrrrr', 
                           'bbbb   rrrr   rrrrrrrr', 
                           'bbllllllllllllrrrrrrrr',
                           'bbbbbblrrrrbbbrrrrrrrl',
                           'bbbbbbbrrrrbbbrrrrrrrr'];
const scoresPltTutoriel  =['1111000211100022222111',
                           '1111   2111   22222111', 
                           '1111   2111   22222111', 
                           '1122111100011122222111',
                           '1122112100011122222110',
                           '1122112100011122222110'];
const lettrePltTutoriel  = 'CODECONGELERAIBRUISSAE';
const caseAchJBTutoriel  = 'CC';
const caseAchJRTutoriel  = 'HO';
const lettreAchTutoriel  = 'D';
const coordDprtTutoriel  = 5;

// Tailles de tableaux
const dimensionPlateau   = 15;
const dimensionChevalet  = 26;
const dimensionMessage   = 64;
const dimensionLMarquage = 22;
const dimensionHMarquage = 32;

const hauteurMarquage    = 30; // 23 en mobileApp
const largeurMarquage    =  6; //  8 en mobileApp
const hauteurDemiHexa    = 30; // 23 en mobileApp
const largeurDemiHexa    = 34; // 26 en mobileApp
const largeurCoteHexa    = 17; // 13 en mobileApp

// Codes ASCII
const charCodeMin        = 64;

// Clics (pour fonction activeClicBouton)
const numClicJoueurs     = 27; // (27~29 : 2, 3 et 6 joueurs)
const numClicChoixJeu    = 31; // (31~34 : Effacer, Tout Effacer, Placer, Passer)
const numClicChoixPlc    = 34; // (34~35 : Passer, Retour) en phase case départ et direction  
const numClicMotsFormes  = 36; // 36 = Continuer
const numClicJoueurSvt   = 37; // 37 = "Joueur suivant" ou "Oui, je passe mon tour" ; 38 = "Non, je ne passe pas mon tour" (phase Confrmation) ou "Statistiques"
const numClicPoursuivre  = 39; // 39 = "Poursuivre la partie" ; 40 = "Nouvelle Partie" ; 41 = "Tutoriel" ; 42 = "À propos"
const numClicNvPartie    = 40;
const numClicOk          = 43; // 43 = "ok"
const numClicTutoriel    = 44; // 44 = Tutoriel:Arrière "<<" ; 45 = Tutoriel:Terminer "X" ; 46 = Tutoriel:Suite ">>"
const numClicTutoriel0   = 45;

// Clics (pour fonction clic)
const deuxJoueurs        = 27;
const troisJoueurs       = 28;
const sixJoueurs         = 29;
const effacer            = 31;
const toutEffacer        = 32;
const placer             = 33;
const passer             = 34;
const retour             = 35;
const motSuivant         = 36;
const joueurSvt          = 37;
const pasPasserStat      = 38;
const poursuivre         = 39;
const nvPartie           = 40;
const tutoriel           = 41;
const aPropos            = 42;
const ok                 = 43;
const arriere            = 44;
const terminer           = 45;
const suite              = 46;

// Chaînes PNG 
const chmPng             = 'png/';
const demiVide           = 'hns';
const coteVide           = 'cns';
const marquageVide       = 'm0';
const fondBoutonVide     = 'f0';
const prefixeMarquage    = 'm';
const prefixeFondBouton  = 'fb';
const extPng             = '.png';
const zeroNoir           = '0n';
const clicDeb            = 'clic(';
const clicFin            = ')';
const apostrophe         = 'apostrophe';
const tiret              = 'tiret'
const moins              = 'moins'
const plus               = 'plus';
const petitO             = 'po';
const fleche             = 'fleche';
const virgule            = 'virgule';
const point              = 'point';
const deuxpoints         = 'deuxpoints';
const slash              = 'slash';
const pourcent           = 'pourcent';
const guillemetG         = 'guillemetG';
const guillemetD         = 'guillemetD';
const sablier			 = 'sablier'; // v1.3.1

// attributs DOM
const onClick            = 'onClick';
const src                = 'src';
const width              = 'width';
const height             = 'height';

// prefixes images png
const coteHexaTrnsprt    = 'cns';
const coteHexaFndNoir    = 'cns0';
const demiHexaFndNoir    = 'hns0'; // v1.3.1

// identifiants localStorage
// - variables globales de jeu
const lsTour             = 'tour';
const lsJoueur           = 'joueur';
const lsJoueurs          = 'joueurs';
const lsToursPasses      = 'toursPasses';
const lsAnnonceFinTour   = 'annonceFinTour';
const lsPhase            = 'phase';
const lsLettresAPlacer   = 'lettresAPlacer';
const lsPosPrmLAPlacer   = 'posPrmLAPlacer';
const lsMotsFormes       = 'motsFormes';

// - structures
const lsMF               = 'mf';
const lsPLT              = 'plt';
const lsSIT              = 'sit';
const lsJEU              = 'jeu';
const lsDEPART           = 'depart';
// - lettres jouables
const lsLJiD             = 'lj.iD';
const lsLJiF             = 'lj.iF';
const lsLJiFMin          = 'lj.iFMin';
// - mots formés
const lsPtX              = '.x';
const lsPtY              = '.y';
const lsPtD              = '.d';
const lsPtMot            = '.mot';
const lsPtMotFAA         = '.motFAA';
const lsPtPts            = '.pts';
const lsPtPJ             = '.pj';
const lsPtPP             = '.pp';
const lsPtLP             = '.lp';
// - cases plateau
const lsPtL              = '.l';
const lsPtS              = '.s';
const lsPtJ              = '.j';
const lsPtT              = '.t';
const lsPtMF             = '.mf';
// - situation joueur
const lsPtScore          = '.score';
const lsPtJetons         = '.jetons';
const lsPtPointsJetons   = '.pointsJetons';
const lsPtLettresAchetees= '.lettresAchetees';
const lsPtPointsPayes    = '.pointsPayes';
const lsPtPointsGagnes   = '.pointsGagnes';
const lsPtLettresGagnees = '.lettresGagnees';
const lsPtPointsPerdus   = '.pointsPerdus';
const lsPtLettresPerdues = '.lettresPerdues';

// Types
const typePhase = new creeTypePhase();

//---------------------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------

// VARIABLES SAUVEGARDEES
var joueurs = 0; // joueurs = 2, 3 ou 6
var joueur = 0;  // joueur = 0 (personne), 1..6
var tour = 0;    // tour = 0 (pas de jeu), 1...

// VARIABLES SAUVEGARDEES
// instances utilisée dans les fonctions IA "lettresJouables" et "chercheMots"
var lj = new creeTypeLettresJouables();
var mf = []; // Mots formés : mot (stMot), coordonnées (x,y) et direction (d)
var motsFormes = 0;

//---------------------------------------------------------------------------
// interface
//---------------------------------------------------------------------------

// VARIABLE A SAUVEGARDER
var phase = typePhase.phHorsJeu; 

// Phase "Choix des lettres à placer" (variables utilisées pour afficher les lettres choisies à être placer sur le plateau de jeu)
// variable NON sauvegardée 
var posPrmLettreAPlacer = 0; 
// VARIABLE SAUVEGARDEE
var stLettresAPlacer = ''; // lettres choisies (en forme de chaîne)

// Phase "Choix case départ" et "Choix Direction"
// 3 VARIABLES SAUVEGARDEES
var xDepart = indefini;
var yDepart = indefini;
var dDepart = typeDir.dIndefinie;

// Phase "Comptabilisation"
// VARIABLE SAUVEGARDEE
var iMotForme = 0;
// plt[x][y].l  = lettre du plateau (' '=case vide, 'A'~'Z'=lettre)
// plt[x][y].s  = score de la lettre
// plt[x][y].j  = couleur du joueur (0=case vide, 1...6)
// plt[x][y].t  = tour de pose (0=case vide; 1=premier tour...)
// plt[x][y].mf = indicateur de mot formé montré (en blanc) lors du décompte
// (x,y) = (1..15, 1..15) plt[0][y] et plt[x][0] qqs x,y ne sont pas utilisés 
var plt = [];
// VARIABLE NON SAUVEGARDEE car CALCULEE au chargement du plateau
var casesLibres = 0;
// 2 VARIABLES SAUVEGARDEES
var toursPasses = 0;
var annonceFinTour = false; 
// variable NON sauvegardée
var ligneMarquage = 0; // indique la prochaine ligne de l'événement (placement de mot, comptage de points et achat lettre)

// NON SAUVEGARDEE (comme toute l'étape tutoriel)
var etapeTutoriel = 0; // 
// jeu[j][l] = nombre d'exemplaires de la lettre (0, 1...)
// j = 0 (total), 1..6 (joueur) ; l=' ' (total), 'A'..'Z' (lettre)
// STRUCTURE SAUVEGARDEE
var jeu = [];

// sit[j] = scores (statistiques) (j) = (1..6)
// STRUCTURE SAUVEGARDEE
var sit = [];

//---------------------------------------------------------------------------
// FONCTIONS
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// ia
//---------------------------------------------------------------------------

function creeTypeDirection()
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
function creeTypeLettresJouables()
{
    // propriétés 
	this.iD = 0;
	this.iF = 0;
	this.iFMin = 0;
    // méthodes
    this.charge = lettresJouablesCharge;
    this.sauve  = lettresJouablesSauve;
}
//---------------------------------------------------------------------------
function lettresJouablesCharge()
{
    this.iD     = parseInt(localStorage.getItem(lsLJiD), 10);
    this.iF     = parseInt(localStorage.getItem(lsLJiF), 10);
    this.iFMin  = parseInt(localStorage.getItem(lsLJiFMin), 10);
}
//---------------------------------------------------------------------------
function lettresJouablesSauve()
{
    localStorage.setItem(lsLJiD, this.iD);
    localStorage.setItem(lsLJiF, this.iF);
    localStorage.setItem(lsLJiFMin, this.iFMin);
}
//---------------------------------------------------------------------------
function creeMotForme(stMot, x, y, d)
{
    // Propriétés
    this.stMot = stMot;
    this.stMotFormeAAfficher = ''; // défini par calculeMotFormeAAfficher
    this.x = x;
    this.y = y;
    this.d = d;
    // définies lors de la comptabilisation 
    this.pts = 0; // points marqués par ce mot (=taille) 
    this.pj = 0;  // points incrémentés sur les lettres propres
    this.pp = 0;  // points décrémentés sur les lettres adverses
    this.lp = 0;  // lettresprises à l'adversaire
    // Méthodes
    this.calculeMotFormeAAfficher = calculeMotFormeAAfficher;
    this.comptabiliseMotForme = comptabiliseMotForme;
    this.stEvenement = stEvenement;
    this.montreMotForme = montreMotForme;
    this.masqueMotForme = masqueMotForme;
    this.charge = chargeMotForme;
    this.sauve = sauveMotForme;

    // sauvegarde
    this.sauve(motsFormes);
    // incrémentation
    motsFormes++;
    localStorage.setItem(lsMotsFormes, motsFormes);
}
//---------------------------------------------------------------------------
function chargeMotForme(i)
{
    // propriétés
    this.x                   = parseInt( localStorage.getItem(lsMF + i + lsPtX), 10);
    this.y                   = parseInt( localStorage.getItem(lsMF + i + lsPtY), 10);
    this.d                   = parseInt( localStorage.getItem(lsMF + i + lsPtD), 10);
    this.stMot               =           localStorage.getItem(lsMF + i + lsPtMot);
    this.stMotFormeAAfficher =           localStorage.getItem(lsMF + i + lsPtMotFAA);
    this.pts                 = parseInt( localStorage.getItem(lsMF + i + lsPtPts), 10);
    this.pj                  = parseInt( localStorage.getItem(lsMF + i + lsPtPJ), 10);
    this.pp                  = parseInt( localStorage.getItem(lsMF + i + lsPtPP), 10);
    this.lp                  = parseInt( localStorage.getItem(lsMF + i + lsPtLP), 10);
    // Méthodes
    this.calculeMotFormeAAfficher = calculeMotFormeAAfficher;
    this.comptabiliseMotForme = comptabiliseMotForme;
    this.stEvenement = stEvenement;
    this.montreMotForme = montreMotForme;
    this.masqueMotForme = masqueMotForme;
    this.charge = chargeMotForme;
    this.sauve  = sauveMotForme;
}
//---------------------------------------------------------------------------
function sauveMotForme(i)
{
    localStorage.setItem(lsMF + i + lsPtX, this.x);
    localStorage.setItem(lsMF + i + lsPtY, this.y);
    localStorage.setItem(lsMF + i + lsPtD, this.d);
    localStorage.setItem(lsMF + i + lsPtMot, this.stMot);
    localStorage.setItem(lsMF + i + lsPtMotFAA, this.stMotFormeAAfficher);
    localStorage.setItem(lsMF + i + lsPtPts, this.pts);
    localStorage.setItem(lsMF + i + lsPtPJ, this.pj);
    localStorage.setItem(lsMF + i + lsPtPP, this.pp);
    localStorage.setItem(lsMF + i + lsPtLP, this.lp);
}
//---------------------------------------------------------------------------
function stEvenement()
{
    var couleur=coul[colj[joueurs][joueur]];
    this.calculeMotFormeAAfficher();
    return  couleur+
            this.stMotFormeAAfficher+couleur+
            ' '+
            String.fromCharCode(charCodeMin+this.x)+
            String.fromCharCode(charCodeMin+this.y)+
            ' '+stDir[this.d];
}
//---------------------------------------------------------------------------
// (x,y) dans (1~15,1~15) et d une direction (TypeDir)
// d et k sont facultatifs (resp. typeDir.dIndefinie et 1 par défaut)
function estValide(x, y, k, d)
{
    if (d==undefined) d=typeDir.dIndefinie;
    if (k==undefined) k=1;
    var xx = x+k*dx[d];
    var yy = y+k*dy[d];
    if ((xx<1)||(yy<1)||(xx>15)||(yy>15)) 
        return false;
    if (xx<9)
        if (yy-xx<8)
            return true;
        else
            return false;
    else
        if (xx-yy<8)
            return true;
        else
            return false;
}
//---------------------------------------------------------------------------
function chercheMots() // retourne un booléen
// bool plateau::ChercheMots(int xd, int yd, direction d, int iFMin, int iD, int iF)
// correspond ici à         xDepart,yDepart,     dDepart,  lj.iFMin,  lj.iD,  lj.iF 
 {
  var iFMax=lj.iFMin-1;
  var motRenverse=false;
  var positionOk = (tour == 1); // Il faut une lettre de même camp déjà posée qui participe à au moins un mot sauf au premier tour
  var stMot='';
  motsFormes=0; // variable globale
  // Tout d'abord les mots principaux (dans l'axe de la direction choisie)
  for(var i=lj.iD; i<=0; i++)
   {
    var existe=false;
    for(var j=Math.min(i+lettresMaxMotDico-1,lj.iF); (!existe)&&(j>=Math.max(i+lettresMinMotDico-1,iFMax+1)); j--)
     {
      var lettreMemeCampTrv=positionOk;
      stMot='';
      for(var k=i; k<=j; k++)
       {
        var xx=xDepart+k*dx[dDepart];
        var yy=yDepart+k*dy[dDepart];
        stMot=stMot+plt[xx][yy].l;
        if ((plt[xx][yy].j == joueur)&&
            (plt[xx][yy].t < tour)) // Lettre même camp déjà posée
                lettreMemeCampTrv = true;
       }
      if (stMot.length>1)
       {
        motRenverse=false;
        existe=estDansLeDico(stMot);
        if (!existe)
         { // Si le mot n'existe pas on regarde le mot renversé
          stMot='';
          for(var k=j; k>=i; k--)
           {
            var xx = xDepart + k*dx[dDepart];
            var yy = yDepart + k*dy[dDepart];
            stMot = stMot + plt[xx][yy].l;
           }
          motRenverse=true;
          existe=estDansLeDico(stMot);
         }
        if (existe)
         {
          if (lettreMemeCampTrv)  
            positionOk=true;
          iFMax=Math.max(iFMax,j);
          var km=(motRenverse?j:i);
          var dm=(motRenverse?invDir[dDepart]:dDepart);
          // On enregistre le mot formé
          mf[motsFormes] = new creeMotForme(stMot, xDepart+km*dx[dDepart], yDepart+km*dy[dDepart], dm);
         }
       }
     }
   }

  // Cas de sortie
  if (!motsFormes) // Les lettres placées ne permettent pas de former un mot valide.",
   {
    afficheMessage(a, 'PAS DE MOT VALIDE AVEC LA POSE DE <'+stLettresAPlacer+'>.');
    return false;
   }
  if (!positionOk) // Au moins une lettre déjà placée de votre camp doit participer à la formation du mot principal.
   {
    afficheMessage(a, 'TU DOIS UTILISER AU MOINS UNE DE TES LETTRES DEJA POSEES.');
    return false;
   }

  // Ensuite les autres directions à partir des lettres posées uniquement
  for(var il=0; il<=lj.iFMin; il++)
   {
    var xv=xDepart+il*dx[dDepart];
    var yv=yDepart+il*dy[dDepart];
    if (plt[xv][yv].estLettrePosee())
     {
      for(var dv=typeDir.d0h; dv<=typeDir.d4h; dv++)
       if ((dv!=dDepart)&&(dv!=invDir[dDepart])) // Direction en dehors de l'axe du mot principal
        {
         // On détermine les limites de recherche
         var iDv, iFv;
         var iFvMax=indefini;
         for( iDv=0;
              estValide(xv,yv,iDv-1,dv)&&(plt[xv+(iDv-1)*dx[dv]][yv+(iDv-1)*dy[dv]].l!=espace)&&(iDv>-lettresMaxMotDico);
              iDv--);
         for( iFv=0;
              estValide(xv,yv,iFv+1,dv)&&(plt[xv+(iFv+1)*dx[dv]][yv+(iFv+1)*dy[dv]].l!=espace)&&(iFv<lettresMaxMotDico);
              iFv++);
         for(var i=iDv; i<=0; i++)
          {
           var existe=false;
           for(var j=Math.min(i+lettresMaxMotDico-1,iFv); (!existe)&&(j>=Math.max(i+lettresMinMotDico-1,iFvMax+1)); j--)
            {
             stMot='';
             for(var k=i; k<=j; k++)
              stMot=stMot+plt[xv+k*dx[dv]][yv+k*dy[dv]].l;
             if (stMot.length>1)
              {
               motRenverse=false;
               existe=estDansLeDico(stMot);
               if (!existe)
                { // Si le mot n'existe pas on regarde le mot renversé
                 stMot='';
                 for(var k=j; k>=i; k--)
                  stMot=stMot+plt[xv+k*dx[dv]][yv+k*dy[dv]].l;
                 motRenverse=true;
                 existe=estDansLeDico(stMot);
                }
               if (existe)
                {
                 iFvMax=Math.max(iFvMax,j);
                 var km=(motRenverse?j:i);
                 var dm=(motRenverse?invDir[dv]:dv);
                 mf[motsFormes] = new creeMotForme(stMot, xv+km*dx[dv], yv+km*dy[dv], dm);
                }
              }
            }
          }
        }
     }
   }
  return true;
 }
//---------------------------------------------------------------------------
function lettresJouables() // retourne un booléen
// const AnsiString asLettresAPlacer, xd,      yd,  direction d, int &iFMin, int &iD, int &iF
// correspond ici à stLettresAPlacer, xDepart, yDepart, dDepart,   lj.iFMin,   lj.iD,   lj.iF
 { // Si le mot existe id et if donnent les index des premières et dernières lettres (h[xd][yd] a l'index 0, >>> dans la d).
  var l = stLettresAPlacer.length;
  var lettresDejaPlacees = 0;
  var positionOk = true; // Toutes les lettres posées doivent être sur le plateau
  lj.iFMin=0; // Index minimal de la lettre initiale du mot principal (qui est celui de la première lettre placée)
  lettresDejaPlacees=0;
  // On recherche d'abord la fin potentielle du mot principal (iF)
  for(var i=0; positionOk&&(i<l); i++)
   {
    while((positionOk=estValide(xDepart, yDepart, i+lettresDejaPlacees, dDepart))&&
          plt[xDepart+(i+lettresDejaPlacees)*dx[dDepart]]
             [yDepart+(i+lettresDejaPlacees)*dy[dDepart]].l!=espace)
     lettresDejaPlacees++;
    if (positionOk)
     lj.iFMin=i+lettresDejaPlacees;
   }
  if (!positionOk) // Il n'est pas possible de placer toutes les lettres sur le plateau depuis la case et dans la direction choisies.",
    return false;
  // On recherche maintenant la fin potentielle du mot principal (iF) en avant par rapport à la dernière lettre posée
  for( lj.iF=lj.iFMin;
       estValide(xDepart, yDepart, lj.iF+1, dDepart)&&
       (plt[xDepart+(lj.iF+1)*dx[dDepart]]
           [yDepart+(lj.iF+1)*dy[dDepart]].l!=espace);
       lj.iF++);
  // On recherche maintenant le début potentiel du mot principal (iD) en arrière par rapport à la case choisie
  for( lj.iD=0;
       estValide(xDepart, yDepart, lj.iD-1, dDepart)&&
       (plt[xDepart+(lj.iD-1)*dx[dDepart]]
           [yDepart+(lj.iD-1)*dy[dDepart]].l!=espace);
       lj.iD--);
  lj.sauve();
  return true;
 }
//---------------------------------------------------------------------------
function comptabiliseMotFormeLettre(x, y) 
{
    // Score du joueur +1
    mf[iMotForme].pts++;
    sit[joueur].score[tour]++; sit[joueur].score[0]++;

    if (plt[x][y].j==joueur) { // La lettre est propre
        // Score de la lettre +1
        plt[x][y].s++;
        // => Points sur les jetons posés +1
        mf[iMotForme].pj++;
        sit[joueur].pointsJetons[tour]++; sit[joueur].pointsJetons[0]++;
    }
    else { // La lettre appartient à l'adversaire
        var adversaire=plt[x][y].j;
        if (plt[x][y].s) {
            // Score de la lettre -1
            plt[x][y].s--;
            // => Points sur les jetons (adverses) posés -1    
            sit[adversaire].pointsJetons[tour]--; sit[adversaire].pointsJetons[0]--;
        
            // Points gagnés sur l'adversaire et Points perdus par l'adversaire
            mf[iMotForme].pp++;
            sit[joueur].pointsGagnes[adversaire][tour]++;  sit[joueur].pointsGagnes[adversaire][0]++; sit[joueur].pointsGagnes[0][tour]++;      sit[joueur].pointsGagnes[0][0]++;
            sit[adversaire].pointsPerdus[joueur][tour]++;  sit[adversaire].pointsPerdus[joueur][0]++; sit[adversaire].pointsPerdus[0][tour]++;  sit[adversaire].pointsPerdus[0][0]++;
        }
        else { // L'adversaire perd une lettre
            // Changement de propriétaire
            plt[x][y].j=joueur; 
            // Score de la lettre +1
            plt[x][y].s++;
            // => Points sur les jetons posés +1. Sauf marquage par mot car PTS=[PJ]+[P+]+[L+] (répartition par nature des points)
            sit[joueur].pointsJetons[tour]++; sit[joueur].pointsJetons[0]++;

            // Lettres gagnées sur l'adversaire et Lettres perdues par l'adversaire
            mf[iMotForme].lp++;
            sit[joueur].lettresGagnees[adversaire][tour]++;     sit[joueur].lettresGagnees[adversaire][0]++; sit[joueur].lettresGagnees[0][tour]++;     sit[joueur].lettresGagnees[0][0]++;
            sit[adversaire].lettresPerdues[joueur][tour]++;     sit[adversaire].lettresPerdues[joueur][0]++; sit[adversaire].lettresPerdues[0][tour]++; sit[adversaire].lettresPerdues[0][0]++;
            // => Nombres de jetons posés +1/-1
            sit[joueur].poseLettre(); sit[adversaire].retireLettre();
        }
        sit[adversaire].sauve(adversaire);
   }
   plt[x][y].sauve(x, y);
   sit[joueur].sauve(joueur);
   // majCasePlateau(x, y); // On ne rafraîchit qu'au moment où l'on masque le mot 
}
//---------------------------------------------------------------------------
function comptabiliseMotForme()
{
    for(var i=0; i<this.stMot.length; i++)
        comptabiliseMotFormeLettre(this.x + i*dx[this.d], this.y + i*dy[this.d]);
 }
//---------------------------------------------------------------------------
function existeLettresAAcheter()
{
    var lettreTrouvee=false;
    for(var x=1; (!lettreTrouvee)&&(x<=dimensionPlateau); x++)
        for(var y=1; (!lettreTrouvee)&&(y<=dimensionPlateau); y++)
            if (estValide(x, y)) {
                if ((plt[x][y].j==joueur)&&(plt[x][y].s>=val[plt[x][y].l.charCodeAt()-charCodeMin]))
                    lettreTrouvee=true;
            }
    if (lettreTrouvee)
        return true;
    else
        return false;
}
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// INTERFACE
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// constructeurs & initialisateurs
//---------------------------------------------------------------------------
function creeTypePhase()
{
    this.phHorsJeu                      = 0;
    this.phPlacementChoixLettres        = 1;
    this.phPlacementChoixCaseDepart     = 2;
    this.phPlacementChoixDirection      = 3;
    this.phPlacementComptabilisation    = 4;
    this.phAchatLettres                 = 5;
    this.phConfirmation                 = 6;
    this.phTutoriel                     = 7;
}
//---------------------------------------------------------------------------
function creeCase() 
{
    // propriétés
    this.l = espace; // lettre
    this.s = 0;   // score
    this.j = 0;   // joueur
    this.t = 0;   // tour
    this.mf = false; // indicateur de mot formé montré
    casesLibres++;   // Compteur de cases libres
    // méthodes
    this.poseLettre = poseLettrePlateau; // casesLibres--
    this.retireLettre = retireLettrePlateau; // casesLibres++
    this.estLettrePosee = estLettrePosee; // true si lettre joueur posée (pour fonction retireLettres)
    this.charge = casePlateauCharge;
    this.sauve = casePlateauSauve;
}
//---------------------------------------------------------------------------
function casePlateauCharge(x, y)
{
    var prefixe = lsPLT + String.fromCharCode(charCodeMin+x) + String.fromCharCode(charCodeMin+y);
    // propriétés
    this.l = localStorage.getItem(prefixe + lsPtL);
    this.s = parseInt(localStorage.getItem(prefixe + lsPtS), 10);
    this.j = parseInt(localStorage.getItem(prefixe + lsPtJ), 10);
    this.t = parseInt(localStorage.getItem(prefixe + lsPtT), 10);
    if (localStorage.getItem(prefixe + lsPtMF)==stTrue)
        this.mf = true;
    else
        this.mf = false;
    if (this.l == espace) 
        casesLibres++;   // Compteur de cases libres
    // méthodes
    this.poseLettre = poseLettrePlateau; // casesLibres--
    this.retireLettre = retireLettrePlateau; // casesLibres++
    this.estLettrePosee = estLettrePosee; // true si lettre joueur posée (pour fonction retireLettres)
    this.charge = casePlateauCharge;
    this.sauve = casePlateauSauve;
}
//---------------------------------------------------------------------------
function casePlateauSauve(x, y)
{
    var prefixe = lsPLT + String.fromCharCode(charCodeMin+x) + String.fromCharCode(charCodeMin+y);
    localStorage.setItem(prefixe + lsPtL, this.l);
    localStorage.setItem(prefixe + lsPtS, this.s);
    localStorage.setItem(prefixe + lsPtJ, this.j);
    localStorage.setItem(prefixe + lsPtT, this.t);
    localStorage.setItem(prefixe + lsPtMF, this.mf);
}
//---------------------------------------------------------------------------
function initialisePlateau()
{
    casesLibres = 0;
	plt = new Array();
	for(var x=1; x<=dimensionPlateau; x++) {
		plt[x] = new Array();
		for(var y=1; y<=dimensionPlateau; y++)
			if (estValide(x, y)) {
                plt[x][y] = new creeCase();
                plt[x][y].sauve(x, y);
                majCasePlateau(x, y);
            }
	}
}
//---------------------------------------------------------------------------
function chargeJeuJoueurLettre(j, lettre)
{
    if (lettre == espace)
        jeu[j][espace] = parseInt(localStorage.getItem(lsJEU + j), 10);
    else
        jeu[j][lettre] = parseInt(localStorage.getItem(lsJEU + j + lettre), 10);
}
//---------------------------------------------------------------------------
function sauveJeuJoueurLettre(j, lettre)
{
    if (lettre == espace)
        localStorage.setItem(lsJEU + j, jeu[j][espace]);
    else
        localStorage.setItem(lsJEU + j + lettre, jeu[j][lettre]);
}
//---------------------------------------------------------------------------
function initialiseJeux()
{
	jeu = new Array(joueurs);
	for(var j=0; j<=joueurs; j++) {
		jeu[j] = new Array(dimensionChevalet);
        jeu[j][espace] = 0;
        for(var l=1; l<=dimensionChevalet; l++) {
            var lettre = String.fromCharCode(charCodeMin+l);
            jeu[j][lettre] = val[l];
            jeu[j][espace] += val[l];
            jeu[0][lettre] += val[l];
            jeu[0][espace] += val[l];
            sauveJeuJoueurLettre(j, lettre);
        }
        sauveJeuJoueurLettre(j, espace);
	}
    for(var l=1; l<=dimensionChevalet; l++) { // On sauvegarde à nouveau jeu[0][l] pour avoir les totaux à jour
        var lettre = String.fromCharCode(charCodeMin+l);
        sauveJeuJoueurLettre(0, lettre); 
    }
}

//---------------------------------------------------------------------------
// autres fonctions 
//---------------------------------------------------------------------------

function masqueMotForme()
{
    for(var i=0; i<this.stMot.length; i++) {
        var xx = this.x + i*dx[this.d];
        var yy = this.y + i*dy[this.d];
        plt[xx][yy].mf = false;
        plt[xx][yy].sauve(xx, yy);
        majCasePlateau(xx, yy);
    }
}
//---------------------------------------------------------------------------
function calculeMotFormeAAfficher()
{
    this.stMotFormeAAfficher = '';
    for(var i=0; i<this.stMot.length; i++) {
        var xx = this.x + i*dx[this.d];
        var yy = this.y + i*dy[this.d];
        if (plt[xx][yy].estLettrePosee())
            this.stMotFormeAAfficher = this.stMotFormeAAfficher + gris;
        else
            this.stMotFormeAAfficher = this.stMotFormeAAfficher + coul[colj[joueurs][plt[xx][yy].j]];
        this.stMotFormeAAfficher = this.stMotFormeAAfficher + plt[xx][yy].l;
    }
}
//---------------------------------------------------------------------------
function montreMotForme()
{
    for(var i=0; i<this.stMot.length; i++) {
        var xx = this.x + i*dx[this.d];
        var yy = this.y + i*dy[this.d];
        plt[xx][yy].mf = true;
        plt[xx][yy].sauve(xx, yy);
        majCasePlateau(xx, yy);
    }
    this.calculeMotFormeAAfficher(); // Affecte stMotFormeAAfficher pour fonction afficheMarquage avec couleur selon situation des lettres avant comptabilisation
    this.comptabiliseMotForme();
    this.sauve(iMotForme);
    afficheMarquageMot(iMotForme);
    afficheMessage(a, 'TU FORMES LE MOT <'+this.stMot+'>...');
    afficheMessage(b, '[ CONTINUER ]', 1, numClicMotsFormes);
}
//---------------------------------------------------------------------------
function afficheMarquageMotsFormesPrecedents()
{
    afficheEvenement(mf[0].stEvenement());
    for(var i=0; i<=iMotForme; i++)
        afficheMarquageMot(i);
}
//---------------------------------------------------------------------------
function creeSituationJoueur()
{
    // propriété[0] = total. propriété[t] = au tour t (t>0)
    this.score = new Array(); // score (nombre de points marqué à chaque tour : 1 point par jeton et mot formé)
    this.score[0] = 0; // initialisation du score total (affiché en haut à droite dans la colonne PTS)
    this.jetons = new Array(); // Nombre de jetons sur le plateau de la couleur du joueur (y compris jetons à 0)
    this.jetons[0] = 0; // initialisation du nombre total de jetons (colonne NJ)
    this.pointsJetons = new Array(); // Nombre de points engrangés sur les jetons du joueur
    this.pointsJetons[0] = 0; // initialisation du nombre de total de points (Colonne PJ)
    this.lettresAchetees = new Array(); // Nombre de lettres achetées (colonne LA)
    this.lettresAchetees[0] = 0; // initialisation du nombre de lettres (pas affiché)
    this.pointsPayes = new Array(); // Nombre de points payés pour acheter une lettre (colonne PP)
    this.pointsPayes[0] = 0; // initialisation du nombre total de points (pas affiché) 
    
    // propriété[j][t] j=joueur 1..6 et t=tour. 0 représente le total aussi bien pour les joueurs que les tours
    // propriété[j][0] est le total pour l'adversaire j tout tour confondu
    // propriété[0][t] est le total pour le tour t tout adversaire confondu
    // propriété[0][0] est le total général 
    this.pointsGagnes = new Array(joueurs+1); // Nombre de points pris (décrémentés) sur les jetons adverses
    for(var j=0; j<=joueurs; j++) {
        this.pointsGagnes[j] = new Array();
        this.pointsGagnes[j][0] = 0; // initialisation du nombre total de points (colonne P+)
    }

    this.lettresGagnees = new Array(joueurs+1); // Nombre de lettres adverses prises (qui ont pris la couleur du joueur)
    for(var j=0; j<=joueurs; j++) {
        this.lettresGagnees[j] = new Array();
        this.lettresGagnees[j][0] = 0; // initialisation du nombre total de lettres (colonne L+) 
    }
    
    this.pointsPerdus = new Array(joueurs+1); // Nombre de points pris (décrémentés) par l'adversaire sur les jetons propres
    for(var j=0; j<=joueurs; j++) {
        this.pointsPerdus[j] = new Array();
        this.pointsPerdus[j][0] = 0; // initialisation du nombre total de points (colonne P-)
    }

    this.lettresPerdues = new Array(joueurs+1); // Nombre de lettres prises par l'adversaire
    for(var j=0; j<=joueurs; j++) {
        this.lettresPerdues[j] = new Array();
        this.lettresPerdues[j][0] = 0; // initialisation du nombre total de lettres (colonne L-) 
    }
    
    // méthodes
    this.initialiseTour = initialiseTour; // Initialise les tableaux par tour
    this.sauveDebutTour = sauveSituationJoueurDebutTour; // Sauvegarde le début du tour
    this.poseLettre = poseLettre; // 1 lettre posée sur le plateau de jeu
    this.retireLettre = retireLettre; // 1 lettre retirée du plateau de jeu (pose invalide)
    this.acheteLettre = acheteLettre; // incrémente le nombre de points payés et d'exemplaires dans le jeu 
    this.afficheStats = afficheStats; 
    this.charge = chargeSituationJoueur;
    this.sauve  = sauveSituationJoueur;
}
//---------------------------------------------------------------------------
function chargeSituationJoueur(j)
{
    var prefixe = lsSIT + j;
    // propriétés
    this.score = new Array(); 
    this.jetons = new Array(); 
    this.pointsJetons = new Array(); 
    this.lettresAchetees = new Array(); 
    this.pointsPayes = new Array(); 
    for(var t=0; t<=tour; t++) {
        this.score[t] = parseInt(localStorage.getItem(prefixe + lsPtScore + t), 10);
        this.jetons[t] = parseInt(localStorage.getItem(prefixe + lsPtJetons + t), 10);         
        this.pointsJetons[t] = parseInt(localStorage.getItem(prefixe + lsPtPointsJetons + t), 10);   
        this.lettresAchetees[t] = parseInt(localStorage.getItem(prefixe + lsPtLettresAchetees + t), 10);
        this.pointsPayes[t] = parseInt(localStorage.getItem(prefixe + lsPtPointsPayes + t), 10);    
    }
    this.pointsGagnes = new Array(joueurs+1); 
    this.lettresGagnees = new Array(joueurs+1);
    this.pointsPerdus = new Array(joueurs+1); 
    this.lettresPerdues = new Array(joueurs+1);
    for(var j=0; j<=joueurs; j++) {
        this.pointsGagnes[j] = new Array();
        this.lettresGagnees[j] = new Array();
        this.pointsPerdus[j] = new Array();
        this.lettresPerdues[j] = new Array();
        for(var t=0; t<=tour; t++) { 
            this.pointsGagnes[j][t] = parseInt(localStorage.getItem(prefixe + lsPtPointsGagnes + j + t), 10);   
            this.lettresGagnees[j][t] = parseInt(localStorage.getItem(prefixe + lsPtLettresGagnees + j + t), 10); 
            this.pointsPerdus[j][t] = parseInt(localStorage.getItem(prefixe + lsPtPointsPerdus + j + t), 10);   
            this.lettresPerdues[j][t] = parseInt(localStorage.getItem(prefixe + lsPtLettresPerdues + j + t), 10); 
        }
    }
    // méthodes
    this.initialiseTour = initialiseTour; // Initialise les tableaux par tour
    this.sauveDebutTour = sauveSituationJoueurDebutTour; // Sauvegarde le début du tour
    this.poseLettre = poseLettre; // 1 lettre posée sur le plateau de jeu
    this.retireLettre = retireLettre; // 1 lettre retirée du plateau de jeu (pose invalide)
    this.acheteLettre = acheteLettre; // incrémente le nombre de points payés et d'exemplaires dans le jeu 
    this.afficheStats = afficheStats; 
    this.charge = chargeSituationJoueur;
    this.sauve  = sauveSituationJoueur;
}
//---------------------------------------------------------------------------
function sauveSituationJoueur(j)
{
    var prefixe = lsSIT + j;
    for(var t=0; t<=tour; t++) {
        localStorage.setItem(prefixe + lsPtScore + t, this.score[t]);
        localStorage.setItem(prefixe + lsPtJetons + t, this.jetons[t]);
        localStorage.setItem(prefixe + lsPtPointsJetons + t, this.pointsJetons[t]);
        localStorage.setItem(prefixe + lsPtLettresAchetees + t, this.lettresAchetees[t]);
        localStorage.setItem(prefixe + lsPtPointsPayes + t, this.pointsPayes[t]);
    }
    for(var j=0; j<=joueurs; j++)
        for(var t=0; t<=tour; t++) { 
            localStorage.setItem(prefixe + lsPtPointsGagnes + j + t, this.pointsGagnes[j][t]);
            localStorage.setItem(prefixe + lsPtLettresGagnees + j + t, this.lettresGagnees[j][t]);
            localStorage.setItem(prefixe + lsPtPointsPerdus + j + t, this.pointsPerdus[j][t]);
            localStorage.setItem(prefixe + lsPtLettresPerdues + j + t, this.lettresPerdues[j][t]);
        }
}
//---------------------------------------------------------------------------
function sauveSituationJoueurDebutTour(j)
{
    var prefixe = lsSIT + j;
    localStorage.setItem(prefixe + lsPtScore + tour, this.score[tour]);
    localStorage.setItem(prefixe + lsPtJetons + tour, this.jetons[tour]);
    localStorage.setItem(prefixe + lsPtPointsJetons + tour, this.pointsJetons[tour]);
    localStorage.setItem(prefixe + lsPtLettresAchetees + tour, this.lettresAchetees[tour]);
    localStorage.setItem(prefixe + lsPtPointsPayes + tour, this.pointsPayes[tour]);
    for(var j=0; j<=joueurs; j++) { 
        localStorage.setItem(prefixe + lsPtPointsGagnes + j + tour, this.pointsGagnes[j][tour]);
        localStorage.setItem(prefixe + lsPtLettresGagnees + j + tour, this.lettresGagnees[j][tour]);
        localStorage.setItem(prefixe + lsPtPointsPerdus + j + tour, this.pointsPerdus[j][tour]);
        localStorage.setItem(prefixe + lsPtLettresPerdues + j + tour, this.lettresPerdues[j][tour]);
    }
}
//---------------------------------------------------------------------------
function afficheStats() // suppose que joueurs>2 et tour>1
{
    var pcPP = new Array(joueurs+1);
    var pcLP = new Array(joueurs+1);
    var pcPM = new Array(joueurs+1);
    var pcLM = new Array(joueurs+1);
    var jMaxPP=0;
    var jMaxLP=0;
    var jMaxPM=0; 
    var jMaxLM=0;
    pcPP[0]=0; pcPM[0]=0; 
    pcLP[0]=0; pcLM[0]=0; 
    // calcul des %
    for(var j=1; j<=joueurs; j++) {
        if (j!=joueur) {
            if (this.pointsGagnes[0][0]) {
                pcPP[j]=Math.round((100*this.pointsGagnes[j][0])/this.pointsGagnes[0][0]);
                pcPP[0]+=pcPP[j];
                if ((!jMaxPP)||(pcPP[j]>pcPP[jMaxPP]))
                    jMaxPP=j;
            }
            if (this.lettresGagnees[0][0]) {
                pcLP[j]=Math.round((100*this.lettresGagnees[j][0])/this.lettresGagnees[0][0]);
                pcLP[0]+=pcLP[j];
                if ((!jMaxLP)||(pcLP[j]>pcLP[jMaxLP]))
                    jMaxLP=j;
            }
            if (this.pointsPerdus[0][0]) {
                pcPM[j]=Math.round((100*this.pointsPerdus[j][0])/this.pointsPerdus[0][0]);
                pcPM[0]+=pcPM[j];
                if ((!jMaxPM)||(pcPM[j]>pcPM[jMaxPM]))
                    jMaxPM=j;
            }
            if (this.lettresPerdues[0][0]) {
                pcLM[j]=Math.round((100*this.lettresPerdues[j][0])/this.lettresPerdues[0][0]);
                pcLM[0]+=pcLM[j];
                if ((!jMaxLM)||(pcLM[j]>pcLM[jMaxLM]))
                    jMaxLM=j;
            }
        }
    }
    // vérification total = 100% (sur le plus grand pourcentage) 
    if (this.pointsGagnes[0][0]&&(pcPP[0]!=100))
        pcPP[jMaxPP]+=(100-pcPP[0]);
    if (this.lettresGagnees[0][0]&&(pcLP[0]!=100))
        pcLP[jMaxLP]+=(100-pcLP[0]);
    if (this.pointsPerdus[0][0]&&(pcPM[0]!=100)) 
        pcPM[jMaxPM]+=(100-pcPM[0]);
    if (this.lettresPerdues[0][0]&&(pcLM[0]!=100))
        pcLM[jMaxLM]+=(100-pcLM[0]);
    afficheEvenement(coul[joueur]+'STATISTIQUES  ECHANGES');
    afficheEvenement(coul[joueur]+'  P+   L+   P-   L-');
    for(var j=1; j<=joueurs; j++)
        if (j!=joueur) {
            afficheEvenement(   coul[j]+espace+
                                (this.pointsGagnes[0][0]?stNombre(pcPP[j],3,espace)+pourCent:rien)+espace+
                                (this.lettresGagnees[0][0]?stNombre(pcLP[j],3,espace)+pourCent:rien)+espace+
                                (this.pointsPerdus[0][0]?stNombre(pcPM[j],3,espace)+pourCent:rien)+espace+
                                (this.lettresPerdues[0][0]?stNombre(pcLM[j],3,espace)+pourCent:rien));
        }
    afficheEvenement(   coul[joueur]+espace+
                        stNombre(this.pointsGagnes[0][0],3,espace)+espace+espace+
                        stNombre(this.lettresGagnees[0][0],3,espace)+espace+espace+
                        stNombre(this.pointsPerdus[0][0],3,espace)+espace+espace+
                        stNombre(this.lettresPerdues[0][0],3,espace));
}
//---------------------------------------------------------------------------
function initialiseTour()
{
    this.score[tour]=0;
    this.jetons[tour]=0;
    this.pointsJetons[tour]=0;
    this.lettresAchetees[tour]=0;
    this.pointsPayes[tour]=0;
    for(var j=0; j<=joueurs; j++) {
        this.pointsGagnes[j][tour]=0;
        this.lettresGagnees[j][tour]=0;
        this.pointsPerdus[j][tour]=0;
        this.lettresPerdues[j][tour]=0;
    }    
}
//---------------------------------------------------------------------------
function poseLettre()
{
    this.jetons[tour]++; this.jetons[0]++;
}
//---------------------------------------------------------------------------
function retireLettre()
{
    this.jetons[tour]--; this.jetons[0]--;
}
//---------------------------------------------------------------------------
function acheteLettre(lettre, achat)
{
    this.lettresAchetees[tour]++;   this.lettresAchetees[0]++;
    this.pointsPayes[tour]+=achat;  this.pointsPayes[0]+=achat;
    this.pointsJetons[tour]-=achat; this.pointsJetons[0]-=achat; 

}
//---------------------------------------------------------------------------
function initialiseSituations()
{
    // propriétés
    sit = new Array(joueurs+1)
    // sit[0] n'est pas utilisé
    for(var j=1; j<=joueurs; j++) {
        sit[j]= new creeSituationJoueur();
        sit[j].sauve(j);
    }
}

//---------------------------------------------------------------------------
// x=1..15 y=1..15
function majCasePlateau(x, y)
{
    var nvSrcNord, nvSrcSud;
    var lettre = plt[x][y].l;
    var couleur = blanc; // blanc si mot formé montré ou valeur d'achat de la lettre atteinte
    if (!plt[x][y].mf)
        couleur=coul[colj[joueurs][plt[x][y].j]]; // sinon couleur du joueur
    if (lettre == espace) { // Il n'y a pas de lettre
        nvSrcNord = chmPng + demiVide + extPng;
        nvSrcSud = chmPng + demiVide + extPng;
        if (tour < 2) // Mettons les étoiles ?
            for(var j=1; j<=joueurs; j++) {
                var xx=xcdj[joueurs][j]; 
                var yy=ycdj[joueurs][j]; 
                    if ((x == xx) && (y == yy)) {
                        var c=coul[colj[joueurs][j]];
                        nvSrcNord = chmPng + c + zero + extPng;
                        nvSrcSud = chmPng + c + un + extPng;
                        break;
                    }
            }
    }
    else { // Il y a une lettre 
        nvSrcNord = chmPng + lettre + couleur + extPng;
        if (plt[x][y].s>=val[lettre.charCodeAt()-charCodeMin])
            couleur=blanc;
        if ((!plt[x][y].s)&&(!plt[x][y].mf))
            couleur=noir; // Si 0 sur la lettre hors mot formé montré alors affichage du score en noir
        nvSrcSud = chmPng + plt[x][y].s + couleur + extPng; 
    }

    document.images[String.fromCharCode(charCodeMin+x) + String.fromCharCode(charCodeMin+y) + nord].src = nvSrcNord;
    document.images[String.fromCharCode(charCodeMin+x) + String.fromCharCode(charCodeMin+y) + sud].src = nvSrcSud;

}
//---------------------------------------------------------------------------
// lettre = 'A'~'Z'
function majLettreJeu(lettre)
{
    var nvSrc;
    if (jeu[joueur][lettre])
        nvSrc = chmPng + lettre + coul[colj[joueurs][joueur]] + extPng; 
    else // lettres sans exemplaires en noir
        nvSrc = chmPng + lettre + noir + extPng; 
    document.images[lettre+nord].src = nvSrc;
    
    if (jeu[joueur][lettre])
        nvSrc = chmPng + jeu[joueur][lettre] + coul[colj[joueurs][joueur]] + extPng; 
    else // lettres sans exemplaires en noir
        nvSrc = chmPng + zeroNoir + extPng; 
    document.images[lettre+sud].src = nvSrc;    
}
//---------------------------------------------------------------------------
// lettre = 'A'~'Z', delta<0 pour décrémenter et >0 pour incrémenter
function sauveJeuChange(lettre)
{
    sauveJeuJoueurLettre(joueur, lettre);
    sauveJeuJoueurLettre(0, lettre);
    sauveJeuJoueurLettre(joueur, espace);
    sauveJeuJoueurLettre(0, espace);
}
//---------------------------------------------------------------------------
function changeJeu(lettre, delta)
{
    jeu[joueur][lettre]+=delta;
    jeu[0][lettre]+=delta;
    jeu[joueur][espace]+=delta;
    jeu[0][espace]+=delta;
    majLettreJeu(lettre);
    sauveJeuChange(lettre);
}
//---------------------------------------------------------------------------
// usage: majLettreMsg('A'|'B', 0..63, 'A'~'Z','-','.',...). bouton = true | false (par défaut)
function majLettreMsg(ligne, colonne, lettre, bouton)
{
    var nvSrc;
    if (bouton==undefined) 
        bouton = false; // pas de bouton par défaut
    if (lettre == espace)
        if (bouton)
            nvSrc = chmPng + fondBoutonVide + extPng;
        else
            nvSrc = chmPng + coteVide + extPng;
    else {
        if (bouton)
            nvSrc = chmPng + prefixeFondBouton;
        else
            nvSrc = chmPng;
        switch(lettre) {
            case '\'':  nvSrc = nvSrc + apostrophe + extPng; break;
            case '-':   nvSrc = nvSrc + tiret + extPng; break;
            case '+':   nvSrc = nvSrc + plus + extPng; break;
            case ',':   nvSrc = nvSrc + virgule + extPng; break;
            case '.':   nvSrc = nvSrc + point + extPng; break;
            case ':':   nvSrc = nvSrc + deuxpoints + extPng; break;
            case '/':   nvSrc = nvSrc + slash + extPng; break;
            case '<':   nvSrc = nvSrc + guillemetG + extPng; break;
            case '>':   nvSrc = nvSrc + guillemetD + extPng; break;
            default:    nvSrc = nvSrc + lettre + extPng; break;
        }
    }
    document.images[ligne+stNombre(colonne,2)].src = nvSrc;
}
//---------------------------------------------------------------------------
function activeClicBouton(ligne, colonne, numClic)
{
    document.images[ligne+stNombre(colonne,2)].setAttribute(onClick,  clicDeb + numClic + clicFin);
}
//---------------------------------------------------------------------------
function desactiveClicBouton(ligne, colonne)
{
    document.images[ligne+stNombre(colonne,2)].removeAttribute(onClick);
}
//---------------------------------------------------------------------------
// usage: afficheMessage(a|b, message, nombre de boutons, index clic premier bouton) avec message.length <= 64 
function afficheMessage(ligne, stMsg, boutons, numClicPrmBtn) 
{
    if (boutons==undefined) boutons=0;
    if (numClicPrmBtn==undefined) numClicPrmBtn=0;
    stMsg=stMsg.substr(0, dimensionMessage);
    var di=0;
    var bouton = false;
    var i0 = Math.floor((dimensionMessage - (stMsg.length - 2*boutons)) / 2);
    var l = stMsg.length;
    for(var i = 0; i < i0; i++) {
        majLettreMsg(ligne, i, espace); 
        desactiveClicBouton(ligne, i);
    }
    for(var i = 0; i < l; i++)
        switch(stMsg[i]) {
            case '[':   activeClicBouton(ligne, i-di+i0, numClicPrmBtn);
                        di++; bouton=true;
                        break;
            case ']':   di++; bouton=false; numClicPrmBtn++; 
                        break;
            default:    majLettreMsg(ligne, i-di+i0, stMsg[i], bouton); 
                        if (bouton)
                            activeClicBouton(ligne, i-di+i0, numClicPrmBtn);
                        else
                            desactiveClicBouton(ligne, i-di+i0);
                        break;
        }
    for(var i = 0; i < dimensionMessage+di-i0-l; i++) {
        majLettreMsg(ligne, i-di+i0+l, espace); 
        desactiveClicBouton(ligne, i-di+i0+l);
    }
}
//---------------------------------------------------------------------------
function effaceCaractereMarquage(ligne, colonne)
{
    var img;
    img=stNombre(ligne,2)+String.fromCharCode(charCodeMin+colonne+1);
    document.images[img].setAttribute(src,  chmPng + marquageVide + extPng);
}
//---------------------------------------------------------------------------
function afficheCaractereMarquage(ligne, colonne, caractere, suffixeCouleur)
{
    var img;
    if (suffixeCouleur==undefined) {
        suffixeCouleur=blanc; // si pas de couleur spécifiée ou couleur blanche alors utilisation police de messages en blanc 
    }
    if (caractere == espace) 
        effaceCaractereMarquage(ligne, colonne);
    else {
        img=stNombre(ligne,2)+String.fromCharCode(charCodeMin+colonne+1);
        switch(caractere) {
            case '^':   document.images[img].setAttribute(src,  chmPng + prefixeMarquage + fleche    + extPng); // Flèche en blanc seulement
                        break;
            case '-':   document.images[img].setAttribute(src,  chmPng + prefixeMarquage + moins     + suffixeCouleur + extPng);
                        break;
            case '+':   document.images[img].setAttribute(src,  chmPng + prefixeMarquage + plus      + suffixeCouleur + extPng);
                        break;
            case '°':   document.images[img].setAttribute(src,  chmPng + prefixeMarquage + petitO    + suffixeCouleur + extPng);
                        break;
            case '%':   document.images[img].setAttribute(src,  chmPng + prefixeMarquage + pourcent  + suffixeCouleur + extPng);
                        break;
            default:    document.images[img].setAttribute(src,  chmPng + prefixeMarquage + caractere + suffixeCouleur + extPng);
                        break;
        }
    }
}
//---------------------------------------------------------------------------
function afficheMarquage(ligne, stMsg)
{
    var l=stMsg.length;
    var suffixeCouleur=blanc; // blanc par défaut
    var couleursMarquees=0; // compte les marquages de couleurs (lettres en minuscules)
    for(var i=0; i<dimensionLMarquage; i++)
        if (i+couleursMarquees<l) {
            while((1+coul.indexOf(stMsg[i+couleursMarquees]))||
                  (stMsg[i+couleursMarquees]==blanc)) {
                suffixeCouleur=stMsg[i+couleursMarquees];
                couleursMarquees++;
            }
            afficheCaractereMarquage(ligne, i, stMsg[i+couleursMarquees], suffixeCouleur);
        }
        else 
            effaceCaractereMarquage(ligne, i);
}
//---------------------------------------------------------------------------
function afficheEvenement(stMsg)
{
    afficheMarquage(ligneMarquage, stMsg);
    ligneMarquage++;
    if (ligneMarquage==dimensionHMarquage) 
        ligneMarquage=2*joueurs+3;
    afficheMarquage(ligneMarquage, fleches);
}
//---------------------------------------------------------------------------
function activeClics()
{
    // Active le chevalet (1..26)
    for(var i=1; i<=dimensionChevalet; i++) {
            document.images[String.fromCharCode(charCodeMin+i)+nord].setAttribute(onClick,  clicDeb + i + clicFin);
            document.images[String.fromCharCode(charCodeMin+i)+sud].setAttribute(onClick,  clicDeb + i + clicFin);
    }
    // Active les cases du plateau (100..1515)
    for(var x=1; x<=dimensionPlateau; x++)
        for(var y=Math.max(1,x-7); y<=Math.min(15,x+7); y++) {
            var img = String.fromCharCode(charCodeMin+x)+String.fromCharCode(charCodeMin+y);
            document.images[img+nord].setAttribute(onClick,  clicDeb + (100*x+y) + clicFin);
            document.images[img+sud].setAttribute(onClick,  clicDeb + (100*x+y) + clicFin);
        }
}
//---------------------------------------------------------------------------
function afficheEnTeteScoresTour()
{
    afficheMarquage(joueurs+1, 'T'+stNombre(tour, 2)+'  PJ NJ P+ L+ LA PP');
}
//---------------------------------------------------------------------------
function initialiseAffichagePartie()
{
    afficheMarquage(0,    'PTS  PJ NJ P+ L+ P- L-'); 
    for(var j=1; j<=joueurs; j++)
        afficheMarquage(j, coul[colj[joueurs][j]]+'  0   0  0  0  0  0  0');
    afficheEnTeteScoresTour();
    ligneMarquage=2*joueurs+2;
    afficheEvenement(evolutionPartie);
}
//---------------------------------------------------------------------------
function stNombre(nombre, taille, remplissage) // remplissage ='0' par défaut.
{
    if (remplissage==undefined)
        remplissage=zero;
    if (nombre<0)
        remplissage=espace;
    var stNombre='';
    if ((Math.abs(nombre)<100)&&(taille>2)) stNombre=stNombre+remplissage; // v1.3.1 (abs)
    if ((Math.abs(nombre)<10)&&(taille>1)) stNombre=stNombre+remplissage; // v1.3.1 (abs)
    if (nombre<0) {// Attention si nombre<0 : on remplit avec des espaces et un moins
        stNombre=stNombre.substr(0, stNombre.length-1);
        stNombre=stNombre+'-'+Math.floor(Math.abs(nombre));
    }
    else
        stNombre=stNombre+Math.floor(nombre);
    return stNombre;
}
//---------------------------------------------------------------------------
function majScoresJoueur(j) // j = joueur par défaut
{
    if (j==undefined) 
        j=joueur;
    // Score de la partie
    afficheMarquage(    j,
                        coul[colj[joueurs][j]]+
                        stNombre(sit[j].score[0],                3, espace)+espace+
                        stNombre(sit[j].pointsJetons[0],         3, espace)+
                        stNombre(sit[j].jetons[0],               3, espace)+
                        stNombre(sit[j].pointsGagnes[0][0],      3, espace)+
                        stNombre(sit[j].lettresGagnees[0][0],    3, espace)+
                        stNombre(sit[j].pointsPerdus[0][0],      3, espace)+
                        stNombre(sit[j].lettresPerdues[0][0],    3, espace));
    // Score du tour
    afficheMarquage(    joueurs+1+j, 
                        coul[colj[joueurs][j]]+
                        stNombre(sit[j].score[tour],             3, espace)+espace+
                        stNombre(sit[j].pointsJetons[tour],      3, espace)+
                        stNombre(sit[j].jetons[tour],            3, espace)+
                        stNombre(sit[j].pointsGagnes[0][tour],   3, espace)+
                        stNombre(sit[j].lettresGagnees[0][tour], 3, espace)+
                        stNombre(sit[j].lettresAchetees[tour],   3, espace)+
                        stNombre(sit[j].pointsPayes[tour],       3, espace));
}
//---------------------------------------------------------------------------
function majScores()
{
    for(var j=1; j<=joueurs; j++)
        majScoresJoueur(j);
}
//---------------------------------------------------------------------------
function initialiseAffichageTour()
{
    for(var j=1; j<=joueurs; j++) // Affichage tour par ordre de jeu
        afficheMarquage(joueurs+1+j, coul[colj[joueurs][j]]+'  0   0  0  0  0  0  0  0');
    afficheEnTeteScoresTour();
    afficheEvenement('----- TOUR N° '+stNombre(tour,2)+' -----'); 
}
//---------------------------------------------------------------------------
function afficheMarquageMot(iMot) // Utilisable pour afficher les mots précédents
{
    var couleur=coul[colj[joueurs][joueur]];
    var stMotFormeAAfficher = mf[iMot].stMotFormeAAfficher;
    var l=mf[iMot].stMot.length;
    for(var i=0; i<lettresMaxMotDico-l; i++)
        stMotFormeAAfficher = stMotFormeAAfficher + espace;
    if (!iMot)
        afficheEvenement(enteteDetailMot);
    afficheEvenement(   couleur+
                        stMotFormeAAfficher+couleur+
                        stNombre(mf[iMot].pts,2, espace)+
                        stNombre(mf[iMot].pp, 3, espace)+
                        stNombre(mf[iMot].lp, 2, espace));
    if (iMot == motsFormes-1) { // Calcul du total
        var pts=0; var pj=0; var pp=0; var lp=0;
        for(var i=0; i<motsFormes; i++) {
            pts+=mf[i].pts;
            pj+=mf[i].pj;
            pp+=mf[i].pp;
            lp+=mf[i].lp;
        }
        afficheEvenement(   'TOTAL          '+
                            couleur+
                            stNombre(pts,2, espace)+
                            stNombre(pp, 3, espace)+
                            stNombre(lp, 2, espace));
    }
}
//---------------------------------------------------------------------------
function montreCasesDirection()
{ 
    for(var d=typeDir.d0h; d<=typeDir.d10h; d++)
        if (estValide(xDepart, yDepart, 1, d)) {
            var x=xDepart+dx[d]; var y=yDepart+dy[d];
            var id = String.fromCharCode(charCodeMin+x)+String.fromCharCode(charCodeMin+y);
            var img = 'f' + (2*(d-1));
            document.images[id+nord].setAttribute(src, chmPng + img + nord + extPng);
            document.images[id+sud].setAttribute(src, chmPng + img + sud + extPng);
        }
}
//---------------------------------------------------------------------------
function cacheCasesDirection()
{ 
    for(var d=typeDir.d0h; d<=typeDir.d10h; d++)
        if (estValide(xDepart, yDepart, 1, d)) 
            majCasePlateau(xDepart+dx[d], yDepart+dy[d]);
}
//---------------------------------------------------------------------------
function chargeJeu()
{
    for(l=1; l<=dimensionChevalet; l++)
        majLettreJeu(String.fromCharCode(charCodeMin+l));
}
//---------------------------------------------------------------------------
function changePhase(nvPhase)
{
    phase = nvPhase;
    localStorage.setItem(lsPhase, phase);
}
//---------------------------------------------------------------------------
function choisitLettresAPlacer()
{
    var stMsg = nomj[colj[joueurs][joueur]]+', TOUCHE LES LETTRES A PLACER : ';
    posPrmLettreAPlacer = stMsg.length - 2;
    stMsg = stMsg + stLettresAPlacer; // On colle les lettres déjà choisies (cas de retour sur le choix des lettres)
    while(stMsg.length<dimensionMessage)
        stMsg = stMsg + espace; // On réserve tout l'espace du message pour être sûr qu'il est calé à gauche.
    afficheMessage(a, stMsg)
    afficheMessage(b, '[ EFFACER ] [ TOUT EFFACER ] [ PLACER ] [ PASSER ]', 4, numClicChoixJeu);
    changePhase(typePhase.phPlacementChoixLettres); // Autorise de toucher les lettres du jeu
}
//---------------------------------------------------------------------------
function chargeDepart()
{
    xDepart = parseInt(localStorage.getItem(lsDEPART + lsPtX), 10);
    yDepart = parseInt(localStorage.getItem(lsDEPART + lsPtY), 10);
    dDepart = parseInt(localStorage.getItem(lsDEPART + lsPtD), 10);
}
//---------------------------------------------------------------------------
function sauveDepart()
{
    localStorage.setItem(lsDEPART + lsPtX, xDepart);
    localStorage.setItem(lsDEPART + lsPtY, yDepart);
    localStorage.setItem(lsDEPART + lsPtD, dDepart);
}
//---------------------------------------------------------------------------
function initialiseDepart()
{
    xDepart = indefini; 
    yDepart = indefini; 
    dDepart = typeDir.dIndefinie;
}
//---------------------------------------------------------------------------
function choisitCaseDepart()
{
    if (tour>1) { // Choix libre si tour > 1
        afficheMessage(a, nomj[colj[joueurs][joueur]]+', TOUCHE LA CASE DEPART DE <'+stLettresAPlacer+'>...');
        afficheMessage(b, '[ PASSER ] [ RETOUR ]', 2, numClicChoixPlc);
        changePhase(typePhase.phPlacementChoixCaseDepart); // Autorise de toucher les lettres du jeu
        initialiseDepart();
    }
    else { // choix obligatoire au tour 1 : case étoile
        xDepart = xcdj[joueurs][joueur]; 
        yDepart = ycdj[joueurs][joueur];
        choisitCaseDirection();
    }
   sauveDepart(); 
}
//---------------------------------------------------------------------------
function choisitCaseDirection()
{
    montreCasesDirection();
    afficheMessage(a, nomj[colj[joueurs][joueur]]+', TOUCHE LA DIRECTION DE <'+stLettresAPlacer+'>...');
    afficheMessage(b, '[ PASSER ] [ RETOUR ]', 2, numClicChoixPlc);
    changePhase(typePhase.phPlacementChoixDirection);
    dDepart = typeDir.dIndefinie;
}
//---------------------------------------------------------------------------
function estLettrePosee()
{
    if ((this.j==joueur)&&(this.t==tour))
        return true;
    else
        return false;
}
//---------------------------------------------------------------------------
function poseLettrePlateau(l)
{
    this.l=l;
    this.j=joueur;
    this.s=0; // calculé après chaque mot montré
    this.t=tour;
    casesLibres--;
}
//---------------------------------------------------------------------------
function poseLettresPlateau()
{
    var x, y;
    var l=stLettresAPlacer.length;
    var lettresDejaPlacees=0;
    for(var i=0; i<l; i++) {
        while(plt[x=xDepart+(i+lettresDejaPlacees)*dx[dDepart]]
                 [y=yDepart+(i+lettresDejaPlacees)*dy[dDepart]].l!=espace)
            lettresDejaPlacees++;
        plt[x][y].poseLettre(stLettresAPlacer[i]);
        plt[x][y].sauve(x, y);
        majCasePlateau(x, y);
        sit[joueur].poseLettre();
        sit[joueur].sauve(joueur);
    }
}
//---------------------------------------------------------------------------
function retireLettrePlateau()
{
    this.l=espace;
    this.j=0;
    this.s=0;
    this.t=0;
    casesLibres++;
}
//---------------------------------------------------------------------------
function retireLettresPlateau()
{
    var x, y;
    var l=stLettresAPlacer.length;
    var lettresDejaPlacees=0;
    for(var i=0; i<l; i++) {
        while(!plt[x=xDepart+(i+lettresDejaPlacees)*dx[dDepart]]
                  [y=yDepart+(i+lettresDejaPlacees)*dy[dDepart]].estLettrePosee())
            lettresDejaPlacees++;
        plt[x][y].retireLettre();
        plt[x][y].sauve(x, y);
        majCasePlateau(x, y);
        sit[joueur].retireLettre();
        sit[joueur].sauve(joueur);
    }
}
//---------------------------------------------------------------------------
function joueurSuivant()
{
    // Fins de jeu
    if ((toursPasses==joueurs)||(!casesLibres)) {
        if (!casesLibres)
            afficheMessage(a, 'PLUS DE CASE LIBRE : FIN DE JEU.');
        else
            afficheMessage(a, 'TOUT LE MONDE A PASSE SON TOUR : FIN DE JEU.');
        afficheMessage(b, '[ NOUVELLE PARTIE ]', 1, numClicNvPartie);
        changePhase(typePhase.phHorsJeu);
    }
    else {
        if ((!joueur)||(joueur+1>joueurs)) {
            joueur = 1;
            tour++;
            for(var j=1; j<=joueurs; j++) {
                sit[j].initialiseTour();
                sit[j].sauveDebutTour(j);
            }
            if (tour == 1) 
                initialiseAffichagePartie();
            initialiseAffichageTour();
        }
        else
            joueur++;
        afficheEvenement(coul[colj[joueurs][joueur]] + nomj[colj[joueurs][joueur]] + stJoue);
        chargeJeu();
        stLettresAPlacer = ''; // On initialise les lettres ici car on peut revenir sur toutes les phases de placement (lettres <=> case <=> direction)
        choisitLettresAPlacer();
        sauveDebutTour();
    }
}
//---------------------------------------------------------------------------
function sauveDebutTour()
{
    localStorage.setItem(lsTour, tour);
    localStorage.setItem(lsJoueur, joueur);
    localStorage.setItem(lsLettresAPlacer, stLettresAPlacer);
}
//---------------------------------------------------------------------------
function sauveDebutPartie()
{
    localStorage.setItem(lsJoueurs, joueurs);
    localStorage.setItem(lsTour, tour);
    localStorage.setItem(lsJoueur, joueur);
    localStorage.setItem(lsToursPasses, toursPasses);
    localStorage.setItem(lsAnnonceFinTour, annonceFinTour);
    localStorage.setItem(lsPhase, phase);
    localStorage.setItem(lsLettresAPlacer, stLettresAPlacer);
    localStorage.setItem(lsPosPrmLAPlacer, posPrmLettreAPlacer);
    localStorage.motsFormes = motsFormes;
    localStorage.iMotForme = iMotForme;  
    lj.sauve();
    sauveDepart();
}
//---------------------------------------------------------------------------
function chargePartie() // retourne true si une partie a été sauvegardée et chargée
{
    if (!localStorage.getItem(lsJoueurs))
        return false;
    // Variables globales de jeu
    joueurs = parseInt(localStorage.getItem(lsJoueurs), 10);
    joueur = parseInt(localStorage.getItem(lsJoueur), 10);
    tour = parseInt(localStorage.getItem(lsTour), 10);
    toursPasses = parseInt(localStorage.getItem(lsToursPasses), 10);
    if (localStorage.getItem(lsAnnonceFinTour) == stTrue)
        annonceFinTour = true;
    else
        annonceFinTour = false;
    phase = parseInt(localStorage.getItem(lsPhase), 10);
    if (!localStorage.getItem(lsLettresAPlacer)) { // v1.2
        stLettresAPlacer = '';
        if (tour*joueur*phase==1)
            return false;
    }
    else
        stLettresAPlacer = localStorage.getItem(lsLettresAPlacer);
    posPrmLettreAPlacer = parseInt(localStorage.getItem(lsPosPrmLAPlacer), 10);
    motsFormes = parseInt(localStorage.motsFormes, 10);  
    iMotForme = parseInt(localStorage.iMotForme, 10);  
    chargeDepart();

    // lettres jouées
    lj.charge(); // lj est déjà alloué, on charge simplement les propriétés

    // mots formés
    for(var i=0; i<motsFormes; i++)
        mf[i] = new chargeMotForme(i);

    // jeux
	jeu = new Array(joueurs);
	for(var j=0; j<=joueurs; j++) {
		jeu[j] = new Array(dimensionChevalet);
        chargeJeuJoueurLettre(j, espace);
        for(var l=1; l<=dimensionChevalet; l++) {
            var lettre = String.fromCharCode(charCodeMin+l);
            chargeJeuJoueurLettre(j, lettre);
            chargeJeuJoueurLettre(j, espace);
            chargeJeuJoueurLettre(0, lettre);
            chargeJeuJoueurLettre(0, espace);
        }
	}
    chargeJeu();
        
    // plateau
    casesLibres = 0;
    plt = new Array();
	for(var x=1; x<=dimensionPlateau; x++) {
		plt[x] = new Array();
		for(var y=1; y<=dimensionPlateau; y++)
			if (estValide(x, y)) {
                plt[x][y] = new casePlateauCharge(x, y);
                majCasePlateau(x, y);
            }
	}

    // situations 
    sit = new Array(joueurs+1)
    for(var j=1; j<=joueurs; j++) 
        sit[j]= new chargeSituationJoueur(j);
    initialiseAffichagePartie();
    initialiseAffichageTour();
    afficheEvenement(coul[colj[joueurs][joueur]] + nomj[colj[joueurs][joueur]] + stJoue);
    majScores();

    switch(phase) {
        case typePhase.phHorsJeu:
        case typePhase.phTutoriel:                  nouvellePartie();
                                                    break;
        case typePhase.phPlacementChoixLettres:     choisitLettresAPlacer();
                                                    break;
        case typePhase.phPlacementChoixCaseDepart:  choisitCaseDepart();
                                                    break;
        case typePhase.phPlacementChoixDirection:   choisitCaseDirection();
                                                    break;
        case typePhase.phPlacementComptabilisation: afficheMarquageMotsFormesPrecedents();
                                                    clic(motSuivant);
                                                    break;
        case typePhase.phAchatLettres:              afficheDernierePhase();
                                                    break;
        case typePhase.phConfirmation:              clic(passer);
                                                    break;
    }
    
    return true;
}
//---------------------------------------------------------------------------
function initialisePartie()
{
    initialisePlateau();
    initialiseJeux();
    initialiseSituations();
    tour = 0; joueur = 0; toursPasses = 0; 
    motsFormes = 0; iMotForme = 0; 
    annonceFinTour = false; stLettresAPlacer = '';
    lj = new creeTypeLettresJouables();
    changePhase(typePhase.phHorsJeu);
    initialiseDepart();
    sauveDebutPartie();
}
//---------------------------------------------------------------------------
function effaceDerniereLettreAPlacer()
{
    var l=stLettresAPlacer.length;
    if (l) {
        var lettre=stLettresAPlacer[l-1];
        changeJeu(lettre, 1);
        stLettresAPlacer = stLettresAPlacer.substr(0, l-1);
        localStorage.setItem(lsLettresAPlacer, stLettresAPlacer);
        majLettreMsg('A', posPrmLettreAPlacer+l+1, espace); 
    }
}
//---------------------------------------------------------------------------
function annonceTourTermine()
{
    afficheMessage(a, nomj[colj[joueurs][joueur]]+', TON TOUR EST TERMINE. IL RESTE '+casesLibres+' CASE'+((casesLibres>1)?'S.':'.'));
}
//---------------------------------------------------------------------------
function testeAchatLettre(choix) // Suppose que choix>100. Retourne true si un achat a été effectué.
{
    var xAch=Math.floor(choix/100);
    var yAch=Math.floor(choix%100);
    if (plt[xAch][yAch].j==joueur) { // joueur courant ?
        var lettre = plt[xAch][yAch].l;
        var valeur = plt[xAch][yAch].s;
        var valAch = val[lettre.charCodeAt()-charCodeMin];
        if (valeur >= valAch) { // achat possible ?
            plt[xAch][yAch].s-=valAch;
            plt[xAch][yAch].sauve(xAch, yAch);
            majCasePlateau(xAch, yAch);
            changeJeu(lettre, 1);
            sit[joueur].acheteLettre(lettre, valAch);
            sit[joueur].sauve(joueur);
            afficheEvenement(   '+'+coul[colj[joueurs][joueur]]+
                                lettre+
                                ' EN '+
                                String.fromCharCode(charCodeMin+xAch)+
                                String.fromCharCode(charCodeMin+yAch)+
                                ' POUR '+
                                valAch+' POINT'+(valAch>1?'S':''));
            majScoresJoueur();
            if ((phase == typePhase.phAchatLettres)&&
                (!existeLettresAAcheter())) 
                    annonceTourTermine();
            return true;
        }
        else 
            return false;
    }
    else 
        return false;
}
//---------------------------------------------------------------------------
function afficheDernierePhase()
{
    if (existeLettresAAcheter())
        afficheMessage(a, 'TU PEUX ACHETER DES LETTRES, TOUCHE LES LETTRES A SCORE BLANC.');
    else
        annonceTourTermine();
    if ((joueurs>2)&&(tour>1)) // statistiques accessibles si 3 joueurs minimum et tour 2 minimum
        afficheMessage(b, '[ JOUEUR SUIVANT ] [ AFFICHER STATS ]', 2, numClicJoueurSvt);
    else
        afficheMessage(b, '[ JOUEUR SUIVANT ]', 1, numClicJoueurSvt);
}
//---------------------------------------------------------------------------
function casesDirectionTutoriel(activer)
{
    var id, img, nvSrcN, nvSrcS;
    for(var d=typeDir.d0h; d<=typeDir.d10h; d++) {
        id = String.fromCharCode(charCodeMin + (coordDprtTutoriel + dx[d])) +
             String.fromCharCode(charCodeMin + (coordDprtTutoriel + dy[d]));
        if (activer) {
            img = 'f' + (2*(d-1));
            nvSrcN = chmPng + img + nord + extPng;
            nvSrcS = chmPng + img +  sud + extPng;
        }
        else {
            img = chmPng + demiVide + extPng; 
            nvSrcN = img;
            nvSrcS = img;
        }
        document.images[id + nord].src = nvSrcN;
        document.images[id +  sud].src = nvSrcS;
    }
}
//---------------------------------------------------------------------------
function simuleTutoriel(activer)
{
    switch(etapeTutoriel) {
        case 3: // On simule le jeu initial bleu
                for(var i=1; i<=dimensionChevalet; i++) {
                    var nvSrcN, nvSrcS;
                    var lettre = String.fromCharCode(charCodeMin+i);
                    if (activer) {
                        nvSrcN = chmPng + lettre + coul[joueurTutoriel] + extPng; 
                        nvSrcS = chmPng + val[i] + coul[joueurTutoriel] + extPng; 
                    }
                    else {
                        nvSrcN = chmPng + demiVide + extPng; 
                        nvSrcS = chmPng + demiVide + extPng; 
                    }
                    document.images[lettre + nord].src = nvSrcN;
                    document.images[lettre + sud].src = nvSrcS;
                }
                break;
        case 4: // On place quelques lettres épuisées (J,K,Q,W,X,Y,Z)
                for(var i=0; i<lettres0Tutoriel.length; i++) {
                    if (activer) {
                        nvSrcN = chmPng + lettres0Tutoriel[i] + noir + extPng; 
                        nvSrcS = chmPng + zeroNoir + extPng; 
                    }
                    else {
                        nvSrcN = chmPng + lettres0Tutoriel[i] + coul[joueurTutoriel] + extPng; 
                        nvSrcS = chmPng + val[i] + coul[joueurTutoriel] + extPng; 
                    }
                    document.images[lettres0Tutoriel[i] + nord].src = nvSrcN;
                    document.images[lettres0Tutoriel[i] + sud].src = nvSrcS;
                }
                break;
        case 7: // On place les étoiles pour 3 joueurs
                for(var j=1; j<=joueursTutoriel; j++) {
                    var c=coul[j];
                    var img =   String.fromCharCode(charCodeMin+xcdj[joueursTutoriel][j])+
                                String.fromCharCode(charCodeMin+ycdj[joueursTutoriel][j]);
                    var nvSrcN, nvSrcS;
                    if (activer) {
                        nvSrcN = chmPng + c + zero + extPng;
                        nvSrcS = chmPng + c + un + extPng;
                    }
                    else {
                        nvSrcN = chmPng + demiVide + extPng; 
                        nvSrcS = chmPng + demiVide + extPng; 
                    }
                    document.images[img + nord].src = nvSrcN;
                    document.images[img + sud].src = nvSrcS;
                }
                break;
        case 12:// On place des lettres sur le plateau (pose en noir)
        case 25:// On masque les lettres à placer (en noir)
        case 26:// On affiche les flèches de direction
        case 28:// On montre le mot principal formé (mot en blanc)
        case 31:// On montre le mot secondaire formé (mot en blanc)
        case 32:// On masque les mots formés 
        case 41:// On montre le mot principal formé (mot en blanc) avec affichage du détail à droite
        case 42:// On montre le mot secondaire formé (mot en blanc) avec affichage du détail à droite
        case 43:// On masque les mots formés 
                var i;
                switch(etapeTutoriel) {
                    case 12: i=0; break;
                    case 25: i=1; break;
                    case 26: i=2; break;
                    case 28:
                    case 41: i=3; break;
                    case 31:
                    case 42: i=4; break;
                    case 32:
                    case 43: i=5; break;
                }

                // 1. Masquage éventuel des flèches
                if (!activer) {
                    i--;
                    if (etapeTutoriel == 26) 
                        casesDirectionTutoriel(non);
                }
                else {
                    if (etapeTutoriel == 28) 
                        casesDirectionTutoriel(non);
                }

                // 2. Affichage des lettres 
                for(var j=0; j<lettrePltTutoriel.length; j++) {
                    var img =   casesXPltTutoriel[j]+
                                casesYPltTutoriel[j];
                    var nvSrcN, nvSrcS;
                    if (i > -1) {
                        if (scoresPltTutoriel[i][j] == espace) { // Cases vides (on efface les lettres en noir en l'occurrence)
                            nvSrcN = chmPng + demiVide + extPng; 
                            nvSrcS = chmPng + demiVide + extPng; 
                        }
                        else {
                            var couleur = coultrPltTutoriel[i][j];
                            nvSrcN = chmPng + lettrePltTutoriel[j] + couleur + extPng;
                            if ((scoresPltTutoriel[i][j] == '0')&& // Si score lettre nul
                                (couleur!=blanc)) // et couleur non mise en évidence (blanc)
                                    couleur=noir; // alors on affiche le score en noir.
                            nvSrcS = chmPng + scoresPltTutoriel[i][j] + couleur + extPng;
                        }
                    }
                    else {
                        nvSrcN = chmPng + demiVide + extPng; 
                        nvSrcS = chmPng + demiVide + extPng; 
                    }
                    document.images[img + nord].src = nvSrcN;
                    document.images[img + sud].src = nvSrcS;
                }
                
                // 3. Affichage éventuel des flèches
                if (activer) {
                    if (etapeTutoriel == 26) 
                        casesDirectionTutoriel(oui);
                }
                else {
                    if (etapeTutoriel == 28) 
                        casesDirectionTutoriel(oui);
                }
                
                // 4. Affichage dans la zone de marquage
                switch(etapeTutoriel) {
                    case 41:if (activer) 
                                afficheMarquage( 9, 'bDEgCONrGELEgRAI bCC 6H');
                            else 
                                afficheMarquage( 9, espace);
                            break;
                    case 42:if (activer) {
                                afficheMarquage(10, enteteDetailMot);
                                afficheMarquage(11, 'bDEgCONrGELEgRAI   b12  4 0');
                            }
                            else {
                                afficheMarquage(10, espace);
                                afficheMarquage(11, espace);
                            }
                            break;
                    case 43:if (activer)
                                afficheMarquage(12, 'rEgNb              2  1 0');
                            else 
                                afficheMarquage(12, espace);
                            break;
                }
                
                break;
        case 33:var nvSrcB = chmPng + deux; 
                var nvSrcR = chmPng + deux;
                if (activer) {
                    nvSrcB = nvSrcB + blanc + extPng;
                    nvSrcR = nvSrcR + blanc + extPng;
                }
                else {
                    nvSrcB = nvSrcB + coul[joueurTutoriel] + extPng;
                    nvSrcR = nvSrcR + coul[jouAdvTutoriel] + extPng;
                }
                document.images[caseAchJBTutoriel + sud].src = nvSrcB;
                document.images[caseAchJRTutoriel + sud].src = nvSrcR;
                break;
        case 35:
        case 44:// 1. Score des lettres achetées
                var nvSrc = chmPng; 
                if (activer)
                    nvSrc = nvSrc + zero + noir + extPng;
                else
                    nvSrc = nvSrc + deux + blanc + extPng;
                document.images[caseAchJBTutoriel + sud].src = nvSrc;

                // 2. Nombre d'exemplaire de la lettre achetée
                nvSrc = chmPng;
                if (activer)
                    nvSrc = nvSrc + trois + coul[joueurTutoriel] + extPng;
                else 
                    nvSrc = nvSrc + deux  + coul[joueurTutoriel] + extPng;
                document.images[lettreAchTutoriel + sud].src = nvSrc;
                
                // 3. Affichage dans la zone de marquage (44)
                if (etapeTutoriel == 44) {
                    if (activer) {
                        afficheMarquage(13, 'TOTAL          b14  5 0');
                        afficheMarquage(14, '+bD EN CC POUR 2 POINTS');
                    }
                    else {
                        afficheMarquage(13, espace);
                        afficheMarquage(14, espace);
                    }
                }
                break;
        case 36:if (activer) {
                    afficheMarquage(0,  'PTS  PJ NJ P+ L+ P- L-'); 
                    afficheMarquage(1, 'b 18  11 10  5  0  0  0');
                    afficheMarquage(2, 'r 18  13 12  0  0  5  0');
                    afficheMarquage(3,  'T03  PJ NJ P+ L+ LA PP');
                    afficheMarquage(4, 'b 14   7  6  5  0  1  2');
                    afficheMarquage(5, 'r  0  -5  0  0  0  0  0');
                }
                else
                    for(var i=0; i<=5; i++)
                        afficheMarquage(i, espace);
                break;
        case 40:if (activer) {
                    afficheMarquage(6, evolutionPartie);
                    afficheMarquage(7, '----- TOUR N° 03 -----');
                    afficheMarquage(8, 'bBLEU JOUE');
                }
                else {
                    afficheMarquage(6, espace);
                    afficheMarquage(7, espace);
                    afficheMarquage(8, espace);
                }
                break;
        case 45:if (activer)
                    afficheMarquage(15, fleches);
                else
                    afficheMarquage(15, espace);
                break;
    }
}
//---------------------------------------------------------------------------
function afficheTutoriel()
{
    switch(etapeTutoriel) {
        case 0: afficheMessage(a, 'BIENVENUE DANS LE TUTORIEL. TOUCHEZ \'>\' POUR PASSER A LA SUITE,');
                afficheMessage(b, '\'<\' POUR REVENIR EN ARRIERE ET \'X\' POUR REVENIR AU MENU. [X][ >]', 2, numClicTutoriel0);
                break;
        case 1: afficheMessage(a, 'A GAUCHE DU PLATEAU, VOUS AVEZ LE JEU TEMOIN. EN DESSOUS DE');
                afficheMessage(b, 'CHAQUE LETTRE FIGURE UN CHIFFRE. CELUI-CI REPRESENTE:'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 2: afficheMessage(a, 'SOIT LE NOMBRE D\'EXEMPLAIRES AU DEBUT DU JEU, SOIT LE NOMBRE DE');
                afficheMessage(b, 'POINTS NECESSAIRES POUR L\'ACHETER AU COURS DU JEU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 3: afficheMessage(a, 'A DROITE DU PLATEAU, VOUS AVEZ LE JEU DU JOUEUR COURANT.');
                afficheMessage(b, 'LES LETTRES SONT DE LA COULEUR DU JOUEUR COURANT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 4: afficheMessage(a, 'LE CHIFFRE SOUS CHAQUE LETTRE INDIQUE LE NOMBRE D\'EXEMPLAIRES.');
                afficheMessage(b, '0 INDIQUE UNE LETTRE INDISPONIBLE QUI DEVIENT NOIRE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 5: afficheMessage(a, 'QUAND VOUS PLACEZ LA LETTRE SUR LE PLATEAU, IL DIMINUE DE 1.');
                afficheMessage(b, 'QUAND VOUS ACHETEZ LA LETTRE, IL AUGMENTE DE 1.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 6: afficheMessage(a, 'AU CENTRE, SE TROUVE LE PLATEAU QUE DOIVENT REMPLIR DE LETTRES');
                afficheMessage(b, 'LES JOUEURS EN FORMANT DES MOTS DE 2 A 15 LETTRES.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 7: afficheMessage(a, 'AU PREMIER TOUR, UNE DES LETTRES DOIT ETRE PLACEE SUR L\'ETOILE.');
                afficheMessage(b, 'LA DISPOSITION DEPEND DU NOMBRE DE JOUEURS AU DEPART.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 8: afficheMessage(a, 'A TOUR DE ROLE, CHAQUE JOUEUR DOIT CHOISIR D\'1 A 6 LETTRES');
                afficheMessage(b, 'PARMI SON JEU POUR LES PLACER SUR LE PLATEAU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 9: afficheMessage(a, 'LES LETTRES SONT PLACEES CONTIGUES ET ALIGNEES DANS UNE MEME');
                afficheMessage(b, 'DIRECTION A PARTIR D\'UNE CASE LIBRE DU PLATEAU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 10:afficheMessage(a, 'SI UNE CASE EST OCCUPEE, LES LETTRES SONT PLACEES A LA SUITE.');
                afficheMessage(b, 'VOUS DEVEZ FORMER UN MOT AVEC LES LETTRES PLACEES.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 11:afficheMessage(a, 'LE MOT DOIT CONTENIR AU MOINS TOUTES LES LETTRES PLACEES + UNE');
                afficheMessage(b, 'LETTRE DEJA PLACEE ET APPARTENANT AU JOUEUR COURANT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 12:afficheMessage(a, 'TOUTES LES LETTRES DU MOT DOIVENT ETRE CONTIGUES ET ALIGNEES.');
                afficheMessage(b, 'ICI, ON PLACE <CONRAI> POUR FORMER <DECONGELERAI>.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 13:afficheMessage(a, 'LES LETTRES PLACEES <CONRAI>, QUI APPARAISSENT ICI EN NOIR,');
                afficheMessage(b, 'SONT PLACEES DE PART ET D\'AUTRE DE <GELE> ROUGE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 14:afficheMessage(a, '<DECONGELERAI> CONTIENT BIEN LES LETTRES POSEES <CONRAI> ET');
                afficheMessage(b, 'LES LETTRES DEJA PLACEES <DE> DU JOUEUR COURANT BLEU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 15:afficheMessage(a, 'CHAQUE LETTRE DU JOUEUR COMPOSANT LE MOT PREND 1 POINT.');
                afficheMessage(b, 'SI C\'EST UNE LETTRE ADVERSE, ELLE PERD 1 POINT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 16:afficheMessage(a, 'SI LA LETTRE ADVERSE A 0 POINT, ELLE PASSE ALORS DANS LE CAMP');
                afficheMessage(b, 'DU JOUEUR COURANT ET PREND 1 POINT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 17:afficheMessage(a, 'ICI, LES LETTRES <DECON> ET <RAI> PRENNENT 1 POINT ALORS QUE');
                afficheMessage(b, 'LES LETTRES ROUGES <GELE> PERDENT 1 POINT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 18:afficheMessage(a, 'POUR PLACER LES LETTRES, IL FAUT LES TOUCHER SUR LE JEU, 1 PAR 1');
                afficheMessage(b, 'ET DANS L\'ORDRE DE PLACEMENT SUR LE PLATEAU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 19:afficheMessage(a, 'A CHAQUE FOIS QUE VOUS TOUCHEZ UNE LETTRE SON CHIFFRE DIMINUE ET');
                afficheMessage(b, 'LA LETTRE APPARAIT EN DESSOUS DU PLATEAU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 20:afficheMessage(a, 'UNE FOIS QUE VOUS AVEZ SELECTIONNE TOUTES LES LETTRES A PLACER,');
                afficheMessage(b, 'IL FAUT CHOISIR LA CASE OU SERA LA PREMIERE LETTRE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 21:afficheMessage(a, 'LE SYSTEME POUR LOCALISER UNE CASE SE COMPOSE DE DEUX LETTRES :');
                afficheMessage(b, 'C\'EST L\'INTERSECTION ENTRE 2 LIGNES EN DIAGONALE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 22:afficheMessage(a, 'PAR EXEMPLE, LE <C> NOIR SE TROUVE EN <EE> OU SE CROISENT');
                afficheMessage(b, 'EN DIAGONALE LES DEUX LIGNES <E>.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 23:afficheMessage(a, 'LA DIRECTION D\'UN PLACEMENT S\'EXPRIME EN HEURES COMME CE');
                afficheMessage(b, 'QU\'INDIQUE LA PETITE AIGUILLE D\'UNE MONTRE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 24:afficheMessage(a, 'LES DIRECTIONS POSSIBLES SONT DONC 2H, 4H, 6H, 8H, 10H ET 12H.');
                afficheMessage(b, 'ICI, ON PLACE <CONRAI> A 6 HEURES.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        // Ici on efface les lettre en noir
        case 25:afficheMessage(a, 'POUR PLACER LE <C> EN <EE>, IL FAUT TOUCHER LA CASE <EE> OU');
                afficheMessage(b, 'TOUCHER <PLACER> PUIS LA CASE <EE>.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        // Ici on affiche les flèches de direction
        case 26:afficheMessage(a, 'LES DIRECTIONS POSSIBLES APPARAISSENT AUTOUR DE LA CASE DEPART.');
                afficheMessage(b, 'IL FAUT TOUCHER LA DIRECTION DU PLACEMENT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 27:afficheMessage(a, 'ICI, IL FAUT TOUCHER LA FLECHE EN <FF> QUI VA VERS LE BAS.');
                afficheMessage(b, 'EN CAS D\'ERREUR, IL FAUT TOUCHER <RETOUR>.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        // Ici, on masque les flèches puis on montre le mot principal formé (mot en blanc)
        case 28:afficheMessage(a, 'LE MOT PRINCIPAL APPARAIT ALORS EN BLANC AVEC LES SCORES A JOUR.');
                afficheMessage(b, 'LES MOTS DANS LES AUTRES DIRECTIONS SONT RECHERCHES.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 29:afficheMessage(a, 'TOUT AUTRE MOT UTILISANT AU MOINS UNE DES LETTRES PLACEES');
                afficheMessage(b, 'FAIT GAGNER OU PERDRE 1 POINT PAR LETTRE ET PAR MOT.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 30:afficheMessage(a, 'LES MOTS INCLUS DANS D\'AUTRES DEJA COMPTES NE SONT PAS PRIS.');
                afficheMessage(b, 'EXEMPLE: <ART> INCLUS DANS <TRAM> N\'EST PAS COMPTE.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        // Ici, on montre le mot secondaire formé (mot en blanc)
        case 31:afficheMessage(a, 'ICI, UNIQUEMENT LE MOT <EN> EST FORME EN GG, DIRECTION 2H.');
                afficheMessage(b, 'LE <N> PREND 1 POINT ET LE <E> PERD 1 POINT.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Ici, on masque les mots formés
        case 32:afficheMessage(a, 'BLEU REMPORTE 14 POINTS DONT 9 POINTS GAGNES SUR SES LETTRES');
                afficheMessage(b, 'ET 5 POINTS PRIS SUR LES LETTRES ADVERSES.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 33:afficheMessage(a, 'UN SCORE NOIR INDIQUE QUE LA LETTRE RISQUE DE PASSER A L\'ENNEMI.')
                afficheMessage(b, 'UN SCORE BLANC INDIQUE QU\'ELLE PEUT ETRE ACHETEE.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 34:afficheMessage(a, 'ICI, BLEU PEUT ACHETER UN <D> ET ROUGE UN <B> COUTANT 2 POINTS.')
                afficheMessage(b, 'POUR ACHETER UNE LETTRE, IL SUFFIT DE LA TOUCHER.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 35:afficheMessage(a, 'LE NOMBRE D\'EXEMPLAIRES EST INCREMENTE DANS LE JEU PASSANT A 3.')
                afficheMessage(b, 'LE PRIX EST RETIRE DU SCORE DE LA LETTRE PASSANT A 0.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 36:afficheMessage(a, 'UNE FOIS LE TOUR D\'UN JOUEUR TERMINE, LES SCORES SONT AFFICHES.')
                afficheMessage(b, 'EN HAUT LES SCORES DE LA PARTIE PUIS CEUX DU TOUR.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 37:afficheMessage(a, 'PTS: SCORE CUMULE SOIT LA SOMME DES TAILLES DES MOTS CREES.');
                afficheMessage(b, 'PJ: CUMUL DES POINTS SUR LES LETTRES DU PLATEAU.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 38:afficheMessage(a, 'NJ: NOMBRE DE LETTRES SUR LE PLATEAU. LA: LETTRES ACHETEES.');
                afficheMessage(b, 'PP: POINTS PAYES POUR L\'ACHAT DES LETTRES.'+boutonsTutoriel, 3, numClicTutoriel);
                break;
        case 39:afficheMessage(a, 'POINTS PRIS SUR LES LETTRES... P+: ADVERSES. P-: PAR L\'ENNEMI.');
                afficheMessage(b, 'LETTRES PRISES... L+: A L\'ENNEMI. L-: PAR L\'ENNEMI.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Affichage de la zone "Evolution"
        case 40:afficheMessage(a, 'QUAND LES MOTS FORMES SONT AFFICHES EN BLANC SUR LE PLATEAU,');
                afficheMessage(b, 'LE SCORE S\'AFFICHE A DROITE SOUS <EVOLUTION>.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Affichage de la pose dans la zone de marquage + mot principal en blanc 
        case 41:afficheMessage(a, 'D\'ABORD AU MOMENT DE LA POSE DES LETTRES, LE MOT FORME S\'AFFICHE');
                afficheMessage(b, 'AVEC LA CASE DEPART ET LA DIRECTION...'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Affichage du score du mot principal           + mot secondaire en blanc 
        case 42:afficheMessage(a, 'ENSUITE APPARAIT LE SCORE DES MOTS FORMES. S: SCORE.');
                afficheMessage(b, 'P+: POINTS ADVERSES PRIS. L+: LETTRES PRISES.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Affichage du score du mot secondaire          + disparition des mots
        case 43:afficheMessage(a, 'LA COULEUR DES LETTRES REFLETE L\'ETAT AVANT DECOMPTE DES POINTS.');
                afficheMessage(b, 'LES LETTRES GRISES SONT LES LETTRES POSEES.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        // Affichage du total + lettre achetée           + achat lettre effectué
        case 44:afficheMessage(a, 'QUAND TOUS LES MOTS ONT ETE COMPTES, UNE LIGNE TOTAL APPARAIT.');
                afficheMessage(b, 'LES ACHATS DE LETTRES SONT EGALEMENT AFFICHES.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 45:afficheMessage(a, 'LA LIGNE DE FLECHES INDIQUE LA POSITION DU DERNIER EVENEMENT');
                afficheMessage(b, 'CAR LA ZONE NE DEFILE PAS MAIS REPART DU HAUT.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 46:afficheMessage(a, 'LA PARTIE SE TERMINE S\'IL N\'Y A PLUS DE CASES LIBRES OU');
                afficheMessage(b, 'SI TOUS LES JOUEURS ONT PASSE LEUR TOUR A LA SUITE.'+boutonsTutoriel, 3, numClicTutoriel);
                break; 
        case 47:afficheMessage(a, 'LE TUTORIEL EST TERMINE. POUR PLUS D\'INFORMATIONS,');
                afficheMessage(b, 'TOUCHEZ <AIDE EN LIGNE> EN HAUT A GAUCHE [ <][ OK ]', 2, numClicTutoriel); // v1.1.1
                break; 
    }
}
//---------------------------------------------------------------------------
function majSablier(affiche) // v1.3.1
{
	for(var i=1; i<=2; i++)
		document.images[sablier+i].src = chmPng + (affiche?sablier:demiHexaFndNoir) + extPng;
}
//---------------------------------------------------------------------------
function clic(choix)
{   // Répartition selon la valeur de choix
    // 0001..0026 = Lettre à droite
    // 0027..0099 = 2ème ligne de message
        // 27 = 2 joueurs
        // 28 = 3 joueurs
        // 29 = 6 joueurs
        // 30 = Suite
        // 31 = Effacer
        // 32 = Tout Effacer
        // 33 = Placer
        // 34 = Passer
        // 35 = Retour
        // 36 = Mot suivant
        // 37 = joueur suivant
        // 38 = Pas passer ou Stats
        // 39 = Poursuivre la partie
        // 40 = Nouvelle Partie
        // 41 = Tutoriel
        // 42 = À propos
        // 43 = OK (À propos)
        // 44 = << (tutoriel)
        // 45 = X  (tutoriel)
        // 46 = >> (tutoriel)
        
    // 0101..1515 = case du plateau (XX,YY=01..15)
    
    if (choix && (choix <= dimensionChevalet)) { // Choix d'une lettre sur le chevalet
        if (phase == typePhase.phPlacementChoixLettres) { // phase de choix des lettres ? 
            if (stLettresAPlacer.length < lettresMaxAPlacer) { // A-t-il déjà choisi trop de lettres ?
                lettre = String.fromCharCode(charCodeMin+choix);
                if (jeu[joueur][lettre]) { // Y en a-t-il dans son jeu ?
                    stLettresAPlacer = stLettresAPlacer + lettre;
                    localStorage.setItem(lsLettresAPlacer, stLettresAPlacer);
                    majLettreMsg('A', posPrmLettreAPlacer+stLettresAPlacer.length+1, lettre); 
                    changeJeu(lettre, -1);
                }
            }
        }
    }
    else if (choix>100) { // Choix d'une case du plateau
        switch(phase) {
            case typePhase.phPlacementChoixLettres:     if (!stLettresAPlacer.length) { // le choix de la case départ peut se faire directement après avoir choisi la dernière lettre à placer sans toucher "PLACER".
                                                            testeAchatLettre(choix); // attention : on continue sur le 'case' suivant s'il y a des lettres à placer sinon on vérifie l'achat de lettres.
                                                            break; 
                                                        }
            case typePhase.phPlacementChoixCaseDepart:  if (testeAchatLettre(choix)) // Test achat lettre possible ici
                                                            break; 
                                                        // choix de la case départ
                                                        majSablier(true); // v1.3.1
														setTimeout(function() { // v1.3                                                        
                                                        	if (tour == 1) { // Si premier tour, la case est forcée à une case étoile (si le joueur a touché la case directement)
                                                            	xDepart = xcdj[joueurs][joueur]; 
                                                            	yDepart = ycdj[joueurs][joueur]; 
                                                        	}
                                                        	else {
                                                            	xDepart = Math.floor(choix/100);
                                                            	yDepart = Math.floor(choix%100);
                                                        	}
                                                        	if (plt[xDepart][yDepart].l == espace) { // Pas de lettre sur la case
                                                            	choisitCaseDirection();
                                                        	}
                                                        	else { // Choix incorrect (il ne faut pas de lettre sur la case)
                                                            	afficheMessage(a, 'TU DOIS CHOISIR UNE CASE LIBRE, TOUCHE UNE AUTRE CASE...');
                                                            	initialiseDepart();
                                                        	}
                                                        	sauveDepart();
							                                majSablier(false); // v1.3.1
                                                            }, 500); // v1.3
                                                        break;
            case typePhase.phPlacementChoixDirection:   var xDir=Math.floor(choix/100);
                                                        var yDir=Math.floor(choix%100);
                                                        var img= String.fromCharCode(charCodeMin+xDir)+String.fromCharCode(charCodeMin+yDir);
                                                        var png=document.images[img+nord].getAttribute(src);
                                                        if (png.substr(0,5)==chmPng+'f') { // flèche ?
															majSablier(true); // v1.3.1
															setTimeout(function() { // v1.3                                                        
                                                            	dDepart = 1+Math.floor(parseInt(png.substr(5,1)+(png.substr(6,1)=='0'?'0':'')))/2;
                                                            	if (lettresJouables()) {
                                                                	cacheCasesDirection();
                                                                	poseLettresPlateau();
                                                                	if (chercheMots()) {
                                                                    	iMotForme = 0; localStorage.iMotForme = iMotForme;
                                                                    	afficheEvenement(mf[0].stEvenement());
                                                                    	mf[0].montreMotForme();
                                                                    	changePhase(typePhase.phPlacementComptabilisation);
                                                                	}
                                                                	else {
                                                                    	retireLettresPlateau();
                                                                    	dDepart = typeDir.dIndefinie;
                                                                    	montreCasesDirection();
                                                                	}
                                                            	}
                                                            	else {
                                                                	afficheMessage(a, 'PLACEMENT IMPOSSIBLE ICI, CHOISIS UN AUTRE PLACEMENT...');
                                                                	dDepart = typeDir.dIndefinie;
                                                            	}
                                                            	sauveDepart();
							                                	majSablier(false); // v1.3.1
                                                            }, 500); // v1.3
                                                        }
                                                        break;
            case typePhase.phPlacementComptabilisation: clic(motSuivant); // Mot formé suivant = bouton "Continuer" 
                                                        break;
            case typePhase.phAchatLettres:              testeAchatLettre(choix);
                                                        break;
        }
    }
    else
        switch(choix) {
            case deuxJoueurs:   joueurs = 2;
                                break;
            case troisJoueurs:  joueurs = 3;
                                break;
            case sixJoueurs:    joueurs = 6;
                                break;
            case effacer:       majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									effaceDerniereLettreAPlacer();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case toutEffacer:   majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									while(stLettresAPlacer.length)
                                    	effaceDerniereLettreAPlacer();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case placer:        majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									if (stLettresAPlacer.length > 0) // Le choix d'au moins une lettre est obligatoire
                                    	choisitCaseDepart();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case passer:        majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									if (phase == typePhase.phPlacementChoixDirection)
                                    	cacheCasesDirection();
                                	afficheMessage(a, nomj[colj[joueurs][joueur]]+', CONFIRME QUE TU PASSES TON TOUR.');
                                	afficheMessage(b, '[ OUI, JE PASSE MON TOUR ] [ NON, JE ME SUIS TROMPE ]', 2, numClicJoueurSvt);
                                	changePhase(typePhase.phConfirmation);    
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case retour:        majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									switch(phase) {
                                    	case typePhase.phPlacementChoixCaseDepart:  choisitLettresAPlacer();
                                        	                                        break;
                                    	case typePhase.phPlacementChoixDirection:   cacheCasesDirection();
                                        	                                        if (tour>1) 
                                            	                                        choisitCaseDepart();
                                                	                                else // au tour 1, on ne choisit pas la case départ donc on remonte au choix des lettres à placer !
                                                    	                                choisitLettresAPlacer();
                                                        	                        break;
                                	}
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case motSuivant:    majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									mf[iMotForme].masqueMotForme();
                                	iMotForme++; localStorage.iMotForme = iMotForme;
                                	if (iMotForme<motsFormes) 
                                    	mf[iMotForme].montreMotForme();
                                	else { 
                                    	afficheDernierePhase();
                                    	majScores();
                                    	changePhase(typePhase.phAchatLettres);
                                	}
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case joueurSvt:     majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									if (!annonceFinTour) {
                                    	if (phase == typePhase.phConfirmation) {
                                        	toursPasses++;
                                        	changePhase(typePhase.phAchatLettres);
                                    	}
                                    	else
                                        	toursPasses=0; // Si le dernier joueur n'a pas passé de tour : on remet à zéro.
                                	}        
                                	if ((!annonceFinTour)&&
                                    	(joueur == joueurs)) {
                                        	afficheMessage(a, 'LE TOUR '+tour+' EST TERMINE. CONSULTEZ LES SCORES.');
                                        	afficheMessage(b, '[ TOUR SUIVANT ]', 1, numClicJoueurSvt);
                                        	annonceFinTour = true;
                                	}
                                	else {
                                    	joueurSuivant();
                                    	annonceFinTour = false;
                                	}
                                	localStorage.setItem(lsToursPasses, toursPasses);
                                	localStorage.setItem(lsAnnonceFinTour, annonceFinTour);
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case pasPasserStat: majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									if (phase==typePhase.phConfirmation) // Non, pas passer
                                    	choisitLettresAPlacer();
                                	else // Statistiques
                                    	sit[joueur].afficheStats();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case nvPartie:      majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									nouvellePartie();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case poursuivre:    majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									if (!chargePartie())
                                    	nouvellePartie();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case tutoriel:      majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									phase=typePhase.phTutoriel;
                                	etapeTutoriel=0;
                                	afficheTutoriel();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case aPropos:       majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									var n=0; // v1.4 : on compte les mots
									for(var i=0; i<dico.length; i++)
										n+=dico[i].length;
									afficheMessage(a, 'OSMOTIK VERSION '+stVersion+' CREE EN 2011 PAR PATRICE FOUQUET.');
                                	afficheMessage(b, 'DICTIONNAIRE : ODS'+stVerDico+' AVEC '+n+' MOTS. [ OK ]', 1, numClicOk);
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case arriere:       majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									simuleTutoriel(non);
                                	etapeTutoriel--;
                                	afficheTutoriel();
                   					majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case terminer:      majSablier(true); // v1.3.1
                                setTimeout(function() { // v1.3
                                    while(etapeTutoriel) { // On détricote le tutoriel
                                        simuleTutoriel(non);
                                        etapeTutoriel--;
                                    }
                                    majSablier(false); // v1.3.1
                                }, 500); // v1.3
                                // ATTENTION: pas de break pour afficher le menu principal
            case ok:            majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									bienvenue();
                   					majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            case suite:         majSablier(true); // v1.3.1
								setTimeout(function() { // v1.3
									etapeTutoriel++;
                                	simuleTutoriel(oui);
                                	afficheTutoriel();
                                	majSablier(false); // v1.3.1
                   				}, 500); // v1.3
                                break;
            default:            break;
        }    
    // Actions communes à plusieurs boutons
    if ((choix>=deuxJoueurs)&&(choix<=sixJoueurs)) {
        initialisePartie(); // crée et initialise les structures de données
        clic(joueurSvt);
   }    
}
//---------------------------------------------------------------------------
function nouvellePartie()
{
    afficheMessage(a, 'POUR COMMENCER, CHOISIS LE NOMBRE DE JOUEURS :');
    afficheMessage(b, '[ 2 JOUEURS ] [ 3 JOUEURS ] [ 6 JOUEURS ]', 3, numClicJoueurs);
}
//---------------------------------------------------------------------------
function partieEnCours()
{
    if (localStorage.getItem(lsJoueurs))
        return true;
    else
        return false;
}
//---------------------------------------------------------------------------
function bienvenue() 
{
    activeClics();
    if (partieEnCours()) {
        afficheMessage(a, 'BIENVENUE A OSMOTIK. UNE PARTIE EN COURS A ETE SAUVEGARDEE.');
        afficheMessage(b, '[ CONTINUER ] [ NOUVELLE PARTIE ] [ TUTORIEL ] [ A PROPOS ]', 4, numClicPoursuivre); 
    }
    else {
        afficheMessage(a, 'BIENVENUE A OSMOTIK.');
        afficheMessage(b, '[ NOUVELLE PARTIE ] [ TUTORIEL ] [ A PROPOS ]', 3, numClicNvPartie);
    }
}
//---------------------------------------------------------------------------
