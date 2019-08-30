var http = require('http');
const PORT  = 8080
var fs = require('fs');
var express = require('express');
var favicon = require('serve-favicon');
var pg = require("pg");
var app = express();
//var connectionString = "pg:postgres:password@localhost:5432/babyfoot";
var connectionString = "pg:rkobmunazpbgxx:095c47968091162f8e5de437cd75f13c6bdb65ea6fde1da7a5aac5d78e85f0e1@localhost:5432/d44av1idluf9el";

var client = new pg.Client(connectionString);
const messageAccueil = 'Bonjour $1, Tu peux envoyer des messages publics mais aussi privés en utilisant le @ (Ex: pour un utilisateur toto : @toto bonjour mon ami)'
const REQUETES_SQL = {
	sqlCreerPartie : 'INSERT INTO babyfoot.partie("dateCreation", "dateDebut", mode) VALUES ($1, $2, $3) RETURNING id;',
	sqlCreerJoueur : 'INSERT INTO babyfoot.joueur("dateCreation", nom) VALUES ($1, $2) RETURNING id;',
	sqlCreerPartieParJoueur : 'INSERT INTO babyfoot."PartieParUtilisateur"("idPartie", "idJoueur") VALUES ($1, $2);',
	sqlPartieJoueur : 'SELECT "PartieParUtilisateur"."idPartie",nom,mode,joueur.id,partie."dateFin" FROM babyfoot."PartieParUtilisateur" join babyfoot.partie as partie on "PartieParUtilisateur"."idPartie" = partie.id join babyfoot.joueur on "PartieParUtilisateur"."idJoueur" = joueur.id where partie."dateSuppression"  is null',
	sqlSupprimerPartie : 'UPDATE babyfoot.partie set "dateSuppression"=current_date where id=$1',
	sqlTerminerPartie : 'UPDATE babyfoot.partie set "dateFin"=current_date where id=$1'
	}

