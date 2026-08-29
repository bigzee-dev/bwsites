import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const MODEL = "claude-sonnet-5";

/** Matches the description ceiling enforced by `siteSchema`. */
const MAX_DESCRIPTION_LENGTH = 1000;
const TAG_COUNT = 10;

/** Server tools can pause a long turn; each resume costs one of these. */
const MAX_TURNS = 5;

/**
 * How many pages Claude may read, and how much of each lands in context. These
 * two numbers are the main driver of what a site costs to generate — fetched page
 * content dwarfs the prompt itself.
 */
const MAX_FETCHES = 2;
const MAX_CONTENT_TOKENS = 12000;

/**
 * Reading one page and summarising it is a simple task, so the extra thinking at
 * the default `high` bought nothing measurable here — descriptions came back
 * equally accurate — while taking 35s instead of 9s. Raise this if descriptions
 * for harder sites start coming back thin.
 */
const EFFORT = "low" as const;

export class SiteContentError extends Error {}

/**
 * The two paragraphs are separate fields rather than one `description` string.
 * Asked for one string, the model reliably flattened both paragraphs into a
 * single block — a newline inside a JSON string is easy for it to drop. Two
 * required fields make the split structural, so it cannot come back as one
 * paragraph; they are joined with a blank line for storage.
 */
const siteContentSchema = z.object({
  first_paragraph: z.string(),
  second_paragraph: z.string(),
  tags: z.array(z.string()),
});

export type GeneratedSiteContent = {
  description: string;
  tags: string[];
};

function buildPrompt(url: string) {
  return `## Create a description for a website you have visited

Visit this website: ${url}

I am building a Botswana website directory and need a professional directory description and 10 tags for this website.

Please provide a description:

- The total length of the description should not be more than 1000 characters across both paragraphs combined

- Two small paragraphs, returned as two separate fields

- Exactly 3 sentences per paragraph

- A clear, factual description of what the organisation/business/website does

- Mention the main services, products, or information provided

- Keep the tone professional and suitable for a website directory

- Write for a Botswana audience where relevant

- Do not use marketing hype or exaggerated claims

- Do not mention that you visited the website

- Do not include the website URL in the description

- Do not include bullet points, headings, or extra commentary

The final output should only be the two paragraphs ready to paste into my directory. Put the first paragraph in "first_paragraph" and the second paragraph in "second_paragraph". Never put both paragraphs in one field.

Please provide 10 tags that describe the website:

Your output should be json in this form:

{
"first_paragraph": "string",
"second_paragraph": "string",
"tags" : [an array of strings]
}`;
}

/**
 * Trims to the last complete sentence that fits, so a slightly over-long
 * response is still usable rather than throwing away the whole generation.
 */
function trimToLimit(description: string) {
  const text = description.trim();
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;

  const clipped = text.slice(0, MAX_DESCRIPTION_LENGTH);
  const lastSentenceEnd = Math.max(
    clipped.lastIndexOf(". "),
    clipped.lastIndexOf(".\n"),
  );

  return lastSentenceEnd > 0
    ? clipped.slice(0, lastSentenceEnd + 1).trim()
    : clipped.trim();
}

/**
 * The model overruns the 1000-character limit often enough to matter. Rewriting
 * costs a fraction of the original call (no tools, no page content) and keeps the
 * two-paragraph, three-sentence shape that a hard trim would break.
 */
async function shortenDescription(
  client: Anthropic,
  paragraphs: [string, string],
): Promise<[string, string]> {
  // Same two-field shape as the main call, for the same reason: a single string
  // comes back as one flattened paragraph.
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 2000,
    output_config: {
      format: zodOutputFormat(
        z.object({ first_paragraph: z.string(), second_paragraph: z.string() }),
      ),
    },
    messages: [
      {
        role: "user",
        content: `Shorten the following website directory description so the two paragraphs together are under ${MAX_DESCRIPTION_LENGTH} characters.

Keep exactly two paragraphs of exactly three sentences each. Keep the same facts and the same professional tone. Do not add commentary, headings, or quotation marks.

First paragraph:
${paragraphs[0]}

Second paragraph:
${paragraphs[1]}`,
      },
    ],
  });

  const parsed = response.parsed_output;
  if (!parsed?.first_paragraph?.trim() || !parsed?.second_paragraph?.trim()) {
    return paragraphs;
  }

  return [parsed.first_paragraph.trim(), parsed.second_paragraph.trim()];
}

/** Asks Claude to read the site and write a directory description plus tags. */
export async function generateSiteContent(url: string): Promise<GeneratedSiteContent> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new SiteContentError("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic();
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildPrompt(url) },
  ];

  let response;
  try {
    for (let turn = 0; turn < MAX_TURNS; turn += 1) {
      response = await client.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        tools: [
          // Deliberately the older fetch tool. The _20260209 variant runs code
          // execution under the hood for dynamic filtering, which bills its own
          // container and pulled ~15k input tokens per site against ~6k here, for
          // descriptions of equal quality.
          //
          // `max_content_tokens` is the other cost lever: uncapped, a single site
          // pulled ~295k input tokens into context.
          {
            type: "web_fetch_20250910",
            name: "web_fetch",
            max_uses: MAX_FETCHES,
            max_content_tokens: MAX_CONTENT_TOKENS,
          },
        ],
        output_config: { format: zodOutputFormat(siteContentSchema), effort: EFFORT },
        messages,
      });

      // A server tool hit its per-turn limit — replay the turn to continue.
      if (response.stop_reason !== "pause_turn") break;
      messages.push({ role: "assistant", content: response.content });
    }
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new SiteContentError("The Anthropic API key was rejected");
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new SiteContentError("Anthropic rate limit reached. Try again shortly.");
    }
    if (error instanceof Anthropic.APIError) {
      throw new SiteContentError(`Anthropic API error: ${error.message}`);
    }
    throw new SiteContentError("Could not reach the Anthropic API");
  }

  if (response?.stop_reason === "refusal") {
    throw new SiteContentError("The model declined to describe this site");
  }

  const parsed = response?.parsed_output;
  if (!parsed) {
    throw new SiteContentError(
      "The model did not return a usable description. Please try again.",
    );
  }

  let paragraphs: [string, string] = [
    parsed.first_paragraph.trim(),
    parsed.second_paragraph.trim(),
  ];

  const joined = () => paragraphs.filter(Boolean).join("\n\n");

  if (joined().length > MAX_DESCRIPTION_LENGTH) {
    try {
      paragraphs = await shortenDescription(client, paragraphs);
    } catch {
      // Fall through to the hard trim below.
    }
  }

  let description = joined();
  // Belt and braces: the rewrite can still come back long.
  description = trimToLimit(description);

  const tags = parsed.tags.map((tag) => tag.trim()).filter(Boolean).slice(0, TAG_COUNT);

  if (!description) {
    throw new SiteContentError("The model returned an empty description");
  }

  return { description, tags };
}
