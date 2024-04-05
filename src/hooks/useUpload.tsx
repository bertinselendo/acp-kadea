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

// export function useProjectUpload() {
//   const [progresspercent, setProgresspercent] = useState(0);
//   const [onUpload, setOnUpload] = useState(false);

//   const uploadProjectImage = async (
//     file: File,
//     projectID: string,
//     folder: string
//   ) => {
//     let projectFolder = `${projectID}`;

//     setOnUpload(true);

//     const timestamp = Date.now();

//     return new Promise((resolve, reject) => {
//       const storageRef = ref(
//         storage,
//         `${projectFolder}/${folder}/${timestamp + "-" + file.name}`
//       );
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round(
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//           );
//           setProgresspercent(progress);
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//             setOnUpload(false);
//           });
//         }
//       );
//     });
//   };

//   return { onUpload, progresspercent, uploadProjectImage };
// }

export function useProjectUpload() {
  const [progresspercent, setProgresspercent] = useState(0);
  const [onUpload, setOnUpload] = useState(false);

  const uploadProjectFiles = async (
    files: File[],
    projectID: string,
    folder: string
  ) => {
    let projectFolder = `${projectID}`;
    let downloadURLs: string[] = [];

    setOnUpload(true);

    const uploadTasks = files.map((file) => {
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `projects/${projectFolder}/${folder}/${timestamp + "-" + file.name}`
      );
      return uploadBytesResumable(storageRef, file);
    });

    const uploadPromises = uploadTasks.map((uploadTask) => {
      return new Promise((resolve, reject) => {
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
              downloadURLs.push(downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      setOnUpload(false);
      return downloadURLs;
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };

  return { onUpload, progresspercent, uploadProjectFiles };
}
