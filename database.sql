USE healthpal;
USE healthpal;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS anonymous_messages;
DROP TABLE IF EXISTS anonymous_sessions;
DROP TABLE IF EXISTS support_group_members;
DROP TABLE IF EXISTS support_groups;
DROP TABLE IF EXISTS workshop_registrations;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS public_health_alerts;
DROP TABLE IF EXISTS health_guides;
DROP TABLE IF EXISTS inventory_registry;
DROP TABLE IF EXISTS medicine_requests;
DROP TABLE IF EXISTS sponsorship_verification;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS recovery_updates;
DROP TABLE IF EXISTS treatment_requests;
DROP TABLE IF EXISTS consultation_slots;
DROP TABLE IF EXISTS support_group_messages;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS mental_health_consultations;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS surgical_missions;
DROP TABLE IF EXISTS mission_registrations;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

--------------------------------------------------------
-- 1) USERS
--------------------------------------------------------
CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255),
  `email` VARCHAR(255),
  `contact_phone` VARCHAR(255),
  `password_hash` VARCHAR(255),
  `role` ENUM('patient','doctor','donor','ngo','admin','hospital'),
  `specialty` VARCHAR(255),
  `language_pref` VARCHAR(255),
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `official_document_url` VARCHAR(255),
  `registration_number` VARCHAR(255),
  `website_url` VARCHAR(255),
  `verification_status` ENUM('none','requested','verified','rejected') DEFAULT 'none',
  `verification_requested_at` TIMESTAMP NULL,
  `verified_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 2) CONSULTATIONS
--------------------------------------------------------
CREATE TABLE `consultations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `patient_id` INT,
  `doctor_id` INT,
  `specialty` VARCHAR(255),
  `status` ENUM('pending','confirmed','completed','cancelled'),
  `mode` ENUM('video','audio','chat'),
  `notes` TEXT,
  `slot_id` INT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 3) MENTAL HEALTH CONSULTATIONS
--------------------------------------------------------
CREATE TABLE `mental_health_consultations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `consultation_id` INT UNIQUE,
  `trauma_type` ENUM('war_trauma','loss','childhood','stress','other'),
  `severity_level` ENUM('mild','moderate','severe','critical'),
  `anonymity` BOOLEAN DEFAULT FALSE,
  `age_group` ENUM('child','teen','adult','senior'),
  `session_focus` TEXT,
  `follow_up_required` BOOLEAN DEFAULT FALSE,
  `follow_up_notes` TEXT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 4) CONNECTIONS
--------------------------------------------------------
CREATE TABLE `connections` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `patient_id` INT,
  `doctor_id` INT,
  `connected_at` TIMESTAMP NULL,
  `status` ENUM('active','inactive')
);

--------------------------------------------------------
-- 5) MESSAGES
--------------------------------------------------------
CREATE TABLE `messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `consultation_id` INT,
  `sender_id` INT,
  `receiver_id` INT,
  `message_text` TEXT,
  `language` VARCHAR(255),
  `translated_text` TEXT,
  `created_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 6) SUPPORT GROUP MESSAGES
--------------------------------------------------------
CREATE TABLE `support_group_messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT,
  `sender_id` INT,
  `message_text` TEXT,
  `created_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 7) CONSULTATION SLOTS
--------------------------------------------------------
CREATE TABLE `consultation_slots` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` INT,
  `start_datetime` DATETIME,
  `end_datetime` DATETIME,
  `is_booked` BOOLEAN,
  `consultation_id` INT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 8) TREATMENT REQUESTS (SPONSORSHIPS)
--------------------------------------------------------
CREATE TABLE `treatment_requests` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `consultation_id` INT,
  `doctor_id` INT,
  `patient_id` INT,
  `treatment_type` ENUM('note','prescription','attachment','surgery','cancer_treatment','dialysis','rehabilitation'),
  `content` TEXT,
  `medicine_name` VARCHAR(255),
  `dosage` VARCHAR(255),
  `frequency` VARCHAR(255),
  `duration` VARCHAR(255),
  `attachment_type` ENUM('image','lab_result','other'),
  `file_url` VARCHAR(255),
  `description` TEXT,
  `sponsered` BOOLEAN,
  `goal_amount` DECIMAL(10,2),
  `raised_amount` DECIMAL(10,2) DEFAULT 0,
  `status` ENUM('open','funded','closed','cancelled') DEFAULT 'open',
  `language` VARCHAR(255),
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 9) RECOVERY UPDATES
--------------------------------------------------------
CREATE TABLE `recovery_updates` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `patient_id` INT,
  `content` TEXT,
  `file_url` VARCHAR(255),
  `status` ENUM('improving','stable','critical','recovered'),
  `created_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 10) DONATIONS
--------------------------------------------------------
CREATE TABLE `donations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `treatment_request_id` INT,
  `donor_id` INT,
  `amount` DECIMAL(10,2),
  `donated_at` TIMESTAMP NULL,
  `verified` BOOLEAN DEFAULT FALSE
);

