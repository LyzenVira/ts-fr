import Link from "next/link";
import Image from "next/image";

import Logo from "@/images/logo.svg";
import Telegram from "@/images/social-networks/telegram.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-[40px] pt-[40px] ">
      <Link href="/" className="px-[20px]">
        <Image
          src={Logo}
          alt="Logo"
          width={380}
          height={80}
          className="w-[380px] h-[80px]"
          loading="lazy"
        />
      </Link>

      <div className="bg-pearl w-[100%] py-[20px] text-center text-silver min-h-[60px] px-[20px] leading-[25px] flex flex-col items-center gap-[15px] md:relative">
        <Link
          href="https://t.me/Montre_dArt_bot"
          className="md:absolute md:right-[20px] md:top-[50%] md:translate-y-[-50%] flex items-center gap-[8px] bg-blue-500 text-white px-[8px] md:px-[15px] py-[8px] rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          target="_blank"
        >
          <Image src={Telegram} alt="telegram" className="w-[15px] h-[15px]" />
          <p className="text-[14px]">Підтримка</p>
        </Link>
        <p className="text-center">
          © Авторські права {currentYear} Montre d'Art - Усі права захищені.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
