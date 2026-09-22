import { useMemo, useState } from 'react';
import backdropImage from '../../assets/img/Dashboard background.jpeg';
import Sidebar, { type DashboardView } from './Sidebar';
import Topbar from './Topbar';
import Overview from './pages/Overview';
import Products from './pages/Products';
import Orders from './pages/Orders';
import BazaarApplications from './pages/BazaarApplications';
import VendorProfile from './pages/VendorProfile';
import type { ProductDraft } from './pages/ProductForm';
import type { VendorDraft } from './pages/VendorProfileForm';
import { productVisibility } from './format';
import {
  MOCK_APPLICATIONS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_UPCOMING_BAZAARS,
  MOCK_USER,
  MOCK_VENDOR,
} from './mockData';
import type {
  BazaarApplication,
  GeoPoint,
  Order,
  OrderStatus,
  Product,
  Vendor,
} from './types';
import styles from './VendorDashboard.module.scss';

/** The topbar search is scoped to whatever screen you're on. */
const SEARCH_PLACEHOLDERS: Record<DashboardView, string> = {
  overview: 'Search products, orders, or bazaars...',
  products: 'Search products, orders, or bazaars...',
  orders: 'Search orders by ID, customer name, or product...',
  applications: 'Search by bazaar name, organizer, or location...',
  profile: 'Search products, orders, or bazaars...',
};

export interface VendorDashboardProps {
  /** Returns to the marketing site from the sidebar wordmark. */
  onExit?: () => void;
}

/**
 * The vendor dashboard shell: sidebar, topbar and whichever screen is
 * active. State lives here rather than in the pages so an action on one
 * screen — deactivating a product, advancing an order — is reflected in the
 * counts the others show.
 *
 * Data comes from ./mockData for now. Wiring the real API means replacing
 * the two useState seeds below with fetches; nothing else has to change.
 */
