export type SearchParamValue = string | string[];

export type FilenameSearchParams = {
  filename?: SearchParamValue;
};

export type SearchParamsPageProps<TSearchParams> = {
  searchParams: Promise<TSearchParams>;
};
