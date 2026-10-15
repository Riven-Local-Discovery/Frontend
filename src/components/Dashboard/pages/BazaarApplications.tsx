import { useMemo, useState } from 'react';
import { periodChange } from '../derive';
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DotsVerticalIcon,
  DownloadIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserIcon,
  XCircleIcon,
} from '../../icons';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Pagination, SearchField, SelectField } from '../ui/Controls';
import ApplicationDetails from './ApplicationDetails';
import PageHero from '../ui/PageHero';
import StatCard from '../ui/StatCard';
import StatusPill, { applicationTone } from '../ui/StatusPill';
import {
  applicationLabel,
  formatDate,
  formatDateRange,
  formatDistance,
  formatTime,
  formatTimeRange,
  rangeLabel,
} from '../format';
import type { BazaarApplication } from '../types';
import styles from './BazaarApplications.module.scss';

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
] as const;

const PERIOD_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
] as const;

export interface BazaarApplicationsProps {
  applications: BazaarApplication[];
  /**
   * Withdraws an application. DELETE /bazaars/:id/apply only works while the
   * application is still PENDING, so the row hides the action otherwise.
   */
  onWithdraw: (applicationId: string) => void;
  onExport?: () => void;
}

export default function BazaarApplications({
  applications,
  onWithdraw,
  onExport,
}: BazaarApplicationsProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [period, setPeriod] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<BazaarApplication | null>(null);

  /* Real 30-day comparison on the total; the per-status cards carry none,
     since a decision can land long after the application was filed. */
  const applicationsChange = useMemo(
    () => periodChange(applications.map((application) => application.appliedAt)),
    [applications],
  );

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const application of applications) {
      counts[application.applicationStatus] =
        (counts[application.applicationStatus] ?? 0) + 1;
    }
    return {
      total: applications.length,
      pending: counts.PENDING ?? 0,
      accepted: counts.ACCEPTED ?? 0,
      rejected: counts.REJECTED ?? 0,
    };
  }, [applications]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const cutoff =
      period === 'all' ? null : Date.now() - Number(period) * 24 * 60 * 60 * 1000;

    return applications.filter((application) => {
      if (status !== 'all' && application.applicationStatus !== status) return false;
      if (cutoff !== null && new Date(application.appliedAt).getTime() < cutoff) {
        return false;
      }
      if (!needle) return true;

      return (
        application.bazaar.name.toLowerCase().includes(needle) ||
        (application.organizerName ?? '').toLowerCase().includes(needle) ||
        (application.locationLabel ?? '').toLowerCase().includes(needle)
      );
    });
  }, [applications, search, status, period]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const detail = detailId
    ? applications.find((application) => application.id === detailId)
    : undefined;

  const allOnPageSelected =
    visible.length > 0 && visible.every((application) => selected.has(application.id));

  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allOnPageSelected) visible.forEach((application) => next.delete(application.id));
    else visible.forEach((application) => next.add(application.id));
    setSelected(next);
  };

  const toggleOne = (applicationId: string) => {
    const next = new Set(selected);
    if (next.has(applicationId)) next.delete(applicationId);
    else next.add(applicationId);
    setSelected(next);
  };

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Bazaar Applications"
        title="Bazaar Applications"
        lede="Track your applications to upcoming bazaars and manage your status."
        action={
          <SelectField
            label="Date range"
            value={period}
            onChange={(value) => {
              setPeriod(value);
              setPage(1);
            }}
            options={PERIOD_OPTIONS}
            icon={CalendarIcon}
          />
        }
      />

      <div className={styles.statGrid}>
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={CalendarDaysIcon}
          tone="blue"
          delta={
            applicationsChange && { ...applicationsChange, note: 'vs last 30 days' }
          }
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={ClockIcon}
          tone="amber"
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          icon={CheckCircleIcon}
          tone="green"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircleIcon}
          tone="red"
        />
      </div>

      <div className={styles.filters}>
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by bazaar name or organizer..."
        />
        <SelectField
          label="Filter by status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          icon={ShieldCheckIcon}
        />
        <SelectField
          label="Filter by date"
          value={period}
          onChange={(value) => {
            setPeriod(value);
            setPage(1);
          }}
          options={PERIOD_OPTIONS}
          icon={CalendarIcon}
        />
        <button type="button" className={styles.export} onClick={onExport}>
          <DownloadIcon size={15} />
          Export Applications
        </button>
      </div>

      <section className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={allOnPageSelected}
            onChange={toggleAllOnPage}
            aria-label="Select all applications on this page"
          />
          <span>#</span>
          <span>Bazaar</span>
          <span>Organizer</span>
          <span>Location</span>
          <span>Dates</span>
          <span>Status</span>
          <span>Applied At</span>
          <span>Actions</span>
        </div>

        {visible.length === 0 ? (
          <div className={styles.empty}>
            <strong>No applications match these filters</strong>
            <span>Browse open bazaars to apply for your next market.</span>
          </div>
        ) : (
          visible.map((application) => {
            const { bazaar } = application;

            return (
              <div key={application.id} className={styles.row}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={selected.has(application.id)}
                  onChange={() => toggleOne(application.id)}
                  aria-label={`Select application to ${bazaar.name}`}
                />

                <span className={styles.reference}>#{application.id.replace('app-', '')}</span>

                <div className={styles.bazaar}>
                  <img className={styles.thumb} src={bazaar.coverMedia[0]} alt="" />
                  <div className={styles.bazaarText}>
                    <strong>{bazaar.name}</strong>
                    <span className={styles.tags}>
                      {(application.tags ?? []).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <div className={styles.meta}>
                  <UserIcon size={15} />
                  <div className={styles.metaText}>
                    <strong>{application.organizerName ?? '—'}</strong>
                    <span>Organizer</span>
                  </div>
                </div>

                <div className={styles.meta}>
                  <MapPinIcon size={15} />
                  <div className={styles.metaText}>
                    <strong>{application.locationLabel ?? '—'}</strong>
                    <span>{formatDistance(application.distanceKm)}</span>
                  </div>
                </div>

                <div className={styles.meta}>
                  <CalendarIcon size={15} />
                  <div className={styles.metaText}>
                    <strong>{formatDateRange(bazaar.startDate, bazaar.endDate)}</strong>
                    <span>{formatTimeRange(bazaar.startDate, bazaar.endDate)}</span>
                  </div>
                </div>

                <span>
                  <StatusPill tone={applicationTone(application.applicationStatus)}>
                    {applicationLabel(application.applicationStatus)}
                  </StatusPill>
                </span>

                <span className={styles.timestamp}>
                  {formatDate(application.appliedAt)}
                  <span>{formatTime(application.appliedAt)}</span>
                </span>

                <span className={styles.actions}>
                  {/* Stacked, not side by side: this table already carries
                      nine columns, and two full labels in a row make it
                      wider than the page can show. */}
                  <span className={styles.actionStack}>
                    <button
                      type="button"
                      className={styles.viewButton}
                      onClick={() => setDetailId(application.id)}
                    >
                      View Details
                    </button>
                    {/* Withdrawing is only possible while the organizer
                        hasn't decided; once accepted or rejected the row is
                        history. */}
                    {application.applicationStatus === 'PENDING' && (
                      <button
                        type="button"
                        className={styles.withdrawButton}
                        onClick={() => setWithdrawing(application)}
                      >
                        Withdraw
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`More actions for ${bazaar.name}`}
                  >
                    <DotsVerticalIcon size={15} />
                  </button>
                </span>
              </div>
            );
          })
        )}
      </section>

      <footer className={styles.tableFooter}>
        <p>{rangeLabel(currentPage, PAGE_SIZE, filtered.length, 'applications')}</p>
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onChange={setPage}
        />
      </footer>

      {detail && (
        <ApplicationDetails
          application={detail}
          onClose={() => setDetailId(null)}
          onWithdraw={(application) => {
            /* Hand off to the confirm step rather than withdrawing straight
               from the detail view — it can't be undone. */
            setDetailId(null);
            setWithdrawing(application);
          }}
        />
      )}

      {withdrawing && (
        <ConfirmDialog
          title="Withdraw application"
          message={`Your application to ${withdrawing.bazaar.name} will be removed. You can apply again while the bazaar is still open, but your place in the queue is not kept.`}
          confirmLabel="Withdraw"
          destructive
          onCancel={() => setWithdrawing(null)}
          onConfirm={() => {
            onWithdraw(withdrawing.id);
            setWithdrawing(null);
          }}
        />
      )}
    </div>
  );
}
