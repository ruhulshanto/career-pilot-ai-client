import { apiClient } from "./client";
import type { ApiResponse } from "@/shared/types/api";
import type {
  CareerPortfolio,
  UpdateUserProfilePayload,
  UserProfile,
} from "./profile-types";

export type {
  Achievement,
  CareerPortfolio,
  PreferredWorkMode,
  ProfileSocialLinks,
  UpdateUserProfilePayload,
  UserProfile,
} from "./profile-types";

export const profileApi = {
  async getMe() {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>("/users/me");
    return data.data;
  },

  async updateMe(payload: Partial<UpdateUserProfilePayload>) {
    const { data } =
      await apiClient.patch<ApiResponse<UserProfile>>("/users/me", payload);
    return data.data;
  },

  async uploadPhoto(file: File) {
    const body = new FormData();
    body.append("photo", file);
    const { data } = await apiClient.post<ApiResponse<UserProfile>>(
      "/users/me/photo",
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
  },

  async getMyPortfolio() {
    const { data } =
      await apiClient.get<ApiResponse<CareerPortfolio>>("/users/me/portfolio");
    return data.data;
  },

  async getPublicPortfolio(username: string) {
    const { data } = await apiClient.get<ApiResponse<CareerPortfolio>>(
      `/users/public/${username}`,
    );
    return data.data;
  },
};
