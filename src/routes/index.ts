"use strict";

/**
 * v1 routes
 */

// admin routes
import { adminRoute as adminRouteV1 } from "@modules/admin/v1/adminRoute";

import { contentRoute as contentRouteV1 } from "@modules/content/v1/contentRoute";

import { notificationRoute as notificationRouteV1 } from "@modules/notification/v1/notificationRoute";

import { userRoute as userRouteV1 } from "@modules/user/v1/UserRoute";

import { jobRoute as jobRouteV1 } from "@modules/job/v1/JobRoute";

import { serviceRoute as serviceRouteV1 } from "@modules/service/v1/ServiceRoute";

import { requestRoute as requestRouteV1 } from "@modules/request/v1/RequestRoute";

import { reportDamageRouteV1 } from "@modules/reportDamage";

import { subAdminRoute as subAdminRouteV1 } from "@modules/subAdmin";

import { dashboardRoute as dashboardRouteV1 } from "@modules/dashboard";

export { notificationRoute as notificationRouteV1 } from "@modules/notification"

export const routes: any = [
  ...adminRouteV1,
  ...contentRouteV1,
  ...notificationRouteV1,
  ...userRouteV1,
  ...jobRouteV1,
  ...serviceRouteV1,
  ...requestRouteV1,
  ...reportDamageRouteV1,
  ...subAdminRouteV1,
  ...dashboardRouteV1
];
