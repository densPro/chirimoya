// src/lib/types.ts

export type Gender =
	| 'male'
	| 'female'
	| 'non_binary'
	| 'other'
	| 'prefer_not_to_say'
	| 'unknown';

export type MaritalStatus =
	| 'single'
	| 'married'
	| 'divorced'
	| 'widowed'
	| 'separated'
	| 'domestic_partner'
	| 'unknown';

export type BloodType =
	| 'A+'
	| 'A-'
	| 'B+'
	| 'B-'
	| 'AB+'
	| 'AB-'
	| 'O+'
	| 'O-'
	| 'unknown';

export type PatientStatus = 'active' | 'inactive' | 'deceased';

export interface AddressDTO {
	street_line_1: string;
	street_line_2?: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
}

export interface ContactInfoDTO {
	phone_number: string;
	email?: string;
	secondary_phone?: string;
}

export interface EmergencyContactDTO {
	full_name: string;
	relationship: string;
	phone_number: string;
	email?: string;
}

export interface InsuranceInfoDTO {
	provider_name: string;
	policy_number: string;
	group_number?: string;
	subscriber_name?: string;
	subscriber_relationship?: string;
	effective_date?: string;
	expiration_date?: string;
}

export interface PatientCreateDTO {
	first_name: string;
	last_name: string;
	date_of_birth: string;
	gender: Gender;
	marital_status?: MaritalStatus;
	ssn_last_four?: string;
	national_id?: string;
	blood_type?: BloodType;
	allergies?: string[];
	chronic_conditions?: string[];
	contact_info: ContactInfoDTO;
	address?: AddressDTO;
	emergency_contact?: EmergencyContactDTO;
	insurance_info?: InsuranceInfoDTO;
	notes?: string;
}

export type PatientUpdateDTO = Partial<PatientCreateDTO & { status: PatientStatus }>;

export interface TDEEResponseDTO {
	sedentary?: number;
	lightly_active?: number;
	moderately_active?: number;
	very_active?: number;
}

export interface StressCaloriesDTO {
	sedentary?: number;
	lightly_active?: number;
	moderately_active?: number;
	very_active?: number;
}

export interface TotalCaloriesResponseDTO {
	major_surgery?: StressCaloriesDTO;
	minor_surgery?: StressCaloriesDTO;
	mild_infection?: StressCaloriesDTO;
	moderate_infection?: StressCaloriesDTO;
	severe_infection?: StressCaloriesDTO;
	trauma_with_impaired_consciousness?: StressCaloriesDTO;
	burns_40_tbsa?: StressCaloriesDTO;
	burns_100_tbsa?: StressCaloriesDTO;
	cancer?: StressCaloriesDTO;
	malnutrition?: StressCaloriesDTO;
	traumatic_brain_injury?: StressCaloriesDTO;
}

export interface BodyMeasurementResponseDTO {
	id: string;
	patient_id: string;
	measured_at: string;
	height_cm?: number;
	height_m?: number;
	weight_kg?: number;
	waist_cm?: number;
	hip_cm?: number;
	bmi?: number;
	bmi_category?: string;
	healthy_weight?: number;
	minimum_weight?: number;
	maximum_weight?: number;
	bmr_harris_benedict?: number;
	bmr_mifflin_st_jeor?: number;
	tdee_harris_benedict?: TDEEResponseDTO;
	tdee_mifflin_st_jeor?: TDEEResponseDTO;
	total_calories_harris_benedict?: TotalCaloriesResponseDTO;
	total_calories_mifflin_st_jeor?: TotalCaloriesResponseDTO;
	created_at: string;
}

export interface BodyMeasurementCreateDTO {
	height_cm?: number;
	weight_kg?: number;
	waist_cm?: number;
	hip_cm?: number;
	measured_at?: string;
}

export interface PatientResponseDTO {
	id: string;
	mrn: string;
	first_name: string;
	last_name: string;
	full_name: string;
	date_of_birth: string;
	gender: Gender;
	marital_status: MaritalStatus;
	ssn_last_four?: string;
	national_id?: string;
	age?: number;
	latest_measurement?: BodyMeasurementResponseDTO;
	blood_type: BloodType;
	allergies: string[];
	chronic_conditions: string[];
	contact_info?: ContactInfoDTO;
	address?: AddressDTO;
	emergency_contact?: EmergencyContactDTO;
	insurance_info?: InsuranceInfoDTO;
	notes?: string;
	status: PatientStatus;
	created_at: string;
	updated_at: string;
}

export interface PaginatedPatientsResponseDTO {
	items: PatientResponseDTO[];
	total: number;
	limit: number;
	offset: number;
}

export interface PaginatedMeasurementsResponseDTO {
	items: BodyMeasurementResponseDTO[];
	total: number;
	limit: number;
	offset: number;
}

export interface PatientSearchParams {
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	mrn?: string;
	status?: PatientStatus;
	limit?: number;
	offset?: number;
}

export interface HealthResponseDTO {
	status: string;
	service?: string;
	database?: string;
}

// ─── Specialty ───────────────────────────────────────────────────────────────

export type SpecialtyCategory =
	| 'atencion_primaria'
	| 'quirurgica'
	| 'diagnostica'
	| 'terapeutica'
	| 'salud_mental'
	| 'emergencia'
	| 'otra';

export interface SpecialtyCreateDTO {
	code: string;
	name: string;
	category: SpecialtyCategory;
	description?: string;
}

export interface SpecialtyUpdateDTO {
	name?: string;
	category?: SpecialtyCategory;
	description?: string;
}

export interface SpecialtyResponseDTO {
	id: string;
	code: string;
	name: string;
	category: SpecialtyCategory;
	description?: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

// ─── Doctor ──────────────────────────────────────────────────────────────────

export type DoctorStatus = 'active' | 'inactive' | 'on_leave' | 'retired';

export interface LicenseInfoDTO {
	license_number: string;
	issuing_body: string;
	issue_date?: string;
	expiration_date?: string;
	state?: string;
}

export interface DoctorContactInfoDTO {
	phone_number?: string;
	email?: string;
}

export interface DoctorAddressDTO {
	street_line_1?: string;
	street_line_2?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
}

export interface DoctorCreateDTO {
	first_name: string;
	last_name: string;
	date_of_birth?: string;
	gender: Gender;
	specialty_id: string;
	license_info?: LicenseInfoDTO;
	contact_info?: DoctorContactInfoDTO;
	address?: DoctorAddressDTO;
	years_of_experience?: number;
	bio?: string;
}

export interface DoctorUpdateDTO {
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	gender?: Gender;
	specialty_id?: string;
	license_info?: LicenseInfoDTO;
	contact_info?: DoctorContactInfoDTO;
	address?: DoctorAddressDTO;
	years_of_experience?: number;
	bio?: string;
	status?: DoctorStatus;
}

export interface DoctorSearchParams {
	first_name?: string;
	last_name?: string;
	specialty_id?: string;
	status?: DoctorStatus;
	limit?: number;
	offset?: number;
}

export interface DoctorResponseDTO {
	id: string;
	employee_id: string;
	first_name: string;
	last_name: string;
	full_name: string;
	date_of_birth?: string;
	age?: number;
	gender: Gender;
	specialty_id: string;
	license_info?: LicenseInfoDTO;
	contact_info?: DoctorContactInfoDTO;
	address?: DoctorAddressDTO;
	years_of_experience?: number;
	bio?: string;
	status: DoctorStatus;
	created_at: string;
	updated_at: string;
}

export interface PaginatedDoctorsResponseDTO {
	items: DoctorResponseDTO[];
	total: number;
	limit: number;
	offset: number;
}

