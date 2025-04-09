
declare namespace JobRequest {
  export interface CreateJob {
    title: string;
    categoryName?: string;
    categoryId?: string;
    serviceName?: string;
    serviceId?: string;
    personalName: string;
    location: {
      coordinates: number[];
      address: string;
    };
    companyLocation?: {
      coordinates: number[];
      address: string;
    };
    email?: string;
    fullMobileNo?: string;
    aboutCompany?: string;
    priority: string;
    procedure?: string;
  }

  export interface GetJob {
    jobId: string;
  }

  export interface UpdateJob {
    jobId: string;
    title?: string;
    categoryName?: string;
    categoryId?: string;
    serviceName?: string;
    serviceId?: string;
    personalName?: string;
    location?: {
      coordinates?: number[];
      address?: string;
    };
    companyLocation?: {
      coordinates?: number[];
      address?: string;
    };
    email?: string;
    fullMobileNo?: string;
    aboutCompany?: string;
    priority?: string;
    procedure?: string;
    status?: string;
  }


  export interface JobList extends ListingRequest {
    priority?: string[];
    isExport?: boolean;
    exportTemplate?: boolean;
  }
  export interface scheduleJob {
    jobId: string;
    schedule: number;
  }

  export interface importJobs {
    file?: string;
  }

}
