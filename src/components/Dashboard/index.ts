/* ==========================================================================
   RIVEN — vendor dashboard public surface.

   Import from this barrel rather than reaching into the folder, so the
   internal layout (pages/, ui/) stays free to move.
   ========================================================================== */

export { default as VendorDashboard } from './VendorDashboard';
export type { VendorDashboardProps } from './VendorDashboard';

export { default as Sidebar } from './Sidebar';
export type { DashboardView, SidebarProps } from './Sidebar';

export { default as Topbar } from './Topbar';
export type { TopbarProps } from './Topbar';

/* Screens — exported so they can be mounted under a router later without
   going through the shell. */
export { default as Overview } from './pages/Overview';
export type { OverviewProps } from './pages/Overview';

export { default as Products } from './pages/Products';
export type { ProductsProps } from './pages/Products';

export { default as Orders } from './pages/Orders';
export type { OrdersProps } from './pages/Orders';

export { default as BazaarApplications } from './pages/BazaarApplications';
export type { BazaarApplicationsProps } from './pages/BazaarApplications';

export { default as VendorProfile } from './pages/VendorProfile';
export type { VendorProfileProps } from './pages/VendorProfile';

/* Dialogs — the detail and edit surfaces behind the table actions. */
export { default as ProductForm } from './pages/ProductForm';
export type { ProductDraft, ProductFormProps } from './pages/ProductForm';

export { default as OrderDetails } from './pages/OrderDetails';
export type { OrderDetailsProps } from './pages/OrderDetails';

export { default as ApplicationDetails } from './pages/ApplicationDetails';
export type { ApplicationDetailsProps } from './pages/ApplicationDetails';

export { default as VendorProfileForm } from './pages/VendorProfileForm';
export type { VendorDraft, VendorProfileFormProps } from './pages/VendorProfileForm';

export { default as LocationForm } from './pages/LocationForm';
export type { LocationFormProps } from './pages/LocationForm';

export { default as DeleteAccountDialog } from './pages/DeleteAccountDialog';
export type { DeleteAccountDialogProps } from './pages/DeleteAccountDialog';

/* Shared pieces, for building further screens in the same language. */
export { default as PageHero } from './ui/PageHero';
export { default as StatCard } from './ui/StatCard';
export { default as StatusPill } from './ui/StatusPill';
export { default as SalesChart } from './ui/SalesChart';
export { default as Modal } from './ui/Modal';
export { default as ConfirmDialog } from './ui/ConfirmDialog';
export { Pagination, SearchField, SelectField, Toggle } from './ui/Controls';
export { default as Select } from './ui/Select';
export type { SelectOption, SelectProps } from './ui/Select';

export * from './types';
export * from './format';