--------------------------------------------------------
-- 11) SPONSORSHIP VERIFICATION
--------------------------------------------------------
CREATE TABLE `sponsorship_verification` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `treatment_request_id` INT,
  `approved` BOOLEAN DEFAULT FALSE,
  `receipt_url` VARCHAR(255),
  `patient_feedback` TEXT,
  `approved_at` TIMESTAMP NULL,
  `approved_by` INT,
  `created_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 12) MEDICINE REQUESTS  (جزء الـ Medication Coordination)
--------------------------------------------------------
CREATE TABLE `medicine_requests` (
  `request_id` INT PRIMARY KEY AUTO_INCREMENT,
  `patient_id` INT,
  `item_name_requested` VARCHAR(255),
  `quantity_needsys_configed` INT,
  `delivery_location` VARCHAR(255),
  `assigned_source_id` INT,
  `status` ENUMsys_config('pending','available','in_progress','fulfilled','rejected','cancelled') DEFAULT 'pending',
  `requested_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fulfilled_by` INT,
  `fulfilled_date` TIMESTAMP NULL,
  `notes` TEXT
);

--------------------------------------------------------
-- 13) INVENTORY REGISTRY  (مخزون أدوية/معدات)
--------------------------------------------------------
CREATE TABLE `inventory_registry` (
  `item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `type` ENUM('medicine','equipment'),
  `quantity_available` INT,
  `total_quantity` INT,
  `storage_location` VARCHAR(255),
  `condition` ENUM('good','needs_repair','out_of_service','expired','damaged'),
  `expiry_date` DATE,
  `source_id` INT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 14) HEALTH GUIDES  (جزء Health Education)
--------------------------------------------------------
CREATE TABLE `health_guides` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `category` ENUM('first_aid','chronic_illness','nutrition','maternal_care','mental_health','other'),
  `description` TEXT,
  `media_url` VARCHAR(255),
  `language` VARCHAR(255) DEFAULT 'ar',
  `created_by` INT,
  `approved` BOOLEAN DEFAULT FALSE,
  `approved_by` INT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 15) PUBLIC HEALTH ALERTS  (Alerts)
--------------------------------------------------------
CREATE TABLE `public_health_alerts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `message` TEXT,
  `alert_type` ENUM('disease_outbreak','air_quality','urgent_need','general'),
  `severity` ENUM('low','moderate','high','critical'),
  `country` VARCHAR(255),
  `city` VARCHAR(255),
  `published_by` INT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 16) WORKSHOPS
--------------------------------------------------------
CREATE TABLE `workshops` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `topic` VARCHAR(255),
  `description` TEXT,
  `mode` ENUM('online','in_person'),
  `location` VARCHAR(255),
  `date` DATETIME,
  `duration` INT,
  `created_by` INT,
  `approved` BOOLEAN DEFAULT FALSE,
  `approved_by` INT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 17) WORKSHOP REGISTRATIONS
--------------------------------------------------------
CREATE TABLE `workshop_registrations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `workshop_id` INT,
  `user_id` INT,
  `registered_at` TIMESTAMP NULL,
  `attended` BOOLEAN DEFAULT FALSE
);

--------------------------------------------------------
-- 18) SUPPORT GROUPS
--------------------------------------------------------
CREATE TABLE `support_groups` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `topic` ENUM('chronic_illness','disability','loss','trauma','mental_health','other'),
  `description` TEXT,
  `mode` ENUM('online','in_person'),
  `meeting_link` VARCHAR(255),
  `location` VARCHAR(255),
  `created_by` INT,
  `moderator_id` INT,
  `max_members` INT DEFAULT 50,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 19) SUPPORT GROUP MEMBERS
--------------------------------------------------------
CREATE TABLE `support_group_members` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT,
  `user_id` INT,
  `joined_at` TIMESTAMP NULL,
  `is_active` BOOLEAN DEFAULT TRUE
);

