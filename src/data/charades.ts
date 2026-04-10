import type { Charade } from "@/types";
import { dayOfYearFromDateKey, getDayOfYear } from "@/lib/date";

const BASE_CHARADES: readonly Charade[] = [
  { clue: "Sans moi, le jour resterait sombre et froid. Qui suis-je ?", answer: "soleil" },
  { clue: "Je veille la nuit et mon visage change chaque semaine. Qui suis-je ?", answer: "lune" },
  { clue: "Nous sommes nombreuses dans le ciel, mais chacune semble minuscule. Qui suis-je ?", answer: "etoile" },
  { clue: "Je voyage dans le ciel, parfois blanc, parfois gris. Qui suis-je ?", answer: "nuage" },
  { clue: "Je tombe sans casser, et les parapluies se deploient. Qui suis-je ?", answer: "pluie" },
  { clue: "Je tombe en silence et je transforme la ville en paysage blanc. Qui suis-je ?", answer: "neige" },
  { clue: "Invisible, je fais bouger les feuilles et les rideaux. Qui suis-je ?", answer: "vent" },
  { clue: "Je suis immense, salee, et mes vagues vont et viennent. Qui suis-je ?", answer: "mer" },
  { clue: "Je nais en amont et je termine souvent ma route plus loin. Qui suis-je ?", answer: "riviere" },
  { clue: "Plus on me monte, plus l'air devient frais. Qui suis-je ?", answer: "montagne" },
  { clue: "Je cache bien des chemins, sous mes arbres et mes ombres. Qui suis-je ?", answer: "foret" },
  { clue: "Je peux offrir un parfum, une couleur, ou les deux. Qui suis-je ?", answer: "fleur" },
  { clue: "Je reste debout des annees, avec un tronc et des branches. Qui suis-je ?", answer: "arbre" },
  { clue: "On m'entretient avec soin pour y voir pousser fleurs et legumes. Qui suis-je ?", answer: "jardin" },
  { clue: "J'abrite la vie quotidienne, du petit-dejeuner au coucher. Qui suis-je ?", answer: "maison" },
  { clue: "On y prepare les recettes et parfois les souvenirs d'enfance. Qui suis-je ?", answer: "cuisine" },
  { clue: "C'est souvent la piece des conversations et du repos. Qui suis-je ?", answer: "salon" },
  { clue: "On y cherche le calme, surtout quand la journee est finie. Qui suis-je ?", answer: "chambre" },
  { clue: "On se retrouve autour de moi pour les repas en famille. Qui suis-je ?", answer: "table" },
  { clue: "Je ne marche pas, mais je soutiens ceux qui s'assoient. Qui suis-je ?", answer: "chaise" },
  { clue: "Quand la nuit tombe, je rends la piece plus claire. Qui suis-je ?", answer: "lampe" },
  { clue: "Je rythme la maison, minute apres minute. Qui suis-je ?", answer: "horloge" },
  { clue: "Je peux faire voyager sans bouger de son fauteuil. Qui suis-je ?", answer: "livre" },
  { clue: "On me lit pour savoir ce qui s'est passe hier. Qui suis-je ?", answer: "journal" },
  { clue: "Je laisse une trace sur le papier quand on me tient bien. Qui suis-je ?", answer: "stylo" },
  { clue: "Je rends plus net ce qui semblait flou. Qui suis-je ?", answer: "lunettes" },
  { clue: "Attachee au poignet, je rappelle l'heure des rendez-vous. Qui suis-je ?", answer: "montre" },
  { clue: "Je rapproche les voix, meme quand les personnes sont loin. Qui suis-je ?", answer: "telephone" },
  { clue: "On m'ecoute pour les infos, la musique et la compagnie. Qui suis-je ?", answer: "radio" },
  { clue: "Je raconte des histoires en images, directement au salon. Qui suis-je ?", answer: "television" },
  { clue: "Je facilite les deplacements, surtout sur quatre roues. Qui suis-je ?", answer: "voiture" },
  { clue: "Je roule a la force des jambes, souvent en plein air. Qui suis-je ?", answer: "velo" },
  { clue: "Je file sur les rails d'une gare a l'autre. Qui suis-je ?", answer: "train" },
  { clue: "Je traverse le ciel pour relier des villes lointaines. Qui suis-je ?", answer: "avion" },
  { clue: "Je glisse sur l'eau et je transporte passagers ou marchandises. Qui suis-je ?", answer: "bateau" },
  { clue: "Plie, je tiens dans la main; ouvert, je protege de la pluie. Qui suis-je ?", answer: "parapluie" },
  { clue: "Je donne un appui supplementaire a chaque pas. Qui suis-je ?", answer: "canne" },
  { clue: "Je couvre la tete, pour le style ou pour se proteger. Qui suis-je ?", answer: "chapeau" },
  { clue: "Autour du cou, je garde la chaleur quand l'air est frais. Qui suis-je ?", answer: "echarpe" },
  { clue: "Je sort du placard quand les temperatures baissent. Qui suis-je ?", answer: "manteau" },
  { clue: "Croquant ou moelleux, je ne manque pas souvent a table. Qui suis-je ?", answer: "pain" },
  { clue: "Je viens du lait et je termine bien des repas. Qui suis-je ?", answer: "fromage" },
  { clue: "Chaude et reconfortante, on me sert dans une assiette creuse. Qui suis-je ?", answer: "soupe" },
  { clue: "Noir, serre ou allonge, je reveille bien des matins. Qui suis-je ?", answer: "cafe" },
  { clue: "Je demande un peu de patience: il faut me laisser infuser. Qui suis-je ?", answer: "the" },
  { clue: "Doux ou corsé, je fais plaisir aux gourmands. Qui suis-je ?", answer: "chocolat" },
  { clue: "Je peux etre croquee, cuite, en compote ou en tarte. Qui suis-je ?", answer: "pomme" },
  { clue: "Fine au sommet, plus large a la base, je suis un fruit tendre. Qui suis-je ?", answer: "poire" },
  { clue: "Je voyage en grappe et on m'epluche avant de me deguster. Qui suis-je ?", answer: "banane" },
  { clue: "Je suis un fruit d'hiver que l'on presse parfois le matin. Qui suis-je ?", answer: "orange" },
  { clue: "Rapee, cuite ou en puree, je garde souvent ma couleur vive. Qui suis-je ?", answer: "carotte" },
  { clue: "On me retrouve dans la salade, la sauce ou la ratatouille. Qui suis-je ?", answer: "tomate" },
  { clue: "Je suis souvent la base verte d'une entree legere. Qui suis-je ?", answer: "salade" },
  { clue: "Je peux etre roti du dimanche ou servi en sauce. Qui suis-je ?", answer: "poulet" },
  { clue: "Je viens de l'eau, mais j'arrive dans l'assiette. Qui suis-je ?", answer: "poisson" },
  { clue: "Bougies, creme ou fruits: je marque les occasions. Qui suis-je ?", answer: "gateau" },
  { clue: "Je peux calmer, energiser ou emouvoir en quelques notes. Qui suis-je ?", answer: "musique" },
  { clue: "Je melange melodie et paroles pour etre fredonnee. Qui suis-je ?", answer: "chanson" },
  { clue: "Mes touches noires et blanches accompagnent bien des melodies. Qui suis-je ?", answer: "piano" },
  { clue: "Je suis un instrument a cordes que l'on joue avec un archet. Qui suis-je ?", answer: "violon" },
  { clue: "Je fais bouger les pieds, seul, a deux ou en groupe. Qui suis-je ?", answer: "danse" },
  { clue: "Je parais sur le visage quand la joie prend la place. Qui suis-je ?", answer: "sourire" },
  { clue: "Je grandis avec la confiance et le temps partage. Qui suis-je ?", answer: "amitie" },
  { clue: "Je relie plusieurs generations sous le meme nom. Qui suis-je ?", answer: "famille" },
  { clue: "Je vis tout pres, et parfois je depanne ou je salue. Qui suis-je ?", answer: "voisin" },
  { clue: "On prend rendez-vous avec moi pour prendre soin de sa sante. Qui suis-je ?", answer: "docteur" },
  { clue: "On y va avec une ordonnance pour repartir avec un traitement. Qui suis-je ?", answer: "pharmacie" },
  { clue: "On y trouve des stands et des produits frais de saison. Qui suis-je ?", answer: "marche" },
  { clue: "Clocher, nef et silence: je suis un lieu de recueillement. Qui suis-je ?", answer: "eglise" },
  { clue: "On y declare des naissances, des mariages et des papiers officiels. Qui suis-je ?", answer: "mairie" },
  { clue: "Je passe de boite en boite pour distribuer les lettres. Qui suis-je ?", answer: "facteur" },
  { clue: "Je plante, j'arrose, je taille et je fais fleurir. Qui suis-je ?", answer: "jardinier" },
  { clue: "Je veille aux soins des patients, a l'hopital comme a domicile. Qui suis-je ?", answer: "infirmier" },
];

