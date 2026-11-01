
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { logout, setUser } from "@/redux/features/user/userSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface DecodedToken {
  id: string;
  role: string; 
  exp: number;
}

const profile = [
  {
    name: "Blog",
    link: "/blog",
  },

  {
    name: "Payment",
    link: "/payment",
  },
];

const useAuthUser = () => {
  const dispatch = useDispatch();
  const [temp, setTemp] = useState<any | null>(null);
  const [profileLinks, setProfileLinks] = useState<
    {
      name: string;
      link: string;
    }[]
  >(profile);
  const navigate = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const decodedUser = jwtDecode<DecodedToken>(token);
        console.log(decodedUser);
        setTemp(decodedUser);
        if (decodedUser.role === "INDIVIDUAL") {
          setProfileLinks([
            {
              name: "Profile",
              link: "/profile",
            },
            {
              name: "Project",
              link: "/my-project",
            },
            {
              name: "Messaging",
              link: "/messaging",
            },

            {
              name: "Consultation",
              link: "/my-consultation",
            },
            {
              name: "Favorite",
              link: "/favorite",
            },
            ...profile,
          ]);
        }
        if (decodedUser.role === "COMPANY") {
          setProfileLinks([
            {
              name: "Company",
              link: "/company",
            },
            {
              name: "Job List",
              link: "/job-list",
            },
            ...profile,
          ]);
        }
        if (decoded.exp * 1000 < Date.now()) {

          Cookies.remove("token");
          return;
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const { data, error, isLoading } = useGetMeQuery({});

  console.log(data);
  useEffect(() => {
    if (data?.success) {
      dispatch(
        setUser({
          user: data.data,
        })
      );
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout());
    navigate.push("/signIn");
  };
  return {
    user: data?.data || temp,
    isLoading,
    error,
    handleLogout,
    profileLinks,
  };
};

export default useAuthUser;
