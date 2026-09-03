import "server-only";
import type { Client } from "@notionhq/client";
import { notion } from "@/lib/notion/client";

export function plainText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.map((fragment) => (fragment as { plain_text?: string })?.plain_text ?? "").join("").trim();
}

export function readUrl(value: unknown): string {
  const url = (value as { url?: string | null } | undefined)?.url;
  return typeof url === "string" ? url.trim() : "";
}

export function readNumber(value: unknown): number | null {
  const number = (value as { number?: number | null } | undefined)?.number;
  return typeof number === "number" ? number : null;
}

export function readSelect(value: unknown): string {
  const name = (value as { select?: { name?: string } | null } | undefined)?.select?.name;
  return typeof name === "string" ? name : "";
}

export function readCheckbox(value: unknown): boolean {
  return (value as { checkbox?: boolean } | undefined)?.checkbox === true;
}

export function readRelationIds(value: unknown): string[] {
  const relation = (value as { relation?: Array<{ id?: string }> } | undefined)?.relation;
  if (!Array.isArray(relation)) return [];
  return relation.map((item) => item.id).filter((id): id is string => typeof id === "string");
}

export function isSafeWebUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const dataSourceCache = new Map<string, string>();

export async function resolveDataSourceId(databaseId: string, client: Client | null = notion): Promise<string | null> {
  const cached = dataSourceCache.get(databaseId);
  if (cached) return cached;
  if (!client) return null;

  const database = await client.databases.retrieve({ database_id: databaseId });
  const id = (database as { data_sources?: Array<{ id: string }> }).data_sources?.[0]?.id ?? null;
  if (id) dataSourceCache.set(databaseId, id);
  return id;
}
