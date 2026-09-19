const readline = require("readline");


function normaliserNom(nom) {
    return nom.trim().replace(/\s+/g, " ").toLowerCase();
}


function validerResultat(jour, exercicesTermines, totalExercices, challengeTermine) {

    if (jour < 1 || jour > 7) {
        console.log("(┬┬﹏┬┬) le jour doit etre entre 1 et 7")
        return false;
    }
    if (exercicesTermines < 0 || totalExercices < 0) {
        console.log("(┬┬﹏┬┬) le nombre d'exercices ne peut pas être négatif.")
        return false;
    }
    if (exercicesTermines > totalExercices) {
        console.log("(┬┬﹏┬┬) les exercices terminés ne peuvent pas dépasser le total")
        return false;
    }

    if (typeof challengeTermine !== "boolean") {
        console.log("( •̀ .̫ •́ )✧ entrer true or false")
        return false;
    }
    return true;
}

const apprenants = [];

function ajouterApprenant(id, nomComplet, ville) {

    for (let i = 0; i < apprenants.length; i++) {

        if (apprenants[i].id=== id) {
            return false;
        }
    }

    apprenants.push({
        id: id,
        nomComplet: normaliserNom(nomComplet),
        ville: ville,
        resultats: []
    });

    return true;
}

function enregistrerResultat( id, jour, exercicesTermines, totalExercices,challengeTermine) {

    if ( !validerResultat( jour, exercicesTermines, totalExercices, challengeTermine ))
    {
        return false;
    }

    for (let i = 0; i < apprenants.length; i++) {

        if (apprenants[i].id === id) {

            for (let j = 0; j < apprenants[i].resultats.length; j++) {

                if (apprenants[i].resultats[j].jour === jour) {
                    apprenants[i].resultats[j].exercicesTermines = exercicesTermines;
                    apprenants[i].resultats[j].totalExercices = totalExercices;

                    apprenants[i].resultats[j].challengeTermine = challengeTermine;
                    return true;
                }
            }
            apprenants[i].resultats.push({
                jour: jour,
                exercicesTermines: exercicesTermines,
                totalExercices: totalExercices,
                challengeTermine: challengeTermine
            });

            return true;
        }
    }

    return false;
}



function rechercherApprenant(nom) {

    let resultat = [];

    for (let i = 0; i < apprenants.length; i++) {

        if (apprenants[i].nomComplet.includes(nom.toLowerCase())) {
            resultat.push(apprenants[i]);
        }
    }

    return resultat;
}


// 6. CALCULER LA PROGRESSION

function calculerProgression(apprenant) {

    let exercicesTermines = 0;
    let totalExercices = 0;
    let challengesTermines = 0;
    let journeesRenseignees = 0;

    for (let i = 0; i < apprenant.resultats.length; i++) {

        exercicesTermines +=
            apprenant.resultats[i].exercicesTermines;

        totalExercices +=
            apprenant.resultats[i].totalExercices;

        if (apprenant.resultats[i].challengeTermine) {
            challengesTermines++;
        }

        journeesRenseignees++;
    }

    let progression = 0;

    // Eviter la division par 0
    if (totalExercices > 0) {

        progression = Math.round(
            (exercicesTermines / totalExercices) * 100
        );
    }

    let niveau;

    if (progression >= 80) {

        niveau = "Solide";

    } else if (progression >= 50) {

        niveau = "En progression";

    } else {

        niveau = "À renforcer";
    }

    return {
        exercicesTermines: exercicesTermines,
        totalExercices: totalExercices,
        progression: progression,
        challengesTermines: challengesTermines,
        journeesRenseignees: journeesRenseignees,
        niveau: niveau
    };
}


// 7. FILTRER PAR NIVEAU


function filtrerParNiveau(niveau) {

    let resultat = [];

    for (let i = 0; i < apprenants.length; i++) {

        let progression = calculerProgression(apprenants[i]);

        if (progression.niveau === niveau) {

            resultat.push(apprenants[i]);
        }
    }

    return resultat;
}



// 8. TRIER PAR PROGRESSION


function trierParProgression() {

    let resultat = apprenants.slice();

    resultat.sort(function(a, b) {

        return (
            calculerProgression(b).progression -
            calculerProgression(a).progression
        );
    });

    return resultat;
}



