// src/lib/api.ts
import type {
	PatientCreateDTO,
	PatientUpdateDTO,
	PatientResponseDTO,
	PaginatedPatientsResponseDTO,
	PatientSearchParams,
	BodyMeasurementCreateDTO,
	BodyMeasurementResponseDTO,
	PaginatedMeasurementsResponseDTO,
	HealthResponseDTO,
	SpecialtyCreateDTO,
	SpecialtyUpdateDTO,
	SpecialtyResponseDTO,
	DoctorCreateDTO,
	DoctorUpdateDTO,
	DoctorResponseDTO,
	DoctorSearchParams,
	PaginatedDoctorsResponseDTO
} from './types';


const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly detail: string
	) {
		super(detail);
		this.name = 'ApiError';
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const url = `${BASE_URL}${path}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		},
		...init
	});

	if (!res.ok) {
		let detail = `HTTP ${res.status}`;
		try {
			const body = await res.json();
			detail = body?.detail ?? detail;
		} catch {
			// ignore
		}
		throw new ApiError(res.status, String(detail));
	}

	// 204 No Content
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

// ─── Patients ────────────────────────────────────────────────────────────────

export function createPatient(dto: PatientCreateDTO): Promise<PatientResponseDTO> {
	return request<PatientResponseDTO>('/api/v1/patients', {
		method: 'POST',
		body: JSON.stringify(dto)
	});
}

export function getPatientById(id: string): Promise<PatientResponseDTO> {
	return request<PatientResponseDTO>(`/api/v1/patients/${id}`);
}

export function getPatientByMrn(mrn: string): Promise<PatientResponseDTO> {
	return request<PatientResponseDTO>(`/api/v1/patients/mrn/${mrn}`);
}

export function updatePatient(id: string, dto: PatientUpdateDTO): Promise<PatientResponseDTO> {
	return request<PatientResponseDTO>(`/api/v1/patients/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(dto)
	});
}

export function searchPatients(
	params: PatientSearchParams = {}
): Promise<PaginatedPatientsResponseDTO> {
	const qs = new URLSearchParams();
	if (params.first_name) qs.set('first_name', params.first_name);
	if (params.last_name) qs.set('last_name', params.last_name);
	if (params.date_of_birth) qs.set('date_of_birth', params.date_of_birth);
	if (params.mrn) qs.set('mrn', params.mrn);
	if (params.status) qs.set('status', params.status);
	qs.set('limit', String(params.limit ?? 20));
	qs.set('offset', String(params.offset ?? 0));
	return request<PaginatedPatientsResponseDTO>(`/api/v1/patients?${qs.toString()}`);
}

// ─── Measurements ────────────────────────────────────────────────────────────

export function addMeasurement(
	patientId: string,
	dto: BodyMeasurementCreateDTO
): Promise<BodyMeasurementResponseDTO> {
	return request<BodyMeasurementResponseDTO>(`/api/v1/patients/${patientId}/measurements`, {
		method: 'POST',
		body: JSON.stringify(dto)
	});
}

export function getLatestMeasurement(patientId: string): Promise<BodyMeasurementResponseDTO> {
	return request<BodyMeasurementResponseDTO>(
		`/api/v1/patients/${patientId}/measurements/latest`
	);
}

export function listMeasurements(
	patientId: string,
	limit = 20,
	offset = 0
): Promise<PaginatedMeasurementsResponseDTO> {
	return request<PaginatedMeasurementsResponseDTO>(
		`/api/v1/patients/${patientId}/measurements?limit=${limit}&offset=${offset}`
	);
}

// ─── Health ──────────────────────────────────────────────────────────────────

export function getHealth(): Promise<HealthResponseDTO> {
	return request<HealthResponseDTO>('/health');
}

export function getReadiness(): Promise<HealthResponseDTO> {
	return request<HealthResponseDTO>('/ready');
}

// ─── Specialties ─────────────────────────────────────────────────────────────

export function listSpecialties(activeOnly = false): Promise<SpecialtyResponseDTO[]> {
	return request<SpecialtyResponseDTO[]>(`/api/v1/specialties?active_only=${activeOnly}`);
}

export function getSpecialtyById(id: string): Promise<SpecialtyResponseDTO> {
	return request<SpecialtyResponseDTO>(`/api/v1/specialties/${id}`);
}

export function getSpecialtyByCode(code: string): Promise<SpecialtyResponseDTO> {
	return request<SpecialtyResponseDTO>(`/api/v1/specialties/code/${code}`);
}

export function createSpecialty(dto: SpecialtyCreateDTO): Promise<SpecialtyResponseDTO> {
	return request<SpecialtyResponseDTO>('/api/v1/specialties', {
		method: 'POST',
		body: JSON.stringify(dto)
	});
}

export function updateSpecialty(
	id: string,
	dto: SpecialtyUpdateDTO
): Promise<SpecialtyResponseDTO> {
	return request<SpecialtyResponseDTO>(`/api/v1/specialties/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(dto)
	});
}

export function deactivateSpecialty(id: string): Promise<SpecialtyResponseDTO> {
	return request<SpecialtyResponseDTO>(`/api/v1/specialties/${id}`, { method: 'DELETE' });
}

// ─── Doctors ─────────────────────────────────────────────────────────────────

export function searchDoctors(
	params: DoctorSearchParams = {}
): Promise<PaginatedDoctorsResponseDTO> {
	const qs = new URLSearchParams();
	if (params.first_name) qs.set('first_name', params.first_name);
	if (params.last_name) qs.set('last_name', params.last_name);
	if (params.specialty_id) qs.set('specialty_id', params.specialty_id);
	if (params.status) qs.set('status', params.status);
	qs.set('limit', String(params.limit ?? 20));
	qs.set('offset', String(params.offset ?? 0));
	return request<PaginatedDoctorsResponseDTO>(`/api/v1/doctors?${qs.toString()}`);
}

export function getDoctorById(id: string): Promise<DoctorResponseDTO> {
	return request<DoctorResponseDTO>(`/api/v1/doctors/${id}`);
}

export function getDoctorByEmployeeId(employeeId: string): Promise<DoctorResponseDTO> {
	return request<DoctorResponseDTO>(`/api/v1/doctors/emp/${employeeId}`);
}

export function createDoctor(dto: DoctorCreateDTO): Promise<DoctorResponseDTO> {
	return request<DoctorResponseDTO>('/api/v1/doctors', {
		method: 'POST',
		body: JSON.stringify(dto)
	});
}

export function updateDoctor(id: string, dto: DoctorUpdateDTO): Promise<DoctorResponseDTO> {
	return request<DoctorResponseDTO>(`/api/v1/doctors/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(dto)
	});
}

export function deactivateDoctor(id: string): Promise<DoctorResponseDTO> {
	return request<DoctorResponseDTO>(`/api/v1/doctors/${id}`, { method: 'DELETE' });
}

