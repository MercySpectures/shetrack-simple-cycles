
import { HeartPulse, Info } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <HeartPulse className="h-7 w-7 text-primary-foreground relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent ml-1">
            About SheTrack
          </span>
        </h1>
        <p className="text-muted-foreground">Simple period tracking, just for you ✨</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <Info className="h-5 w-5 text-primary" />
            Our Mission
          </h2>
          <p className="mb-4 text-muted-foreground">
            SheTrack was designed with one simple goal: to provide an intuitive, private, 
            and comprehensive period tracking solution that respects your privacy and helps 
            you understand your body better.
          </p>
          <p className="text-muted-foreground">
            We believe that period tracking should be simple, accessible, and empowering, 
            giving you insights about your cycle without overwhelming you with complexity.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            Features
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Simple calendar visualization of your cycle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Personalized cycle predictions based on your history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Track symptoms and notes throughout your cycle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Reminders for upcoming periods and fertile windows</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Data visualization to better understand your patterns</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-poppins">
            <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary-foreground rounded-full mr-1"></span>
            Privacy & Data
          </h2>
          <p className="mb-4 text-muted-foreground">
            Your privacy is our top priority. SheTrack stores all your data locally on your device,
            giving you complete control over your information. We believe period tracking should be 
            a private matter, and we've designed our app with this principle in mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
