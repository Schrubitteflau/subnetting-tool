var Mask = {};

Mask.binary = {};
Mask.decimal = {};
Mask.CIDR = {};
Mask.host = {};

/*
    * Returns true if binaryMask is a string and his format is "xxxxxxxx.xxxxxxxx.xxxxxxxx.xxxxxxxx" where x is "0" or "1" and if the bits aren't mixed, else false
    
    * Retourne true si binaryMask est de type string, et que son format correspond à "xxxxxxxx.xxxxxxxx.xxxxxxxx.xxxxxxxx" où x vaut "0" ou "1" et à condition que
    les bits ne soient pas mélangés, sinon false
*/
Mask.binary.isValid = function(binaryMask)
{
    if (!Tools.isString(binaryMask) || binaryMask.length != 35)
    {
        return false;
    }

    // On supprime tous les "." du masque
    binaryMask = binaryMask.replace(/\./g, "");

    // Regex correspondant au format souhaité
    let regex = /^[1]*[0]*$/g;

    return regex.test(binaryMask);
}

/*
    * Returns a string which correspond to binaryMask converted to a decimal mask, or null if binaryMask isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de binaryMask (masque au format binaire) en un masque au format décimal, ou null si binaryMask
    est invalide
*/
Mask.binary.toDecimal = function(binaryMask)
{
    if (!Mask.binary.isValid(binaryMask))
    {
        return null;
    }

    // Le séparateur entre les octets est le point, on récupère un tableau qui contient les 4 octets séparés
    let bytes = binaryMask.split(".");

    // Puis on convertit chaque octet en base 10 à l'aide de parseInt()
    return parseInt(bytes[0], 2) + "." + parseInt(bytes[1], 2) + "." + parseInt(bytes[2], 2) + "." + parseInt(bytes[3], 2);
}

/*
    * Returns a string which correspond to binaryMask converted to a CIDR mask, or null if binaryMask isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de binaryMask (masque au format binaire) en un masque au format CIDR, ou null si binaryMask
    est invalide
*/
Mask.binary.toCIDR = function(binaryMask)
{
    if (!Mask.binary.isValid(binaryMask))
    {
        return null;
    }

    let i = 0;

    // On commence par supprimer les points de binaryMask
    binaryMask = binaryMask.replace(/\./g, "");

    // Puis on retourne l'index auquel on a trouvé le 1er 0
    for (; i < 32; i++)
    {
        if (binaryMask[i] === "0")
        {
            break;
        }
    }

    return i.toString();
}

/*
    * Returns true if decimalMask is a string and his format is "x.x.x.x", where x is a number between 0 and 255, else false
    
    * Retourne true si decimalMask est de type string, et que son format correspond à "x.x.x.x", où x est un nombre compris entre 0 et 255, sinon false
*/
Mask.decimal.isValid = function(decimalMask)
{
    if (!Tools.isString(decimalMask))
    {
        return false;
    }

    // Regex correspondant au format souhaité
    let regex = /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/;

    return regex.test(decimalMask);
}

/*
    * Returns a string which correspond to decimalMask converted to a binary mask, or null if decimalMask isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de decimalMask en un masque au format binaire, ou null si decimalMask est invalide
*/
Mask.decimal.toBinary = function(decimalMask)
{
    if (!Mask.decimal.isValid(decimalMask))
    {
        return null;
    }

    // Le séparateur entre les octets est le point, on récupère un tableau qui contient les 4 octets séparés
    let bytes = decimalMask.split(".");

    // Puis on convertit chaque octet en base 2
    bytes = Tools.decimalToBinary(bytes);

    // Et on le retourne sous forme d'une adresse ip
    return bytes[0] + "." + bytes[1] + "." + bytes[2] + "." + bytes[3];
}

/*
    * Returns a string which correspond to decimalMask converted to a CIDR mask, or null if decimalMask isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de decimalMask en un masque au format CIDR, ou null si decimalMask est invalide
*/
Mask.decimal.toCIDR = function(decimalMask)
{
    return Mask.decimal.isValid(decimalMask) ? Mask.binary.toCIDR(Mask.decimal.toBinary(decimalMask)) : null;
}

