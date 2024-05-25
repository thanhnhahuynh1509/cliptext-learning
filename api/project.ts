import { PROJECT_ENDPOINT } from "@/config/server-config";
import { Project } from "@/types/project-types";
import axios from "axios";

const TEN_MB = 1024 * 1024 * 10;

export async function upload(
  file: File,
  id: string,
  onUpload?: (progress: number) => void,
  onSuccess?: (response: string) => void,
  onError?: (e: any) => void,
  onFinish?: () => void
) {
  const fileReader = new FileReader();
  const totalChunks = Math.ceil(file.size / TEN_MB);
  let currentChunk = 0;

  fileReader.onload = async () => {
    try {
      let result = "";
      while (currentChunk < totalChunks) {
        const start = currentChunk * TEN_MB;
        const end = start + TEN_MB;
        const chunkData = file.slice(start, end);
        const progress = Math.ceil((start / file.size) * 100);

        if (onUpload) {
          onUpload(progress);
        }

        const formData = new FormData();
        formData.append(
          "file",
          new Blob([chunkData], { type: "application/octet-stream" })
        );

        const response = await axios.post(
          `${PROJECT_ENDPOINT}/upload?id=${id}`,
          formData,
          {
            headers: {
              FILENAME: file.name,
            },
          }
        );
        result = response.data;
        currentChunk++;
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      if (onError) {
        onError(e as any);
      }
    } finally {
      if (onFinish) {
        onFinish();
      }
    }
  };

  fileReader.readAsArrayBuffer(file);
}

export async function cancelUpload(id: string, filename: string) {
  const response = await axios.post(
    `${PROJECT_ENDPOINT}/upload/cancel?id=${id}`,
    {},
    {
      headers: {
        FILENAME: filename,
      },
    }
  );
  return response.data;
}

export async function save(project: Project) {
  const response = await axios.post(`${PROJECT_ENDPOINT}`, project);
  return response.data;
}

export async function list(userId: string) {
  const response = await axios.get(`${PROJECT_ENDPOINT}`, {
    headers: {
      "USER-ID": userId,
    },
  });
  return response.data;
}

export async function deleteProject(id: string) {
  const response = await axios.delete(`${PROJECT_ENDPOINT}/${id}`);
  return response.data;
}

export async function updateName(id: string, name: string) {
  const response = await axios.put(`${PROJECT_ENDPOINT}/name/${id}`, {
    name: name,
  });
  return response.data;
}

export async function listByRoomId(roomId: string) {
  const response = await axios.get(`${PROJECT_ENDPOINT}/rooms/${roomId}`);
  return response.data;
}

export async function getById(id: string) {
  const response = await fetch(`${PROJECT_ENDPOINT}/${id}`);
  return response.json();
}

export async function getDataById(id: string) {
  const response = await axios.get(`${PROJECT_ENDPOINT}/${id}/data`);
  return response.data;
}
