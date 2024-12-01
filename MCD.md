```mermaid
erDiagram
    ARRETS {
        int PK_id
        varchar nom
        text coordinates
        int FK_rueId
        int quantite_dechets
        boolean desservable
        boolean attribuer
    }
    RUES {
        int PK_id
        varchar name
    }
    UTILISATEURS {
        int PK_id
        varchar nom
        varchar email
        varchar hash_mot_de_passe
        varchar role
    }
    CYCLISTES {
        int PK_id
        varchar nom
        varchar prenom
        varchar email
        varchar hash_mot_de_passe
        varchar telephone
        varchar statut
        int FK_id_user
    }
    VELOS {
        int PK_id
        varchar statut
        float derniere_position_lat
        float derniere_position_lon
        int autonomie_restante
    }
    INCIDENTS {
        int PK_id
        varchar type
        text description
        varchar etat
        datetime createdAt
        datetime updatedAt
        int FK_veloId
    }
    RAMASSAGES {
        int PK_id
        float distance
        float quantiteDechets
        datetime createdAt
        datetime updatedAt
    }
    TRAJETS {
        int PK_id
        datetime heure_debut
        datetime heure_fin_prevue
        datetime heure_fin_reelle
        int FK_depart
        int FK_arrivee
        varchar statut
        int FK_cyclisteId
        int FK_veloId
    }
    SETTINGS {
        int PK_id
        boolean modeActuelle
    }

    %% Relations
    ARRETS ||--o{ RUES : "est localisé sur"
    CYCLISTES }o--|| UTILISATEURS : "est associé à"
    TRAJETS }o--|| ARRETS : "départ depuis"
    TRAJETS }o--|| ARRETS : "arrive à"
    TRAJETS }o--|| CYCLISTES : "assigné à"
    TRAJETS }o--|| VELOS : "utilise"
    INCIDENTS }o--|| VELOS : "signalé sur"

