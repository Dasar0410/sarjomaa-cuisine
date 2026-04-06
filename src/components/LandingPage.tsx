import { UserAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import landingImage from '../assets/undraw_cooking_j2pu.svg';
import { useNavigate } from "react-router-dom";

function LandingPage() {

    const {session, loading} = UserAuth()
    const navigate = useNavigate();
    const fullName = session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.full_name || "Gjest"
    const name = loading ? "" : fullName.split(" ")[0]
  return (
    <section className= "relative text-white flex flex-col bg-brand-background cursor-default">
        <div className="flex-1 max-w-7xl mx-auto px-4 pt-10 lg:pt-20 flex flex-col lg:flex-row items-center">

            {/* Left side: text */}
            <div className="w-full lg:w-1/2 space-y-6 lg:text-start text-center">
                <h1 className="md:text-7xl text-6xl font-bold  text-brand-foreground">
                    Hei <span className="text-brand-primary">{name}</span>,

                </h1>
                <p className="text-4xl ml-2 text-brand-foreground/70">
                Gains starter på kjøkkenet!
                </p>
                <Button variant="secondary" size="lg" className="m-2 mt-4 text-xl px-8 py-6"
                    onClick={() => navigate('/oppskrifter')}
                >
                    Se alle oppskrifter
                </Button>

            </div>
            <div className="hidden lg:flex md:w-1/2 items-center justify-center relative mt-8 md:mt-0 2xl:w-1/2">
            <img src={landingImage} alt="Cooking illustration" className="w-3/5 h-auto" />

            </div>
         </div>

         {/* Pixel Art Transition */}
         <div className="w-full h-12 overflow-hidden mt-4">
            <div className="flex flex-col w-full h-full">
                <div className="flex-1 bg-brand-secondary/50" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-primary/70" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-primary" style={{imageRendering: 'pixelated'}} />
            </div>
         </div>
</section>
  );
}

export default LandingPage;