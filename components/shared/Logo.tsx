import Image from "next/image";
import logoImg from "@/assets/images/logo.png";

const Logo = () => {
  return (
    <div>
      <div className="mb-1 flex justify-center w-full">
        <Image
          src={logoImg}
          alt="logo"
          className="w-[35px] h-[40px] md:w-[70px] md:h-[80px]"
        />
      </div>
      <p className="flex items-center text-center justify-center leading-none">
        <span className="text-[1.7rem] md:text-[1.5rem] font-extrabold bg-gradient-to-r from-[#4F8EF7] to-[#7B3FE4] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
          Skill
        </span>
        <span className="text-[1.7rem] md:text-[1.5rem] font-extrabold bg-gradient-to-r from-[#FF8C00] to-[#F5C518] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
          Shelf
        </span>
      </p>
    </div>
  );
};

export default Logo;
