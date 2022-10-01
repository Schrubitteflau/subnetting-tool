var Tools = {};

/*
    * Returns true if the type of value is string : primitive type ("like that") or String instance (new String("myString"))
    
    * Retourne true si value est une chaîne de caractères : value est de type string primitif ("comme ça") ou une instance de String (new String("maChaine"))
*/
Tools.isString = function(value)
{
    return typeof value.valueOf() === "string";
}

Tools.isNumber = function(value)
{
    return typeof value.valueOf() === "number";
}

/*
    * bytes est un tableau qui contient des nombres décimaux entiers. Chaque valeur du tableau doit être une chaîne de caractères. Une valeur flottant sera castée
    en int : seule la partie entière sera conservée. La valeur de retour est un tableau correspondant à bytes dont les valeurs ont été converties au format binaire,
    donc une chaîne de caractères au format "xxxxxxxx", avec x valant "0" ou "1". Si une valeur incorrecte est trouvée dans bytes, alors son équivalent dans le
    tableau de retour sera null.
*/
Tools.decimalToBinary = function(bytes)
{
    let binary = [];

    for (let byte of bytes)
    {
        if (Tools.isString(byte))
        {
            byte = parseInt(byte);

            if (byte < 0 || byte > 255 || Number.isNaN(byte))
            {
                binary.push(null)
            }
            else
            {
                byte = byte.toString(2);

                while (byte.length < 8)
                {
                    byte = "0" + byte;
                }

                binary.push(byte);
            }
        }
        else
        {
            binary.push(null);
        }
    }

    return binary;
}