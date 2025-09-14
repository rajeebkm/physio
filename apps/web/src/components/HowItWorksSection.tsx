import { UserPlus, Search, Heart } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      icon: UserPlus,
      title: "Sign Up & Profile",
      description: "Create your account and complete your health profile in just a few minutes.",
      color: "bg-primary",
    },
    {
      step: "2",
      icon: Search,
      title: "Find & Book",
      description: "Search for doctors or physiotherapists and book appointments that fit your schedule.",
      color: "bg-secondary",
    },
    {
      step: "3",
      icon: Heart,
      title: "Get Care",
      description: "Attend your consultation online or receive home visits from qualified professionals.",
      color: "bg-accent",
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
            Getting started with PhysioCare is simple and straightforward.
            Follow these easy steps to begin your healthcare journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative fade-up" style={{animationDelay: `${index * 0.2}s`}}>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 transform translate-x-1/2 z-0"></div>
              )}
              
              {/* Step Circle */}
              <div className="relative z-10 mb-6">
                <div className={`w-16 h-16 ${step.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg relative`}>
                  {step.step}
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-glow"></div>
                </div>
                <div className="w-12 h-12 bg-card border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto -mt-10 relative z-10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 fade-up-delay-3">
          <div className="inline-flex items-center space-x-2 bg-card border border-border rounded-full px-6 py-3 shadow-soft">
            <span className="text-muted-foreground">Ready to get started?</span>
            <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:shadow-glow transition-all duration-300">
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;