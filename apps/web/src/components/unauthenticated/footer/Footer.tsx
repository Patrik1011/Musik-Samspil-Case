import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faSquareFacebook,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";

import { StyledLink } from "./components/StyledLink";
import logoDaos from "../../../assets/logo-daos.png";
import paleImage from "../../../assets/images-svg/pale.svg";
import { Headline } from "../../Headline";

export const Footer = () => {
  return (
    <footer className="bg-custom-red">
      <div className="container px-4 pt-6 pb-3 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pb-6 sm:gap-y-10 lg:grid-cols-3">
          <div className="flex flex-col items-start md:items-center">
            <div className="space-y-6 md:space-y-8">
              <Headline title="musik samspil" textColor="text-white" className="uppercase" />
              <div className="flex flex-col md:flex-row md:space-x-8">
                <StyledLink href="/posts" label="See posts" />
                <StyledLink href="/profile" label="Profile" />
              </div>
              <div className="text-white space-x-3 text-xl">
                <FontAwesomeIcon icon={faSquareInstagram} />
                <FontAwesomeIcon icon={faSquareFacebook} />
                <FontAwesomeIcon icon={faLinkedin} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img src={paleImage} alt="pale" />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2 w-[344px] h-[99px] py-2.5 bg-white rounded-lg shadow-custom">
              <p className="text-black uppercase text-xs">bragt til dig af</p>
              <img src={logoDaos} alt="logo daos" width="189" height="52" />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-white">Privatlivspolitik</p>
        </div>
      </div>
    </footer>
  );
};
