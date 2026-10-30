// Run from an external scheduler; a sleeping server cannot wake itself.
const endpoint = process.env.RENTFLOW_HEALTH_URL;
if (!endpoint)
  throw new Error("Set RENTFLOW_HEALTH_URL to the HTTPS /api/health endpoint");
const url = new URL(endpoint);
if (
  url.protocol !== "https:" &&
  !(
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(url.hostname)
  )
)
  throw new Error("HTTPS required");
if (url.username || url.password)
  throw new Error("Do not include credentials in the health URL");
let healthy = false;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(60000),
      redirect: "error",
    });
    const body = await response.json();
    if (!response.ok || body.server !== "ok" || body.database !== "ok")
      throw new Error("Server or database unhealthy");
    console.log("RentFlow server and database are healthy.");
    healthy = true;
    break;
  } catch (_) {
    console.error(`Health attempt ${attempt + 1} failed.`);
  }
  if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 30000));
}
if (!healthy) process.exitCode = 1;
