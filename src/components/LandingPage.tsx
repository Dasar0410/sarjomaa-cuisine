import { UserAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import landingImage from '../assets/undraw_cooking_j2pu.svg';

function LandingPage() {

    const {session} = UserAuth()
    const name = session?.user?.user_metadata?.display_name || "Gjest"
  return (
    <section className= "relative min-h-screen text-white flex flex-col bg-brand-background cursor-default">
        <div className="flex-1 max-w-7xl mx-auto px-4 pt-10 lg:pt-32 flex flex-col lg:flex-row items-center">

            {/* Left side: text */}
            <div className="w-full lg:w-1/2 space-y-6 lg:text-start text-center">
                <h1 className="md:text-8xl text-5xl font-bold md:leading-tight leading-tight text-brand-foreground">
                    Hei <span className="text-brand-primary">{name}</span>,
                    <br/><span className="text-brand-primary/70">Finn frem panna!</span>
                </h1>
                <p className="text-3xl ml-2 text-brand-foreground/70">
                    Oppdag deilige oppskrifter
                </p>
                <a href="#recipes">
                <Button variant="secondary" size="lg" className="m-2 mt-4 text-xl px-8 py-6">
                    Utforsk Oppskrifter
                </Button>
                </a>

            </div>
            <div className="md:w-1/2 flex items-center justify-center relative mt-8 md:mt-0 2xl:w-1/2">
            <img src={landingImage} alt="Cooking illustration" className="w-full h-auto" />
            
            </div>
         </div>

         {/* Pixel Art Transition */}
         <div className="w-full h-32 overflow-hidden mt-8 lg:mt-0">
            {/* Smooth pixelated gradient using brand colors */}
            <div className="flex flex-col w-full h-full">
                {/* Vertical gradient bars - only separated vertically */}
                <div className="flex-1 bg-brand-background/40" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-background/50" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-secondary/40" style={{imageRendering: 'pixelated'}} />
                <div className="flex-1 bg-brand-secondary/50" style={{imageRendering: 'pixelated'}} />
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