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
    const today = new Date();
    const currentMonth = today.getMonth();

    // Tableau des noms de mois
    const currentMonthString = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const thisMonth = currentMonthString[currentMonth];

    console.log("Le mois courant est : " + thisMonth);

    const h1WithMonth = document.getElementById("h1WithMonth");
    h1WithMonth.innerHTML = ` ${h1WithMonth.innerHTML} concernant le mois de ${thisMonth} `

    const clientsData = [
        { id: 1, nom: "Client 1", email: "client1@example.com", interventions: ["2023-12-03", "2025-12-25"] },
        { id: 2, nom: "Client 2", email: "client2@example.com" },
        { id: 3, nom: "Client 3", email: "client3@example.com" },
    ]
    let signature = "";

    let sheetData = {};

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
        idCell.classList.add("text-center", "border");


        const nomCell = document.createElement("td");
        nomCell.textContent = client.nom;
        row.appendChild(nomCell);
        nomCell.classList.add("text-center", "border");

        /* const emailCell = document.createElement("td");
         emailCell.textContent = client.email;
         row.appendChild(emailCell);*/

        // Ajouter une colonne avec les interventions existantes et le formulaire pour ajouter de nouvelles interventions
        const interventionCell = document.createElement("td");
        interventionCell.classList.add("text-center", "border");


        // Créer le formulaire pour ajouter de nouvelles interventions
        // Définir la date minimale au début du mois précédent
        const firstDayOfPreviousMonth = new Date();
        firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth());
        firstDayOfPreviousMonth.setDate(1);
        const minDate = firstDayOfPreviousMonth.toISOString().slice(0, 10); // Format YYYY-MM-dd

        // Définir la date maximale au début du mois actuel
        const firstDayOfCurrentMonth = new Date();
        firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth() + 1);
        firstDayOfCurrentMonth.setDate(1);
        const maxDate = firstDayOfCurrentMonth.toISOString().slice(0, 10); // Format YYYY-MM-dd

        const interventionForm = document.createElement("form");

        const dateInput = document.createElement("input");
        dateInput.setAttribute("type", "date");
        dateInput.setAttribute("min", minDate);
        dateInput.setAttribute("max", maxDate);
        dateInput.classList.add("mr-2", "hidden");
        const addDateButton = document.createElement("button");
        addDateButton.textContent = "+";
        addDateButton.classList.add("bg-blue-500", "text-white", "px-2", "py-1", "rounded", "cursor-pointer");

        const validateButton = document.createElement("button");
        validateButton.textContent = "Valider l'Ajout";
        validateButton.classList.add("bg-blue-500", "text-white", "px-2", "py-1", "rounded", "cursor-pointer", "hidden");

        addDateButton.addEventListener("click", () => {
            // Cacher le bouton "Ajouter une date"
            addDateButton.classList.add("hidden");

            // Afficher l'input
            dateInput.classList.remove("hidden");

            // Désactiver le bouton "Ajouter une date" pour éviter de cliquer pendant que l'input est visible
            addDateButton.setAttribute("disabled", true);

        });

        dateInput.addEventListener("input", () => {
            // Activer le bouton "Ajouter" uniquement si le champ de saisie n'est pas vide
            validateButton.hidden = !dateInput.value;
            // Afficher le bouton "Valider"
            validateButton.classList.remove("hidden");
        });

        // Créer une liste pour afficher les interventions
        const interventionsList = document.createElement("ul");

        // Ajouter les données de dates initiales au formulaire
        addInitialDatesToForm(client.interventions, interventionsList);

        // Ajouter un événement au clic sur le bouton "Ajouter"
        validateButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Vous pouvez ajouter ici la logique pour gérer l'ajout de dates d'intervention
            const interventionDate = dateInput.value;
            dateInput.classList.add("hidden");
            // Afficher le bouton "Ajouter une date"
            addDateButton.classList.remove("hidden");

            // Cacher le bouton "Valider"
            validateButton.classList.add("hidden");

            // Réactiver le bouton "Ajouter une date"
            addDateButton.removeAttribute("disabled");

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
                    validateButton.hidden = !dateInput.value;
                }
                else {
                    alert("la date existe déjà");
                }

            }
        });

        interventionForm.appendChild(addDateButton);
        interventionForm.appendChild(dateInput);
        interventionForm.appendChild(validateButton);

        // Ajouter la liste d'interventions au formulaire
        interventionForm.appendChild(interventionsList);

        interventionCell.appendChild(interventionForm);
        row.appendChild(interventionCell);

        tableBody.appendChild(row);
    }

    /*  // Fonction pour ajouter une ligne de validation au tableau des clients
     function addValidationRow() {
         const tableBody = document.querySelector("#clientsTable tbody");
         const row = document.createElement("tr");
 
         const emptyCell = document.createElement("td");
         emptyCell.colSpan = 2; // Fusionner les trois premières colonnes pour créer une cellule vide
         row.appendChild(emptyCell);
 
         const validationCell = document.createElement("td");
         const validateButton = document.createElement("button");
         validateButton.textContent = "Sauvegarder";
         validateButton.classList.add("bg-green-500", "text-white", "px-2", "py-1", "rounded", "cursor-pointer");
 
         // Ajouter un événement au clic sur le bouton "Valider"
         validateButton.addEventListener("click", () => {
             // Logique de validation, par exemple envoyer les données au backend
             sign()
             console.log("Données validées :", getClientData());
         });
 
         validationCell.appendChild(validateButton);
         row.appendChild(validationCell);
 
         tableBody.appendChild(row);
     } */

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

                sheetData = {
                    month: thisMonth,
                    list: clientsData,
                    signature: signature
                }
            }
        });

        return JSON.stringify(sheetData);
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
    // addValidationRow();



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

    //SIGN SECTION

    console.log("start sign pad");
    const canvas = document.querySelector('canvas');
    const form = document.querySelector('.signature-pad-form');
    const clearButton = document.querySelector('.clear-button');

    const ctx = canvas.getContext('2d');

    let writingMode = false;

    const handlePointerDown = (event) => {
        writingMode = true;
        ctx.beginPath();
        const [positionX, positionY] = getCursorPosition(event);
        ctx.moveTo(positionX, positionY);
    }

    const handlePointerUp = () => {
        writingMode = false;
    }

    const handlePointerMove = (event) => {
        if (!writingMode) return
        const [positionX, positionY] = getCursorPosition(event);
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
    }

    const getCursorPosition = (event) => {
        positionX = event.clientX - event.target.getBoundingClientRect().x;
        positionY = event.clientY - event.target.getBoundingClientRect().y;
        return [positionX, positionY];
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
    canvas.addEventListener('pointerup', handlePointerUp, { passive: true });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });


    ctx.lineWidth = 3;
    ctx.lineJoin = ctx.lineCap = 'round';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const imageURL = canvas.toDataURL();
        const image = document.createElement('img');
        image.src = imageURL;
        image.height = canvas.height;
        image.width = canvas.width;
        image.style.display = 'block';
        form.appendChild(image);

        signature = imageURL
        sheetData = getClientData();
        console.log("Données validées :", sheetData);
        clearPad();
    })

    const clearPad = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    clearButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearPad();
    })


});

