import ollama from "ollama";
import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();

const summaries = [
  "King Ulric of Gettland and his oldest son are killed by soldiers from Vansterland. Prince Yarvi becomes king. Yarvi was training to be a King's minister under the tutelage of Mother Gundring. However, he has a malformed hand and is considered to be a weak ruler. His mother Leithlan is a brilliant economist; many believe that she would be the true power behind the throne. Yarvi is betrothed to Isrien, his dead brother’s fiancée, to shore up his political station. While on a raid against the Vanstermen who killed his father, Yarvi is betrayed by his uncle Odem, who usurps the crown. He escapes assassination by Odem’s men, but is captured by Vanstermen and taken as a slave. Yarvi is sold to the ship The South Wind as an oar slave, despite his crippled hand. When captain Sherem leaves the ship, Yarvi and the other slaves revolt. The ship sinks, and a group of survivors reaches land. Yarvi’s companions include Nobody, a warrior, and Sumael, the ship’s navigator. Together, they travel back to Gettland. Sherem and her surviving soldiers pursue them, but Yarvi kills her in combat. As they are recovering from this fight, Yarvi and his surviving companions are captured by Vanstermen. Yarvi reveals his identity and promises to make Gettland a vassal state of Vansterland in exchange for passage home. In Gettland, Odem is trying to get rid of Leithlan by marrying her to the High King, but she is delaying. Yarvi and his companions enter the palace and kill Odem. The swordsman Nobody is revealed to be Uthel, Odem’s older brother who had previously been captured. Uthel becomes king. Yarvi gives up his claim to the throne in exchange for forgiveness for his earlier actions. Yarvi realizes that Mother Gundring and Odem had conspired with the High King. The High King was afraid that Leithlan’s economic policies would take wealth from him, so he contrived to have her husband murdered and marry her himself. Yarvi poisons Mother Gundring and takes her place as minister to King Uthel.",
  "The first book introduces the three main characters of the trilogy and three secondary ones. Logen Ninefingers is a warrior who earned a fearsome reputation helping to bring Bethod to power in the North, but has since fallen out with him. Logen and his small crew of friends flee after being attacked by Shanka creatures. Logen is separated from his crew, and sets off on his own path. He meets Bayaz, a powerful centuries-old Magus, who enlists Logen's help in accompanying him to Adua. Sand dan Glokta leads an Inquisition investigation into a bribery case, which leads to him uncovering a wider corruption among the merchants. His superiors divert him into investigating Bayaz. Jezal, a vain young nobleman who has become a Union army officer due to his connections, trains for a prestigious swordfighting tournament. He falls in love with Ardee, the sister of his superior Collem, and wins the tournament with help from Bayaz. At a celebration banquet, Bayaz is challenged to prove who he is by entering the House of the Maker. The main characters of the book converge in accompanying Bayaz into the building. Bayaz retrieves an artifact and announces his plan to retrieve the Seed, a powerful magical artifact that can help him take on Khalul and the Gurkish Empire. The book also follows the journey of Logen's companions, led by Dogman, to warn Bethod about the Shanka, and Ferro, an escaped Gurkish slave who travels with another Magus to find Bayaz.",
  "Bilbo Baggins celebrates his birthday and leaves the Ring to Frodo, his heir. Gandalf (a wizard) suspects it is a Ring of Power; seventeen years later, he confirms it was lost by the Dark Lord Sauron and counsels Frodo to take it away from the Shire. Gandalf leaves, promising to return, but fails to do so. Frodo sets out on foot with his cousin Pippin Took and gardener Sam Gamgee. They are pursued by Black Riders, but meet some Elves, whose singing to Elbereth wards off the Riders. The Hobbits take an evasive shortcut to Bucklebury Ferry, where they meet their friend Merry Brandybuck. Merry and Pippin reveal they know about the Ring and insist on joining Frodo on his journey. They try to shake off the Black Riders by cutting through the Old Forest. Merry and Pippin are trapped by the malign Old Man Willow, but are rescued by Tom Bombadil. Leaving Tom's house, they are caught by a barrow-wight. Frodo, awakening from the barrow-wight's spell, calls Tom Bombadil, who frees them and gives them ancient swords from the wight's hoard. The Hobbits reach the village of Bree, where they meet Strider, a Ranger. The innkeeper gives Frodo an old letter from Gandalf, which identifies Strider as a friend. Knowing the Black Riders will attempt to seize the Ring, Strider guides the group toward the Elvish sanctuary of Rivendell. At Weathertop, they are attacked by five Black Riders. Their leader wounds Frodo with a cursed blade. Strider fights them off and treats Frodo with the herb athelas. They are joined by the Elf Glorfindel, who rides with Frodo, now deathly ill, towards Rivendell. The Black Riders pursue Frodo into the Ford of Bruinen, where they are swept away by flood waters summoned by Elrond. Frodo recovers in Rivendell under Elrond's care. Gandalf informs Frodo that the Black Riders are the Nazgûl, Men enslaved by Rings of Power to serve Sauron. The Council of Elrond discusses what to do with the Ring. Strider is revealed to be Aragorn, the heir of Isildur who had cut the Ring from Sauron's hand in the Second Age, but claimed it for himself. The Ring was lost when Isildur was killed; it passed to Gollum and then to Bilbo. Gandalf reports that the chief wizard, Saruman, is a traitor. The Council decides that the Ring must be destroyed in the fire of Mount Doom in Mordor, where it was forged. Frodo takes this task upon himself. Elrond chooses companions for him: Sam, Merry, and Pippin; Gandalf; the Men Aragorn and Boromir, son of the Steward of Gondor; the Elf Legolas; and the Dwarf Gimli, representing the Free Peoples of the West. After a failed attempt to cross the Misty Mountains, the Fellowship risk the path through the Mines of Moria. They learn that Balin and his Dwarves were killed by Orcs. They are attacked by Orcs and a Balrog, a fire demon. Gandalf confronts the Balrog: both fall into an abyss. The others escape to the Elvish forest of Lothlórien, where the Lady Galadriel tests their loyalty, and gives them magical gifts. She allows Frodo and Sam to look into her vision-giving fountain, the Mirror of Galadriel. Frodo offers her the Ring: she refuses, knowing that it would master her. Galadriel's husband Celeborn gives the Fellowship boats, cloaks, and waybread. They travel down the River Anduin. At Amon Hen, Boromir tries to take the Ring, but Frodo puts on the Ring and disappears. Frodo chooses to cross the river and go alone to Mordor, but Sam, guessing what he intends, intercepts him.",
];

