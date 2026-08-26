export type OfficialDealDestination = {
  retailer: string;
  title: string;
  categories: string;
  url: string;
  source: string;
};

/**
 * Retailer-owned deal destinations reviewed on 26 August 2026.
 * This list intentionally contains destination pages, not volatile percentage-off claims,
 * coupon codes, product prices, or copied catalogue data.
 */
export const officialDealDestinations: readonly OfficialDealDestination[] = [
  {
    retailer: "ASOS",
    title: "Women’s sale",
    categories: "Fashion, footwear & accessories",
    url: "https://www.asos.com/women/sale/cat/?cid=7046",
    source: "Official ASOS sale page",
  },
  {
    retailer: "LOOKFANTASTIC",
    title: "Beauty offers",
    categories: "Skincare, haircare & fragrance",
    url: "https://www.lookfantastic.com/c/health-beauty/offers/",
    source: "Official LOOKFANTASTIC offers page",
  },
  {
    retailer: "Superdrug",
    title: "Top offers",
    categories: "Makeup, skincare & haircare",
    url: "https://www.superdrug.com/top-offers",
    source: "Official Superdrug offers page",
  },
  {
    retailer: "Marks & Spencer",
    title: "Womenswear sale",
    categories: "Clothing, dresses & accessories",
    url: "https://www.marksandspencer.com/l/offers/sale/womens",
    source: "Official M&S women’s sale page",
  },
];
