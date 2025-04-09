declare namespace ReqRequest {
    export interface CreateReq {
        name: string;
        userName?: string;
        userId: string;
        categoryName: string;
        categoryId: string;
        categoryIdString: string;
        serviceName: string;
        serviceId: string;
        serviceIdString: string;
        location: {
            coordinates: number[];
            address: string;
        };
        description?: string;
        media?: string;
    }

    export interface GetReqDetails {
        reqId: string;
    }

    export interface UpdateReqDetails {
        reqId: string;
        name?: string;

        serviceType?: string;

        categoryName?: string;
        categoryId?: string;
        categoryIdString?: string;

        issueTypeName?: string;
        subIssueName?: string;
        issue?: string;

        location?: {
            coordinates?: number[];
            address?: string;
        };
        description?: string;
        media?: string;
        mediaType?: string;
        estimatedDays?: string;
        amount?: number;
        notes?: string;
        status?: string;
        rejectReason?: string;
    }
    export interface ReqList extends ListingRequest {
        coordinates?: number[];
    }


    export interface AcceptRequest {
        reqId: string;
        userId: string;
        userName?: string;
        userProfilePicture?: string;
        serviceType?: string;
        categoryName?: string;
        categoryId?: string;
        categoryIdString?: string;
        issueTypeName?: string;
        subIssueName?: string;
    }

}
