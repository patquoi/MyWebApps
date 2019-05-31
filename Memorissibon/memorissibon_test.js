/*
 
 Fichier: Memorissibon.js
 
 Sujet: Programme principal JavaScript 
  
 Version: <1.3>
 
 Copyright (C) 2014 Patrice Fouquet.
 
 */ 

//---------------------------------------------------------------------------
// CONSTANTES
//---------------------------------------------------------------------------

const stVersion = '1.3';

/*
Version 1.0
 - Première version
Version 1.1
 - Ajout d'un dossard sur le torse pour localiser un personnage par numéro
 - Ajout d'un astérisque de chaque côté d'un chiffre quand c'est l'unique caractère d'un bouton afin de pouvoir mieux le "toucher"
Version 1.2
 - Revue des liens vers l'extérieur en éliminant les <A HREF></A>
Version 1.3
 - Ajout d'une éventuelle garniture selon le genre : Moustache (garçons) et boucles d'oreille (filles)
*/

/* Police écriture 

png 8x16 avec fond en transparence
Futura Medium Condensed 20 centré

*/

const indefini			= -1;
const indefini2			= 128;
const vide				= '';
const negatif 			= 'n'; // v1.1
const espace			= ' ';
const nvLigne			= '\n';
const charCodeMin		= 64;
const largeurMax		= 40;
const hauteurMax		= 5;
const colonnesMax		= 4;
const lignesMax			= 3;
const tous				= 4; // Pour tops[tous] = top des tops

const colonnes			= [2,2,4,4];
const lignes			= [2,3,2,3];
const coins				= 4;
const couleursTete		= 4;
const couleursHabit		= 4;
const ceintures			= 3;
const partiesCorps		= 7;
const positionsBras		= 2;
const positionsPied		= 2;
const tailles			= 2;
const genres			= 2;

const tempsPartie		= 240; // nombre de questions * temps de mémorisation = 240 (4 minutes)

const pngExt			= '.png';
const pngChm			= 'png/';

const idCouleurTete		= 'cbnr';
const idCouleurHabit	= 'rvbj';
const idCeinture		= 'snm'; 
const idDossard			= 'tn'; // v1.1
const idPartieCorps		= ['tt','tc','ej','bg','bd','jg','jd'];
const idTeteALunettes	= 'tl';
const idGarniture		= 'tg'; // v1.3
const idPositionBras	= 'bl';
const idPositionPied	= 'je';
const idTaille			= 'cl';
const idGenre			= 'gf';
const idEspace			= 'espace';
const idBouton			= 'bouton';
const idRouge			= 'rouge';
const idVert			= 'vert';
const idBleu			= 'bleu';
const idJaune			= 'jaune';
const idMarron			= 'marron';
const idNoir			= 'noir';
const idBrun			= 'brun';
const idBlond			= 'blond';
const idRoux			= 'roux';
const delimiteursBoutons= 'abcdefghijklmnopqrstuvwxyz[]';

// localStorage 
const lsBalance			= 'n';
const lsDifficulte		= 'd';
const lsTour			= 't';
const lsScore			= 's';
const lsScoreQst		= 'sq';
const lsScoreTop		= 'st';
const lsTopScore		= 'ts';
const lsTopNoteScore	= 'tns';
const lsTopNoteScoreTop = 'tnst';

// usage : stCritere[combinaison][diffPartie]
const stCritere			= [	[['DE GAUCHE','DE DROITE'],['DE GAUCHE','DE DROITE'],['N°1','N°2','N°3','N°4'],['N°1','N°2','N°3','N°4']],
							[['DU HAUT','DU BAS'],['DU HAUT','DU MILIEU','DU BAS'],['DU HAUT','DU BAS'],['DU HAUT','DU MILIEU','DU BAS']],
							[['GARCON','FILLE'],['GARCON','FILLE'],['GARCON','FILLE'],['GARCON','FILLE']],
							[['BRUNE','BLONDE','NOIRE','ROUSSE'],['BRUNE','BLONDE','NOIRE','ROUSSE'],['BRUNE','BLONDE','NOIRE','ROUSSE'],['BRUNE','BLONDE','NOIRE','ROUSSE']],
							[['ROUGE','VERT','BLEU','JAUNE'],['ROUGE','VERT','BLEU','JAUNE'],['ROUGE','VERT','BLEU','JAUNE'],['ROUGE','VERT','BLEU','JAUNE']],
							[['NOIRE','MARRON'],['NOIRE','MARRON'],['NOIRE','MARRON'],['NOIRE','MARRON']],
							[['GAUCHE','DROIT'],['GAUCHE','DROIT'],['GAUCHE','DROIT'],['GAUCHE','DROIT']],
							[['BAISSE','LEVE'],['BAISSE','LEVE'],['BAISSE','LEVE'],['BAISSE','LEVE']],
							[['JOINT','ECARTE'],['JOINT','ECARTE'],['JOINT','ECARTE'],['JOINT','ECARTE']],
							[['COURT','LONG'],['COURT','LONG'],['COURT','LONG'],['COURT','LONG']],
							[['MOINS','PLUS'],['MOINS','PLUS'],['MOINS','PLUS'],['MOINS','PLUS']],
							[['1','2','3','4'],['1','2','3','4','5','6'],['1','2','3','4','5','6','7','8'],['1','2','3','4','5','6','7','8','9','10','11','12']]]; // v1.1

// usage : stReponse[combinaison][diffPartie]. v1.1 : ajout d'une étoile pour les boutons n'ayant qu'un chiffre 
const stReponse			= [	[['[*COLONNE*DE*GAUCHE*]','[*COLONNE*DE*DROITE*]'],['[*COLONNE*DE*GAUCHE*]','[*COLONNE*DE*DROITE*]'],['[*COLONNE*N°1*]','[*COLONNE*N°2*]', '[*COLONNE*N°3*]', '[*COLONNE*N°4*]'],['[*COLONNE*N°1*]','[*COLONNE*N°2*]', '[*COLONNE*N°3*]', '[*COLONNE*N°4*]']],
							[['[*LIGNE*DU*HAUT*]','[*LIGNE*DU*BAS*]'],['[*LIGNE*DU*HAUT*]','[*LIGNE*DU*MILIEU*]','[*LIGNE*DU*BAS*]'],['[*LIGNE*DU*HAUT*]','[*LIGNE*DU*BAS*]'],['[*LIGNE*DU*HAUT*]','[*LIGNE*DU*MILIEU*]', '[*LIGNE*DU*BAS*]']],
							[['[*COIN*HAUT*GAUCHE*]','[*COIN*HAUT*DROIT*]','[*COIN*BAS*GAUCHE*]','[*COIN*BAS*DROIT*]'],['[*COIN*HAUT*GAUCHE*]','[*COIN*HAUT*DROIT*]','[*COIN*BAS*GAUCHE*]','[*COIN*BAS*DROIT*]'],['[*COIN*HAUT*GAUCHE*]','[*COIN*HAUT*DROIT*]','[*COIN*BAS*GAUCHE*]','[*COIN*BAS*DROIT*]'],['[*COIN*HAUT*GAUCHE*]','[*COIN*HAUT*DROIT*]','[*COIN*BAS*GAUCHE*]','[*COIN*BAS*DROIT*]']],
							[['c*BRUNE*]','d*BLONDE*]','n*NOIRE*]','x*ROUSSE*]'],['c*BRUNE*]','d*BLONDE*]','n*NOIRE*]','x*ROUSSE*]'],['c*BRUNE*]','d*BLONDE*]','n*NOIRE*]','x*ROUSSE*]'],['c*BRUNE*]','d*BLONDE*]','n*NOIRE*]','x*ROUSSE*]']],
							[['r*ROUGE*]','v*VERT*]','b*BLEU*]','j*JAUNE*]'],['r*ROUGE*]','v*VERT*]','b*BLEU*]','j*JAUNE*]'],['r*ROUGE*]','v*VERT*]','b*BLEU*]','j*JAUNE*]'],['r*ROUGE*]','v*VERT*]','b*BLEU*]','j*JAUNE*]']],
							[['n*NOIRE*]','m*MARRON*]','[*PAS DE CEINTURE*]'],['n*NOIRE*]','m*MARRON*]','[*PAS DE CEINTURE*]'],['n*NOIRE*]','m*MARRON*]','[*PAS DE CEINTURE*]'],['n*NOIRE*]','m*MARRON*]','[*PAS DE CEINTURE*]']],
							[['[*LES*2*BAISSES*]','[*LES*2*LEVES*]','[*L"UN*BAISSE*L"AUTRE*LEVE*]'],['[*LES*2*BAISSES*]','[*LES*2*LEVES*]','[*L"UN*BAISSE*L"AUTRE*LEVE*]'],['[*LES*2*BAISSES*]','[*LES*2*LEVES*]','[*L"UN*BAISSE*L"AUTRE*LEVE*]'],['[*LES*2*BAISSES*]','[*LES*2*LEVES*]','[*L"UN*BAISSE*L"AUTRE*LEVE*]']],
							[['[*LES*2*JOINTS*]','[*LES*2*ECARTES*]','[*L"UN*JOINT*L"AUTRE*ECARTE*]'],['[*LES*2*JOINTS*]','[*LES*2*ECARTES*]','[*L"UN*JOINT*L"AUTRE*ECARTE*]'],['[*LES*2*JOINTS*]','[*LES*2*ECARTES*]','[*L"UN*JOINT*L"AUTRE*ECARTE*]'],['[*LES*2*JOINTS*]','[*LES*2*ECARTES*]','[*L"UN*JOINT*L"AUTRE*ECARTE*]']],
							[['[**0**]','[**1**]','[**2**]'],['[**0**]','[**1**]','[**2**]','[**3**]'],['[**0**]','[**1**]','[**2**]'],['[**0**]','[**1**]','[**2**]','[**3**]']],
							[['[**0**]','[**1**]','[**2**]'],['[**0**]','[**1**]','[**2**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]']],
							[['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]']],
							[['[**0**]','[**2**]','[**4**]'],['[**0**]','[**2**]','[**4**]','[**6**]'],['[**0**]','[**2**]','[**4**]'],['[**0**]','[**2**]','[**4**]','[**6**]']],
							[['[**0**]','[**2**]','[**4**]'],['[**0**]','[**2**]','[**4**]'],['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]'],['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]']],
							[['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]'],['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]'],['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]'],['[**0**]','[**2**]','[**4**]','[**6**]','[**8**]']],
							[['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[*0*]','[*DE*1*A*2*]','[*3*]','[*DE*4*A*5*]','[*6*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*3*]','[*DE*4*A*6*]','[*DE*7*A*9*]','[*DE*10*A*12*]']],
							[['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]'],['[*0*]','[*DE*1*A*2]','[*DE*3*A*4*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]']],
							[['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]']],
							[['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]']],
							[['[*0*]','[*DE*1*A*2*]','[*DE*3*A*4*]','[*DE*5*A*6*]','[*DE*7*A*8*]'],['[*0*]','[*DE*1*A*3*]','[*DE*4*A*6*]','[*DE*7*A*9*]','[*DE*10*A*12*]'],['[*0*]','[*DE*1*A*4*]','[*DE*5*A*8*]','[*DE*9*A*12*]','[*DE*13*A*16*]'],['[*0*]','[*DE*1*A*6*]','[*DE*7*A*12*]','[*DE*13*A*18*]','[*DE*19*A*24*]']],
							[['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]'],['[**0**]','[**1**]','[**2**]','[**3**]','[**4**]']],
							[['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]']],
							[['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]'],['[*AUCUN*GARCON*]','[*+*DE*FILLES*]','[*EGALITE*]','[*+*DE*GARCONS*]','[*AUCUNE*FILLE*]']],
							[['[*COURTE*]','[*LONGUE*]'],['[*COURTE*]','[*LONGUE*]'],['[*COURTE*]','[*LONGUE*]'],['[*COURTE*]','[*LONGUE*]']],
							[['n*NOIRE*]','m*MARRON*]'],['n*NOIRE*]','m*MARRON*]'],['n*NOIRE*]','m*MARRON*]'],['n*NOIRE*]','m*MARRON*]']],
							[['[*OUI*]','[*NON*]'],['[*OUI*]','[*NON*]'],['[*OUI*]','[*NON*]'],['[*OUI*]','[*NON*]']]];
const stBalance			= [	'',
							'v*10Q/24S*]',
							'b*12Q/20S*]',
							'c*15Q/16S*]',
							'j*20Q/12S*]',
							'r*30Q/8S*]'];
const stDifficulte		= [ 'v*2X2*]',
							'c*2X3*]',
							'j*4X2*]',
							'r*4X3*]'];
const typePartieCorps	= new creeTypePartieCorps();
const typeCouleurTete	= new creeTypeCouleurTete();
const typeCouleurHabit	= new creeTypeCouleurHabit();
const typeCeinture		= new creeTypeCeinture();
const typePositionBras	= new creeTypePositionBras();
const typePositionPied	= new creeTypePositionPied();
const typeTaille		= new creeTypeTaille();
const typeGenre			= new creeTypeGenre();
const typeCritere		= new creeTypeCritere();
const typeReponse		= new creeTypeReponse();
const typePhase			= new creeTypePhase();
const typeDifficulte	= new creeTypeDifficulte();
const typeBalance		= new creeTypeBalance();

// QUESTIONS

