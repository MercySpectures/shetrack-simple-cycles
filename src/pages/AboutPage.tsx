
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Github, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

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
        <p className="text-muted-foreground mt-1 max-w-md mx-auto">
          Your personal period tracking companion designed with care
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="font-medium">What is SheTrack?</CardTitle>
            <CardDescription>The story behind our app</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm leading-relaxed">
              SheTrack is a modern period tracking app designed to help you understand your cycle better. 
              Our goal is to provide a simple, intuitive tool that helps you track your period, predict your fertile 
              window, and manage your health with ease.
            </p>
            <p className="text-sm leading-relaxed">
              We understand that every cycle is unique, which is why SheTrack learns from your data to provide
              increasingly accurate predictions over time. Your privacy is our priority - all your data 
              remains on your device and is never shared without your consent.
            </p>
            <p className="text-sm leading-relaxed">
              Whether you're tracking your period, planning for pregnancy, or simply want to be more
              aware of your body's natural rhythm, SheTrack is here to support your journey.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="font-medium">Meet the Developer</CardTitle>
            <CardDescription>The person behind SheTrack</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
              <div className="rounded-full bg-gradient-to-br from-primary to-secondary h-24 w-24 flex items-center justify-center text-white text-2xl font-bold">
                AS
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">Aman Shrivas</h3>
                  <p className="text-muted-foreground text-sm">Full Stack Developer</p>
                </div>
                
                <p className="text-sm leading-relaxed">
                  Passionate developer focused on creating thoughtful applications that improve people's lives.
                  SheTrack is built with privacy, accuracy, and user experience in mind.
                </p>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    asChild
                  >
                    <a href="https://www.linkedin.com/in/aman-shrivas-97407014a/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-3.5 w-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    asChild
                  >
                    <a href="https://www.instagram.com/huntethan144/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-3.5 w-3.5" />
                      <span>Instagram</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    asChild
                  >
                    <a href="mailto:mercycode144@gmail.com">
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </a>
                  </Button>
                </div>
                
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>+91 7693949108</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Indore, MP</span>
                  </div>
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
