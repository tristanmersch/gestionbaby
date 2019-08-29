# Modules node js
 
npm install http  

npm install fs 

npm install express 

npm install serve-favicon

npm install pg

npm install socket.io

npm install session.socket.io

La configuration de base est sur du localhost:8080 , si ça ne convient pas il faudrait changer dans server.js et dans public/chat.js

# CREATION DE LA BD :

Pour initialiser la BD jouer le fichier sql/babyfoot.sql . Rien de compliqué :
-BDD nommé "babyfoot"
-schéma nommé "babyfoot"
-3 tables nommées PartieParUtilisateur,joueur et partie


# Détail des fonctionnalités (voir les images dans le répértoire docs qui reprennent ces scenarios )

Partie Baby foot :
-Création de partie en solo
-Création de partie en duo
-Terminer une partie
-Supprimer une partie

Chat :
-Connexion
-Deconnexion
-Message "public"
-Message privée (utilisation du @ devant le login)
-Affichage de la liste des utilisateurs connectés
