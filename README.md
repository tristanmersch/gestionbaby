# détails des modules node js
 
npm install http  

npm install fs 

npm install express 

npm install serve-favicon

npm install pg

npm install socket.io

npm install session.socket.io

# HEROKU

dans le code, le user/password/host sont lié à Heroku, il faudra les changer au début début du server.js pour une utilisation en local

# CREATION DE LA BD (POSTGRESQL 11) :

Chaine de connexion utilisée dans l'appli(server.js) : "pg:postgres:password@localhost:5432/babyfoot"

Pour initialiser la BD jouer le fichier sql/babyfoot.sql . Détails :

-BDD nommé "babyfoot"

-schéma nommé "babyfoot"

-3 tables nommées PartieParUtilisateur,joueur et partie


# Détail des fonctionnalités (voir les images dans le répértoire docs qui reprennent ces scenarios )

Partie Baby foot :

-Création de partie en solo et en duo

-Terminer et Supprimer une partie

Chat :

-Connexion/Deconnexion

-Message "public"/Message privé (utilisation du @ devant le login)

-Affichage de la liste des utilisateurs connectés

# Analyse du code

server.js : contient le code serveur(tout est basé sur Socket.IO). 

bd.js : informations de connexion à la BD + stockage de requètes SQL

message.js : variabilisation des messages à afficher dans l'application

gestionBabyFoot.js : code client pour le bloc "gestion des parties de babyfoot"

chat.js : code client pour le chat

index.html : seule page HTML de l'appli

css/bootstrap.css : template css que j'ai piqué avec quelque ajustements rajoutés

css/custom.css : css ajouté

Bonne change !
