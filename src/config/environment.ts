"use strict";

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const ENVIRONMENT = process.env.NODE_ENV || "local";

if (ENVIRONMENT === "local") {
	if (fs.existsSync(path.join(process.cwd(), "/.env.local"))) {
		dotenv.config({ path: ".env.local" });
	} else {
		process.exit(1);
	}
}

export const SERVER = {
	APP_NAME: "Cobuild",
	APP_LOGO: "https://appinventiv-development.s3.amazonaws.com/1607946234266_Sqlv5.svg",
	TEMPLATE_PATH: process.cwd() + "/src/views/",
	UPLOAD_DIR: process.cwd() + "/src/uploads/",
	LOG_DIR: process.cwd() + "/logs",
	TOKEN_INFO: {
		// LOGIN_EXPIRATION_TIME: "180d", // 180 days
		EXPIRATION_TIME: {
			USER_REFRESH_TOKEN: 360 * 24 * 60 * 60 * 1000, // 360 days
			USER_LOGIN: 180 * 24 * 60 * 60 * 1000, // 180 days
			ADMIN_LOGIN: 180 * 24 * 60 * 60 * 1000, // 180 days
			FORGOT_PASSWORD: 24 * 60 * 60 * 1000, // 24 hrs
			VERIFY_EMAIL: 10 * 60 * 1000, // 10 mins
			VERIFY_MOBILE: 1 * 60 * 1000, // 1 mins
			ADMIN_OTP_VERIFY: 10 * 60 * 1000, // 10 mins
			OTP_LIMIT: 60 * 60 * 1000, // 60 mins
			RESET: 5 * 60 * 1000, // 5 mins
			SUB_ADMIN_REINVITE: 1 * 24 * 60 * 60 * 1000 // 24 hrs
		},
		ISSUER: process.env["APP_URL"]
	},
	JWT_PRIVATE_KEY: process.cwd() + "/keys/jwtRS256.key",
	JWT_PUBLIC_KEY: process.cwd() + "/keys/jwtRS256.key.pub",
	// for private.key file use RS256, SHA256, RSA
	JWT_ALGO: "RS256",
	SALT_ROUNDS: 10,
	ENC: "102938$#@$^@1ERF",
	CHUNK_SIZE: 1000,
	CREATE_AUTH_TOKEN: "create-auth-token",
	APP_URL: process.env["APP_URL"],
	ADMIN_URL: process.env["ADMIN_URL"],
	ASSISTANT_URL: process.env["ASSISTANT_URL"],
	ADMIN_MICROSERVICE_URL: process.env["ADMIN_MICROSERVICE_URL"],
	AUTH_APP_URL: process.env["AUTH_APP_URL"],
	USER_APP_URL: process.env["USER_APP_URL"],
	NOTIFICATION_APP_URL: process.env["NOTIFICATION_APP_URL"],
	CHAT_APP_URL: process.env["CHAT_APP_URL"],
	API_BASE_URL: "/" + "admin" + "/api",
	DEV_SECRET_NAME: "cobuild-dev-secrets",
	QA_SECRET_NAME: "cobuild-qa-secrets",
	STAGE_SECRET_NAME: "cobuild-stage-secrets",
	PREPROD_SECRET_NAME: "preprod-secrets",
	PRODUCTION_SECRET_NAME: "prod-secrets",
	VERIFY_AUTH_TOKEN: "verify-auth-token",
	VERIFY_COMMON_AUTH_TOKEN: "verify-common-auth-token",
	SEND_MAIL: "notification/email-template",
	MONGO: {
		DB_NAME: process.env["DB_NAME"],
		DB_URL: process.env["DB_URL"],
		OPTIONS: {
			user: process.env["DB_USER"],
			pass: process.env["DB_PASSWORD"],
			useNewUrlParser: true,
		},
		REPLICA: process.env["DB_REPLICA"],
		REPLICA_OPTION: {
			replicaSet: process.env["DB_REPLICA_SET"],
			authSource: process.env["DB_AUTH_SOURCE"],
			ssl: process.env["DB_SSL"]
		}
	},
	TARGET_MONGO: {
		DB_NAME: process.env["TARGET_DB_NAME"],
		DB_URL: process.env["TARGET_DB_URL"],
		OPTIONS: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	},
	ADMIN_CREDENTIALS: {
		EMAIL: process.env["ADMIN_EMAIL"],
		PASSWORD: process.env["ADMIN_PASSWORD"],
		NAME: process.env["ADMIN_NAME"]
	},
	REDIS: {
		HOST: process.env["REDIS_HOST"],
		PORT: process.env["REDIS_PORT"],
		DB: process.env["REDIS_DB"],
		NAMESPACE: "YooshieApp",
		APP_NAME: "Yooshie"
	},
	DEEPLINK_URL: process.env["DEEPLINK_URL"],
	MAIL: {
		SMTP: {
			HOST: process.env["SMTP_HOST"],
			PORT: process.env["SMTP_PORT"],
			USER: process.env["SMTP_USER"],
			PASSWORD: process.env["SMTP_PASSWORD"],
			SECURE: process.env["SECURE"]
		},
		FROM_MAIL: process.env["FROM_MAIL"],
		SENDGRID_API_KEY: process.env["SENDGRID_API_KEY"],

	},

	MESSAGEBIRD: {
		ACCESS_KEY: process.env["MESSAGEBIRD_ACCESS_KEY"]
	},
	BASIC_AUTH: {
		NAME: process.env["BASIC_AUTH_NAME"],
		PASS: process.env["BASIC_AUTH_PASS"]
	},
	API_KEY: process.env['API_KEY'],
	AWS_IAM_USER: {
		ACCESS_KEY_ID: process.env["AWS_ACCESS_KEY"],
		SECRET_ACCESS_KEY: process.env["AWS_SECRET_KEY"]
	},
	S3: {
		ACCESS_KEY_ID: process.env["S3_ACCESS_KEY_ID"],
		SECRET_ACCESS_KEY: process.env["S3_SECRET_ACCESS_KEY"],
		S3_BUCKET_NAME: process.env["S3_BUCKET_NAME"],
		AWS_REGION: "us-east-1",
		BUCKET_URL: process.env["BUCKET_URL"],
		FILE_ACCESS_KEY_ID: process.env["S3_FILE_ACCESS_KEY_ID"],
		FILE_SECRET_ACCESS_KEY: process.env["S3_FILE_SECRET_ACCESS_KEY"],
		S3_FILE_BUCKET_NAME: process.env["S3_FILE_BUCKET_NAME"],
		FILE_BUCKET_URL: process.env["FILE_BUCKET_URL"]
	},
	ENVIRONMENT: process.env["ENVIRONMENT"],
	IP: process.env["IP"],
	ADMIN_PORT: process.env["ADMIN_PORT"],
	PROTOCOL: process.env["PROTOCOL"],
	FCM_SERVER_KEY: process.env["FCM_SERVER_KEY"],
	DISPLAY_COLORS: true,
	MAIL_TYPE: 2,
	IS_REDIS_ENABLE: true,
	IS_SINGLE_DEVICE_LOGIN: {
		PARTICIPANT: true,
		SUPPORTER: true
	},
	IS_MAINTENANCE_ENABLE: process.env["IS_MAINTENANCE_ENABLE"],
	BYPASS_OTP: process.env["BYPASS_OTP"],
	FLOCK_URL: process.env["FLOCK_URL"],
	ACTIVITY_TIME: { // edit/delete time
		GROUP: 10 * 60 * 1000, // 4 hours
		SHIFT: 10 * 60 * 1000  // 2 hours
	},
	IS_RABBITMQ_DELAYED_ENABLE: false,

	RABBITMQ: {
		URL: process.env["RABBITMQ_URL"],
		QUEUE_NAME: process.env["RABBITMQ_QUEUE_NAME"]
	},
	DEFAULT_PASSWORD: "String@123",
	DEFAULT_OTP: "1234",
	AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: '1',
	NOTIFICATION_URL: process.env["NOTIFICATION_URL"],
	SUBSCRIPTION_URL: process.env["SUBSCRIPTION_URL"],
	USER_URL: process.env["USER_URL"],
	SOCIAL_URL: process.env["SOCIAL_URL"],
	CHAT_URL: process.env["CHAT_URL"],
	PYTHON_URL: process.env["PYTHON_URL"],
	KAFKA: {
		URL: process.env["KAFKA_URL"],
		TOPIC1: process.env["KAFKA_TOPIC"]
	},
	GOOGLE_API_KEY: process.env["GOOGLE_API_KEY"],
	ADD_USER: "user/add-user",
	LIST_USER: "user/listing",
	BLOCK_DELETE_USER: "user/block-delete",
	USER_DETAILS: "user/profile",
	EDIT_USER: "user/edit-user",
	JOB: "user/job",
	JOB_LIST: "user/job-list",
	JOBID_DROPDOWN_LIST: "user/jobId-dropdown-list",
	JOB_BY_CATEGORY: "user/jobs-by-category",
	SCHEDULE_JOB: "user/schedule-job",
	REQUEST: "user/request",
	REQUEST_LIST: "user/request-list",
	REQUEST_LIST_BY_CATEGORY: "user/request-by-category",
	REPORT_DAMAGES: "user/report-damage",
	REPORT_DAMAGES_LIST: "user/report-list",
	DASHBOARD: "user/dashboard",
	NOTIFICATION: "notification",
	NOTIFICATION_LIST: "notification-list",
	RECEIVED_NOTIFICATION_LIST: "received-notification-list",
	NOTIFICATION_READ: "notification-read",
	NOTIFICATION_CLEAR: "notification-clear",
	NOTIFICATION_RESEND: "notification-resend",
	REQUEST_ACCEPTED: "request-accepted",
	IMPORT_JOB: "user/import-jobs",
	SEND_NOTFICATION: "push-notification"

};