app.use(express.static('public'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var session = require('session.socket.io');
var com = io.sockets;
//Stockage des logins connectés sur le chat
session.idUser = [];
//Stockage des idSockets par utilisateurs pour pouvoir géréer des communications privées
session.socketByUsers = new Map();
session.usersBySocket = new Map();

/*
Cloturer une partie = remplir la date de fin de la partie
@Todo
Il faudrait pouvoir saisir le/les vainqueurs à cet endroit lorsque la partie est cloturée
*/
function cloturerPartie(idPartie,socketId){
	console.log('suppression de la partie '+idPartie);
	client.query(REQUETES_SQL.sqlTerminerPartie,[idPartie]).then (
		res => gererJoueur(socketId)
	).catch(e=> console.log(e.stack))
}
/*
Creation d'une joueur en base, cette opération est forcéemnt liée la création d'une partie, il n'y a pas de création d'utilisateur dédiée
Une promesse va donc permettre de remplir la table d'association "partieParJoueur" une fois que l'utilisateur est crée en BD (et qu'on récupère son id)
*/

function creerJoueur(idPartie,nomJoueurs,dateCreation,socketId){
	for(var nomJoueur in nomJoueurs){
		console.log('Début de la Création du joueur '+nomJoueurs[nomJoueur]);
		client.query(REQUETES_SQL.sqlCreerJoueur,[dateCreation,nomJoueurs[nomJoueur]]).then (
			res => creerPartiesParJoueur(idPartie,res.rows[0].id,socketId)
		).catch(e=> console.log(e.stack))
	}
}

//Remplissage de la table d'association partiesParJoueur, si le traitement se termine correctement on lance une fonction permettant un refresh de l'affichage des rencontres
function creerPartiesParJoueur(idPartie,idJoueur,socketId){
	console.log('creation de la partie par joueur');

	client.query(REQUETES_SQL.sqlCreerPartieParJoueur,[ idPartie, idJoueur]).then (
		res => gererJoueur(socketId)
	).catch(e=> console.log(e.stack))
}



/* Permet d'effectuer la récupération des rencontres( sauf les supprimées)
La gestion de l'affichage d'une partie solo ou duo est géré dans le front
A chaque nouvelle modification on recharge toute la liste des parties et on l'envoi sous la forme d'un tableau d'objet
*/

function gererJoueur(socketId){
	function afficherJoueur(joueurs,socketId){
		var socketCourante = io.sockets.connected[socketId];
		var  partiesCourante= new Array();
		for (var joueur in joueurs) {
			var modeSolo = joueurs[joueur].mode == 1;
			partiesCourante.push({nomJoueur : joueurs[joueur].nom , id : joueurs[joueur].idPartie , isModeSolo : modeSolo , dateFin : joueurs[joueur].dateFin });
		}
		socketCourante.broadcast.emit('afficherRencontres', partiesCourante);
		socketCourante.emit('afficherRencontres', partiesCourante);
	}
	client.query(REQUETES_SQL.sqlPartieJoueur).then (
		res => afficherJoueur(res.rows,socketId)
	).catch(e=> console.log(e.stack))
}
//Suppression d'une partie de façon logique pour conserver un historique
function supprimerPartie(idPartie,socketId){
	console.log('suppression de la partie '+idPartie);

	client.query(REQUETES_SQL.sqlSupprimerPartie,[idPartie]).then (
		res => gererJoueur(socketId)
	).catch(e=> console.log(e.stack))
}


com.on('connection', function (socket) {
	//Connexion sur le chat
	socket.on('auth', function (user) {
		if(session.socketByUsers.has(user)){
			var msgErreur = "L'utilisateur "+user+" existe déjà, tu dois changer de login";
			socket.emit('erreurChat',msgErreur);
			return;
		}
		//On initialise des sessions permettant de gerer les relations users/sockets
		session.idUser.push(user);
		session.socketByUsers.set(user,socket.id);
		session.usersBySocket.set(socket.id,user);
		var premierMessage = messageAccueil.replace('$1',user);
		socket.emit('socketId', socket.id);
		socket.emit('premierMessage', premierMessage);
		socket.broadcast.emit(premierMessage);
		socket.broadcast.emit('listeUtilisateurs', session.idUser);
		socket.emit('listeUtilisateurs', session.idUser);
		console.log(user+' est en ligne');
	});

	socket.on('messagePrive', function (message) {
		var dateCourante = new Date();
		var heure = dateCourante.getHours()+':'+dateCourante.getMinutes();
		var userChat = session.usersBySocket.get(socket.id)
		console.log(userChat+'/'+session.socketByUsers.get(userChat));
		if(!session.socketByUsers.has(message.userDestinataire)){
			var msgErreur = "L'utilisateur "+message.userDestinataire+" n'est pas en ligne";
			io.sockets.connected[socket.id].emit('erreurChat',msgErreur);
			return;
		}
		io.sockets.connected[socket.id].emit('afficherMessageChat', { user : userChat , message : '@'+message.userDestinataire+' / '+message.message, heure : heure});
		io.sockets.connected[session.socketByUsers.get(message.userDestinataire)].emit('afficherMessageChat', { user : userChat , message : '[MESSAGE PRIVEE]'+message.message, heure : heure});
	});

	socket.on('messageChat', function (message) {
		var dateCourante = new Date();
		var heure = dateCourante.getHours()+':'+dateCourante.getMinutes();
		var userChat = session.usersBySocket.get(socket.id)
		socket.broadcast.emit('afficherMessageChat', { user : userChat , message : message.message, heure : heure});
		socket.emit('afficherMessageChat', { user : userChat, message : message.message, heure : heure});
		console.log('Le message a ete envotye'+message.socketId);
	});

	socket.on('creerPartie', function(partie){
		console.log('creation de la partie');
		var dateCourante = new Date();
		partie.dateDebut=new Date();
		var values = [partie.dateDebut,dateCourante,partie.mode];
		var socketId=socket.id
		client.query(REQUETES_SQL.sqlCreerPartie,values).then (
			res => creerJoueur(res.rows[0].id,partie.nomjoueurs,dateCourante,socketId)
		).catch(e=> console.log(e.stack))
	});

	socket.on('supprimerPartie', function(idPartieASupprimer){
		supprimerPartie(idPartieASupprimer,socket.id);
	});

	socket.on('cloturerPartie', function(idPartieASupprimer){
		cloturerPartie(idPartieASupprimer,socket.id);
	});

	socket.on('deconnexion', function(socketId){
		var user = session.usersBySocket.get(socketId),clone = session.idUser.slice(0)
		session.idUser=new Array();
		for(var idU in clone){
			if(clone[idU] === user){
				console.log(user+" s'est déconnecté")
			}
			else{
				session.idUser.push(clone[idU])
			}
		}
		session.socketByUsers.delete(user)
		session.usersBySocket.delete(socketId)
		socket.broadcast.emit('listeUtilisateurs', session.idUser);
		socket.emit('listeUtilisateurs', session.idUser);
	});

	gererJoueur(socket.id);
	socket.broadcast.emit('listeUtilisateurs', session.idUser);
	socket.emit('listeUtilisateurs', session.idUser);
});

client.connect();
server.listen(PORT)
