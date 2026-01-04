// Nested store info
export interface StoreInfo {
    name: string;
    moneyFormat: string; // e.g. "${{amount}}"
    currencyCode: string; // e.g. "USD", "BDT"
}

// Nested claim order (only present when hasClaimRequest is true)
export interface PackageProtectionClaimOrder {
    id: number;
    orderId: string; // Shopify GID for the order
    storeId: string; // Shopify GID for the shop
    issue: string; // e.g. "DAMAGED"
    requestedResulation: string; // e.g. "RESHIP"
    hasClaimRequest: boolean;
    claimStatus: string; // e.g. "REQUESTED"
    comments: string;
    images: string; // image identifier
    fulfillmentLineItemId: string; // Shopify GID for the line item
    fulfillmentId: string; // Shopify GID for the fulfillment
    claimStatusMessage: string | null;
    fulfillClaim: boolean;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
}

// Main order record
export interface ProtectionOrder {
    id: number;
    orderId: string; // Shopify GID for the order
    customerId: string; // Shopify GID for the customer
    storeId: string; // Shopify GID for the shop
    customerFirstName: string | null;
    customerLastName: string | null;
    customerEmail: string;
    protectionFee: string; // e.g. "11.24"
    orderAmount: string; // e.g. "163.79"
    hasClaimRequest: boolean;
    fulfillmentStatus: string; // e.g. "ON_HOLD", "UNFULFILLED"
    claimStatus: string | null; // e.g. "REQUESTED" or null
    orderName: string; // e.g. "#1002"
    refundAmount: string; // e.g. "0"
    hasPackageProtection: boolean;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    claimDate: string | null; // ISO timestamp or null
    orderDate: string; // ISO timestamp

    PackageProtectionClaimOrder: PackageProtectionClaimOrder[];
    Store: StoreInfo;
}

// Array of orders
export type ProtectionOrderList = ProtectionOrder[];

export interface IPackagePackageProtection {
    insuranceDisplayButton: boolean;
    productHideSelector: string;
    productHideSwitch: boolean;
    storeFrontLog: boolean;
    enabled: boolean;
    storeId: string;
}


// Root type is an array of campaigns
export interface IncludeRule {
    Collections: unknown[];      // empty array in sample; adjust to `string[]` if IDs are strings
    discountValue: string;       // e.g. "20"
    discountType: 'PERCENTAGE' | string;
}

export interface TimezoneInfo {
    id: string;                  // e.g. "Australia/Brisbane"
    countryId: string;           // e.g. "AU"
    gmtOffset: string;           // e.g. "UTC +10:00"
}

export interface Campaign {
    id: string;
    status: 'ACTIVE' | string; // keep open in case other statuses appear
    name: string;

    // ISO date-time strings; endDate can be null
    startDate: string;            // e.g. "2025-11-05T05:23:00.000Z"
    endDate: string | null;
    statusUpdatedAt: string;

    // Time zone IDs
    startDateTimezoneId: string;  // e.g. "Australia/Brisbane"
    endDateTimezoneId: string;    // e.g. "Australia/Brisbane"

    // Media
    campaignImage: string;        // URL

    // Note: these arrive as strings in your payload
    maxDiscount: string;          // e.g. " 20%"
    overDiscountPriceItem: any;

    totalSelectedProducts: string; // e.g. "1217"
    processProducts: number;       // e.g. 1217
    totalProcessProducts: number;  // e.g. 1217

    Includes: IncludeRule[];
    Store?: {
        id: string,
        name: string,
        domain: string,
        uninstalledAt: any,
        installedAt: any,
    },

    StartDateTimeZone: TimezoneInfo;
    EndDateTimeZone: TimezoneInfo;
}


export type CampaignListType = Campaign[];