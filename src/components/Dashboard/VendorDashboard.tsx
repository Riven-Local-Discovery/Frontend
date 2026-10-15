import { useCallback, useEffect, useMemo, useState } from 'react';
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
/* MOCK_SALES has no API behind it — nothing exposes a sales-over-time series —
   and MOCK_UPCOMING_BAZAARS is a presentation-only shape. They are the last two
   mocks left on this screen; everything else below comes from the database. */
import { MOCK_SALES, MOCK_UPCOMING_BAZAARS } from './mockData';
import { ApiError } from '../../lib/api';
import { clearSession } from '../../lib/auth';
import * as vendorApi from '../../lib/vendor';
import type {
  BazaarApplication,
  GeoPoint,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
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
 * The form holds money as a string because that is how the API returns it;
 * requests want a number with at most two decimals.
 */
function productInput(draft: ProductDraft) {
  return {
    title: draft.title,
    description: draft.description,
    categoryId: draft.categoryId,
    basePrice: Number(draft.basePrice),
    images: draft.images,
    isActive: draft.isActive,
  };
}

const retryButtonStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.45rem 1rem',
  borderRadius: '999px',
  border: '1px solid rgba(255, 255, 255, 0.35)',
  background: 'rgba(255, 255, 255, 0.12)',
  color: '#fff',
  cursor: 'pointer',
};

