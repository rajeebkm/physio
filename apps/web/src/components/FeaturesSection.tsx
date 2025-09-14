import { Phone, MapPin, Clock, Shield, Heart, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Phone,
      title: "Online Consultations",
      description: "Connect with doctors instantly through secure video calls from anywhere in India.",
      color: "text-primary",
      bgColor: "bg-primary-light"
    },
    {
      icon: MapPin,
      title: "Home Visits",
      description: "Get physiotherapy and medical care delivered right to your doorstep by certified professionals.",
      color: "text-secondary",
      bgColor: "bg-secondary-light"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access healthcare services round the clock, whenever you need them most.",
      color: "text-accent",
      bgColor: "bg-accent-light"
    },
    {
      icon: Shield,
      title: "Verified Doctors",
      description: "All our healthcare providers are thoroughly verified, licensed, and background-checked.",
      color: "text-success",
      bgColor: "bg-green-50"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Receive customized treatment plans tailored to your specific health needs and goals.",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Access to India's top doctors and physiotherapists in every medical specialty.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
            Why Choose 
            <span className="text-gradient-primary"> PhysioCare?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
            We provide comprehensive healthcare solutions that make quality medical care
            accessible, convenient, and affordable for everyone across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-8 hover-lift fade-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;