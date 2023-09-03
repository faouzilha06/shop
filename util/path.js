const path = require("path"); //import du module path

module.exports = path.dirname(process.main.filename);

//path.dirame : pour extraire le répertoire du fichier principal qui a lancé l'application. process.mainModule.filename
//renvoie le chemin absolu du module principal.
//Le résultat est exporté pour être utilisé dans d'autres parties de l'application.

//obtenir le répertoire du fichier principal de l'application via les modules path et process,
//utile pour construire des chemins de fichiers relatifs à cet emplacement.
