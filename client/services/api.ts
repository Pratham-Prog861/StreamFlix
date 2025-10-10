const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    return data;
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    return this.request<{
      token: string;
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      token: string;
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<{
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar: string;
    }>("/auth/me");
  }

  // User endpoints
  async updateProfile(data: {
    name?: string;
    email?: string;
    avatar?: string;
  }) {
    return this.request<{
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar: string;
    }>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(userId: string) {
    return this.request<{ _id: string; name: string; avatar: string }>(
      `/users/profile/${userId}`
    );
  }

  // Video endpoints
  async getVideos(page = 1, limit = 12) {
    return this.request<{
      videos: Array<{
        _id: string;
        title: string;
        description: string;
        videoPath: string;
        thumbnailPath: string;
        duration: number;
        uploader: { _id: string; name: string; avatar: string };
        uploaderName: string;
        views: number;
        createdAt: string;
      }>;
      currentPage: number;
      totalPages: number;
      totalVideos: number;
    }>(`/videos?page=${page}&limit=${limit}`);
  }

  async getVideo(id: string) {
    return this.request<{
      _id: string;
      title: string;
      description: string;
      videoPath: string;
      thumbnailPath: string;
      duration: number;
      uploader: { _id: string; name: string; avatar: string };
      uploaderName: string;
      views: number;
      createdAt: string;
    }>(`/videos/${id}`);
  }

  async uploadVideo(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/videos`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    return data;
  }

  async updateVideo(
    id: string,
    data: { title?: string; description?: string }
  ) {
    return this.request(`/videos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(id: string) {
    return this.request<{ message: string }>(`/videos/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
export default api;
