
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Github, Linkedin, Instagram, Mail, Phone, MapPin, Check, Shield, Calendar, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-center font-poppins flex items-center justify-center gap-2 page-heading">
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-pink-200 rounded-full animate-pulse opacity-50" />
            <HeartPulse className="h-7 w-7 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ml-1">
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

        {/* Features Section */}
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="font-medium">Key Features</CardTitle>
            <CardDescription>What makes SheTrack special</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Cycle Tracking</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track your period dates, flow intensity, and symptoms in a simple calendar view
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Personalized Predictions</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Get accurate predictions of your upcoming periods and fertile windows based on your unique patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Private & Secure</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your data is stored locally on your device with the option to export for backup
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Intuitive Reminders</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Set customizable reminders for your period start dates, fertile windows, and medication
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Section */}
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="font-medium">Privacy Policy</CardTitle>
            <CardDescription>How we protect your data</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed">
                At SheTrack, we take your privacy seriously. Our commitment to you:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <p>All your period tracking data is stored locally on your device.</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <p>We do not collect or share your personal health information with third parties.</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <p>You maintain full control over your data with backup and export options.</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <p>SheTrack does not use your data for advertising or marketing purposes.</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <p>We use industry-standard security measures to protect any data you choose to backup.</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                For more detailed information about our privacy practices, please contact us directly.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardTitle className="font-medium">Meet the Developer</CardTitle>
            <CardDescription>The person behind SheTrack</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
              <div className="overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary h-24 w-24 flex items-center justify-center">
                <img 
                  src="/developer-photo.jpg" 
                  alt="Aman Shrivas"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>';
                    target.classList.add('p-2');
                  }}
                />
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
