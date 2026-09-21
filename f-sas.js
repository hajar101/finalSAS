const readline = require("readline");


// 1. NORMALISER NOM

function normaliserNom(nom) {
    return nom.trim().replace(/\s+/g, " ").toLowerCase();
}


// 2. VALIDER RESULTAT

function validerResultat(jour, exercicesTermines, totalExercices, challengeTermine) {

    if (jour < 1 || jour > 7) {
        console.log("(┬┬﹏┬┬) le jour doit etre entre 1 et 7");
        return false;
    }

    if (exercicesTermines < 0 || totalExercices < 0) {
        console.log("(┬┬﹏┬┬) le nombre d'exercices ne peut pas être négatif.");
        return false;
    }

    if (exercicesTermines > totalExercices) {
        console.log("(┬┬﹏┬┬) les exercices terminés ne peuvent pas dépasser le total");
        return false;
    }

    if (typeof challengeTermine !== "boolean") {
        console.log("( •̀ .̫ •́ )✧ entrer true or false");
        return false;
    }

    return true;
}


// LISTE DES APPRENANTS

const apprenants = [];


// 3. AJOUTER APPRENANT

function ajouterApprenant(id, nomComplet, ville) {

    for (let i = 0; i < apprenants.length; i++) {

        if (apprenants[i].id === id) {
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


// 4. ENREGISTRER RESULTAT

function enregistrerResultat(
    id,
    jour,
    exercicesTermines,
    totalExercices,
    challengeTermine
) {

    if (!validerResultat(
        jour,
        exercicesTermines,
        totalExercices,
        challengeTermine
    )) {
        return false;
    }

    for (let i = 0; i < apprenants.length; i++) {

        if (apprenants[i].id === id) {

            for (let j = 0; j < apprenants[i].resultats.length; j++) {

                if (apprenants[i].resultats[j].jour === jour) {

                    apprenants[i].resultats[j].exercicesTermines =
                        exercicesTermines;

                    apprenants[i].resultats[j].totalExercices =
                        totalExercices;

                    apprenants[i].resultats[j].challengeTermine =
                        challengeTermine;

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


// 5. RECHERCHER APPRENANT

function rechercherApprenant(nom) {

    let resultat = [];

    for (let i = 0; i < apprenants.length; i++) {

        if ( apprenants[i].nomComplet.includes( nom.toLowerCase() )) {
            resultat.push(apprenants[i]);
        }
    }

    return resultat;
}


// 6. CALCULER PROGRESSION

function calculerProgression(apprenant) {

    let exercicesTermines = 0;
    let totalExercices = 0;
    let challengesTermines = 0;
    let journeesRenseignees = 0;

    for (let i = 0; i < apprenant.resultats.length; i++) {

        exercicesTermines += apprenant.resultats[i].exercicesTermines;

        totalExercices += apprenant.resultats[i].totalExercices;

        if (apprenant.resultats[i].challengeTermine) {
            challengesTermines++;
        }
           journeesRenseignees++;
    }

    let progression = 0;

    if (totalExercices > 0) {

        progression = Math.round( (exercicesTermines / totalExercices) * 100 );
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
            resultat.push(
                apprenants[i].nomComplet + " - " + progression.niveau
            );
        }
    }

    return resultat;
}


// 8. TRIER PAR PROGRESSION

function trierParProgression() {

    let resultat = apprenants.slice();

    resultat.sort(function(a, b) {

        return (
            calculerProgression(b).progression - calculerProgression(a).progression
        );
    });
    return resultat;
}


// 9. TRIER PAR NOM

function trierParNom() {

    let resultat = apprenants.slice();

    resultat.sort(function(a, b) {

        return a.nomComplet.localeCompare( b.nomComplet);
    });

    return resultat;
}


// 10. AFFICHER LISTE

function afficherListe(liste) {

    if (liste.length === 0) {

        console.log("Aucun apprenant trouvé.");

        return;
    }

    for (let i = 0; i < liste.length; i++) {

        let progression = calculerProgression(liste[i]);

        console.log( liste[i].id + " - " + liste[i].nomComplet + " - " + progression.progression + "%  - " +progression.niveau );
    }
}


// 11. TABLEAU DE BORD

function afficherTableauDeBord() {

    console.log("\n===== TABLEAU DE BORD =====");

    console.log("Nombre d'apprenants :",apprenants.length);

    let sommeProgression = 0;

    let nombreSolide = 0;
    let nombreEnProgression = 0;
    let nombreARenforcer = 0;

    for (let i = 0; i < apprenants.length; i++) {

        let progression = calculerProgression(apprenants[i]);

        sommeProgression += progression.progression;

        if (progression.niveau === "Solide") {

            nombreSolide++;

        } else if (progression.niveau === "En progression") {

            nombreEnProgression++;

        } else {

            nombreARenforcer++;
        }
    }

    let moyenneProgression = 0;

    if (apprenants.length > 0) {

        moyenneProgression = Math.round( sommeProgression / apprenants.length);
    }

    console.log( "Progression moyenne :", moyenneProgression + "%");

    console.log("\n--- NIVEAUX ---");

    console.log(
        "Solide :",
        nombreSolide
    );

    console.log(
        "En progression :",
        nombreEnProgression
    );

    console.log(
        "À renforcer :",
        nombreARenforcer
    );

    console.log("\n--- APPRENANTS ---");

    let liste = trierParProgression();

    for (let i = 0; i < liste.length; i++) {

        let progression = calculerProgression(liste[i]);

        let joursManquants = 7 - progression.journeesRenseignees;

        console.log( liste[i].nomComplet + " - " + progression.progression + "% - " + progression.niveau);

        console.log( "  Jours renseignés :", progression.journeesRenseignees);

        console.log("  Jours manquants :",joursManquants);

        console.log("  Challenges terminés :",progression.challengesTermines);
    }
}


// READLINE

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// 12. MENU

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
    switch (choix) {

        case "1":
            afficherTableauDeBord();
            menu();
            break;

        case "2":
            console.log("\n--- LISTE DES APPRENANTS ---");
            afficherListe(apprenants);
            menu();
            break;

        case "3":
            rl.question("ID : ", function(id) {
                rl.question("Nom complet : ", function(nomComplet) {
                    rl.question("Ville : ", function(ville) {

                        id = Number(id);

                        if (isNaN(id)) {
                            console.log("ID invalide.");
                            menu();
                            return;
                        }

                        if (ajouterApprenant(id, nomComplet, ville)) {
                            console.log("Apprenant ajouté avec succès.(〃￣︶￣)人(￣︶￣〃)");
                        } else {
                            console.log("Erreur : cet ID existe déjà.(┬┬﹏┬┬)");
                        }

                        menu();
                    });
                });
            });
            break;

        case "4":
            rl.question("ID : ", function(id) {
                id = Number(id);
                let trouve = false;

                for (let i = 0; i < apprenants.length; i++) {
                    if (apprenants[i].id === id) {
                        trouve = true;
                        let progression = calculerProgression(apprenants[i]);

                        console.log(
                            "\n--- APPRENANT ---\n" +
                            "ID : " + apprenants[i].id + "\n" +
                            "Nom : " + apprenants[i].nomComplet + "\n" +
                            "Ville : " + apprenants[i].ville + "\n" +
                            "Exercices terminés : " + progression.exercicesTermines + "\n" +
                            "Total exercices : " + progression.totalExercices + "\n" +
                            "Progression : " + progression.progression + "%\n" +
                            "Challenges terminés : " + progression.challengesTermines + "\n" +
                            "Journées renseignées : " + progression.journeesRenseignees + "\n" +
                            "Niveau : " + progression.niveau
                        );
                    }
                }

                if (!trouve) {
                    console.log("Apprenant introuvable.");
                }

                menu();
            });
            break;

        case "5":
            rl.question("ID : ", function(id) {
            rl.question("Jour (1-7) : ", function(jour) {
            rl.question("Exercices terminés : ", function(exercicesTermines) {
            rl.question("Total exercices : ", function(totalExercices) {
            rl.question("Challenge ? true/false : ", function(challenge) {

                                id = Number(id);
                                jour = Number(jour);
                                exercicesTermines = Number(exercicesTermines);
                                totalExercices = Number(totalExercices);
                                challenge = challenge.toLowerCase() === "true";

                                if (enregistrerResultat(
                                    id,
                                    jour,
                                    exercicesTermines,
                                    totalExercices,
                                    challenge
                                )) {
                                    console.log("Résultat enregistré avec succès.");
                                } else {
                                    console.log("Erreur : données invalides.");
                                }

                                menu();
                            });
                        });
                    });
                });
            });
            break;

        case "6":
            rl.question("Nom à rechercher : ", function(nom) {
                let resultat = rechercherApprenant(nom);
                console.log("\n--- RESULTAT DE RECHERCHE ---");
                afficherListe(resultat);
                menu();
            });
            break;

        case "7":
    console.log("\n--- FILTRE PAR NIVEAU ---");

    let niveaux = ["Solide", "En progression", "À renforcer"];

    for (let i = 0; i < niveaux.length; i++) {
        let resultatNiveau = filtrerParNiveau(niveaux[i]);

        for (let j = 0; j < resultatNiveau.length; j++) {
            console.log(resultatNiveau[j]);
        }
    }

    menu();
    break;

        case "8":
            console.log("\n--- TRI PAR PROGRESSION ---");
            afficherListe(trierParProgression());
            menu();
            break;

        case "9":
            console.log("\n--- TRI PAR NOM ---");
            afficherListe(trierParNom());
            menu();
            break;

        case "0":
            console.log("\nAu revoir !");
            rl.close();
            break;

        default:
            console.log("Choix invalide.");
            menu();
    }
});


// DEMARRER LE PROGRAMME
menu();
}
