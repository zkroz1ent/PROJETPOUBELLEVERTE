```mermaid
classDiagram
    class Utilisateur {
        -Integer id
        -String nom
        -String email
        -String hash_mot_de_passe
        -String role
        +register(req, res)
        +login(req, res)
        +profile(req, res)
        +getAllUtilisateurs(req, res)
        +getUtilisateurById(req, res)
        +createUtilisateur(req, res)
        +updateUtilisateur(req, res)
        +deleteUtilisateur(req, res)
    }

    class Cycliste {
        -String nom
        -String prenom
        -String email
        -String numero_telephone
        -String statut
        -Date date_embauche
        +getAllCyclistes(req, res)
        +createCycliste(req, res)
        +getCyclisteById(req, res)
        +assignTrajet(req, res)
        +updateCycliste(req, res)
        +deleteCycliste(req, res)
    }

    class Incident {
        -Integer id
        -String type
        -Text description
        -String etat
        +declareIncident(req, res)
        +resolveIncident(req, res)
        +getIncidentsEnCours(req, res)
        +handleIncident(incident)
        +notifyCyclistesAndRecalculate(trajet)
    }

    class Velo {
        -Integer id
        -Integer autonomie_restante
        -String statut
        +findVeloById(id)
        +getVeloStatus()
        +updateAutonomie(autonomie)
    }

    class Trajet {
        -Integer id
        -Integer depart
        -Integer arrivee
        -Integer cyclisteId
        -Integer veloId
        -String statut
        +calculateOptimalRoute(departId, arriveeId)
        +verifyAndRedirect(trajet)
        +assignCycliste(cyclisteId)
        +updateStatut(newStatut)
    }

    class Arret {
        -Integer id
        -String nom
        -String coordinates
        -Integer rueId
        +getDepartArret()
        +getArriveeArret()
        +addArret(arretId, options)
        +getCoordinates()
    }

    class Rue {
        -Integer id
        -String nom
        -String type
        +getAllRues()
        +addRue(rueData)
    }

    class Itineraire {
        +calculateOptimalRoute(departId, arriveeId)
        +verifyAndRedirect(trajet)
    }

    class Ramassage {
        -Integer id
        -Date date_ramassage
        -String statut
        +scheduleRamassage()
        +updateRamassageStatus()
        +assignTrajet(trajetId)
    }

    class Gestionnaire {
        +manageUserAccounts()
        +assignTasks()
        +generateReports()
        +assignRamassage()
    }

    class AuthMiddleware {
        +verifyToken(req, res, next)
        +authorizeRole(role)
    }

    class Graph {
        +addEdge(node1, node2, weight)
        +findShortestPath(startNode, endNode)
        -buildGraphFromArrets(arrets, rues)
    }

    class Dijkstra {
        +calculateShortestPath(graph, startNode, endNode)
    }

    Utilisateur <|-- Cycliste
    Utilisateur "1" -- "*" Velo : "Utilise"
    Utilisateur "1" -- "*" Incident : "Signale"
    Cycliste "1" -- "*" Trajet : "Assigné"
    Velo "1" -- "*" Incident : "Associe"
    Trajet "1" -- "1" Itineraire : "Calcul d'itinéraire"
    Itineraire "1" -- "*" Arret : "Comprend"
    Arret "*" -- "1" Rue : "Situé"
    Utilisateur "*" -- "1" Gestionnaire : "Géré"
    AuthMiddleware -- Utilisateur : "Authenticates"
    Gestionnaire "1" -- "*" Utilisateur : "Manage"
    Gestionnaire "1" -- "*" Ramassage : "Planifie"
    Trajet "*" -- "1" Ramassage : "Effectué par"

    %% Relations du calcul d'itinéraires
    Graph "1" -- "*" Arret : "Noeud"
    Itineraire "1" -- "1" Graph : "Utilise"
    Itineraire "1" -- "1" Dijkstra : "Utilise pour calculer"
