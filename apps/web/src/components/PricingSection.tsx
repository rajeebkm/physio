import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "₹299",
      period: "per consultation",
      description: "Perfect for occasional healthcare needs",
      features: [
        "Online consultations",
        "Basic health records",
        "Email support",
        "Mobile app access"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Premium",
      price: "₹999",
      period: "per month",
      description: "Most popular for regular healthcare",
      features: [
        "Unlimited consultations",
        "Home visits included",
        "Priority support",
        "Advanced health tracking",
        "Family plan (up to 4 members)",
        "Prescription management"
      ],
      popular: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For organizations and large families",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Custom integrations",
        "Bulk appointment scheduling",
        "Advanced analytics",
        "24/7 phone support"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
            Choose the plan that works best for you. No hidden fees, no surprises.
            All plans include our core healthcare features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card border-2 rounded-3xl p-8 transition-all duration-300 hover-lift fade-up ${
                plan.popular
                  ? 'border-primary shadow-card scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 fade-up-delay-3">
          <p className="text-muted-foreground mb-4">
            All plans include our 30-day money-back guarantee
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Check className="w-4 h-4 text-success mr-2" />
              No setup fees
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 text-success mr-2" />
              Cancel anytime
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 text-success mr-2" />
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;