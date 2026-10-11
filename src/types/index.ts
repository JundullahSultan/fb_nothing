export interface NavbarProps {
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
