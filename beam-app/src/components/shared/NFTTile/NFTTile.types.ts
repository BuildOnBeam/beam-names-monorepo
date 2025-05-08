export type NFTTileProps = {
  href: string;
  name: string;
  quantityOwned: number;
  image: string;
  isSelected?: boolean;
  isSelecting?: boolean;
  hasSelectedMax?: boolean;
  onClick?: () => void;
};
