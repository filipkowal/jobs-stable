import qs from "query-string";
import { SERVER_URL, MOCK_SERVER_URL } from "./constants";
import type { Endpoint, Filters, Jobs } from "./types";
import { type Locale } from "../i18n-config";

export async function postData(endpoint: string, locale: Locale, data: any) {
  const url = `${SERVER_URL}/${locale}/${endpoint}`;
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!rawResponse.ok) {
    throw new Error(rawResponse.statusText);
  }

  const content = await rawResponse.json();
  return content;
}

async function getData({
  endpoint,
  locale,
  param,
  searchParams,
  mock,
  init = {},
}: {
  endpoint: Endpoint;
  locale?: Locale;
  param?: string;
  searchParams?: Record<string, any>;
  mock?: boolean;
  init?: RequestInit;
}) {
  try {
    const encodedSearchParams =
      searchParams && qs.stringify(searchParams, { arrayFormat: "bracket" });
    const url = `${mock ? MOCK_SERVER_URL : SERVER_URL}/${locale}/${endpoint}${
      param ? `/${param}` : ""
    }${encodedSearchParams?.length ? `?${encodedSearchParams}` : ""}`;

    const res = await fetch(url, init);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} in ${url}`);
    }

    return res.json();
  } catch (e: any) {
    throw Error("Failed fetching " + endpoint + ": " + e.message);
  }
}

export async function getJobs({
  locale,
  searchParams,
  init,
}: {
  locale: Locale;
  searchParams?: any;
  init?: RequestInit;
}): Promise<Jobs> {
  const jobsResponse = await getData({
    endpoint: "jobs",
    locale,
    searchParams,
    init,
  });

  return jobsResponse;
}

export async function getFilters({
  locale,
  init,
}: {
  locale: Locale;
  init?: RequestInit;
}): Promise<Filters> {
  return await getData({ endpoint: "filters", locale, init });
}
