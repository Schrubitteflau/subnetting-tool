Ceci est un vieux projet que j'ai récemment retrouvé en farfouinant dans mes fichiers

outils web qui permet, à l'aide d'une ip et d'un masque de :
* marquer ip et masque : tableau qui affiche classe, adresse réseau, début, fin, broadcast, nombre d'hôtes, pas

Autres notes :
final : dire qu'on veut à partir d'un réseau et d'un masque, tant de sous-réseaux qui ont tant de hôtes chacuns

+ bouton exclure 1er et dernière adresse réseau

Objet ipv4 ?
Object Mask : contiendrait des méthodes pour passer facilement d'une écriture à l'autre : propriété qui une fois appellée appelle une méthode cachée pour la convesion avec defineProperty() : le but est que ce soit le plus simple possible à utiliser
var m = new SubnetMask("255.255.255.128")
m.CIDR;	// Appelle une fonction de conversion et retourne le résultat
m.binary;
m.decimal;
