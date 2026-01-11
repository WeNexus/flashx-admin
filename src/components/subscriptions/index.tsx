import { useEffect, useMemo, useState } from 'react';
import {useNavigate, useSearchParams} from "react-router";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  DataTable,
  InlineStack,
  Page,
  Pagination,
  Select,
  Text,
  TextField,
} from '@shopify/polaris';
import { BASE_URL } from '../../config';
import  {type SubscriptionData,type SubscriptionStatus, SubscriptionStatuss,} from './type';
import useDebounce from '../../hooks/debounce';

function clampInt(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatDateTime(dt?: string | Date | null) {
  if (!dt) return '-';
  const d = typeof dt === 'string' ? new Date(dt) : dt;
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function statusTone(status: SubscriptionStatus) {
  if (status === SubscriptionStatuss.ACTIVE) return 'success';
  if (status === SubscriptionStatuss.PENDING) return 'attention';
  if (status === SubscriptionStatuss.FROZEN) return 'warning';
  if (status === SubscriptionStatuss.CANCELED) return 'critical';
  if (status === SubscriptionStatuss.EXPIRED) return 'critical';
  return 'info';
}

function formatMoneyCents(cents: number) {
  const value = (cents / 100).toFixed(2);
  return `$${value}`;
}

export default function SubscriptionsRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const page = clampInt(Number(searchParams.get('page') || '1'), 1, 100000);
  const perPage = clampInt(Number(searchParams.get('perPage') || '20'), 5, 50);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'ALL';

  const [search, setSearch] = useState(q);
  const [statusFilter, setStatusFilter] = useState<string>(status);

  const searchTerm = useDebounce(search, 700);

  useEffect(() => {
    setSearch(q);
    setStatusFilter(status);
  }, [q, status]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('perPage', String(perPage));
    if (searchTerm) params.set('q', searchTerm);
    if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);

    fetch(`${BASE_URL}/api/subscriptions?${params.toString()}`)
      .then((res) => res.json())
      .then((res: SubscriptionData) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching subscriptions:', err);
        setLoading(false);
      });
  }, [page, perPage, searchTerm, statusFilter]);

  function goWithParams(next: {
    q?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) {
    const sp = new URLSearchParams(searchParams);

    if (next.q !== undefined) {
      if (next.q.trim()) {
        sp.set('q', next.q.trim());
      } else {
        sp.delete('q');
      }
    }

    if (next.status !== undefined) {
      if (next.status && next.status !== 'ALL') {
        sp.set('status', next.status);
      } else {
        sp.delete('status');
      }
    }

    if (next.page !== undefined) sp.set('page', String(next.page));
    if (next.perPage !== undefined) sp.set('perPage', String(next.perPage));

    navigate(`?${sp.toString()}`);
  }

  function applyFilters() {
    goWithParams({ q: search, status: statusFilter, page: 1 });
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('ALL');
    navigate('?page=1&perPage=' + perPage);
  }

  const statusOptions = [
    { label: 'All stores', value: 'ALL' },
    { label: 'No subscription', value: 'NONE' },
    { label: 'Active', value: SubscriptionStatuss.ACTIVE },
    { label: 'Pending', value: SubscriptionStatuss.PENDING },
    { label: 'Frozen', value: SubscriptionStatuss.FROZEN },
    { label: 'Canceled', value: SubscriptionStatuss.CANCELED },
    { label: 'Expired', value: SubscriptionStatuss.EXPIRED },
  ];

  const perPageOptions = [
    {label: '1', value: '1'},
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: '50', value: '50' },
  ];

  const rows = useMemo(() => {
    if (!data) return [];
    return data.items.map((s) => {
      const sub = s.StoreSubscription;
      const plan = sub?.plan;

      const planCell = plan ? (
        <InlineStack key={`plan-${s.id}`} gap="200" align="start">
          {/*<Text as="span" variant="bodyMd">*/}
          {/*  {plan.name}*/}
          {/*</Text>*/}
          <Badge tone={plan.isActive ? 'success' : 'warning'}>
            {`${plan.handle} • ${formatMoneyCents(plan.priceCents)} •
            ${plan.interval}`}
          </Badge>
        </InlineStack>
      ) : (
        <Badge key={`plan-${s.id}`} tone="info">
          No subscription
        </Badge>
      );

      const statusCell = sub ? (
        <Badge key={`status-${s.id}`} tone={statusTone(sub.status)}>
          {sub.status}
        </Badge>
      ) : (
        <Badge key={`status-${s.id}`} tone="info">
          NONE
        </Badge>
      );

      return [
        s.domain || '-',
        s.name || '-',
        planCell,
        statusCell,
        sub?.shopifySubscriptionGid ? sub.shopifySubscriptionGid : '-',
        formatDateTime(sub?.currentPeriodStartAt ?? null),
        formatDateTime(sub?.currentPeriodEndAt ?? null),
        formatDateTime(sub?.updatedAt ?? s.updatedAt),
      ];
    });
  }, [data]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-12xl p-4">
        <Page fullWidth={true} title="Store subscriptions">
          <Text as="p">Loading...</Text>
        </Page>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-12xl p-4">
        <Page fullWidth={true} title="Store subscriptions">
          <Text as="p">Error loading data</Text>
        </Page>
      </div>
    );
  }

  const { totals, filters } = data;
  const { totalFiltered, totalPages } = filters;

  return (
    <div className="mx-auto w-full max-w-12xl p-4">
      <Page fullWidth={true} title="Store subscriptions">
        <div className="space-y-4">
          {/* Top summary cards */}
          <div className="grid gap-4 grid-cols-3">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Total subscriptions
                </Text>
                <Text as="p" variant="heading2xl">
                  {totals.totalSubscriptions}
                </Text>
                <Text as="p" variant="bodySm">
                  Stores with subscription row
                </Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Total stores
                </Text>
                <Text as="p" variant="heading2xl">
                  {totals.totalStores}
                </Text>
                <Text as="p" variant="bodySm">
                  All stores in database
                </Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Canceled or expired
                </Text>
                <Text as="p" variant="heading2xl">
                  {totals.totalCanceledOrExpired}
                </Text>
                <Text as="p" variant="bodySm">
                  CANCELED + EXPIRED
                </Text>
              </BlockStack>
            </Card>
          </div>

          {/* Filters + table */}
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingMd">
                  Stores and subscriptions
                </Text>
                <Badge tone="info">
                  {`${String(totalFiltered)} result${totalFiltered === 1 ? '' : 's'}`}
                </Badge>
              </InlineStack>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <TextField
                  label="Search"
                  value={search}
                  onChange={setSearch}
                  autoComplete="off"
                  placeholder="Search by store domain or name"
                />

                <Select
                  label="Subscription status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v)}
                />

                <Select
                  label="Per page"
                  options={perPageOptions}
                  value={String(perPage)}
                  onChange={(v) =>

                    {

                      goWithParams({ perPage: Number(v), page: 1 })
                    }
                  }
                />

                <div className="flex items-end gap-2">
                  <Button variant="primary" onClick={applyFilters}>
                    Apply
                  </Button>
                  <Button onClick={resetFilters}>Reset</Button>
                </div>
              </div>

              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Domain',
                  'Store',
                  'Plan',
                  'Status',
                  'Shopify gid',
                  'Period start',
                  'Period end',
                  'Updated',
                ]}
                rows={rows}
              />

              <InlineStack align="space-between">
                <Text as="p" variant="bodySm">
                  Page {page} of {totalPages}
                </Text>

                <Pagination
                  hasPrevious={page > 1}
                  onPrevious={() => goWithParams({ page: page - 1 })}
                  hasNext={page < totalPages}
                  onNext={() => goWithParams({ page: page + 1 })}
                />
              </InlineStack>
            </BlockStack>
          </Card>
        </div>
      </Page>
    </div>
  );
}