async function createEmbedding(prompt) {
  return ollama.embeddings({
    model: "mxbai-embed-large",
    prompt,
  });
}

async function seed() {
  const collection = await chroma.createCollection({ name: "fastasy" });

  summaries.forEach(async (summary, index) => {
    const embed = await createEmbedding(summary);

    await collection.add({
      ids: index.toString(),
      embeddings: embed.embedding,
      documents: summary,
    });
  });
}

async function query() {
  const prompt = process.argv[2];
  const collection = await chroma.getCollection({ name: "fastasy" });

  const embed = await createEmbedding(prompt);
  const results = await collection.query({
    queryEmbeddings: embed.embedding,
    nResults: 2,
  });

  const firstSummary = results.documents[0][0];
  const secondSummary = results.documents[0][1];

  const { response } = await ollama.generate({
    model: "llama3",
    prompt: `Use these summaries as inspiration: ${firstSummary} ${secondSummary}, but do not use any names of people or places from the summary. Write an adventure for a table top roleplaying game about a group of adventurers who are on a quest to find a legendary sword. The sword is said to be hidden in a hidden valley, and the adventurers must use their skills and cunning to overcome various obstacles and challenges along the way. The story should be written in a descriptive and engaging style, with a focus on character development and world-building. The adventurers should encounter a variety of challenges and obstacles, and the story should have a clear and satisfying conclusion.`,
  });

  console.log(response, "\n\n");

  const { response: encounters } = await ollama.generate({
    model: "llama3",
    prompt: `Use this adventure as the setting: ${response}. Design three table top roleplaying game encounters that could be found at each part of the story, include a variety of combat encounters, social encounters, and mysteries to be solved.`,
  });

  console.log(encounters, "\n\n");
}

// await seed();
await query();
