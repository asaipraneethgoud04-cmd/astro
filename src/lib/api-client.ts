/**
 * ============================================================================
 * TALKASTROLOGER - BACKEND API CLIENT
 * ============================================================================
 * Centralized, typed HTTP client for communicating with the standalone
 * Express.js backend running at api.talkastrologer.com
 * ============================================================================
 */

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.talkastrologer.com";

export interface AppointmentPayload {
  fullName: string;
  secondName?: string | null;
  email: string;
  phone: string;
  city: string;
  service: string;
  message?: string | null;
  honeypot?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string;
  message: string;
  honeypot?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
  [key: string]: unknown;
}

/**
 * Perform typed HTTP request to the Express backend API
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BACKEND_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: json.error || `Server responded with HTTP ${res.status}`,
      };
    }

    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      error: `Could not reach backend service at ${BACKEND_URL}: ${message}`,
    };
  }
}

/**
 * Backend API Client Methods
 */
export const backendApi = {
  // Base URL
  baseUrl: BACKEND_URL,

  // 1. Health check
  health: async () => {
    return apiRequest<{ status: string; service: string }>("/api/health", {
      method: "GET",
      cache: "no-store",
    });
  },

  // 2. Appointments
  appointments: {
    create: async (payload: AppointmentPayload) => {
      return apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    list: async () => {
      return apiRequest("/api/appointments", {
        method: "GET",
        cache: "no-store",
      });
    },

    updateStatus: async (
      id: string,
      payload: {
        status?: string;
        adminNotes?: string;
        scheduledTime?: string;
        sessionMedium?: string;
        meetingLinkOrInstructions?: string;
        customNote?: string;
        sendConfirmationEmail?: boolean;
      }
    ) => {
      return apiRequest(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },

    confirm: async (
      id: string,
      payload: {
        scheduledTime: string;
        sessionMedium?: string;
        meetingLinkOrInstructions?: string;
        customNote?: string;
        adminNotes?: string;
      }
    ) => {
      return apiRequest(`/api/appointments/${id}/confirm`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },

  // 3. Contact Messages
  messages: {
    create: async (payload: ContactMessagePayload) => {
      return apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    list: async () => {
      return apiRequest("/api/messages", {
        method: "GET",
        cache: "no-store",
      });
    },

    updateStatus: async (id: string, payload: { status?: string; adminNotes?: string }) => {
      return apiRequest(`/api/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
  },

  // 4. Reviews
  reviews: {
    list: async () => {
      return apiRequest("/api/reviews", {
        method: "GET",
        cache: "no-store",
      });
    },

    moderate: async (id: string, payload: { status?: string; pinned?: boolean }) => {
      return apiRequest(`/api/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
  },
};
