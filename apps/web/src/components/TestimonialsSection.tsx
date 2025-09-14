import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer, Mumbai",
      content: "The home physiotherapy service was amazing. The therapist was professional and helped me recover quickly from my back pain. I can now work comfortably without any discomfort.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner, Delhi",
      content: "Online consultation with Dr. Singh was very convenient. I got expert advice without leaving my home, and the follow-up care was exceptional. Highly recommend PhysioCare.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Anita Patel",
      role: "Teacher, Bangalore",
      content: "The platform is easy to use and the doctors are very knowledgeable. The personalized treatment plan helped me recover from my knee injury faster than expected.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Dr. Amit Verma",
      role: "Healthcare Partner",
      content: "As a practicing physiotherapist, I love how PhysioCare connects me with patients who need care. The platform is intuitive and the support team is always helpful.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Sunita Reddy",
      role: "Senior Citizen, Chennai",
      content: "At my age, visiting clinics was becoming difficult. PhysioCare's home visit service has been a blessing. The care I receive is top-notch and very convenient.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Vikram Singh",
      role: "Athlete, Pune",
      content: "Being an athlete, I need specialized care for sports injuries. PhysioCare connected me with experts who understand sports medicine. My recovery was faster than ever.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
            What Our <span className="text-gradient-primary">Patients</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
            Don't just take our word for it. Here's what our patients and healthcare professionals
            have to say about their experience with PhysioCare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-8 hover-lift fade-up relative"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary/20">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-foreground font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto fade-up-delay-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-primary mb-2">4.9/5</div>
              <div className="text-muted-foreground text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-secondary mb-2">98%</div>
              <div className="text-muted-foreground text-sm">Patient Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">15K+</div>
              <div className="text-muted-foreground text-sm">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;