function trierParNom() {

    let resultat = apprenants.slice();

    resultat.sort(function(a, b) {

        return a.nomComplet.localeCompare(b.nomComplet);
    });

    return resultat;
}



// 10. AFFICHER UNE LISTE


function afficherListe(liste) {

    if (liste.length === 0) {

        console.log("Aucun apprenant trouvé.");

        return;
    }

    for (let i = 0; i < liste.length; i++) {

        let progression = calculerProgression(liste[i]);

        console.log(
            liste[i].id +
            " - " +
            liste[i].nomComplet +
            " - " +
            progression.progression +
            "% - " +
            progression.niveau
        );
    }
}



// 11. TABLEAU DE BORD


function afficherTableauDeBord() {

    console.log("\n===== TABLEAU DE BORD =====");

    console.log(
        "Nombre d'apprenants :",
        apprenants.length
    );


    // Calcul de la moyenne
    let sommeProgression = 0;

    for (let i = 0; i < apprenants.length; i++) {

        sommeProgression +=
            calculerProgression(apprenants[i]).progression;
    }

    let moyenneProgression = 0;

    if (apprenants.length > 0) {

        moyenneProgression = Math.round(
            sommeProgression / apprenants.length
        );
    }

    console.log(
        "Progression moyenne :",
        moyenneProgression + "%"
    );


    // Compter les niveaux
    let nombreSolide = 0;
    let nombreEnProgression = 0;
    let nombreARenforcer = 0;

    for (let i = 0; i < apprenants.length; i++) {

        let niveau =
            calculerProgression(apprenants[i]).niveau;

        if (niveau === "Solide") {

            nombreSolide++;

        } else if (niveau === "En progression") {

            nombreEnProgression++;

        } else {

            nombreARenforcer++;
        }
    }

    console.log("\n--- NIVEAUX ---");

    console.log("Solide :", nombreSolide);

    console.log(
        "En progression :",
        nombreEnProgression
    );

    console.log(
        "À renforcer :",
        nombreARenforcer
    );


    // Liste triée
    console.log("\n--- APPRENANTS ---");

    let liste = trierParProgression();

    for (let i = 0; i < liste.length; i++) {

        let progression =
            calculerProgression(liste[i]);

        let joursManquants =
            7 - progression.journeesRenseignees;

        console.log(
            liste[i].nomComplet +
            " - " +
            progression.progression +
            "% - " +
            progression.niveau
        );

        console.log(
            "  Jours renseignés :",
            progression.journeesRenseignees
        );

        console.log(
            "  Jours manquants :",
            joursManquants
        );

        console.log(
            "  Challenges terminés :",
            progression.challengesTermines
        );
    }
}



// READLINE


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// MENU