/*
    * Returns true if CIDR is a string which contains a number between 0 and 32, else false
    
    * Retourne true si CIDR est de type string, et qu'elle contient un nombre compris entre 0 et 32, sinon false
*/
Mask.CIDR.isValid = function(CIDR)
{
    if (!Tools.isString(CIDR))
    {
        return false;
    }

    CIDR = parseInt(CIDR, 10);

    return CIDR >= 0 && CIDR <= 32;
}

/*
    * Returns a string which correspond to CIDR converted to a binary mask, or null if CIDR isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de CIDR en un masque au format binaire, ou null si CIDR est invalide
*/
Mask.CIDR.toBinary = function(CIDR)
{
    if (!Mask.CIDR.isValid(CIDR))
    {
        return null;
    }

    CIDR = parseInt(CIDR, 10);

    let binary = "";

    // On ajoute CIDR fois "1" dans binary, puis on complète avec des "0"
    for (let i = 0; i < 32; i++)
    {
        binary += (i < CIDR ? "1" : "0");
        if ((i + 1) % 8 === 0 && i != 31)
        {
            binary += ".";
        }
    }

    return binary;
}

/*
    * Returns a string which correspond to CIDR converted to a decimal mask, or null if CIDR isn't valid
    
    * Retourne une chaîne de caractère correspondant à la conversion de CIDR en un masque au format décimal, ou null si CIDR est invalide
*/
Mask.CIDR.toDecimal = function(CIDR)
{
    if (!Mask.CIDR.isValid(CIDR))
    {
        return null;
    }

    return Mask.binary.toDecimal(Mask.CIDR.toBinary(CIDR));
}

/*
    * Returns true if mask is a valid subnet mask : valid binary mask, valud decimal mask, or valid CIDR. Else returns false

    * Retourne true si mask est un masque de sous-réseau valide : masque binaire valide, masque décimal valide ou CIDR valide. Sinon, false est retourné
*/
Mask.isValid = function(mask)
{
    return Mask.binary.isValid(mask) || Mask.decimal.isValid(mask) || Mask.CIDR.isValid(mask);
}


/*
    * Returns the minimum number of bits to contain `hostsNumber` hosts inside a network. `hostsNumber` is an integer, if not null value will be returned

    * Retourne le nombre de bits minimum pour pouvoir contenir `hostsNumber` hôtes sur votre réseau. `hostsNumber` est un nombre entier, si ce n'est pas le cas
    null sera retourné
*/
Mask.host.requiredBits = function(hostsNumber)
{
    /* Le nombre de bits requis correspond au nombre de bits à partir du premier bit à 1 jusqu'au dernier. On utilise toString(2) pour convertir un nombre
    en binaire et on retourne le nombre de bits, puisque chaque bit à 0 devant (à gauche) le dernier bit à 1 est inutile. */
    if (!Tools.isNumber(hostsNumber) || !Number.isInteger(hostsNumber) || hostsNumber < 0 || hostsNumber > 4294967295)
    {
        return null;
    }

    return hostsNumber.toString(2).length;
}

/*
    * Returns maximum number of hosts that a newtork can contain with the number of bits in the host part `hostSize`. Returns null if `hostSize` is not an Integer
    between 0 and 32.

    * Retourne le nombre maximum d'hôtes que peut accueillir un réseau avec le nombre de bits de la partie réseau donné `hostSize`. Retourne null si `hostSize`
    n'est pas un entier entre 0 et 32.
*/
Mask.host.maxHosts = function(hostSize)
{
    if (!Tools.isNumber(hostSize) || !Number.isInteger(hostSize) || hostSize < 0 || hostSize > 32)
    {
        return null;
    }

    if (hostSize === 32)
    {
        return 0;
    }

    let maxHosts = 1;

    // Ajouter un bit à 1 correspond à doubler la valeur et à ajouter 1
    for (let i = 0; i < hostSize - 1; i++)
    {
        maxHosts *= 2;
        maxHosts++;
    }

    return maxHosts;
}