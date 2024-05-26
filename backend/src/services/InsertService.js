const sequelize = require('../../config/database');
const Rue = require('../Rues/RueModel');
const Arret = require('../Arrêts/ArretModel');

const insertData = async () => {
  const transaction = await sequelize.transaction();
  try {
    const rues = [
        'Croix-Baragnon', 'La Défense', 'Esplanade de la Défense', 'Pont de Neuilly', 'Les Sablons', 'Porte Maillot',
        'Argentine', 'Charles de Gaulle-Étoile', 'George V', 'Franklin D. Roosevelt', 'Champs-Élysées-Clemenceau',
        'Concorde', 'Tuileries', 'Palais Royal-Musée du Louvre', 'Louvre-Rivoli', 'Châtelet', 'Hôtel de Ville', 
        'Saint-Paul', 'Bastille', 'Gare de Lyon', 'Reuilly-Diderot', 'Nation', 'Porte de Vincennes', 'Saint-Mandé',
        'Bérault', 'Château de Vincennes', 'Rue des Arts', 'Porte Dauphine', 'Victor Hugo', 'Ternes', 'Courcelles',
        'Monceau', 'Villiers', 'Rome', 'Place de Clichy', 'Blanche', 'Pigalle', 'Anvers', 'Barbès-Rochechouart',
        'La Chapelle', 'Stalingrad', 'Jaurès', 'Colonel Fabien', 'Belleville', 'Couronnes', 'Ménilmontant', 'Père Lachaise',
        'Philippe Auguste', 'Alexandre Dumas', 'Avron', 'Rue Pargaminières', 'Pont de Levallois-Bécon', 'Anatole France',
        'Louise Michel', 'Porte de Champerret', 'Pereire', 'Wagram', 'Malesherbes', 'Europe', 'Saint-Lazare',
        'Havre-Caumartin', 'Opéra', 'Quatre-Septembre', 'Bourse', 'Sentier', 'Réaumur-Sébastopol', 'Arts et Métiers',
        'Temple', 'République', 'Parmentier', 'Rue Saint-Maur', 'Gambetta', 'Porte de Bagnolet', 'Gallieni', 'Place des Fêtes',
        'Pré Saint-Gervais', 'Porte de Clignancourt', 'Simplon', 'Marcadet-Poissonniers', 'Château Rouge', 'Gare du Nord',
        'Gare de l\'Est', 'Château d\'Eau', 'Strasbourg-Saint-Denis', 'Etienne Marcel', 'Les Halles', 'Cité',
        'Saint-Michel-Notre-Dame', 'Odéon', 'Saint-Germain-des-Prés', 'Saint-Sulpice', 'Saint-Placide', 'Montparnasse-Bienvenüe',
        'Vavin', 'Raspail', 'Denfert-Rochereau', 'Mouton-Duvernet', 'Alésia', 'Porte d\'Orléans', 'Rue de la Fonderie',
        'Bobigny-Pablo Picasso', 'Bobigny-Pantin-Raymond Queneau', 'Église de Pantin', 'Hoche', 'Porte de Pantin', 'Ourcq',
        'Laumière', 'Jaurès', 'Gare Saint-Denis', 'Théâtre Gérard Philipe', 'Marché de Saint-Denis', 'Basilique de Saint-Denis',
        'Cimetière de Saint-Denis', 'Hôpital Delafontaine', 'Cosmonautes', 'La Courneuve-8 Mai 1945', 'Maurice Lachâtre',
        'Drancy-Avenir', 'Hôpital Avicenne', 'Gaston Roulaud', 'Escadrille Normandie-Niémen', 'La Ferme', 'Libération',
        'Hôtel de Ville de Bobigny', 'Jean Rostand', 'Auguste Delaune', 'Pont de Bondy', 'Petit Noisy', 'Noisy-le-Sec',
        'Quai de la Daurade', 'Puteaux', 'Belvédère', 'Suresnes-Longchamp', 'Les Coteaux', 'Les Milons', 'Parc de Saint-Cloud',
        'Musée de Sèvres', 'Brimborion', 'Meudon-sur-Seine', 'Les Moulineaux', 'Jacques-Henri Lartigue', 'Issy-Val de Seine',
        'Balard', 'Desnouettes', 'Porte de Versailles', 'Georges Brassens', 'Brancion', 'Didot', 'Jean Moulin', 'Montsouris',
        'Cité universitaire'
      ];

      const arrets = [
        { nom: 'Porte d’Ivry', rue: 'Croix-Baragnon' },
        { nom: 'Jussieu', rue: 'Rue Genty-Magre' },
        { nom: 'Place des Fêtes', rue: 'Pont de Neuilly' },
        { nom: 'Télégraphe', rue: 'Les Sablons' },
        { nom: 'Porte des Lilas', rue: 'Porte Maillot' },
        { nom: 'Victor Hugo', rue: 'Charles de Gaulle-Étoile' },
        { nom: 'Ternes', rue: 'Courcelles' },
        { nom: 'Monceau', rue: 'Villiers' },
        { nom: 'Rome', rue: 'Place de Clichy' },
        { nom: 'Blanche', rue: 'Pigalle' },
        { nom: 'Anvers', rue: 'Barbès-Rochechouart' },
        { nom: 'La Chapelle', rue: 'Stalingrad' },
        { nom: 'Colonel Fabien', rue: 'Belleville' },
        { nom: 'Couronnes', rue: 'Ménilmontant' },
        { nom: 'Père Lachaise', rue: 'Philippe Auguste' },
        { nom: 'Alexandre Dumas', rue: 'Avron' },
        { nom: 'Porte de Champerret', rue: 'Pereire' },
        { nom: 'Wagram', rue: 'Malesherbes' },
        { nom: 'Malesherbes', rue: 'Villiers' },
        { nom: 'Europe', rue: 'Saint-Lazare' },
        { nom: 'Havre-Caumartin', rue: 'Madeleine' },
        { nom: 'Opéra', rue: 'Quatre-Septembre' },
        { nom: 'Bourse', rue: 'Sentier' },
        { nom: 'Réaumur-Sébastopol', rue: 'Arts et Métiers' },
        { nom: 'Temple', rue: 'République' },
        { nom: 'Saint-Antoine du T', rue: 'Porte de Clignancourt' },
        { nom: 'Simplon', rue: 'Marcadet-Poissonniers' },
        { nom: 'Château Rouge', rue: 'Barbès-Rochechouart' },
        { nom: 'Châtelet', rue: 'Rue des Filatiers' },
        { nom: 'Place d\'Italie', rue: 'Rue Saint-Rome' },
        { nom: 'Saint-Germain-des-Prés', rue: 'Rue Saint-Rome' },
        { nom: 'Pont de Levallois-Bécon', rue: 'Rue Pargaminières' },
        { nom: 'Bobigny-Picasso', rue: 'Rue Pargaminières' },
        { nom: 'Boulogne-Pont de Saint-Cloud', rue: 'Rue Vélane' },
        { nom: 'Saint-Michel-Notre-Dame', rue: 'Luxembourg' },
        { nom: 'Pont Neuf', rue: 'Châtelet' },
        { nom: 'Odéon', rue: 'Saint-Germain-des-Prés' },
        { nom: 'La Motte-Picquet-Grenelle', rue: 'Cambronne' },
        { nom: 'Cambronne', rue: 'Sèvres-Lecourbe' },
        { nom: 'Place d\'Italie', rue: 'Nationale' },
        { nom: 'Chevaleret', rue: 'Quai de la Gare' },
        { nom: 'Bercy', rue: 'Dugommier' },
        { nom: 'Daumesnil', rue: 'Michel Bizot' },
        { nom: 'Porte Dorée', rue: 'Porte de Charenton' },
        { nom: 'Porte de Charenton', rue: 'Liberté' },
        { nom: 'Cité Universitaire', rue: 'Denfert-Rochereau' },
        { nom: 'Mouton-Duvernet', rue: 'Denfert-Rochereau' },
        { nom: 'Alésia', rue: 'Porte d\'Orléans' },
        { nom: 'Vavin', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Edgar Quinet', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Raspail', rue: 'Denfert-Rochereau' },
        { nom: 'Saint-Jacques', rue: 'Denfert-Rochereau' },
        { nom: 'Glacière', rue: 'Denfert-Rochereau' },
        { nom: 'Place Monge', rue: 'Jussieu' },
        { nom: 'Censier-Daubenton', rue: 'Jussieu' },
        { nom: 'Les Gobelins', rue: 'Place d\'Italie' },
        { nom: 'Tolbiac', rue: 'Place d\'Italie' },
        { nom: 'Maison Blanche', rue: 'Place d\'Italie' },
        { nom: 'Porte de Choisy', rue: 'Place d\'Italie' },
        { nom: 'Pierre et Marie Curie', rue: 'Porte d\'Ivry' },
        { nom: 'Mairie d\'Ivry', rue: 'Porte d\'Ivry' },
        { nom: 'Porte de Montreuil', rue: 'Nation' },
        { nom: 'Nation', rue: 'Avron' },
        { nom: 'Philippe Auguste', rue: 'Père Lachaise' },
        { nom: 'Ménilmontant', rue: 'Couronnes' },
        { nom: 'Père Lachaise', rue: 'Gambetta' },
        { nom: 'Gambetta', rue: 'Rue Saint-Maur' },
        { nom: 'Gare de Lyon', rue: 'Bastille' },
        { nom: 'Bastille', rue: 'Saint-Paul' },
        { nom: 'Rue du Bac', rue: 'Sèvres-Babylone' },
        { nom: 'Rennes', rue: 'Sèvres-Babylone' },
        { nom: 'Notre-Dame-des-Champs', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Pl. Charles de Gaulle', rue: 'Av des Champs-Élysées' },
        { nom: 'Pasteur', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Vaugirard', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Volontaires', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Falguière', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Convention', rue: 'Montparnasse-Bienvenüe' },
        { nom: 'Porte de Versailles', rue: 'Corentin Celton' },
        { nom: 'Mairie d\'Issy', rue: 'Corentin Celton' },
        { nom: 'Cour Saint-Émilion', rue: 'Bercy' },
        { nom: 'Bibliothèque François Mitterrand', rue: 'Bercy' },
        { nom: 'Olympiades', rue: 'Bercy' },
        { nom: 'Cité', rue: 'Châtelet' },
        { nom: 'Palais Royal-Musée du Louvre', rue: 'Louvre-Rivoli' },
        { nom: 'Grands Boulevards', rue: 'Bonne Nouvelle' },
        { nom: 'Bonne Nouvelle', rue: 'Strasbourg-Saint-Denis' },
        { nom: 'Strasbourg-Saint-Denis', rue: 'République' },
        { nom: 'République', rue: 'Oberkampf' },
        { nom: 'Oberkampf', rue: 'Richard-Lenoir' },
        { nom: 'Richard-Lenoir', rue: 'Bréguet-Sabin' },
        { nom: 'Bréguet-Sabin', rue: 'Chemin Vert' },
        { nom: 'Chemin Vert', rue: 'Bastille' },
        { nom: 'Bastille', rue: 'Ledru-Rollin' },
        { nom: 'Ledru-Rollin', rue: 'Faidherbe-Chaligny' },
        { nom: 'Faidherbe-Chaligny', rue: 'Reuilly-Diderot' },
        { nom: 'Reuilly-Diderot', rue: 'Montgallet' },
        { nom: 'Montgallet', rue: 'Daumesnil' },
        { nom: 'Daumesnil', rue: 'Michel Bizot' },
        { nom: 'Porte Dorée', rue: 'Porte de Charenton' },
        { nom: 'Liberté', rue: 'Charenton-Écoles' },
        { nom: 'Volontaires', rue: 'Vaugirard' },
        { nom: 'Convention', rue: 'Corentin Celton' },
        { nom: 'Mairie d\'Issy', rue: 'Rue Mage' },
        { nom: 'Saint-Denis-Université', rue: 'Basilique de Saint-Denis' },
        { nom: 'Saint-Denis-Porte de Paris', rue: 'Carrefour Pleyel' },
        { nom: 'Mairie de Saint-Ouen', rue: 'Garibaldi' },
        { nom: 'Porte de Saint-Ouen', rue: 'Guy Môquet' },
        { nom: 'La Fourche', rue: 'Place de Clichy' },
        { nom: 'Liège', rue: 'Saint-Lazare' },
        { nom: 'Invalides', rue: 'Varenne' },
        { nom: 'Saint-François-Xavier', rue: 'Duroc' },
        { nom: 'Gaîté', rue: 'Pernety' },
        { nom: 'Pernety', rue: 'Plaisance' },
        { nom: 'Porte de Vanves', rue: 'Malakoff-Plateau de Vanves' },
        { nom: 'Malakoff-Rue Etienne Dolet', rue: 'Châtillon-Montrouge' },
        { nom: 'Chatillon-Montrouge', rue: 'Saint-Denis-Université' },
        { nom: 'Saint-Denis-Université', rue: 'Basilique de Saint-Denis' },
        { nom: 'Basilique de Saint-Denis', rue: 'Théâtre Gérard Philipe' }
      ];

    for (const rueNom of rues) {
      await Rue.create({ nom: rueNom }, { transaction });
    }

    for (const arret of arrets) {
      const rue = await Rue.findOne({ where: { nom: arret.rue }, transaction });
      if (rue) {
        await Arret.create({ nom: arret.nom, rueId: rue.id }, { transaction });
      } else {
        console.log(`Rue non trouvée pour l'arrêt: ${arret.nom}`);
      }
    }

    await transaction.commit();
    console.log("Insertion des données réussie.");
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur lors de l'insertion des données :", error);
  }
};

module.exports = insertData;