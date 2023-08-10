import { JOBS_LIMIT, JOBS_REVALIDATE_TIME } from "../../../utils/constants";
import { type Locale, i18n } from "../../../i18n-config";
import JobTable from "../JobTable";
import { getFilters, getJobs } from "../../../utils";
import { getCustomBoard } from "../../../utils/server";
import FiltersSectionContainer from "../_Filters/FiltersSectionContainer";
import Title from "../Title";
import { Suspense } from "react";
import Spinner from "../../../components/Spinner";
import FiltersSkeleton from "../_Filters/FiltersSkeleton";

export async function generateStaticParams() {
  const params: Record<string, string>[] = [];
  const customBoard = await getCustomBoard();

  for (const locale of i18n.locales) {
    const getJobsResponse = await getJobs({
      locale,
      searchParams: {
        employerName: customBoard.employerNameFilter,
      },
    });
    const numOfPages = Math.ceil((getJobsResponse?.length || 1) / JOBS_LIMIT);

    for (let i = 0; i < numOfPages; i++) {
      params.push({ locale, pageIndex: i.toString() });
    }
  }

  return params;
}

export default async function Home({
  params,
}: {
  params: { locale: Locale; pageIndex: number };
}) {
  const customBoard = await getCustomBoard();

  const filtersPromise = getFilters({
    locale: params.locale,
    init: { next: { revalidate: JOBS_REVALIDATE_TIME } },
  });
  const jobsPromise = getJobs({
    locale: params.locale,
    searchParams: {
      employerName: customBoard.employerNameFilter,
      offset: params.pageIndex * JOBS_LIMIT,
      limit: JOBS_LIMIT,
    },
    init: { next: { revalidate: JOBS_REVALIDATE_TIME } },
  });

  return (
    <main className="min-h-[calc(100vh-33.5px)] flex flex-col items-center">
      <Suspense fallback={<Spinner />}>
        <Title locale={params.locale} />
      </Suspense>

      {customBoard.hideAllFilters ? null : (
        <Suspense fallback={<FiltersSkeleton />}>
          <FiltersSectionContainer
            filtersPromise={filtersPromise}
            locale={params.locale}
          />
        </Suspense>
      )}

      <Suspense fallback={<Spinner />}>
        {await JobTable({
          params,
          jobsPromise,
          limit: JOBS_LIMIT,
        })}
      </Suspense>
    </main>
  );
}
