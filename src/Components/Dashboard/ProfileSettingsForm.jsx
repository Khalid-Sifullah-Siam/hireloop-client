"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";

const IMAGE_UPLOAD_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };

    reader.onerror = () => {
      reject(new Error("Could not read the image file."));
    };

    reader.readAsDataURL(file);
  });
}

async function uploadImageToImgbb(file) {
  if (!IMAGE_UPLOAD_API_KEY) {
    throw new Error("Image upload API key is missing.");
  }

  const uploadData = new FormData();
  uploadData.append("image", file);

  const uploadResponse = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMAGE_UPLOAD_API_KEY}`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const uploadResult = await uploadResponse.json().catch(() => ({}));

  if (!uploadResponse.ok || !uploadResult?.success) {
    throw new Error(uploadResult?.error?.message || "Failed to upload the image.");
  }

  return uploadResult?.data?.url || uploadResult?.data?.display_url || "";
}

export default function ProfileSettingsForm({ user, role, success = "", error = "" }) {
  const returnTo = `/dashboard/${role}/settings`;
  const initialPhoto = user?.photo || user?.image || "";
  const initialAvatar = user?.avatar || initialPhoto;
  const initialImage = initialAvatar || initialPhoto;
  const skills = Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || "";

  const [photoValue, setPhotoValue] = useState(initialImage);
  const [uploadPreview, setUploadPreview] = useState(initialImage);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const previewUrl = await readFileAsDataUrl(file);
      setUploadPreview(previewUrl);

      const uploadedImageUrl = await uploadImageToImgbb(file);
      setPhotoValue(uploadedImageUrl);
      setUploadPreview(uploadedImageUrl);
    } catch (error) {
      setUploadPreview(initialImage);
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-4 text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Account settings
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Update your profile information here.
        </p>
      </div>

      {success ? (
        <p className="rounded-2xl border border-emerald-600/30 bg-emerald-900/90 px-4 py-3 text-sm font-medium text-emerald-100">
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-600/30 bg-red-900/90 px-4 py-3 text-sm font-medium text-red-100">
          {error}
        </p>
      ) : null}

      <form action={updateProfile} className="rounded-2xl border border-white/10 bg-[#0c1325] p-6 shadow-sm shadow-black/20">
        <input type="hidden" name="returnTo" value={returnTo} />
        <input type="hidden" name="avatar" value={photoValue} />

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm font-semibold text-white/80">Name</span>
            <input
              name="name"
              defaultValue={user?.name || ""}
              required
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-white/80">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              required
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-white/80">Profile image</span>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/4 text-white/60 transition hover:bg-white/8">
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm">Upload</span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">Upload from phone or PC</p>
                <p className="mt-1 text-xs text-white/45">
                  {uploadingImage
                    ? "Uploading image..."
                    : "Select an image and it will be hosted on imgbb."}
                </p>
                {uploadError ? <p className="mt-1 text-xs text-rose-300">{uploadError}</p> : null}
              </div>
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-white/80">Photo URL</span>
            <input
              name="photo"
              value={photoValue}
              onChange={(event) => setPhotoValue(event.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
            <span className="mt-1 block text-xs text-white/50">
              Leave blank to use the uploaded image, or paste an image URL.
            </span>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-white/80">Headline</span>
            <input
              name="headline"
              defaultValue={user?.headline || ""}
              placeholder="Frontend Developer | React | Next.js"
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-white/80">Skills</span>
            <input
              name="skills"
              defaultValue={skills}
              placeholder="JavaScript, React, Node.js"
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
            <span className="mt-1 block text-xs text-white/50">
              Separate skills with commas.
            </span>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-white/80">Bio</span>
            <textarea
              name="bio"
              defaultValue={user?.bio || ""}
              rows={5}
              placeholder="Write a short bio about yourself."
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#6fb7ff]/70 focus:bg-white/8"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-slate-200/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200/20"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}
