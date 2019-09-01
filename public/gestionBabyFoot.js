
/**
La liste des rencontres est récuperé de façon "brutes", il faut formater à ce niveau selon si la rencontre est solo ou duo
**/
socket.on('afficherRencontres', function(rencontres) {
  //Utilisé pour compter le nombre de joueur pour une partie (permet de gérer les modes solo/duo)
  var cptJoueurs = 1;
  var isModeSolo=false,isCloture=false,cptPartiesEnCours=0;blocParties="",score="";
  
  //Definition de la structure HTML nécéssaire à l'affichage d'une partie (On utilisera le .replace pour inserer des données dynamiques)
  var htmlPartie = '<p class="rencontre"><label class="joueurs">$partie</label>';
  var htmlCompletementPartieEnCours = '<button class="btn btn-info suppPartie" onclick="javascript:supprimerPartie(idRencontre);">Supprimer</button>    <button class="btn btn-info suppPartie" onclick="javascript:cloturerPartie(idRencontre);">Terminer</button></p>';
  var htmlCompletementPartieCloturee = '<i>Terminée le $dateFin (<b>$score</b>)</i>';
  var htmlScore = ' <input type="text" size=1 id="idRencontre_score1"/> VS <input size=1 type="text" id="idRencontre_score2"/> ';
  
  document.getElementById('affichageRencontres').innerHTML='';
  for(var i=0;i<rencontres.length;i++){
    //On initialise les variables commune à la partie lors du passage sur le premier joueur
    if(cptJoueurs == 1){
      isModeSolo = rencontres[i].isModeSolo
      isCloture = rencontres[i].dateFin != null;
	  score = rencontres[i].score1+'-'+rencontres[i].score2;
	  dateFinPartie = new Date(rencontres[i].dateFin); 
    }
    //Passage sur le dernier joueur de la partie (c'est le moment de générer la chaine d'une partie)
    if(cptJoueurs == (isModeSolo ? 2 : 4 )){
	  //Reduction au minimum du nombre de lignes. Pour de l'affichage c'est ce que j'essaye de faire( contrairement à un code sensible côté back ou je vais plutôt privilegier la clarté).
	  libellePartie = isModeSolo ? rencontres[i-1].nomJoueur +(isCloture ? ' VS ' : htmlScore.replace(new RegExp('idRencontre_', 'g'),rencontres[i].id))+rencontres[i].nomJoueur : rencontres[i-3].nomJoueur +' et '+rencontres[i-2].nomJoueur+(isCloture ? ' VS ' : htmlScore.replace(new RegExp('idRencontre_', 'g'),rencontres[i].id))+rencontres[i-1].nomJoueur +' et '+rencontres[i].nomJoueur;
	  blocParties += htmlPartie.replace('$partie',libellePartie) + (isCloture ? htmlCompletementPartieCloturee.replace('$dateFin',dateFinPartie.getDate()+'/'+dateFinPartie.getMonth()+'/'+dateFinPartie.getFullYear()).replace('$score',score) : htmlCompletementPartieEnCours.replace(new RegExp('idRencontre', 'g'), rencontres[i].id));
	  !isCloture ? cptPartiesEnCours++ : '';
      cptJoueurs=0;
    }
    cptJoueurs++;
  }
  document.getElementById('affichageRencontres').innerHTML = blocParties;
  document.getElementById('cptPartiesEnCours').innerHTML = cptPartiesEnCours
  document.getElementById('affichageRencontres').scrollTop = '0px';
});

function supprimerPartie(idPartieASupprimer){
  socket.emit('supprimerPartie',idPartieASupprimer);
}

function cloturerPartie(idPartieASupprimer){
  var score1 = document.getElementById(idPartieASupprimer+'score1').value;
  var score2 = document.getElementById(idPartieASupprimer+'score2').value;

  var chiffresOk=score1.length == 1 && score2.length == 1;
  
  score1=parseInt(score1);
  score2=parseInt(score2);

  var score1ok=chiffresOk && score1 >= 0 && score1 <= 6; 
  var score2ok=chiffresOk && score2 >= 0 && score2 <= 6; 
  var scoresOK = score1ok && score2ok && (score1 == 6 || score2 == 6) && score1+score2 < 12;
  if(!scoresOK){
	alert('Saisissez un chiffre entre 0 et 6');
	return;
  }
  socket.emit('cloturerPartie',{idPartieASupprimer : idPartieASupprimer, score1 : score1, score2 : score2});
}
/*Controle basique pour verifier que le champ est bien rempli
@Todo faire la différence entre un nom de user existant en BD et un nouveau
*/
function controleChampsJoueurs(joueurs){
  for(var j in joueurs){
    if(joueurs[j] == undefined || joueurs[j] == null || joueurs[j].trim().length == 0)
    {
      alert('Veuiller saisir des noms joueurs');
      return false;
    }
  }
  return true;
}
  function creerPartie(){
    /**
    1 : mode solo
    2 : mode duo
    **/

    var mode = document.getElementsByName('modePartie')[0].checked ? document.getElementsByName('modePartie')[0].value : document.getElementsByName('modePartie')[1].value;
    var joueur1 = document.getElementsByName('joueur1')[mode == 1 ? 0 : 1].value,joueur2 = document.getElementsByName('joueur2')[mode == 1 ? 0 : 1].value,joueur3 = document.getElementsByName('joueur3')[0].value,joueur4 = document.getElementsByName('joueur4')[0].value;

    var joueur = { mode : mode, nomjoueurs : mode ==  1 ? [ joueur1, joueur2] : [joueur1, joueur2,joueur3, joueur4]};
    if(controleChampsJoueurs(joueur.nomjoueurs))
    {
      socket.emit('creerPartie',joueur);
    }
  }

  //Permet d'afficher 2 ou 4 champs  joueurs selon le choix solo/duo
  function gererChampsJoueurs(modeSolo){
    if(modeSolo) {
      document.getElementById('solo').style.display = "block";
      document.getElementById('duo').style.display = "none";
    }
    else {
      document.getElementById('solo').style.display = "none";
      document.getElementById('duo').style.display = "block";
    }
  }
