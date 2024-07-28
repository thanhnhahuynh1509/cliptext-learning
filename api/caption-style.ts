import { CAPTION_STYLE_ENDPOINT } from "@/config/server-config";
import { CaptionStyle } from "@/types/caption-style-type";
import axios from "axios";

export async function listCaptionStyleByUserId(
  userId: string
): Promise<CaptionStyle[]> {
  const response = await axios.get(
    CAPTION_STYLE_ENDPOINT + "/users?userId=" + userId
  );
  return response.data;
}

export async function createCaptionStyle(
  captionStyle: CaptionStyle
): Promise<CaptionStyle> {
  const response = await axios.post(CAPTION_STYLE_ENDPOINT, captionStyle);
  return response.data;
}

export async function updateCaptionStyle(
  id: number,
  captionStyle: CaptionStyle
): Promise<CaptionStyle[]> {
  const response = await axios.put(
    CAPTION_STYLE_ENDPOINT + "/" + id,
    captionStyle
  );
  return response.data;
}