export default function VendorDashboard({ onExit }: VendorDashboardProps) {
  const [view, setView] = useState<DashboardView>('overview');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [applications, setApplications] =
    useState<BazaarApplication[]>(MOCK_APPLICATIONS);
  const [vendor, setVendor] = useState<Vendor>(MOCK_VENDOR);

  /* When the location endpoint last accepted a change. It allows one update
     a minute, so the form uses this to disable itself rather than letting
     the save come back 429 LOCATION_RATE_LIMITED. */
  const [locationUpdatedAt, setLocationUpdatedAt] = useState<number | null>(null);

  const productCounts = useMemo(() => {
    let active = 0;
    let pending = 0;
    for (const product of products) {
      const visibility = productVisibility(product, vendor.verified);
      if (visibility === 'LIVE') active += 1;
      else if (visibility === 'PENDING') pending += 1;
    }
    return { active, pending };
  }, [products, vendor.verified]);

  /* PATCH /vendors/me/products/:id — optimistic here, since there's no
     request to fail yet. Against the real API this should roll back on a
     rejected response. */
  const handleToggleActive = (productId: string, isActive: boolean) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, isActive } : product,
      ),
    );
  };

  /* PATCH /vendors/me/orders/:id/status. The page only ever offers a
     transition the API accepts, so there's no validation to repeat here. */
  const handleAdvanceStatus = (orderId: string, next: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: next, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  /* POST /vendors/me/products. The API assigns the id and forces
     approvalStatus to PENDING; both are mirrored here so the new row looks
     the way it will once the server has really seen it. */
  const handleCreateProduct = (draft: ProductDraft) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();

    setProducts((current) => [
      {
        id,
        vendorId: vendor.id,
        title: draft.title,
        description: draft.description,
        categoryId: draft.categoryId,
        basePrice: draft.basePrice,
        images: draft.images,
        approvalStatus: 'PENDING',
        rejectionReason: null,
        isActive: draft.isActive,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        variants: draft.variants.map((variant, index) => ({
          ...variant,
          id: `${id}-v${index + 1}`,
          productId: id,
        })),
      },
      ...current,
    ]);
  };

  /* PATCH /vendors/me/products/:id. An edited product goes back into the
     approval queue, and any rejection reason from the previous round is
     cleared — it referred to the old submission. */
  const handleUpdateProduct = (productId: string, draft: ProductDraft) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              title: draft.title,
              description: draft.description,
              categoryId: draft.categoryId,
              basePrice: draft.basePrice,
              images: draft.images,
              isActive: draft.isActive,
              approvalStatus: 'PENDING',
              rejectionReason: null,
              updatedAt: new Date().toISOString(),
              variants: draft.variants.map((variant, index) => ({
                ...variant,
                id: variant.id.startsWith('draft-')
                  ? `${productId}-v${index + 1}`
                  : variant.id,
                productId,
              })),
            }
          : product,
      ),
    );
  };

  /* DELETE /vendors/me/products/:id is a soft delete: the row keeps
     existing behind a deletedAt so past orders still resolve. Dropping it
     from this list is the same thing from the dashboard's point of view. */
  const handleDeleteProduct = (productId: string) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
  };

  /* DELETE /bazaars/:id/apply — removes the application outright. */
  const handleWithdraw = (applicationId: string) => {
    setApplications((current) =>
      current.filter((application) => application.id !== applicationId),
    );
  };

  /* PATCH /vendors/me. The request field is `businessName` and the response
     calls it `name`, which is the one mapping this dashboard has to do by
     hand. Empty strings go back as null — that's how the API represents an
     unset optional field, and "" would show as a blank value rather than a
     dash on the profile. */
  const handleSaveVendor = (draft: VendorDraft) => {
    setVendor((current) => ({
      ...current,
      name: draft.businessName,
      category: draft.category,
      vendorType: draft.vendorType,
      description: draft.description || null,
      brandStory: draft.brandStory || null,
      returnPolicy: draft.returnPolicy || null,
      shippingPolicy: draft.shippingPolicy || null,
      logoUrl: draft.logoUrl,
      bannerUrl: draft.bannerUrl,
      coverMedia: draft.coverMedia,
      hasFixedLocation: draft.hasFixedLocation,
      updatedAt: new Date().toISOString(),
    }));
  };

  /* PATCH /vendors/me/location — answers 204, so there's no body to merge;
     the new point is simply what was sent. */
  const handleSaveLocation = (location: GeoPoint) => {
    setVendor((current) => ({ ...current, location }));
    setLocationUpdatedAt(Date.now());
  };

  /* DELETE /users/me soft-deletes the account and returns 204. There's no
     signed-in state left after that, so the only sensible thing is to leave
     the dashboard. */
  const handleDeleteAccount = (password: string) => {
    console.log('delete account', { password: password.replace(/./g, '*') });
    onExit?.();
  };

  const goTo = (next: DashboardView) => {
    setView(next);
    /* Each screen filters on its own terms, so a query typed for one would
       only confuse the next. */
    setSearch('');
  };

  return (
    <div className={styles.page}>
      {/* The dashboard floats as a card on this photo, so a band of it shows
          around every edge. Decorative, and fixed so it stays put while the
          screen inside the card scrolls. */}
      <img className={styles.backdrop} src={backdropImage} alt="" aria-hidden="true" />

      <div className={styles.shell}>
        <Sidebar
          active={view}
          onNavigate={goTo}
          onLogoClick={onExit}
          open={menuOpen}
          onDismiss={() => setMenuOpen(false)}
        />

        {/* Tapping outside the drawer closes it. Hidden from assistive tech:
            the sidebar's own entries already dismiss it on activation. */}
        {menuOpen && (
          <div
            className={styles.scrim}
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div className={styles.frame}>
          <Topbar
            searchPlaceholder={SEARCH_PLACEHOLDERS[view]}
            search={search}
            onSearchChange={setSearch}
            userName={MOCK_USER.name}
            userRole="Vendor"
            verified={vendor.verified}
            unreadCount={3}
            onOpenMenu={() => setMenuOpen(true)}
            onProfileClick={() => goTo('profile')}
          />

          <main className={styles.content}>
            {view === 'overview' && (
              <Overview
                vendor={vendor}
                userName={MOCK_USER.name}
                products={products}
                orders={orders}
                sales={MOCK_SALES}
                bazaars={MOCK_UPCOMING_BAZAARS}
                onNavigate={goTo}
              />
            )}

            {view === 'products' && (
              <Products
                products={products}
                vendor={vendor}
                onToggleActive={handleToggleActive}
                onCreate={handleCreateProduct}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            )}

            {view === 'orders' && (
              <Orders orders={orders} onAdvanceStatus={handleAdvanceStatus} />
            )}

            {view === 'applications' && (
              <BazaarApplications
                applications={applications}
                onWithdraw={handleWithdraw}
              />
            )}

            {view === 'profile' && (
              <VendorProfile
                vendor={vendor}
                productCount={products.length}
                activeProductCount={productCounts.active}
                pendingProductCount={productCounts.pending}
                orderCount={orders.length}
                contactEmail={MOCK_USER.email}
                contactPhone={MOCK_USER.phone}
                onSave={handleSaveVendor}
                onSaveLocation={handleSaveLocation}
                onDeleteAccount={handleDeleteAccount}
                locationUpdatedAt={locationUpdatedAt}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
