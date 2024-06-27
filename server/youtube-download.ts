"use server";
import ytdl from "ytdl-core";

export async function getInfo(url: string) {
  const youtubeId = getYouTubeId(url);
  if (!youtubeId) {
    return;
  }
  const info = await ytdl.getInfo(youtubeId);

  return JSON.stringify({
    info: info,
    thumbnail: info.videoDetails.thumbnails.reduce((acc, thumbnail) => {
      return acc.height > thumbnail.height ? acc : thumbnail;
    }),
  });
}

function getYouTubeId(url: string) {
  // Regular expression pattern to match YouTube video URLs
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube embedded video URLs
  const embeddedRegex = /(?:embed|v)\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube short URLs
  const shortRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube shorts URLs
  const shortsRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

  // Check if the URL matches any of the patterns and extract the video ID
  const match =
    url.match(youtubeRegex) ||
    url.match(embeddedRegex) ||
    url.match(shortRegex) ||
    url.match(shortsRegex);

  // Return the video ID if found, otherwise return null
  return match ? match[1] : null;
}
