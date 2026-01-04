import type {BadgeProps} from "@shopify/polaris";

type TimeZone = {
    id: string;
    countryId: string;
    gmtOffset: string;
};

type DiscountVariantCount = {
    Variants: number;
};

type DiscountIncludes = {
    Collections: any[]; // Assuming it's an array, but the type isn't provided.
};


type campaign = {
    id: number | string;
    storeId: string;
    status: any
    rangeType: any
    name: string;
    description: string | null;
    createCollection: boolean;
    collectionHandle: string | null;
    revenue: string;
    startDate: string | null; // ISO date string
    endDate: string | null; // ISO date string
    startDateTimezoneId: string;
    endDateTimezoneId: string;
    statusUpdatedAt: string | null;
    createdAt: string | null; // ISO date string
    updatedAt: string | null; // ISO date string
    _count: DiscountVariantCount;
    Includes: DiscountIncludes[];
    StartDateTimeZone: TimeZone;
    EndDateTimeZone: TimeZone;
};

export function getCollectionTitle(campaign: campaign): { collections: string[], collectionLength: number } {
    const collections: string[] = [];
    let collectionLength: number = 0;

    campaign.Includes.forEach(include => {
        if (include.Collections.length > 2) {
            [0, 1].forEach(index => {
                collections.push(include.Collections[index].title);
            });
            collectionLength = include.Collections.length;
        } else {
            include.Collections.forEach(collection => {
                collections.push(collection.title);
            });
            collectionLength += include.Collections.length;
        }
    });

    return {
        collections: collections.length > 2 ? collections.slice(0, 2) : collections,
        collectionLength
    };
}


type CampaignStatus =
    | 'Draft'
    | 'Processing'
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'INACTIVE'
    | 'Ended'
    | 'Analyzing'
    | 'Filtering'
    | 'Cancelled'
    | 'Price_reverting'
    | 'Price_updating'
    | 'Tags_updating'
    | 'Tags_reverting'
    | 'Importing_products'
    | 'Pending'
    | 'Pending_deactivation'
    | 'Pending_activation';

const deActiveStatus = [
    'Processing',
    'Analyzing',
    'Filtering',
    'Price_reverting',
    'Tags_reverting',
    'Pending',
    'Pending_deactivation',
    'Duplicate_resolving',
    'PROCESSING',
    'ANALYZING',
    'FILTERING',
    'PRICE_REVERTING',
    'TAGS_REVERTING',
    'PENDING',
    'PENDING_DEACTIVATION',
    'DUPLICATE_RESOLVING',
];

export function getCampaignStatusBadgeProps(
    status: CampaignStatus,
    content?: string
): BadgeProps {
    const tone: BadgeProps['tone'] =
        status === 'ACTIVE'
            ? 'success'
            : status === 'Ended'
                ? 'read-only'
                : status === 'SCHEDULED' || status === 'Importing_products'
                    ? 'info'
                    : status === 'INACTIVE' ||
                    status === 'Draft' ||
                    status === 'Cancelled'
                        ? undefined
                        : deActiveStatus.includes(status)
                            ? 'attention'
                            : status === 'Price_updating' ||
                            status === 'Tags_updating' ||
                            status === 'Pending_activation'
                                ? 'info'
                                : undefined;

    // const icon: BadgeProps['icon'] =
    //   status === 'Active'
    //     ? ''
    //     : status === 'Ended'
    //       ? Icons.CheckCircleIcon
    //       : status === 'Scheduled'
    //         ? Icons.ClockIcon
    //         : status === 'Inactive'
    //           ? undefined
    //           : status === 'Processing'
    //             ? Icons.SettingsIcon
    //             : status === 'Analyzing'
    //               ? Icons.ClockIcon
    //               : status === 'Price_reverting' || status === 'Tags_reverting'
    //                 ? Icons.RedoIcon
    //                 : status === 'Price_updating' || status === 'Tags_updating'
    //                   ? Icons.RefreshIcon
    //                   : Icons.NoteIcon;

    // Format the status for display in children
    const formattedStatus = status
        .split('_') // Split the status by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join them back with spaces
    const c = content ? content : '';
    return { tone, children: formattedStatus + ' ' + c };
}


export const formatNumber = (num: any) => {
    // Convert string to number (if needed)
    const number = typeof num === 'string' ? parseFloat(num) : num;

    // Handle invalid numbers (NaN, null, undefined)
    if (typeof number !== 'number' || isNaN(number)) {
        return '0'; // or throw error, return 'N/A', etc.
    }

    // Format logic
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (number >= 1000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return number.toString();
};
