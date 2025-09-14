import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, ArrowRight, Users, MapPin, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Patients', color: 'text-primary' },
    { icon: MapPin, value: '500+', label: 'Expert Doctors', color: 'text-secondary' },
    { icon: Clock, value: '50+', label: 'Cities Covered', color: 'text-accent' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-light to-background overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Healthcare professional helping patient"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 fade-up">
              Your Health, 
              <span className="text-gradient-primary"> Our Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 fade-up-delay-1">
              Connect with India's top doctors and physiotherapists for personalized care,
              right from your home or at our clinics. Experience healthcare like never before.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto lg:mx-0 mb-8 fade-up-delay-2">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, conditions, treatments..."
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 focus:border-primary shadow-soft"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 fade-up-delay-3">
              <Button className="btn-primary px-8 py-4 text-lg">
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-muted">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 fade-up-delay-3">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color} mr-2`} />
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="relative lg:block hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl transform rotate-6"></div>
              <img
                src={heroImage}
                alt="Professional healthcare consultation"
                className="relative z-10 w-full h-auto rounded-3xl shadow-card hover-lift"
              />
              
              {/* Floating Card */}
              <div className="absolute top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-card animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">Live Consultation</p>
                    <p className="text-xs text-muted-foreground">24/7 Available</p>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="absolute bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-card animate-float" style={{animationDelay: '1s'}}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-primary">4.9★</div>
                  <p className="text-xs text-muted-foreground">Patient Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;