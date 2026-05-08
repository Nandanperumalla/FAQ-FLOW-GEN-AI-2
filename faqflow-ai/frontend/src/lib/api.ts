import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  return response;
}

export async function getCurrentUser() {
  const res = await fetchWithAuth("/api/v1/users/me");
  return res.json();
}

export async function getDocuments() {
  const res = await fetchWithAuth("/api/v1/documents/");
  return res.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchWithAuth("/api/v1/documents/upload", {
    method: "POST",
    body: formData,
  });
  
  return res.json();
}

export async function sendChatMessage(message: string, sessionId?: number) {
  const body: any = { message };
  if (sessionId) {
    body.session_id = sessionId;
  }

  const res = await fetchWithAuth("/api/v1/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function deleteDocument(id: number) {
  const res = await fetchWithAuth(`/api/v1/documents/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
