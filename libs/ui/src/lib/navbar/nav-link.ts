/** A link in the Navbar or Footer (ADR-0020). */
export interface NavLink {
  label: string;
  href: string;
  /** The current page; styled as active and announced with `aria-current="page"`. */
  current?: boolean;
}

/** A call-to-action button in the Navbar: `primary` is filled, `secondary` outlined. */
export interface NavAction extends Omit<NavLink, 'current'> {
  variant?: 'primary' | 'secondary';
}
