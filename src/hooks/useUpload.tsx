"use client";

import { useState } from "react";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function useUpload() {
  const [progresspercent, setProgresspercent] = useState(0);
  const [onUpload, setOnUpload] = useState(false);

  const uploadImage = async (file: File, type: string) => {
    let folder = "images";

    setOnUpload(true);

    if (type === "avatar") {
      folder = "images/avatar";
    }

    const timestamp = Date.now();

    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        `${folder}/${timestamp + "-" + file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setOnUpload(false);
          });
        }
      );
    });
  };

  return { onUpload, progresspercent, uploadImage };
}
