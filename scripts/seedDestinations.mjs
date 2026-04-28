import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const destinations = [
  {
    id: "lakawon-island",
    name: "Lakawon Island",
    category: "Nature",
    natureType: "Beach",
    natureTypeKey: "beaches",
    location: "Cadiz City, Negros Occidental",
    shortDescription:
      "A white-sand island off Cadiz known for clear water and day trips.",
    fullDescription:
      "Lakawon Island is a popular northern Negros beach destination with open sea views, pale sand, and easy island-hopping appeal.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Lakawon%20Island%20Cadiz%20Negros%20Occidental",
    tags: ["beach", "island", "white sand", "swimming"],
    isActive: true,
  },
  {
    id: "sugar-beach-sipalay",
    name: "Sugar Beach",
    category: "Nature",
    natureType: "Beach",
    natureTypeKey: "beaches",
    location: "Sipalay City, Negros Occidental",
    shortDescription:
      "A quiet Sipalay shoreline with broad sand and sunset views.",
    fullDescription:
      "Sugar Beach is a relaxed coastal area in Sipalay suited for slow beach days, sunset walks, and low-key seaside stays.",
    imageUrl:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Sugar%20Beach%20Sipalay%20Negros%20Occidental",
    tags: ["beach", "sunset", "coast", "relaxing"],
    isActive: true,
  },
  {
    id: "perth-paradise-resort-viewpoint",
    name: "Perth Paradise Resort Viewpoint",
    category: "Nature",
    natureType: "Scenic Spot",
    natureTypeKey: "scenicSpots",
    location: "Sipalay City, Negros Occidental",
    shortDescription:
      "A hillside viewpoint overlooking Sipalay islets and blue coves.",
    fullDescription:
      "This Sipalay viewpoint is known for elevated views of coastal inlets, small islands, and layered blue water scenery.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Perth%20Paradise%20Resort%20Sipalay%20Negros%20Occidental",
    tags: ["viewpoint", "islets", "coast", "photos"],
    isActive: true,
  },
  {
    id: "tinagong-dagat-sipalay",
    name: "Tinagong Dagat",
    category: "Nature",
    natureType: "Scenic Spot",
    natureTypeKey: "scenicSpots",
    location: "Sipalay City, Negros Occidental",
    shortDescription:
      "A hidden-sea landscape with small islands and calm coves.",
    fullDescription:
      "Tinagong Dagat offers a compact island-and-cove scene that works well for photo stops, quiet views, and short coastal exploration.",
    imageUrl:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Tinagong%20Dagat%20Sipalay%20Negros%20Occidental",
    tags: ["scenic", "cove", "islands", "coast"],
    isActive: true,
  },
  {
    id: "danjugan-island",
    name: "Danjugan Island",
    category: "Nature",
    natureType: "Nature Park",
    natureTypeKey: "natureParks",
    location: "Cauayan, Negros Occidental",
    shortDescription:
      "A marine and wildlife sanctuary with lagoons, reefs, and forest trails.",
    fullDescription:
      "Danjugan Island is a conservation-focused destination with reef areas, lagoons, birdlife, and nature education experiences.",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Danjugan%20Island%20Cauayan%20Negros%20Occidental",
    tags: ["marine sanctuary", "reef", "wildlife", "island"],
    isActive: true,
  },
  {
    id: "carbin-reef",
    name: "Carbin Reef",
    category: "Nature",
    natureType: "Beach",
    natureTypeKey: "beaches",
    location: "Sagay City, Negros Occidental",
    shortDescription: "A bright sandbar and marine reserve stop in Sagay.",
    fullDescription:
      "Carbin Reef is known for its sandbar setting and protected marine surroundings, making it a memorable coastal day-trip destination.",
    imageUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Carbin%20Reef%20Sagay%20City%20Negros%20Occidental",
    tags: ["sandbar", "marine reserve", "beach", "snorkeling"],
    isActive: true,
  },
  {
    id: "suyac-island-mangrove-ecopark",
    name: "Suyac Island Mangrove Eco-Park",
    category: "Nature",
    natureType: "Nature Park",
    natureTypeKey: "natureParks",
    location: "Sagay City, Negros Occidental",
    shortDescription:
      "A community mangrove eco-park with boardwalks and coastal habitat.",
    fullDescription:
      "Suyac Island highlights mangrove conservation through boardwalk routes, coastal scenery, and community-based eco-tourism.",
    imageUrl:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Suyac%20Island%20Mangrove%20Eco-Park%20Sagay%20Negros%20Occidental",
    tags: ["mangrove", "boardwalk", "eco park", "coast"],
    isActive: true,
  },
  {
    id: "gawahon-eco-park",
    name: "Gawahon Eco Park",
    category: "Nature",
    natureType: "Nature Park",
    natureTypeKey: "natureParks",
    location: "Victorias City, Negros Occidental",
    shortDescription:
      "An upland eco-park with greenery, trails, and mountain air.",
    fullDescription:
      "Gawahon Eco Park is an inland nature stop in Victorias with forest surroundings, cooler air, and simple outdoor recreation areas.",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Gawahon%20Eco%20Park%20Victorias%20Negros%20Occidental",
    tags: ["eco park", "forest", "upland", "trail"],
    isActive: true,
  },
  {
    id: "campuestohan-highland-resort",
    name: "Campuestohan Highland Resort",
    category: "Nature",
    natureType: "Scenic Spot",
    natureTypeKey: "scenicSpots",
    location: "Talisay City, Negros Occidental",
    shortDescription:
      "A highland destination with cool air and mountain views.",
    fullDescription:
      "Campuestohan sits in the highlands near Talisay and is useful for travelers looking for elevated views and cool-weather scenery.",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Campuestohan%20Highland%20Resort%20Talisay%20Negros%20Occidental",
    tags: ["highland", "viewpoint", "mountain view", "cool weather"],
    isActive: true,
  },
  {
    id: "mag-aso-falls-kabankalan",
    name: "Mag-Aso Falls",
    category: "Nature",
    natureType: "Waterfall",
    natureTypeKey: "waterfalls",
    location: "Kabankalan City, Negros Occidental",
    shortDescription: "A turquoise waterfall basin surrounded by greenery.",
    fullDescription:
      "Mag-Aso Falls is a well-known Kabankalan waterfall destination with a dramatic cascade, misty basin, and lush surroundings.",
    imageUrl:
      "https://images.unsplash.com/photo-1508182314998-3bd49473002f?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Mag-Aso%20Falls%20Kabankalan%20Negros%20Occidental",
    tags: ["waterfall", "freshwater", "nature", "swimming"],
    isActive: true,
  },
  {
    id: "malatan-og-falls",
    name: "Malatan-og Falls",
    category: "Nature",
    natureType: "Waterfall",
    natureTypeKey: "waterfalls",
    location: "Don Salvador Benedicto, Negros Occidental",
    shortDescription: "A tall waterfall viewed from the mountain road area.",
    fullDescription:
      "Malatan-og Falls is a scenic waterfall attraction associated with the upland landscapes of Don Salvador Benedicto.",
    imageUrl:
      "https://images.unsplash.com/photo-1467890947394-8171244e5410?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Malatan-og%20Falls%20Don%20Salvador%20Benedicto%20Negros%20Occidental",
    tags: ["waterfall", "upland", "viewpoint", "nature"],
    isActive: true,
  },
  {
    id: "balay-sa-busay-dsb",
    name: "Balay sa Busay Viewpoint",
    category: "Nature",
    natureType: "Scenic Spot",
    natureTypeKey: "scenicSpots",
    location: "Don Salvador Benedicto, Negros Occidental",
    shortDescription:
      "A mountain-view stop along the Don Salvador Benedicto highlands.",
    fullDescription:
      "Balay sa Busay is a convenient highland stop for broad mountain views, cool air, and short scenic breaks.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Balay%20sa%20Busay%20Don%20Salvador%20Benedicto%20Negros%20Occidental",
    tags: ["viewpoint", "highland", "mountains", "road trip"],
    isActive: true,
  },
  {
    id: "kanlaon-natural-park",
    name: "Kanlaon Natural Park",
    category: "Nature",
    natureType: "Mountain",
    natureTypeKey: "mountains",
    location: "Negros Island",
    shortDescription:
      "A protected volcanic mountain landscape centered on Mount Kanlaon.",
    fullDescription:
      "Kanlaon Natural Park is a major mountain and forest landscape for hikers, biodiversity interest, and volcano-view scenery.",
    imageUrl:
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Kanlaon%20Natural%20Park%20Negros",
    tags: ["mountain", "volcano", "hiking", "protected area"],
    isActive: true,
  },
  {
    id: "guintubdan-pavilion-and-trails",
    name: "Guintubdan Pavilion and Trails",
    category: "Nature",
    natureType: "Mountain",
    natureTypeKey: "mountains",
    location: "La Carlota City, Negros Occidental",
    shortDescription:
      "A cool mountain gateway near Kanlaon with trail access and views.",
    fullDescription:
      "Guintubdan is an upland area near Kanlaon known for cool weather, mountain scenery, and access to nearby nature trails.",
    imageUrl:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Guintubdan%20La%20Carlota%20Negros%20Occidental",
    tags: ["mountain", "trail", "cool weather", "view"],
    isActive: true,
  },
  {
    id: "patag-silay",
    name: "Patag",
    category: "Nature",
    natureType: "Mountain",
    natureTypeKey: "mountains",
    location: "Silay City, Negros Occidental",
    shortDescription:
      "An upland Silay area known for forested mountain scenery.",
    fullDescription:
      "Patag offers a cooler upland atmosphere, green views, and access to mountain-side nature experiences near Silay.",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Patag%20Silay%20City%20Negros%20Occidental",
    tags: ["mountain", "upland", "forest", "cool weather"],
    isActive: true,
  },
  {
    id: "bago-river",
    name: "Bago River",
    category: "Nature",
    natureType: "River",
    natureTypeKey: "rivers",
    location: "Bago City, Negros Occidental",
    shortDescription: "A broad river landscape for quiet outdoor views.",
    fullDescription:
      "Bago River provides a simple freshwater landscape for short nature breaks, riverside views, and relaxed outdoor stops.",
    imageUrl:
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Bago%20River%20Bago%20City%20Negros%20Occidental",
    tags: ["river", "freshwater", "picnic", "nature"],
    isActive: true,
  },
  {
    id: "ilog-river",
    name: "Ilog River",
    category: "Nature",
    natureType: "River",
    natureTypeKey: "rivers",
    location: "Ilog, Negros Occidental",
    shortDescription:
      "A southern Negros river area with a calm provincial setting.",
    fullDescription:
      "Ilog River is a straightforward nature entry for users who prefer river landscapes, open water views, and quiet local scenery.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Ilog%20River%20Negros%20Occidental",
    tags: ["river", "province", "freshwater", "scenery"],
    isActive: true,
  },
  {
    id: "balinsasayao-twin-lakes",
    name: "Balinsasayao Twin Lakes Natural Park",
    category: "Nature",
    natureType: "Nature Park",
    natureTypeKey: "natureParks",
    location: "Sibulan, Negros Oriental",
    shortDescription: "Twin crater lakes surrounded by forested highlands.",
    fullDescription:
      "Balinsasayao Twin Lakes Natural Park features peaceful lake views, forest cover, and upland scenery suited for nature-focused trips.",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Balinsasayao%20Twin%20Lakes%20Natural%20Park%20Negros%20Oriental",
    tags: ["lake", "forest", "nature park", "viewpoint"],
    isActive: true,
  },
  {
    id: "casaroro-falls",
    name: "Casaroro Falls",
    category: "Nature",
    natureType: "Waterfall",
    natureTypeKey: "waterfalls",
    location: "Valencia, Negros Oriental",
    shortDescription:
      "A tall waterfall reached through a forested trail and stair route.",
    fullDescription:
      "Casaroro Falls is a dramatic waterfall destination in Valencia with a narrow cascade, boulder scenery, and a trail approach.",
    imageUrl:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Casaroro%20Falls%20Valencia%20Negros%20Oriental",
    tags: ["waterfall", "trail", "forest", "adventure"],
    isActive: true,
  },
  {
    id: "pulangbato-falls",
    name: "Pulangbato Falls",
    category: "Nature",
    natureType: "Waterfall",
    natureTypeKey: "waterfalls",
    location: "Valencia, Negros Oriental",
    shortDescription:
      "A reddish-rock waterfall area in the Valencia highlands.",
    fullDescription:
      "Pulangbato Falls is known for its reddish stone setting, cool freshwater, and accessible upland nature atmosphere.",
    imageUrl:
      "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Pulangbato%20Falls%20Valencia%20Negros%20Oriental",
    tags: ["waterfall", "freshwater", "red rocks", "upland"],
    isActive: true,
  },
  {
    id: "apo-island",
    name: "Apo Island",
    category: "Nature",
    natureType: "Beach",
    natureTypeKey: "beaches",
    location: "Dauin, Negros Oriental",
    shortDescription:
      "A marine sanctuary island known for reefs and sea turtle encounters.",
    fullDescription:
      "Apo Island is a major nature destination off Dauin with clear water, reef life, and a strong marine sanctuary identity.",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Apo%20Island%20Dauin%20Negros%20Oriental",
    tags: ["island", "reef", "marine sanctuary", "snorkeling"],
    isActive: true,
  },
  {
    id: "lake-balanan",
    name: "Lake Balanan",
    category: "Nature",
    natureType: "Nature Park",
    natureTypeKey: "natureParks",
    location: "Siaton, Negros Oriental",
    shortDescription: "A mountain lake surrounded by forested slopes.",
    fullDescription:
      "Lake Balanan offers calm water views, surrounding greenery, and a peaceful inland nature setting in southern Negros Oriental.",
    imageUrl:
      "https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Lake%20Balanan%20Siaton%20Negros%20Oriental",
    tags: ["lake", "forest", "quiet", "nature park"],
    isActive: true,
  },
  {
    id: "mt-talinis",
    name: "Mt. Talinis",
    category: "Nature",
    natureType: "Mountain",
    natureTypeKey: "mountains",
    location: "Negros Oriental",
    shortDescription:
      "A major mountain destination also known as Cuernos de Negros.",
    fullDescription:
      "Mt. Talinis is a prominent Negros Oriental mountain landscape with trekking routes, forest scenery, and crater-lake surroundings.",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Mt.%20Talinis%20Negros%20Oriental",
    tags: ["mountain", "trekking", "forest", "lake"],
    isActive: true,
  },
  {
    id: "camp-mapot",
    name: "Camp Mapot",
    category: "Nature",
    natureType: "Campsite",
    natureTypeKey: "campsites",
    location: "Negros Occidental",
    shortDescription: "A simple camping-style outdoor stop for nature breaks.",
    fullDescription:
      "Camp Mapot is included for users looking for basic camping, open-air stays, and a quieter outdoor atmosphere.",
    imageUrl:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=60",
    googleMapsUrl:
      "https://maps.google.com/?q=Camp%20Mapot%20Negros%20Occidental",
    tags: ["camping", "outdoor", "nature", "quiet"],
    isActive: true,
  },
];

const batch = db.batch();

for (const destination of destinations) {
  const { id, ...data } = destination;
  const ref = db.collection("destinations").doc(id);

  batch.set(
    ref,
    {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

await batch.commit();

console.log(`Seeded ${destinations.length} destinations.`);