// /!\ Usage :
//       - Utiliser « " » comme apostrophe 
//       - Utiliser « * » comme espace insécable 
//       - Utiliser « $ » comme passage de paramètre
var questions = 0; // Autoincrémenté à la création des questions 
// v1.3 : décalage des numéros de question : new creeQuestion(delta1.3 + Delta + N°, ... 
const q = [ // Caractéristique d'un personnage
			  new creeQuestion( 0,'QUELLE EST LA TAILLE DU BAS DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rTaille) // v1.1 : N° et cNumero
			, new creeQuestion( 1,'QUELLE EST LA POSITION DES BRAS DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rPBras) // v1.1 : N° et cNumero
			, new creeQuestion( 2,'QUELLE EST LA POSITION DES PIEDS DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rPPieds) // v1.1 : N° et cNumero
			, new creeQuestion( 3,'COMBIEN DE BRAS LEVES ET PIEDS ECARTES A LE PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rQteMembres) // v1.1 : N° et cNumero
			, new creeQuestion( 4,'COMBIEN DE BRAS BAISSES ET PIEDS JOINTS A LE PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rQteMembres) // v1.1 : N° et cNumero
			, new creeQuestion( 5,'QUELLE EST LA COULEUR DE CHEVEUX DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rCTete) // v1.1 : N° et cNumero
			, new creeQuestion( 6,'QUELLE EST LA COULEUR DU HAUT DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rCHabit) // v1.1 : N° et cNumero
			, new creeQuestion( 7,'QUELLE EST LA COULEUR DU BAS DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rCHabit) // v1.1 : N° et cNumero
			, new creeQuestion( 8,'QUELLE EST LA COULEUR DES PIEDS DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rCHabit) // v1.1 : N° et cNumero
			, new creeQuestion( 9,'QUELLE EST LA COULEUR DE LA CEINTURE DU PERSONNAGE N°$*?', [typeCritere.cNumero], typeReponse.rCeinture) // v1.1 : N° et cNumero
			, new creeQuestion(10,'LE PERSONNAGE N°$ PORTE-T-IL DES LUNETTES*?', [typeCritere.cNumero], typeReponse.rOuiNon) // v1.1 : N° et cNumero
			, new creeQuestion(11,'LE PERSONNAGE N°$ PORTE-T-IL DES BOUCLES D"OREILLES*?', [typeCritere.cNumero], typeReponse.rOuiNon) // v1.3 (fille)
			, new creeQuestion(12,'LE PERSONNAGE N°$ PORTE-T-IL UNE MOUSTACHE*?', [typeCritere.cNumero], typeReponse.rOuiNon) // v1.3 (garçon)
			// Comptage sur une ligne ou une colonne
			, new creeQuestion( 2+1+10,'COMBIEN Y A-T-IL DE $S SUR LA COLONNE $*?', [typeCritere.cGenre, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+11,'COMBIEN Y A-T-IL DE $S SUR LA LIGNE $*?', [typeCritere.cGenre, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+12,'COMBIEN Y A-T-IL DE TETES $S SUR LA COLONNE $*?', [typeCritere.cCTete, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+13,'COMBIEN Y A-T-IL DE TETES $S SUR LA LIGNE $*?', [typeCritere.cCTete, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+14,'COMBIEN Y A-T-IL DE CEINTURES SUR LA COLONNE $*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+15,'COMBIEN Y A-T-IL DE CEINTURES SUR LA LIGNE $*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+16,'COMBIEN Y A-T-IL DE BAS $S SUR LA COLONNE $*?', [typeCritere.cTaille, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+17,'COMBIEN Y A-T-IL DE BAS $S SUR LA LIGNE $*?', [typeCritere.cTaille, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+18,'COMBIEN Y A-T-IL DE BRAS $S SUR LA COLONNE $*?', [typeCritere.cPBras, typeCritere.cColonne], typeReponse.rQteCx2)
			, new creeQuestion( 2+1+19,'COMBIEN Y A-T-IL DE BRAS $S SUR LA LIGNE $*?', [typeCritere.cPBras, typeCritere.cLigne], typeReponse.rQteLx2)
			, new creeQuestion( 2+1+20,'COMBIEN Y A-T-IL DE PIEDS $S SUR LA COLONNE $*?', [typeCritere.cPPied, typeCritere.cColonne], typeReponse.rQteCx2)
			, new creeQuestion( 2+1+21,'COMBIEN Y A-T-IL DE PIEDS $S SUR LA LIGNE $*?', [typeCritere.cPPied, typeCritere.cLigne], typeReponse.rQteLx2)
			, new creeQuestion( 2+1+22,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LEUR BRAS $ $*?', [typeCritere.cColonne, typeCritere.cMembre, typeCritere.cPBras], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+23,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LEUR BRAS $ $*?', [typeCritere.cLigne, typeCritere.cMembre, typeCritere.cPBras], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+24,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LEUR PIED $ $*?', [typeCritere.cColonne, typeCritere.cMembre, typeCritere.cPPied], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+25,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LEUR PIED $ $*?', [typeCritere.cLigne, typeCritere.cMembre, typeCritere.cPPied], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+26,'COMBIEN Y A-T-IL DE HAUTS $S SUR LA COLONNE $*?', [typeCritere.cCHabit, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+27,'COMBIEN Y A-T-IL DE HAUTS $S SUR LA LIGNE $*?', [typeCritere.cCHabit, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+28,'COMBIEN Y A-T-IL DE BAS $S SUR LA COLONNE $*?', [typeCritere.cCHabit, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+29,'COMBIEN Y A-T-IL DE BAS $S SUR LA LIGNE $*?', [typeCritere.cCHabit, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+30,'COMBIEN Y A-T-IL DE PIEDS $S SUR LA COLONNE $*?', [typeCritere.cCHabit, typeCritere.cColonne], typeReponse.rQtePaireC)
			, new creeQuestion( 2+1+31,'COMBIEN Y A-T-IL DE PIEDS $S SUR LA LIGNE $*?', [typeCritere.cCHabit, typeCritere.cLigne], typeReponse.rQtePaireL)
			, new creeQuestion( 2+1+32,'COMBIEN Y A-T-IL DE CEINTURES DE COULEUR $ SUR LA COLONNE $*?', [typeCritere.cCCeinture, typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+33,'COMBIEN Y A-T-IL DE CEINTURES DE COULEUR $ SUR LA LIGNE $*?', [typeCritere.cCCeinture, typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+34,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ N"ONT PAS DE CEINTURE*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+35,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ N"ONT PAS DE CEINTURE*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+36,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LE HAUT ET LE BAS DE LA MEME COULEUR*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+37,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LE HAUT ET LE BAS DE LA MEME COULEUR*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+38,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LE HAUT ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+39,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LE HAUT ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+40,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+41,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+42,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+43,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+44,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ ONT LE HAUT ET LE BAS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+45,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ ONT LE HAUT ET LE BAS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+46,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ PORTENT DU $*?', [typeCritere.cColonne, typeCritere.cCHabit], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+47,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ PORTENT DU $*?', [typeCritere.cLigne, typeCritere.cCHabit], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+48,'QUELLE EST LA REPARTITION ENTRE GARCONS ET FILLES SUR LA COLONNE $*?', [typeCritere.cColonne], typeReponse.rRGenresC)
			, new creeQuestion( 2+1+49,'QUELLE EST LA REPARTITION ENTRE GARCONS ET FILLES SUR LA LIGNE $*?', [typeCritere.cLigne], typeReponse.rRGenresLQ)
			, new creeQuestion( 2+1+50,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ PORTENT DES LUNETTES*?', [typeCritere.cColonne], typeReponse.rQuantiteC)
			, new creeQuestion( 2+1+51,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ PORTENT DES LUNETTES*?', [typeCritere.cLigne], typeReponse.rQuantiteL)
			, new creeQuestion( 2+1+52,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ PORTENT DES BOUCLES D"OREILLES*?', [typeCritere.cColonne], typeReponse.rQuantiteC) // v1.3 (fille)
			, new creeQuestion( 2+1+53,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ PORTENT DES BOUCLES D"OREILLES*?', [typeCritere.cLigne], typeReponse.rQuantiteL) // v1.3 (fille)
			, new creeQuestion( 2+1+54,'COMBIEN DE PERSONNAGES SUR LA COLONNE $ PORTENT UNE MOUSTACHE*?', [typeCritere.cColonne], typeReponse.rQuantiteC) // v1.3 (garçon)
			, new creeQuestion( 2+1+55,'COMBIEN DE PERSONNAGES SUR LA LIGNE $ PORTENT UNE MOUSTACHE*?', [typeCritere.cLigne], typeReponse.rQuantiteL) // v1.3 (garçon)
			// Comptage dans les coins
			, new creeQuestion( 6+3+50,'COMBIEN Y A-T-IL DE $S DANS LES 4 COINS*?', [typeCritere.cGenre], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+51,'COMBIEN Y A-T-IL DE TETES $S DANS LES 4 COINS*?', [typeCritere.cCTete], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+52,'COMBIEN Y A-T-IL DE CEINTURES DANS LES 4 COINS*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+53,'COMBIEN Y A-T-IL DE BAS $S DANS LES 4 COINS*?', [typeCritere.cTaille], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+54,'COMBIEN Y A-T-IL DE BRAS $S DANS LES 4 COINS*?', [typeCritere.cPBras], typeReponse.rQteQx2)
			, new creeQuestion( 6+3+55,'COMBIEN Y A-T-IL DE PIEDS $S DANS LES 4 COINS*?', [typeCritere.cPPied], typeReponse.rQteQx2)
			, new creeQuestion( 6+3+56,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LEUR BRAS $ $*?', [typeCritere.cMembre, typeCritere.cPBras], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+57,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LEUR PIED $ $*?', [typeCritere.cMembre, typeCritere.cPPied], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+58,'COMBIEN Y A-T-IL DE HAUTS $S DANS LES 4 COINS*?', [typeCritere.cCHabit], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+59,'COMBIEN Y A-T-IL DE BAS $S DANS LES 4 COINS*?', [typeCritere.cCHabit], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+60,'COMBIEN Y A-T-IL DE PIEDS $S DANS LES 4 COINS*?', [typeCritere.cCHabit], typeReponse.rQtePaireQ)
			, new creeQuestion( 6+3+61,'COMBIEN Y A-T-IL DE CEINTURES DE COULEUR $ DANS LES 4 COINS*?', [typeCritere.cCCeinture], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+62,'COMBIEN DE PERSONNAGES DANS LES 4 COINS N"ONT PAS DE CEINTURE*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+63,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LE HAUT ET LE BAS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+64,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+65,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LE HAUT ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+66,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteQ)  
			, new creeQuestion( 6+3+67,'COMBIEN DE PERSONNAGES DANS LES 4 COINS ONT LE HAUT ET LE BAS DE LA MEME COULEUR SANS CEINTURE*?', [], typeReponse.rQuantiteQ) 
			, new creeQuestion( 6+3+68,'COMBIEN DE PERSONNAGES DANS LES 4 COINS PORTENT DU $*?', [typeCritere.cCHabit], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+69,'QUELLE EST LA REPARTITION ENTRE GARCONS ET FILLES DANS LES 4 COINS*?', [], typeReponse.rRGenresLQ)
			, new creeQuestion( 6+3+70,'COMBIEN DE PERSONNAGES DANS LES 4 COINS PORTENT DES LUNETTES*?', [], typeReponse.rQuantiteQ)
			, new creeQuestion( 6+3+71,'COMBIEN DE PERSONNAGES DANS LES 4 COINS PORTENT DES BOUCLES D"OREILLES*?', [], typeReponse.rQuantiteQ) // v1.3 (filles)
			, new creeQuestion( 6+3+72,'COMBIEN DE PERSONNAGES DANS LES 4 COINS PORTENT UNE MOUSTACHE*?', [], typeReponse.rQuantiteQ) // v1.3 (garçons)
			// Comptage sur toute la grille avec UNE caractéristique
			, new creeQuestion( 8+4+70,'COMBIEN Y A-T-IL DE $S*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+71,'COMBIEN Y A-T-IL DE TETES $S*?', [typeCritere.cCTete], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+72,'COMBIEN Y A-T-IL DE BAS $S*?', [typeCritere.cTaille], typeReponse.rQuantiteG)
			, new creeQuestion( 8+4+73,'COMBIEN Y A-T-IL DE HAUT $S*?', [typeCritere.cCHabit], typeReponse.rQuantiteG)
			, new creeQuestion( 8+4+74,'COMBIEN Y A-T-IL DE BAS $S*?', [typeCritere.cCHabit], typeReponse.rQuantiteG)
			, new creeQuestion( 8+4+75,'COMBIEN Y A-T-IL DE PIEDS $S*?', [typeCritere.cCHabit], typeReponse.rQteGx2)
			, new creeQuestion( 8+4+76,'COMBIEN Y A-T-IL DE CEINTURES*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+77,'COMBIEN Y A-T-IL DE CEINTURES DE COULEUR $*?', [typeCritere.cCCeinture], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+78,'COMBIEN DE PERSONNAGES N"ONT PAS DE CEINTURE*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+79,'COMBIEN DE PERSONNAGES ONT LES DEUX BRAS $S*?', [typeCritere.cPBras], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+80,'COMBIEN DE PERSONNAGES ONT LES DEUX PIEDS $S*?', [typeCritere.cPPied], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+81,'COMBIEN DE PERSONNAGES ONT UN BRAS BAISSE ET L"AUTRE LEVE*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+82,'COMBIEN DE PERSONNAGES ONT UN PIED JOINT ET L"AUTRE ECARTE*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+83,'COMBIEN DE PERSONNAGES ONT LE HAUT ET LE BAS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+84,'COMBIEN DE PERSONNAGES ONT LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+85,'COMBIEN DE PERSONNAGES ONT LE HAUT ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+86,'COMBIEN DE PERSONNAGES ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+87,'COMBIEN DE PERSONNAGES ONT LE HAUT ET LE BAS DE LA MEME COULEUR SANS CEINTURE*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+88,'COMBIEN DE PERSONNAGES ONT LE HAUT, LE BAS ET LES PIEDS DE 3 COULEURS DIFFERENTES*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+89,'COMBIEN DE PERSONNAGES PORTENT DU $*?', [typeCritere.cCHabit], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+90,'COMBIEN DE PERSONNAGES PORTENT DES LUNETTES*?', [], typeReponse.rQuantiteG) 
			, new creeQuestion( 8+4+91,'COMBIEN DE PERSONNAGES PORTENT DES BOUCLES D"OREILLES*?', [], typeReponse.rQuantiteG) // v1.3 (filles)
			, new creeQuestion( 8+4+92,'COMBIEN DE PERSONNAGES PORTENT UNE MOUSTACHE*?', [], typeReponse.rQuantiteG) // v1.3 (garçons)
			, new creeQuestion( 8+4+93,'COMBIEN Y A-T-IL DE BRAS $S*?', [typeCritere.cPBras], typeReponse.rQteGx2)
			, new creeQuestion( 8+4+94,'COMBIEN Y A-T-IL DE PIEDS $S*?', [typeCritere.cPPied], typeReponse.rQteGx2)
			// Comptage sur toute la grille avec GENRE + une caractéristique
			, new creeQuestion(10+7+ 90,'COMBIEN DE $S ONT LA TETE $*?', [typeCritere.cGenre, typeCritere.cCTete], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+ 91,'COMBIEN DE $S ONT LE BAS $*?', [typeCritere.cGenre, typeCritere.cTaille], typeReponse.rQuantiteG)
			, new creeQuestion(10+7+ 92,'COMBIEN DE $S ONT LE HAUT $*?', [typeCritere.cGenre, typeCritere.cCHabit], typeReponse.rQuantiteG)
			, new creeQuestion(10+7+ 93,'COMBIEN DE $S ONT LE BAS $*?', [typeCritere.cGenre, typeCritere.cCHabit], typeReponse.rQuantiteG)
			, new creeQuestion(10+7+ 94,'COMBIEN DE $S ONT LES PIEDS $S*?', [typeCritere.cGenre, typeCritere.cCHabit], typeReponse.rQuantiteG)
			, new creeQuestion(10+7+ 95,'COMBIEN DE $S ONT UNE CEINTURE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+ 96,'COMBIEN DE $S N"ONT PAS DE CEINTURE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+ 97,'COMBIEN DE $S ONT UNE CEINTURE DE COULEUR $*?', [typeCritere.cGenre, typeCritere.cCCeinture], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+ 98,'COMBIEN DE $S ONT LES DEUX BRAS $S*?', [typeCritere.cGenre, typeCritere.cPBras], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+ 99,'COMBIEN DE $S ONT LES DEUX PIEDS $S*?', [typeCritere.cGenre, typeCritere.cPPied], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+100,'COMBIEN DE $S ONT UN BRAS BAISSE ET L"AUTRE LEVE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+101,'COMBIEN DE $S ONT UN PIED JOINT ET L"AUTRE ECARTE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+102,'COMBIEN DE $S ONT LE HAUT ET LE BAS DE LA MEME COULEUR*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+103,'COMBIEN DE $S ONT LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+104,'COMBIEN DE $S ONT LE HAUT ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+105,'COMBIEN DE $S ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+106,'COMBIEN DE $S ONT LE HAUT ET LE BAS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+107,'COMBIEN DE $S ONT LE HAUT, LE BAS ET LES PIEDS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+108,'COMBIEN DE $S ONT LE HAUT, LE BAS ET LES PIEDS DE 3 COULEURS DIFFERENTES*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+109,'COMBIEN DE $S PORTENT DU $*?', [typeCritere.cGenre, typeCritere.cCHabit], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+110,'COMBIEN DE $S PORTENT DES LUNETTES*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			, new creeQuestion(10+7+111,'COMBIEN DE $S NE PORTENT PAS DE LUNETTES*?', [typeCritere.cGenre], typeReponse.rQuantiteG) 
			// Dans quelle ligne/colonne trouve-t-on le +/- de ...
			, new creeQuestion(10+9+110,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE $S*?', [typeCritere.cCompare, typeCritere.cGenre], typeReponse.rColonne)
			, new creeQuestion(10+9+111,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE $S*?', [typeCritere.cCompare, typeCritere.cGenre], typeReponse.rLigne)
			, new creeQuestion(10+9+112,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE TETES $S*?', [typeCritere.cCompare, typeCritere.cCTete], typeReponse.rColonne)
			, new creeQuestion(10+9+113,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE TETES $S*?', [typeCritere.cCompare, typeCritere.cCTete], typeReponse.rLigne)
			, new creeQuestion(10+9+114,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE CEINTURES*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+115,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE CEINTURES*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+116,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE BAS $S*?', [typeCritere.cCompare, typeCritere.cTaille], typeReponse.rColonne)
			, new creeQuestion(10+9+117,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE BAS $S*?', [typeCritere.cCompare, typeCritere.cTaille], typeReponse.rLigne)
			, new creeQuestion(10+9+118,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE BRAS $S*?', [typeCritere.cCompare, typeCritere.cPBras], typeReponse.rColonne)
			, new creeQuestion(10+9+119,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE BRAS $S*?', [typeCritere.cCompare, typeCritere.cPBras], typeReponse.rLigne)
			, new creeQuestion(10+9+120,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PIEDS $S*?', [typeCritere.cCompare, typeCritere.cPPied], typeReponse.rColonne)
			, new creeQuestion(10+9+121,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PIEDS $S*?', [typeCritere.cCompare, typeCritere.cPPied], typeReponse.rLigne)
			, new creeQuestion(10+9+122,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUT $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rColonne)
			, new creeQuestion(10+9+123,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUT $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rLigne)
			, new creeQuestion(10+9+124,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE BAS $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rColonne)
			, new creeQuestion(10+9+125,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE BAS $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rLigne)
			, new creeQuestion(10+9+126,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PIEDS $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rColonne)
			, new creeQuestion(10+9+127,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PIEDS $S*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rLigne)
			, new creeQuestion(10+9+128,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PERSONNAGES AYANT LEUR BRAS $ $*?', [typeCritere.cCompare, typeCritere.cMembre, typeCritere.cPBras], typeReponse.rColonne)
			, new creeQuestion(10+9+129,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PERSONNAGES AYANT LEUR BRAS $ $*?', [typeCritere.cCompare, typeCritere.cMembre, typeCritere.cPBras], typeReponse.rLigne)
			, new creeQuestion(10+9+130,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PERSONNAGES AYANT LEUR PIED $ $*?', [typeCritere.cCompare, typeCritere.cMembre, typeCritere.cPPied], typeReponse.rColonne)
			, new creeQuestion(10+9+131,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PERSONNAGES AYANT LEUR PIED $ $*?', [typeCritere.cCompare, typeCritere.cMembre, typeCritere.cPPied], typeReponse.rLigne)
			, new creeQuestion(10+9+132,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE CEINTURES DE COULEUR $*?', [typeCritere.cCompare, typeCritere.cCCeinture], typeReponse.rColonne)
			, new creeQuestion(10+9+133,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE CEINTURES DE COULEUR $*?', [typeCritere.cCompare, typeCritere.cCCeinture], typeReponse.rLigne)
			, new creeQuestion(10+9+134,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PERSONNAGES N"AYANT PAS DE CEINTURE*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+135,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PERSONNAGES N"AYANT PAS DE CEINTURE*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+136,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUTS ET DE BAS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+137,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUTS ET DE BAS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+138,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE BAS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+139,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE BAS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+140,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUTS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+141,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUTS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+142,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUTS ET DE BAS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+143,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUTS ET DE BAS DE LA MEME COULEUR SANS CEINTURE*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+144,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUTS, DE BAS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+145,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUTS, DE BAS ET DE PIEDS DE LA MEME COULEUR*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+146,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE HAUTS, DE BAS ET DE PIEDS DE 3 COULEURS DIFFERENTES*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+147,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE HAUTS, DE BAS ET DE PIEDS DE 3 COULEURS DIFFERENTES*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+148,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE PERSONNAGES PORTANT DU $*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rColonne)
			, new creeQuestion(10+9+149,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE PERSONNAGES PORTANT DU $*?', [typeCritere.cCompare, typeCritere.cCHabit], typeReponse.rLigne)
			, new creeQuestion(10+9+150,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE LUNETTES*?', [typeCritere.cCompare], typeReponse.rColonne)
			, new creeQuestion(10+9+151,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE LUNETTES*?', [typeCritere.cCompare], typeReponse.rLigne)
			, new creeQuestion(10+9+152,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE BOUCLES D"OREILLES*?', [typeCritere.cCompare], typeReponse.rColonne) // v1.3 (filles)
			, new creeQuestion(10+9+153,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE BOUCLES D"OREILLES*?', [typeCritere.cCompare], typeReponse.rLigne) // v1.3 (filles)
			, new creeQuestion(10+9+154,'DANS QUELLE COLONNE TROUVE-T-ON LE $ DE MOUSTACHES*?', [typeCritere.cCompare], typeReponse.rColonne) // v1.3 (garçons)
			, new creeQuestion(10+9+155,'DANS QUELLE LIGNE TROUVE-T-ON LE $ DE MOUSTACHES*?', [typeCritere.cCompare], typeReponse.rLigne) // v1.3 (garçons)
			// Quel critère est le +/- répandu sur la ligne/colonne/coin
			, new creeQuestion(14+11+150,'QUELLE EST LA TAILLE DE BAS LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rTaille)
			, new creeQuestion(14+11+151,'QUELLE EST LA TAILLE DE BAS LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rTaille)
			, new creeQuestion(14+11+152,'QUELLE EST LA TAILLE DE BAS LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rTaille)
			, new creeQuestion(14+11+153,'QUELLE EST LA POSITION DE BRAS LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rPBras)
			, new creeQuestion(14+11+154,'QUELLE EST LA POSITION DE BRAS LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rPBras)
			, new creeQuestion(14+11+155,'QUELLE EST LA POSITION DE BRAS LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rPBras)
			, new creeQuestion(14+11+156,'QUELLE EST LA POSITION DE PIEDS LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rPPieds)
			, new creeQuestion(14+11+157,'QUELLE EST LA POSITION DE PIEDS LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rPPieds)
			, new creeQuestion(14+11+158,'QUELLE EST LA POSITION DE PIEDS LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rPPieds)
			, new creeQuestion(14+11+159,'QUELLE EST LA COULEUR DE CHEVEUX LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rCTete)
			, new creeQuestion(14+11+160,'QUELLE EST LA COULEUR DE CHEVEUX LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rCTete)
			, new creeQuestion(14+11+161,'QUELLE EST LA COULEUR DE CHEVEUX LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rCTete)
			, new creeQuestion(14+11+162,'QUELLE EST LA COULEUR DE HAUT LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rCHabit)
			, new creeQuestion(14+11+163,'QUELLE EST LA COULEUR DE HAUT LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rCHabit)
			, new creeQuestion(14+11+164,'QUELLE EST LA COULEUR DE HAUT LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rCHabit)
			, new creeQuestion(14+11+165,'QUELLE EST LA COULEUR DE BAS LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rCHabit)
			, new creeQuestion(14+11+166,'QUELLE EST LA COULEUR DE BAS LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rCHabit)
			, new creeQuestion(14+11+167,'QUELLE EST LA COULEUR DE BAS LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rCHabit)
			, new creeQuestion(14+11+168,'QUELLE EST LA COULEUR DE PIEDS LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rCHabit)
			, new creeQuestion(14+11+169,'QUELLE EST LA COULEUR DE PIEDS LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rCHabit)
			, new creeQuestion(14+11+170,'QUELLE EST LA COULEUR DE PIEDS LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rCHabit)
			, new creeQuestion(14+11+171,'QUELLE EST LA COULEUR DE CEINTURE LA $ REPANDUE SUR LA COLONNE $*?', [typeCritere.cCompare, typeCritere.cColonne], typeReponse.rCCeinture)
			, new creeQuestion(14+11+172,'QUELLE EST LA COULEUR DE CEINTURE LA $ REPANDUE SUR LA LIGNE $*?', [typeCritere.cCompare, typeCritere.cLigne], typeReponse.rCCeinture)
			, new creeQuestion(14+11+173,'QUELLE EST LA COULEUR DE CEINTURE LA $ REPANDUE DANS LES 4 COINS*?', [typeCritere.cCompare], typeReponse.rCCeinture)
			];
			
//---------------------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------------------

var score = 0;
var scoreTop = 0;
var scoreQst = 0;
var tour = 0;
var balance = typeBalance.b12q20s; // Paramètres par défaut = 12q / 20s
var difficulte = typeDifficulte.d2x2; // par défaut = 2 colonnes x 2 lignes
var balPartie = typeBalance.b12q20s; // Balance en cours de partie
var diffPartie = typeDifficulte.d2x2; // Difficulté en cours de partie
var indexRDJ = indefini;
var phase = typePhase.phHorsJeu;
var nq = indefini;
var nqc = indefini;
var p = [[	new creePersonnage(0, 0), new creePersonnage(0, 1), new creePersonnage(0, 2)],
		 [	new creePersonnage(1, 0), new creePersonnage(1, 1), new creePersonnage(1, 2)],
		 [	new creePersonnage(2, 0), new creePersonnage(2, 1), new creePersonnage(2, 2)],
		 [	new creePersonnage(3, 0), new creePersonnage(3, 1), new creePersonnage(3, 2)]];
var tops = [new creeTop(0), new creeTop(1), new creeTop(2), new creeTop(3), new creeTop(4)];  // tops[4] = tops des tops (tops[tous])
//---------------------------------------------------------------------------
// CONSTRUCTEURS
//---------------------------------------------------------------------------

function creeTypePartieCorps()
{
	this.pcIndefinie	= indefini;
	this.pcTete 		= 0;
	this.pcTorse		= 1; // Haut + Ceinture
	this.pcEntreJambe	= 2;
	this.pcBrasGauche	= 3;
	this.pcBrasDroit	= 4;
	this.pcJambeGauche	= 5;
	this.pcJambeDroite	= 6;
}
//---------------------------------------------------------------------------
function creeTypeCouleurTete()
{
	this.ctIndefinie	= indefini;
	this.ctBrune		= 0;
	this.ctBlonde		= 1;
	this.ctNoire		= 2;
	this.ctRousse		= 3;
}
//---------------------------------------------------------------------------
function creeTypeCouleurHabit()
{	
	this.chIndefinie	= indefini;
	this.chRouge		= 0;
	this.chVert			= 1;
	this.chBleu			= 2;
	this.chJaune		= 3;
}
//---------------------------------------------------------------------------
function creeTypeCeinture()
{	
	this.cIndefinie	= indefini;
	this.cSans		= 0;
	this.cNoire		= 1;
	this.cMarron	= 2;
}
//---------------------------------------------------------------------------
function creeTypePositionBras()
{
	this.pbIndefinie 	= indefini;
	this.pbBaissee		= 0;
	this.pbLevee		= 1;
}
//---------------------------------------------------------------------------
function creeTypePositionPied()
{
	this.ppIndefinie = indefini;
	this.ppJointe	= 0;
	this.ppEcartee	= 1;
}
//---------------------------------------------------------------------------
function creeTypeTaille()
{
	this.tIndefinie = indefini;
	this.tCourte	= 0;
	this.tLongue	= 1;
}
//---------------------------------------------------------------------------
function creeTypeGenre()
{
	this.gIndefini	= indefini;
	this.gGarcon	= 0;
	this.gFille		= 1;
}
//---------------------------------------------------------------------------
function creeTypeCritere()
{
	this.cIndefini	= indefini;
	this.cColonne	= 0; // de 1ère à 4ème
	this.cLigne		= 1; // de 1ère à 3ème
	this.cGenre		= 2; // Garçon ou Fille
	this.cCTete		= 3; // Brune, Blonde, Noire ou Rousse
	this.cCHabit	= 4; // Rouge, Vert, Bleu ou Jaune
	this.cCCeinture	= 5; // Noire ou Marron
	this.cMembre	= 6; // Gauche ou Droit
	this.cPBras		= 7; // Baissé ou Levé
	this.cPPied		= 8; // Joint ou Ecarté
	this.cTaille	= 9; // Courte ou Longue
	this.cCompare	= 10; // Plus/Moins
	this.cNumero    = 11; // N°1 à N°12
}
//---------------------------------------------------------------------------
function creeTypeReponse()
{ // Suffixes : L=Ligne; C=Colonne; Q=Coin
	this.rIndefinie	= indefini;
	this.rColonne	= 0; // (4) de 1ère à 4ème
	this.rLigne		= 1; // (3) de 1ère à 3ème
	this.rCoin		= 2; // (4) SG, SD, IG, ID
	this.rCTete		= 3; // (4) Brune, Blonde, Noire ou Rousse
	this.rCHabit	= 4; // (4) Rouge, Vert, Bleu ou Jaune
	this.rCeinture  = 5; // (3) Noire, Marron, Pas de ceinture
	this.rPBras		= 6; // (4) G/D Baissé/Levé
	this.rPPieds	= 7; // (4) G/D Joint/Ecarté
	this.rQuantiteC	= 8; // (4) De 0 à 3
	this.rQuantiteL = 9; // (5) De 0 à 4
	this.rQuantiteQ = 10; // (5) De 0 à 4
	this.rQtePaireC	= 11; // (4) De 0 à 6
	this.rQtePaireL = 12; // (5) De 0 à 8
	this.rQtePaireQ = 13; // (5) De 0 à 8
	this.rQuantiteG	= 14; // (5) Aucun, de 1 à 3, de 4 à 6, de 7 à 9, de 10 à 12
	this.rQteCx2	= 15; // (4) Aucun, de 1 à 2, de 3 à 4, de 5 à 6
	this.rQteLx2	= 16; // (5) Aucun, de 1 à 2, de 3 à 4, de 5 à 6, de 7 à 8
	this.rQteQx2	= 17; // (5) Aucun, de 1 à 2, de 3 à 4, de 5 à 6, de 7 à 8
	this.rQteGx2	= 18; // (5) De 0 à 4, de 5 à 9, de 10 à 14, de 15 à 19, de 20 à 24
	this.rQteMembres= 19; // (5) 0~4 bras et pieds (levés+écartés/baissés+joints)
	this.rRGenresC	= 20; // (4) 0G, -G/+F, +G/-F, 0F (lignes)
	this.rRGenresLQ	= 21; // (5) 0G, -G/+F, G=F, +G/-F, 0F (colonnes)
	this.rTaille	= 22; // (2) Courte, Longue
	this.rCCeinture = 23; // (2) Noire, Marron
	this.rOuiNon	= 24; // (2) Oui, Non
}
//---------------------------------------------------------------------------
function creeTypePhase()
{
	this.phHorsJeu				= indefini;
	this.phMontrePersonnages 	= 0;
	this.phPoseQuestion 		= 1;
	this.phAfficheSolution		= 2;
	this.phAfficheScore			= 3;
	this.phChoisitBalance		= 4;
	this.phChoisitDifficulte	= 5;
	this.phAfficheRegle			= 6;
	this.phAfficheTops			= 7;
	this.phAPropos				= 8; // Pour définir les liens Internet
}
//---------------------------------------------------------------------------
function creeTypeBalance()
{
	this.bIndefini = 0;
	this.b10q24s = 1;
	this.b12q20s = 2;
	this.b15q16s = 3;
	this.b20q12s = 4;
	this.b30q08s = 5;
}
//---------------------------------------------------------------------------
function creeTypeDifficulte()
{
	this.dIndefini = indefini;
	this.d2x2 = 0;
	this.d2x3 = 1;
	this.d4x2 = 2;
	this.d4x3 = 3;
}
//---------------------------------------------------------------------------
function creePersonnage(x, y)
{
	this.x			= x;
	this.y			= y;
	this.genre		= typeGenre.gIndefini; // Garçon ou Fille
	this.tete		= typeCouleurTete.ctIndefinie; // couleur tête (brune, blond, noire, rousse)
	this.lunettes	= indefini;
	this.garniture  = indefini; // v1.3
	this.brasG		= typePositionBras.pbIndefinie; // Levé ou Baissé (G = gauche pour l'observateur)
	this.brasD		= typePositionBras.pbIndefinie; // Levé ou Baissé (D = droite pour l'observateur)
	this.taille		= typeTaille.tIndefinie; // Taille du bas : Courte ou Longue
	this.haut		= typeCouleurHabit.chIndefinie; // Rouge/Vert/Bleu/Jaune
	this.bas		= typeCouleurHabit.chIndefinie; // Rouge/Vert/Bleu/Jaune
	this.ceinture 	= typeCeinture.cIndefinie; // Marron/Noire/Pas de ceinture
	this.pieds		= typeCouleurHabit.chIndefinie; // Rouge/Vert/Bleu/Jaune
	this.piedG		= typePositionPied.ppIndefinie; // Joint ou Ecarté (G = gauche pour l'observateur)
	this.piedD		= typePositionPied.ppIndefinie; // Joint ou Ecarté (D = droite pour l'observateur)
	// méthodes
	this.genere		= personnageGenere;
	this.affiche	= personnageAffiche;
	this.masque		= personnageMasque;
	this.cache		= personnageCache;
}
//---------------------------------------------------------------------------
function creeQuestion(n, t, c, r) // c = [typeCritere.cXXX, typeCritere.cYYY, ...] ; r = typeReponse.rZZZ
{
	this.n = n;
	this.t = t;
	this.c = c;
	this.r = r;
	// méthodes 
	this.possibilites = questionPossibilites;
	this.combinaison = questionCombinaison;
	this.reponses = questionReponses;
	this.solution = questionSolution;
	questions++;
}   
//---------------------------------------------------------------------------
function creeTop(n)
{
	this.niveau = n; // 0 = toutes balances confondues
	this.topScore = 0;
	this.topNoteScore = 0; // Meilleure note : numérateur
	this.topNoteScoreTop = 0; // Meilleure note : dénominateur
	// méthodes
	this.testeTops = topTesteTops;
	this.litTops = topLitTops;
}
//---------------------------------------------------------------------------
// METHODES
//---------------------------------------------------------------------------

function personnageGenere()
{
	this.genre		= Math.floor(genres*Math.random());
	this.tete		= Math.floor(couleursTete*Math.random());
	this.lunettes	= Math.floor(2*Math.random());
	this.garniture	= Math.floor(2*Math.random()); // v1.3
	this.brasG		= Math.floor(positionsBras*Math.random());
	this.brasD		= Math.floor(positionsBras*Math.random());
	this.taille		= Math.floor(tailles*Math.random());
	this.haut		= Math.floor(couleursHabit*Math.random());
	this.bas		= Math.floor(couleursHabit*Math.random());
	this.ceinture 	= Math.floor(ceintures*Math.random());
	this.pieds		= Math.floor(couleursHabit*Math.random());
	this.piedG		= Math.floor(positionsPied*Math.random());
	this.piedD		= Math.floor(positionsPied*Math.random());
}
//---------------------------------------------------------------------------
function personnageAffiche()
{
	var pos = String.fromCharCode(charCodeMin + this.x + 1 + (colonnesMax - colonnes[diffPartie]) / 2) + (this.y + 1 + lignesMax - lignes[diffPartie]);
	var genre = idGenre[this.genre];
	var bas = idCouleurHabit[this.bas] + idCouleurHabit[this.pieds];
	var haut = idCouleurHabit[this.haut];
	var taille = idTaille[this.taille];
	document.images[pos + idPartieCorps[typePartieCorps.pcTete]].src = pngChm + genre + (this.lunettes?idTeteALunettes:idPartieCorps[typePartieCorps.pcTete]) + idGarniture[this.garniture] + idCouleurTete[this.tete] + pngExt; // v1.3 (garniture)
	document.images[pos + idPartieCorps[typePartieCorps.pcTorse]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcTorse] + idCouleurHabit[this.haut] + idCeinture[this.ceinture] + pngExt;
	document.images[pos + idDossard].src = pngChm + idDossard + (1 + this.x + colonnes[diffPartie]*this.y) + ((idCouleurHabit[this.haut] == idCouleurHabit[typeCouleurHabit.chBleu]) ? negatif : vide) + pngExt;
	document.images[pos + idPartieCorps[typePartieCorps.pcEntreJambe]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcEntreJambe] + idTaille[this.taille] + idCouleurHabit[this.bas] + pngExt;
	document.images[pos + idPartieCorps[typePartieCorps.pcBrasGauche]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcBrasGauche] + idPositionBras[this.brasG] + haut + pngExt;
	document.images[pos + idPartieCorps[typePartieCorps.pcBrasDroit]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcBrasDroit] + idPositionBras[this.brasD] + haut + pngExt;
	document.images[pos + idPartieCorps[typePartieCorps.pcJambeGauche]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcJambeGauche] + taille + idPositionPied[this.piedG] + bas + pngExt;
	document.images[pos + idPartieCorps[typePartieCorps.pcJambeDroite]].src = pngChm + genre + idPartieCorps[typePartieCorps.pcJambeDroite] + taille + idPositionPied[this.piedD] + bas + pngExt;
}
//---------------------------------------------------------------------------
function personnageCache()
{
	var pos = String.fromCharCode(charCodeMin + this.x + 1) + (this.y + 1);
	for(var i=0; i<partiesCorps; i++)
		document.images[pos + idPartieCorps[i]].src = pngChm + idPartieCorps[i] + '00' + pngExt;
	document.images[pos + idDossard].src = pngChm + idDossard + '0' + pngExt;
}
//---------------------------------------------------------------------------
function personnageMasque()
{
	var pos = String.fromCharCode(charCodeMin + this.x + 1 + (colonnesMax - colonnes[diffPartie]) / 2) + (this.y + 1 + lignesMax - lignes[diffPartie]);
	for(var i=0; i<partiesCorps; i++)
		document.images[pos + idPartieCorps[i]].src = pngChm + idPartieCorps[i] + '0' + pngExt;
	document.images[pos + idDossard].src = pngChm + idDossard + '0' + pngExt;
}
//---------------------------------------------------------------------------
function questionPossibilites()
{
	var n = 1;
	for(var i=0; i<this.c.length; i++) 
		n *= stCritere[this.c[i]][diffPartie].length;
	return n;
}
//---------------------------------------------------------------------------
function questionReponses()
{
	var r = vide;
	for(var i=0; i<stReponse[this.r][diffPartie].length; i++)
		r = r + (i?espace:vide) + stReponse[this.r][diffPartie][i];
	return r;		
}
//---------------------------------------------------------------------------
function questionCombinaison(numero)
{
	// 1. On calcule les coefficients pour décoder le numéro en sens inverse
	var coef = [1];
	for(var i=1; i<this.c.length; i++) 
		coef[i] = coef[i-1] * stCritere[this.c[i-1]][diffPartie].length;
	// 2. On détermine les critères par division entière et reste.
	var t = this.t;
	var reste = numero;
	var posCrit = indefini;
	for(var i=this.c.length-1; i>=0; i--) {
		posCrit = t.lastIndexOf('$')
		t = t.substring(0, posCrit) + stCritere[this.c[i]][diffPartie][Math.floor(reste/coef[i])] + t.substring(posCrit+1);
		reste = reste % coef[i];
	}
	return (tour?tour + '. ':vide) + t + nvLigne + this.reponses();
}
//---------------------------------------------------------------------------
function solutionDecompteGrille(n)
{
	return ((colonnes[diffPartie]<colonnesMax)?((lignes[diffPartie]<lignesMax)?n:(2*Math.floor(n/3)+(n%3>0))):(n>0)*(1+Math.floor((n-1)/lignes[diffPartie])));
}
//---------------------------------------------------------------------------
function questionSolution(c)
{
	var s=indefini;
	switch(this.n) {
		case 0: s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].taille;
				break;
		case 1: //position bras (2v,2^,1v1^)
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasD+
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasG;
				s=(!s?0:3-s);
				break;
		case 2: //position pieds (2v,2^,1v1^)
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedD+
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedG;
				s=(!s?0:3-s);
				break;
		case 3: //combiens de (p+b)v ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasD+
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasG+
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedD+
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedG;
				break;
		case 4: //combiens de (p+b)^ ?
				s=	4-
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasD-
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].brasG-
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedD-
					p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].piedG;
				break;
		case 5: //couleur cheveux ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].tete;
				break;
		case 6: //couleur haut ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].haut;
				break;
		case 7: //couleur bas ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].bas;
				break;
		case 8: //couleur pieds ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].pieds;
				break;
		case 9: //couleur ceinture ?
				s=	p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].ceinture;
				s=(!s?2:s-1);
				break;
		case 10: //lunettes ?
				s=	!p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].lunettes;
				break;
		case 11: //boucles d'oreilles ?  v1.3
				if (p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].genre==typeGenre.gFille)
					s=!(p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].garniture);
				else
					s=indefini;	
				break;
		case 12: //moustache ?  v1.3
				if (p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].genre==typeGenre.gGarcon)
					s=!(p[c%colonnes[diffPartie]][Math.floor(c/colonnes[diffPartie])].garniture);
				else
					s=indefini;
				break;
		case 2+1+10://combien de garçons/filles sur la colonne
				var x=Math.floor(c/2);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=p[x][y].genre;
				if (!(c%2))
					s=lignes[diffPartie]-s;
				break;
		case 2+1+11://combien de garçons/filles sur la ligne
				var y=Math.floor(c/2);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=p[x][y].genre;
				if (!(c%2))
					s=colonnes[diffPartie]-s;
				break;
		case 2+1+12://combien de tête brunes/blondes/noires/rousses sur colonne
				var x=Math.floor(c/couleursTete);
				var t=c%couleursTete;
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[x][y].tete==t);
				break;
		case 2+1+13://combien de tête brunes/blondes/noires/rousses sur ligne
				var y=Math.floor(c/couleursTete);
				var t=c%couleursTete;
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][y].tete==t);
				break;
		case 2+1+14://combien de ceintures sur colonne
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=!!p[c][y].ceinture;
				break;
		case 2+1+15://combien de ceintures sur ligne
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=!!p[x][c].ceinture;
				break;
		case 2+1+16://combien de bas courts/longs sur colonne
				var t=c%2;
				var x=Math.floor(c/2);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=p[x][y].taille;
				if (!t)
					s=lignes[diffPartie]-s;
				break;
		case 2+1+17://combien de bas courts/longs sur ligne
				var t=c%2;
				var y=Math.floor(c/2);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=p[x][y].taille;
				if (!t)
					s=colonnes[diffPartie]-s;
				break;
		case 2+1+18://combien de bras v/^ sur colonne
				var t=c%2;
				var x=Math.floor(c/2);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=p[x][y].brasG+p[x][y].brasD;
				if (!t)
					s=2*lignes[diffPartie]-s;
				s=Math.floor((s+1)/2);
				break;
		case 2+1+19://combien de bras v/^ sur ligne
				var t=c%2;
				var y=Math.floor(c/2);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=p[x][y].brasG+p[x][y].brasD;
				if (!t)
					s=2*colonnes[diffPartie]-s;
				s=Math.floor((s+1)/2);
				break;
		case 2+1+20://combien de pieds ||/^ sur colonne
				var t=c%2;
				var x=Math.floor(c/2);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=p[x][y].piedG+p[x][y].piedD;
				if (!t)
					s=2*lignes[diffPartie]-s;
				s=Math.floor((s+1)/2);
				break;
		case 2+1+21://combien de  pieds ||/^ sur ligne
				var t=c%2;
				var y=Math.floor(c/2);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=p[x][y].piedG+p[x][y].piedD;
				if (!t)
					s=2*colonnes[diffPartie]-s;
				s=Math.floor((s+1)/2);
				break;
		case 2+1+22://combien ont bras gauche/droite ^/v sur colonne
				var x=c%colonnes[diffPartie];
				var gd=Math.floor(c/colonnes[diffPartie])%2;
				var bl=Math.floor(c/(2*colonnes[diffPartie]));
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					if (gd) // attention GD (observateur) inversé par rapport à gd (personnage)
						s+=p[x][y].brasG;
					else
						s+=p[x][y].brasD;
				if (!bl)
					s=lignes[diffPartie]-s;
				break;
		case 2+1+23://combien ont bras gauche/droite ^/v sur ligne
				var y=c%lignes[diffPartie];
				var gd=Math.floor(c/lignes[diffPartie])%2;
				var bl=Math.floor(c/(2*lignes[diffPartie]));
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					if (gd) // attention GD (observateur) inversé par rapport à gd (personnage)
						s+=p[x][y].brasG;
					else
						s+=p[x][y].brasD;
				if (!bl)
					s=colonnes[diffPartie]-s;
				break;
		case 2+1+24://combien ont pied gauche/droite ||/^ sur colonne
				var x=c%colonnes[diffPartie];
				var gd=Math.floor(c/colonnes[diffPartie])%2;
				var bl=Math.floor(c/(2*colonnes[diffPartie]));
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					if (gd) // attention GD (observateur) inversé par rapport à gd (personnage)
						s+=p[x][y].piedG;
					else
						s+=p[x][y].piedD;
				if (!bl)
					s=lignes[diffPartie]-s;
				break;
		case 2+1+25://combien ont pied gauche/droite ||/^ sur ligne
				var y=c%lignes[diffPartie];
				var gd=Math.floor(c/lignes[diffPartie])%2;
				var bl=Math.floor(c/(2*lignes[diffPartie]));
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					if (gd) // attention GD (observateur) inversé par rapport à gd (personnage)
						s+=p[x][y].piedG;
					else
						s+=p[x][y].piedD;
				if (!bl)
					s=colonnes[diffPartie]-s;
				break;
		case 2+1+26://combien de hauts d'une certaine couleur sur colonne
				var x=Math.floor(c/couleursHabit);
				var ch=c%couleursHabit;
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[x][y].haut==ch);
				break;
		case 2+1+27://combien de hauts d'une certaine couleur sur ligne
				var y=Math.floor(c/couleursHabit);
				var ch=c%couleursHabit;
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][y].haut==ch);
				break;
		case 2+1+28://combien de bas d'une certaine couleur sur colonne
				var x=Math.floor(c/couleursHabit);
				var cb=c%couleursHabit;
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[x][y].bas==cb);
				break;
		case 2+1+29://combien de bas d'une certaine couleur sur ligne
				var y=Math.floor(c/couleursHabit);
				var cb=c%couleursHabit;
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][y].bas==cb);
				break;
		case 2+1+30://combien de pieds d'une certaine couleur sur colonne
				var x=Math.floor(c/couleursHabit);
				var cp=c%couleursHabit;
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[x][y].pieds==cp);
				break;
		case 2+1+31://combien de pieds d'une certaine couleur sur ligne
				var y=Math.floor(c/couleursHabit);
				var cp=c%couleursHabit;
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][y].pieds==cp);
				break;
		case 2+1+32://combien de ceintures d'une certaine couleur sur colonne
				var x=Math.floor(c/(ceintures-1));
				var cc=1+c%(ceintures-1);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[x][y].ceinture==cc);
				break;
		case 2+1+33://combien de ceintures d'une certaine couleur sur ligne
				var y=Math.floor(c/(ceintures-1));
				var cc=1+c%(ceintures-1);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][y].ceinture==cc);
				break;
		case 2+1+34://combien n'ont pas de ceinture (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(!p[c][y].ceinture);
				break;
		case 2+1+35://combien n'ont pas de ceinture (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(!p[x][c].ceinture);
				break;
		case 2+1+36://combien ont haut=bas (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[c][y].haut==p[c][y].bas);
				break;
		case 2+1+37://combien ont haut=bas (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][c].haut==p[x][c].bas);
				break;
		case 2+1+38://combien ont haut=pieds (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[c][y].haut==p[c][y].pieds);
				break;
		case 2+1+39://combien ont haut=pieds (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][c].haut==p[x][c].pieds);
				break;
		case 2+1+40://combien ont bas=pieds (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[c][y].pieds==p[c][y].bas);
				break;
		case 2+1+41://combien ont bas=pieds (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][c].pieds==p[x][c].bas);
				break;
		case 2+1+42://combien ont haut=bas=pieds (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=((p[c][y].haut==p[c][y].bas)&&(p[c][y].haut==p[c][y].pieds));
				break;
		case 2+1+43://combien ont haut=bas=pieds (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=((p[x][c].haut==p[x][c].bas)&&(p[x][c].haut==p[x][c].pieds));
				break;
		case 2+1+44://combien ont haut=bas sans ceinture (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=((p[c][y].haut==p[c][y].bas)&&(!p[c][y].ceinture));
				break;
		case 2+1+45://combien ont haut=bas sans ceinture (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=((p[x][c].haut==p[x][c].bas)&&(!p[x][c].ceinture));
				break;
		case 2+1+46://combien ont une certaine couleur (colonne)
				var x=c%colonnes[diffPartie];
				var ch=Math.floor(c/colonnes[diffPartie]);
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=((p[x][y].haut==ch)||(p[x][y].bas==ch)||(p[x][y].pieds==ch));
				break;
		case 2+1+47://combien ont une certaine couleur (ligne)
				var y=c%lignes[diffPartie];
				var ch=Math.floor(c/lignes[diffPartie]);
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=((p[x][y].haut==ch)||(p[x][y].bas==ch)||(p[x][y].pieds==ch));
				break;
		case 2+1+48://répartition filles/garçons (colonne)
				var nf=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					nf+=p[c][y].genre;
				var ng=	lignes[diffPartie]-nf;
				if (lignes[diffPartie]%2) // nombre de lignes impair
					s=	((nf>ng)&&ng)+
						2*(nf<ng)+
						(!nf);
				else // nombre de lignes pair
					s=	((nf>ng)&&ng)+
						2*(nf==ng)+
						3*(nf<ng)+
						(!nf);
				break;
		case 2+1+49://répartition filles/garçons (ligne)
				var nf=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					nf+=p[x][c].genre;
				var ng=	colonnes[diffPartie]-nf;
				s=	((nf>ng)&&ng)+
					2*(nf==ng)+
					3*(nf<ng)+
					(!nf);
				break;
		case 2+1+50://combien ont des lunettes (colonne)
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=p[c][y].lunettes;
				break;
		case 2+1+51://combien ont des lunettes (ligne)
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=p[x][c].lunettes;
				break;
		case 2+1+52://combien ont des boucles d'oreilles (colonne) v1.3
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[c][y].garniture&&p[c][y].genre==typeGenre.gFille);
				break;
		case 2+1+53://combien ont des boucles d'oreilles (ligne) v1.3
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][c].garniture&&p[x][c].genre==typeGenre.gFille);
				break;
		case 2+1+54://combien ont une moustache (colonne) v1.3
				s=0;
				for(var y=0; y<lignes[diffPartie]; y++)
					s+=(p[c][y].garniture&&p[c][y].genre==typeGenre.gGarcon);
				break;
		case 2+1+55://combien ont une moustache (ligne) v1.3
				s=0;
				for(var x=0; x<colonnes[diffPartie]; x++)
					s+=(p[x][c].garniture&&p[x][c].genre==typeGenre.gGarcon);
				break;
		case 6+3+50://combien de garçons/filles dans les coins ?
				s=	(p[0][0].genre==c)+
					(p[colonnes[diffPartie]-1][0].genre==c)+
					(p[0][lignes[diffPartie]-1].genre==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].genre==c);
				break;
		case 6+3+51://combien de têtes noires/brunes/blondes/rousses dans les coins ?
				s=	(p[0][0].tete==c)+
					(p[colonnes[diffPartie]-1][0].tete==c)+
					(p[0][lignes[diffPartie]-1].tete==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].tete==c);
				break;
		case 6+3+52://combien de ceintures dans les coins ?
				s=	(p[0][0].ceinture>0)+
					(p[colonnes[diffPartie]-1][0].ceinture>0)+
					(p[0][lignes[diffPartie]-1].ceinture>0)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].ceinture>0);
				break;
		case 6+3+53://combien de bas longs/courts dans les coins ?
				s=	(p[0][0].taille==c)+
					(p[colonnes[diffPartie]-1][0].taille==c)+
					(p[0][lignes[diffPartie]-1].taille==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].taille==c);
				break;
		case 6+3+54://combien de bras v/^ dans les coins ?
				s=	(p[0][0].brasG==c)+(p[0][0].brasD==c)+
					(p[colonnes[diffPartie]-1][0].brasG==c)+(p[colonnes[diffPartie]-1][0].brasD==c)+
					(p[0][lignes[diffPartie]-1].brasG==c)+(p[0][lignes[diffPartie]-1].brasD==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasG==c)+(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasD==c);
				s=Math.floor((s+1)/2);
				break;
		case 6+3+55://combien de pieds ||/^ dans les coins ?
				s=	(p[0][0].piedG==c)+(p[0][0].piedD==c)+
					(p[colonnes[diffPartie]-1][0].piedG==c)+(p[colonnes[diffPartie]-1][0].piedD==c)+
					(p[0][lignes[diffPartie]-1].piedG==c)+(p[0][lignes[diffPartie]-1].piedD==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedG==c)+(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedD==c);
				s=Math.floor((s+1)/2);
				break;
		case 6+3+56://combien de bras g/d ^/v dans les coins ?
				var bl=Math.floor(c/2);
				if (c%2)
					s=	(p[0][0].brasG==bl)+
						(p[colonnes[diffPartie]-1][0].brasG==bl)+
						(p[0][lignes[diffPartie]-1].brasG==bl)+
						(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasG==bl);
				else
					s=	(p[0][0].brasD==bl)+
						(p[colonnes[diffPartie]-1][0].brasD==bl)+
						(p[0][lignes[diffPartie]-1].brasD==bl)+
						(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasD==bl);
				break;
		case 6+3+57://combien de pieds g/d ||/^ dans les coins ?
				var bl=Math.floor(c/2);
				if (c%2) // attention GD (observateur) inversé par rapport à gd (personnage)
					s=	(p[0][0].piedG==bl)+
						(p[colonnes[diffPartie]-1][0].piedG==bl)+
						(p[0][lignes[diffPartie]-1].piedG==bl)+
						(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedG==bl);
				else
					s=	(p[0][0].piedD==bl)+
						(p[colonnes[diffPartie]-1][0].piedD==bl)+
						(p[0][lignes[diffPartie]-1].piedD==bl)+
						(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedD==bl);
				break;
		case 6+3+58://combien de haut d'une certaine couleur dans les coins ?
				s=	(p[0][0].haut==c)+
					(p[colonnes[diffPartie]-1][0].haut==c)+
					(p[0][lignes[diffPartie]-1].haut==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut==c);
				break;
		case 6+3+59://combien de bas d'une certaine couleur dans les coins ?
				s=	(p[0][0].bas==c)+
					(p[colonnes[diffPartie]-1][0].bas==c)+
					(p[0][lignes[diffPartie]-1].bas==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas==c);
				break;
		case 6+3+60://combien de pieds d'une certaine couleur dans les coins ?
				s=	(p[0][0].pieds==c)+
					(p[colonnes[diffPartie]-1][0].pieds==c)+
					(p[0][lignes[diffPartie]-1].pieds==c)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds==c);
				break;
		case 6+3+61://combien de ceinture d'une certaine couleur dans les coins ?
				s=	(p[0][0].ceinture==(c+1))+
					(p[colonnes[diffPartie]-1][0].ceinture==(c+1))+
					(p[0][lignes[diffPartie]-1].ceinture==(c+1))+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].ceinture==(c+1));
				break;
		case 6+3+62://combien n'ont pas de ceinture dans les coins ?
				s=	(!p[0][0].ceinture)+
					(!p[colonnes[diffPartie]-1][0].ceinture)+
					(!p[0][lignes[diffPartie]-1].ceinture)+
					(!p[colonnes[diffPartie]-1][lignes[diffPartie]-1].ceinture);
				break;
		case 6+3+63://combien ont le haut et le bas de même couleur dans les coins ?
				s=	(p[0][0].haut==p[0][0].bas)+
					(p[colonnes[diffPartie]-1][0].haut==p[colonnes[diffPartie]-1][0].bas)+
					(p[0][lignes[diffPartie]-1].haut==p[0][lignes[diffPartie]-1].bas)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas);
				break;
		case 6+3+64://combien ont les pieds et le bas de même couleur dans les coins ?
				s=	(p[0][0].pieds==p[0][0].bas)+
					(p[colonnes[diffPartie]-1][0].pieds==p[colonnes[diffPartie]-1][0].bas)+
					(p[0][lignes[diffPartie]-1].pieds==p[0][lignes[diffPartie]-1].bas)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas);
				break;
		case 6+3+65://combien ont les pieds et le haut de même couleur dans les coins ?
				s=	(p[0][0].pieds==p[0][0].haut)+
					(p[colonnes[diffPartie]-1][0].pieds==p[colonnes[diffPartie]-1][0].haut)+
					(p[0][lignes[diffPartie]-1].pieds==p[0][lignes[diffPartie]-1].haut)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut);
				break;
		case 6+3+66://combien ont les pieds, le haut et le bas de même couleur dans les coins ?
				s=	((p[0][0].pieds==p[0][0].haut)&&(p[0][0].bas==p[0][0].haut))+
					((p[colonnes[diffPartie]-1][0].pieds==p[colonnes[diffPartie]-1][0].haut)&&(p[colonnes[diffPartie]-1][0].bas==p[colonnes[diffPartie]-1][0].haut))+
					((p[0][lignes[diffPartie]-1].pieds==p[0][lignes[diffPartie]-1].haut)&&(p[0][lignes[diffPartie]-1].bas==p[0][lignes[diffPartie]-1].haut))+
					((p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut)&&(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut));
				break;
		case 6+3+67://combien ont le haut et le bas de même couleur sans ceinture dans les coins ?
				s=	((p[0][0].haut==p[0][0].bas)&&(!p[0][0].ceinture))+
					((p[colonnes[diffPartie]-1][0].haut==p[colonnes[diffPartie]-1][0].bas)&&(!p[colonnes[diffPartie]-1][0].ceinture))+
					((p[0][lignes[diffPartie]-1].haut==p[0][lignes[diffPartie]-1].bas)&&(!p[0][lignes[diffPartie]-1].ceinture))+
					((p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas)&&(!p[colonnes[diffPartie]-1][lignes[diffPartie]-1].ceinture));
				break;
		case 6+3+68://combien ont une certaine couleur dans les coins ?
				s=	((p[0][0].haut==c)||(p[0][0].bas==c)||(p[0][0].pieds==c))+
					((p[colonnes[diffPartie]-1][0].haut==c)||(p[colonnes[diffPartie]-1][0].bas==c)||(p[colonnes[diffPartie]-1][0].pieds==c))+
					((p[0][lignes[diffPartie]-1].haut==c)||(p[0][lignes[diffPartie]-1].bas==c)||(p[0][lignes[diffPartie]-1].pieds==c))+
					((p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut==c)||(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas==c)||(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds==c));
				break;
		case 6+3+69://répartition filles/garçons dans les coins ?
				var nf=	p[0][0].genre+
						p[colonnes[diffPartie]-1][0].genre+
						p[0][lignes[diffPartie]-1].genre+
						p[colonnes[diffPartie]-1][lignes[diffPartie]-1].genre;
				var ng=	coins-nf;
				s=	((nf>ng)&&ng)+
					2*(nf==ng)+
					3*(nf<ng)+
					(!nf);
				break;
		case 6+3+70://combien ont des lunettes dans les coins ?
				s=	p[0][0].lunettes+
					p[colonnes[diffPartie]-1][0].lunettes+
					p[0][lignes[diffPartie]-1].lunettes+
					p[colonnes[diffPartie]-1][lignes[diffPartie]-1].lunettes;
				break;
		case 6+3+71://combien ont des boucles d'oreilles dans les coins ? v1.3
				s=	(p[0][0].garniture&&p[0][0].genre==typeGenre.gFille)+
					(p[colonnes[diffPartie]-1][0].garniture&&p[colonnes[diffPartie]-1][0].genre==typeGenre.gFille)+
					(p[0][lignes[diffPartie]-1].garniture&&p[0][lignes[diffPartie]-1].genre==typeGenre.gFille)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].garniture&&p[colonnes[diffPartie]-1][lignes[diffPartie]-1].genre==typeGenre.gFille);
				break;
		case 6+3+72://combien ont une moustache dans les coins ? v1.3
				s=	(p[0][0].garniture&&p[0][0].genre==typeGenre.gGarcon)+
					(p[colonnes[diffPartie]-1][0].garniture&&p[colonnes[diffPartie]-1][0].genre==typeGenre.gGarcon)+
					(p[0][lignes[diffPartie]-1].garniture&&p[0][lignes[diffPartie]-1].genre==typeGenre.gGarcon)+
					(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].garniture&&p[colonnes[diffPartie]-1][lignes[diffPartie]-1].genre==typeGenre.gGarcon);
				break;
		case 8+4+70://combien de garçons/filles ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].genre==c);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+71://combien de têtes d'une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].tete==c);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+72://combien de bas d'une certaine taille ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].taille==c);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+73://combien de hauts d'une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].haut==c);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+74://combien de bas d'une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].bas==c);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+75://combien de pieds d'une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=2*(p[i][j].pieds==c);
				s=(nc>0)*(1+Math.floor(2*(nc-1)/(lignes[diffPartie]*colonnes[diffPartie])));
				break;
		case 8+4+76://combien de ceintures ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].ceinture>0);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+77://combien de ceintures d'une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].ceinture==(c+1));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+78://combien n'ont pas de ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(!p[i][j].ceinture);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+79://combien ont les deux bras ^/v ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].brasG==c)&&(p[i][j].brasD==c));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+80://combien ont les deux pieds ||/^ ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].piedG==c)&&(p[i][j].piedD==c));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+81://combien ont 1 bras ^ et l'autre v ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].brasG!=p[i][j].brasD);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+82://combien ont 1 pied || et l'autre ^ ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].piedG!=p[i][j].piedD);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+83://combien ont le haut=bas ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].haut==p[i][j].bas);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+84://combien ont le bas=pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].pieds==p[i][j].bas);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+85://combien ont le haut=pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].pieds==p[i][j].haut);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+86://combien ont le haut=bas=pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].pieds==p[i][j].haut)&&(p[i][j].pieds==p[i][j].bas));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+87://combien ont le haut=bas sans ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+88://combien ont le haut<>bas<>pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].haut!=p[i][j].bas)&&(p[i][j].haut!=p[i][j].pieds)&&(p[i][j].pieds!=p[i][j].bas));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+89://combien ont une certaine couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].haut==c)||(p[i][j].bas==c)||(p[i][j].pieds==c));
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+90://combien ont des lunettes ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=p[i][j].lunettes;
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+91://combien ont des boucles d'oreilles ? v1.3
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gFille);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+92://combien ont une moustache ? v1.3
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gGarcon);
				s=solutionDecompteGrille(nc);
				break;
		case 8+4+93://combien de bras v/^ ? v1.3 (91+2)
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].brasG==c)+(p[i][j].brasD==c);
				s=(nc>0)*(1+Math.floor(2*(nc-1)/(lignes[diffPartie]*colonnes[diffPartie])));
				break;
		case 8+4+94://combien de pieds ||/^ ? v1.3 (92+2)
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=(p[i][j].piedG==c)+(p[i][j].piedD==c);
				s=(nc>0)*(1+Math.floor(2*(nc-1)/(lignes[diffPartie]*colonnes[diffPartie])));
				break;
		case 10+7+90://combien de filles/garçons ont la tête brune/noire/blonde/rousse ?
				var g=c%2;
				var ct=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].tete==ct));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+91://combien de filles/garçons ont le bas court/long ?
				var g=c%2;
				var tb=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].taille==tb));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+92://combien de filles/garçons ont le haut d'une certaine couleur ?
				var g=c%2;
				var ch=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].haut==ch));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+93://combien de filles/garçons ont le bas d'une certaine couleur ?
				var g=c%2;
				var cb=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].bas==cb));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+94://combien de filles/garçons ont les pieds d'une certaine couleur ?
				var g=c%2;
				var cp=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].pieds==cp));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+95://combien de filles/garçons ont une ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].ceinture>0));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+96://combien de filles/garçons n'ont pas de ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(!p[i][j].ceinture));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+97://combien de filles/garçons ont une ceinture d'une certaine couleur ?
				var g=c%2;
				var cc=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].ceinture==(cc+1)));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+98://combien de filles/garçons ont les deux bras ^/v ?
				var g=c%2;
				var pb=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].brasG==pb)&&(p[i][j].brasD==pb));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+99://combien de filles/garçons ont les deux pieds ||/^ ?
				var g=c%2;
				var pp=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&(p[i][j].piedG==pp)&&(p[i][j].piedD==pp));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+100://combien de filles/garçons ont un bras ^, l'autre v ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].brasG!=p[i][j].brasD));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+101://combien de filles/garçons ont un pied ||, l'autre ^ ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].piedG!=p[i][j].piedD));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+102://combien de filles/garçons ont le haut et le bas de même couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut==p[i][j].bas));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+103://combien de filles/garçons ont les pieds et le bas de même couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].pieds==p[i][j].bas));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+104://combien de filles/garçons ont le haut et les pieds de même couleur ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut==p[i][j].pieds));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+105://combien de filles/garçons ont haut=bas=pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+106://combien de filles/garçons ont le haut et le bas de même couleur sans ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+107://combien de filles/garçons ont haut=bas=pieds sans ceinture ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds)&&(!p[i][j].ceinture));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+108://combien de filles/garçons ont haut<>bas<>pieds ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(p[i][j].haut!=p[i][j].bas)&&(p[i][j].haut!=p[i][j].pieds)&&(p[i][j].bas!=p[i][j].pieds));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+109://combien de filles/garçons ont une couleur donnée ?
				var g=c%2;
				var ch=Math.floor(c/2);
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==g)&&((p[i][j].haut==ch)||(p[i][j].bas==ch)||(p[i][j].pieds==ch)));
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+110://combien de filles/garçons ont des lunettes ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&p[i][j].lunettes);
				s=solutionDecompteGrille(nc);
				break;
		case 10+7+111://combien de filles/garçons n'ont pas de lunettes ?
				var nc=0;
				for(var i=0; i<colonnes[diffPartie]; i++)
					for(var j=0; j<lignes[diffPartie]; j++)
						nc+=((p[i][j].genre==c)&&(!p[i][j].lunettes));
				s=solutionDecompteGrille(nc);
				break;
		case 10+9+110://Dans quelle colonne trouve-t-on le moins/plus de garçons/filles ?
				var mp=c%2;
				var g=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].genre==g) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].genre==g) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+111://Dans quelle ligne trouve-t-on le moins/plus de garçons/filles ?
				var mp=c%2;
				var g=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].genre==g) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].genre==g) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+112://Dans quelle colonne trouve-t-on le moins/plus de têtes noires/brunes/blondes/rousses ?
				var mp=c%2;
				var ct=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].tete==ct) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].tete==ct) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+113://Dans quelle ligne trouve-t-on le moins/plus de têtes noires/brunes/blondes/rousses  ?
				var mp=c%2;
				var ct=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].tete==ct) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].tete==ct) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+114://Dans quelle colonne trouve-t-on le moins/plus de ceintures ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].ceinture>0) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].ceinture>0) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+115://Dans quelle ligne trouve-t-on le moins/plus de ceintures ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].ceinture>0) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].ceinture>0) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+116://Dans quelle colonne trouve-t-on le moins/plus de bas courts/longs ?
				var mp=c%2;
				var tb=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].taille==tb) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].taille==tb) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+117://Dans quelle ligne trouve-t-on le moins/plus de bas courts/longs ?
				var mp=c%2;
				var tb=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].taille==tb) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].taille==tb) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+118://Dans quelle colonne trouve-t-on le moins/plus de bras v/^ ?
				var mp=c%2;
				var pb=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) {
						if (p[i][j].brasG==pb) tcl++;
						if (p[i][j].brasD==pb) tcl++;
					}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) {
						if (p[i][j].brasG==pb) tcl++;
						if (p[i][j].brasD==pb) tcl++;
					}
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+119://Dans quelle ligne trouve-t-on le moins/plus de bras v/^ ?
				var mp=c%2;
				var pb=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++) {
						if (p[i][j].brasG==pb) tcl++;
						if (p[i][j].brasD==pb) tcl++;
					}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++) {
						if (p[i][j].brasG==pb) tcl++;
						if (p[i][j].brasD==pb) tcl++;
					}
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+120://Dans quelle colonne trouve-t-on le moins/plus de pieds ||/^ ?
				var mp=c%2;
				var pp=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) {
						if (p[i][j].piedG==pp) tcl++;
						if (p[i][j].piedD==pp) tcl++;
					}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) {
						if (p[i][j].piedG==pp) tcl++;
						if (p[i][j].piedD==pp) tcl++;
					}
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+121://Dans quelle ligne trouve-t-on le moins/plus de pieds ||/^ ?
				var mp=c%2;
				var pp=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++) {
						if (p[i][j].piedG==pp) tcl++;
						if (p[i][j].piedD==pp) tcl++;
					}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++) {
						if (p[i][j].piedG==pp) tcl++;
						if (p[i][j].piedD==pp) tcl++;
					}
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+122://Dans quelle colonne trouve-t-on le moins/plus de haut d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].haut==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].haut==ch) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+123://Dans quelle ligne trouve-t-on le moins/plus de haut d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==ch) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+124://Dans quelle colonne trouve-t-on le moins/plus de bas d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].bas==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].bas==ch) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+125://Dans quelle ligne trouve-t-on le moins/plus de bas d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].bas==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].bas==ch) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+126://Dans quelle colonne trouve-t-on le moins/plus de pieds d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].pieds==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].pieds==ch) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+127://Dans quelle ligne trouve-t-on le moins/plus de pieds d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].pieds==ch) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].pieds==ch) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+128://Dans quelle colonne trouve-t-on le moins/plus de bras gauche/droit v/^ ?
				var mp=c%2;
				var gd=Math.floor(c/2)%2;
				var bl=Math.floor(c/4);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].brasG==bl) tcl++;
						} else {
							if (p[i][j].brasD==bl) tcl++;
						}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].brasG==bl) tcl++;
						} else {
							if (p[i][j].brasD==bl) tcl++;
						}
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+129://Dans quelle ligne trouve-t-on le moins/plus de bras gauche/droit v/^ ?
				var mp=c%2;
				var gd=Math.floor(c/2)%2;
				var bl=Math.floor(c/4);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].brasG==bl) tcl++;
						} else {
							if (p[i][j].brasD==bl) tcl++;
						}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].brasG==bl) tcl++;
						} else {
							if (p[i][j].brasD==bl) tcl++;
						}
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+130://Dans quelle colonne trouve-t-on le moins/plus de pied gauche/droit ||/^ ?
				var mp=c%2;
				var gd=Math.floor(c/2)%2;
				var je=Math.floor(c/4);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].piedG==je) tcl++;
						} else {
							if (p[i][j].piedD==je) tcl++;
						}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].piedG==je) tcl++;
						} else {
							if (p[i][j].piedD==je) tcl++;
						}
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+131://Dans quelle ligne trouve-t-on le moins/plus de pied gauche/droit ||/^ ?
				var mp=c%2;
				var gd=Math.floor(c/2)%2;
				var je=Math.floor(c/4);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].piedG==je) tcl++;
						} else {
							if (p[i][j].piedD==je) tcl++;
						}
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (gd) { // /!\ Attention ici gd = observateur ; GD = personnage
							if (p[i][j].piedG==je) tcl++;
						} else {
							if (p[i][j].piedD==je) tcl++;
						}
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+132://Dans quelle colonne trouve-t-on le moins/plus de ceintures d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].ceinture==(ch+1)) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].ceinture==(ch+1)) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+133://Dans quelle ligne trouve-t-on le moins/plus de ceintures d'une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].ceinture==(ch+1)) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].ceinture==(ch+1)) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+134://Dans quelle colonne trouve-t-on le moins/plus de personnages n'ayant pas de ceinture ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (!p[i][j].ceinture) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (!p[i][j].ceinture) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+135://Dans quelle ligne trouve-t-on le moins/plus de personnages n'ayant pas de ceinture ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (!p[i][j].ceinture) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (!p[i][j].ceinture) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+136://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant haut=bas ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].haut==p[i][j].bas) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].haut==p[i][j].bas) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+137://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant haut=bas ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==p[i][j].bas) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==p[i][j].bas) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+138://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant pieds=bas ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].pieds==p[i][j].bas) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].pieds==p[i][j].bas) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+139://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant pieds=bas ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].pieds==p[i][j].bas) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].pieds==p[i][j].bas) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+140://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant haut=pieds ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if (p[i][j].haut==p[i][j].pieds) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if (p[i][j].haut==p[i][j].pieds) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+141://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant haut=pieds ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==p[i][j].pieds) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if (p[i][j].haut==p[i][j].pieds) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+142://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant haut=bas sans ceinture ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if ((p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if ((p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture)) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+143://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant haut=bas sans ceinture ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==p[i][j].bas)&&(!p[i][j].ceinture)) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+144://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant haut=bas=pieds ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if ((p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if ((p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds)) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+145://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant haut=bas=pieds ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==p[i][j].pieds)&&(p[i][j].bas==p[i][j].pieds)) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+146://Dans quelle colonne trouve-t-on le moins/plus de personnages ayant haut<>bas<>pieds ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if ((p[i][j].haut!=p[i][j].pieds)&&(p[i][j].bas!=p[i][j].pieds)&&(p[i][j].haut!=p[i][j].bas)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if ((p[i][j].haut!=p[i][j].pieds)&&(p[i][j].bas!=p[i][j].pieds)&&(p[i][j].haut!=p[i][j].bas)) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+147://Dans quelle ligne trouve-t-on le moins/plus de personnages ayant haut<>bas<>pieds ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut!=p[i][j].pieds)&&(p[i][j].bas!=p[i][j].pieds)&&(p[i][j].haut!=p[i][j].bas)) tcl++;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut!=p[i][j].pieds)&&(p[i][j].bas!=p[i][j].pieds)&&(p[i][j].haut!=p[i][j].bas)) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+148://Dans quelle colonne trouve-t-on le moins/plus de personnages portant une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++) 
						if ((p[i][j].haut==ch)||(p[i][j].bas==ch)||(p[i][j].pieds==ch)) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						if ((p[i][j].haut==ch)||(p[i][j].bas==ch)||(p[i][j].pieds==ch)) tcl++;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+149://Dans quelle ligne trouve-t-on le moins/plus de personnages portant une certaine couleur ?
				var mp=c%2;
				var ch=Math.floor(c/2);
				var top=(mp?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==ch)||(p[i][j].bas==ch)||(p[i][j].pieds==ch)) tcl++;
					if (mp) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						if ((p[i][j].haut==ch)||(p[i][j].bas==ch)||(p[i][j].pieds==ch)) tcl++;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+150://Dans quelle colonne trouve-t-on le moins/plus de lunettes ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=p[i][j].lunettes;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=p[i][j].lunettes;
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+151://Dans quelle ligne trouve-t-on le moins/plus de lunettes ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=p[i][j].lunettes;
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=p[i][j].lunettes;
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+152://Dans quelle colonne trouve-t-on le moins/plus de boucles d'oreilles ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gFille);
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gFille);
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+153://Dans quelle ligne trouve-t-on le moins/plus de boucles d'oreilles ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gFille);
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gFille);
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+154://Dans quelle colonne trouve-t-on le moins/plus de moustaches ?
				var top=(c?indefini:indefini2);
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gGarcon);
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var i=0; i<colonnes[diffPartie]; i++) {
					var tcl=0;
					for(var j=0; j<lignes[diffPartie]; j++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gGarcon);
					if (tcl==top) { ncl++; s=i; }
				}
				if (ncl>1) s=indefini;
				break;
		case 10+9+155://Dans quelle ligne trouve-t-on le moins/plus de moustache ?
				var top=(c?indefini:indefini2);
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gGarcon);
					if (c) {
						if (tcl>top) top=tcl;
					} else {
						if (tcl<top) top=tcl;
					}
				}
				var ncl=0;
				for(var j=0; j<lignes[diffPartie]; j++) {
					var tcl=0;
					for(var i=0; i<colonnes[diffPartie]; i++)
						tcl+=(p[i][j].garniture&&p[i][j].genre==typeGenre.gGarcon);
					if (tcl==top) { ncl++; s=j; }
				}
				if (ncl>1) s=indefini;
				break;
		case 14+11+150://Taille de bas la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].taille]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+151://Taille de bas la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].taille]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+152://Taille de bas la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0];
				cpt[p[0][0].taille]++;
				cpt[p[colonnes[diffPartie]-1][0].taille]++;
				cpt[p[0][lignes[diffPartie]-1].taille]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].taille]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+153://Position de bras la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].brasG*(p[i][j].brasG==p[i][j].brasD)+2*(p[i][j].brasG!=p[i][j].brasD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+154://Position de bras la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].brasG*(p[i][j].brasG==p[i][j].brasD)+2*(p[i][j].brasG!=p[i][j].brasD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+155://Position de bras la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				cpt[p[0][0].brasG*(p[0][0].brasG==p[0][0].brasD)+2*(p[0][0].brasG!=p[0][0].brasD)]++;
				cpt[p[colonnes[diffPartie]-1][0].brasG*(p[colonnes[diffPartie]-1][0].brasG==p[colonnes[diffPartie]-1][0].brasD)+2*(p[colonnes[diffPartie]-1][0].brasG!=p[colonnes[diffPartie]-1][0].brasD)]++;
				cpt[p[0][lignes[diffPartie]-1].brasG*(p[0][lignes[diffPartie]-1].brasG==p[0][lignes[diffPartie]-1].brasD)+2*(p[0][lignes[diffPartie]-1].brasG!=p[0][lignes[diffPartie]-1].brasD)]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasG*(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasG==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasD)+2*(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasG!=p[colonnes[diffPartie]-1][lignes[diffPartie]-1].brasD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+156://Position de pieds la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].piedG*(p[i][j].piedG==p[i][j].piedD)+2*(p[i][j].piedG!=p[i][j].piedD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+157://Position de pied la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].piedG*(p[i][j].piedG==p[i][j].piedD)+2*(p[i][j].piedG!=p[i][j].piedD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+158://Position de pied la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				cpt[p[0][0].piedG*(p[0][0].piedG==p[0][0].piedD)+2*(p[0][0].piedG!=p[0][0].piedD)]++;
				cpt[p[colonnes[diffPartie]-1][0].piedG*(p[colonnes[diffPartie]-1][0].piedG==p[colonnes[diffPartie]-1][0].piedD)+2*(p[colonnes[diffPartie]-1][0].piedG!=p[colonnes[diffPartie]-1][0].piedD)]++;
				cpt[p[0][lignes[diffPartie]-1].piedG*(p[0][lignes[diffPartie]-1].piedG==p[0][lignes[diffPartie]-1].piedD)+2*(p[0][lignes[diffPartie]-1].piedG!=p[0][lignes[diffPartie]-1].piedD)]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedG*(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedG==p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedD)+2*(p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedG!=p[colonnes[diffPartie]-1][lignes[diffPartie]-1].piedD)]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+159://Couleur de cheveux la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].tete]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+160://Couleur de cheveux la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].tete]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+161://Couleur de cheveux la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				cpt[p[0][0].tete]++;
				cpt[p[colonnes[diffPartie]-1][0].tete]++;
				cpt[p[0][lignes[diffPartie]-1].tete]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].tete]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+162://Couleur du haut la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].haut]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+163://Couleur du haut la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].haut]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+164://Couleur du haut la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				cpt[p[0][0].haut]++;
				cpt[p[colonnes[diffPartie]-1][0].haut]++;
				cpt[p[0][lignes[diffPartie]-1].haut]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].haut]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+165://Couleur du bas la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].bas]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+166://Couleur du bas la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].bas]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+167://Couleur du bas la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				cpt[p[0][0].bas]++;
				cpt[p[colonnes[diffPartie]-1][0].bas]++;
				cpt[p[0][lignes[diffPartie]-1].bas]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].bas]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+168://Couleur des pieds la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].pieds]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+169://Couleur des pieds la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].pieds]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+170://Couleur des pieds la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0,0];
				cpt[p[0][0].pieds]++;
				cpt[p[colonnes[diffPartie]-1][0].pieds]++;
				cpt[p[0][lignes[diffPartie]-1].pieds]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].pieds]++;
				var top=(mp?indefini:indefini2);
				for(var k=0; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=0; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) s=indefini;
				break;
		case 14+11+171://Couleur de ceinture la plus/moins répandue sur colonne
				var mp=c%2;
				var i=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var j=0; j<lignes[diffPartie]; j++)
					cpt[p[i][j].ceinture]++;
				var top=(mp?indefini:indefini2);
				for(var k=1; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=1; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) 
					s=indefini; 
				else
					s--;
				break;
		case 14+11+172://Couleur de ceinture la plus/moins répandue sur ligne
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				for(var i=0; i<colonnes[diffPartie]; i++)
					cpt[p[i][j].ceinture]++;
				var top=(mp?indefini:indefini2);
				for(var k=1; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=1; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) 
					s=indefini; 
				else
					s--;
				break;
		case 14+11+173://Couleur de ceinture la plus/moins répandue dans les coins
				var mp=c%2;
				var j=Math.floor(c/2);
				var cpt = [0,0,0];
				cpt[p[0][0].ceinture]++;
				cpt[p[colonnes[diffPartie]-1][0].ceinture]++;
				cpt[p[0][lignes[diffPartie]-1].ceinture]++;
				cpt[p[colonnes[diffPartie]-1][lignes[diffPartie]-1].ceinture]++;
				var top=(mp?indefini:indefini2);
				for(var k=1; k<cpt.length; k++)
					if (mp) {
						if (cpt[k]>top) top=cpt[k];
					} else {
						if (cpt[k]<top) top=cpt[k];
					}
				var nct=0;
				for(var k=1; k<cpt.length; k++)
					if (cpt[k]==top) { nct++; s=k; }
				if (nct>1) 
					s=indefini; 
				else
					s--;
				break;
		default:s=	indefini;
				break;
	}
	return s;
}
//---------------------------------------------------------------------------
function topLitTops()
{
	if (localStorage.getItem(lsTopScore + this.niveau))
		this.topScore = parseInt(localStorage.getItem(lsTopScore + this.niveau));
	else
		this.topScore = 0;
	if (localStorage.getItem(lsTopNoteScore + this.niveau))
		this.topNoteScore = parseInt(localStorage.getItem(lsTopNoteScore + this.niveau));
	else 
		this.topNoteScore = 0;
	if (localStorage.getItem(lsTopNoteScoreTop + this.niveau))
		this.topNoteScoreTop = parseInt(localStorage.getItem(lsTopNoteScoreTop + this.niveau)); 
	else
		this.topNoteScoreTop = 0;
}
//---------------------------------------------------------------------------
function topTesteTops()
{
	// On lit les tops
	this.litTops();
	// On teste les tops et on les enregistre le cas échéant
	if (this.niveau<tous)
		tops[tous].testeTops();
	if (score > this.topScore) {
		this.topScore = score;
		localStorage.setItem(lsTopScore + this.niveau, this.topScore);
	}
	if ((score / scoreTop) > (this.topNoteScoreTop ? (this.topNoteScore / this.topNoteScoreTop) : 0)) {
		this.topNoteScore = score;
		this.topNoteScoreTop = scoreTop;
		localStorage.setItem(lsTopNoteScore + this.niveau, this.topNoteScore); 
		localStorage.setItem(lsTopNoteScoreTop + this.niveau, this.topNoteScoreTop);
	}
}

