
/**
La liste des rencontres est récuperé de façon "brutes", il faut formater à ce niveau selon si la rencontre est solo ou duo
**/
socket.on('afficherRencontres', function(rencontres) {
  var histoId ;
  var cptJoueurs = 1;
  var isModeSolo=false,isCloture=false,cptPartiesEnCours=0;chaine="";
  document.getElementById('affichageRencontres').innerHTML='';
  for(var i=0;i<rencontres.length;i++)
  {
    var fieldsetInitial = document.getElementById('affichageRencontres');
    //Premier passage  dans la boucle
    if(cptJoueurs == 1){
      isModeSolo = rencontres[i].isModeSolo
      isCloture = rencontres[i].dateFin != null;
    }
    //Dernier joueurs de la partie
    if(cptJoueurs == (isModeSolo ? 2 : 4 )){
      if(isModeSolo)
      chaine+=fieldsetInitial.innerHTML+'<p class="rencontre"><label class="joueurs">'+rencontres[i-1].nomJoueur +' VS '+rencontres[i].nomJoueur+'</label>';
      else
      chaine+=fieldsetInitial.innerHTML+'<p class="rencontre"><label class="joueurs">'+rencontres[i-3].nomJoueur +' et '+rencontres[i-2].nomJoueur+' VS '+rencontres[i-1].nomJoueur +' et '+rencontres[i].nomJoueur+'</label>';

      //Si la partie est en cours alors on affiche les boutons de suppression et de cloture
      if(!isCloture){
        chaine+='<button class="btn btn-info suppPartie" onclick="javascript:supprimerPartie('+rencontres[i].id+');">Supprimer partie</button>    <button class="btn btn-info suppPartie" onclick="javascript:cloturerPartie('+rencontres[i].id+');">Terminer partie</button></p>';
        cptPartiesEnCours++;
      }
      else{
        var dateCourante = new Date(rencontres[i].dateFin);
        chaine+='<i>(Terminée le '+ dateCourante.getDate()+'/'+dateCourante.getMonth()+'/'+dateCourante.getFullYear()+')</i>';
      }
      fieldsetInitial.innerHTML=chaine;
      cptJoueurs=0;
      chaine="";
    }
    cptJoueurs++;
  }
  document.getElementById('cptPartiesEnCours').innerHTML=cptPartiesEnCours
});

function supprimerPartie(idPartieASupprimer){
  socket.emit('supprimerPartie',idPartieASupprimer);
}

function cloturerPartie(idPartieASupprimer){
  socket.emit('cloturerPartie',idPartieASupprimer);
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
