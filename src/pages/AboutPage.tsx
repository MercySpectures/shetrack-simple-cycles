
import { HeartPulse, Info, Github, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { usePeriodTracking } from "@/lib/period-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  const { userPreferences } = usePeriodTracking();

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
        <p className="text-muted-foreground">
          Hi {userPreferences.userName || "there"}, welcome to your period tracking companion ✨
        </p>
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
              <span>Track symptoms and add multiple notes throughout your cycle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Reminders for upcoming periods and fertile windows</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>3D data visualization to better understand your patterns</span>
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
        
        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 font-poppins text-center">
              Developer
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">AS</span>
              </div>
              <h3 className="text-xl font-bold">Aman Shrivas</h3>
              <p className="text-muted-foreground mb-4">Full Stack Developer</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-4">
                <a 
                  href="https://www.linkedin.com/in/aman-shrivas-97407014a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/huntethan144/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <span>Instagram</span>
                </a>
                
                <div className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-sm">mercycode144@gmail.com</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                  <Phone className="h-5 w-5 text-cyan-600" />
                  <span>+91 7693949108</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors sm:col-span-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span>Indore, MP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
