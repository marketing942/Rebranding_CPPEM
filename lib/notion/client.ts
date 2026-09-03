import "server-only";
import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;

export const notion = token ? new Client({ auth: token }) : null;
