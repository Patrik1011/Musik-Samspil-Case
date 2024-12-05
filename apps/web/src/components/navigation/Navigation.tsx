import { Container } from "../Container";
import { NavLinks } from "./NavLinks";
import { Headline } from "../Headline";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <header className="z-20">
      <nav className="shadow-md">
        <Container className="relative flex justify-between py-5 ">
          <div className="relative flex items-center w-full justify-between">
            <div>
              <Link to="/home">
                <Headline title="Musik Samspil" textColor="text-custom-red" />
                <p className="text-steel-blue text-[10px]">
                  Skabt af DAOS - Dansk Amatørorkester Samvirke
                </p>
              </Link>
            </div>
            <div className="hidden lg:flex lg:gap-5">
              <NavLinks isMobile={false} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <NavLinks isMobile={true} />
          </div>
        </Container>
      </nav>
    </header>
  );
};
