import { FONT_ENDPOINT } from "@/config/server-config";
import { Font } from "@/types/font-type";
import axios from "axios";

export async function listSystemFont(): Promise<Font[]> {
  const response = await axios.get(FONT_ENDPOINT + "/system");
  return response.data;
}
