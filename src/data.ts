export interface Listing {
  id: number;
  emoji: string;
  title: string;
  price: number;
  condition: string;
  seller: string;
  category: string;
  size: string;
  brand: string;
  desc: string;
}

export const LISTINGS: Listing[] = [
  {id: 1, emoji:'👗',title:'Zara Linen Blazer',price:185,condition:'Like New',seller:'@nour.closet',category:'Outerwear',size:'M',brand:'Zara',desc:'Worn only once to a wedding. Perfect condition, no stains or damage.'},
  {id: 2, emoji:'👟',title:'Nike Air Force 1 White',price:220,condition:'Good',seller:'@khalid.fits',category:'Shoes',size:'42',brand:'Nike',desc:'Worn a handful of times, slight creasing on the toe box. Cleaned and ready.'},
  {id: 3, emoji:'👜',title:'H&M Structured Bag',price:95,condition:'New with tags',seller:'@sara.wardrobe',category:'Bags',size:'One size',brand:'H&M',desc:'Never used. Still has the original tags. Perfect everyday bag.'},
  {id: 4, emoji:'🧥',title:'Massimo Dutti Coat',price:340,condition:'Like New',seller:'@reem.style',category:'Outerwear',size:'S',brand:'Massimo Dutti',desc:'Bought last winter, worn twice. No pilling or damage.'},
  {id: 5, emoji:'👕',title:'Vintage Band Tee',price:75,condition:'Good',seller:'@faisal.vintage',category:'Tops',size:'L',brand:'Vintage',desc:'Genuine vintage piece from the 90s. Great patina.'},
  {id: 6, emoji:'👖',title:'Levis 501 Original',price:130,condition:'Good',seller:'@dana.closet',category:'Pants',size:'28',brand:'Levis',desc:'Classic fit, faded naturally. Some wear at the knees.'},
  {id: 7, emoji:'👠',title:'Aldo Block Heels',price:110,condition:'Like New',seller:'@lina.fashion',category:'Shoes',size:'38',brand:'Aldo',desc:'Wore once to a dinner. No scuffs. Comes with original box.'},
  {id: 8, emoji:'🧣',title:'Arket Wool Scarf',price:65,condition:'New with tags',seller:'@ahmed.finds',category:'Accessories',size:'One size',brand:'Arket',desc:'Gift I never used. Still in original packaging.'},
  {id: 9, emoji:'👗',title:'Mango Midi Dress',price:155,condition:'Good',seller:'@hessa.style',category:'Dresses',size:'S',brand:'Mango',desc:'Wore a few times. Minor pilling on the fabric, not visible when worn.'},
  {id: 10, emoji:'🧤',title:'Pull&Bear Leather Gloves',price:45,condition:'Like New',seller:'@nour.closet',category:'Accessories',size:'One size',brand:'Pull&Bear',desc:'Barely worn. Soft faux leather, warm lining.'},
  {id: 11, emoji:'👔',title:'Reserved Formal Shirt',price:80,condition:'Good',seller:'@omar.wardrobe',category:'Tops',size:'XL',brand:'Reserved',desc:'Office shirt, dry cleaned. Ready to wear.'},
  {id: 12, emoji:'🎒',title:'Adidas Classic Backpack',price:120,condition:'Good',seller:'@tariq.fits',category:'Bags',size:'One size',brand:'Adidas',desc:'Used for one semester at university. Clean inside, small scuff on front pocket.'},
];
