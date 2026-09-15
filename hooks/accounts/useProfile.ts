import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";
import { AccountService } from "@/api/services/accountService"; 
import { UserProfileResponse } from "@/types/accountsTypes";

export function useProfile() {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AccountService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        await SecureStore.setItemAsync("user_data", JSON.stringify(response.data));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load profile");
      const localData = await SecureStore.getItemAsync("user_data");
      if (localData) {
        setUser(JSON.parse(localData));
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadAndSaveProfileImage = async (fileUri: string) => {
    try {
      setUploading(true);
      setError(null);

      const filename = fileUri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? match[1] : "jpeg";

      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64ImageUri = `data:image/${type};base64,${base64Data}`;

      const data = {
        file: base64ImageUri,
        upload_preset: "localbasket_preset",
      };

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dup5b38zp/image/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed");
      }

      const profile_image_url = cloudinaryData.secure_url;
      const profile_image_public_id = cloudinaryData.public_id;

      const response = await AccountService.updateProfileImage({
        profile_image_url,
        profile_image_public_id,
      });

      if (response.success) {
        // Automatically re-fetch profile data to guarantee complete sync with the server database state
        await fetchProfile();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update profile photo");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, uploading, error, refetch: fetchProfile, uploadAndSaveProfileImage };
}