//---------------------------------------------------------------------------
// FONCTIONS
//---------------------------------------------------------------------------

function idXY(x, y)
{
	return String.fromCharCode(charCodeMin+y+1) + (x<10?'0':vide) + x;
}
//---------------------------------------------------------------------------
function afficheCaractere(c, i, fond, r)
{
	var src = vide;
	var couleurFond = 'transparent'; // v3.1 : pas de fond
	switch(c) {
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
		default:	src = c; break;
	}
	src = pngChm + src + (((fond=='noir')||(fond=='bleu')||(fond=='brun')||(fond=='marron'))?negatif:vide) + pngExt;
	var x = i%largeurMax;
	var y = Math.floor(i/largeurMax);
	var id = idXY(x, y);
	var idLink = parseInt(id.substring(1,3));
	document.images[id.toLowerCase()].src = src;
	if (fond==vide) {
		// v3.1 : le fond n'est plus une image mais une couleur (moins lourd)
		//document.images[id.toUpperCase()].src = pngChm + idEspace + pngExt;
		document.getElementById('texte'+y).rows[0].cells[x].style.backgroundColor=couleurFond; 
		document.images[id.toLowerCase()].removeAttribute('onClick');
	} else {
	    // v3.1 : le fond n'est plus une image mais une couleur (moins lourd)
		//document.images[id.toUpperCase()].src = pngChm + fond + pngExt; 
		switch(fond) {
			case 'bouton':	couleurFond='#ffffff'; break;
			case 'vert':	couleurFond='#00ff00'; break;
			case 'roux':	couleurFond='#ff8000'; break;
			case 'rouge':	couleurFond='#ff0000'; break;
			case 'noir':	couleurFond='#000000'; break;
			case 'marron':	couleurFond='#c08020'; break;
			case 'jaune':	couleurFond='#fffb00'; break;
			case 'brun':	couleurFond='#804000'; break;
			case 'blond':	couleurFond='#ffff40'; break;
			case 'bleu':	couleurFond='#0433ff'; break;
		} 
		document.getElementById('texte'+y).rows[0].cells[x].style.backgroundColor=couleurFond;
		if (phase == typePhase.phAPropos) {
			switch(r) {
				case 1: document.images[id.toLowerCase()].setAttribute('onClick', 'lien('+1+')');
						break;
				case 2: document.images[id.toLowerCase()].setAttribute('onClick', 'lien('+2+')');
						break;
				default:document.images[id.toLowerCase()].setAttribute('onClick', 'clic('+0+')');
						break;
			}
		}
		else { /* v1.2
			if (id[0]=='E') {
				document.links[idLink].href = '#';
				document.links[idLink].target = '_self';
			} */
			document.images[id.toLowerCase()].setAttribute('onClick', 'clic('+r+')');
		}
	}
}
//---------------------------------------------------------------------------
function masquePersonnages()
{
	// On fait disparaître les personnages hors jeu
	for(var x=0; x<colonnesMax-colonnes[diffPartie]; x++)
		for(var y=0; y<lignesMax; y++)
			p[3*x][y].cache();
	for(var y=0; y<lignesMax-lignes[diffPartie]; y++) 
		for(var x=0; x<colonnesMax; x++)
			p[x][y].cache();
	// On place les caches sur les personnes en jeu
	for(var x=0; x<colonnes[diffPartie]; x++)
		for(var y=0; y<lignes[diffPartie]; y++) 
			p[x][y].masque();
}
//---------------------------------------------------------------------------
function cachePersonnages()
{
	// Ecran gris
	for(var x=0; x<colonnesMax; x++)
		for(var y=0; y<lignesMax; y++)
			p[x][y].cache();
}
//---------------------------------------------------------------------------
function compteCaracteresControle(stMsg, tailleMax)
{
	var n = 0;
	for(var i=0; (stMsg[i]!=nvLigne)&&(i<Math.min(stMsg.length, tailleMax)); i++)
		if (delimiteursBoutons.indexOf(stMsg[i]) > indefini)
			n++;
	return n;
}
//---------------------------------------------------------------------------
function trim(s) // fonction de base manquante dans JavaScript 
{
	return s.replace(/^\s+/g,'').replace(/\s+$/g,'')
}
//---------------------------------------------------------------------------
function centreTexte(stMsg)
{
	var stNvMsg = vide;
	var stRAT = trim(stMsg); // Reste à traiter
	while(stRAT.length>0) {
		var posFin = indefini;
		var posNvl = stRAT.indexOf(nvLigne);
		var posEsp = indefini;
		var largeurMaxLigne = largeurMax + compteCaracteresControle(stRAT, (stRAT.lastIndexOf(espace)>indefini?stRAT.lastIndexOf(espace):stRAT.length));
		if (posNvl>largeurMaxLigne) posNvl=indefini; 
		if (stRAT.length>largeurMaxLigne) {
			posEsp = stRAT.substring(0, largeurMaxLigne).lastIndexOf(espace);
			if (posEsp == indefini)
				posEsp = stRAT.length;
		}
		else 
			posEsp = stRAT.length;
		posFin = Math.min(largeurMaxLigne, ((posNvl>indefini)&&(posNvl<largeurMaxLigne))?posNvl:posEsp);
		// On centre la ligne
		var retrait = Math.ceil((largeurMaxLigne-posFin)/2);
		for(var i=0; i<retrait; i++)
			stNvMsg = stNvMsg + espace;
		stNvMsg = stNvMsg + stRAT.substring(0, posFin);
		for(var i=0; i<largeurMaxLigne-posFin-retrait; i++)
			stNvMsg = stNvMsg + espace;
		stRAT = trim(stRAT.substring(posFin+1));
	}
	return stNvMsg;
}
//---------------------------------------------------------------------------
function afficheMessage(stMsg)
{
	var fond = vide;
	var reponse = indefini;
	var d=0;
	var stTxt = centreTexte(stMsg);
	for(var i=0; i-d<largeurMax*hauteurMax; i++) 
		if (i>=stTxt.length)
			afficheCaractere(espace, i-d, vide, reponse);
		else
			switch(stTxt[i]) {
				case 'r':	d++; fond=idRouge; reponse++; break;
				case 'v':	d++; fond=idVert; reponse++; break;
				case 'b':	d++; fond=idBleu; reponse++; break;
				case 'j':	d++; fond=idJaune; reponse++; break;
				case 'm':	d++; fond=idMarron; reponse++; break;
				case 'n':	d++; fond=idNoir; reponse++; break;
				case 'c':	d++; fond=idBrun; reponse++; break;
				case 'd':	d++; fond=idBlond; reponse++; break;
				case 'x':	d++; fond=idRoux; reponse++; break;
				case '[':	d++; fond=idBouton; reponse++; break;
				case ']':	d++; fond=vide; break;
				default:	afficheCaractere(stTxt[i], i-d, fond, reponse); break;
			}
	if (phase == typePhase.phAPropos) 
		phase = typePhase.phHorsJeu;
}
//---------------------------------------------------------------------------
function afficheCompteARebours(secondes)
{
	if (secondes==4*(7-balPartie))
		afficheMessage('MEMORISEZ LES '+(colonnes[diffPartie]*lignes[diffPartie])+' PERSONNAGES\nPENDANT... '+secondes+' SECONDE'+(secondes>1?'S':vide)+'\nPUIS REPONDEZ A LA QUESTION.');
	else {
		if (4*(7-balPartie)>9) {
			afficheCaractere(vide+Math.floor(secondes/10), 60, vide, indefini);
			afficheCaractere(vide+(secondes%10), 61, vide, indefini);
		}
		else
			afficheCaractere(vide+secondes, 61, vide, indefini);
		if (secondes==1)
			afficheCaractere(espace, 70, vide, indefini);
	}
	if (secondes) 
		setTimeout(	function() {
						afficheCompteARebours(secondes-1)
					}, 1000);
	else {
		phase = typePhase.phPoseQuestion;
		afficheMessage(q[nq].combinaison(nqc)); 
	}
}
//---------------------------------------------------------------------------
function afficheNouveauxPersonnages()
{
	phase = typePhase.phMontrePersonnages;
	tour++;

	// On fait disparaître les personnages hors jeu
	for(var x=0; x<colonnesMax-colonnes[diffPartie]; x++)
		for(var y=0; y<lignesMax; y++)
			p[3*x][y].cache();
	for(var y=0; y<lignesMax-lignes[diffPartie]; y++) 
		for(var x=0; x<colonnesMax; x++)
			p[x][y].cache();

	// Nouveaux personnages
	for(var x=0; x<colonnes[diffPartie]; x++)
		for(var y=0; y<lignes[diffPartie]; y++) {
			p[x][y].genere();
			p[x][y].affiche();
		}
	// Nouvelle question...	
	do {
		if (nqc+1==q[nq].possibilites()) {
			nq++;
			nqc=0;
		}
		else nqc++;
	} while((q[nq].solution(nqc)==indefini) || // Pas de solution unique/possible OU...
			((colonnes[diffPartie]*lignes[diffPartie] == 4) && 
			 (q[nq].combinaison(nqc).indexOf('COIN') > indefini))); // question avec COIN sur 4 personnages uniquement (=tous)
	afficheCompteARebours(1);
}
//---------------------------------------------------------------------------
function afficheSolution(solution, reponse)
{
	var stQuestion = [];
	var stQstPosee = q[nq].combinaison(nqc);
	var bouton = indefini;
	// On affiche les personnages
	for(var x=0; x<colonnes[diffPartie]; x++)
		for(var y=0; y<lignes[diffPartie]; y++)
			p[x][y].affiche();
	// On change le fond des boutons réponse et/ou solution
	for(var i=0; i<stQstPosee.length; i++)
		stQuestion[i]=stQstPosee[i];
	for(var i=0; i<stQuestion.length; i++)
		if ((delimiteursBoutons.indexOf(stQuestion[i]) > indefini)&&(stQuestion[i] != ']')) {
				bouton++;
				if (bouton == solution) {
					stQuestion[i] = 'v';
				}
				else if ((bouton == reponse)&&(reponse != solution))
					stQuestion[i] = 'r';
				else
					stQuestion[i] = '[';
 			}
	stQstPosee=(phase==typePhase.phAfficheRegle?'EXEMPLE:[][] ':vide);
	for(var i=0; i<stQuestion.length; i++)
		stQstPosee=stQstPosee+stQuestion[i];
 	// On raffiche la question avec en ROUGE la mauvaise réponse et en VERT la bonne réponse...
 	afficheMessage(stQstPosee);
}
//---------------------------------------------------------------------------
function sauvePartie()
{
	localStorage.t = tour;
	localStorage.s = score;
	localStorage.st = scoreTop;
	localStorage.sq = scoreQst;
	localStorage.np = balPartie;
	localStorage.dp = diffPartie;
}
//---------------------------------------------------------------------------
function chargePartie()
{
	tour = parseInt(localStorage.t);
	score = parseInt(localStorage.s);
	scoreTop = parseInt(localStorage.st);
	scoreQst = parseInt(localStorage.sq);
	balPartie = parseInt(localStorage.np);
	diffPartie = parseInt(localStorage.dp);
	afficheNouveauxPersonnages();
}
//---------------------------------------------------------------------------
function nouvellePartie()
{
	// On efface la sauvegarde
	localStorage.removeItem(lsTour);
	score = 0;
	scoreTop = 0;
	scoreQst = 0;
	tour = 0;
	balPartie = 0; // 60 questions et 4 secondes
	diffPartie = difficulte;
	phase = typePhase.phHorsJeu;
	nq = 6;
	nqc = -1;
	afficheNouveauxPersonnages();
}
//---------------------------------------------------------------------------
function clic(r)
{
	switch(phase) {
		case typePhase.phHorsJeu:
					switch(r) {
						case 0:	afficheBienvenue();
								break;
						case 1: // À propos
								var combinaisons = 0;
								diffPartie = difficulte; // le calcul du nombre de combinaison prend diffPartie et pas difficulte
								for(var i=0; i<q.length; i++)
									combinaisons += q[i].possibilites();
								phase = typePhase.phAPropos; // Permet d'activer les liens vers l'aide en ligne et les stores
								afficheMessage('M E M O R I S S I B O N   VERSION '+stVersion+'\nWEBAPP (CHROME/FIREFOX/SAFARI)\nCREEE PAR PATRICE FOUQUET\n'+questions+' QUESTIONS ET '+combinaisons+' COMBINAISONS.\n[*OK*] [*AIDE EN LIGNE*] [*AUTRES JEUX*]');
								break;
						case 2: // Règle du jeu
								phase = typePhase.phAfficheRegle;
								indexRDJ=0;
								afficheMessage('BIENVENUE DANS LA REGLE DU JEU...\nPOUR CONTINUER, TOUCHEZ [*SUITE*]\nPOUR REVENIR AU MENU, TOUCHEZ [*MENU*].');
								break;
						case 3: // Balances
								phase=typePhase.phChoisitBalance;
								var stMsg = 'BALANCE ACTUELLE*: '+stBalance[balance]+'\nCHOISISSEZ (QUESTIONS/TEMPS)*:\n';
								for(var i=1; i<stBalance.length; i++)
									stMsg = stMsg + ((i==3)?nvLigne:espace) + stBalance[i];
								afficheMessage(stMsg);
								break;
						case 4: // Difficulté
								phase=typePhase.phChoisitDifficulte;
								var stMsg = 'DIFFICULTE ACTUELLE*: '+stDifficulte[difficulte]+'\nCHOISISSEZ (COLONNES*X*LIGNES)*:\n';
								for(var i=0; i<stDifficulte.length; i++)
									stMsg = stMsg + espace + stDifficulte[i];
								afficheMessage(stMsg);
								break;
						case 5:	// Tops
								phase = typePhase.phAfficheTops;
								for(var i=0; i<tops.length; i++)
									tops[i].litTops();
								afficheMessage('TOP SCORE [*'+tops[tous].topScore+'*] TOP NOTE [*'+(tops[tous].topNoteScoreTop?Math.round((100*tops[tous].topNoteScore)/tops[tous].topNoteScoreTop):0)+'%*]\nTOPS SCORES PAR NIVEAU\n'+
									'v*'+tops[0].topScore+'*] c*'+tops[1].topScore+'*] j*'+tops[2].topScore+'*] r*'+tops[3].topScore+'*]\nTOPS NOTES PAR NIVEAU\n'+ 
									'v*'+(tops[0].topNoteScoreTop?Math.round((100*tops[0].topNoteScore)/tops[0].topNoteScoreTop):0)+'%*] '+
									'c*'+(tops[1].topNoteScoreTop?Math.round((100*tops[1].topNoteScore)/tops[1].topNoteScoreTop):0)+'%*] '+
									'j*'+(tops[2].topNoteScoreTop?Math.round((100*tops[2].topNoteScore)/tops[2].topNoteScoreTop):0)+'%*] '+
									'r*'+(tops[3].topNoteScoreTop?Math.round((100*tops[3].topNoteScore)/tops[3].topNoteScoreTop):0)+'%*]');
								setTimeout(	function() {
												if (phase == typePhase.phAfficheTops)
													clic(indefini);
											}, 5000);
								break;
						case 6: // Nouvelle Partie
								nouvellePartie();
								break;
						case 7: // Chargement d'une partie en cours (tester avant présence de sauvegarde)
								chargePartie();
								break;
					}
					break;
		case typePhase.phChoisitBalance:
					if (r) {
						balance = r;
						localStorage.n = balance;
					}
					afficheBienvenue();
					break;
		case typePhase.phChoisitDifficulte:
					if (r) {
						difficulte = r - 1;
						localStorage.d = difficulte;
					}
					afficheBienvenue();
					break;
		case typePhase.phAfficheTops:
					afficheBienvenue();
					break;
		case typePhase.phPoseQuestion:
					phase = typePhase.phAfficheSolution;
					var s = q[nq].solution(nqc);
					scoreTop += stReponse[q[nq].r][diffPartie].length * colonnes[diffPartie] * lignes[diffPartie];
					scoreQst = (r==s) * stReponse[q[nq].r][diffPartie].length * colonnes[diffPartie] * lignes[diffPartie]; 
					score += scoreQst;
					if (tour<tempsPartie/(4*(7-balPartie)))
						sauvePartie();
					else { // On efface la sauvegarde car c'est la fin de partie
						tops[diffPartie].testeTops(); // On en profite pour tester les tops de partie
						localStorage.removeItem(lsTour);
					}
					afficheSolution(s, r);
					setTimeout(	function() {
									if (phase == typePhase.phAfficheSolution)
										clic(indefini);
								}, 3000);
					break;
		case typePhase.phAfficheSolution:
					phase = typePhase.phAfficheScore;
					afficheMessage(((scoreQst>0)?'v BONNE REPONSE ! ]\nVOUS OBTENEZ '+scoreQst+ ' POINTS.':'r MAUVAISE REPONSE ! ]\nVOUS N"OBTENEZ AUCUN POINT !')+'\nVOUS AVEZ UN TOTAL DE '+score+'/'+scoreTop+' ('+Math.round(100*score/scoreTop)+'%).\n'+((tempsPartie/(4*(7-balPartie))-tour)?('IL RESTE ENCORE '+(tempsPartie/(4*(7-balPartie))-tour)+' QUESTION'+((tempsPartie/(4*(7-balPartie))-tour)>1?'S.':'.')):'C"ETAIT LA DERNIERE QUESTION.')+'\n[*CONTINUER*]');
					break;				
		case typePhase.phAfficheScore:
					if (tour<1002)
						afficheNouveauxPersonnages();
					else {
						phase = typePhase.phHorsJeu;
						afficheMessage('FIN DE PARTIE.\nVOTRE SCORE EST DE '+score+'/'+scoreTop+' ('+Math.round(100*score/scoreTop)+'%).\n[*RETOUR*AU*MENU*]');
					}
					break;
		case typePhase.phAfficheRegle:
					if (r==1)
						afficheBienvenue();
					else {
						indexRDJ++;
						switch(indexRDJ) {
							case 1: afficheMessage('VOUS DEVEZ MEMORISER '+(colonnes[difficulte]*lignes[difficulte])+' PERSONNAGES ALEATOIRES PENDANT QUELQUES SECONDES SELON LA BALANCE PUIS REPONDRE A UNE QUESTION ALEATOIRE.\n[*SUITE*] [*MENU*]');
									break;
							case 2: for(var x=0; x<colonnes[difficulte]; x++)
										for(var y=0; y<lignes[difficulte]; y++) {
											p[x][y].genere();
											p[x][y].affiche();
										}
									afficheMessage('CHAQUE FILLE/GARCON A DES BRAS LEVES/BAISSES, DES PIEDS JOINTS/ECARTES, UN BAS LONG/COURT ET DES COULEURS DE CHEVEUX, D"HABIT, DE PIEDS ET DE CEINTURE. [*SUITE*]');
									break;
							case 3: afficheMessage('UN GARCON PEUT AVOIR UNE MOUSTACHE\nUNE FILLE DES BOUCLES D"OREILLES.\nENFIN, ILS PEUVENT PORTER DES LUNETTES. [*SUITE*]');		
									break;
							case 4: afficheMessage('LE TEMPS D"UNE PARTIE EST DE 4 MINUTES.\nLE NOMBRE DE QUESTIONS ET LE TEMPS DE MEMORISATION DEPENDENT DE LA BALANCE ALLANT DE 10 QUESTIONS ET 24 SECONDES A 30 QUESTIONS ET 8 SECONDES. [*SUITE*]');
									break;
							case 5: afficheMessage('IL N"Y A TOUJOURS QU"UNE SEULE REPONSE POSSIBLE A UNE QUESTION. SI VOUS REPONDEZ CORRECTEMENT, VOUS OBTENEZ\nUN SCORE EGAL AU NOMBRE DE REPONSES PROPOSEES PAR PERSONNAGE. [*SUITE*] [*MENU*]')
									break;
							case 6: 
									var stQstChoisie;
									do {
										nq = Math.floor(questions*Math.random());
										nqc = Math.floor(q[nq].possibilites()*Math.random());
										stQstChoisie = q[nq].combinaison(nqc);
									} while((q[nq].solution(nqc)==indefini) || // Pas de solution unique OU...
											((colonnes[difficulte]*lignes[difficulte] == 4) && 
											 (stQstChoisie.indexOf('COIN') > indefini))); // Questions avec COIN avec 4 personnages
									afficheMessage('EXEMPLE:[][] '+stQstChoisie);
									break;
							case 7:	afficheSolution(q[nq].solution(nqc), r-2);
									setTimeout(	function() {
													if ((phase == typePhase.phAfficheRegle) && 
														(indexRDJ == 6))
															clic(indefini);
												}, 3000);
									break;
							case 8: afficheMessage('LA BONNE REPONSE S"EST AFFICHEE EN VERT ET SI VOUS AVEZ MAL REPONDU, VOTRE REPONSE S"EST AFFICHEE EN ROUGE.\n[*SUITE*] [*MENU*]');
									break;
							case 9: afficheMessage('C"EST A VOUS DE JOUER.\nN"OUBLIEZ PAS DE CHOISIR VOTRE BALANCE.\nLA BALANCE PAR DEFAUT EST [][]b*12Q/20S*].\n[*RETOUR AU MENU*]');
									break;
							default:afficheBienvenue();
									break;
						}
					}
					break;
	}
}
//---------------------------------------------------------------------------
function lien(l) 
{
	switch(l) {
		case 1: window.open('http://patquoi.fr/Memorissibon.html');
				break;
		case 2: window.open('http://patquoi.fr');
				break;
	}
}
//---------------------------------------------------------------------------
function adapteDimensions()
{
	var largeur = document.getElementById('container').offsetWidth; 
    if (largeur != 320) { 
 		var n=document.images.length;
 		var coef=Math.floor(largeur/80)/4;
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
//---------------------------------------------------------------------------
function afficheBienvenue()
{
	tour = 0;
	if (localStorage.getItem(lsBalance))
		balance = localStorage.n;
	if (localStorage.getItem(lsDifficulte))
		difficulte = localStorage.d;
	diffPartie = difficulte;
	masquePersonnages();
	phase = typePhase.phHorsJeu;
	afficheMessage('BIENVENUE A MEMORISSIBON !\nFAITES VOTRE CHOIX*:\n[][*A PROPOS*] [*REGLE*] [*BALANCE*]\n[*DIFFICULTE*] [*TOPS*] [*NOUVELLE PARTIE*]'+(localStorage.getItem(lsTour)?'\n[*POURSUIVRE LA PARTIE*]':vide)); 
}
//---------------------------------------------------------------------------
function bienvenue()
{
	afficheBienvenue();
}
//---------------------------------------------------------------------------
