REQUETES_SQL = {
	sqlCreerPartie : 'INSERT INTO babyfoot.partie("dateCreation", "dateDebut", mode) VALUES ($1, $2, $3) RETURNING id;',
	sqlCreerJoueur : 'INSERT INTO babyfoot.joueur("dateCreation", nom) VALUES ($1, $2) RETURNING id;',
	sqlCreerPartieParJoueur : 'INSERT INTO babyfoot."PartieParUtilisateur"("idPartie", "idJoueur") VALUES ($1, $2);',
	sqlAfficherPartie : 'SELECT "PartieParUtilisateur"."idPartie",nom,mode,joueur.id,partie."dateFin",partie.score1,partie.score2 FROM babyfoot."PartieParUtilisateur" join babyfoot.partie as partie on "PartieParUtilisateur"."idPartie" = partie.id join babyfoot.joueur on "PartieParUtilisateur"."idJoueur" = joueur.id where partie."dateSuppression"  is null order by partie.id desc,joueur.id',
	sqlSupprimerPartie : 'UPDATE babyfoot.partie set "dateSuppression"=current_date where id=$1',
	sqlTerminerPartie : 'UPDATE babyfoot.partie set "dateFin"=current_date,score1=$1,score2=$2 where id=$3'
	}
	
PARAMS_BD ={
connectionStringBd : "pg:rkobmunazpbgxx:095c47968091162f8e5de437cd75f13c6bdb65ea6fde1da7a5aac5d78e85f0e1@ec2-79-125-2-142.eu-west-1.compute.amazonaws.com:5432/d44av1idluf9el"
}
