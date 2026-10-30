import Image from "next/image";
import logoImg from "@/assets/images/logo.png";

const Logo = () => {
    return (
        <div className="mb-6 flex justify-center w-full">
            <Image src={logoImg} alt="logo" className="w-[40px] h-[45px] md:w-[105px] md:h-[110px]" />
        </div>
    );
};

export default Logo;