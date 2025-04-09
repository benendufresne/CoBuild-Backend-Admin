declare namespace ServiceRequest {
  export interface CreateServiceCategory {
    categoryIdString?: string
    serviceType: string;
    categoryName: string;
    issueTypeName?: string;
    subIssueName?: string[];
  }

  export interface GetServiceCategory {
    categoryId: string
  }

  export interface EditServiceCategory {
    categoryId: string;
    serviceType?: string;
    categoryName?: string;
    issueTypeName?: string;
    subIssueName?: string[];
    status?: string
  }

  export interface CreateServiceType {
    name: string
    categoryId: string
    categoryName?: string
    serviceIdString: string
  }

  export interface EditServiceType {
    serviceId: string,
    status?: string
    name?: string
  }

  export interface GetServiceType {
    serviceId: string
  }

  export interface GetServiceListing extends ListingRequest {
  }

  export interface GetServiceCategoryListing extends ListingRequest {
  }

  export interface GetServiceTypeListing extends ListingRequest {
    categoryId?: string
  }

  export interface GetServiceTypeListing {
    categoryIds?: string
  }

  export interface ServiceIdList {
    serviceType: string;
    // categoryName?: string;
    // issueTypeName?: string;
    searchKey?: string;
  }
}
