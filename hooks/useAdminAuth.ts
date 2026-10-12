import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";

export const useAdminAuth = () => {
  const { data: userData, isLoading, isError } = useGetMeQuery({});
  
  const isAuthorized = !isLoading && !isError && userData?.data?.role === 'SUPER_ADMIN';
  
  return {
    userData,
    isLoading,
    isError,
    isAuthorized
  };
};
