declare namespace ReportDamageRequest {
    export interface CreateReport {
        userId?: string;
        userName?: string;
        type: string;
        description: string;
        location?: {
            coordinates: number[];
            address: string;
        };
        media?: string;
        mediaType?: string;
    }

    export interface UpdateReport {
        reportId: string;
        status?: string;
    }

    export interface GetReportDetails {
        reportId: string;
    }

    export interface ReportListing extends ListingRequest {
    }
}
