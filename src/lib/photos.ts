// Real photography, sourced from Wikimedia Commons (all CC-licensed, hotlink-safe).
// Kept in one place so credits stay attached to their image.

export interface Photo {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

export const PHOTOS = {
  plantationHero: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coffee_farm_with_the_surrounding_mountains.jpg/1280px-Coffee_farm_with_the_surrounding_mountains.jpg",
    alt: "Coffee plantation terraced into a mountainside",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Coffee_farm_with_the_surrounding_mountains.jpg",
  },
  plantationColombia: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Coffee_farm_in_Colombia.jpg/1280px-Coffee_farm_in_Colombia.jpg",
    alt: "Rows of coffee plants on a farm in Colombia",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Coffee_farm_in_Colombia.jpg",
  },
  plantationKaratu: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Coffee_Farm_near_Karatu_%2807%29.jpg/1280px-Coffee_Farm_near_Karatu_%2807%29.jpg",
    alt: "Coffee farm near Karatu, Tanzania",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Coffee_Farm_near_Karatu_(07).jpg",
  },
  roasteryHero: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/A_worker_at_the_roastery_checks_on_the_progress_of_coffee_beans_in_the_roasting_machine.jpg/1280px-A_worker_at_the_roastery_checks_on_the_progress_of_coffee_beans_in_the_roasting_machine.jpg",
    alt: "A roaster checking coffee beans mid-roast in a drum roasting machine",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:A_worker_at_the_roastery_checks_on_the_progress_of_coffee_beans_in_the_roasting_machine.jpg",
  },
  roasteryMachine: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Coffee_roasting_machine%2C_The_Roastery%2C_Coaltown_Coffee%2C_Ammanford%2C_Wales.jpg/1280px-Coffee_roasting_machine%2C_The_Roastery%2C_Coaltown_Coffee%2C_Ammanford%2C_Wales.jpg",
    alt: "A coffee roasting machine inside a small-batch roastery",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Coffee_roasting_machine,_The_Roastery,_Coaltown_Coffee,_Ammanford,_Wales.jpg",
  },
  coffeeCherries: {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Coffee_cherries_on_bush_at_Fairview_Estate%2C_Kiambu%2C_KE.jpg",
    alt: "Ripe red coffee cherries growing on the branch",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Coffee_cherries_on_bush_at_Fairview_Estate,_Kiambu,_KE.jpg",
  },
  pourOverHero: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Brewing_Single_Serving_Pour_Over_Coffee.jpg/1280px-Brewing_Single_Serving_Pour_Over_Coffee.jpg",
    alt: "Hot water being poured over coffee grounds in a pour-over cone",
    credit: "Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Brewing_Single_Serving_Pour_Over_Coffee.jpg",
  },
} satisfies Record<string, Photo>;
