export interface Store {
  name: string;
  category: string;
  domain: string;
  note: string;
}

export const stores: Store[] = [
  { name: "Amazon UK", category: "Marketplace", domain: "amazon.co.uk", note: "Everything under one roof" },
  { name: "eBay UK", category: "Marketplace", domain: "ebay.co.uk", note: "Auctions & direct buys" },
  { name: "ASOS", category: "Fashion", domain: "asos.com", note: "Trend-led fashion & beauty" },
  { name: "Nike UK", category: "Fashion", domain: "nike.com/gb", note: "Sneakers & sportswear" },
  { name: "Adidas UK", category: "Fashion", domain: "adidas.co.uk", note: "Sportswear & originals" },
  { name: "Zara UK", category: "Fashion", domain: "zara.com/uk", note: "Contemporary fashion" },
  { name: "Next UK", category: "Fashion", domain: "next.co.uk", note: "Family fashion & home" },
  { name: "Marks & Spencer", category: "Fashion", domain: "marksandspencer.com", note: "British quality classics" },
  { name: "Primark Online", category: "Fashion", domain: "primark.com", note: "Budget-friendly fashion" },
  { name: "Boots", category: "Beauty & Health", domain: "boots.com", note: "Pharmacy & skincare" },
  { name: "Superdrug", category: "Beauty & Health", domain: "superdrug.com", note: "Health & beauty deals" },
  { name: "Apple UK", category: "Electronics", domain: "apple.com/uk", note: "iPhone, Mac & more" },
  { name: "Argos", category: "Electronics", domain: "argos.co.uk", note: "Home, tech & toys" },
  { name: "Currys", category: "Electronics", domain: "currys.co.uk", note: "Electronics & appliances" },
  { name: "John Lewis", category: "Electronics", domain: "johnlewis.com", note: "Premium home & tech" },
  { name: "Sports Direct", category: "Sport & Outdoors", domain: "sportsdirect.com", note: "Big sports brands" },
  { name: "JD Sports", category: "Sport & Outdoors", domain: "jdsports.co.uk", note: "Trainers & kit" },
  { name: "Decathlon UK", category: "Sport & Outdoors", domain: "decathlon.co.uk", note: "Outdoor & fitness gear" },
  { name: "Lakeland", category: "Home & Kitchen", domain: "lakeland.co.uk", note: "Kitchen & home essentials" },
  { name: "IKEA UK", category: "Home & Kitchen", domain: "ikea.com/gb", note: "Furniture & homeware" },
  { name: "H&M UK", category: "Fashion", domain: "hm.com/gb", note: "Affordable everyday style" },
  { name: "The Body Shop", category: "Beauty & Health", domain: "thebodyshop.com", note: "Natural skincare" },
  { name: "Sephora UK", category: "Beauty & Health", domain: "sephora.co.uk", note: "Luxury cosmetics" },
  { name: "HMV", category: "Entertainment", domain: "hmv.com", note: "Music, games & collectibles" },
];

export const storeCategories = ["All", ...Array.from(new Set(stores.map((store) => store.category)))];

export function filterStores(searchTerm: string, category: string): Store[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return stores.filter((store) => {
    const matchesCategory = category === "All" || store.category === category;
    const matchesSearch = !normalizedSearch || [store.name, store.domain, store.note, store.category]
      .some((value) => value.toLowerCase().includes(normalizedSearch));
    return matchesCategory && matchesSearch;
  });
}
