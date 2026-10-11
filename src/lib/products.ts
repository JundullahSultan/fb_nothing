export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  // NOTE: Set real values here to show price, rating, and review count in the UI.
  // Defaults to null to avoid displaying misleading mock figures.
  price: string | null;
  rating: number | null;
  reviewCount: number | null;
}

export const PRODUCTS_HEADER = {
  eyebrow: 'OUR COLLECTION',
  title: 'Featured Products',
  // Shortened from "Explore our most popular items loved by customers" for brand honesty
  // until verified customer reviews are gathered.
  subtitle: 'Explore our featured items.',
} as const;

export const AUTOPLAY = false; // When true, advances every 5s; pauses on hover/focus and prefers-reduced-motion

export const PRODUCTS: Product[] = [
  {
    id: 'smart-watch',
    name: 'Smart Watch',
    badge: 'NEW',
    description: 'Track your fitness and stay connected.',
    image: '/images/products/smartwatch.webp',
    imageAlt: 'Cream analog smartwatch with soft silicone strap',
    price: null,
    rating: null,
    reviewCount: null,
  },
  {
    id: 'running-shoes',
    name: 'Running Shoes',
    badge: 'TRENDING',
    description: 'Lightweight and comfortable for everyday run.',
    image: '/images/products/running-shoes.webp',
    imageAlt: 'Floating cream running shoe pair with breathable knit upper',
    price: null,
    rating: null,
    reviewCount: null,
  },
  {
    id: 'wireless-headphones',
    name: 'Wireless Headphones',
    badge: 'BEST SELLER',
    description: 'High quality sound with premium comfort.',
    image: '/images/products/headphones.webp',
    imageAlt: 'Premium cream wireless over-ear headphones with gold accents',
    price: null,
    rating: null,
    reviewCount: null,
  },
  {
    id: 'dslr-camera',
    name: 'DSLR Camera',
    badge: 'POPULAR',
    description: 'Capture moments with perfect clarity.',
    image: '/images/products/camera.webp',
    imageAlt: 'Cream textured leather DSLR camera with zoom lens',
    price: null,
    rating: null,
    reviewCount: null,
  },
  {
    id: 'travel-backpack',
    name: 'Travel Backpack',
    badge: 'NEW',
    description: 'Spacious, durable and water resistant.',
    image: '/images/products/backpack.webp',
    imageAlt: 'Minimal cream travel backpack with dual compartments',
    price: null,
    rating: null,
    reviewCount: null,
  },
];