function variantInput(variant: ProductVariant) {
  return {
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    priceOverride: variant.priceOverride === null ? null : Number(variant.priceOverride),
    stockQuantity: variant.stockQuantity,
  };
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

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<BazaarApplication[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [user, setUser] = useState<vendorApi.CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  /** Set once the wait is long enough to be a cold start rather than latency. */
  const [slow, setSlow] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  /** Surfaces a failed write; the pages have no error prop of their own. */
  const [actionError, setActionError] = useState<string | null>(null);

  const describe = (error: unknown) =>
    error instanceof ApiError ? `${error.code}: ${error.message}` : 'Request failed.';

  /** Everything the shell needs, in parallel. */
  const reload = useCallback(async () => {
    setLoading(true);
    setSlow(false);
    setLoadError(null);
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    try {
      const [me, profile, productPage, orderPage, applicationPage] = await Promise.all([
        vendorApi.getCurrentUser(),
        vendorApi.getVendorProfile(),
        vendorApi.listProducts(),
        vendorApi.listOrders(),
        vendorApi.listApplications(),
      ]);
      setUser(me);
      setVendor(profile);
      setProducts(productPage.data);
      setOrders(orderPage.data);
      setApplications(applicationPage.data);
    } catch (error) {
      setLoadError(describe(error));
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /** Runs a write, reports the failure, and reloads so state matches the server. */
  const run = async (action: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (error) {
      setActionError(describe(error));
    }
  };

  /* When the location endpoint last accepted a change. It allows one update
     a minute, so the form uses this to disable itself rather than letting
     the save come back 429 LOCATION_RATE_LIMITED. */
  const [locationUpdatedAt, setLocationUpdatedAt] = useState<number | null>(null);

  const productCounts = useMemo(() => {
    let active = 0;
    let pending = 0;
    for (const product of products) {
      const visibility = productVisibility(product, vendor?.verified ?? false);
      if (visibility === 'LIVE') active += 1;
      else if (visibility === 'PENDING') pending += 1;
    }
    return { active, pending };
  }, [products, vendor?.verified]);

  /* PATCH /vendors/me/products/:id. Applied optimistically so the switch
     responds at once, then reconciled by the reload inside `run` — which also
     puts the old value back if the API refused. */
  const handleToggleActive = (productId: string, isActive: boolean) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, isActive } : product,
      ),
    );
    void run(() => vendorApi.updateProduct(productId, { isActive }));
  };

  /* PATCH /vendors/me/orders/:id/status. The page only ever offers a
     transition the API accepts, so there's no validation to repeat here. */
  const handleAdvanceStatus = (orderId: string, next: OrderStatus) => {
    void run(() => vendorApi.updateOrderStatus(orderId, next));
  };

  /* POST /vendors/me/products. The API assigns the id and forces
     approvalStatus to PENDING; both are mirrored here so the new row looks
     the way it will once the server has really seen it. */
  const handleCreateProduct = (draft: ProductDraft) => {
    void run(async () => {
      // The product and its variants are separate endpoints, so this is one
      // POST for the product plus one per variant.
      const created = await vendorApi.createProduct(productInput(draft));
      for (const variant of draft.variants) {
        await vendorApi.createVariant(created.id, variantInput(variant));
      }
    });
  };

  /* PATCH /vendors/me/products/:id, then reconcile the variants: the form
     hands back the full set, so anything with a draft id is new, anything
     missing was removed, and the rest may have changed. The list endpoint
     omits variants, so the current set is read back before diffing. */
  const handleUpdateProduct = (productId: string, draft: ProductDraft) => {
    void run(async () => {
      await vendorApi.updateProduct(productId, productInput(draft));

      const existing = (await vendorApi.getProduct(productId)).variants;
      const keptIds = new Set(draft.variants.map((variant) => variant.id));

      for (const variant of existing) {
        if (!keptIds.has(variant.id)) {
          await vendorApi.deleteVariant(productId, variant.id);
        }
      }
      for (const variant of draft.variants) {
        if (existing.some((candidate) => candidate.id === variant.id)) {
          await vendorApi.updateVariant(productId, variant.id, variantInput(variant));
        } else {
          await vendorApi.createVariant(productId, variantInput(variant));
        }
      }
    });
  };

  /* DELETE /vendors/me/products/:id is a soft delete: the row keeps
     existing behind a deletedAt so past orders still resolve, and drops out
     of the list the next read returns. */
  const handleDeleteProduct = (productId: string) => {
    void run(() => vendorApi.deleteProduct(productId));
  };

  /* DELETE /bazaars/:id/apply — keyed by the *bazaar*, not the application,
     so the row is looked up to find it. Only a PENDING application can be
     withdrawn; the API answers 400 APPLICATION_NOT_PENDING otherwise. */
  const handleWithdraw = (applicationId: string) => {
    const application = applications.find((candidate) => candidate.id === applicationId);
    if (!application) return;
    void run(() => vendorApi.withdrawApplication(application.bazaarId));
  };

  /* PATCH /vendors/me. The request field is `businessName` and the response
     calls it `name`, which is the one mapping this dashboard has to do by
     hand. Empty strings go back as null — that's how the API represents an
     unset optional field, and "" would show as a blank value rather than a
     dash on the profile. */
  const handleSaveVendor = (draft: VendorDraft) => {
    void run(() =>
      vendorApi.updateVendorProfile({
        businessName: draft.businessName,
        category: draft.category,
        vendorType: draft.vendorType,
        description: draft.description,
        brandStory: draft.brandStory,
        returnPolicy: draft.returnPolicy,
        shippingPolicy: draft.shippingPolicy,
        logoUrl: draft.logoUrl,
        bannerUrl: draft.bannerUrl,
        coverMedia: draft.coverMedia,
        hasFixedLocation: draft.hasFixedLocation,
      }),
    );
  };

  /* PATCH /vendors/me/location — answers 204, so there's no body to merge.
     Throttled to one call a minute; a second attempt comes back 429. */
  const handleSaveLocation = (location: GeoPoint) => {
    void run(async () => {
      await vendorApi.updateVendorLocation(location);
      setLocationUpdatedAt(Date.now());
    });
  };

  /* DELETE /users/me soft-deletes the account and returns 204. The session is
     dead at that point, so the stored tokens go too and we leave. */
  const handleDeleteAccount = (password: string) => {
    void run(async () => {
      await vendorApi.deleteAccount(password);
      clearSession();
      onExit?.();
    });
  };

  const goTo = (next: DashboardView) => {
    setView(next);
    /* Each screen filters on its own terms, so a query typed for one would
       only confuse the next. */
    setSearch('');
  };

  /* Nothing below can render without the vendor profile: every screen reads
     verified, and the counts key off it. A missing profile means the signed-in
     account has no Vendor row, which is a VENDOR-only dashboard's dead end. */
  if (loading || loadError || !vendor) {
    return (
      <div className={styles.page}>
        <img className={styles.backdrop} src={backdropImage} alt="" aria-hidden="true" />
        <div style={{ position: 'relative', padding: '4rem 1.5rem', textAlign: 'center', color: '#fff' }}>
          {loading && (
            <>
              <p>Loading your dashboard…</p>
              {slow && (
                /* A free Render instance sleeps after about 15 minutes idle and
                   takes up to a minute to wake. Warm, these five reads finish
                   in well under a second, so a long wait is the cold start —
                   worth saying rather than looking frozen. */
                <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>
                  The server is waking up. This can take up to a minute on the first request.
                </p>
              )}
            </>
          )}
          {!loading && loadError && (
            <>
              <p>Could not load your dashboard.</p>
              <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>{loadError}</p>
              <button type="button" onClick={() => void reload()} style={retryButtonStyle}>
                Try again
              </button>
            </>
          )}
          {!loading && !loadError && !vendor && <p>This account has no vendor profile.</p>}
          <button type="button" onClick={onExit} style={{ ...retryButtonStyle, marginLeft: '0.5rem' }}>
            Back to site
          </button>
        </div>
      </div>
    );
  }

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
          {actionError && (
            /* The pages have no error prop; a failed write surfaces here. */
            <div
              role="alert"
              style={{
                margin: '0.75rem',
                padding: '0.6rem 0.9rem',
                borderRadius: '0.5rem',
                background: 'rgba(180, 35, 35, 0.9)',
                color: '#fff',
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <span>{actionError}</span>
              <button
                type="button"
                onClick={() => setActionError(null)}
                style={{ color: '#fff', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
          )}
          <Topbar
            searchPlaceholder={SEARCH_PLACEHOLDERS[view]}
            search={search}
            onSearchChange={setSearch}
            userName={user?.name ?? vendor.name}
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
                userName={user?.name ?? vendor.name}
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
                contactEmail={user?.email ?? ""}
                contactPhone={user?.phone ?? null}
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
