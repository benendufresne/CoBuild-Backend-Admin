declare namespace SubAdminRequest {
  export interface CreateRole {
    name: string;
    permissions: [string];
  }

  export interface GetRoleDetails {
    roleId: string;
  }

  export interface EditRole {
    roleId: string;
    name?: string;
    permissions?: [string];
    status?: string;
  }

  export interface GetRolesListing extends ListingRequest {

  }

  export interface AddSubAdmin {
    name: string;
    email: string;
    roleId: string;
    roleName: string;
  }

  export interface EditSubAdmin {
    subAdminId: string;
    name?: string;
    email?: string;
    roleId?: string;
    roleName?: string;
  }

  export interface GetSubAdminDetails {
    subAdminId: string;
  }


  export interface GetSubAdminList extends ListingRequest {

  }


}