--------------------------------------------------------
-- 20) ANONYMOUS SESSIONS
--------------------------------------------------------
CREATE TABLE `anonymous_sessions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `therapist_id` INT,
  `pseudo_patient_name` VARCHAR(255),
  `session_token` VARCHAR(255),
  `started_at` TIMESTAMP NULL,
  `ended_at` TIMESTAMP NULL,
  `active` BOOLEAN DEFAULT TRUE
);

--------------------------------------------------------
-- 21) ANONYMOUS MESSAGES
--------------------------------------------------------
CREATE TABLE `anonymous_messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `session_id` INT,
  `sender_role` ENUM('therapist','patient'),
  `message_text` TEXT,
  `created_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 22) MISSIONS
--------------------------------------------------------
CREATE TABLE `missions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `description` TEXT,
  `doctor_id` INT,
  `ngo_id` INT,
  `location` VARCHAR(255),
  `start_datetime` DATETIME,
  `end_datetime` DATETIME,
  `registration_expiration` DATETIME,
  `slots_available` INT,
  `slots_filled` INT DEFAULT 0,
  `status` ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- 23) MISSION REGISTRATIONS
--------------------------------------------------------
CREATE TABLE `mission_registrations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `mission_id` INT,
  `patient_id` INT,
  `registered_at` TIMESTAMP NULL,
  `attended` BOOLEAN DEFAULT FALSE
);

--------------------------------------------------------
-- 24) SURGICAL MISSIONS
--------------------------------------------------------
CREATE TABLE `surgical_missions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `description` TEXT,
  `doctor_id` INT,
  `ngo_id` INT,
  `location` VARCHAR(255),
  `start_datetime` DATETIME,
  `end_datetime` DATETIME,
  `status` ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

--------------------------------------------------------
-- RELATIONSHIPS (FOREIGN KEYS)
--------------------------------------------------------
ALTER TABLE `consultations`
  ADD FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`slot_id`)   REFERENCES `consultation_slots`(`id`);

ALTER TABLE `mental_health_consultations`
  ADD FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`);

ALTER TABLE `connections`
  ADD FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`);

ALTER TABLE `messages`
  ADD FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`),
  ADD FOREIGN KEY (`sender_id`)       REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`receiver_id`)     REFERENCES `users`(`id`);

ALTER TABLE `support_group_messages`
  ADD FOREIGN KEY (`group_id`) REFERENCES `support_groups`(`id`),
  ADD FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`);

ALTER TABLE `consultation_slots`
  ADD FOREIGN KEY (`doctor_id`)       REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`);

ALTER TABLE `treatment_requests`
  ADD FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`),
  ADD FOREIGN KEY (`doctor_id`)       REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`patient_id`)      REFERENCES `users`(`id`);

ALTER TABLE `recovery_updates`
  ADD FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`);

ALTER TABLE `donations`
  ADD FOREIGN KEY (`treatment_request_id`) REFERENCES `treatment_requests`(`id`),
  ADD FOREIGN KEY (`donor_id`)             REFERENCES `users`(`id`);

ALTER TABLE `sponsorship_verification`
  ADD FOREIGN KEY (`treatment_request_id`) REFERENCES `treatment_requests`(`id`),
  ADD FOREIGN KEY (`approved_by`)          REFERENCES `users`(`id`);

ALTER TABLE `medicine_requests`
  ADD FOREIGN KEY (`patient_id`)         REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`assigned_source_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`fulfilled_by`)       REFERENCES `users`(`id`);

ALTER TABLE `inventory_registry`
  ADD FOREIGN KEY (`source_id`) REFERENCES `users`(`id`);

ALTER TABLE `health_guides`
  ADD FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`);

ALTER TABLE `public_health_alerts`
  ADD FOREIGN KEY (`published_by`) REFERENCES `users`(`id`);

ALTER TABLE `workshops`
  ADD FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`);

ALTER TABLE `workshop_registrations`
  ADD FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`),
  ADD FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`);

ALTER TABLE `support_groups`
  ADD FOREIGN KEY (`created_by`)   REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`);

ALTER TABLE `support_group_members`
  ADD FOREIGN KEY (`group_id`) REFERENCES `support_groups`(`id`),
  ADD FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`);

ALTER TABLE `anonymous_sessions`
  ADD FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`);

ALTER TABLE `anonymous_messages`
  ADD FOREIGN KEY (`session_id`) REFERENCES `anonymous_sessions`(`id`);

ALTER TABLE `missions`
  ADD FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`ngo_id`)    REFERENCES `users`(`id`);

ALTER TABLE `mission_registrations`
  ADD FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`),
  ADD FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`);

ALTER TABLE `surgical_missions`
  ADD FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`),
  ADD FOREIGN KEY (`ngo_id`)    REFERENCES `users`(`id`);
