const vocabulary = [
    {
        "term": "en skola, skolan, skolor, skolorna",
        "translation": "koulu",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "ett betyg, betyget, betyg, betygen",
        "translation": "arvosana",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "ett slutbetyg, slutbetyget",
        "translation": "päättötodistus",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "ett medeltal",
        "translation": "keskiarvo",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "en dubbelexamen",
        "translation": "kaksoistutkinto",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "en studiehandledare",
        "translation": "opinto-ohjaaja",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "gymnasiet",
        "translation": "lukio",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "yrkesskolan",
        "translation": "ammattikoulu",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "merkonomlinjen",
        "translation": "merkonomilinja",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "katedralskolan",
        "translation": "ruotsinkielinen lukio",
        "category": "schoolTerms",
        "type": "nouns"
    },
    {
        "term": "gå i skolan",
        "translation": "käydä koulua",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "söka till gymnasiet",
        "translation": "hakea lukioon",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "komma in på gymnasiet",
        "translation": "päästä lukioon",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "få betyg",
        "translation": "saada arvosana",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "efter grundskolan",
        "translation": "peruskoulun jälkeen",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "på hösten",
        "translation": "syksyllä",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "gå i högstadiet",
        "translation": "käydä yläkoulua",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "gå i lågstadiet",
        "translation": "käydä alakoulua",
        "category": "schoolTerms",
        "type": "phrases"
    },
    {
        "term": "studera, studerar, studerade",
        "translation": "opiskella",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "välja, väljer, valde, valt",
        "translation": "valita",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "förstå, förstår, förstod",
        "translation": "ymmärtää",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "tänka, tänker, tänkte",
        "translation": "ajatella",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "vara, är, var, varit",
        "translation": "olla",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "börja",
        "translation": "aloittaa",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "tro",
        "translation": "uskoa",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "veta",
        "translation": "tietää",
        "category": "verbs",
        "type": "basic"
    },
    {
        "term": "bli intresserad av",
        "translation": "kiinnostua jostakin",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "ha kontakt",
        "translation": "olla yhteydessä",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "vara rädd för",
        "translation": "pelätä jotakin",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "fundera på",
        "translation": "miettiä jotakin",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "påverka",
        "translation": "vaikuttaa",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "träffas",
        "translation": "tavata toisensa",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "bli färdig",
        "translation": "valmistua",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "klara sig",
        "translation": "pärjätä",
        "category": "verbs",
        "type": "phrases"
    },
    {
        "term": "stressig/stressigt",
        "translation": "stressaava",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "tung/tungt/tunga",
        "translation": "raskas, painava",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "jättesvår/jättesvårt",
        "translation": "tosi vaikea",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "jättetråkig/jättetråkigt",
        "translation": "tosi tylsä",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "jättenervös",
        "translation": "tosi hermostunut",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "jobbig",
        "translation": "raskas, työläs",
        "category": "adjectives",
        "type": "regular"
    },
    {
        "term": "egentligen",
        "translation": "oikeastaan",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "ganska",
        "translation": "aika, melko",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "säkert",
        "translation": "varmasti",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "lite",
        "translation": "vähän, hieman",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "igen",
        "translation": "taas",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "där",
        "translation": "siellä",
        "category": "adjectives",
        "type": "adverbs"
    },
    {
        "term": "en månad, månaden",
        "translation": "kuukausi",
        "category": "timeAndLocation",
        "type": "time"
    },
    {
        "term": "varje dag",
        "translation": "joka päivä",
        "category": "timeAndLocation",
        "type": "time"
    },
    {
        "term": "senare",
        "translation": "myöhemmin",
        "category": "timeAndLocation",
        "type": "time"
    },
    {
        "term": "tre år till",
        "translation": "vielä kolme vuotta",
        "category": "timeAndLocation",
        "type": "time"
    },
    {
        "term": "Lilla Hanken",
        "translation": "ruotsinkielinen kaupallinen oppilaitos",
        "category": "timeAndLocation",
        "type": "location"
    },
    {
        "term": "framtid",
        "translation": "tulevaisuus",
        "category": "timeAndLocation",
        "type": "location"
    }
];
