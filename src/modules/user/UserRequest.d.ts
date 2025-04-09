declare namespace UserRequest {

  export interface DeleteAccount {
    password: string;
  }

  export interface supportChat {
    message: string;
    type: number;
    userId?: string;
  }

  export interface Setting {
    pushNotificationStatus: boolean;
    groupaNotificationStatus: boolean;
    isProfileHidden: boolean;
  }
  export interface EditProfile {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    name?: string;
    isProfileCompleted?: boolean;
    countryCode?: string;
    mobileNo?: string;
    flagCode?: string;
  }

  export interface UploadDocument {
    type: string;
    documentUrl: string;
    documentUploadToken?: string;
  }

  export interface UserList extends ListingRequest {
    isExport?: boolean;
    userType?: string;
    lat?: number;
    lng?: number;
    users?: any[];
    gender?: string;
    categoryIds?: any;
    interestIds?: any;
    activityId?: string;
  }

  export interface NotificationList {
    pageNo: number;
    limit: number;
  }

  export interface ManageNotification {
    pushNotificationStatus: boolean;
    groupaNotificationStatus: boolean;
  }
  export interface NotificationStatus {
    isRead: boolean;
    notificationId: boolean;
  }

  export interface OnboardSuccess {
    userId: string;
  }

  export interface PreSignedUrl {
    filename: "string";
    fileType: "string";
  }

  export interface blockDeleteUser {
    type: string;
    userId: string;
  }

  export interface AddUser extends Device{
    name: string;
    countryCode: string;
    mobileNo: string;
    email: string;
    location?: {
      coordinates?: number[];
      address?: string;
    };
  }

  export interface EditUser {
    userId: string;
    name?: string;
    countryCode?: string;
    mobileNo?: string;
    email?: string;
    location?: {
      coordinates?: number[];
      address?: string;
    };
  }
}