function menu() {

    console.log("\n==============================");
    console.log("     SAS PROGRESS CONSOLE");
    console.log("==============================");

    console.log("1. Afficher le tableau de bord");
    console.log("2. Afficher la liste des apprenants");
    console.log("3. Ajouter un apprenant");
    console.log("4. Consulter un apprenant par identifiant");
    console.log("5. Ajouter ou modifier un résultat");
    console.log("6. Rechercher un apprenant par nom");
    console.log("7. Filtrer les apprenants par niveau");
    console.log("8. Trier par progression décroissante");
    console.log("9. Trier par ordre alphabétique");
    console.log("0. Quitter");


    rl.question("\nChoix : ", function(choix) {


        // CHOIX 1
    
        if (choix === "1") {

            afficherTableauDeBord();

            menu();
        }


        // CHOIX 2
       

        else if (choix === "2") {

            console.log("\n--- LISTE DES APPRENANTS ---");

            afficherListe(apprenants);

            menu();
        }


      
        // CHOIX 3
       

        else if (choix === "3") {

            rl.question("ID : ", function(id) {

                rl.question("Nom complet : ", function(nomComplet) {

                    rl.question("Ville : ", function(ville) {

                        id = Number(id);

                        if (isNaN(id)) {

                            console.log("ID invalide.");

                            menu();

                            return;
                        }

                        if (
                            ajouterApprenant(
                                id,
                                nomComplet,
                                ville
                            )
                        ) {

                            console.log(
                                "Apprenant ajouté avec succès.(〃￣︶￣)人(￣︶￣〃)"
                            );

                        } else {

                            console.log(
                                "Erreur : cet ID existe déjà.(┬┬﹏┬┬)"
                            );
                        }

                        menu();
                    });
                });
            });
        }


       
        // CHOIX 4
     

        else if (choix === "4") {

            rl.question("ID : ", function(id) {

                id = Number(id);

                let trouve = false;

                for (let i = 0; i < apprenants.length; i++) {

                    if (apprenants[i].id === id) {

                        trouve = true;

                        let progression =
                            calculerProgression(
                                apprenants[i]
                            );

                        console.log(
                            "\n--- APPRENANT ---"
                        );

                        console.log(
                            "ID :",
                            apprenants[i].id
                        );

                        console.log(
                            "Nom :",
                            apprenants[i].nomComplet
                        );

                        console.log(
                            "Ville :",
                            apprenants[i].ville
                        );

                        console.log(
                            "Exercices terminés :",
                            progression.exercicesTermines
                        );

                        console.log(
                            "Total exercices :",
                            progression.totalExercices
                        );

                        console.log(
                            "Progression :",
                            progression.progression + "%"
                        );

                        console.log(
                            "Challenges terminés :",
                            progression.challengesTermines
                        );

                        console.log(
                            "Journées renseignées :",
                            progression.journeesRenseignees
                        );

                        console.log(
                            "Niveau :",
                            progression.niveau
                        );
                    }
                }

                if (!trouve) {

                    console.log(
                        "Apprenant introuvable."
                    );
                }

                menu();
            });
        }


      
        // CHOIX 5
       

        else if (choix === "5") {

            rl.question("ID : ", function(id) {

                rl.question("Jour (1-7) : ", function(jour) {

                    rl.question(
                        "Exercices terminés : ",
                        function(exercicesTermines) {

                            rl.question(
                                "Total exercices : ",
                                function(totalExercices) {

                                    rl.question(
                                        "Challenge ? true/false : ",
                                        function(challenge) {

                                            id = Number(id);

                                            jour = Number(jour);

                                            exercicesTermines =
                                                Number(
                                                    exercicesTermines
                                                );

                                            totalExercices =
                                                Number(
                                                    totalExercices
                                                );

                                            challenge =
                                                challenge
                                                    .toLowerCase()
                                                    === "true";


                                            if (
                                                enregistrerResultat(
                                                    id,
                                                    jour,
                                                    exercicesTermines,
                                                    totalExercices,
                                                    challenge
                                                )
                                            ) {

                                                console.log(
                                                    "Résultat enregistré avec succès."
                                                );

                                            } else {

                                                console.log(
                                                    "Erreur : données invalides."
                                                );
                                            }

                                            menu();
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });
        }


      
        // CHOIX 6
    

        else if (choix === "6") {

            rl.question(
                "Nom à rechercher : ",
                function(nom) {

                    let resultat =
                        rechercherApprenant(nom);

                    console.log(
                        "\n--- RESULTAT DE RECHERCHE ---"
                    );

                    afficherListe(resultat);

                    menu();
                }
            );
        }


        // CHOIX 7
     

        else if (choix === "7") {

            rl.question(
                "Niveau (Solide / En progression / À renforcer) : ",
                function(niveau) {

                    let resultat =
                        filtrerParNiveau(niveau);

                    console.log(
                        "\n--- RESULTAT ---"
                    );

                    afficherListe(resultat);

                    menu();
                }
            );
        }


      
        // CHOIX 8
      

        else if (choix === "8") {

            console.log(
                "\n--- TRI PAR PROGRESSION ---"
            );

            afficherListe(
                trierParProgression()
            );

            menu();
        }


        // CHOIX 9
      

        else if (choix === "9") {

            console.log(
                "\n--- TRI PAR NOM ---"
            );

            afficherListe(
                trierParNom()
            );

            menu();
        }


       
        // CHOIX 0
      

        else if (choix === "0") {

            console.log(
                "\nAu revoir !"
            );

            rl.close();
        }
        // CHOIX INVALIDE
       

        else {

            console.log(
                "Choix invalide."
            );

            menu();
        }
    });
}

// DEMARRER LE PROGRAMME


menu();