const INTRODUCTIONS = [
  "Charade du jour :",
  "Petit jeu de memoire :",
  "Indice du jour :",
  "A vous de deviner :",
  "Enigme du jour :",
] as const;

export const CHARADES: readonly Charade[] = Array.from({ length: 365 }, (_, index) => {
  const charade = BASE_CHARADES[index % BASE_CHARADES.length]!;
  const intro = INTRODUCTIONS[Math.floor(index / BASE_CHARADES.length) % INTRODUCTIONS.length]!;
  return {
    clue: `${intro} ${charade.clue}`,
    answer: charade.answer,
  };
});

export function getCharadeOfTheDay(date: Date = new Date()): Charade {
  const n = CHARADES.length;
  if (n === 0) {
    return { clue: "Charade indisponible.", answer: "repos" };
  }
  const i = getDayOfYear(date) % n;
  return CHARADES[i]!;
}

/** Même indice que `getCharadeOfTheDay` pour une clé `YYYY-MM-DD` (SSR / client identiques). */
export function getCharadeOfTheDayForDateKey(dateKey: string): Charade {
  const n = CHARADES.length;
  if (n === 0) {
    return { clue: "Charade indisponible.", answer: "repos" };
  }
  const i = dayOfYearFromDateKey(dateKey) % n;
  return CHARADES[i]!;
}
