document.addEventListener("DOMContentLoaded", () => {
    /*
    // Fonction pour charger les données depuis le backend
    async function fetchClientsData(employeeId) {
        // Code pour récupérer les données depuis le backend (à remplacer avec votre logique)
        // Exemple avec fetch :
        try {
            const response = await fetch(`URL_DU_BACKEND/employees/${employeeId}/clients`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
            return [];
        }
    }
    */
    const clientsData = [
        { id: 1, nom: "Client 1", email: "client1@example.com", interventions: ["2023-12-03", "2025-12-25"] },
        { id: 2, nom: "Client 2", email: "client2@example.com" },
        { id: 3, nom: "Client 3", email: "client3@example.com" },
    ]

    // Variable globale pour stocker l'ID du client actuel
    let currentClientId = null;

    /*
        // Fonction pour obtenir la date actuelle au format "YYYY-MM-DD"
        function getCurrentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        */


    // Fonction pour créer un élément li pour une intervention
    function createInterventionItem(interventionDate, interventionsList) {
        const newInterventionItem = document.createElement("li");

        // Créer un conteneur pour la date et le bouton de suppression
        const interventionContainer = document.createElement("div");
        interventionContainer.classList.add("flex", "items-center");

        // Ajouter la date
        const dateSpan = document.createElement("span");
        dateSpan.textContent = interventionDate;
        interventionContainer.appendChild(dateSpan);

        // Ajouter le bouton de suppression
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("bg-red-500", "text-white", "px-2", "py-1", "rounded", "ml-2", "cursor-pointer");

        // Ajouter un événement au clic sur le bouton de suppression
        deleteButton.addEventListener("click", () => {
            // Supprimer l'élément li parent de la liste
            interventionsList.removeChild(interventionContainer.parentElement);
        });

        interventionContainer.appendChild(deleteButton);
        newInterventionItem.appendChild(interventionContainer);


        return newInterventionItem;
    }

    // Fonction pour trier les dates par ordre ascendant
    function sortDates(interventionsList) {
        const dates = Array.from(interventionsList.children)
            .map((dateContainer) => dateContainer.querySelector("span").textContent);

        // Trier les dates par ordre ascendant
        dates.sort();

        // Vider la liste actuelle des interventions
        while (interventionsList.firstChild) {
            interventionsList.removeChild(interventionsList.firstChild);
        }

        // Réajouter les dates triées à la liste
        dates.forEach((date, index) => {
            const interventionItem = createInterventionItem(date, interventionsList);
            interventionsList.appendChild(interventionItem);

        });
    }

    // Fonction pour ajouter les données de dates initiales au formulaire
    function addInitialDatesToForm(initialDates, interventionsList) {
        if (initialDates && initialDates.length > 0) {
            // Trier les dates par ordre ascendant
            initialDates.sort();

            initialDates.forEach((date) => {
                const interventionItem = createInterventionItem(date, interventionsList);
                interventionsList.appendChild(interventionItem);
            });
        }
    }

    // Fonction pour ajouter une ligne au tableau des clients
    function addClientRow(client) {
        const tableBody = document.querySelector("#clientsTable tbody");
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = client.id;
        row.appendChild(idCell);


        const nomCell = document.createElement("td");
        nomCell.textContent = client.nom;
        row.appendChild(nomCell);

        /* const emailCell = document.createElement("td");
         emailCell.textContent = client.email;
         row.appendChild(emailCell);*/

        // Ajouter une colonne avec les interventions existantes et le formulaire pour ajouter de nouvelles interventions
        const interventionCell = document.createElement("td");

        // Créer le formulaire pour ajouter de nouvelles interventions
        const interventionForm = document.createElement("form");
        const dateInput = document.createElement("input");
        dateInput.setAttribute("type", "date");
        dateInput.classList.add("mr-2");
        const addButton = document.createElement("button");
        addButton.textContent = "+";
        addButton.classList.add("bg-blue-500", "text-white", "px-2", "py-1", "rounded", "cursor-pointer");
        // Désactiver à nouveau le bouton "Ajouter"
        addButton.setAttribute("hidden", true);
        dateInput.addEventListener("input", () => {
            // Activer le bouton "Ajouter" uniquement si le champ de saisie n'est pas vide
            addButton.hidden = !dateInput.value;
        });

        // Créer une liste pour afficher les interventions
        const interventionsList = document.createElement("ul");

        // Ajouter les données de dates initiales au formulaire
        addInitialDatesToForm(client.interventions, interventionsList);

        // Ajouter un événement au clic sur le bouton "Ajouter"
        addButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Vous pouvez ajouter ici la logique pour gérer l'ajout de dates d'intervention
            const interventionDate = dateInput.value;


            if (interventionDate) {
                // Récupérer l'ID du client actuel au moment de l'ajout de la date
                currentClientId = client.id;
                //console.log(currentClientId);
                if (!isDateAlreadyExists(currentClientId, interventionDate)) {
                    // Ajouter la nouvelle intervention à la liste
                    const newInterventionItem = createInterventionItem(interventionDate, interventionsList);
                    interventionsList.appendChild(newInterventionItem);

                    // Trier les dates par ordre ascendant
                    sortDates(interventionsList);

                    // Réinitialiser la date en input sur la date actuelle
                    dateInput.value = "";
                    addButton.hidden = !dateInput.value;
                }
                else {
                    alert("la date existe déjà");
                }

            }
        });

        interventionForm.appendChild(dateInput);
        interventionForm.appendChild(addButton);

        // Ajouter la liste d'interventions au formulaire
        interventionForm.appendChild(interventionsList);

        interventionCell.appendChild(interventionForm);
        row.appendChild(interventionCell);

        tableBody.appendChild(row);
    }

    // Fonction pour ajouter une ligne de validation au tableau des clients
    function addValidationRow() {
        const tableBody = document.querySelector("#clientsTable tbody");
        const row = document.createElement("tr");

        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 3; // Fusionner les trois premières colonnes pour créer une cellule vide
        row.appendChild(emptyCell);

        const validationCell = document.createElement("td");
        const validateButton = document.createElement("button");
        validateButton.textContent = "Valider";
        validateButton.classList.add("bg-green-500", "text-white", "px-2", "py-1", "rounded", "cursor-pointer");

        // Ajouter un événement au clic sur le bouton "Valider"
        validateButton.addEventListener("click", () => {
            // Logique de validation, par exemple envoyer les données au backend
            console.log("Données validées :", getClientData());
        });

        validationCell.appendChild(validateButton);
        row.appendChild(validationCell);

        tableBody.appendChild(row);
    }

    // Fonction pour récupérer les données du tableau des clients
    function getClientData() {
        const tableRows = document.querySelectorAll("#clientsTable tbody tr");
        const clientsData = [];

        tableRows.forEach((row) => {
            const idCell = row.querySelector("td:nth-child(1)");
            const nomCell = row.querySelector("td:nth-child(2)");
            // Récupérer les interventions de la liste
            const interventionsList = row.querySelector("td form ul");

            if (idCell && nomCell && interventionsList) {
                const id = idCell.textContent;
                const nom = nomCell.textContent;

                // Récupérer les interventions de la liste
                const interventions = Array.from(interventionsList.children)
                    .map((interventionContainer) => interventionContainer.querySelector("span").textContent);

                clientsData.push({
                    id: id,
                    nom: nom,
                    interventions: interventions,
                });
            }
        });

        return JSON.stringify(clientsData);
    }


    // Fonction pour vérifier si une date existe déjà pour un client
    function isDateAlreadyExists(clientId, newDate) {

        const tableRows = document.querySelectorAll("#clientsTable tbody tr");


        for (const row of tableRows) {
            const idCell = row.querySelector("td:nth-child(1)");
            const interventionsList = row.querySelector("td form ul");

            if (idCell && interventionsList) {
                const id = parseInt(idCell.textContent);

                if (id === clientId) {

                    // Récupérer les dates existantes
                    const existingDates = Array.from(interventionsList.children)
                        .map((interventionContainer) => interventionContainer.querySelector("span").textContent);
                    // Vérifier si la nouvelle date existe déjà
                    if (existingDates.includes(newDate)) {
                        return true; // La date existe déjà
                    }
                }
            }
        }

        return false; // La date n'existe pas encore
    }
    clientsData.forEach(addClientRow);
    addValidationRow();

    /*
    // Charger les données pour un employé spécifique (remplacez "EMPLOYEE_ID" par l'ID réel de l'employé)
    const employeeId = "EMPLOYEE_ID";
    fetchClientsData(employeeId)
        .then((clientsData) => {
            // Ajouter chaque client au tableau
            clientsData.forEach(addClientRow);

            // Ajouter la ligne de validation
            addValidationRow();
        });
    */
});

