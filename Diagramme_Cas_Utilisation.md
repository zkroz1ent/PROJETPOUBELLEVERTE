%% Début du fichier Mermaid
```mermaid
graph TD
    gestionnaire["Gestionnaire"]
    cycliste["Cycliste"]
    utilisateur["Utilisateur"]
    administrateur["Administrateur"]

    subgraph "Actions Utilisateur"
        createAccount["Créer un compte"]
        login["Se connecter"]
        viewProfile["Consulter profil"]
    end

    subgraph "Actions Gestionnaire"
        manageUsers["Gérer utilisateurs"]
        schedulePickup["Planifier un ramassage"]
        updatePickupStatus["Mettre à jour statut ramassage"]
        manageTrips["Gérer trajets"]
        viewOngoingIncidents["Consulter incidents en cours"]
        generateReports["Générer rapports"]
        manageBikes["Gérer vélos"]
    end

    subgraph "Actions Cycliste"
        reportIncident["Déclarer un incident"]
        viewTrips["Consulter trajets"]
        calculateRoute["Calculer itinéraire optimal"]
        checkBikeBattery["Vérifier autonomie vélo"]
        assignTrip["Assigner un trajet"]
    end

    subgraph "Actions Administrateur"
        resolveIncident["Résoudre un incident"]
        manageIncidents["Gérer incidents"]
    end

    utilisateur --> createAccount
    utilisateur --> login
    utilisateur --> viewProfile

    gestionnaire --> manageUsers
    gestionnaire --> schedulePickup
    gestionnaire --> updatePickupStatus
    gestionnaire --> manageTrips
    gestionnaire --> viewOngoingIncidents
    gestionnaire --> generateReports
    gestionnaire --> manageBikes

    cycliste --> reportIncident
    cycliste --> viewTrips
    cycliste --> calculateRoute
    cycliste --> checkBikeBattery
    cycliste --> assignTrip

    administrateur --> manageUsers
    administrateur --> resolveIncident
    administrateur --> viewOngoingIncidents
    administrateur --> manageIncidents
    administrateur --> manageBikes
    administrateur --> generateReports

    %% Interactions supplémentaires sans descriptions
    schedulePickup --> updatePickupStatus
    reportIncident --> resolveIncident
    manageTrips --> assignTrip
