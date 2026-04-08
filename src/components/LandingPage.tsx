import { UserAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import landingImage from '../assets/undraw_cooking_j2pu.svg';
import { useNavigate } from "react-router-dom";

function LandingPage() {

    const {session, loading} = UserAuth()
    const fullName = session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.full_name || "Gjest"
    const name = loading ? "" : fullName.split(" ")[0]
    const navigate = useNavigate();
  return (
    <section className= "relative  text-white flex flex-col bg-brand-background cursor-default">
        <div className="flex-1 max-w-7xl mx-auto px-4 pt-10  flex flex-col items-center">

            {/* Left side: text */}
            <div className="w-full space-y-4 text-center md:mb-8">
                <h1 className="md:text-6xl text-5xl font-bold md:leading-tight leading-tight text-brand-foreground">
                Hei <span className="text-brand-primary">{name}</span>,

                </h1>
                <p className="text-3xl ml-2 text-brand-foreground/70">
                    Oppdag haugevis av deilige oppskrifter
                </p>
                <Button variant="secondary" 
                        size="lg" 
                        onClick={() => navigate('/oppskrifter')}
                        className="text-lg px-10 py-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mt-6"
                    >
                        Se flere oppskrifter →
                    </Button>

            </div>

         </div>

         {/* Pixel Art Transition */}
         <div className="w-full h-16 overflow-hidden mt-8 lg:mt-0">
            {/* Smooth pixelated gradient using brand colors */}
            <div className="flex flex-col w-full h-full">
                {/* Vertical gradient bars - only separated vertically */}

                <div className="flex-1 bg-brand-secondary/60" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-primary/50" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-primary/70" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-primary" style={{imageRendering: 'pixelated'}} />
            </div>
         </div>
</section>
  );
}

export default LandingPage;