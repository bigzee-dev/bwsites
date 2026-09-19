import "server-only";

/**
 * How long a site gets to respond before the check gives up on it. Plenty of the
 * sites in the directory are alive but slow, and a tight limit reports those as
 * down, so this is deliberately generous. A site that needs both a HEAD and a GET
 * can take twice this long.
 */
const TIMEOUT_MS = 20_000;

/** Some hosts reject unknown clients outright, so the probe looks like a browser. */
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/**
 * Responses that mean the server is up but refused this particular request — bot
 * protection, rate limiting, or an auth wall. The site itself is still online.
 */
const REFUSED_BUT_UP = new Set([401, 403, 405, 406, 429]);

/**
 * A 503 is how a server announces planned downtime — usually with a maintenance
 * page a visitor can still see. That is neither healthy nor dead, so it gets its
 * own status instead of being lumped in with genuinely broken sites.
 */
const MAINTENANCE_STATUS = 503;

export type SiteCheckStatus = "online" | "maintenance" | "unavailable";

export type SiteCheckResult = {
  status: SiteCheckStatus;
  statusCode: number | null;
  detail: string;
  durationMs: number;
};

type Probe =
  | { response: Response; error?: undefined; timedOut?: undefined }
  | { response?: undefined; error: string; timedOut: boolean };

function describeNetworkError(error: unknown): string {
  const code = (error as { cause?: { code?: string } })?.cause?.code;

  switch (code) {
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "Domain could not be resolved";
    case "ECONNREFUSED":
      return "Connection refused";
    case "ECONNRESET":
      return "Connection reset by the server";
    case "ETIMEDOUT":
      return "Connection timed out";
    case "CERT_HAS_EXPIRED":
      return "TLS certificate has expired";
    case "ERR_TLS_CERT_ALTNAME_INVALID":
      return "TLS certificate does not match the domain";
    case "DEPTH_ZERO_SELF_SIGNED_CERT":
    case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
      return "TLS certificate could not be verified";
    default:
      return "Could not connect to the server";
  }
}

async function probe(url: string, method: "HEAD" | "GET"): Promise<Probe> {
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      headers: { "user-agent": USER_AGENT, accept: "*/*" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // Nothing reads the body, so release the connection instead of leaking it.
    try {
      await response.body?.cancel();
    } catch {
      // The body was already closed by the server.
    }

    return { response };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return {
        error: `No response within ${TIMEOUT_MS / 1000} seconds`,
        timedOut: true,
      };
    }
    return { error: describeNetworkError(error), timedOut: false };
  }
}

/** Checks whether `url` is reachable, without downloading the page. */
export async function checkSiteUrl(url: string): Promise<SiteCheckResult> {
  const startedAt = Date.now();

  // HEAD is cheap, but plenty of servers mishandle it — those get one retry with
  // GET. A timeout is not retried, because waiting out a second one helps nobody.
  const head = await probe(url, "HEAD");
  const retry = head.response ? head.response.status >= 400 : !head.timedOut;

  // GET is what a visitor's browser does, so once it runs its outcome is the
  // verdict — including when it fails after HEAD had answered. Falling back to the
  // HEAD status there would report a timed-out site as whatever HEAD happened to
  // say, which is how a slow site ends up labelled "404 Not Found".
  const attempt = retry ? await probe(url, "GET") : head;

  const durationMs = Date.now() - startedAt;

  if (!attempt.response) {
    // The discarded HEAD status still explains why the retry happened at all.
    const headStatus = head.response ? ` (HEAD returned HTTP ${head.response.status})` : "";
    return {
      status: "unavailable",
      statusCode: null,
      detail: `${attempt.error}${headStatus}`,
      durationMs,
    };
  }

  const { status, statusText } = attempt.response;

  if (status < 400) {
    return { status: "online", statusCode: status, detail: `HTTP ${status}`, durationMs };
  }

  if (REFUSED_BUT_UP.has(status)) {
    return {
      status: "online",
      statusCode: status,
      detail: `HTTP ${status} — responding, but refused an automated request`,
      durationMs,
    };
  }

  if (status === MAINTENANCE_STATUS) {
    return {
      status: "maintenance",
      statusCode: status,
      detail: `HTTP ${status} — the server is up and serving a maintenance page`,
      durationMs,
    };
  }

  return {
    status: "unavailable",
    statusCode: status,
    detail: `HTTP ${status}${statusText ? ` ${statusText}` : ""}`,
    durationMs,
  };
}
