export const storeBrandLogos: Record<string, string> = {
  "Amazon UK": "/manus-storage/amazon_2a7347b3.png",
  "eBay UK": "/manus-storage/ebay_86268e48.png",
  ASOS: "/manus-storage/asos_054104bd.png",
  "Nike UK": "/manus-storage/nike_a2ad4d50.png",
  "Adidas UK": "/manus-storage/adidas_e76ffa5d.jpg",
  "Zara UK": "/manus-storage/zara_9dbaa816.png",
  "Next UK": "/manus-storage/next_e0017815.png",
  "Marks & Spencer": "/manus-storage/ms_235f8386.png",
  "Primark Online": "/manus-storage/primark_99111fca.png",
  Boots: "/manus-storage/boots_a4a41643.png",
  Superdrug: "/manus-storage/superdrug_3a35d1ad.png",
  "Apple UK": "/manus-storage/apple_88777630.png",
  Argos: "/manus-storage/argos_ce8e8ab5.png",
  Currys: "/manus-storage/currys_8719af84.png",
  "John Lewis": "/manus-storage/johnlewis_6fb5a2b7.png",
  "Sports Direct": "/manus-storage/sportsdirect_3c993fe4.png",
  "JD Sports": "/manus-storage/jdsports_b38fa866.png",
  "Decathlon UK": "/manus-storage/decathlon_cd3874d7.png",
  Lakeland: "/manus-storage/lakeland_ece68d7b.png",
  "IKEA UK": "/manus-storage/ikea_5147cb5e.png",
  "H&M UK": "/manus-storage/hm_eda09649.png",
  "The Body Shop": "/manus-storage/thebodyshop_9b025f1f.png",
  "Sephora UK": "/manus-storage/sephora_ec8b3e69.jpg",
  HMV: "/manus-storage/hmv_de33faf9.png",
};

export function getStoreBrandLogo(storeName: string): string | undefined {
  return storeBrandLogos[storeName];
}
