/**
Ce fichier permet de gerer tous les appels websockets du chat+la logique front
**/

var socket = io.connect(window.location.hostname);

//Premier message aprés connexion
socket.on('premierMessage', function(message) {
	document.getElementById('user_chat').style.display ='none'
	document.getElementById('connect').style.display ='none'
	document.getElementById('messageChat').disabled = false;
	document.getElementById('envoyerMessage').disabled = false;
	document.getElementById('deconnexion').style.display = 'inline';
	document.getElementById('listeMessageChat').innerHTML=document.getElementById('listeMessageChat').innerHTML+formaterMessageHTML(message,null,null,true)
});

//Rechargement de la liste des utilisateurs connecté
socket.on('listeUtilisateurs', function(users) {
	var usersHTML="";
	document.getElementById('listeUtilisateursEnLigne').innerHTML='';
	for(var user in users){
		usersHTML+=document.getElementById('listeUtilisateursEnLigne').innerHTML+formaterUtilisateurHTML(users[user]);
	}
	document.getElementById('listeUtilisateursEnLigne').innerHTML=usersHTML;
});

//Formatage du texte dans le chat
function formaterMessageHTML(message,user,heure,isMessageSysteme){
	//On utilise plus l'heure envoyée par le serveur
	var heureCourante = dateCourante.getHours()+':'+dateCourante.getMinutes();
	var infoUsers =!isMessageSysteme ? '<small class="text-muted">'+user+' à '+heureCourante+'</small>' : '';
	message = isMessageSysteme ? message='<i>'+message+'</i>' : message;
	return '<li class="media messageChat"><div class="media-body messageChat"><div class="media messageChat"><div class="media-body messageChat" >'+message+'<br/>'+infoUsers+'<hr/></div></div></div></li>';
}

//Formatage de la liste des utilisateurs
function formaterUtilisateurHTML(user){
	return '<li class="media users"><div class="media-body"><div class="media"><div class="media-body" ><li>'+user+'</li></div></div></div></li>';
}

//Demande de déconnexion apés click sur le bouton
socket.on('deconnexionManuelle', function(message) {
	var fieldsetInitial = document.getElementById('listeMessageChat');
	fieldsetInitial.innerHTML=fieldsetInitial.innerHTML+formaterMessageHTML(message.message,message.user,message.heure,false);
	document.getElementById('messageChat').value ='';
});

//Affichage du message envoyé dans le chat
socket.on('afficherMessageChat', function(message) {
	var fieldsetInitial = document.getElementById('listeMessageChat');
	fieldsetInitial.innerHTML=fieldsetInitial.innerHTML+formaterMessageHTML(message.message,message.user,message.heure,false);
	document.getElementById('messageChat').value ='';
	document.getElementById('blocMessageChat').scrollTop = document.getElementById('blocMessageChat').scrollHeight;
});

//Mecanisme d'erreur géré avec une alert
socket.on('erreurChat', function(erreur) {
	alert(erreur);
});

//Récupération de la socketId de l'utilisateur connecté
socket.on('socketId', function(socketId) {
	document.getElementById('socket_id').value=socketId;
});

function envoyerMessage(){
	var message = document.getElementById('messageChat').value;
	var socketId = document.getElementById('socket_id').value;
	var dataChat = { message : document.getElementById('messageChat').value};
	var isPrivee=message.trim()[0] == '@';
	if(isPrivee){
		dataChat = { userDestinataire : message.trim().split(" ")[0].substring(1,message.length) , message : message.replace( message.trim().split(" ")[0],'')};
	}
	socket.emit(isPrivee ? 'messagePrive' : 'messageChat',dataChat);
}

function connect(){
	var login = document.getElementById('user_chat').value;
	if(login.trim().length == 0){
		alert('veuillez saisir un login');
		return;
	}
	socket.emit('auth',login);
};

function disconnect(){
	socket.emit('deconnexion',document.getElementById('socket_id').value);
	document.getElementById('deconnexion').style.display = 'none';
	document.getElementById('connect').style.display = 'inline';
	document.getElementById('user_chat').style.display = 'inline';
	document.getElementById('user_chat').value=""
	document.getElementById('messageChat').disabled = true;
	document.getElementById('listeMessageChat').innerHTML='';
	document.getElementById('envoyerMessage').disabled = true;
};
document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById("messageChat").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById('envoyerMessage').click();
  }
  });
});
