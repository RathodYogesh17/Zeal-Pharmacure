import type { IPaginationParams } from "../types/common.types";



const buildPagination = (page: number, limit: number): IPaginationParams => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  return {  page: safePage, limit: safeLimit,  skip: (safePage - 1) * safeLimit, };
};

const buildSearchFilter = (search?: string) => {
  if (!search || !search.trim()) {  return undefined;}

  return {
    $or: [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
      { phone: { $regex: search.trim(), $options: "i" } },
    ],
  };
};

export { buildPagination, buildSearchFilter,};
