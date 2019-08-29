# Modules node js
 
npm install http  

npm install fs 

npm install express 

npm install serve-favicon

npm install pg

npm install socket.io

npm install session.socket.io

La configuration de base est sur du localhost:8080 , si ça ne convient pas il faudrait changer dans server.js et dans public/chat.js

# CREATION DE LA BD (POSTGRESQL 11) :

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

server.js : contient le code serveur(tout est basé sur Socket.IO). Je ne l'ai pas subdivisé en plusieurs fichiers étant donné qu'il n'est pas énorme.

gestionBabyFoot.js : code client pour le bloc "gestion des parties de babyfoot"

chat.js : code client pour le chat

index.html : seule page HTML de l'appli

css/bootstrap.css : template css que j'ai piqué avec quelque ajustements rajoutés

css/chat.css : ajustement pour le chat

(J'admet ne pas avoir fait enormément d'effort pour bien structurer le css)

Bonne change !
